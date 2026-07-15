package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/mawen12/logs-viewer/internal/ws"
	"github.com/mawen12/logs-viewer/pkg/background"
)

func (app *Application) Serve() error {
	srv := &http.Server{
		Addr:         app.config.Web.SocketAddress(),
		Handler:      app.routes(),
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		// ErrorLog: "",
	}

	shutdownError := make(chan error)

	// tip: this cannot use background, because it wait `group` to end, otherwise then into infinite loop
	go func() {
		quit := make(chan os.Signal, 1)
		signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
		s := <-quit

		log.Println("shutting down server quit ", s.String())

		app.conn.Clean(context.Background())

		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		err := srv.Shutdown(ctx)
		if err != nil {
			shutdownError <- err
		}
		// hub.Close()
		ws.Close()

		done, total := background.Progress()
		log.Println("completing background tasks ", srv.Addr, fmt.Sprintf("%d/%d", done, total))

		background.Wait()
		shutdownError <- nil
	}()

	log.Println("starting server ", srv.Addr)

	err := srv.ListenAndServe()
	if !errors.Is(err, http.ErrServerClosed) {
		return err
	}
	return nil
}
