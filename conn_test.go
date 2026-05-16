package main

import (
	"context"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestStart(t *testing.T) {
	tests := []struct {
		name       string
		pathPrefix string
		url        ParsedUrl
	}{
		{
			"cmd",
			"/tmp/test-logs-views",
			ParsedUrl{
				source:   "cmd://@127.0.0.1:22:/Users/mawen/logs/single.log",
				stream:   "127.0.0.1:22:/Users/mawen/logs/single.log",
				scheme:   "cmd",
				username: "",
				password: "",
				host:     "127.0.0.1:22",
				port:     "",
				log:      "/Users/mawen/logs/single.log",
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			conn, err := NewCmdConn(tt.pathPrefix, tt.url)
			require.NoError(t, err)

			mc, err := conn.Start(context.Background())
			require.NoError(t, err)

			mc, err = conn.Clean(context.Background())
			require.NoError(t, err)

			t.Log(mc)

			conn.Close()
		})
	}
}
