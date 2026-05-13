package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
)

var (
	configPath = flag.String("config", "", "config file path")
	failFast   = flag.Bool("fail-fast", false, "fail fast when parse config file line")
	logfile    = flag.String("logfile", "logs.log", "log record file")
	port       = flag.Int("port", 9081, "server port")
	debug      = flag.Bool("debug", false, "debug")
)

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
	if err := reader.LoadConfig(); err != nil {
		panic(err)
	}

	if *debug {
		reader.Debug()
	}

	if err := reader.ParseConfig(); err != nil {
		panic(err)
	}

	ctx := context.Background()
	if err := reader.Connect(ctx); err != nil {
		panic(err)
	}

	log.Println("Connect success")

	config := serverConfig{
		port: uint32(*port),
	}
	if err := server(config); err != nil {
		log.Fatal(err)
	}

	// from, err := time.Parse("2006-01-02-15:04", "2026-05-13-11:47")
	// if err != nil {
	// 	panic(err)
	// }
	// to, err := time.Parse("2006-01-02-15:04", "2026-05-13-12:47")
	// if err != nil {
	// 	panic(err)
	// }

	// param := QueryParam{
	// 	Pattern:     "/INFO/",
	// 	From:        from,
	// 	To:          to,
	// 	MaxNumLines: 1,
	// }
	// rets := reader.Query(ctx, param)
	// print(rets)

	// param = QueryParam{
	// 	Pattern:     "/INFO/",
	// 	MaxNumLines: 2,
	// }
	// rets = reader.Query(ctx, param)
	// print(rets)

	// param = QueryParam{
	// 	Pattern:     "/INFO/",
	// 	MaxNumLines: 1,
	// 	LineUtil:    22,
	// }
	// rets = reader.Query(ctx, param)
	// print(rets)

	// fmt.Println("start clean the message")
	// rets = reader.Clean(ctx)
	// print(rets)
}

// func print(rets []MessageComposeAndErr) {
// 	for _, ret := range rets {
// 		if ret.Err != nil {
// 			fmt.Println("[ERROR]", ret.Err)
// 		} else {
// 			for _, log := range ret.MessageCompose.Logs {
// 				fmt.Printf("[%s] %d:%s\n", log.stream, log.num, log.message)
// 			}
// 		}
// 	}
// }
