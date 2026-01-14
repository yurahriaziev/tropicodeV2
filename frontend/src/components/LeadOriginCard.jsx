import { useEffect, useState } from "react"
import { API_URL } from "../config"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const ORIGIN_LABELS = {
  general: "General",
  programming_course: "Programming",
  reactjs_web_development_course: "React",
  "3d_printing_design_course": "3D Print",
  pygame_game_development_course: "Pygame",
}

export default function LeadOriginCard({ setError }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrigins = async() => {
            const token = localStorage.getItem('token')
            if (!token) return

            try {
                const response = await fetch(`${API_URL}/admin/leads/origins`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    setError('Failed to fetch lead origins')
                }

                const raw = await response.json()

                const formatted = Object.entries(raw).map(([key, value]) => ({
                    origin: ORIGIN_LABELS[key] ?? key,
                    count: Number(value) || 0
                }))

                setData(formatted)
            } catch (error) {
                console.log(error) // LOG
                setError(error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrigins()
    })

    if (loading) {
        return (
        <div className="flex justify-center items-center h-64 text-gray-400">
            Loading lead origins...
        </div>
        );
    }

    return (
    <div className="rounded-xl bg-gray-900 dark:bg-gray-800 border border-gray-700 shadow-md p-5 h-[360px] flex flex-col">
        <h3 className="text-white text-base font-semibold leading-none">
            Lead Origin
        </h3>

        <div className="relative h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                barCategoryGap="35%"
            >
                <CartesianGrid stroke="#374151" strokeDasharray="4 4" vertical={false} />

                <XAxis
                dataKey="origin"
                stroke="#9CA3AF"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                />

                <YAxis
                stroke="#9CA3AF"
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                domain={[0, "dataMax + 1"]}
                />

                <Tooltip
                cursor={false}
                contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "0.5rem",
                    color: "#fff",
                    fontSize: "12px",
                }}
                />

                <Bar
                dataKey="count"
                fill="#8B5CF6"
                radius={[6, 6, 0, 0]}
                barSize={36}
                isAnimationActive={false}
                />
            </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
    )
}