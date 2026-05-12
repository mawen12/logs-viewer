package main

import (
	"bufio"
	"context"
	"errors"
	"fmt"
	"log"
	neturl "net/url"
	"os"
	"strings"
	"sync"

	"github.com/google/uuid"
)

type Reader struct {
	configPath string
	prefixPath string
	lines      []string
	urls       []ParsedUrl
	conns      []*SshConn
}

type ParsedUrl struct {
	source   string
	stream   string
	username string
	password string
	host     string
	port     string
	log      string
}

func NewReader(configPath string) *Reader {
	return &Reader{
		configPath: configPath,
		prefixPath: fmt.Sprintf("/tmp/%s", uuid.New().String()),
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

	log.Println("path prefix", r.prefixPath)

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
		source:   line,
		stream:   fmt.Sprintf("%s:%s", u.Hostname(), u.Path),
		username: u.User.Username(),
		password: password,
		host:     u.Hostname(),
		port:     u.Port(),
		log:      u.Path,
	}, nil
}

func (r *Reader) Connect(ctx context.Context) error {
	if len(r.urls) == 0 {
		return errors.New("cannot connect because lines is empty")
	}

	for _, url := range r.urls {
		conn, err := NewSshConn(r.prefixPath, url)
		if err != nil {
			return err
		}

		r.conns = append(r.conns, conn)
	}

	for _, conn := range r.conns {
		msg, err := conn.Start(ctx)
		if err != nil {
			return err
		}
		log.Println("connect msg", msg)
	}
	return nil
}

type MessageComposeAndErr struct {
	MessageCompose *MessageCompose
	Err            error
}

func (r *Reader) Query(ctx context.Context, param QueryParam) []MessageComposeAndErr {
	execute := func(ctx context.Context, c *SshConn) (*MessageCompose, error) {
		return c.Query(ctx, param)
	}

	return r.parallelExecute(ctx, execute)
}

func (r *Reader) Clean(ctx context.Context) []MessageComposeAndErr {
	execute := func(ctx context.Context, c *SshConn) (*MessageCompose, error) {
		return c.Clean(ctx)
	}
	return r.parallelExecute(ctx, execute)
}

type executer func(ctx context.Context, c *SshConn) (*MessageCompose, error)

func (r *Reader) parallelExecute(ctx context.Context, execute executer) []MessageComposeAndErr {
	retChan := make(chan MessageComposeAndErr, len(r.conns))
	wg := sync.WaitGroup{}
	wg.Add(len(r.conns))

	for _, conn := range r.conns {
		go func() {
			defer wg.Done()

			msg, err := execute(ctx, conn)
			retChan <- MessageComposeAndErr{
				MessageCompose: msg,
				Err:            err,
			}
		}()
	}

	go func() {
		wg.Wait()
		close(retChan)
	}()

	rets := make([]MessageComposeAndErr, 0)
	for ret := range retChan {
		rets = append(rets, ret)
	}
	return rets
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
