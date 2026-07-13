package main

import (
	"net/http"

	"github.com/justinas/alice"
	ui "github.com/mawen12/logs-viewer/static"
)

func (app *Application) routes() http.Handler {
	mux := &http.ServeMux{}

	mux.HandleFunc("/", ui.GetHandler().ServeHTTP)
	mux.HandleFunc("GET /static/*path", http.StripPrefix("static", ui.GetHandler()).ServeHTTP)
	mux.HandleFunc("GET /favicon.svg", ui.GetHandler().ServeHTTP)
	mux.HandleFunc("GET /query", app.query)

	// sources
	{
		mux.HandleFunc("GET /api/sources", app.wrapper(app.listSource))
		mux.HandleFunc("DELETE /api/sources/{id}", app.wrapper(app.deleteSource))
		mux.HandleFunc("POST /api/sources", app.wrapper(app.addSource))
		mux.HandleFunc("PUT /api/sources/{id}", app.wrapper(app.updateSource))
	}

	mux.HandleFunc("/ws", app.serveWs)
	// if *debug {
	// 	expvar.Publish("goroutines", expvar.Func(func() any {
	// 		return runtime.NumGoroutine()
	// 	}))
	// 	expvar.Publish("background-goroutines", expvar.Func(func() any {
	// 		done, total := group.Progress()
	// 		return fmt.Sprintf("%d/%d", done, total)
	// 	}))
	// 	expvar.Publish("websockets", expvar.Func(func() any {
	// 		return len(hub.clients)
	// 	}))
	// 	mux.HandleFunc("GET /debug/vars", expvar.Handler().ServeHTTP)
	// }

	standard := alice.New(app.recoverPanic, app.logRequest, app.crossOrigin, app.uidWebsocket)

	return standard.Then(mux)
}
