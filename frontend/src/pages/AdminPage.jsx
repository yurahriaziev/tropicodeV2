import { useEffect, useState } from "react"
import { API_URL } from "../config"
import { useNavigate } from "react-router-dom"
import AdminSideBar from "../components/AdminSidebar"
import AdminDashboard from "../components/AdminDashboard"
import AdminActivity from "../components/AdminActivity"
import AdminLogs from "../components/AdminLogs"
import AdminTutorOnboarding from "../components/AdminTutorOnboarding"

export default function AdminPage() {
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [adminData, setAdminData] = useState({})
  const [activeTab, setActiveTab] = useState("dashboard")

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  useEffect(() => {
    const fetchAdminPersonalData = async() => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await fetch(`${API_URL}/users/me`, {
            method: 'GET',
            headers: {
              'Authorization':`Bearer ${token}`
            }
          })

          if (!response.ok) {
            setError('Invalid request')
            localStorage.removeItem('token')
            return
          }

          const data = await response.json()
          setAdminData(data)
          console.log(data) // LOG
        } catch (error) {
          console.log(error) // LOG
          setError('Invalid request')
        }
      } else {
        setError('Not logged in')
      }
    }
    
    fetchAdminPersonalData()
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-800">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Tropicode Admin</h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <button onClick={handleLogout} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                Logout
                </button>
            </div>
          </div>
      </header>
      <div className="flex flex-1">
        <AdminSideBar activeTab={activeTab} setActiveTab={setActiveTab} adminName={adminData.first + " " + adminData.last} />
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            {activeTab === "dashboard" && (
              <>
                <p className="my-4">Dashboard</p>
                <AdminDashboard />
              </>
              )}
            {activeTab === "activity" && (
              <>
              <p className="my-4">Activity</p>
              <AdminActivity />
              </>
            )}
            {activeTab === "logs" && (
              <>
                <p className="my-4">Logs</p>
                <p className="">Comming soon...</p>
                {/* <AdminLogs /> */}
              </>
            )}
            {activeTab === "messages" && (
              <>
                <p className="my-4">Messages</p>
              </>
            )}
            {activeTab === "newAccount" && (
              <>
                <p className="my-4">New user</p>
              </>
            )}
            {activeTab === "generateLink" && (
              <>
                <p className="my-4">Tutor onboarding</p>
                <AdminTutorOnboarding />
              </>
            )}
          </h2>
        </main>
      </div>
    </div>
  )
}