import { useEffect, useState, useRef } from "react"
import { API_URL } from "../config"
import { MoreVertical, Trash2, Edit, X } from "lucide-react";

export default function ClassList({ setError, classes, loading, refresh }) {
    const [openMenuId, setOpenMenuId] = useState(null)
    const [confirmId, setConfirmId] = useState(null)

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

            await refresh()
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

    const menuRef = useRef({});
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!openMenuId) return

            const menuEl = menuRef.current[openMenuId]
            if (menuEl && !menuEl.contains(e.target)) {
            setOpenMenuId(null)
            }
        };

        document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    }, [openMenuId])

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
            <>
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

                                <div className="flex items-center gap-3 relative" ref={(el) => (menuRef.current[c.id] = el)}>
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
                                            setConfirmId(c.id)
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

                {confirmId && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-80 p-5 text-center animate-fadeIn relative">
                            <button
                            onClick={() => setConfirmId(null)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                            <X size={18} />
                            </button>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Confirm Deletion
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
                            Are you sure you want to delete this class?
                            </p>
                            <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setConfirmId(null)}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                                <button
                                    onClick={async () => {
                                        await handleDelete(confirmId)
                                        setConfirmId(null)
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        )
    }
}