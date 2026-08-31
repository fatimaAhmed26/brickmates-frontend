import { useState } from "react"
import { signUp } from "../services/auth"
import { useNavigate } from "react-router"
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
            setFormData(initialState)
                toast.success(` HIIII!!!, ${user.username}!`)

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
        <section className="card">
            <header>
                <h1>Sign Up</h1>
                <p>{message}</p>
            </header>
            <form onSubmit={handleSubmit}>
                Username:
                <input type="text" name="username" onChange={handleChange} value={formData.username} required />
                Password:
                <input type="password" name="password" onChange={handleChange} value={formData.password} required />
                Confirm Password:
                <input type="password" name="confirmPassword" onChange={handleChange} value={formData.confirmPassword} required />
                <div className="actions">
                    <button type="submit" disabled={!isFormValid()}>Sign Up</button>
                    <button>Cancel</button>
                </div>
            </form>
        </section>
    )
}

export default SignUpForm

