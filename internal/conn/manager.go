package conn

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/mawen12/logs-viewer/internal/model"
	"github.com/mawen12/logs-viewer/internal/ws"
	"github.com/mawen12/logs-viewer/pkg/background"
)

type Manager struct {
	sync.RWMutex
	path    string
	sources map[string]model.Source
	conns   map[string]Conn
}

func NewManager() *Manager {
	return &Manager{
		path:    fmt.Sprintf("/tmp/%s", uuid.New().String()),
		sources: make(map[string]model.Source),
		conns:   make(map[string]Conn),
	}
}

func (m *Manager) Close() {
	for _, conn := range m.conns {
		conn.Close()
	}
}

func (m *Manager) Add(source model.Source) error {
	if _, ok := m.sources[source.ID]; ok {
		return nil
	}

	m.Lock()
	defer m.Unlock()
	parsedUrl, err := parse(source.Source)
	if err != nil {
		return err
	}

	conn, err := NewConn(m.path, parsedUrl)
	if err != nil {
		return err
	}
	msg, err := conn.Start(context.Background())
	if err != nil {
		return err
	}
	log.Println("connect msg", msg)

	m.conns[source.ID] = conn
	m.sources[source.ID] = source
	return nil
}

func (m *Manager) Remove(source model.Source) error {
	conn, ok := m.conns[source.ID]
	if !ok {
		return nil
	}

	m.Lock()
	defer m.Unlock()

	conn.Close()
	delete(m.sources, source.ID)
	delete(m.conns, source.ID)
	return nil
}

func (m *Manager) Get(source model.Source) (Conn, bool) {
	m.RLock()
	defer m.RUnlock()
	conn, ok := m.conns[source.ID]
	return conn, ok
}

func (m *Manager) Query(ctx context.Context, param model.QueryParam) []model.MessageCompose {
	execute := func(ctx context.Context, c Conn) (*model.MessageCompose, error) {
		var (
			newConn Conn
			err     error
		)
		start := time.Now()
		defer func() {
			if newConn != nil {
				newConn.Close()
			}
			ws.QueryNotify(ctx, c.Url().stream, fmt.Sprintf("query cost %dms", time.Since(start).Milliseconds()))
		}()

		newConn, err = c.Copy()
		if err != nil {
			ws.QueryNotify(ctx, c.Url().stream, fmt.Sprintf("newInstance err: %v", err))
			return nil, err
		}

		return c.Query(ctx, param)
	}

	retChan := make(chan model.MessageCompose, 20)
	wg := sync.WaitGroup{}

	for _, id := range param.Sources {
		conn, ok := m.conns[id]
		if !ok {
			log.Printf("conn(%s) not exists\n", id)
			continue
		}

		wg.Add(1)
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

func (m *Manager) Clean(ctx context.Context) []model.MessageCompose {
	execute := func(ctx context.Context, c Conn) (*model.MessageCompose, error) {
		var (
			newConn Conn
			err     error
		)
		start := time.Now()
		defer func() {
			if newConn != nil {
				newConn.Close()
			}
			ws.QueryNotify(ctx, c.Url().stream, fmt.Sprintf("query cost %dms", time.Since(start).Milliseconds()))
		}()

		newConn, err = c.Copy()
		if err != nil {
			ws.QueryNotify(ctx, c.Url().stream, fmt.Sprintf("newInstance err: %v", err))
			return nil, err
		}

		return c.Clean(ctx)
	}

	retChan := make(chan model.MessageCompose, 20)
	wg := sync.WaitGroup{}

	for _, conn := range m.conns {
		wg.Add(1)
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
