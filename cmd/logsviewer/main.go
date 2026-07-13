package main

import (
	"flag"

	"github.com/mawen12/logs-viewer/internal/config"
	"github.com/mawen12/logs-viewer/pkg/env"
)

var (
	configPath string
)

func init() {
	flag.StringVar(&configPath, "config", env.Get("CONFIG", "config.yaml"), "config file path")
	flag.Parse()
}

func main() {
	cfg, err := config.Load(configPath)
	if err != nil {
		panic(err)
	}

	app := New(cfg)
	if err := app.Serve(); err != nil {
		panic(err)
	}
}
