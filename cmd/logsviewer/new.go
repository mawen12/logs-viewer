package main

import (
	"log/slog"

	"github.com/mawen12/logs-viewer/internal/config"
	"github.com/mawen12/logs-viewer/internal/conn"
	"github.com/mawen12/logs-viewer/internal/storage"
	"github.com/mawen12/logs-viewer/internal/ws"
)

type Application struct {
	*slog.Logger
	config  *config.Config
	hub     *ws.Hub
	reader  *conn.Reader
	storage *storage.Storage
}

func New(cfg *config.Config) *Application {
	storage, err := storage.New(*cfg.Storage)
	if err != nil {
		panic("store init failed " + err.Error())
	}

	return &Application{
		config:  cfg,
		hub:     ws.NewHub(),
		reader:  conn.NewReader("", ""),
		storage: storage,
	}
}

func (app *Application) Close() {
	app.reader.Close()
	app.hub.Close()
}
