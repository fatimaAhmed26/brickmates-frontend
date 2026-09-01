import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { search, show as showSet } from '../services/set'
import { create, counts } from '../services/queue'
import socket from '../socket'

const BuildTogether = ({ user }) => {
    const navigate = useNavigate()

    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [selectedSet, setSelectedSet] = useState(null)
    const [message, setMessage] = useState('')
    const [waiting, setWaiting] = useState(false)
    const [waitingSets, setWaitingSets] = useState([])

    useEffect(() => {
        socket.connect()
        socket.emit('join room', user._id)

        const handleMatchFound = ({ matchId }) => {
            navigate(`/build-together/${matchId}`)
        }

        socket.on('build match found', handleMatchFound)

        return () => {
            socket.off('build match found', handleMatchFound)
        }
    }, [user._id, navigate])

    useEffect(() => {
        const fetchWaitingSets = async () => {
            const countsMap = await counts()
            const setNums = Object.keys(countsMap).filter((setNum) => countsMap[setNum] > 0)

            const setsData = await Promise.all(
                setNums.map((setNum) => showSet(setNum))
            )

            const combined = setsData.map((set) => ({
                ...set,
                waitingCount: countsMap[set.setNum],
            }))

            setWaitingSets(combined)
        }
        fetchWaitingSets()
    }, [])

    const handleSearchChange = async (event) => {
        const value = event.target.value
        setQuery(value)

        const match = results.find((set) => `${set.name} (${set.setNum})` === value)
        setSelectedSet(match || null)

        if (value.length < 2) {
            setResults([])
            return
        }

        const data = await search(value)
        setResults(data)
    }

    const handleJoinQueue = async (setToJoin) => {
        const targetSet = setToJoin || selectedSet

        if (!targetSet) {
            setMessage('Please select a set first.')
            return
        }

        const result = await create(targetSet.setNum, targetSet.name)

        if (result.err) {
            setMessage(result.err)
            return
        }

        setSelectedSet(targetSet)

        if (result.matched) {
            navigate(`/build-together/${result.match._id}`)
        } else {
            setWaiting(true)
            setMessage('Waiting for another builder to join...')
        }
    }

   return (
    <section className="build-together">
        <header className="build-header">
            <h1>Join a Build Queue</h1>
            <p>
                Select a set you want to build collaboratively. Once enough builders join, a secure session will begin.
            </p>
        </header>

        {!waiting && (
            <>
                <div className="build-search-bar">
                    <input
                        type="text"
                        list="set-options"
                        value={query}
                        onChange={handleSearchChange}
                        placeholder="Search by set name or number..."
                    />
                    <datalist id="set-options">
                        {results.map((set) => (
                            <option
                                key={set.setNum}
                                value={`${set.name} (${set.setNum})`}
                            />
                        ))}
                    </datalist>
                </div>

                {message && <p className="build-message">{message}</p>}

                <div className="build-set-grid">
                    {waitingSets.map((set) => (
                        <div
                            className={`build-set-card ${selectedSet?.setNum === set.setNum ? 'selected' : ''}`}
                            key={set.setNum}
                            onClick={() => setSelectedSet(set)}
                        >
                            <div className="waiting-count">
                                👥 {set.waitingCount} waiting
                            </div>

                            <div className="build-set-image">
                                {set.image && <img src={set.image} alt={set.name} />}
                            </div>

                            <div className="build-set-info">
                                <div className="build-set-meta">
                                    <span>{set.theme || 'Ideas'}</span>
                                    <span className="set-number">{set.setNum}</span>
                                </div>

                                <h2>{set.name}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )}

        {waiting && (
            <div className="waiting-state">
                <p>Waiting for a match on <strong>{selectedSet?.name}</strong>...</p>
            </div>
        )}

        <div className="build-bottom-bar">
            <div className="selected-set-display">
                <div className="selected-set-icon">◇</div>
                <div>
                    <span>SELECTED SET</span>
                    <h3>{selectedSet ? selectedSet.name : 'Select a set...'}</h3>
                </div>
            </div>

            <button
                className="join-queue-button"
                onClick={() => handleJoinQueue()}
                disabled={!selectedSet}
            >
                Join Queue <span>→</span>
            </button>
        </div>
    </section>
)
}

export default BuildTogether