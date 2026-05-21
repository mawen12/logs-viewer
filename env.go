package main

import (
	"os"
	"strconv"
)

func getEnvBool(key string, def bool) bool {
	valueStr := os.Getenv(key)
	if valueStr == "" {
		return def
	}

	value, err := strconv.ParseBool(valueStr)
	if err != nil {
		return def
	}

	return value
}

func getEnvInt(key string, def int) int {
	valueStr := os.Getenv(key)
	if valueStr == "" {
		return def
	}

	value, err := strconv.Atoi(valueStr)
	if err != nil {
		return def
	}

	return value
}

func getEnv(key, def string) string {
	value := os.Getenv(key)
	if value == "" {
		return def
	}

	return value
}
