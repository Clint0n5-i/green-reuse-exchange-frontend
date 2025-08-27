import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {

    const { user, admin, logout, adminLogout } = useAuth();
    const navigate = useNavigate();



    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
    <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-lg">G</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">Green Reuse</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Removed dark mode toggle button */}
                        {(user || admin) ? (
                            <>
                                {user && user.role !== 'ADMIN' && (
                                    <>
                                        <Link
                                            to="/post-item"
                                            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                                        >
                                            Post Item
                                        </Link>
                                        <Link
                                            to="/about"
                                            className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            About
                                        </Link>
                                    </>
                                )}
                                {admin ? (
                                    <Link
                                        to="/admin"
                                        className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Admin Dashboard
                                    </Link>
                                ) : user ? (
                                    <Link
                                        to="/dashboard"
                                        className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        User Dashboard
                                    </Link>
                                ) : null}
                                <span className="text-sm text-gray-700">Welcome, {(admin && admin.email) || (user && user.name)}</span>
                                <button
                                    onClick={admin ? adminLogout : handleLogout}
                                    className="ml-2 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link
                                    to="/about"
                                    className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    About
                                </Link>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
