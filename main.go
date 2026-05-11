package main

import (
	"flag"
	"log"
	"os"
)

var configPath = flag.String("config", "", "config file path")
var failFast = flag.Bool("fail-fast", false, "fail fast when parse config file line")
var logfile = flag.String("logfile", "", "log record file")

func main() {
	flag.Parse()

	if configPath == nil {
		panic("config file must provided")
	}

	if logfile != nil {
		if err := os.MkdirAll("logs", 0755); err != nil {
			log.Printf("Failed to create log directory: %v", err)
		} else {
			f, err := os.OpenFile(*logfile, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
			if err != nil {
				log.Printf("Failed to open log file: %v", err)
			} else {
				defer f.Close()
				log.SetOutput(f)
			}
		}
	}

	reader := NewReader(*configPath)
	if err := reader.Read(); err != nil {
		panic(err)
	}
	defer reader.Close()

	reader.Debug()

	if err := reader.Parse(); err != nil {
		panic(err)
	}

	if err := reader.Connect(); err != nil {
		panic(err)
	}

	log.Println("Connect success")

	param := QueryParam{
		Pattern:     "/INFO/",
		MaxNumLines: 1,
	}
	if err := reader.Query(param); err != nil {
		panic(err)
	}
}
