import { useState } from "react"

export default function AdminPage() {
  const adminData = useState({})

  //TODO
  // Fetch admin user from database and get name, and info
  const fetchAdminPersonalData = () => {
    
  }

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