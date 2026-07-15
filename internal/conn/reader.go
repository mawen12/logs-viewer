package conn

import (
	"context"
	"errors"
	"fmt"
	"log"
	neturl "net/url"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/mawen12/logs-viewer/internal/model"
	"github.com/mawen12/logs-viewer/internal/ws"
	"github.com/mawen12/logs-viewer/pkg/background"
)

type Reader struct {
	configPath string
	mode       string
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

func (url ParsedUrl) LogName() string {
	if url.log == "" {
		return ""
	}

	lastSlash := strings.LastIndexByte(url.log, '/')
	if lastSlash == -1 {
		return url.log
	}

	lastPoint := strings.LastIndexByte(url.log, '.')
	if lastPoint == -1 {
		lastPoint = -1
	}

	return url.log[lastSlash+1 : lastPoint]
}

func NewReader(configPath string, mode string) *Reader {
	return &Reader{
		configPath: configPath,
		mode:       mode,
		prefixPath: fmt.Sprintf("/tmp/%s", uuid.New().String()),
		lines:      make([]string, 0),
		urls:       make([]ParsedUrl, 0),
		conns:      make([]Conn, 0),
	}
}

// func (r *Reader) LoadConfig() error {
// 	file, err := os.Open(r.configPath)
// 	if err != nil {
// 		return err
// 	}
// 	defer file.Close()

// 	log.Println("path prefix", r.prefixPath)

// 	scanner := bufio.NewScanner(file)
// 	for scanner.Scan() {
// 		line := scanner.Text()
// 		if line != "" && strings.TrimSpace(line) != "" {
// 			r.lines = append(r.lines, line)
// 		}
// 	}

// 	return nil
// }

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
			// todo
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

func (r *Reader) Query(ctx context.Context, param model.QueryParam) []model.MessageCompose {
	execute := func(ctx context.Context, c Conn) (*model.MessageCompose, error) {
		start := time.Now()
		defer func() {
			ws.QueryNotify(ctx, c.Url().stream, fmt.Sprintf("query cost %dms", time.Since(start).Milliseconds()))
		}()

		var newConn Conn
		if r.mode != "single" {
			ws.QueryNotify(ctx, c.Url().stream, "use non-single mode to query")
			var err error
			newConn, err = c.Copy()
			if err != nil {
				ws.QueryNotify(ctx, c.Url().stream, fmt.Sprintf("newInstance err: %v", err))
				return nil, err
			}
			defer newConn.Close() // once conn need to be closed after used
		} else {
			newConn = c
		}
		return c.Query(ctx, param)
	}

	return r.parallelExecute(ctx, r.conns, execute)
}

func (r *Reader) Clean(ctx context.Context) []model.MessageCompose {
	execute := func(ctx context.Context, c Conn) (*model.MessageCompose, error) {
		return c.Clean(ctx)
	}
	return r.parallelExecute(ctx, r.conns, execute)
}

type executer func(ctx context.Context, c Conn) (*model.MessageCompose, error)

func (r *Reader) parallelExecute(ctx context.Context, conns []Conn, execute executer) []model.MessageCompose {
	retChan := make(chan model.MessageCompose, len(conns))
	wg := sync.WaitGroup{}
	wg.Add(len(conns))

	for _, conn := range r.conns {
		background.Submit("reader-parallel-execute", func() {
			defer wg.Done()

			msg, err := execute(ctx, conn)
			if err != nil {
				ws.QueryNotify(ctx, conn.Url().stream, fmt.Sprintf("execute err: %v", err))
				log.Println("execute err", err)
				msg = &model.MessageCompose{
					Errs: []error{err},
				}
			}
			msg.Stream = conn.Url().stream
			retChan <- *msg
		})
	}

	background.Submit("read-parallel-wait", func() {
		wg.Wait()
		close(retChan)
	})

	rets := make([]model.MessageCompose, 0)
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
