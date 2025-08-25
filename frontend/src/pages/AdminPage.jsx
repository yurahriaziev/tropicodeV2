import { useEffect, useState } from "react"
import { API_URL } from "../config"

export default function AdminPage() {
  const [error, setError] = useState('')

  //TODO
  // Fetch admin user from database and get name, and info
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
          console.log(data)
        } catch (error) {
          console.log(error) // log
          setError('Invalid request')
        }
      } else {
        setError('Not logged in')
      }
    }
    
    fetchAdminPersonalData()
  }, [])

  return (
    <div className="page">
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">T</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Tropicode Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Welcome back, Admin</span>
            <div className="w-8 h-8 bg-accent rounded-full"></div>
          </div>
        </div>
      </header>
    </div>
  )
}