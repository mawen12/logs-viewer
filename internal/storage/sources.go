package storage

import (
	"context"

	"github.com/mawen12/logs-viewer/internal/model"
)

func (s *Storage) AddSource(ctx context.Context, source model.Source) (id int64, err error) {
	err = s.db.QueryRow(`
		INSERT INTO sources (source_name, source_group, source, pattern)
		VALUES ($1, $2, $3, $4)
		RETURNING source_id
	`, source.Name, source.Group, source.Source, source.Pattern).Scan(&id)
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
		SET source_name = $1, source_group = $2, source = $3, pattern = $4
		WHERE source_id = $4
	`, source.Name, source.Group, source.Source, source.Pattern, id)
	return err
}

func (s *Storage) ListSource(ctx context.Context) ([]model.Source, error) {
	rows, err := s.db.Query(`
		SELECT source_id, source_name, source_group, source, pattern FROM sources
	`)
	if err != nil {
		return nil, err
	}

	defer rows.Close()
	sources := make([]model.Source, 0)
	for rows.Next() {
		var source model.Source
		err = rows.Scan(&source.ID, &source.Name, &source.Group, &source.Source, &source.Pattern)
		if err != nil {
			return nil, err
		}
		sources = append(sources, source)
	}

	return sources, nil
}

func (s *Storage) GetSource(ctx context.Context, id int64) (model.Source, error) {
	row := s.db.QueryRow(`
		SELECT source_id, source_name, source_group, source, pattern FROM sources
		WHERE source_id = $1
	`, id)

	var source model.Source
	if err := row.Scan(&source.ID, &source.Name, &source.Group, &source.Source, &source.Pattern); err != nil {
		return model.Source{}, err
	}

	return source, nil
}
