import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import toast from 'react-hot-toast'
import * as setService from "../services/set"
import { collectionToggle } from '../services/user'

const SetsList = ({ user, setUser }) => {
  const [sets, setSets] = useState([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!query.trim()) {
        const data = await setService.index(1)
        setSets(data.results)
        setHasMore(data.hasMore)
        setPage(1)
        return
      }
      const data = await setService.search(query, 1)
      setSets(data.results)
      setHasMore(data.hasMore)
      setPage(1)
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [query])

  const handleLoadMore = async () => {
    setLoadingMore(true)
    const nextPage = page + 1
    const data = query.trim()
      ? await setService.search(query, nextPage)
      : await setService.index(nextPage)

    setSets((prev) => [...prev, ...data.results])
    setHasMore(data.hasMore)
    setPage(nextPage)
    setLoadingMore(false)
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

      {hasMore && (
        <div className="load-more-wrap">
          <button className="load-more-btn" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading...' : 'Load More Sets'}
          </button>
        </div>
      )}
    </div>
  )
}

export default SetsList