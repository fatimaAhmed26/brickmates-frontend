import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { conversations } from '../services/message'

const Inbox = ({ user }) => {
    const [conversationList, setConversationList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchConversations = async () => {
            const data = await conversations()
            setConversationList(data)
            setLoading(false)
        }
        fetchConversations()
    }, [])

    if (loading) return <p>Loading...</p>

   return (
        <div className="inbox">
            <h1>Direct Messages</h1>

            {conversationList.length === 0 ? (
                <p>No conversations yet.</p>
            ) : (
                <ul>
                    {conversationList.map((convo) => (
                        <li key={convo.roomId}>
                            <Link to={`/chat/${convo.otherUser?._id}`}>
                                <img
                                    src={convo.otherUser?.avatar || 'https://placehold.co/50x50?text=%20'}
                                    alt={convo.otherUser?.username}
                                    
                                />
                                <div>
                                    <p>{convo.otherUser?.username}</p>
                                    <p>
                                        {convo.lastMessage?.text || 'No messages yet'}
                                    </p>
                                </div>
                            </Link> </li> ))}
                </ul> )} </div>
    )
}

export default Inbox

