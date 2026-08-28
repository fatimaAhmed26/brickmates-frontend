import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { conversations } from '../services/message'

const Inbox = ({ user }) => {
    const { recipientId } = useParams()
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
            <h1 className="inbox-title">Direct Messages</h1>

            <div className="message-search">
            <span>⌕</span>
            <input type="text" placeholder="Search messages..." />
        </div>

            {conversationList.length === 0 ? (
                <p className="empty-inbox">No conversations yet.</p>
            ) : (
                <ul className="conversation-list">
                    {conversationList.map((convo) => (
                        <li   className={`conversation-item ${ recipientId === convo.otherUser?._id ? 'active' : ''  }`} key={convo.roomId}>
                            <Link className="conversation-link" to={`/messages/${convo.otherUser?._id}`}>
                                <img className="conversation-avatar"
                                    src={convo.otherUser?.avatar || 'https://placehold.co/50x50?text=%20'} width="50px"
                                    alt={convo.otherUser?.username}
                                    
                                />
                                <div className="conversation-info">
                                    <p className="conversation-name">{convo.otherUser?.username}</p>
                                    <p className="conversation-preview">
                                        {convo.lastMessage?.text || 'No messages yet'}
                                    </p>
                                </div>
                            </Link> </li> ))}
                </ul> )} </div>
    )
}

export default Inbox

