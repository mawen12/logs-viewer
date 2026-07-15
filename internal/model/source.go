package model

type Source struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Group   string `json:"group"`
	Source  string `json:"source"`
	Pattern string `json:"pattern"`
}
