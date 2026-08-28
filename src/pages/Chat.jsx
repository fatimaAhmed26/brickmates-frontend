import socket from '../socket'
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { index as getMessages, conversations } from '../services/message'

const Chat = (props) => {
    const { recipientId } = useParams()
    const roomId = [props.user._id, recipientId].sort().join('_')

    const [isConnected, setIsConnected] = useState(socket.connected)
    const [formData, setFormData] = useState('')
    const [messages, setMessages] = useState([])
    const [recipient, setRecipient] = useState(null)

    useEffect(() => {
    const fetchRecipient = async () => {
        const data = await conversations()

        const conversation = data.find(
            convo => convo.otherUser?._id === recipientId
        )

        if (conversation) {
            setRecipient(conversation.otherUser)
        }
    }

    fetchRecipient()
}, [recipientId])

    useEffect(() => {
        const fetchHistory = async () => {
            const history = await getMessages(roomId)
            setMessages(history)
        }
        fetchHistory()
    }, [roomId])

    useEffect(() => {
        const handleConnect = () => {
            console.log('Connected to chat: ', socket.id)
            setIsConnected(true)
            socket.emit('join room', roomId)
        }   

        const handleDisconnect = () => {
            console.log('Disconnected from chat')
            setIsConnected(false)
        }

        const handleChatMessage = (newMessage) => {
            console.log('Chat event received from server: ', newMessage)
            setMessages((previousMessages) => {
                return [...previousMessages, newMessage]
            })
        }

        socket.on('connect', handleConnect)
        socket.on('disconnect', handleDisconnect)
        socket.on('chat message', handleChatMessage)

        socket.connect()

        return () => {
            console.log('Leaving chat and closing socket')
            socket.emit('leave room', roomId)
            socket.off('connect', handleConnect)
            socket.off('disconnect', handleDisconnect)
            socket.off('chat message', handleChatMessage)
            socket.disconnect()
        }
    }, [roomId])

    const handleChange = (event) => {
        setFormData(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (!formData.trim()) {
            return
        }

        const messageData = {
            username: props.user.username,
            sender: props.user._id,
            text: formData.trim(),
            roomId,
        }

        console.log('Chat form submitted:', messageData)
        socket.emit('chat message', messageData)

        setFormData('')
    }

    return (
        <main className="chat">
            <div className='chat-header'>
                <Link to={`/profile/${recipientId}`} className="chat-title" > 
                {recipient?.username || 'Loading...'}
                </Link>
            <p className="chat-status">
                Status: { isConnected ? 'Connected' : 'Disconnected'}
            </p>
            </div>
            

            <section className="chat-messages">
                <h2 className="messages-title">Messages</h2>

                {messages.length === 0 && (
                    <p className="no-messages">No messages yet</p>
                )}
                {messages.map(message => {

                const isSent = String(message.sender) === String(props.user._id)

                 return (
                 <article
                  className={isSent ? "message message-sent" : "message message-received"}
                  key={message._id} >
                 <strong className="message-username">{message.username}</strong>
                 <p className="message-text">{message.text}</p>
                  </article>
                  ) 
            })}
            </section>

            <form className="message-form" onSubmit={handleSubmit}>
                <button type="button" className="attachment-button">
                +
            </button>
                Message:
                <input className="message-input" type="text" name='message' value={formData} onChange={handleChange} />
                <button className="send-button" type='submit' disabled={!isConnected}>➤</button>
            </form>
        </main>
    )
}

export default Chat
