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

func server(port uint32) error {
	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: routes(),
		// ErrorLog: "",
	}

	fmt.Println("starting server", srv.Addr)
	log.Println("starting server ", srv.Addr)

	return srv.ListenAndServe()
}

func routes() http.Handler {
	mux := &http.ServeMux{}

	mux.HandleFunc("GET /query", query)

	return mux
}

func query(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	param := QueryParam{
		From:        readTime(query, "from", time.Time{}),
		To:          readTime(query, "to", time.Time{}),
		Pattern:     query.Get("pattern"),
		MaxNumLines: readInt(query, "limit", 1),
	}

	fmt.Println("param ", param.String())

	ctx := context.Background()
	rets := reader.Query(ctx, param)

	writeJson(w, rets)
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

	t, err := time.Parse("2006-01-02 15:04:05", s)
	if err != nil {
		return defaultTime
	}

	return t
}

func writeJson(w http.ResponseWriter, data any) {
	js, err := json.MarshalIndent(data, "", "\t")
	if err != nil {
		serveError(w, err)
		return
	}

	js = append(js, '\n')

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	w.Write(js)
}

func serveError(w http.ResponseWriter, err error) {
	http.Error(w, err.Error(), http.StatusInternalServerError)
}
