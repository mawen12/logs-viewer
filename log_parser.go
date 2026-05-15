package main

import (
	"errors"
	"strings"
	"time"
)

type LogParser struct {
	Time  int64
	Level string
}

func (parser *LogParser) Parse(log *Log) {
	if log.Message == "" {
		return
	}

	t, err := parser.time(log.Message)
	if err != nil {
		return
	}
	log.Time = t

	level, err := parser.level(log.Message)
	if err != nil {
		return
	}
	log.Level = level

	threadName, err := parser.threadName(log.Message)
	if err != nil {
		return
	}
	log.ThreadName = threadName
}

func (parse *LogParser) time(message string) (int64, error) {
	if len(message) < 23 {
		return 0, errors.New("message length invalid")
	}

	timeStr := message[:23]
	t, err := time.Parse(LayoutDateTimeMillisecondComma, timeStr)
	if err != nil {
		return 0, err
	}

	return t.UnixNano() / int64(time.Millisecond), nil
}

func (parse *LogParser) level(message string) (string, error) {
	idx := strings.IndexByte(message, '[')
	if idx == -1 {
		return "", errors.New("message format invalid")
	}

	if idx < 24 {
		return "", errors.New("message length invalid")
	}

	return message[24 : idx-1], nil
}

func (parse *LogParser) threadName(message string) (string, error) {
	idx := strings.IndexByte(message, '[')
	if idx == -1 {
		return "", errors.New("message format invalid")
	}
	endIdx := strings.IndexByte(message, ']')
	if endIdx == -1 {
		return "", errors.New("message format invalid")
	}

	return message[idx+1 : endIdx], nil
}
