import { useEffect, useState } from "react";
import { API_URL } from "../config";
import { Search, Download } from "lucide-react";

function getLogLevelColor(level) {
  switch (level?.toLowerCase()) {
    case "error":
      return "bg-red-500/20 text-red-400 border border-red-500/40";
    case "warning":
      return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40";
    case "info":
      return "bg-blue-500/20 text-blue-400 border border-blue-500/40";
    default:
      return "bg-gray-700 text-gray-300 border border-gray-600";
  }
}

export default function AdminLogs() {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchLogs = async () => {
        const token = localStorage.getItem("token")
        if (!token) return

        try {
            const res = await fetch(`${API_URL}/admin/logs`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) throw new Error("Failed to fetch logs")

            const data = await res.json()
            
            const parsed = (data.lines || []).map((line, i) => {
            const match = line.match(/\[(\w+)\]\s+([\d-:, ]+)\s+\|\s+(.*)/);
            if (match) {
                return {
                id: i,
                level: match[1].toLowerCase(),
                timestamp: match[2].trim(),
                message: match[3].trim(),
                }
            }
                return { id: i, level: "info", timestamp: "", message: line }
            })

            setLogs(parsed)
        } catch (err) {
            console.error(err)
            setError("Error fetching logs")
        } finally {
            setLoading(false)
        }
        }

        fetchLogs()
    }, [])

    const filteredLogs = logs.filter((log) => {
        const s = search.toLowerCase()
        return (
            log.message?.toLowerCase().includes(s) ||
            log.level?.toLowerCase().includes(s)
        )
    })
    console.log(filteredLogs)

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = "server_logs.json"
        link.click()
    }

    return (
        <div className="flex flex-col h-full text-gray-200">
            {/* Search Bar */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search logs by message, service, or level..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                </div>
            </div>

            {/* Logs List */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-y-auto max-h-[70vh]">
                {loading ? (
                <div className="text-center text-gray-400 py-10">Loading logs...</div>
                ) : error ? (
                <div className="text-center text-red-400 py-10">{error}</div>
                ) : filteredLogs.length === 0 ? (
                <div className="text-center text-gray-400 py-10">No logs found</div>
                ) : (
                <div className="space-y-3">
                    {filteredLogs.map((log) => (
                    <div key={log.id} className="...">
                        <span className={`text-xs px-2 py-1 rounded-md ${getLogLevelColor(log.level)}`}>
                        {log.level.toUpperCase()}
                        </span>
                        <div className="flex-1">
                        <div className="flex justify-between">
                            <p className="text-sm font-medium text-white">{log.message}</p>
                            <span className="font-mono text-xs text-gray-400">{log.timestamp}</span>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
        </div>
    )
}