import { useState } from "react"
import { signUp } from "../services/auth"
import { useNavigate, Link } from "react-router"
import toast from 'react-hot-toast'


const SignUpForm = (props) => {

    const navigate = useNavigate()

    const initialState = {
        username: '',
        password: '',
        confirmPassword: '',
    }

    const [formData, setFormData] = useState(initialState)
    const [message, setMessage] = useState('')

    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value})
    }
    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const newUser = await signUp(formData)
            props.setUser(newUser)
            setFormData(newUser)
                toast.success(` HIIII!!!, ${newUser.username}!`)

            navigate('/')
        } catch (err) {
            setMessage(err.message)
                toast.error(err.message || 'Sign in failed')

        }
    }

    const isFormValid = () => {
        if(formData.username && formData.password && formData.password === formData.confirmPassword) {
            return true
        } else return false
    }

    return (
        <section className="auth-card">
            <header className="auth-header">
                <h1>Sign Up</h1>
                <p className="auth-message">{message}</p>
            </header>
            <form className="auth-form" onSubmit={handleSubmit}>
                <label className="auth-label">Username</label>
                <input className="auth-input" type="text" name="username" onChange={handleChange} value={formData.username} required />

                <label className="auth-label">Password</label>
                <input className="auth-input" type="password" name="password" onChange={handleChange} value={formData.password} required />

                <label className="auth-label">Confirm Password</label>
                <input className="auth-input" type="password" name="confirmPassword" onChange={handleChange} value={formData.confirmPassword} required />

                <div className="auth-actions">
                    <button className="auth-btn-primary" type="submit" disabled={!isFormValid()}>Sign Up</button>
                    <button className="auth-btn-secondary" type="button" onClick={() => navigate('/')}>Cancel</button>
                </div>
            </form>

            <p className="auth-switch">
                Already have an account? <Link to="/sign-in">Sign In</Link>
            </p>
        </section>
    )
}

export default SignUpForm