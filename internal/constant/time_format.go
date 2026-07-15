package constant

import (
	"strings"
	"time"
)

type timeToken struct {
	java string
	goLt string
	awk  string
}

// Keep longer tokens first to ensure greedy matching.
var timeTokens = []timeToken{
	{java: "yyyy", goLt: "2006", awk: "[0-9]{4}"},
	{java: "SSS", goLt: "000", awk: "[0-9]{3}"},
	{java: "sss", goLt: "000", awk: "[0-9]{3}"},
	{java: "yy", goLt: "06", awk: "[0-9]{2}"},
	{java: "MM", goLt: "01", awk: "[0-9]{2}"},
	{java: "dd", goLt: "02", awk: "[0-9]{2}"},
	{java: "HH", goLt: "15", awk: "[0-9]{2}"},
	{java: "mm", goLt: "04", awk: "[0-9]{2}"},
	{java: "ss", goLt: "05", awk: "[0-9]{2}"},
}

var javaToGoLayoutReplacer = strings.NewReplacer(
	"yyyy", "2006",
	"yy", "06",
	"MM", "01",
	"dd", "02",
	"HH", "15",
	"mm", "04",
	"sss", "000",
	"SSS", "000",
	"ss", "05",
)

type CompiledTimePattern struct {
	GoLayout string
	AwkRegex string
}

// CompileTimePattern converts a Java-style datetime pattern to both Go layout
// and a fully anchored awk-compatible ERE regex string.
func CompileTimePattern(pattern string) (CompiledTimePattern, error) {
	var goBuilder strings.Builder
	var awkBuilder strings.Builder

	for i := 0; i < len(pattern); {
		matched := false
		for _, token := range timeTokens {
			if strings.HasPrefix(pattern[i:], token.java) {
				goBuilder.WriteString(token.goLt)
				awkBuilder.WriteString(token.awk)
				i += len(token.java)
				matched = true
				break
			}
		}

		if matched {
			continue
		}

		ch := pattern[i]
		goBuilder.WriteByte(ch)
		awkBuilder.WriteString(escapeAwkRegexLiteralByte(ch))
		i++
	}

	return CompiledTimePattern{
		GoLayout: goBuilder.String(),
		AwkRegex: "^" + awkBuilder.String() + "$",
	}, nil
}

// ToAwkRegex converts a Java-style datetime pattern to an anchored awk regex.
func ToAwkRegex(pattern string) (string, error) {
	compiled, err := CompileTimePattern(pattern)
	if err != nil {
		return "", err
	}

	return compiled.AwkRegex, nil
}

func escapeAwkRegexLiteralByte(ch byte) string {
	// Escape awk ERE metacharacters and '/' for /.../ regex delimiters.
	switch ch {
	case '\\', '.', '^', '$', '|', '(', ')', '[', ']', '{', '}', '*', '+', '?', '/':
		return "\\" + string(ch)
	default:
		return string(ch)
	}
}

// ToGoTimeLayout converts a Java-style datetime pattern to a Go time layout.
func ToGoTimeLayout(pattern string) string {
	compiled, err := CompileTimePattern(pattern)
	if err != nil {
		return javaToGoLayoutReplacer.Replace(pattern)
	}

	return compiled.GoLayout
}

// ParseByPattern parses a datetime string by Java-style pattern.
func ParseByPattern(value, pattern string, loc *time.Location) (time.Time, error) {
	layout := ToGoTimeLayout(pattern)
	if loc == nil {
		return time.Parse(layout, value)
	}

	return time.ParseInLocation(layout, value, loc)
}

// MatchByPattern reports whether a datetime string matches the given Java-style pattern.
func MatchByPattern(value, pattern string, loc *time.Location) bool {
	_, err := ParseByPattern(value, pattern, loc)
	return err == nil
}
