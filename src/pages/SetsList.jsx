import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import toast from 'react-hot-toast'
import * as setService from "../services/set"
import { collectionToggle } from '../services/user'

const SetsList = ({ user, setUser }) => {
  const [sets, setSets] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    const fetchSets = async () => {
      const setsData = await setService.index()
      setSets(setsData)
    }
    fetchSets()
  }, [])

  const handleSearch = async (evt) => {
    evt.preventDefault()
    if (!query.trim()) {
      const setsData = await setService.index()
      setSets(setsData)
      return
    }
    const results = await setService.search(query)
    setSets(results)
  }

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
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(evt) => setQuery(evt.target.value)}
          placeholder="Search sets..."
        />
        <button type="submit">Search</button>
      </form>

      {sets.map((set) => {
        const isOwned = user?.collectionSetIds?.includes(set.setNum)
        return (
          <Link to={`/sets/${set.setNum}`} key={set.setNum}>
            <img src={set.image} alt={set.name} />
            <h3>{set.name}</h3>
            <p>{set.theme} · {set.year} · {set.pieceCount} pieces</p>
            {user && (
              <button onClick={(evt) => handleOwnToggle(evt, set.setNum)}>
                {isOwned ? 'Owned ✓' : 'Own it'}
              </button>
            )}
          </Link>
        )
      })}
    </div>
  )
}

export default SetsList