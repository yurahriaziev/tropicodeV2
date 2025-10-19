import { useState, useEffect } from "react";
import { API_URL } from "../config";
import { Search, Filter } from "lucide-react";

export default function AdminActivity() {
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchActivities = async () => {
            const token = localStorage.getItem("token")
            if (!token) return

            try {
                const res = await fetch(`${API_URL}/admin/activity`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                })

                if (res.ok) {
                    const data = await res.json()
                    console.log(data)
                    setActivities(data)
                } else {
                    setError("Failed to load activity data")
                }
            } catch (err) {
                console.error(err)
                setError("Server error")
            } finally {
                setLoading(false)
            }
        }

        fetchActivities()
    }, [])

    const filteredActivities = activities.filter((a) => {
        a.action.toLowerCase().includes(search.toLowerCase()) ||
        a.details?.toLowerCase().includes(search.toLowerCase())
    })

    return (
        <div className="flex flex-col h-full text-gray-200">
            {/* Search + Filter */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by action or details..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-700 rounded-lg bg-gray-900 shadow-md">
                <table className="min-w-full">
                    <thead className="bg-gray-800">
                        <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Action</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Target</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Details</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                        <tr>
                            <td colSpan="4" className="text-center py-6 text-gray-400">
                            Loading...
                            </td>
                        </tr>
                        ) : error ? (
                        <tr>
                            <td colSpan="4" className="text-center py-6 text-red-400">
                            {error}
                            </td>
                        </tr>
                        ) : activities.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center py-6 text-gray-400">
                            No activity found.
                            </td>
                        </tr>
                        ) : (
                            activities.map((a) => (
                                <tr
                                    key={a.id}
                                    className="border-t border-gray-800 hover:bg-gray-800/60 transition-colors"
                                >
                                <td className="px-6 py-3 text-sm font-medium text-white">{a.action}</td>
                                <td className="px-6 py-3 text-sm text-gray-300">{a.target || "—"}</td>
                                <td className="px-6 py-3 text-sm text-gray-400 truncate max-w-xs">
                                    {typeof a.details === "object"
                                    ? JSON.stringify(a.details)
                                    : a.details || "—"}
                                </td>
                                <td className="px-6 py-3 text-sm text-gray-400 font-mono">
                                    {new Date(a.timestamp).toLocaleString()}
                                </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}