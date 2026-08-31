import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import * as setService from "../services/set";
import * as userService from "../services/user"

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

  const handleAddToCollection = async (setId) => {
    const updatedUser = await userService.collectionToggle(user._id, setId)
    setUser(updatedUser)
}

const isInCollection = (setId) => {
    return user?.collectionSetIds?.includes(setId)
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

      {sets.map((set) => (
        <div key={set.setNum}>
          <Link to={`/sets/${set.setNum}`}>
            <img src={set.image} alt={set.name} />
            <h3>{set.name}</h3>
            <p>{set.theme} · {set.year} · {set.pieceCount} pieces</p>
          </Link>

          {user && (
            <button onClick={() => handleAddToCollection(set._id)}>
              {isInCollection(set._id) ? 'Remove from Collection' : 'Add to Collection'}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export default SetsList