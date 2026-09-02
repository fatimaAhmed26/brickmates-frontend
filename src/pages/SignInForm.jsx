import { useNavigate } from "react-router"
import { useState } from "react"
import { signIn } from "../services/auth"
import toast from 'react-hot-toast'

const SignInForm = (props) => {

    const navigate = useNavigate()

    const initialState = {
        username: '',
        password: '',
    }
    const [formData, setFormData] = useState(initialState)
    const [message, setMessage] = useState('')

    const handleChange = (event) => {
        setMessage('')
        setFormData({...formData, [event.target.name]: event.target.value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const signedInUser = await signIn(formData)
            props.setUser(signedInUser)
            setFormData(initialState)
            toast.success(`Welcome back, ${signedInUser.username}!`)

            navigate('/')
        } catch(err) {
            setMessage(err.message)
            toast.error(err.message || 'Sign in failed')
        }
    }

    return(
        <section className="auth-card">
            <header className="auth-header">
                <h1>Sign In</h1>
                <p className="auth-message">{message}</p>
            </header>

            <form className="auth-form" onSubmit={handleSubmit}>
                <label className="auth-label">Username</label>
                <input
                    className="auth-input"
                    type="text"
                    name="username"
                    value={formData.username}
                    required
                    onChange={handleChange}
                />

                <label className="auth-label">Password</label>
                <input
                    className="auth-input"
                    type="password"
                    name="password"
                    value={formData.password}
                    required
                    onChange={handleChange}
                />

                <div className="auth-actions">
                    <button className="auth-btn-primary" type="submit">
                        Sign In
                    </button>

                    <button
                        className="auth-btn-secondary"
                        type="button"
                        onClick={() => navigate('/')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </section>
    )
}

export default SignInForm
