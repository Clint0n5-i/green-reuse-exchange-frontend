import React, { useState, useEffect, useRef } from 'react';
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
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', description: '', category: '', location: '', images: [] });
    const [editImagePreviews, setEditImagePreviews] = useState([]);
    const fileInputRef = useRef();
    const [editLoading, setEditLoading] = useState(false);
    // Handle edit button click
    const handleEditItem = (item) => {
        setEditingItem(item);
        setEditForm({
            title: item.title || '',
            description: item.description || '',
            category: item.category || '',
            location: item.location || '',
            images: [] // new images to upload
        });
        // Show existing images as preview
        setEditImagePreviews(item.imageIds ? item.imageIds.map(id => `${import.meta.env.VITE_API_URL}/items/images/${id}`) : []);
    };

    // Handle edit form change
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle image file selection
    const handleEditImageChange = (e) => {
        const files = Array.from(e.target.files);
        setEditForm(prev => ({ ...prev, images: files }));
        setEditImagePreviews(files.map(file => URL.createObjectURL(file)));
    };

    // Remove selected image preview
    const handleRemoveEditImage = (index) => {
        setEditImagePreviews(prev => prev.filter((_, i) => i !== index));
        setEditForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    // Handle edit form submit
    const handleEditFormSubmit = async (e) => {
        e.preventDefault();
        if (!editingItem) return;
        setEditLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', editForm.title);
            formData.append('description', editForm.description);
            formData.append('category', editForm.category);
            formData.append('location', editForm.location);
            // Add images
            if (editForm.images && editForm.images.length > 0) {
                editForm.images.forEach((img, idx) => {
                    formData.append('images', img);
                });
            }
            await api.put(`/items/${editingItem.id}/edit`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Item updated successfully');
            setEditingItem(null);
            fetchPostedItems();
        } catch (err) {
            toast.error('Failed to update item');
        } finally {
            setEditLoading(false);
        }
    };

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

            {/* Stats Cards - single row on mobile */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center items-center">
                <div className="card text-center flex-1 min-w-[90px] max-w-[120px] p-2">
                    <div className="flex justify-center mb-1">
                        <Package className="text-primary-600" size={20} />
                    </div>
                    <div className="text-lg font-bold text-gray-800">{dashboard.totalPostedItems}</div>
                    <div className="text-xs text-gray-600 whitespace-nowrap">Posted</div>
                </div>
                <div className="card text-center flex-1 min-w-[90px] max-w-[120px] p-2">
                    <div className="flex justify-center mb-1">
                        <CheckCircle className="text-green-600" size={20} />
                    </div>
                    <div className="text-lg font-bold text-gray-800">{dashboard.availableItems}</div>
                    <div className="text-xs text-gray-600 whitespace-nowrap">Available</div>
                </div>
                <div className="card text-center flex-1 min-w-[90px] max-w-[120px] p-2">
                    <div className="flex justify-center mb-1">
                        <Clock className="text-yellow-600" size={20} />
                    </div>
                    <div className="text-lg font-bold text-gray-800">{dashboard.claimedItemsCount}</div>
                    <div className="text-xs text-gray-600 whitespace-nowrap">Claimed</div>
                </div>
                <div className="card text-center flex-1 min-w-[90px] max-w-[120px] p-2">
                    <div className="flex justify-center mb-1">
                        <User className="text-purple-600" size={20} />
                    </div>
                    <div className="text-lg font-bold text-gray-800">{dashboard.totalClaimedItems}</div>
                    <div className="text-xs text-gray-600 whitespace-nowrap">Items Claimed</div>
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
                                        <button
                                            onClick={() => handleEditItem(item)}
                                            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                            title="Edit item"
                                        >
                                            <Edit size={16} />
                                        </button>
                                    </div>
            {/* Edit Item Modal */}
            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={() => setEditingItem(null)}
                        >
                            &times;
                        </button>
                        <h3 className="text-lg font-semibold mb-4">Edit Item</h3>
                        <form onSubmit={handleEditFormSubmit} className="space-y-4">
                            <div>
                                <label className="inline-block w-24 text-sm font-medium text-gray-700 align-middle">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={editForm.title}
                                    onChange={handleEditFormChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="inline-block w-24 text-sm font-medium text-gray-700 align-middle">Description</label>
                                <textarea
                                    name="description"
                                    value={editForm.description}
                                    onChange={handleEditFormChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                    rows={3}
                                    required
                                />
                            </div>
                            <div>
                                <label className="inline-block w-24 text-sm font-medium text-gray-700 align-middle">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={editForm.category}
                                    onChange={handleEditFormChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="inline-block w-24 text-sm font-medium text-gray-700 align-middle">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={editForm.location}
                                    onChange={handleEditFormChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="inline-block w-24 text-sm font-medium text-gray-700 align-middle">Images</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleEditImageChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {editImagePreviews.map((src, idx) => (
                                        <div key={idx} className="relative">
                                            <img src={src} alt="preview" className="w-16 h-16 object-cover rounded" />
                                            <button type="button" className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1" onClick={() => handleRemoveEditImage(idx)}>&times;</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    disabled={editLoading}
                                >
                                    {editLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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
                        <label className="inline-block w-24 text-sm font-medium text-gray-500 align-middle">Name</label>
                        <p className="mt-1 text-gray-800">{user.name}</p>
                    </div>
                    <div>
                        <label className="inline-block w-24 text-sm font-medium text-gray-500 align-middle">Email</label>
                        <p className="mt-1 text-gray-800">{user.email}</p>
                    </div>
                    <div>
                        <label className="inline-block w-24 text-sm font-medium text-gray-500 align-middle">Phone</label>
                        <p className="mt-1 text-gray-800">{user.phone || 'Not provided'}</p>
                    </div>
                    <div>
                        <label className="inline-block w-24 text-sm font-medium text-gray-500 align-middle">Location</label>
                        <p className="mt-1 text-gray-800">{user.location || 'Not provided'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;