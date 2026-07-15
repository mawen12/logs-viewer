package storage

import (
	"context"
	"database/sql"

	_ "embed"

	_ "github.com/mattn/go-sqlite3"

	"github.com/mawen12/logs-viewer/internal/config"
	"github.com/mawen12/logs-viewer/internal/model"
)

//go:embed sources.sql
var sqlfile string

type Storage struct {
	db *sql.DB
}

func New(cfg config.Storage) (*Storage, error) {
	db, err := sql.Open("sqlite3", cfg.Path)
	if err != nil {
		return nil, err
	}
	if err = db.Ping(); err != nil {
		return nil, err
	}

	_, _ = db.Exec("PRAGMA foreign_keys=ON")
	_, _ = db.Exec("PRAGMA journal_mode=WAL")
	_, _ = db.Exec("PRAGMA synchronous=NORMAL")
	db.SetMaxOpenConns(1)
	storage := &Storage{db}
	if err := storage.createSchema(); err != nil {
		db.Close()
		return nil, nil
	}

	return storage, nil
}

func (s *Storage) createSchema() error {
	_, err := s.db.Exec(string(sqlfile))
	return err
}

func (s *Storage) InitSources(sources []*config.Source) error {
	for _, cfgSource := range sources {
		if _, err := s.AddSource(context.Background(), model.Source{Name: cfgSource.Name, Group: cfgSource.Group, Source: cfgSource.Source, Pattern: cfgSource.Pattern}); err != nil {
			return err
		}
	}
	return nil
}
