package main

import (
	"context"
	"flag"
	"log"
	"net/http"
	_ "net/http/pprof"
	"sync"
	"sync/atomic"
	"time"
)

var (
	configPath = flag.String("config", getEnv("CONFIG", "config.properties"), "config file path")
	logfile    = flag.String("logfile", getEnv("LOGFILE", ""), "log record file")
	port       = flag.Int("port", getEnvInt("PORT", 9081), "server port")
	debug      = flag.Bool("debug", getEnvBool("DEBUG", false), "debug")
	mode       = flag.String("mode", getEnv("MODE", "parallel"), "conn run mode")
)

var (
	logger *Logger
	reader *Reader
	group  Group
	hub    *Hub
)

func main() {
	defer func() {
		if reader != nil {
			ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
			defer cancel()

			// todo fix, when receive SIGINT signal then will shutdown the stdin, so this command cannot success call
			reader.Clean(ctx)
			reader.Close()
		}

		logger.Close()
	}()

	flag.Parse()

	if *configPath == "" {
		panic("config file must provided")
	}

	var err error
	logger, err = NewLogger(*logfile)
	if err != nil {
		log.Fatalf("New logger: %v", err)
	}

	reader = NewReader(*configPath, *mode)
	if err := reader.LoadConfig(); err != nil {
		log.Fatalf("Load config: %v", err)
	}

	if *debug {
		reader.Debug()
	}

	if err := reader.ParseConfig(); err != nil {
		log.Fatalf("Parse config: %v", err)
	}

	if err := reader.Connect(context.Background()); err != nil {
		log.Fatalf("Connect: %v", err)
	}

	config := serverConfig{
		port: uint32(*port),
	}

	hub = newHub()
	background("hub run", hub.run)

	go func() {
		log.Println("pprof listening on :6060")
		log.Fatal(http.ListenAndServe("localhost:6060", nil))
	}()

	if err := serve(config); err != nil {
		log.Fatalf("Start serve: %v", err)
	}
}

func background(name string, fn func()) {
	group.Add(1)

	go func() {
		defer group.Done()

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
