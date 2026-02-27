import React from 'react'
import { useAuth } from "../context/AuthContext"
import { useNavigate, NavLink } from 'react-router-dom'
import { useEffect } from 'react'
import '../css/form.css'

function LoginPage() {

    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState('')

    const { login, user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate("/profile")
        }
    }, [user, navigate])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setError('')

        try {
            await login({ email, password })
            navigate("/profile")
        } catch (error) {
            setError('Login failed, enter valid email and password')
        }
    }

    return (
        <div className="form-container">
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>

                {error && (
                    <div className="error-message">{error}</div>
                )}

                <div className="form-group">
                    <label htmlFor="email">Email:</label> <br />

                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label> <br />

                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Sign in!</button>

            </form>

            <NavLink to="/register" style={{color:'black'}}>
                Register new user
            </NavLink>

        </div>
    )
}

export default LoginPage
