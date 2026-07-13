package config

import (
	"errors"
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Storage *Storage  `yaml:"storage,omitempty"`
	Web     *Web      `yaml:"web,omitempty"`
	Sources []*Source `yaml:"sources,omitempty"`
}

func Load(configPath string) (*Config, error) {
	if len(configPath) == 0 {
		return nil, errors.New("configuration file not found")
	}

	fileInfo, err := os.Stat(configPath)
	if fileInfo.IsDir() {
		return nil, errors.New("Only support file, please provide file path")
	}

	configBytes, err := os.ReadFile(configPath)
	if err != nil {
		return nil, fmt.Errorf("error reading configuration from path %s: %w", configPath, err)
	}
	if len(configBytes) == 0 {
		return nil, errors.New("configuration file not found")
	}

	return parseAndValidateConfigBytes(configBytes)
}

func parseAndValidateConfigBytes(configBytes []byte) (config *Config, err error) {
	bytes := []byte(os.ExpandEnv(string(configBytes)))

	if err = yaml.Unmarshal(bytes, &config); err != nil {
		return
	}

	if err = ValidateWebConfig(config); err != nil {
		return
	}
	return
}

func ValidateStorageConfig(config *Config) error {
	if config.Storage == nil {
		config.Storage = DefaultStorage()
	}

	return config.Storage.ValidateAndSetDefaults()
}

func ValidateWebConfig(config *Config) error {
	if config.Web == nil {
		config.Web = DefaultWeb()
		return nil
	}

	return config.Web.ValidateAndSetDefaults()
}
