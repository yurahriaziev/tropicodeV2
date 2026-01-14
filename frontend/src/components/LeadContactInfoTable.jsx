import { useEffect, useState } from "react"
import { API_URL } from "../config"

const ORIGIN_STYLES = {
  general: "bg-gray-700 text-gray-200",
  programming_course: "bg-blue-600/20 text-blue-400",
  reactjs_web_development_course: "bg-cyan-600/20 text-cyan-400",
  "3d_printing_design_course": "bg-purple-600/20 text-purple-400",
  pygame_game_development_course: "bg-green-600/20 text-green-400",
}

const ORIGIN_LABELS = {
  general: "General",
  programming_course: "Programming",
  reactjs_web_development_course: "ReactJS",
  "3d_printing_design_course": "3D Printing",
  pygame_game_development_course: "Pygame",
}

export default function LeadContactInfoTable({ setError }) {
    const [leads, setLeads] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLeads = async() => {
            const token = localStorage.getItem('token')
            if (!token) return

            try {
                const response = await fetch(`${API_URL}/admin/leads/info`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    setError('Failed to fetch leads info')
                    return
                }

                const data = await response.json()
                setLeads(data)
            } catch (error) {
                console.error(error) // LOG
                setError("Failed to load lead contacts")
            } finally {
                setLoading(false)
            }
        }

        fetchLeads()
    }, [])

    return (
        <div className="rounded-xl bg-gray-900 dark:bg-gray-800 border border-gray-700 shadow-md p-5 h-[360px] flex flex-col">
            <h3 className="text-white text-base font-semibold leading-none">
                Lead Contacts
            </h3>

            {loading ? (
                <div className="flex justify-center items-center h-40 text-gray-400">
                Loading leads...
                </div>
            ) : leads.length === 0 ? (
                <div className="flex justify-center items-center h-40 text-gray-500">
                No leads found
                </div>
            ) : (
                <div className="overflow-y-auto overflow-x-hidden flex-1 pr-1">
                    <table className="min-w-full border border-gray-800 rounded-lg overflow-hidden">
                        <thead>
                            <tr className="text-gray-400 text-[12px] border-b border-gray-700">
                                <th className="text-left py-2 px-3 font-medium border-r border-gray-800">
                                First Name
                                </th>
                                <th className="text-left py-2 px-3 font-medium border-r border-gray-800">
                                Last Name
                                </th>
                                <th className="text-left py-2 px-3 font-medium">
                                Origin
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                        {leads.map((lead) => (
                            <tr
                                key={lead.id}
                                className="border-b border-gray-700 last:border-b-0 hover:bg-gray-800/40 transition"
                            >
                                <td className="py-2 px-3 text-gray-200 text-[13px] border-r border-gray-800 last:border-r-0">
                                    {lead.first}
                                    </td>

                                    <td className="py-2 px-3 text-gray-200 text-[13px] border-r border-gray-800 last:border-r-0">
                                    {lead.last}
                                    </td>

                                    <td className="py-2 px-3">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                                        ORIGIN_STYLES[lead.source] ?? "bg-gray-600 text-gray-200"
                                        }`}
                                    >
                                        {ORIGIN_LABELS[lead.source] ?? lead.source}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}