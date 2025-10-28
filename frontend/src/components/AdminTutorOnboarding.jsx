import { useEffect, useState } from "react"
import { API_URL } from "../config"
import { Copy, PlusCircle, CheckCircle2, Clock } from "lucide-react"

export default function AdminTutorOnboarding() {
    const [invites, setInvites] = useState([])
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        console.log(invites)
        const stored = JSON.parse(localStorage.getItem('tutor_invites') || '[]')
        const now = new Date()

        const valid = stored.filter((inv) => new Date(inv.expiresAt) > now)
        setInvites(valid)
        localStorage.setItem('tutor_invites', JSON.stringify(valid))
    }, [])

    const handleGenerate = async() => {
        setLoading(true)
        const token = localStorage.getItem('token')

        try {
            const response = await fetch(`${API_URL}/admin/onboarding-link`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                setError('Failed to generate new link')
            }

            const data = await response.json()
            const newInvite = {
                link: data.invite_link,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            }
            setInvites((prev) => [newInvite, ...prev])
            localStorage.setItem('tutor_invites', JSON.stringify(invites))
        } catch (error) {
            console.log(error)
            setError('Internal server error')
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = (link) => {
        navigator.clipboard.writeText(link)
        setCopied(link)
        setTimeout(() => setCopied(null), 2000)
    }

    const getTimeRemaining = (expiresAt) => {
        const diff = new Date(expiresAt) - new Date()
        if (diff <= 0) return "Expired"
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff / (1000 * 60)) % 60)
        return `${hours}h ${minutes}m left`
    }

    const isExpired = (expiresAt) => new Date(expiresAt) < new Date()

    return (
        <div className="flex flex-col h-full text-gray-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    {/* <h1 className="text-1xl font-semibold text-white">Tutor Onboarding</h1> */}
                    <p className="text-xl mt-1 text-gray-400">
                        Generate secure onboarding links for new tutors.
                    </p>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className={`cursor-pointer text-xl flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white transition ${
                        loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                    <PlusCircle className="h-5 w-5" />
                    {loading ? "Generating..." : "Generate New Link"}
                </button>
            </div>

            {/* Invite Links Table */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                {invites.length === 0 ? (
                <p className="text-lg text-gray-400 text-center py-10">
                    No tutor onboarding links yet. Click “Generate New Link” to create one.
                </p>
                ) : (
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-gray-700 text-gray-400 text-sm">
                        <th className="py-3 px-4">Invite Link</th>
                        <th className="py-3 px-4">Created</th>
                        <th className="py-3 px-4">Expires</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                        {invites.map((invite, i) => {
                            const expired = isExpired(invite.expiresAt);
                            return (
                            <tr
                                key={i}
                                className="border-b border-gray-800 hover:bg-gray-800/50 transition"
                            >
                                <td className="pb-4 max-w-[250px] truncate align-middle">
                                    <a
                                        href={invite.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-purple-400 hover:underline text-xs"
                                    >
                                        {invite.link}
                                    </a>
                                </td>

                                <td className="py-2 px-3 text-gray-400 text-xs font-mono align-middle">
                                    {new Date(invite.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}{" "}
                                    {new Date(invite.createdAt).toLocaleDateString()}
                                </td>

                                <td className="py-2 px-3 text-gray-400 text-xs font-mono align-middle">
                                    {getTimeRemaining(invite.expiresAt)}
                                </td>

                                <td className="pb-3.5 px-3 text-center align-middle">
                                    <span
                                        className={`text-[11px] px-2 py-[2px] p rounded-md ${
                                        expired
                                            ? "bg-red-500/20 text-red-400 border border-red-500/40"
                                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                        }`}
                                    >
                                        {expired ? "Expired" : "Active"}
                                    </span>
                                </td>

                                <td className="py-2 px-3 text-center align-middle">
                                    <button
                                        onClick={() => handleCopy(invite.link)}
                                        className="text-gray-300 hover:text-white text-xs flex items-center justify-center gap-1 cursor-pointer"
                                    >
                                        {copied === invite.link ? (
                                        <>
                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                            Copied
                                        </>
                                        ) : (
                                        <>
                                            <Copy className="h-3.5 w-3.5" />
                                            Copy
                                        </>
                                        )}
                                    </button>
                                </td>
                            </tr>
                            );
                        })}
                    </tbody>
                </table>
                )}
            </div>
        </div>
    )
}