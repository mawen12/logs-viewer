package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 512
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Client struct {
	hub *Hub

	uid  string
	conn *websocket.Conn

	send          chan WebsocketEvent
	readShutdown  chan struct{}
	writeShutdown chan struct{}
}

func (c *Client) Close() {
	c.readShutdown <- struct{}{}
	c.writeShutdown <- struct{}{}
}

func (c *Client) readPump() {
	var needUnregister = true
	defer func() {
		if needUnregister {
			c.hub.unregister <- c
		}
		c.conn.Close()
		close(c.readShutdown)
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		select {
		case <-c.readShutdown:
			fmt.Println("receive read shutdown")
			needUnregister = false
			return
		default:
			_, _, err := c.conn.ReadMessage()
			if err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					log.Printf("error: %v", err)
				}
				return
			}
			// message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))
			// c.hub.broadcast <- message
		}
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
		close(c.writeShutdown)
	}()

	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
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
		case <-c.writeShutdown:
			fmt.Println("receive write shutdown")
			return
		default:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

type Hub struct {
	ids     map[string]*Client
	clients map[*Client]bool

	broadcast  chan WebsocketEventWrapper
	register   chan *Client
	unregister chan *Client
	shutdown   chan struct{}
}

type WebsocketEventWrapper struct {
	WebsocketEvent
	uid string
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan WebsocketEventWrapper, 10),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		ids:        make(map[string]*Client),
		clients:    make(map[*Client]bool),
		shutdown:   make(chan struct{}, 1),
	}
}

func (h *Hub) QueryNotify(ctx context.Context, stream, content string) {
	if uid, ok := ctx.Value("uid").(string); ok && uid != "" {
		h.broadcast <- WebsocketEventWrapper{uid: uid, WebsocketEvent: WebsocketQueryEvent{
			Type:    "query",
			Stream:  stream,
			Content: content,
		}}
	}
}

func (h *Hub) Notify(uid string, event WebsocketQueryEvent) {
	h.broadcast <- WebsocketEventWrapper{uid: uid, WebsocketEvent: event}
}

func (h *Hub) Close() {
	h.shutdown <- struct{}{}
	close(h.register)
	close(h.unregister)
	close(h.broadcast)
	close(h.shutdown)
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.ids[client.uid] = client
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				delete(h.ids, client.uid)
				close(client.send)
			}
		case message := <-h.broadcast:
			for client := range h.clients {
				if client.uid == message.uid {
					select {
					case client.send <- message.WebsocketEvent:
					default:
						close(client.send)
						delete(h.clients, client)
						delete(h.ids, client.uid)
					}
				}
			}
		case <-h.shutdown:
			for client := range h.clients {
				background("client async close", client.Close)
			}
			fmt.Println("receive shutdown")
			return
		}
	}
}
