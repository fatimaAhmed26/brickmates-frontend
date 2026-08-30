import socket from '../socket'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { show, update } from '../services/buildmatch'
import { index as getMessages } from '../services/message'

const BuildMatchPage = ({ user }) => {
    const { matchId } = useParams()
    const roomId = `match_${matchId}`

    const [match, setMatch] = useState(null)
    const [isConnected, setIsConnected] = useState(socket.connected)
    const [formData, setFormData] = useState('')
    const [messages, setMessages] = useState([])

    useEffect(() => {
        const fetchMatch = async () => {
            const data = await show(matchId)
            setMatch(data)
        }
        fetchMatch()
    }, [matchId])

    useEffect(() => {
        const fetchHistory = async () => {
            const history = await getMessages(roomId)
            setMessages(history)
        }
        fetchHistory()
    }, [roomId])

    useEffect(() => {
        const handleConnect = () => {
            setIsConnected(true)
            socket.emit('join room', roomId)
        }

        const handleDisconnect = () => {
            setIsConnected(false)
        }

        const handleChatMessage = (newMessage) => {
            setMessages((previousMessages) => [...previousMessages, newMessage])
        }

        socket.on('connect', handleConnect)
        socket.on('disconnect', handleDisconnect)
        socket.on('chat message', handleChatMessage)

        socket.connect()

        return () => {
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
        if (!formData.trim()) return

        const messageData = {
            username: user.username,
            sender: user._id,
            text: formData.trim(),
            roomId,
        }

        socket.emit('chat message', messageData)
        setFormData('')
    }

    const handleStepChange = async (delta) => {
        const newStep = Math.max(0, (match.currentStep || 0) + delta)
        const updatedMatch = await update(matchId, { currentStep: newStep })
        setMatch(updatedMatch)
    }

    if (!match) return <p>Loading...</p>

    const partner = match.users.find((u) => u._id !== user._id)

    return (
        <main className="build-match">
            <header className="match-header">
                <h1>{match.setName || match.setNum}</h1>
                <p>Building with {partner?.username}</p>
            </header>

            <section className="checklist">
                <p>Step {match.currentStep || 0} of {match.totalSteps || '?'}</p>
                <button onClick={() => handleStepChange(-1)}>-</button>
                <button onClick={() => handleStepChange(1)}>+</button>
            </section>

            <section className="chat-messages">
                {messages.length === 0 && <p>No messages yet. Say hi!</p>}
                {messages.map((message) => {
                    const isSent = String(message.sender) === String(user._id)
                    return (
                        <article
                            key={message._id}
                            className={isSent ? 'message message-sent' : 'message message-received'}
                        >
                            <strong>{message.username}</strong>
                            <p>{message.text}</p>
                        </article>
                    )
                })}
            </section>

            <form className="message-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={formData}
                    onChange={handleChange}
                    placeholder="Message your build partner"
                />
                <button type="submit" disabled={!isConnected}>Send</button>
            </form>
        </main>
    )
}

export default BuildMatchPage