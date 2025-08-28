import { useEffect, useState } from "react"
import { API_URL } from "../config"
import { useNavigate } from "react-router-dom"
import Error from "../components/Error"

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault()
        console.log('Login attempt')
        setError('')

        if (!email || !password) {
            setError('Please fill out both fields')
            return
        }
        
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

            if (!data.role || data.role != 'admin') {
                setError("You don't have access to this page")
                return
            }
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black text-black dark:text-white px-4">
            {error && (
                <Error message={error} onClose={() => setError(null)}/>
            )}
            <div className="w-full max-w-sm text-center">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">Tropicode Admin</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border-2 border-transparent focus:outline-none focus:border-black dark:focus:border-white"
                    />
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border-2 border-transparent focus:outline-none focus:border-black dark:focus:border-white"
                    />
                    <button 
                        type="submit" 
                        className="w-full py-3 font-semibold text-white bg-black dark:bg-white dark:text-black hover:opacity-80 transition-opacity"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    )
}