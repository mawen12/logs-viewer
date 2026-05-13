package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"time"
)

type serverConfig struct {
	port    uint32
	timeout time.Duration
}

func server(config serverConfig) error {
	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", config.port),
		Handler: routes(config),
		// ErrorLog: "",
	}

	fmt.Println("starting server", srv.Addr)
	log.Println("starting server ", srv.Addr)

	return srv.ListenAndServe()
}

func routes(config serverConfig) http.Handler {
	mux := &http.ServeMux{}

	mux.HandleFunc("GET /query", query)

	return recoverPanic(logRequest(crossOrigin(mux)))
}

func recoverPanic(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				w.Header().Set("Connection", "Close")
				serveError(w, fmt.Errorf("%s", err))
			}
		}()

		next.ServeHTTP(w, r)
	})
}

func logRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "start", time.Now())

		var (
			ip     = r.RemoteAddr
			proto  = r.Proto
			method = r.Method
			uri    = r.URL.RequestURI()
		)

		log.Println("handle request", "ip", ip, "proto", proto, "method", method, "uri", uri)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func crossOrigin(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type,AccessToken,X-CSRF-Token, Authorization, Token,X-Token,X-User-Id,X-Requested-With")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS,DELETE,PUT")
		w.Header().Set("Access-Control-Expose-Headers", "Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Content-Type, Logs-Viewer-Cost-Ms")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		next.ServeHTTP(w, r)
	})
}

func query(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	param := QueryParam{
		From:        readTime(query, "from", time.Time{}),
		To:          readTime(query, "to", time.Time{}),
		Pattern:     query.Get("query"),
		MaxNumLines: readInt(query, "limit", 1),
	}

	fmt.Println("param ", param.String())

	rets := reader.Query(r.Context(), param)

	writeJson(w, r, rets)
}

func readInt(qs url.Values, key string, defaultValue int) int {
	s := qs.Get(key)
	if s == "" {
		return defaultValue
	}

	i, err := strconv.Atoi(s)
	if err != nil {
		return defaultValue
	}

	return i
}

func readTime(qs url.Values, key string, defaultTime time.Time) time.Time {
	s := qs.Get(key)
	if s == "" {
		return defaultTime
	}

	// because index.log use this format: 2006-01-02-15:04
	t, err := time.Parse("2006-01-02-15:04", s)
	if err != nil {
		return defaultTime
	}

	return t
}

func writeJson(w http.ResponseWriter, r *http.Request, data any) {
	js, err := json.MarshalIndent(data, "", "\t")
	if err != nil {
		serveError(w, err)
		return
	}

	js = append(js, '\n')

	w.Header().Set("Content-Type", "application/json")
	{
		if start, ok := r.Context().Value("start").(time.Time); ok {
			w.Header().Set("Logs-Viewer-Cost-Ms", fmt.Sprint(time.Since(start).Milliseconds()))
		}
	}

	w.WriteHeader(200)
	w.Write(js)
}

func serveError(w http.ResponseWriter, err error) {
	http.Error(w, err.Error(), http.StatusInternalServerError)
}
