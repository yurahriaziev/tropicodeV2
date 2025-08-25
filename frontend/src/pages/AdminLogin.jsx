import { useState } from "react"
import { API_URL } from "../config"
import { useNavigate } from "react-router-dom"

export default function AdminLogin() {
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

            console.log('Admin login successful', token)
            localStorage.setItem('token', token)
            navigate('/admin')
        } catch(error) {
            console.log(error)
            setError('Problem with the server')
        }
    }

    return (
        <div>
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
            {error ?? (
                <p>{{error}}</p>
            )}
        </div>
    )
}