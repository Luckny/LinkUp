package chat

import (
	"github.com/Luckny/LinkUp/pkg/tracer"
)

type ChatRoom struct {
	// Channel that holds incomming messages for the room
	MsgQueue chan *Message

	// channel for clients joining the room
	Join chan *Client

	// chanell for clients leaving the room
	Leave chan *Client

	// Holds all active clients in this room
	Clients map[*Client]bool
}

func NewChatRoom() *ChatRoom {
	return &ChatRoom{
		MsgQueue: make(chan *Message),
		Join:     make(chan *Client),
		Leave:    make(chan *Client),
		Clients:  make(map[*Client]bool),
	}
}

func (chatRoom *ChatRoom) Run() {
	for {
		select {
		case client := <-chatRoom.Join:
			// client joining the room
			chatRoom.Clients[client] = true
			tracer.Trace("New client joined. ", client.Id)

		case client := <-chatRoom.Leave:
			// client leaving the room
			delete(chatRoom.Clients, client)
			// close the client's sending channel
			close(client.Send)
			tracer.Trace("Client left.")

		// message in the msg in the queue
		case msg := <-chatRoom.MsgQueue:
			// broadcast message to all clients
			for client := range chatRoom.Clients {
				if msg.Type == "handshake" && msg.Id != client.Id {
					continue
				}
				select {
				case client.Send <- msg:
					// send the message
					tracer.Trace(" -- Message sent to client ", client.Id)
				default:
					// failed to send
					delete(chatRoom.Clients, client)
					close(client.Send)
					tracer.Trace(" -- Failed to send message, closing client")
				}
			}
		}
	}
}
