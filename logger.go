package main

import (
	"fmt"
	"log"
	"os"
)

type Logger struct {
	file *os.File
}

func NewLogger(logfile string) (*Logger, error) {
	if logfile == "" {
		logfile = "logs.log"
	}

	if err := os.MkdirAll("logs", 0755); err != nil {
		return nil, fmt.Errorf("Create log directory: %v", err)
	}

	dir, err := os.Getwd()
	if err != nil {
		return nil, fmt.Errorf("Access log directory: %v", err)
	}

	logpath := fmt.Sprintf("%s/logs/%s", dir, logfile)
	file, err := os.OpenFile(logpath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return nil, fmt.Errorf("Open log file: %v", err)
	}

	log.SetOutput(file)

	return &Logger{
		file: file,
	}, nil
}

func (l *Logger) Close() {
	if l != nil && l.file != nil {
		l.file.Close()
	}
}
