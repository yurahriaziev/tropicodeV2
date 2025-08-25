import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config"

export default function TutorPage() {
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const [tutorData, setTutorData] = useState({})

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }

    useEffect(() => {
        const fetchTutor = async() => {
            const token = localStorage.getItem('token')
            if (token) {
                const response = await fetch(`${API_URL}/users/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization':`Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    setError('Invalid request')
                    localStorage.removeItem('token')
                    return
                }

                const data = await response.json()
                setTutorData(data)
                console.log(data)
            } else {
                setError('Not logged in')
            }
        }
        fetchTutor()
    }, [])

    return (
        <div className="page">
            {/* header */}
            <header className="bg-card border-b border-border px-6 py-4">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">T</span>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Tropicode Tutor | {tutorData.first}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-accent rounded-full"></div>
                    <button onClick={handleLogout} className="px-3 py-1 text-gray-800 rounded-md hover:bg-black hover:text-white transition-colors cursor-pointer">
                    Logout
                    </button>
                </div>
                </div>
            </header>

            {/* students section */}
            <div className="p-6">
                {/* This div now matches the header's layout and spacing */}
                <div id="header" className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">My Students</h2>
                    {/* Styled button */}
                    <button className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        New student
                    </button>
                </div>
                {/* You can add your student list/table here */}
            </div>
        </div>
    )
}