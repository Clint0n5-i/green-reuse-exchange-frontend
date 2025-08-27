import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogTitle, DialogDescription } from '@headlessui/react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const { login, user } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const [showSuspended, setShowSuspended] = useState(false)
    const [suspensionReason, setSuspensionReason] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await login(formData.email, formData.password)

            if (result.success) {
                toast.success('Login successful!')
                if (user?.role === 'ADMIN') {
                    navigate('/admin')
                } else {
                    navigate('/dashboard')
                }
            } else if (result.suspensionReason) {
                setSuspensionReason(result.suspensionReason)
                setShowSuspended(true)
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            toast.error('An error occurred during login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
                            <span className="text-white font-bold text-2xl">G</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Welcome back</h2>
                        <p className="mt-2 text-gray-600">
                            Sign in to your Green Reuse account
                        </p>
                    </div>

                    <div className="card">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input-field pl-10 pr-10"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
                                    Sign up here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Suspension Modal */}
            <Dialog open={showSuspended} onClose={() => setShowSuspended(false)} className="fixed z-50 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />
                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto p-8 z-10">
                        <DialogTitle className="text-xl font-bold text-red-600 mb-2">Account Suspended</DialogTitle>
                        <DialogDescription className="mb-4 text-gray-700">
                            Your account has been suspended for the following reason:
                        </DialogDescription>
                        <div className="mb-6 text-gray-800 border-l-4 border-red-500 pl-4 italic">{suspensionReason}</div>
                        <button
                            className="w-full btn-primary bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => setShowSuspended(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default Login
