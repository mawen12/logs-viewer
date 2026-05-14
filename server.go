package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"sort"
	"strconv"
	"time"

	ui "github.com/mawen12/logs-viewer/static"
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

	mux.HandleFunc("GET /", ui.GetHandler().ServeHTTP)
	mux.HandleFunc("GET /static/*path", http.StripPrefix("static", ui.GetHandler()).ServeHTTP)
	mux.HandleFunc("GET /favicon.svg", ui.GetHandler().ServeHTTP)
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

type QueryResponse struct {
	MessageComposes []MessageCompose `json:"messageComposes"`
	Stats           []Stat           `json:"stats"`
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

	queryResults := reader.Query(r.Context(), param)
	statsMap := make(map[int64]Stat, 0)
	for _, queryResult := range queryResults {
		for _, stat := range queryResult.Stats {
			v, ok := statsMap[stat.Time]
			if ok {
				v.Count += stat.Count
			} else {
				statsMap[stat.Time] = stat
			}
		}
	}

	keys := make([]int64, 0, len(statsMap))
	for k := range statsMap {
		keys = append(keys, k)
	}

	sort.Slice(keys, func(i, j int) bool {
		return keys[i] < keys[j]
	})

	sortedStats := make([]Stat, 0, len(statsMap))
	for _, k := range keys {
		sortedStats = append(sortedStats, statsMap[k])
	}

	writeJson(w, r, QueryResponse{
		Stats:           sortedStats,
		MessageComposes: queryResults,
	})
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
