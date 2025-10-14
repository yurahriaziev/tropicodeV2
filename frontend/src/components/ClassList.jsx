import { useEffect, useState } from "react"
import { API_URL } from "../config"

export default function ClassList({ setError }) {
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchClasses = async() => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    setError('Not logged in')
                    return
                }

                const response = await fetch(`${API_URL}/classes`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    const data = await response.json()
                    return
                }

                const data = await response.json()
                setClasses(data)
            } catch (error) {
                setError('Internal server error')
            } finally {
                setLoading(false)
            }
        }

        fetchClasses()
    }, [setError])

    function formatClassTime(isoString) {
        if (!isoString) return ""

        const date = new Date(isoString)

        const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        })

        const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
        })

        return `${formattedDate} - ${formattedTime}`
    }

    if (loading) {
        return (
          <div className="flex justify-center items-center py-10">
            <p className="text-gray-600 dark:text-gray-300">Loading classes...</p>
          </div>
        );
    }

    if (!classes.length) {
        return (
        <div className="flex justify-center items-center py-10">
            <p className="text-gray-600 dark:text-gray-300">
            No upcoming classes yet.
            </p>
        </div>
        );
    } else {
        return (
            <div className="space-y-4">
            {classes.map((c) => (
                <div
                    key={c.google_event_id || c.id}
                    className="bg-white dark:bg-gray-800 shadow-md rounded-lg border-l-4 border-purple-500 p-4 transition hover:shadow-lg"
                    >
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {c.title}
                        </h3>
                        <a
                        href={c.google_meet_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                        Join Meet
                        </a>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        {new Date(c.start_time).toLocaleString()} —{" "}
                        {new Date(c.end_time).toLocaleString()}
                    </p>
                    </div>
                ))}
            </div>
        );
    }
}