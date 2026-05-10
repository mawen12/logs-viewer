package main

import (
	"flag"
)

var configPath = flag.String("config", "", "config file path")
var failFast = flag.Bool("fail-fast", false, "fail fast when parse config file line")

func main() {
	flag.Parse()

	if configPath == nil {
		panic("config file must provided")
	}

	reader := NewReader(*configPath)
	if err := reader.Read(); err != nil {
		panic(err)
	}

	reader.Debug()

	if err := reader.Parse(); err != nil {
		panic(err)
	}

	if err := reader.Connect(); err != nil {
		panic(err)
	}

	
}
