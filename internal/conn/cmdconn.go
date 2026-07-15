package conn

import (
	"io"
	"os/exec"
)

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

func (conn *CmdConn) Copy() (Conn, error) {
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
		CommonConn: NewCommonConn(conn.prefixPath, conn.url, stdin, stdout, stderr),
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
