package ws

import (
	"context"
	"fmt"

	"github.com/mawen12/logs-viewer/pkg/background"
)

var hub = NewHub()

type Hub struct {
	ids     map[string]*Client
	clients map[*Client]bool

	broadcast  chan WebsocketEventWrapper
	Register   chan *Client
	unregister chan *Client
	shutdown   chan struct{}

	cancelFunc context.CancelFunc
}

func NewHub() *Hub {
	hub := &Hub{
		broadcast:  make(chan WebsocketEventWrapper, 1024),
		Register:   make(chan *Client),
		unregister: make(chan *Client),
		ids:        make(map[string]*Client),
		clients:    make(map[*Client]bool),
		shutdown:   make(chan struct{}, 1),
	}
	go hub.run()
	return hub
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

func (h *Hub) Close() {
	h.shutdown <- struct{}{}
	close(h.Register)
	close(h.unregister)
	close(h.broadcast)
	close(h.shutdown)
}

func (h *Hub) run() {
	for {
		select {
		case <-h.shutdown:
			for client := range h.clients {
				background.Submit("client async close", client.Close)
			}
			fmt.Println("receive shutdown")
			return
		case client := <-h.Register:
			h.ids[client.uid] = client
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				delete(h.ids, client.uid)
				close(client.Send)
			}
		case message := <-h.broadcast:
			if client, ok := h.ids[message.uid]; ok {
				select {
				case client.Send <- message.WebsocketEvent:
				default:
					close(client.Send)
					delete(h.clients, client)
					delete(h.ids, client.uid)
				}
			}
		}
	}
}

func Default() *Hub {
	return hub
}

func QueryNotify(ctx context.Context, stream, content string) {
	hub.QueryNotify(ctx, stream, content)
}

func Close() {
	hub.Close()
}

