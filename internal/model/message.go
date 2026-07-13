package model

import (
	"bytes"
	"fmt"
	"strconv"
	"time"

	"github.com/mawen12/logs-viewer/internal/constant"
)

type QueryParam struct {
	Pattern     string
	From        time.Time
	To          time.Time
	Refresh     bool
	LineUtil    int
	MaxNumLines int
	extParam    map[string]QueryParam
}

func (param QueryParam) FromStr() string {
	if param.From.IsZero() {
		return ""
	}
	return param.From.Format(constant.LayoutDateTimeMinuteDash)
}

func (param QueryParam) ToStr() string {
	if param.To.IsZero() {
		return ""
	}
	return param.To.Format(constant.LayoutDateTimeMinuteDash)
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
	Stream string  `json:"stream"`
	Logs   []*Log  `json:"logs"`
	Stats  []Stat  `json:"stats"`
	Errs   []error `json:"errs"`
}

type Log struct {
	Time       int64  `json:"time"`
	Level      string `json:"level"`
	ThreadName string `json:"threadName"`
	Num        int    `json:"num"`
	Message    string `json:"message"`
}

type Stat struct {
	Time  int64 `json:"time"`
	Count int   `json:"count"`
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
		return fmt.Errorf("invalid message len for BeginRet<%s>, expected %d actual %d", src, 0, len(src))
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
		return fmt.Errorf("invalid message len for EndRet<%s>, expected %d actual %d", src, 0, len(src))
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
		return fmt.Errorf("invalid message len for ErrRet<%s>, expected %d actual %d", src, 4, len(src))
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
		return fmt.Errorf("invalid message len for DataRet<%s>, expected %d actual %d", src, 4, len(src))
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
	Time  time.Time
	Count int
}

func (r *StatRet) Prefix() string {
	return "T"
}

func (r *StatRet) Decode(src []byte) error {
	// *r = StatRet{}

	if len(src) < 4 {
		return fmt.Errorf("invalid message len for StatRet<%s>, expected %d actual %d", src, 4, len(src))
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

	r.Time, err = time.Parse("2006-01-02 15:04", string(src[:idx]))
	if err != nil {
		return fmt.Errorf("invalid message format for StatRet, content is %s", src)
	}
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
		return fmt.Errorf("invalid message len for DebugRet<%s>, expected %d actual %d", src, 2, len(src))
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
		return fmt.Errorf("invalid message len for ExtRet<%s>, expected %d actual %d", src, 4, len(src))
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
