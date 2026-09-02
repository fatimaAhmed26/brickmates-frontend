import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { index, followToggle } from '../services/user'

const UsersList = ({ user, setUser }) => {
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await index()
      setUsers(usersData)
    }
    fetchUsers()
  }, [])

  const handleFollow = async (evt, targetUserId) => {
    evt.preventDefault()
    evt.stopPropagation()
    await followToggle(targetUserId)
    const usersData = await index()
    setUsers(usersData)
  }

  const filtered = users.filter((u) =>
    u.username?.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <section className="users-page">
      <header className="dashboard-header">
        <div>
          <h1>Builders</h1>
          <p>Every builder on BrickMates.</p>
        </div>
      </header>

      <div className="sets-search">
        <input
          type="text"
          value={query}
          onChange={(evt) => setQuery(evt.target.value)}
          placeholder="Search builders..."
        />
      </div>

      <div className="users-grid">
        {filtered.map((u) => {
          const isFollowing = u.followers?.includes(user?._id)
          const isSelf = u._id === user?._id
          return (
            <Link to={`/profile/${u._id}`} key={u._id} className="builder-link">
              <div className="builder-card">
                <div className="builder-image">
                  <img
                    src={u.avatar || 'https://placehold.co/80x80?text=%20'}
                    alt={u.username}
                  />
                </div>
                <h2>{u.username}</h2>
                <p>{u.bio}</p>
                {!isSelf && (
                  <button
                    className="follow-btn"
                    onClick={(evt) => handleFollow(evt, u._id)}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default UsersList