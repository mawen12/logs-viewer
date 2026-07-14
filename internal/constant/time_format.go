package constant

import (
	"strings"
	"time"
)

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

// ToGoTimeLayout converts a Java-style datetime pattern to a Go time layout.
func ToGoTimeLayout(pattern string) string {
	return javaToGoLayoutReplacer.Replace(pattern)
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
