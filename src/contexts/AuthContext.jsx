import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api.js'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [admin, setAdmin] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            const userData = JSON.parse(localStorage.getItem('user'))
            setUser(userData)
        }
        const adminToken = localStorage.getItem('adminToken')
        if (adminToken) {
            api.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`
            const adminData = JSON.parse(localStorage.getItem('admin'))
            setAdmin(adminData)
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password })
            const { token, user, message } = response.data
            if (!token && user && user.suspensionReason) {
                setUser(user); // Set user state even if suspended
                return {
                    success: false,
                    error: message || 'Your account is suspended.',
                    suspensionReason: user.suspensionReason
                }
            }
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            setUser(user)
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            }
        }
    }

    const adminLogin = async (email, password) => {
        try {
            const response = await api.post('/admin/auth/login', { email, password })
            const { token, admin } = response.data
            // Store admin info with role
            const adminData = admin || { email, role: 'ADMIN' }
            localStorage.setItem('adminToken', token)
            localStorage.setItem('admin', JSON.stringify(adminData))
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            setAdmin(adminData)
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Admin login failed'
            }
        }
    }

    const signup = async (userData) => {
        try {
            const response = await api.post('/auth/signup', userData)
            const { token, user } = response.data

            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            setUser(user)

            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Signup failed'
            }
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete api.defaults.headers.common['Authorization']
        setUser(null)
    }

    const adminLogout = () => {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('admin')
        delete api.defaults.headers.common['Authorization']
        setAdmin(null)
    }

    const value = {
        user,
        admin,
        login,
        adminLogin,
        signup,
        logout,
        adminLogout,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
