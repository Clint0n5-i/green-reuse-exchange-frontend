import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import ItemCard from '../components/ItemCard';
import { Package, CheckCircle, Clock, User, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const UserDashboard = () => {
    const { user } = useAuth();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('posted');
    const [postedItems, setPostedItems] = useState([]);
    const [claimedItems, setClaimedItems] = useState([]);

    useEffect(() => {
        fetchDashboard();
        fetchPostedItems();
        fetchClaimedItems();
    }, []);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const response = await api.get('/user/dashboard');
            setDashboard(response.data);
        } catch (err) {
            toast.error('Failed to load dashboard');
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPostedItems = async () => {
        try {
            const response = await api.get('/user/posted-items');
            setPostedItems(response.data);
        } catch (err) {
            toast.error('Failed to fetch your posted items');
            console.error('Error fetching posted items:', err);
        }
    };

    const fetchClaimedItems = async () => {
        try {
            const response = await api.get('/user/claimed-items');
            setClaimedItems(response.data);
        } catch (err) {
            toast.error('Failed to fetch your claimed items');
            console.error('Error fetching claimed items:', err);
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            await api.delete(`/items/${itemId}`);
            toast.success('Item deleted successfully');
            fetchPostedItems();
            fetchDashboard(); // Refresh stats
        } catch (error) {
            toast.error('Failed to delete item');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="text-center py-12">
                <Package className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No dashboard data</h3>
                <p className="text-gray-600">Unable to load your dashboard information.</p>
                <button
                    onClick={fetchDashboard}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">My Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="card text-center">
                    <div className="flex justify-center mb-2">
                        <Package className="text-primary-600" size={24} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{dashboard.totalPostedItems}</div>
                    <div className="text-sm text-gray-600">Posted Items</div>
                </div>

                <div className="card text-center">
                    <div className="flex justify-center mb-2">
                        <CheckCircle className="text-green-600" size={24} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{dashboard.availableItems}</div>
                    <div className="text-sm text-gray-600">Available</div>
                </div>

                <div className="card text-center">
                    <div className="flex justify-center mb-2">
                        <Clock className="text-yellow-600" size={24} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{dashboard.claimedItemsCount}</div>
                    <div className="text-sm text-gray-600">Claimed</div>
                </div>

                <div className="card text-center">
                    <div className="flex justify-center mb-2">
                        <User className="text-purple-600" size={24} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{dashboard.totalClaimedItems}</div>
                    <div className="text-sm text-gray-600">Items Claimed</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'posted' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('posted')}
                >
                    My Posted Items
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'claimed' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('claimed')}
                >
                    My Claims
                </button>
            </div>

            {/* Content */}
            {activeTab === 'posted' ? (
                <div className="card">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">My Posted Items</h3>
                        <div className="text-sm text-gray-600">
                            {postedItems.length} items
                        </div>
                    </div>

                    {postedItems.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="mx-auto text-gray-400 mb-4" size={48} />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No items posted</h3>
                            <p className="text-gray-600">You haven't posted any items yet.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {postedItems.map(item => (
                                <div key={item.id} className="relative">
                                    <ItemCard item={item} onUpdate={fetchPostedItems} />
                                    <div className="absolute top-2 right-2 flex space-x-2">
                                        <button
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            title="Delete item"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        {/* Add edit button if needed */}
                                        {/* <button
                                            onClick={() => handleEditItem(item.id)}
                                            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                            title="Edit item"
                                        >
                                            <Edit size={16} />
                                        </button> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="card">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">My Claimed Items</h3>
                        <div className="text-sm text-gray-600">
                            {claimedItems.length} items
                        </div>
                    </div>

                    {claimedItems.length === 0 ? (
                        <div className="text-center py-12">
                            <CheckCircle className="mx-auto text-gray-400 mb-4" size={48} />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No claims yet</h3>
                            <p className="text-gray-600">You haven't claimed any items yet.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {claimedItems.map(item => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Profile Section */}
            <div className="card mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Name</label>
                        <p className="mt-1 text-gray-800">{user.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Email</label>
                        <p className="mt-1 text-gray-800">{user.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Phone</label>
                        <p className="mt-1 text-gray-800">{user.phone || 'Not provided'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Location</label>
                        <p className="mt-1 text-gray-800">{user.location || 'Not provided'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;