package main

import (
	"bufio"
	"bytes"
	"context"
	_ "embed"
	"errors"
	"fmt"
	"io"
	"log"
	"os/exec"
	"strings"
	"text/template"
	"time"

	"golang.org/x/crypto/ssh"
)

var (
	//go:embed scripts/startup.sh.tmpl
	startShTemplate string
	//go:embed scripts/query.sh.tmpl
	queryShTemplate string
	//go:embed scripts/clean.sh.tmpl
	cleanShTmpleate string

	//go:embed scripts/agent.sh
	agentSh string
	//go:embed scripts/agent_lib.sh
	libSh string
	//go:embed scripts/agent_index.sh
	indexSh string
	//go:embed scripts/agent_search.sh
	searchSh string
)

type SshConnConfig struct {
}

type SshConn struct {
	*CommonConn
	client  *ssh.Client
	session *ssh.Session
}

func NewSshConn(pathPrefix string, url ParsedUrl) (*SshConn, error) {
	client, err := ssh.Dial("tcp", url.host, &ssh.ClientConfig{
		User: url.username,
		Auth: []ssh.AuthMethod{
			ssh.Password(url.password),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
		Timeout:         5 * time.Second,
	})
	if err != nil {
		return nil, err
	}

	session, err := client.NewSession()
	if err != nil {
		return nil, err
	}

	stdin, err := session.StdinPipe()
	if err != nil {
		return nil, err
	}

	stdout, err := session.StdoutPipe()
	if err != nil {
		return nil, err
	}

	stderr, err := session.StderrPipe()
	if err != nil {
		return nil, err
	}

	if err := session.Start("/bin/sh"); err != nil {
		return nil, err
	}

	return &SshConn{
		CommonConn: NewCommonConn(pathPrefix, url, stdin, stdout, stderr),
		client:     client,
		session:    session,
	}, nil
}

func shellQuote(s string) string {
	return fmt.Sprintf("'%s'", strings.Replace(s, "'", "'\"'\"'", -1))
}

func (conn *SshConn) Close() {
	conn.session.Close()
	conn.client.Close()
}

type CmdConn struct {
	*CommonConn
	cmd            *exec.Cmd
	stdout, stderr io.ReadCloser
}

func NewCmdConn(prefixPath string, url ParsedUrl) (*CmdConn, error) {
	cmd := exec.Command("/bin/sh")

	stdin, err := cmd.StdinPipe()
	if err != nil {
		return nil, err
	}

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return nil, err
	}

	stderr, err := cmd.StderrPipe()
	if err != nil {
		return nil, err
	}

	if err := cmd.Start(); err != nil {
		return nil, err
	}

	return &CmdConn{
		CommonConn: NewCommonConn(prefixPath, url, stdin, stdout, stderr),
		cmd:        cmd,
	}, nil
}

func (conn *CmdConn) Close() {
	if conn.stdin != nil {
		conn.stdin.Close()
	}
	if conn.stdout != nil {
		conn.stdout.Close()
	}
	if conn.stderr != nil {
		conn.stderr.Close()
	}
	if conn.cmd != nil {
		conn.cmd.Wait()
	}
}

type Conn interface {
	Url() ParsedUrl
	Start(context.Context) (*MessageCompose, error)
	Query(context.Context, QueryParam) (*MessageCompose, error)
	Clean(context.Context) (*MessageCompose, error)
	Close()
}

type CommonConn struct {
	prefixPath string
	indexFile  string
	url        ParsedUrl

	stdin                io.WriteCloser
	stdout, stderr       io.Reader
	stdoutBuf, stderrBuf *bufio.Reader

	exts   map[string]string
	parser *LogParser
}

func NewCommonConn(prefixPath string, url ParsedUrl, stdin io.WriteCloser, stdout, stderr io.Reader) *CommonConn {
	stdoutBuf := bufio.NewReader(stdout)
	stderrBuf := bufio.NewReader(stderr)

	return &CommonConn{
		prefixPath: prefixPath,
		indexFile:  fmt.Sprintf("%s-index.log", url.LogName()),
		url:        url,
		stdin:      stdin,
		stdout:     stdout,
		stderr:     stderr,
		stdoutBuf:  stdoutBuf,
		stderrBuf:  stderrBuf,
		exts:       make(map[string]string),
		parser:     &LogParser{},
	}
}

func (conn *CommonConn) Url() ParsedUrl {
	return conn.url
}

func (conn *CommonConn) Start(ctx context.Context) (*MessageCompose, error) {
	params := map[string]any{
		"PrefixPath":    conn.prefixPath,
		"AgentPath":     "agent.sh",
		"AgentContent":  agentSh,
		"LibPath":       "agent_lib.sh",
		"LibContent":    libSh,
		"IndexPath":     "agent_index.sh",
		"IndexContent":  indexSh,
		"SearchPath":    "agent_search.sh",
		"SearchContent": searchSh,
		"IndexFile":     conn.indexFile,
		"LogFile":       conn.url.log,
	}
	bs, err := conn.template(startShTemplate, params)
	if err != nil {
		return nil, err
	}
	if _, err = conn.stdin.Write(bs); err != nil {
		return nil, err
	}

	return conn.receive(ctx)
}

func (conn *CommonConn) Query(ctx context.Context, param QueryParam) (*MessageCompose, error) {
	params := map[string]any{
		"AgentPath":    fmt.Sprintf("%s/%s", conn.prefixPath, "agent.sh"),
		"IndexFile":    fmt.Sprintf("%s/%s", conn.prefixPath, conn.indexFile),
		"RefreshIndex": param.Refresh,
		"MaxNumLines":  param.MaxNumLines,
		"LogFile":      conn.url.log,
		"FromExists":   param.FromStr() != "",
		"From":         shellQuote(param.FromStr()),
		"ToExists":     param.ToStr() != "",
		"To":           shellQuote(param.ToStr()),
		"Pattern":      shellQuote(param.Pattern),
		"HasLineUtil":  param.LineUtil != 0,
		"LineUtil":     param.LineUtil,
	}
	bs, err := conn.template(queryShTemplate, params)
	if err != nil {
		return nil, err
	}
	if _, err = conn.stdin.Write(bs); err != nil {
		return nil, err
	}

	return conn.receive(ctx)
}

func (conn *CommonConn) Clean(ctx context.Context) (*MessageCompose, error) {
	params := map[string]any{
		"PrefixPath": conn.prefixPath,
	}
	bs, err := conn.template(cleanShTmpleate, params)
	if err != nil {
		return nil, err
	}

	if _, err = conn.stdin.Write(bs); err != nil {
		return nil, err
	}

	return conn.receive(ctx)
}

func (conn *CommonConn) template(tmpl string, params map[string]any) ([]byte, error) {
	t := template.Must(template.New("bootstrap").Parse(tmpl))
	var buf bytes.Buffer

	err := t.Execute(&buf, params)
	if err != nil {
		return nil, err
	}

	bs := buf.Bytes()
	if bs[len(bs)-1] != '\n' {
		bs = append(bs, '\n')
	}

	return bs, nil
}

func (conn *CommonConn) receive(ctx context.Context) (*MessageCompose, error) {
	var stdoutEnd, stderrEnd bool
	messageCompose := &MessageCompose{}

	stdoutChan := conn.StdoutReceive(ctx)
	stderrChan := conn.StderrReceive(ctx)

Loop:
	for {
		select {
		case retAndErr, ok := <-stdoutChan:
			if !ok {
				continue
			}
			if retAndErr.Err != nil {
				return nil, retAndErr.Err
			}

			switch ret := retAndErr.Ret.(type) {
			case *BeginRet:

			case *EndRet:
				stdoutEnd = true
			case *ErrRet:
				messageCompose.Errs = append(messageCompose.Errs, errors.New(ret.Message))
			case *DataRet:
				log := &Log{
					Num:     ret.CurNR,
					Message: ret.Message,
				}
				conn.parser.Parse(log)
				messageCompose.Logs = append(messageCompose.Logs, log)
			case *StatRet:
				messageCompose.Stats = append(messageCompose.Stats, Stat{
					Time:  ret.Time.Unix(),
					Count: ret.Count,
				})
			case *ExtRet:
				conn.exts[ret.Key] = ret.Value
			case *DebugRet:
				log.Println("[DEBUG-stdout]", ret.Message)
			case *UnknownRet:
				log.Println("[UNKNOWN]", ret)
			default:
				// ignored
				log.Println("[ERROR] unknown ret", ret)
			}

			if stderrEnd && stdoutEnd {
				break Loop
			}

		case retAndErr, ok := <-stderrChan:
			if !ok {
				continue
			}
			if retAndErr.Err != nil {
				return nil, retAndErr.Err
			}

			switch ret := retAndErr.Ret.(type) {
			case *BeginRet:

			case *ErrRet:
				messageCompose.Errs = append(messageCompose.Errs, errors.New(ret.Message))
			case *DebugRet:
				log.Println("[DEBUG-stderr]", ret.Message)
			case *EndRet:
				stderrEnd = true
			case *UnknownRet:
				log.Println("[UNKNOWN]", ret)
			default:
				// ignored
				log.Println("[ERROR] unknown ret", ret)
			}

			if stderrEnd && stdoutEnd {
				break Loop
			}
		}
	}

	return messageCompose, nil
}

type RetAndErr struct {
	Ret Ret
	Err error
}

func (conn *CommonConn) StdoutReceive(ctx context.Context) chan RetAndErr {
	retChan := make(chan RetAndErr, 10)

	go func() {
		defer close(retChan)
		for {
			line, err := conn.stdoutBuf.ReadString('\n')
			if err != nil || line == "" {
				// retChan <- RetAndErr{Err: err}
				// break
				continue
			}
			if *debug {
				fmt.Print("[STDOUT]", line)
			}

			line = strings.TrimRight(line, "\r\n")

			var ret Ret
			switch line[0] {
			case 'A':
				ret = &BeginRet{}
				line = line[1:]
			case 'Z':
				ret = &EndRet{}
				err = ret.Decode([]byte(line[1:]))
				retChan <- RetAndErr{Err: err, Ret: ret}
				return
			case 'E':
				ret = &ErrRet{}
				line = line[1:]
			case 'D':
				ret = &DataRet{}
				line = line[1:]
			case 'T':
				ret = &StatRet{}
				line = line[1:]
			case 'X':
				ret = &ExtRet{}
				line = line[1:]
			case 'N':
				ret = &DebugRet{}
				line = line[1:]
			default:
				ret = &UnknownRet{}
			}

			err = ret.Decode([]byte(line))

			select {
			case <-ctx.Done():
				return
			case retChan <- RetAndErr{Err: err, Ret: ret}:
			}

		}
	}()

	return retChan
}

func (conn *CommonConn) StderrReceive(ctx context.Context) chan RetAndErr {
	retChan := make(chan RetAndErr, 10)

	go func() {
		defer close(retChan)
		for {
			line, err := conn.stderrBuf.ReadString('\n')
			if err != nil || line == "" {
				// retChan <- RetAndErr{Err: err}
				// break
				continue
			}
			if *debug {
				fmt.Print("[STDERR]", line)
			}

			line = strings.TrimRight(line, "\r\n")

			var ret Ret
			switch line[0] {
			case 'A':
				ret = &BeginRet{}
				line = line[1:]
			case 'Z':
				ret = &EndRet{}
				err = ret.Decode([]byte(line[1:]))
				retChan <- RetAndErr{Err: err, Ret: ret}
				return
			case 'E':
				ret = &ErrRet{}
				line = line[1:]
			case 'D':
				ret = &DataRet{}
				line = line[1:]
			case 'N':
				ret = &DebugRet{}
				line = line[1:]
			default:
				ret = &UnknownRet{}
			}

			err = ret.Decode([]byte(line))
			select {
			case <-ctx.Done():
				return
			case retChan <- RetAndErr{Err: err, Ret: ret}:
			}

		}
	}()

	return retChan
}
