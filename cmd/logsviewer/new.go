package main

import (
	"context"
	"log/slog"

	"github.com/mawen12/logs-viewer/internal/config"
	"github.com/mawen12/logs-viewer/internal/conn"
	"github.com/mawen12/logs-viewer/internal/storage"
	"github.com/mawen12/logs-viewer/internal/ws"
)

type Application struct {
	*slog.Logger
	config *config.Config
	hub    *ws.Hub
	// reader  *conn.Reader
	conn    *conn.Manager
	storage *storage.Storage
}

func New(cfg *config.Config) *Application {
	storage, err := storage.New(*cfg.Storage)
	if err != nil {
		panic("store init failed " + err.Error())
	}

	storage.InitSources(cfg.Sources)

	conn := conn.NewManager()
	sources, err := storage.ListSource(context.Background())
	if err != nil {
		panic("list sources failed" + err.Error())
	}

	for _, source := range sources {
		conn.Add(source)
	}

	return &Application{
		config:  cfg,
		hub:     ws.NewHub(),
		conn:    conn,
		storage: storage,
	}
}

func (app *Application) Close() {
	app.conn.Close()
	app.hub.Close()
}
