import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { show, followToggle } from '../services/user'
import { index as indexListings } from '../services/listing'
import { show as showSet } from '../services/set'

const Profile = ({ user }) => {
    const { userId } = useParams()
    const navigate = useNavigate()
    const [collectionSets, setCollectionSets] = useState([])
    const [profile, setProfile] = useState(null)
    const [listings, setListings] = useState([])
    const [builds, setBuilds] = useState([])
    const [activeTab, setActiveTab] = useState('builds')
    useEffect(() => {
    const fetchCollectionSets = async () => {
        console.log('collectionSetIds:', profile?.collectionSetIds)  
        if (!profile?.collectionSetIds || profile.collectionSetIds.length === 0) {
            setCollectionSets([])
            return
        }
        const setsData = await Promise.all(
            profile.collectionSetIds.map((setNum) => showSet(setNum))
        )
        setCollectionSets(setsData)
    }
    fetchCollectionSets()
}, [profile])
    
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
                src={profile.avatar || 'https://placehold.co/150x150?text=%20'}
                alt={profile.username}
            />

            <div className="profile-info">
                <h1>{profile.username}</h1>

                {profile.location && (
                    <p className="profile-location">
                        {profile.location}
                    </p>
                )}

                {profile.bio && (
                    <p className="profile-bio">
                        {profile.bio}
                    </p>
                )}

                <div className="profile-actions">
                    {isOwnProfile ? (
                        <Link to="/profile/edit">
                            <button className="btn-secondary">
                                Edit Profile
                            </button>
                        </Link>
                    ) : (
                        <button
                            className="btn-primary"
                            onClick={handleFollow}
                        >
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                    )}

                    {!isOwnProfile && (
                        <button className="btn-message"
                        onClick={() => navigate(`/chat/${profile._id}`)} >
                             Message
                        </button>
                    )}
                </div>
            </div>
        </header>

        <div className="profile-stats">
            <div className="stat-card stat-blue">
                <div className="stat-icon">◇</div>
                <div>
                    <span>Sets Owned</span>
                    <strong>
                        {profile.collectionSetIds?.length || 0}
                    </strong>
                </div>
            </div>

            <div className="stat-card stat-yellow">
                <div className="stat-icon">▣</div>
                <div>
                    <span>Est. Value</span>
                    <strong>BHD 0</strong>
                </div>
            </div>

            <div className="stat-card stat-gray">
                <div className="stat-icon">⚒</div>
                <div>
                    <span>Builds Shared</span>
                    <strong>{builds.length}</strong>
                </div>
            </div>
        </div>

        <nav className="profile-tabs">
            <button
                className={activeTab === 'collection' ? 'active' : ''}
                onClick={() => setActiveTab('collection')}
            >
                Collection
            </button>

            <button
                className={activeTab === 'builds' ? 'active' : ''}
                onClick={() => setActiveTab('builds')}
            >
                Builds
            </button>

            <button
                className={activeTab === 'forsale' ? 'active' : ''}
                onClick={() => setActiveTab('forsale')}
            >
                For Sale
            </button>
        </nav>

        {activeTab === 'collection' && (
            <section className="profile-section">
                {collectionSets.length === 0 ? (
                    <p className="empty-state">
                        No sets in collection yet.
                    </p>
                ) : (
                    <div className="collection-grid">
                        {collectionSets.map((set) => (
    <div className="collection-card" key={set.setNum}>
        <div className="collection-image">
            <span className="collection-badge">COLLECTOR</span>
            {set.imageUrl ? (
                <img src={set.imageUrl} alt={set.name} />
            ) : (
                <div className="set-placeholder">LEGO</div>
            )}
        </div>
        <div className="collection-body">
            <h3>{set.name || `Set ${set.setNum}`}</h3>
            <p>{set.setNum}</p>
        </div>
    </div>
))}
                    </div>
                )}
            </section>
        )}

        {activeTab === 'builds' && (
            <section className="profile-section">
                {builds.length === 0 ? (
                    <p className="empty-state">
                        No builds posted yet.
                    </p>
                ) : (
                    <div className="builds-grid">
                        {builds.map((build) => (
                            <div
                                className="build-thumb"
                                key={build._id}
                            >
                                {build.image?.url ? (
                                    <img
                                        src={build.image.url}
                                        alt={build.caption}
                                    />
                                ) : (
                                    <div className="placeholder-img">
                                        No image
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        )}

        {activeTab === 'forsale' && (
            <section className="profile-section">
                {listings.length === 0 ? (
                    <p className="empty-state">
                        No listings yet.
                    </p>
                ) : (
                    <div className="listings-grid">
                        {listings.map((listing) => (
                            <Link
                                to={`/listings/${listing._id}`}
                                key={listing._id}
                            >
                                <div className="listing-card">
                                    <div className="listing-image-wrap">
                                        {listing.photos &&
                                        listing.photos.length > 0 ? (
                                            <img
                                                src={listing.photos[0].url}
                                                alt={listing.setName}
                                            />
                                        ) : (
                                            <div className="placeholder-img">
                                                No image
                                            </div>
                                        )}

                                        <span className="listing-badge">
                                            {listing.condition}
                                        </span>
                                    </div>

                                    <div className="listing-body">
                                        <h3 className="listing-title">
                                            {listing.setName ||
                                                listing.setNum}
                                        </h3>

                                        <p className="listing-price">
                                            BHD {listing.price}
                                        </p>
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