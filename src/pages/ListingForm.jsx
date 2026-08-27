import { useState } from 'react'
import { useNavigate } from 'react-router'
import { create } from '../services/listing'
import { search } from '../services/set'

const ListingForm = () => { 
    const navigate = useNavigate()

     const initialState = {
        setNum: '',
        setName: '',
        condition: 'built',
        price: '',
        description: '',
    }

    const [formData, setFormData] = useState(initialState)
    const [photos, setPhotos] = useState([])
    const [message, setMessage] = useState('')

    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [selectedSet, setSelectedSet] = useState(null)
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    const handlePhotosChange = (event) => {
        setPhotos([...event.target.files])
    }

     const handleSearchChange = async (event) => {
        const value = event.target.value
        setQuery(value)
        
        const match = results.find((set) => `${set.name} (${set.setNum})` === value)
        if (match) {
            setSelectedSet(match)
        } else {
            setSelectedSet(null)
        }

        if (value.length < 2) {
            setResults([])
            return
        }

        const data = await search(value)
        setResults(data)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const listingFormData = new FormData()
            listingFormData.append('setNum', selectedSet.setNum)
            listingFormData.append('setName', selectedSet.name)
            listingFormData.append('condition', formData.condition)
            listingFormData.append('price', formData.price)
            listingFormData.append('description', formData.description)

            photos.forEach((photo) => {
                listingFormData.append('photos', photo)
            })

            const newListing = await create(listingFormData)

            if (newListing.err) {
                setMessage(newListing.err)
                return
            }

            navigate('/listings')
        } catch (err) {
            setMessage(err.message)
        }
    }
   

    const isFormValid = () => {
        return selectedSet && formData.condition && formData.price
    }

     return (
        <section className="card">
            <header>
                <h1>Create Listing</h1>
                <p>{message}</p>
            </header>
            <form onSubmit={handleSubmit}>
                Set:
                <input type="text" list="set-options" value={query} onChange={handleSearchChange} placeholder="e.g. Millennium Falcon"
                    required />

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
                Condition:
                <select name="condition" onChange={handleChange} value={formData.condition}>
                    <option value="built">Built</option>
                    <option value="sealed">Sealed</option>
                </select>
                Price:
                <input type="number" name="price" onChange={handleChange} value={formData.price}
                    required />
                Description:
                <textarea name="description" onChange={handleChange} value={formData.description} />
                Photos:
                <input type="file" name="photos" onChange={handlePhotosChange} multiple accept="image/*" />
                <div className="actions">
                    <button type="submit" disabled={!isFormValid()}>Create Listing</button>
                    <button type="button" onClick={() => navigate('/listings')}>Cancel</button>
                </div>
            </form>
        </section>
    )
}

export default ListingForm