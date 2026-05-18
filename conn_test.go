package main

import (
	"context"
	"testing"

	"github.com/stretchr/testify/require"
)

type testCase struct {
	name       string
	pathPrefix string
	url        ParsedUrl
}

func TestStart(t *testing.T) {
	tests := []testCase{
		{
			"cmd",
			"/tmp/test-logs-viewer",
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

func TestIndex(t *testing.T) {
	tests := []testCase{
		{
			"cmd-single",
			"/tmp/test-logs-viewer",
			ParsedUrl{
				source:   "cmd://@127.0.0.1:22:/home/mawen/logs/single.log",
				stream:   "127.0.0.1:22:/home/mawen/logs/single.log",
				scheme:   "cmd",
				username: "",
				password: "",
				host:     "127.0.0.1:22",
				port:     "",
				log:      "/home/mawen/logs/single.log",
			},
		},
		{
			"cmd-multi",
			"/tmp/test-logs-viewer",
			ParsedUrl{
				source:   "cmd://@127.0.0.1:22:/home/mawen/logs/multi.log",
				stream:   "127.0.0.1:22:/home/mawen/logs/multi.log",
				scheme:   "cmd",
				username: "",
				password: "",
				host:     "127.0.0.1:22",
				port:     "",
				log:      "/home/mawen/logs/multi.log",
			},
		},
		{
			"cmd-multi",
			"/tmp/test-logs-viewer",
			ParsedUrl{
				source:   "cmd://@127.0.0.1:22:/home/mawen/logs/multi-2.log",
				stream:   "127.0.0.1:22:/home/mawen/logs/multi-2.log",
				scheme:   "cmd",
				username: "",
				password: "",
				host:     "127.0.0.1:22",
				port:     "",
				log:      "/home/mawen/logs/multi-2.log",
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			conn, err := NewCmdConn(tt.pathPrefix, tt.url)
			require.NoError(t, err)

			mc, err := conn.Start(context.Background())
			require.NoError(t, err)

			mc, err = conn.Index(context.Background())
			require.NoError(t, err)

			// mc, err = conn.Clean(context.Background())
			// require.NoError(t, err)

			t.Log(mc)

			conn.Close()
		})
	}
}
