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
	prefixPath string
	url        ParsedUrl

	client  *ssh.Client
	session *ssh.Session

	stdin                io.WriteCloser
	stdout, stderr       io.Reader
	stdoutBuf, stderrBuf *bufio.Reader

	exts map[string]string
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

	stdoutBuf := bufio.NewReader(stdout)
	stderrBuf := bufio.NewReader(stderr)

	return &SshConn{
		prefixPath: pathPrefix,
		url:        url,
		client:     client,
		session:    session,
		stdin:      stdin,
		stdout:     stdout,
		stderr:     stderr,
		stdoutBuf:  stdoutBuf,
		stderrBuf:  stderrBuf,
		exts:       make(map[string]string),
	}, nil
}

func (conn *SshConn) Start() (*MessageCompose, error) {
	bs, err := conn.start()
	if err != nil {
		return nil, err
	}
	if _, err = conn.stdin.Write(bs); err != nil {
		return nil, err
	}

	return conn.receive()
}

func (conn *SshConn) start() ([]byte, error) {
	// 必须要使用 text/template
	t := template.Must(template.New("bootstrap").Parse(startShTemplate))
	var buf bytes.Buffer

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
		"IndexFile":     "index.log",
		"LogFile":       conn.url.log,
	}
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

func (conn *SshConn) Query(param QueryParam) (*MessageCompose, error) {
	bs, err := conn.query(param)
	if err != nil {
		return nil, err
	}
	if _, err = conn.stdin.Write(bs); err != nil {
		return nil, err
	}

	return conn.receive()
}

func (conn *SshConn) query(param QueryParam) ([]byte, error) {
	// 必须要使用 text/template
	t := template.Must(template.New("bootstrap").Parse(queryShTemplate))
	var buf bytes.Buffer

	params := map[string]any{
		"AgentPath":   fmt.Sprintf("%s/%s", conn.prefixPath, "agent.sh"),
		"IndexFile":   fmt.Sprintf("%s/%s", conn.prefixPath, "index.log"),
		"MaxNumLines": param.MaxNumLines,
		"LogFile":     conn.url.log,
		"FromExists":  param.FromStr() != "",
		"From":        shellQuote(param.FromStr()),
		"ToExists":    param.ToStr() != "",
		"To":          shellQuote(param.ToStr()),
		"Pattern":     shellQuote(param.Pattern),
		"HasLineUtil": param.LineUtil != 0,
		"LineUtil":    param.LineUtil,
	}
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

func shellQuote(s string) string {
	return fmt.Sprintf("'%s'", strings.Replace(s, "'", "'\"'\"'", -1))
}

func (conn *SshConn) receive() (*MessageCompose, error) {
	ctx := context.Background()
	var stdoutEnd, stderrEnd bool
	messageCompose := &MessageCompose{
		Stats: make(map[string]int, 0),
	}

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
				log.Println("stdout end")
				stdoutEnd = true
			case *ErrRet:
				messageCompose.Errs = append(messageCompose.Errs, errors.New(ret.Message))
			case *DataRet:
				messageCompose.Logs = append(messageCompose.Logs, Log{
					stream:  conn.url.stream,
					num:     ret.CurNR,
					message: ret.Message,
				})
			case *StatRet:
				messageCompose.Stats[ret.Time] = ret.Count
			case *ExtRet:
				conn.exts[ret.Key] = ret.Value
			case *DebugRet:
				log.Println("[DEBUG]", ret.Message)
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
				log.Println("[DEBUG]", ret.Message)
			case *EndRet:
				log.Println("stderr end")
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

func (conn *SshConn) StdoutReceive(ctx context.Context) chan RetAndErr {
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
			// log.Print("[STDOUT]", line)
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
			retChan <- RetAndErr{Err: err, Ret: ret}
		}
	}()

	return retChan
}

func (conn *SshConn) StderrReceive(ctx context.Context) chan RetAndErr {
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
			// log.Print("[STDERR]", line)
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
			retChan <- RetAndErr{Err: err, Ret: ret}
		}
	}()

	return retChan
}

func (conn *SshConn) Close() {
	conn.session.Close()
	conn.client.Close()
}
