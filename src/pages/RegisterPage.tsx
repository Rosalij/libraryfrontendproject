import React from "react"
import { useNavigate } from "react-router-dom"

function RegisterPage() {
    const [username, setUsername] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [error, setError] = React.useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")

        try {
            const response = await fetch(
                "https://librarybackend-c0p9.onrender.com/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password
                    }),
                }
            )

            if (!response.ok) {
                throw new Error("Registration failed")
            }

            navigate("/login")
            alert("User Created! " + email + " " + username)
        } catch (error) {
            setError("Could not register user")
        }
    }

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>
                <label htmlFor="username">Username:</label> <br/>
                <input type="username"

                    value={username}
                    onChange={(e) => setUsername(e.target.value)} />
               <br/> <label htmlFor="email">Email:</label> <br/> <input
                    type="email"
                
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
<br />
<label htmlFor="password">Password:</label> <br />
                <input
                    type="password"
             
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
<br />
                <button type="submit">Register</button>

                {error && <p>{error}</p>}
            </form>
        </div>
    )
}

export default RegisterPage
