import { useEffect, useState, useRef } from "react"
import { API_URL } from "../config"
import { MoreVertical, Trash2, Edit } from "lucide-react";

export default function ClassList({ setError }) {
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)
    const [openMenuId, setOpenMenuId] = useState(null)

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

    async function handleDelete(classId) {

        try {
            const token = localStorage.getItem('token')
            if (!token) {
                setError('Not logged in')
                return
            }

            const response = await fetch(`${API_URL}/classes/${classId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok) {
                setError('Failed to delete class')
            }

            const updated = await response.json().catch(() => [])
            setClasses(updated)
        } catch (error) {
            console.log(error)
            setError('Failed to delete class')
        }
    }

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

    const menuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

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
                    className="bg-white dark:bg-gray-800 shadow-md rounded-lg border-l-4 border-purple-500 p-4 transition hover:shadow-lg relative"
                >
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {c.title}
                        </h3>

                        <div className="flex items-center gap-3 relative" ref={menuRef}>
                        <a
                            href={c.google_meet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Join Meet
                        </a>

                        <button
                            onClick={() =>
                            setOpenMenuId((prev) => (prev === c.id ? null : c.id))
                            }
                            className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                        >
                            <MoreVertical size={18} />
                        </button>

                        <div
                            className={`absolute top-6 right-0 bg-white dark:bg-gray-700 rounded-md shadow-md border border-gray-200 dark:border-gray-600 z-10 w-32 
                            transform origin-top-right transition-all duration-200 ease-out
                            ${
                            openMenuId === c.id
                                ? "opacity-100 scale-100 translate-y-1 pointer-events-auto"
                                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                            }`}
                        >
                            <button
                            onClick={() => {
                                setOpenMenuId(null);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2 transition-colors"
                            >
                            <Edit size={14} /> Edit
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    const confirmed = window.confirm("Are you sure you want to delete this class?")
                                    if (!confirmed) return;

                                    handleDelete(c.id)
                                    setOpenMenuId(null)
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-600 dark:hover:text-white flex items-center gap-2 transition-colors"
                                >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        {formatClassTime(c.start_time)}
                    </p>
                </div>
            ))}
            </div>
        );
    }
}