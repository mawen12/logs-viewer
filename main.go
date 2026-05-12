package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
)

var configPath = flag.String("config", "", "config file path")
var failFast = flag.Bool("fail-fast", false, "fail fast when parse config file line")
var logfile = flag.String("logfile", "logs.log", "log record file")

var (
	file   *os.File
	reader *Reader
)

func main() {
	defer func() {
		if file != nil {
			file.Close()
		}

		if reader != nil {
			reader.Close()
		}
	}()

	flag.Parse()

	if configPath == nil {
		panic("config file must provided")
	}

	if logfile != nil {
		if err := os.MkdirAll("logs", 0755); err != nil {
			log.Printf("Failed to create log directory: %v", err)
		} else {
			dir, err := os.Getwd()
			if err != nil {
				log.Printf("Failed to access directory: %v", err)
			} else {
				file, err = os.OpenFile(fmt.Sprintf("%s/logs/%s", dir, *logfile), os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
				if err != nil {
					log.Printf("Failed to open log file: %v", err)
				} else {
					log.SetOutput(file)
				}
			}
		}
	}

	reader = NewReader(*configPath)
	if err := reader.Read(); err != nil {
		panic(err)
	}
	defer reader.Close()

	reader.Debug()

	if err := reader.Parse(); err != nil {
		panic(err)
	}

	ctx := context.Background()
	if err := reader.Connect(ctx); err != nil {
		panic(err)
	}

	log.Println("Connect success")

	param := QueryParam{
		Pattern:     "/INFO/",
		MaxNumLines: 1,
	}
	rets := reader.Query(ctx, param)
	print(rets)

	param = QueryParam{
		Pattern:     "/INFO/",
		MaxNumLines: 2,
	}
	rets = reader.Query(ctx, param)
	print(rets)

	// param = QueryParam{
	// 	Pattern:     "/INFO/",
	// 	MaxNumLines: 1,
	// 	LineUtil:    22,
	// }
	// rets = reader.Query(ctx, param)
	// print(rets)

	fmt.Println("start clean the message")
	rets = reader.Clean(ctx)
	print(rets)
}

func print(rets []MessageComposeAndErr) {
	for _, ret := range rets {
		if ret.Err != nil {
			fmt.Println("[ERROR]", ret.Err)
		} else {
			for _, log := range ret.MessageCompose.Logs {
				fmt.Printf("[%s] %d:%s\n", log.stream, log.num, log.message)
			}
		}
	}
}
