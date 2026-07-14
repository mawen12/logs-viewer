package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"sort"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
	"github.com/mawen12/logs-viewer/internal/model"
	"github.com/mawen12/logs-viewer/internal/ws"
)

type QueryResponse struct {
	MessageComposes []model.MessageCompose `json:"messageComposes"`
	Stats           []model.Stat           `json:"stats"`
}

func (app *Application) query(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	param := model.QueryParam{
		From:        app.readTime(query, "from", time.Time{}),
		To:          app.readTime(query, "to", time.Time{}),
		Refresh:     app.readBool(query, "refresh", false),
		Pattern:     query.Get("query"),
		MaxNumLines: app.readInt(query, "limit", 1),
	}

	fmt.Println("param ", param.String())

	queryResults := app.reader.Query(r.Context(), param)
	statsMap := make(map[int64]int, 0)
	for _, queryResult := range queryResults {
		for _, stat := range queryResult.Stats {
			_, ok := statsMap[stat.Time]
			if ok {
				statsMap[stat.Time] += stat.Count
			} else {
				statsMap[stat.Time] = stat.Count
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

	sortedStats := make([]model.Stat, 0, len(statsMap))
	for _, k := range keys {
		sortedStats = append(sortedStats, model.Stat{
			Time:  k,
			Count: statsMap[k],
		})
	}

	app.writeJson(w, r, QueryResponse{
		Stats:           sortedStats,
		MessageComposes: queryResults,
	})
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (app *Application) serveWs(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	ws.NewAndRegister(conn, nil)
}

func (app *Application) addSource(w http.ResponseWriter, r *http.Request) (interface{}, error) {
	var source model.Source
	if err := json.NewDecoder(r.Body).Decode(&source); err != nil {
		return nil, err
	}
	if source.Name == "" {
		return nil, errors.New("name is required")
	}
	if source.Group == "" {
		return nil, errors.New("group is required")
	}
	if source.Source == "" {
		return nil, errors.New("source is required")
	}

	_, err := app.storage.AddSource(r.Context(), source)
	return nil, err
}

func (app *Application) deleteSource(w http.ResponseWriter, r *http.Request) (interface{}, error) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return nil, err
	}

	if err := app.storage.DeleteSource(r.Context(), id); err != nil {
		return nil, err
	}

	return nil, nil
}

func (app *Application) updateSource(w http.ResponseWriter, r *http.Request) (interface{}, error) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return nil, err
	}

	var source model.Source
	if err := json.NewDecoder(r.Body).Decode(&source); err != nil {
		return nil, err
	}
	if source.Name == "" {
		return nil, errors.New("name is required")
	}
	if source.Group == "" {
		return nil, errors.New("group is required")
	}
	if source.Source == "" {
		return nil, errors.New("source is required")
	}

	err = app.storage.UpdateSource(r.Context(), id, source)
	return nil, err
}

func (app *Application) listSource(w http.ResponseWriter, r *http.Request) (interface{}, error) {
	return app.storage.ListSource(r.Context())
}

func (app *Application) listSourceTree(w http.ResponseWriter, r *http.Request) (interface{}, error) {
	result, err := app.storage.ListSource(r.Context())
	if err != nil {
		return nil, err
	}

	
}
