import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children, loginPath }) {
    const token = localStorage.getItem('token')

    if (!token) {
        return <Navigate to={loginPath} replace />
    }

    return children
}