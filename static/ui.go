package ui

import (
	"embed"
	"io/fs"
	"net/http"
)

//go:embed index.html assets favicon.svg icons.svg
var ui embed.FS

func GetFilesystem() http.FileSystem {
	sub, err := fs.Sub(ui, ".")
	if err != nil {
		panic(err)
	}
	return http.FS(sub)
}

func GetAssetsFilesystem() http.FileSystem {
	sub, err := fs.Sub(ui, "assets")
	if err != nil {
		panic(err)
	}
	return http.FS(sub)
}

func GetHandler() http.Handler {
	return http.FileServer(GetFilesystem())
}
