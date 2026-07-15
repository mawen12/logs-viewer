package conn

import (
	"time"

	"golang.org/x/crypto/ssh"
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

func (conn *SshConn) Copy() (Conn, error) {
	newSession, err := conn.client.NewSession()
	if err != nil {
		return nil, err
	}

	stdin, err := newSession.StdinPipe()
	if err != nil {
		return nil, err
	}

	stdout, err := newSession.StdoutPipe()
	if err != nil {
		return nil, err
	}

	stderr, err := newSession.StderrPipe()
	if err != nil {
		return nil, err
	}

	if err := newSession.Start("/bin/sh"); err != nil {
		return nil, err
	}

	return &OnceConn{
		CommonConn: NewCommonConn(conn.prefixPath, conn.url, stdin, stdout, stderr),
		closeFunc: func() {
			newSession.Close()
		},
	}, nil
}

func (conn *SshConn) Close() {
	conn.session.Close()
	conn.client.Close()
}
