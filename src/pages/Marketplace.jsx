import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { index } from '../services/listing'

const Marketplace = () => {
    const [listings, setListings] = useState([])

    useEffect(() => {
        const fetchListings = async () => {
            const listingsData = await index()
            setListings(listingsData)
        }
        fetchListings()
    }, [])

return (
        <div className="marketplace">
            <header className="marketplace-header">
                <h1>Marketplace</h1>
                <Link to="/listings/new">
                    <button>Create Listing</button>
                </Link>
            </header>

            <div className="listings-grid">
                {listings.map((listing) => (
                    <Link to={`/listings/${listing._id}`} key={listing._id}>
                        <div className="listing-card">
                            <div className="listing-image-wrap">
                                {listing.photos && listing.photos.length > 0 ? (
                                    <img src={listing.photos[0].url} alt={listing.setName} />
                                ) : (
                                    <div className="placeholder-img">No image</div>
                                )}
                                <span className="listing-badge">{listing.condition}</span>
                            </div>
                            <div className="listing-body">
                                <h3 className="listing-title">{listing.setName || listing.setNum}</h3>
                                <p className="listing-price">BHD {listing.price}</p>
                                <p className="listing-meta">{listing.setNum}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Marketplace