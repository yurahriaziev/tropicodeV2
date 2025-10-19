import { useEffect, useState } from "react"
import { API_URL } from "../config"
import { Users, UserCheck, LineChart } from "lucide-react";

export default function AdminDashboard() {
    const [error, setError] = useState('')
    const [stats, setStats] = useState({
        total_users: 0,
        total_tutors: 0,
        total_students: 0
    })

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async() => {
            const token = localStorage.getItem('token')
            if (!token) return

            try {
                const response = await fetch(`${API_URL}/admin/users`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    setError('Failed to fetch stats')
                }

                const data = await response.json()
                setStats(data)
            } catch (error) {
                console.log(error)
                setError('Internal server error')
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (loading) {
        return (
        <div className="flex justify-center items-center h-full text-gray-400">
            Loading stats...
        </div>
        );
    }

    return (
        <>
            {error && (
                <Error message={error} onClose={() => setError(null)}/>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Users */}
                <StatCard
                    title="Total Users"
                    value={stats.total_users}
                    icon={<Users className="h-6 w-6 text-gray-300" />}
                />

                {/* Active Tutors */}
                <StatCard
                    title="Active Tutors"
                    value={stats.total_tutors}
                    icon={<UserCheck className="h-6 w-6 text-gray-300" />}
                />

                {/* Active Students */}
                <StatCard
                    title="Active Students"
                    value={stats.total_students}
                    icon={<LineChart className="h-6 w-6 text-gray-300" />}
                />
            </div>
        </>
    )
}

function StatCard({ title, value, icon }) {
  return (
    <div className="flex items-center justify-between p-6 rounded-xl bg-gray-900 dark:bg-gray-800 border border-gray-700 hover:border-purple-600 transition-all duration-200 shadow-md">
      <div>
        <h3 className="text-gray-300 text-sm font-medium">{title}</h3>
        <p className="text-4xl font-bold text-white mt-2">{value.toLocaleString()}</p>
      </div>
      <div className="p-3 rounded-lg bg-gray-800 text-gray-300">{icon}</div>
    </div>
  );
}