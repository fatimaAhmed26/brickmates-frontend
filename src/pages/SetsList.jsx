import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import * as setService from "../services/set";

const SetsList = () => {
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
        <Link to={`/sets/${set.setNum}`} key={set.setNum}>
          <img src={set.image} alt={set.name} />
          <h3>{set.name}</h3>
          <p>{set.theme} · {set.year} · {set.pieceCount} pieces</p>
        </Link>
      ))}
    </div>
  );
};

export default SetsList