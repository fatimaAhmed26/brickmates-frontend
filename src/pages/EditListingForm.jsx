import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { show, update } from '../services/listing'

const EditListingForm = () => {
    const { listingId } = useParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        condition: 'built',
        price: '',
        description: '',
        status: 'available',
    })
    const [existingSet, setExistingSet] = useState(null)
    const [photos, setPhotos] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchListing = async () => {
            const listing = await show(listingId)
            setFormData({
                condition: listing.condition,
                price: listing.price,
                description: listing.description || '',
                status: listing.status,
            })
            setExistingSet({ setNum: listing.setNum, name: listing.setName })
            setLoading(false)
        }
        fetchListing()
    }, [listingId])

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    const handlePhotosChange = (event) => {
        setPhotos([...event.target.files])
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const listingFormData = new FormData()
            listingFormData.append('condition', formData.condition)
            listingFormData.append('price', formData.price)
            listingFormData.append('description', formData.description)
            listingFormData.append('status', formData.status)

            photos.forEach((photo) => {
                listingFormData.append('photos', photo)
            })

            const updatedListing = await update(listingId, listingFormData)

            if (updatedListing.err) {
                setMessage(updatedListing.err)
                return
            }

            navigate(`/listings/${listingId}`)
        } catch (err) {
            setMessage(err.message)
        }
    }

    if (loading) return <p>Loading...</p>

    return (
        <section className="card">
            <header>
                <h1>Edit Listing</h1>
                <p>{message}</p>
            </header>
            <form onSubmit={handleSubmit}>
                {existingSet && (
                    <p>Set: {existingSet.name} ({existingSet.setNum})</p>
                )}

                Condition:
                <select name="condition" onChange={handleChange} value={formData.condition}>
                    <option value="built">Built</option>
                    <option value="sealed">Sealed</option>
                </select>

                Price:
                <input type="number" name="price" onChange={handleChange} value={formData.price} required
                />

                Description:
                <textarea name="description" onChange={handleChange} value={formData.description} />

                Status:
                <select name="status" onChange={handleChange} value={formData.status}>
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                </select>

                Replace photos (optional):
                <input type="file" name="photos" onChange={handlePhotosChange} multiple accept="image/*" />

                <div className="actions">
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => navigate(`/listings/${listingId}`)}>Cancel</button>
                </div>
            </form>
        </section>
    )
}

export default EditListingForm