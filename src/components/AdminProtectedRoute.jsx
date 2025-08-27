import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

const AdminProtectedRoute = ({ children }) => {
    const { admin, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    if (!admin || admin.role !== 'ADMIN') {
        return <Navigate to="/admin/login" replace />
    }

    return children
}

export default AdminProtectedRoute
