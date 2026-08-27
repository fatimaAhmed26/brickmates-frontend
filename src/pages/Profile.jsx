import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { show, followToggle } from '../services/user'
import { index as indexListings } from '../services/listing'

const Profile = ({ user }) => {
    const { userId } = useParams()
    const [profile, setProfile] = useState(null)
    const [listings, setListings] = useState([])
    const [builds, setBuilds] = useState([])
    const [activeTab, setActiveTab] = useState('builds')
    useEffect(() => {
        const fetchProfile = async () => {
            const profileData = await show(userId)
            setProfile(profileData)
        }
        fetchProfile()
    }, [userId])

    useEffect(() => {
        const fetchListings = async () => {
            const allListings = await indexListings()
            setListings(allListings.filter((listing) => listing.owner && listing.owner._id === userId))
        }
        fetchListings()
    }, [userId])

    const handleFollow = async () => {
        await followToggle(userId)
        const profileData = await show(userId)
        setProfile(profileData)
    }

    if (!profile) return <p>Loading...</p>

    const isOwnProfile = user && user._id === profile._id
    const isFollowing = profile.followerIds && profile.followerIds.includes(user?._id)

    return (
        <div className="profile">
            <header className="profile-header">
                <img
                    className="profile-avatar"
                    src={profile.avatarUrl || 'https://placehold.co/100x100?text=%20'}
                    alt={profile.username}
                />
                <div className="profile-info">
                    <h1>{profile.username}</h1>
                    {profile.location && <p className="profile-location">{profile.location}</p>}
                    {profile.bio && <p className="profile-bio">{profile.bio}</p>}
                    {profile.favoriteTheme && (
                        <p className="profile-theme">Favorite theme: {profile.favoriteTheme}</p>
                    )}
                </div>
                {isOwnProfile ? (
                    <Link to="/profile/edit">
                        <button className="btn-secondary">Edit Profile</button>
                    </Link>
                ) : (
                    <button className="btn-primary" onClick={handleFollow}>
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                )}
            </header>

            <div className="profile-stats">
                <div>
                    <strong>{profile.collectionSetIds?.length || 0}</strong>
                    <span>Sets owned</span>
                </div>
                <div>
                    <strong>{profile.followerIds?.length || 0}</strong>
                    <span>Followers</span>
                </div>
                <div>
                    <strong>{profile.followingIds?.length || 0}</strong>
                    <span>Following</span>
                </div>
                <div>
                    <strong>{listings.length}</strong>
                    <span>For sale</span>
                </div>
            </div>

            <nav className="profile-tabs">
                <button
                    className={activeTab === 'builds' ? 'active' : ''}
                    onClick={() => setActiveTab('builds')}>
                    Builds
                </button>
                <button
                    className={activeTab === 'collection' ? 'active' : ''}
                    onClick={() => setActiveTab('collection')}>
                    Collection
                </button>
                <button
                    className={activeTab === 'forsale' ? 'active' : ''}
                    onClick={() => setActiveTab('forsale')}>
                    For Sale
                </button>
            </nav>

            {activeTab === 'builds' && (
                <section className="profile-section">
                    {builds.length === 0 ? (
                        <p className="empty-state">No builds posted yet.</p>
                    ) : (
                        <div className="builds-grid">
                            {builds.map((build) => (
                                <div className="build-thumb" key={build._id}>
                                    {build.image?.url ? (
                                        <img src={build.image.url} alt={build.caption} />
                                    ) : (
                                        <div className="placeholder-img">No image</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {activeTab === 'collection' && (
                <section className="profile-section">
                    {!profile.collectionSetIds || profile.collectionSetIds.length === 0 ? (
                        <p className="empty-state">No sets in collection yet.</p>
                    ) : (
                        <ul className="collection-list">
                            {profile.collectionSetIds.map((setNum) => (
                                <li key={setNum}>{setNum}</li>
                            ))}
                        </ul>
                    )}
                </section>
            )}

            {activeTab === 'forsale' && (
                <section className="profile-section">
                    {listings.length === 0 ? (
                        <p className="empty-state">No listings yet.</p>
                    ) : (
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
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    )
}

export default Profile