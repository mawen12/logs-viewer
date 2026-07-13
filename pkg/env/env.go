package env

import (
	"os"
	"strconv"
)

func GetBool(key string, def bool) bool {
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

func GetInt(key string, def int) int {
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

func Get(key, def string) string {
	value := os.Getenv(key)
	if value == "" {
		return def
	}

	return value
}
