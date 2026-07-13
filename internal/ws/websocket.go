package ws

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/mawen12/logs-viewer/pkg/background"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 512
)

type WebsocketEvent interface {
}

type WebsocketInitEvent struct {
	Uid  string `json:"uid"`
	Type string `json:"type"`
}

type WebsocketQueryEvent struct {
	Type    string `json:"type"`
	Stream  string `json:"stream"`
	Content string `json:"content"`
}

type Client struct {
	Hub *Hub

	uid  string
	Conn *websocket.Conn

	Send          chan WebsocketEvent
	ReadShutdown  chan struct{}
	WriteShutdown chan struct{}
}

func NewAndRegister(conn *websocket.Conn, newHub *Hub) *Client {
	if newHub == nil {
		newHub = hub
	}
	client := &Client{
		Hub:           newHub,
		uid:           uuid.New().String(),
		Conn:          conn,
		Send:          make(chan WebsocketEvent, 1024),
		ReadShutdown:  make(chan struct{}, 1),
		WriteShutdown: make(chan struct{}, 1),
	}

	client.Hub.Register <- client
	client.Send <- WebsocketInitEvent{Uid: client.uid, Type: "init"}
	background.Submit("writePump", client.WritePump)
	background.Submit("readPump", client.ReadPump)

	return client
}

func (c *Client) Close() {
	c.ReadShutdown <- struct{}{}
	c.WriteShutdown <- struct{}{}
}

func (c *Client) ReadPump() {
	var needUnregister = true
	defer func() {
		if needUnregister {
			c.Hub.unregister <- c
		}
		c.Conn.Close()
		close(c.ReadShutdown)
	}()
	c.Conn.SetReadLimit(maxMessageSize)
	c.Conn.SetReadDeadline(time.Now().Add(pongWait))
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for range c.ReadShutdown {
		fmt.Println("receive read shutdown")
		needUnregister = false
		return
	}
}

func (c *Client) WritePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
		close(c.WriteShutdown)
	}()

	for {
		select {
		case <-c.WriteShutdown:
			fmt.Println("receive write shutdown")
			return
		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		case message, ok := <-c.Send:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.Conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			bs, err := json.MarshalIndent(message, "", "\t")
			if err != nil {
				return
			}
			w.Write(bs)

			if err := w.Close(); err != nil {
				return
			}
		}
	}
}

type WebsocketEventWrapper struct {
	WebsocketEvent
	uid string
}
