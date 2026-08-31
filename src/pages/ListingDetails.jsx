import { useState, useEffect ,useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { show, deleteListing } from '../services/listing'

const ListingDetail = ({ user }) => {
    const { listingId } = useParams()
    const navigate = useNavigate()
    const [listing, setListing] = useState(null)

 const dialogRef = useRef(null);
const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => dialogRef.current?.close();

    useEffect(() => {
        const fetchListing = async () => {
            const listingData = await show(listingId)
            setListing(listingData)
        }
        fetchListing()
    }, [listingId])

    const handleDelete = async () => {
        await deleteListing(listingId)
        navigate('/listings')
    }

    if (!listing) return <p>Loading...</p>

    const isOwner = user && listing.owner && user._id === listing.owner._id

    return (
        <section className="card">
            <header>
                <h1>{listing.setName || listing.setNum}</h1>
                <p>Sold by{' '}
                    <Link to={`/profile/${listing.owner?._id}`}>
                     {listing.owner?.username}
                    </Link>
                    </p>
            </header>

            {listing.photos && listing.photos.length > 0 && (
                <div className="photos">
                    {listing.photos.map((photo, idx) => (
                        <img key={idx} src={photo.url} alt={listing.setName} />
                    ))}
                </div>
            )}

            <p>Set number: {listing.setNum}</p>
            <p>Condition: {listing.condition}</p>
            <p>Price: BHD {listing.price}</p>
            <p>Status: {listing.status}</p>
            {listing.description && <p>{listing.description}</p>}

            {isOwner && (
                <div className="actions">
                    <Link to={`/listings/${listing._id}/edit`}>
                        <button>Edit</button>
                    </Link>
                        <button className="btn-danger" onClick={openModal}>Delete</button>

<dialog ref={dialogRef} className="confirm-dialog">
                    <h2>Are you sure?</h2>
                    <p>when you click delete this list will be deleted</p>
                    <div className="actions">
                    <button onClick={handleDelete}>Delete</button>
                        <button type="button" className="btn-secondary" onClick={closeModal}>Close</button>
                    </div>
                </dialog>
                </div>
            )}

            {!isOwner && (
                <Link to={`/chat/${listing.owner?._id}`}>
                    <button>Message Seller</button>
                </Link>
            )}
        </section>
    )
}

export default ListingDetail