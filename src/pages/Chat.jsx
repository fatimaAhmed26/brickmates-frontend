import socket from '../socket'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { index as getMessages } from '../services/message'

const Chat = (props) => {
    const { recipientId } = useParams()
    const roomId = [props.user._id, recipientId].sort().join('_')

    const [isConnected, setIsConnected] = useState(socket.connected)
    const [formData, setFormData] = useState('')
    const [messages, setMessages] = useState([])

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
            senderId: props.user._id,
            text: formData.trim(),
            roomId,
        }

        console.log('Chat form submitted:', messageData)
        socket.emit('chat message', messageData)

        setFormData('')
    }

    return (
        <main>
            <h1>Hoot Chat</h1>
            <p>
                Status: { isConnected ? 'Connected' : 'Disconnected'}
            </p>

            <section>
                <h2>Messages</h2>

                {messages.length === 0 && (
                    <p>No messages yet. Start the conversation!</p>
                )}
                {messages.map(message => (
                    <article key={message._id}>
                        <strong>{message.username}</strong>
                        <p>{message.text}</p>
                    </article>
                ))}
            </section>

            <form onSubmit={handleSubmit}>
                Message:
                <input type="text" name='message' value={formData} onChange={handleChange} />
                <button type='submit' disabled={!isConnected}>SEND</button>
            </form>
        </main>
    )
}

export default Chat
