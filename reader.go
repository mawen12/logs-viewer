package main

import (
	"bufio"
	"errors"
	"fmt"
	neturl "net/url"
	"os"
	"strings"
	"time"

	"golang.org/x/crypto/ssh"
)

type Reader struct {
	configPath string
	lines      []string
	urls       []ParsedUrl
	conns      []*SshConn
}

type ParsedUrl struct {
	username string
	password string
	host     string
	port     string
	log      string
}

func NewReader(configPath string) *Reader {
	return &Reader{
		configPath: configPath,
		lines:      make([]string, 0),
		urls:       make([]ParsedUrl, 0),
		conns:      make([]*SshConn, 0),
	}
}

func (r *Reader) Read() error {
	file, err := os.Open(r.configPath)
	if err != nil {
		return err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		if line != "" && strings.TrimSpace(line) != "" {
			r.lines = append(r.lines, line)
		}
	}

	return nil
}

func (r *Reader) Parse() error {
	if len(r.lines) == 0 {
		return errors.New("cannot parse because lines is empty")
	}

	for _, line := range r.lines {
		url, err := parse(line)
		if err != nil {
			return err
		}

		r.urls = append(r.urls, url)
	}

	return nil
}

func parse(line string) (ParsedUrl, error) {
	u, err := neturl.Parse(line)
	if err != nil {
		return ParsedUrl{}, err
	}

	password, _ := u.User.Password()

	return ParsedUrl{
		username: u.User.Username(),
		password: password,
		host:     u.Hostname(),
		port:     u.Port(),
		log:      u.Path,
	}, nil
}

func (r *Reader) Connect() error {
	if len(r.urls) == 0 {
		return errors.New("cannot connect because lines is empty")
	}

	for _, url := range r.urls {
		conn, err := connect(url)
		if err != nil {
			return err
		}

		r.conns = append(r.conns, conn)
	}
	return nil
}

func connect(url ParsedUrl) (*SshConn, error) {
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

	if err := session.Start("/bin/sh"); err != nil {
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

	stdoutBuf := bufio.NewReader(stdout)
	stderrBuf := bufio.NewReader(stderr)

	return &SshConn{
		client:    client,
		session:   session,
		stdin:     stdin,
		stdout:    stdout,
		stderr:    stderr,
		stdoutBuf: stdoutBuf,
		stderrBuf: stderrBuf,
	}, nil
}

func (r *Reader) Write() error {

}

func (r *Reader) Close() error {
	for _, conn := range r.conns {
		conn.Close()
	}

	return nil
}

func (r *Reader) Debug() {
	for _, line := range r.lines {
		fmt.Println(line)
	}
}
