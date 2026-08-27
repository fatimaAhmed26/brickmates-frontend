import { useState } from 'react'
import { useNavigate } from 'react-router'
import { create } from '../services/listing'

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
            listingFormData.append('setNum', formData.setNum)
            listingFormData.append('setName', formData.setName)
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
        return formData.setNum && formData.condition && formData.price
    }

     return (
        <section className="card">
            <header>
                <h1>Create Listing</h1>
                <p>{message}</p>
            </header>
            <form onSubmit={handleSubmit}>
                Set Number:
                <input type="text" name="setNum" onChange={handleChange} value={formData.setNum} required />
                Set Name:
                <input type="text" name="setName" onChange={handleChange} value={formData.setName} />
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