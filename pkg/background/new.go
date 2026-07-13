package background

import "log"

var defaultManager *Manager

func init() {
	defaultManager = New()
}

type Manager struct {
	group *Group
}

func New() *Manager {
	return &Manager{
		group: new(Group),
	}
}

func (m *Manager) Submit(name string, fn func()) {
	m.group.Add(1)

	go func() {
		defer m.group.Done()

		defer func() {
			if err := recover(); err != nil {
				log.Println(name, "execute error ", err)
			}
			log.Println("goroutine stop for ", name)
		}()

		log.Println("goroutine start for ", name)
		fn()
	}()
}

func Submit(name string, fn func()) {
	if defaultManager == nil {
		return
	}
	defaultManager.Submit(name, fn)
}

func Wait() {
	defaultManager.group.Wait()
}

func Progress() (done, total int64) {
	return defaultManager.group.Progress()
}
