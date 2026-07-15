package config

import "fmt"

type Source struct {
	Name    string `yaml:"name"`
	Group   string `yaml:"group"`
	Source  string `yaml:"source"`
	Pattern string `yaml:"pattern"`
}

func (s *Source) Validate() error {
	if s.Name == "" {
		return fmt.Errorf("source name must be provided")
	}
	if s.Group == "" {
		return fmt.Errorf("source:%s group must be provided", s.Name)
	}
	if s.Source == "" {
		return fmt.Errorf("source:%s source must be provided", s.Name)
	}
	if s.Pattern == "" {
		s.Pattern = "yyyy-MM-dd HH:mm:ss,SSS"
	}
	return nil
}
