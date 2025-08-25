import { useState } from "react"
import { API_URL } from "../config"
import { useNavigate } from "react-router-dom"
import Error from "../components/Error"

export default function TutorLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault()
        console.log('Login attempt')
        setError('')
        
        const formData = new URLSearchParams()
        formData.append('username', email)
        formData.append('password', password)

        try {
            const response = await fetch(`${API_URL}/auth/token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/x-www-form-urlencoded'
                    },
                    body: formData.toString()
                }
            )

            if (!response.ok) {
                setError('Incorrect email or password')
                return
            }

            const data = await response.json()
            const token = data.access_token

            console.log('Tutor login successful', token)
            localStorage.setItem('token', token)
            navigate('/tropitutor')
        } catch(error) {
            console.log(error)
            setError('Problem with the server')
        }
    }

    return (
        <div>
            {error && (
                <Error message={error} onClose={() => setError(null)}/>
            )}
            <h1>Welcome Tutor! Log in here</h1>
            <form onSubmit={handleSubmit}>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    // required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    id="password"
                    name="password"
                    type="password"
                    // required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">
                    Sign In
                </button>
            </form>
        </div>
    )
}