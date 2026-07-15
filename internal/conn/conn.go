package conn

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

	"github.com/mawen12/logs-viewer/internal/model"
	"github.com/mawen12/logs-viewer/internal/scripts"
	"github.com/mawen12/logs-viewer/internal/ws"
	"github.com/mawen12/logs-viewer/pkg/background"
)

type Conn interface {
	Url() ParsedUrl
	Copy() (Conn, error)
	Start(context.Context) (*model.MessageCompose, error)
	Index(context.Context) (*model.MessageCompose, error)
	Query(context.Context, model.QueryParam) (*model.MessageCompose, error)
	Clean(context.Context) (*model.MessageCompose, error)
	Close()
}

func NewConn(path string, parsedUrl ParsedUrl) (Conn, error) {
	if parsedUrl.scheme == "cmd" {
		return NewCmdConn(path, parsedUrl)
	} else if parsedUrl.scheme == "ssh" {
		return NewSshConn(path, parsedUrl)
	}
	return nil, fmt.Errorf("unsupported scheme %s", parsedUrl.scheme)
}

type OnceConn struct {
	*CommonConn
	closeFunc func()
}

func (conn *OnceConn) Copy() (Conn, error) {
	return nil, errors.New("cannot copy from once conn")
}

func (conn *OnceConn) Close() {
	conn.closeFunc()
}

func shellQuote(s string) string {
	return fmt.Sprintf("'%s'", strings.Replace(s, "'", "'\"'\"'", -1))
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

func (conn *CommonConn) Start(ctx context.Context) (*model.MessageCompose, error) {
	params := map[string]any{
		"PrefixPath":    conn.prefixPath,
		"AgentPath":     "agent.sh",
		"AgentContent":  scripts.AgentSh,
		"LibPath":       "agent_lib.sh",
		"LibContent":    scripts.LibSh,
		"IndexPath":     "agent_index.sh",
		"IndexContent":  scripts.IndexSh,
		"SearchPath":    "agent_search.sh",
		"SearchContent": scripts.SearchSh,
		"IndexFile":     conn.indexFile,
		"LogFile":       conn.url.log,
	}
	bs, err := conn.template(scripts.StartShTemplate, params)
	if err != nil {
		return nil, err
	}
	if _, err = conn.stdin.Write(bs); err != nil {
		return nil, err
	}

	return conn.receive(ctx)
}

// Index build index file from the log file
func (conn *CommonConn) Index(ctx context.Context) (*model.MessageCompose, error) {
	params := map[string]any{
		"PrefixPath": conn.prefixPath,
		"AgentPath":  "agent.sh",
		"IndexFile":  conn.indexFile,
		"LogFile":    conn.url.log,
	}
	bs, err := conn.template(scripts.IndexShTemplate, params)
	if err != nil {
		return nil, err
	}
	if _, err = conn.stdin.Write(bs); err != nil {
		return nil, err
	}

	return conn.receive(ctx)
}

// Query
func (conn *CommonConn) Query(ctx context.Context, param model.QueryParam) (*model.MessageCompose, error) {
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
	bs, err := conn.template(scripts.QueryShTemplate, params)
	if err != nil {
		return nil, err
	}
	ws.QueryNotify(ctx, conn.Url().stream, fmt.Sprintf("query script: %s", string(bs)))
	if _, err = conn.stdin.Write(bs); err != nil {
		return nil, err
	}

	return conn.receive(ctx)
}

func (conn *CommonConn) Clean(ctx context.Context) (*model.MessageCompose, error) {
	params := map[string]any{
		"PrefixPath": conn.prefixPath,
	}
	bs, err := conn.template(scripts.CleanShTmpleate, params)
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

func (conn *CommonConn) receive(ctx context.Context) (*model.MessageCompose, error) {
	var stdoutEnd, stderrEnd bool
	messageCompose := &model.MessageCompose{}

	stdoutChan := conn.StdoutReceive(ctx)
	stderrChan := conn.StderrReceive(ctx)

Loop:
	for {
		select {
		case retAndErr, ok := <-stdoutChan:
			if !ok {
				log.Println("receive stdoutchan not ok")
				stdoutEnd = true
				if stderrEnd {
					break Loop
				}
				continue
			}
			if retAndErr.Err != nil {
				return nil, retAndErr.Err
			}

			switch ret := retAndErr.Ret.(type) {
			case *model.BeginRet:

			case *model.EndRet:
				stdoutEnd = true
			case *model.ErrRet:
				messageCompose.Errs = append(messageCompose.Errs, errors.New(ret.Message))
			case *model.DataRet:
				log := &model.Log{
					Num:     ret.CurNR,
					Message: ret.Message,
				}
				conn.parser.Parse(log)
				messageCompose.Logs = append(messageCompose.Logs, log)
			case *model.StatRet:
				messageCompose.Stats = append(messageCompose.Stats, model.Stat{
					Time:  ret.Time.Unix(),
					Count: ret.Count,
				})
			case *model.ExtRet:
				conn.exts[ret.Key] = ret.Value
			case *model.DebugRet:
				ws.QueryNotify(ctx, conn.Url().stream, ret.Message)
			case *model.UnknownRet:
				ws.QueryNotify(ctx, conn.Url().stream, ret.Content)
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
				log.Println("receive stderrchan not ok")
				stderrEnd = true
				if stdoutEnd {
					break Loop
				}
				continue
			}
			if retAndErr.Err != nil {
				return nil, retAndErr.Err
			}

			switch ret := retAndErr.Ret.(type) {
			case *model.BeginRet:

			case *model.ErrRet:
				messageCompose.Errs = append(messageCompose.Errs, errors.New(ret.Message))
			case *model.DebugRet:
				ws.QueryNotify(ctx, conn.Url().stream, ret.Message)
				log.Println("[DEBUG-stderr]", ret.Message)
			case *model.EndRet:
				stderrEnd = true
			case *model.UnknownRet:
				ws.QueryNotify(ctx, conn.Url().stream, ret.Content)
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
	Ret model.Ret
	Err error
}

func (conn *CommonConn) StdoutReceive(ctx context.Context) chan RetAndErr {
	retChan := make(chan RetAndErr, 128)

	background.Submit("stdout-recevie", func() {
		defer close(retChan)
		for {
			line, err := conn.stdoutBuf.ReadString('\n')
			if err != nil && line == "" {
				log.Println("receve err and empty from stdoutbuf", err, line)
				return
			} else if err != nil && line != "" {
				log.Println("receve err and non-empty from stdoutbuf", err, line)
				line = strings.TrimLeft(line, "\u0000")
				handleRecevie(ctx, retChan, line, err)
				return
			} else if line == "" {
				log.Println("read empty line from stdoutbuf")
			} else {
				line = strings.TrimLeft(line, "\u0000")

				log.Println("handle stdout", line)
				if exit := handleRecevie(ctx, retChan, line, nil); exit {
					log.Println("exit stdout")
					return
				}
			}
		}
	})

	return retChan
}

func (conn *CommonConn) StderrReceive(ctx context.Context) chan RetAndErr {
	retChan := make(chan RetAndErr, 128)

	background.Submit("stderr-receive", func() {
		defer close(retChan)
		for {
			line, err := conn.stderrBuf.ReadString('\n')
			if err != nil && line == "" {
				log.Println("receve err and empty from stderrbuf", err, line)
				return
			} else if err != nil && line != "" {
				log.Println("receve err and non-empty from stderrbuf", err, line)
				line = strings.TrimLeft(line, "\u0000")
				handleRecevie(ctx, retChan, line, err)
				return
			} else if line == "" {
				log.Println("read empty line from stderrbuf")
			} else {
				line = strings.TrimLeft(line, "\u0000")
				if exit := handleRecevie(ctx, retChan, line, nil); exit {
					return
				}
			}
		}
	})

	return retChan
}

func handleRecevie(ctx context.Context, retChan chan RetAndErr, line string, err error) (exist bool) {
	line = strings.TrimRight(line, "\r\n")
	errs := make([]error, 0)
	if err != nil {
		errs = append(errs, err)
	}

	var ret model.Ret
	switch line[0] {
	case 'A':
		ret = &model.BeginRet{}
		line = line[1:]
	case 'Z':
		log.Println("received end ret,", line)
		ret = &model.EndRet{}
		if err := ret.Decode([]byte(line[1:])); err != nil {
			errs = append(errs, err)
		}
		retChan <- RetAndErr{Err: combineErrors(errs), Ret: ret}
		exist = true
		return
	case 'E':
		ret = &model.ErrRet{}
		line = line[1:]
	case 'D':
		ret = &model.DataRet{}
		line = line[1:]
	case 'T':
		ret = &model.StatRet{}
		line = line[1:]
	case 'X':
		ret = &model.ExtRet{}
		line = line[1:]
	case 'N':
		ret = &model.DebugRet{}
		line = line[1:]
	default:
		ret = &model.UnknownRet{}
	}

	if err := ret.Decode([]byte(line)); err != nil {
		errs = append(errs, err)
	}

	select {
	case <-ctx.Done():
		log.Println("context done, exit the stdout and stdin receive")
		exist = true
	case retChan <- RetAndErr{Err: combineErrors(errs), Ret: ret}:

	}

	return exist
}

func combineErrors(errs []error) error {
	if len(errs) == 0 {
		return nil
	}

	var msgs []string
	for _, err := range errs {
		if err != nil {
			msgs = append(msgs, err.Error())
		}
	}

	if len(msgs) == 0 {
		return nil
	}

	return errors.New(strings.Join(msgs, "; "))
}
