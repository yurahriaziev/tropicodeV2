import { useEffect, useState } from "react";
import { API_URL } from "../config";

export default function LeadStatsRow({ setError }) {
    const [stats, setStats] = useState({
        total: 0,
        open: 0,
        sold: 0,
        lost: 0,
        conversion_rate: 0
    })

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLeadStast = async() => {
            const token = localStorage.getItem('token')
            if (!token) return
    
            try {
                const response = await fetch(`${API_URL}/admin/leads/stats`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    setError('Failed to fetch lead stats')
                    return
                }

                const data = await response.json()
                setStats(data)
            } catch (error) {
                console.log(error) // LOG
                setError(error)
            } finally {
                setLoading(false)
            }
        }

        fetchLeadStast()
    }, [])

    if (loading) {
        return (
        <div className="flex justify-center items-center py-6 text-gray-400">
            Loading lead stats...
        </div>
        );
    }

     return (
        <div className="mt-6 rounded-xl bg-gray-900 dark:bg-gray-800 border border-gray-700 shadow-md">
        <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-700">
            <LeadStat label="Leads" value={stats.total} />
            <LeadStat label="Open" value={stats.open} />
            <LeadStat label="Sold" value={stats.sold} />
            <LeadStat label="Lost" value={stats.lost} />
            <LeadStat label="Conv. Rate" value={`${stats.conversion_rate}%`} />
        </div>
        </div>
    )
}

function LeadStat({ label, value }) {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <p className="text-3xl font-bold text-white">{value}</p>
      <span className="mt-1 text-sm text-gray-400">{label}</span>
    </div>
  )
}