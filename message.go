package main

import (
	"bytes"
	"fmt"
	"strconv"
)

type MessageCompose struct {
	Out OutMessage
	Err ErrMessage

	Logs []Log
	Errs []error
}

type Log struct {
	num     int
	file    string
	message string
}

type OutMessage struct {
	DataLines []string
}

type ErrMessage struct {
	Content string
}

type Message struct {
	Line DataRet
}

// ==============================================
// ==================== ret =====================
// ==============================================

type Ret interface {
	Prefix() string
	Decode([]byte) error
}

// D:<CurNR>:<Message>
type DataRet struct {
	CurNR   int
	Message string
}

func (r *DataRet) Prefix() string {
	return "D"
}

func (r *DataRet) Decode(src []byte) error {
	// *r = DataRet{}

	if len(src) < 4 {
		return fmt.Errorf("invalid message len for DataRet, expected %d actual %d", 4, len(src))
	}

	if src[0] != ':' {
		return fmt.Errorf("invalid message format for DataRet, content is %s", src)
	}

	src = src[1:]
	idx := bytes.IndexByte(src, ':')
	if idx == -1 {
		return fmt.Errorf("invalid message format for DataRet, content is %s", src)
	}

	curNr, err := strconv.Atoi(string(src[:idx]))
	if err != nil {
		return fmt.Errorf("invalid message format for DataRet, content is %s", src)
	}

	r.CurNR = curNr
	r.Message = string(src[idx+1:])
	return nil
}

// E:<Code>:<Message>
type ErrRet struct {
	Code    byte
	Message string
}

func (r *ErrRet) Prefix() string {
	return "E"
}

func (r *ErrRet) Decode(src []byte) error {
	// *r = ErrRet{}

	if len(src) < 4 {
		return fmt.Errorf("invalid message len for ErrRet, expected %d actual %d", 4, len(src))
	}

	if src[0] != ':' {
		return fmt.Errorf("invalid message format for ErrRet, content is %s", src)
	}

	if src[2] != ':' {
		return fmt.Errorf("invalid message format for ErrRet, content is %s", src)
	}

	r.Code = src[1]
	r.Message = string(src[3:])
	return nil
}

// N:<Message>
type DebugRet struct {
	Mesage string
}

func (r *DebugRet) Prefix() string {
	return "N"
}

func (r *DebugRet) Decode(src []byte) error {
	// *r = DebugRet{}

	if len(src) < 2 {
		return fmt.Errorf("invalid message len for ErrRet, expected %d actual %d", 2, len(src))
	}

	if src[0] != ':' {
		return fmt.Errorf("invalid message format for DebugRet, content is %s", src)
	}

	r.Mesage = string(src[1:])
	return nil
}

// A:
type BeginRet struct {
}

func (r *BeginRet) Prefix() string {
	return "A"
}

func (r *BeginRet) Decode(src []byte) error {
	// *r = BeginRet{}

	if len(src) != 1 {
		return fmt.Errorf("invalid message len for BeginRet, expected %d actual %d", 0, len(src))
	}

	if src[0] != ':' {
		return fmt.Errorf("invalid message format for BeginRet, content is %s", src)
	}

	return nil
}

// Z:
type EndRet struct {
}

func (r *EndRet) Prefix() string {
	return "Z"
}

func (r *EndRet) Decode(src []byte) error {
	// *r = EndRet{}

	if len(src) != 1 {
		return fmt.Errorf("invalid message len for EndRet, expected %d actual %d", 0, len(src))
	}

	if src[0] != ':' {
		return fmt.Errorf("invalid message format for EndRet, content is %s", src)
	}

	return nil
}

// X:<Key>:<Value>
type ExtRet struct {
	Key   string
	Value string
}

func (r *ExtRet) Prefix() string {
	return "X"
}

func (r *ExtRet) Decode(src []byte) error {
	*r = ExtRet{}

	if len(src) < 4 {
		return fmt.Errorf("invalid message len for DataRet, expected %d actual %d", 4, len(src))
	}

	if src[0] != ':' {
		return fmt.Errorf("invalid message format for DataRet, content is %s", src)
	}

	src = src[1:]
	idx := bytes.IndexByte(src, ':')
	if idx == -1 {
		return fmt.Errorf("invalid message format for DataRet, content is %s", src)
	}

	r.Key = string(src[:idx])
	r.Value = string(src[idx+1:])
	return nil
}
