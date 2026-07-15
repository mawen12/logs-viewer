package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/mawen12/logs-viewer/internal/constant"
)

func (app *Application) readInt(qs url.Values, key string, defaultValue int) int {
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

func (app *Application) readTime(qs url.Values, key string, defaultTime time.Time) time.Time {
	s := qs.Get(key)
	if s == "" {
		return defaultTime
	}

	// because index.log use this format: 2006-01-02-15:04
	t, err := time.Parse(constant.LayoutDateTimeMinuteDash, s)
	if err != nil {
		return defaultTime
	}

	return t
}

func (app *Application) readBool(qs url.Values, key string, defaultBool bool) bool {
	s := qs.Get(key)
	if s == "" {
		return defaultBool
	}

	return s == "true" || s == "1"
}

func (app *Application) readArray(qs url.Values, key string) []string {
	s := qs.Get(key)
	if s == "" {
		return nil
	}

	return strings.Split(s, ",")
}

func (app *Application) writeJson(w http.ResponseWriter, r *http.Request, data any) {
	js, err := json.MarshalIndent(data, "", "\t")
	if err != nil {
		app.serveError(w, err)
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

func (app *Application) serveError(w http.ResponseWriter, err error) {
	http.Error(w, err.Error(), http.StatusInternalServerError)
}
