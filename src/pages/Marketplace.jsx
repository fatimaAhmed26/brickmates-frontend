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
        <section>
            <header>
                <h1>Marketplace</h1>
                <Link to="/listings/new">
                    <button>Create Listing</button>
                </Link>
            </header>

            <div className="listings-grid">
                {listings.map((listing) => (
                    <Link to={`/listings/${listing._id}`} key={listing._id}>
                        <div className="card">
                            {listing.photos && listing.photos.length > 0 ? (
                                <img src={listing.photos[0].url} alt={listing.setName} />
                            ) : (
                                <div className="placeholder-img" />
                            )}
                            <h3>{listing.setName || listing.setNum}</h3>
                            <p>BHD {listing.price}</p>
                            <p>{listing.condition}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default Marketplace