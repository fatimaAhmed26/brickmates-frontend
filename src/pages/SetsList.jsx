import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import toast from 'react-hot-toast'
import * as setService from "../services/set"
import { collectionToggle } from '../services/user'

const SetsList = ({ user, setUser }) => {
  const [sets, setSets] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!query.trim()) {
        const setsData = await setService.index()
        setSets(setsData)
        return
      }
      const results = await setService.search(query)
      setSets(results)
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [query])

  const handleOwnToggle = async (evt, setNum) => {
    evt.preventDefault()
    evt.stopPropagation()
    const updatedUser = await collectionToggle(user._id, setNum)
    setUser(updatedUser)
    toast.success(
      updatedUser.collectionSetIds?.includes(setNum)
        ? 'Added to your collection'
        : 'Removed from your collection'
    )
  }

  return (
    <div className="sets-page">
      <h1 className="sets-page-header">Browse Sets</h1>

      <div className="sets-search">
        <input
          type="text"
          value={query}
          onChange={(evt) => setQuery(evt.target.value)}
          placeholder="Search sets..."
        />
      </div>

      <div className="sets-grid">
        {sets.map((set) => {
          const isOwned = user?.collectionSetIds?.includes(set.setNum)
          return (
            <div className="set-card" key={set.setNum}>
              <Link to={`/sets/${set.setNum}`} className="set-card-link">
                <div className="set-image-wrap">
                  <img src={set.image} alt={set.name} />
                </div>
                <div className="set-card-body">
                  <h3>{set.name}</h3>
                  <p className="set-meta">{set.theme} · {set.year} · {set.pieceCount} pieces</p>
                </div>
              </Link>
              {user && (
                <button
                  className={`own-btn ${isOwned ? 'owned' : ''}`}
                  onClick={(evt) => handleOwnToggle(evt, set.setNum)}
                >
                  {isOwned ? 'In collection ✓' : 'Add'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SetsList