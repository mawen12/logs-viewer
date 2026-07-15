package constant

import "testing"

func TestCompileTimePattern_DateOnly(t *testing.T) {
	compiled, err := CompileTimePattern("yyyy-MM-dd")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if compiled.GoLayout != "2006-01-02" {
		t.Fatalf("unexpected Go layout: %q", compiled.GoLayout)
	}

	if compiled.AwkRegex != "^[0-9]{4}-[0-9]{2}-[0-9]{2}$" {
		t.Fatalf("unexpected awk regex: %q", compiled.AwkRegex)
	}
}

func TestCompileTimePattern_DateTimeMillis(t *testing.T) {
	compiled, err := CompileTimePattern("yyyy-MM-dd HH:mm:ss,SSS")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if compiled.GoLayout != "2006-01-02 15:04:05,000" {
		t.Fatalf("unexpected Go layout: %q", compiled.GoLayout)
	}

	expected := "^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3}$"
	if compiled.AwkRegex != expected {
		t.Fatalf("unexpected awk regex: %q", compiled.AwkRegex)
	}
}

func TestToAwkRegex_EscapeLiterals(t *testing.T) {
	regex, err := ToAwkRegex("[yy-MM-dd ss.SSS]")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	expected := "^\\[[0-9]{2}-[0-9]{2}-[0-9]{2} [0-9]{2}\\.[0-9]{3}\\]$"
	if regex != expected {
		t.Fatalf("unexpected awk regex: %q", regex)
	}
}

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
