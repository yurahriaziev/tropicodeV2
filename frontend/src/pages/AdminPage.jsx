import { useEffect, useState } from "react"
import { API_URL } from "../config"
import { useNavigate } from "react-router-dom"

export default function AdminPage() {
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [adminData, setAdminData] = useState({})

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
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Tropicode Admin | {adminData.first}</h1>
        </div>
        <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <button onClick={handleLogout} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
            Logout
            </button>
        </div>
        </div>
    </header>
  )
}