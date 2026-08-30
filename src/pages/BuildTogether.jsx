import { useState } from 'react'
import { useNavigate } from 'react-router'
import { search } from '../services/set'
import { create } from '../services/queue'

const BuildTogether = () => {
    const navigate = useNavigate()

    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [selectedSet, setSelectedSet] = useState(null)
    const [message, setMessage] = useState('')
    const [waiting, setWaiting] = useState(false)

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

    const handleJoinQueue = async () => {
        if (!selectedSet) {
            setMessage('Please select a set first.')
            return
        }

        const result = await create(selectedSet.setNum, selectedSet.name)

        if (result.err) {
            setMessage(result.err)
            return
        }

        if (result.matched) {
            navigate(`/build-together/${result.match._id}`)
        } else {
            setWaiting(true)
            setMessage('Waiting for another builder to join...')
        }
    }

    return (
        <section className="card">
            <header>
                <h1>Build Together</h1>
                <p>Pick a set and get matched with another builder working on the same one.</p>
                {message && <p>{message}</p>}
            </header>

            {!waiting && (
                <>
                    <input
                        type="text"
                        list="set-options"
                        value={query}
                        onChange={handleSearchChange}
                        placeholder="Search for a set"
                    />
                    <datalist id="set-options">
                        {results.map((set) => (
                            <option key={set.setNum} value={`${set.name} (${set.setNum})`} />
                        ))}
                    </datalist>

                    {selectedSet && (
                        <div className="selected-set">
                            {selectedSet.imageUrl && <img src={selectedSet.imageUrl} alt={selectedSet.name} width="80" />}
                            <p>Selected: {selectedSet.name} ({selectedSet.setNum})</p>
                        </div>
                    )}

                    <button onClick={handleJoinQueue} disabled={!selectedSet}>Join Queue</button>
                </>
            )}

            {waiting && (
                <div className="waiting-state">
                    <p>Waiting for a match on {selectedSet?.name}...</p>
                </div>
            )}
        </section>
    )
}

export default BuildTogether