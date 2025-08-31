import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { API_URL } from "./config"

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
    </div>
  );
}

export default function ProtectedRoute({ children, loginPath, type }) {
    const [authStatus, setAuthStatus] = useState('loading')
    
    useEffect(() => {
        const getRole = async() => {
            const token = localStorage.getItem('token')
            console.log(token)

            if (!token) {
                setAuthStatus('unauthenticated')
                return
            }

            try {
                const response = await fetch(`${API_URL}/users/me`, {
                    headers: {
                        'Authorization':`Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    localStorage.removeItem('token')
                    setAuthStatus('unauthenticated')
                    return
                }

                const user = await response.json()
                if (user.role === type) {
                    setAuthStatus('authenticated')
                } else {
                    setAuthStatus('unauthenticated')
                    return
                }
            } catch(error) {
                console.error("Authentication check failed:", error) //LOG
                setAuthStatus('unauthenticated')
            }
        }

        getRole()
    }, [type])

    console.log(authStatus)
    if (authStatus === 'loading') {
        return <LoadingSpinner />
    }

    if (authStatus === 'authenticated') {
        return children
    }

    return <Navigate to={loginPath} replace />
}