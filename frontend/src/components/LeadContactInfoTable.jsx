import { useEffect, useRef, useState } from "react"
import { API_URL } from "../config"
import LeadSidePage from "./LeadSidePage"
import { X } from "lucide-react"

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
    const [openMenuId, setOpenMenuId] = useState(null)
    const menuRef = useRef(null)
    const [isOpen, setIsOpen] = useState(false)
    const [selectedLead, setSelectedLead] = useState(null)
    const [confirmId, setConfirmId] = useState(null)
    
    async function handleDelete(leadId) {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const response = await fetch(`${API_URL}/admin/leads/${leadId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok) {
                setError('Failed to delete lead')
                return
            }
            
            setLeads(prev => prev.filter(l => l.id !== leadId))
        } catch (error) {
            setError('Internal server error')
            return
        }
    }

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

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null)
            }
        }

        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    useEffect(() => {
        fetchLeads()
    }, [])

    return (
        <>
            <div
                onClick={() => {
                    setIsOpen(false)
                    setTimeout(() => setSelectedLead(null), 300)
                }}
                className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                />

                <div
                className={`fixed right-0 top-0 h-full w-[380px] z-50
                    transform transition-transform duration-300 ease-out
                    ${isOpen ? "translate-x-0" : "translate-x-full"}
                `}
                >
                {selectedLead && (
                    <LeadSidePage
                    selectedLead={selectedLead}
                    onClose={() => {
                        setIsOpen(false)
                        setTimeout(() => setSelectedLead(null), 300)
                    }}
                    />
                )}
            </div>
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
                        <table className="min-w-full border border-gray-800 rounded-lg">
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
                                    <th className="w-8 px-2"></th>
                                </tr>
                            </thead>

                            <tbody>
                            {leads.map((lead) => (
                                <tr
                                    key={lead.id}
                                    className="group last:border-b-0 hover:bg-gray-700/40 transition"
                                >
                                    <td className="py-2 px-3 text-gray-200 text-[13px]">
                                        {lead.first}
                                    </td>

                                    <td className="py-2 px-3 text-gray-200 text-[13px]">
                                        {lead.last}
                                    </td>

                                    <td className="py-2 px-3 align-middle">
                                        <div className="flex items-center h-full">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                                                ORIGIN_STYLES[lead.source] ?? "bg-gray-600 text-gray-200"
                                                }`}
                                            >
                                                {ORIGIN_LABELS[lead.source] ?? lead.source}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="w-8 px-2 align-middle relative">
                                        <div className="flex items-center justify-end h-full">
                                            <button
                                                onMouseDown={(e) => {
                                                    e.stopPropagation()
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setOpenMenuId(openMenuId === lead.id ? null : lead.id)
                                                }}
                                                className="
                                                    opacity-0 group-hover:opacity-100
                                                    w-7 h-7
                                                    flex items-center justify-center
                                                    rounded-md
                                                    text-gray-400
                                                    hover:text-white
                                                    hover:bg-gray-700/40
                                                    transition
                                                    cursor-pointer
                                                "
                                                >
                                                <span className="leading-none translate-y-[1px] font-light">⋯</span>
                                            </button>

                                            {openMenuId === lead.id && (
                                            <div
                                                ref={menuRef}
                                                className="
                                                absolute right-2 top-8 z-50
                                                w-36
                                                rounded-md
                                                bg-gray-900
                                                border border-gray-700
                                                shadow-lg
                                                py-1
                                                "
                                            >
                                                <button
                                                onClick={() => {
                                                    setSelectedLead(lead)
                                                    setIsOpen(true)
                                                    setOpenMenuId(null)
                                                }}
                                                className="
                                                    w-full text-left px-3 py-2
                                                    text-sm text-gray-200
                                                    hover:bg-gray-800
                                                    transition
                                                    cursor-pointer
                                                "
                                                >
                                                View lead
                                                </button>

                                                <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setConfirmId(lead.id)
                                                    setOpenMenuId(null)
                                                }}
                                                className="
                                                    w-full text-left px-3 py-2
                                                    text-sm text-red-400
                                                    hover:bg-gray-800
                                                    transition
                                                    cursor-pointer
                                                "
                                                >
                                                Delete
                                                </button>
                                            </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
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
                            Are you sure you want to delete this lead?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setConfirmId(null)}
                                className="px-4 py-2 text-base bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    await handleDelete(confirmId)
                                    setConfirmId(null)
                                }}
                                className="px-4 py-2 text-base bg-red-600 text-white rounded-md hover:bg-red-700 transition"
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