import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { show, update, followToggle, collectionToggle } from '../services/user'
import { index as indexListings } from '../services/listing'
import { index as indexBuilds } from '../services/build'
import { show as showSet } from '../services/set'

const Profile = ({ user }) => {
    const { userId } = useParams()
    const navigate = useNavigate()
    const [collectionSets, setCollectionSets] = useState([])
    const [profile, setProfile] = useState(null)
    const [listings, setListings] = useState([])
    const [builds, setBuilds] = useState([])
    const [activeTab, setActiveTab] = useState('builds')
    const [isEditing, setIsEditing] = useState(false)
    const [editFormData, setEditFormData] = useState({
    username: '',
    bio: '',
    location: '', })
    const [avatar, setAvatar] = useState(null)
    const [message, setMessage] = useState('')

    useEffect(() => {
        const fetchCollectionSets = async () => {
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

    useEffect(() => {
        const fetchBuilds = async () => {
            const allBuilds = await indexBuilds()
            setBuilds(allBuilds.filter((build) => build.owner && build.owner._id === userId))
        }
        fetchBuilds()
    }, [userId])

    const handleFollow = async () => {
        await followToggle(userId)
        const profileData = await show(userId)
        setProfile(profileData)
    }

    const handleEditChange = (event) => {
    setEditFormData({
        ...editFormData,
        [event.target.name]: event.target.value
    })
}

const handleAvatarChange = (event) => {
    setAvatar(event.target.files[0])
}

const handleEdit = () => {
    setEditFormData({
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
    })
    setAvatar(null)
    setMessage('')
    setIsEditing(true)
}

const handleSaveProfile = async (event) => {
    event.preventDefault()

    try {
        const profileFormData = new FormData()

        profileFormData.append('username', editFormData.username)
        profileFormData.append('bio', editFormData.bio)
        profileFormData.append('location', editFormData.location)

        if (avatar) {
            profileFormData.append('avatar', avatar)
        }

        const updatedUser = await update(user._id, profileFormData)

        if (updatedUser.err) {
            setMessage(updatedUser.err)
            return
        }

        setProfile(updatedUser)
        setIsEditing(false)
        setMessage('')
    } catch (err) {
        setMessage(err.message)
    }
}

    if (!profile) return <p>Loading...</p>

    const isOwnProfile = user && user._id === profile._id
    const isFollowing = profile.followers && profile.followers.includes(user?._id)

    const handleRemoveFromCollection = async (setNum) => {
        const updatedUser = await collectionToggle(profile._id, setNum)
        setProfile(updatedUser)
    }

    
return (
    <div className="profile">
        <header className="profile-header">
            <img
                className="profile-avatar"
                src={profile.avatar || 'https://placehold.co/150x150?text=%20'}
                alt={profile.username}
            />

            <div className="profile-info">
                {!isEditing ? (
                    <>
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

                        <div className="profile-follow-counts">
                            <span>
                                <strong>{profile.followers?.length || 0}</strong> Followers
                            </span>
                            <span>
                                <strong>{profile.following?.length || 0}</strong> Following
                            </span>
                        </div>

                        <div className="profile-actions">
                            {isOwnProfile ? (
                                <button
                                    className="btn-secondary"
                                    onClick={handleEdit}
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <button
                                    className="btn-primary"
                                    onClick={handleFollow}
                                >
                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                            )}

                            {!isOwnProfile && (
                                <button
                                    className="btn-message"
                                    onClick={() => navigate(`/chat/${profile._id}`)}
                                >
                                    Message
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <form
                        className="profile-edit-form"
                        onSubmit={handleSaveProfile}
                    >
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={editFormData.username}
                            onChange={handleEditChange}
                            required
                        />

                        <label>Bio</label>
                        <textarea
                            name="bio"
                            value={editFormData.bio}
                            onChange={handleEditChange}
                            placeholder="Tell other builders about yourself"
                        />

                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={editFormData.location}
                            onChange={handleEditChange}
                            placeholder="e.g. Bahrain"
                        />

                        <label>Avatar</label>
                        <input
                            type="file"
                            name="avatar"
                            onChange={handleAvatarChange}
                            accept="image/*"
                        />

                        <p>{message}</p>

                        <div className="profile-actions">
                            <button
                                className="btn-primary"
                                type="submit"
                            >
                                Save Changes
                            </button>

                            <button
                                className="btn-secondary"
                                type="button"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </header>

        <div className="profile-stats">
            <div
                className="stat-card stat-blue"
                onClick={() => setActiveTab('collection')}
                style={{ cursor: 'pointer' }}
            >
                <div className="stat-icon">◇</div>
                <div>
                    <span>Sets Owned</span>
                    <strong>
                        {profile.collectionSetIds?.length || 0}
                    </strong>
                </div>
            </div>

            <div
                className="stat-card stat-gray"
                onClick={() => setActiveTab('builds')}
                style={{ cursor: 'pointer' }}
            >
                <div className="stat-icon">⚒</div>
                <div>
                    <span>Builds Shared</span>
                    <strong>{builds.length}</strong>
                </div>
            </div>

            <div
                className="stat-card stat-yellow"
                onClick={() => setActiveTab('forsale')}
                style={{ cursor: 'pointer' }}
            >
                <div className="stat-icon">▣</div>
                <div>
                    <span>For sale</span>
                    <strong>
                        {listings.filter(
                            (listing) => listing.status === 'available'
                        ).length}
                    </strong>
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
                                    <span className="collection-badge">
                                        COLLECTOR
                                    </span>

                                    {set.image ? (
                                        <img src={set.image} alt={set.name} />
                                    ) : (
                                        <div className="set-placeholder">
                                            LEGO
                                        </div>
                                    )}
                                </div>

                                <div className="collection-body">
                                    <h3>
                                        {set.name || `Set ${set.setNum}`}
                                    </h3>

                                    <p>{set.setNum}</p>

                                    {isOwnProfile && (
                                        <button
                                            className="btn-remove"
                                            onClick={() =>
                                                handleRemoveFromCollection(
                                                    set.setNum
                                                )
                                            }
                                        >
                                            Remove
                                        </button>
                                    )}
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
                            <Link
                                to={`/builds/${build._id}`}
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
                            </Link>
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

                                        <span className="listing-status">
                                            {listing.status}
                                        </span>
                                    </div>

                                    <div className="listing-body">
                                        <h3 className="listing-title">
                                            {listing.setName ||
                                                listing.setNum}
                                        </h3>

                                        <p className="listing-set-number">
                                            {listing.setNum}
                                        </p>

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