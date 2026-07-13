package storage

import (
	"context"

	"github.com/mawen12/logs-viewer/internal/model"
)

func (s *Storage) AddSource(ctx context.Context, source model.Source) (id int64, err error) {
	err = s.db.QueryRow(`
		INSERT INTO sources (source_name, source_group, source)
		VALUES ($1, $2, $3)
		RETURNING source_id
	`, source.Name, source.Group, source.Source).Scan(&id)
	return
}

func (s *Storage) DeleteSource(ctx context.Context, id int64) error {
	_, err := s.db.Exec(`
		DELETE FROM sources 
		WHERE source_id = $1
	`, id)
	return err
}

func (s *Storage) UpdateSource(ctx context.Context, id int64, source model.Source) error {
	_, err := s.db.Exec(`
		UPDATE sources 
		SET source_name = $1, source_group = $2, source = $3
		WHERE source_id = $4
	`, source.Name, source.Group, source.Source, id)
	return err
}

func (s *Storage) ListSource(ctx context.Context) ([]model.Source, error) {
	rows, err := s.db.Query(`
		SELECT source_id, source_name, source_group, source FROM sources
	`)
	if err != nil {
		return nil, err
	}

	defer rows.Close()
	sources := make([]model.Source, 0)
	for rows.Next() {
		var source model.Source
		err = rows.Scan(&source.ID, &source.Name, &source.Group, &source.Source)
		if err != nil {
			return nil, err
		}
		sources = append(sources, source)
	}

	return sources, nil
}
