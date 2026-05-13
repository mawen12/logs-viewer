package main

import (
	"bytes"
	"fmt"
	"strconv"
	"time"
)

type QueryParam struct {
	Pattern     string
	From        time.Time
	To          time.Time
	LineUtil    int
	MaxNumLines int
	extParam    map[string]QueryParam
}

func (param QueryParam) FromStr() string {
	if param.From.IsZero() {
		return ""
	}
	return param.From.Format("2006-01-02-15:04")
}

func (param QueryParam) ToStr() string {
	if param.To.IsZero() {
		return ""
	}
	return param.To.Format("2006-01-02-15:04")
}

func (param QueryParam) String() string {
	return fmt.Sprintf("{from: %s, to: %s, pattern: %s, MaxNumLines: %d}",
		param.FromStr(),
		param.ToStr(),
		param.Pattern,
		param.MaxNumLines,
	)
}

type MessageCompose struct {
	Logs  []Log   `json:"logs"`
	Stats []Stat  `json:"stats"`
	Errs  []error `json:"errs"`
}

type Log struct {
	Stream  string `json:"stream"`
	Num     int    `json:"num"`
	Message string `json:"message"`
}

type Stat struct {
	Time  string `json:"time"`
	Count int    `json:"count"`
}

// ==============================================
// ==================== ret =====================
// ==============================================

type Ret interface {
	Prefix() string
	Decode([]byte) error
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

type StatRet struct {
	Time  string
	Count int
}

func (r *StatRet) Prefix() string {
	return "T"
}

func (r *StatRet) Decode(src []byte) error {
	// *r = StatRet{}

	if len(src) < 4 {
		return fmt.Errorf("invalid message len for StatRet, expected %d actual %d", 4, len(src))
	}

	if src[0] != ':' {
		return fmt.Errorf("invalid message format for StatRet, content is %s", src)
	}

	src = src[1:]
	idx := bytes.LastIndexByte(src, ':')
	if idx == -1 {
		return fmt.Errorf("invalid message format for StatRet, content is %s", src)
	}

	count, err := strconv.Atoi(string(src[idx+1:]))
	if err != nil {
		return fmt.Errorf("invalid message format for StatRet, content is %s", src)
	}

	r.Time = string(src[:idx])
	r.Count = count
	return nil
}

// N:<Message>
type DebugRet struct {
	Message string
}

func (r *DebugRet) Prefix() string {
	return "N"
}

func (r *DebugRet) Decode(src []byte) error {
	// *r = DebugRet{}

	if len(src) < 2 {
		return fmt.Errorf("invalid message len for DebugRet, expected %d actual %d", 2, len(src))
	}

	if src[0] != ':' {
		return fmt.Errorf("invalid message format for DebugRet, content is %s", src)
	}

	r.Message = string(src[1:])
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
	// *r = ExtRet{}

	if len(src) < 4 {
		return fmt.Errorf("invalid message len for ExtRet, expected %d actual %d", 4, len(src))
	}

	if src[0] != ':' {
		return fmt.Errorf("invalid message format for ExtRet, content is %s", src)
	}

	src = src[1:]
	idx := bytes.IndexByte(src, ':')
	if idx == -1 {
		return fmt.Errorf("invalid message format for ExtRet, content is %s", src)
	}

	r.Key = string(src[:idx])
	r.Value = string(src[idx+1:])
	return nil
}

type UnknownRet struct {
	Content string
}

func (r *UnknownRet) Prefix() string {
	return "?"
}

func (r *UnknownRet) Decode(src []byte) error {
	// *r = UnknownRet{}

	r.Content = string(src)
	return nil
}
