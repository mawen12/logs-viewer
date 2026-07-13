package config

const (
	DefaultPath = "sources.db"
)

type Storage struct {
	Path string `yaml:"path"`
}

func DefaultStorage() *Storage {
	return &Storage{
		Path: DefaultPath,
	}
}

func (c *Storage) ValidateAndSetDefaults() error {
	return nil
}
