package background

import (
	"sync"
	"sync/atomic"
)

type Group struct {
	wg    sync.WaitGroup
	total atomic.Int64
	done  atomic.Int64
}

func (g *Group) Add(n int) {
	g.total.Add(1)
	g.wg.Add(1)
}

func (g *Group) Done() {
	g.done.Add(1)
	g.wg.Done()
}

func (g *Group) Wait() {
	g.wg.Wait()
}

func (g *Group) Progress() (done, total int64) {
	return g.done.Load(), g.total.Load()
}
