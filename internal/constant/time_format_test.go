package constant

import "testing"

func TestMatchByPattern(t *testing.T) {
	pattern := "[yy-MM-dd ss.sss]"
	value := "[26-07-14 59.123]"

	if !MatchByPattern(value, pattern, nil) {
		t.Fatalf("expected value to match pattern: pattern=%q value=%q", pattern, value)
	}
}

func TestMatchByPattern_InvalidValue(t *testing.T) {
	pattern := "[yy-MM-dd ss.sss]"
	value := "[26-7-14 59.123]"

	if MatchByPattern(value, pattern, nil) {
		t.Fatalf("expected value not to match pattern: pattern=%q value=%q", pattern, value)
	}
}
