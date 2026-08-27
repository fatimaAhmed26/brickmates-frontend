import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { show, update } from '../services/user'

const EditProfile = ({ user, setUser }) => {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        bio: '',
        location: '',
        favoriteTheme: '',
    })
    const [avatar, setAvatar] = useState(null)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            const profile = await show(user._id)
            setFormData({
                bio: profile.bio || '',
                location: profile.location || '',
                favoriteTheme: profile.favoriteTheme || '',
            })
            setLoading(false)
        }
        fetchProfile()
    }, [user._id])

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    const handleAvatarChange = (event) => {
        setAvatar(event.target.files[0])
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const profileFormData = new FormData()
            profileFormData.append('bio', formData.bio)
            profileFormData.append('location', formData.location)
            profileFormData.append('favoriteTheme', formData.favoriteTheme)

            if (avatar) {
                profileFormData.append('avatar', avatar)
            }

            const updatedUser = await update(user._id, profileFormData)

            if (updatedUser.err) {
                setMessage(updatedUser.err)
                return
            }

            navigate(`/profile/${user._id}`)
        } catch (err) {
            setMessage(err.message)
        }
    }

    if (loading) return <p>Loading...</p>

    return (
        <section className="card">
            <header>
                <h1>Edit Profile</h1>
                <p>{message}</p>
            </header>
            <form onSubmit={handleSubmit}>
                Username:
                <input type="text" name="username" onChange={handleChange} value={formData.username} required />
                Bio:
                <textarea name="bio" onChange={handleChange} value={formData.bio} placeholder="Tell other builders about yourself"/>

                Location:
                <input
                    type="text" name="location" onChange={handleChange} value={formData.location} placeholder="e.g. Bahrain" />

                Avatar:
                <input type="file" name="avatar" onChange={handleAvatarChange} accept="image/*"
                />

                <div className="actions">
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => navigate(`/profile/${user._id}`)}>Cancel</button>
                </div>
            </form>
        </section>
    )
}

export default EditProfile