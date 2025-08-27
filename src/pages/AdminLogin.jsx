import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminLogin = () => {
    const { adminLogin } = useAuth()
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await adminLogin(email, password)
            if (result.success) {
                toast.success('Admin login successful')
                navigate('/admin')
            } else {
                toast.error(result.error || 'Login failed')
            }
        } catch (err) {
            toast.error('Login failed')
        } finally {
            setLoading(false)
        }
    }
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 mb-4">
                        <div className="bg-red-600 p-3 rounded-lg">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
                            <p className="text-gray-400 text-sm">Green Exchange Platform</p>
                        </div>
                    </div>
                </div>

                <div className="border border-gray-700 bg-gray-800 rounded-xl shadow-lg">
                    <div className="p-8">
                        <div className="flex items-center mb-4">
                            <Shield className="h-5 w-5 text-red-500 mr-2" />
                            <span className="text-xl font-semibold text-white">Administrator Sign In</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-6">Enter your admin credentials to access the dashboard</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-gray-300">Admin Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                                    placeholder="admin@greenexchange.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-gray-300">Password</label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg pr-10"
                                        placeholder="Enter admin password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>


                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-lg mt-2"
                            >
                                {loading ? "Signing in..." : "Sign In as Admin"}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                type="button"
                                className="text-gray-400 hover:text-white text-sm transition-colors"
                                onClick={() => navigate('/')}
                            >
                                &larr; Back to Main Site
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-xs">Authorized personnel only. All access is logged and monitored.</p>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin
