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
	conns      []Conn
}

type ParsedUrl struct {
	source   string
	stream   string
	scheme   string
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
		conns:      make([]Conn, 0),
	}
}

func (r *Reader) LoadConfig() error {
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

func (r *Reader) ParseConfig() error {
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
		scheme:   u.Scheme,
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
		switch url.scheme {
		case "cmd":
			conn, err := NewCmdConn(r.prefixPath, url)
			if err != nil {
				return err
			}
			r.conns = append(r.conns, conn)
		case "ssh":
			conn, err := NewSshConn(r.prefixPath, url)
			if err != nil {
				return err
			}
			r.conns = append(r.conns, conn)
		default:

		}
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

func (r *Reader) Query(ctx context.Context, param QueryParam) []MessageCompose {
	execute := func(ctx context.Context, c Conn) (*MessageCompose, error) {
		return c.Query(ctx, param)
	}

	return r.parallelExecute(ctx, execute)
}

func (r *Reader) Clean(ctx context.Context) []MessageCompose {
	execute := func(ctx context.Context, c Conn) (*MessageCompose, error) {
		return c.Clean(ctx)
	}
	return r.parallelExecute(ctx, execute)
}

type executer func(ctx context.Context, c Conn) (*MessageCompose, error)

func (r *Reader) parallelExecute(ctx context.Context, execute executer) []MessageCompose {
	retChan := make(chan MessageCompose, len(r.conns))
	wg := sync.WaitGroup{}
	wg.Add(len(r.conns))

	for _, conn := range r.conns {
		go func() {
			defer wg.Done()

			msg, err := execute(ctx, conn)
			if err != nil {
				msg = &MessageCompose{
					Errs: []error{err},
				}
			}
			msg.Stream = conn.Url().stream
			retChan <- *msg
		}()
	}

	go func() {
		wg.Wait()
		close(retChan)
	}()

	rets := make([]MessageCompose, 0)
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
