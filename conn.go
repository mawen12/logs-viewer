package main

import (
	"bufio"
	"context"
	"errors"
	"io"
	"log"

	"golang.org/x/crypto/ssh"
)

type SshConnConfig struct {
}

type SshConn struct {
	client  *ssh.Client
	session *ssh.Session

	stdin                io.WriteCloser
	stdout, stderr       io.Reader
	stdoutBuf, stderrBuf *bufio.Reader

	exts map[string]string
}

func (conn *SshConn) Start() (*MessageCompose, error) {
	_, err := conn.session.Stdin.Read([]byte("whoami"))
	if err != nil {
		return nil, err
	}

	ctx := context.Background()
	var stdoutEnd, stderrEnd bool
	messageCompose := &MessageCompose{}

Loop:
	for {
		select {
		case retAndErr, ok := <-conn.StdoutReceive(ctx):
			if !ok {
				break Loop
			}
			if retAndErr.Err != nil {
				return nil, retAndErr.Err
			}

			switch ret := retAndErr.Ret.(type) {
			case *DataRet:
				messageCompose.Logs = append(messageCompose.Logs, Log{
					num:     ret.CurNR,
					message: ret.Message,
				})
			case *ErrRet:
				messageCompose.Errs = append(messageCompose.Errs, errors.New(ret.Message))
			case *DebugRet:
				log.Println("ret is", ret.Mesage)
			case *ExtRet:
				conn.exts[ret.Key] = ret.Value
			case *EndRet:
				stdoutEnd = true
			default:
				// ignored
			}

			if stderrEnd && stdoutEnd {
				break Loop
			}

		case retAndErr, ok := <-conn.StderrReceive(ctx):
			if !ok {
				break Loop
			}
			if retAndErr.Err != nil {
				return nil, retAndErr.Err
			}

			switch ret := retAndErr.Ret.(type) {
			case *ErrRet:
				messageCompose.Errs = append(messageCompose.Errs, errors.New(ret.Message))
			case *DebugRet:
				log.Println("ret is", ret.Mesage)
			case *EndRet:
				stderrEnd = true
			default:
				// ignored
			}

			if stderrEnd && stdoutEnd {
				break Loop
			}
		}
	}

	return messageCompose, nil
}

func (conn *SshConn) receive() {

}

type RetAndErr struct {
	Ret Ret
	Err error
}

func (conn *SshConn) StdoutReceive(ctx context.Context) chan RetAndErr {
	retChan := make(chan RetAndErr, 2)

	go func() {
		defer close(retChan)
		for {
			line, err := conn.stdoutBuf.ReadString('\n')
			if err != nil {
				retChan <- RetAndErr{Err: err}
				break
			}

			var ret Ret
			switch line[1] {
			case 'D':
				ret = &DataRet{}

			case 'N':
				ret = &DebugRet{}
			}

			err = ret.Decode([]byte(line[1:]))
			retChan <- RetAndErr{Err: err, Ret: ret}
		}
	}()

	return retChan
}

func (conn *SshConn) StderrReceive(ctx context.Context) chan RetAndErr {
	retChan := make(chan RetAndErr, 2)

	go func() {
		defer close(retChan)
		for {
			line, err := conn.stderrBuf.ReadString('\n')
			if err != nil {
				retChan <- RetAndErr{Err: err}
				break
			}

			var ret Ret
			switch line[1] {
			case 'D':
				ret = &DataRet{}

			case 'N':
				ret = &DebugRet{}
			}

			err = ret.Decode([]byte(line[1:]))
			retChan <- RetAndErr{Err: err, Ret: ret}
		}
	}()

	return retChan
}

func (conn *SshConn) Close() {
	conn.session.Close()
	conn.client.Close()
}
