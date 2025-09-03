import React, { useState } from 'react';
import NotificationBell from './NotificationBell';
import NotificationList from './NotificationList';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

const Navbar = () => {

    const { user, admin, logout, adminLogout } = useAuth();
    const { notifications, markAsRead } = useNotifications();
    const [showNotifications, setShowNotifications] = useState(false);
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
                        {user && (
                            <NotificationBell
                                count={notifications.filter(n => !n.isRead).length}
                                onClick={() => setShowNotifications(v => !v)}
                            />
                        )}
                        {/* Removed dark mode toggle button */}
                        {(user || admin) ? (
                            <>
                                {user && user.role !== 'ADMIN' && (
                                    <>
                                        <Link
                                            to="/browse"
                                            className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            Browse Items
                                        </Link>
                                        {/* Hide Post Item tab for admins */}
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
                                    to="/browse"
                                    className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Browse Items
                                </Link>
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
            {showNotifications && user && (
                <NotificationList
                    notifications={notifications}
                    onMarkRead={markAsRead}
                />
            )}
        </nav>
    );
};

export default Navbar;
