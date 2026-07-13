package config

import (
	"fmt"
	"math"
)

const (
	DefaultAddress = "0.0.0.0"
	DefaultPort    = 4000
)

type Web struct {
	Address string `yaml:"address"`
	Port    int    `yaml:"port"`
}

func (web *Web) SocketAddress() string {
	return fmt.Sprintf("%s:%d", web.Address, web.Port)
}

func (web *Web) ValidateAndSetDefaults() error {
	if len(web.Address) == 0 {
		web.Address = DefaultAddress
	}

	if web.Port == 0 {
		web.Port = DefaultPort
	} else if web.Port < 0 || web.Port > math.MaxUint16 {
		return fmt.Errorf("invalid port: value should be between %d and %d", 0, math.MaxUint16)
	}

	return nil
}

func DefaultWeb() *Web {
	return &Web{
		Address: DefaultAddress,
		Port:    DefaultPort,
	}
}
