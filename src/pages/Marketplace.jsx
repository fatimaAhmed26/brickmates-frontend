import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { index } from '../services/listing'
import { themes } from '../services/set'

const Marketplace = () => {
    const [listings, setListings] = useState([])
    const [theme, setTheme] = useState('all')
    const [condition, setCondition] = useState('all')
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [themeOptions, setThemeOptions] = useState([])

    useEffect(() => {
        const fetchListings = async () => {
            const listingsData = await index()
            console.log(listingsData)
            setListings(listingsData)
        }
        fetchListings()
    }, [])

    useEffect(() => {
    const fetchThemes = async () => {
        const themeList = await themes()
        setThemeOptions(themeList)
    }
    fetchThemes()
}, [])

    const filteredListings = listings.filter((listing) => {
    if (theme !== 'all' && listing.theme !== theme) return false
    if (condition !== 'all' && listing.condition !== condition) return false
    if (minPrice && listing.price < Number(minPrice)) return false
    if (maxPrice && listing.price > Number(maxPrice)) return false
    return true
})

return (
        <div className="marketplace">
            <header className="marketplace-header">
                <h1>Marketplace</h1>
                <Link to="/listings/new">
                    <button>Add</button>
                </Link>
            </header>

            <div className="marketplace-filters">
                <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="all">All themes</option>
                {themeOptions.map((t) => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                </select>

                <select value={condition} onChange={(e) => setCondition(e.target.value)}>
                    <option value="all">All conditions</option>
                    <option value="built">Built</option>
                    <option value="sealed">Sealed</option>
                </select>

                <input
                    type="number"
                    placeholder="Min price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
            </div>
            

            <div className="listings-grid">
                {filteredListings.map((listing) => (
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
                                <p className="listing-theme">{listing.theme}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Marketplace