import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { adminService, itemService } from '../services/api.js'
import ItemCard from '../components/ItemCard.jsx'
import { Shield, Trash2, Users, Package, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

const Dashboard = () => {
    const { admin, user } = useAuth()
    const [items, setItems] = useState([])
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({});
    const handleEditClick = (item) => {
        setEditingItem(item);
        setEditForm({
            title: item.title,
            description: item.description,
            category: item.category,
            location: item.location,
            type: item.type,
            exchangeFor: item.exchangeFor,
        });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await itemService.updateItem(editingItem.id, editForm);
            toast.success('Item updated successfully');
            setEditingItem(null);
            fetchItems();
        } catch (error) {
            toast.error('Failed to update item');
        }
    };
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([])
    const [usersLoading, setUsersLoading] = useState(true)

    useEffect(() => {
        if (admin) {
            fetchItems()
            fetchUsers()
        } else if (user) {
            fetchUserItems()
        }
    }, [admin, user])

    const fetchItems = async () => {
        setLoading(true)
        try {
            const response = await adminService.getAllItems()
            setItems(response.data)
        } catch (error) {
            console.error('Error fetching items:', error)
            toast.error('Failed to fetch items')
        } finally {
            setLoading(false)
        }
    }

    // For regular users, fetch only their items
    const fetchUserItems = async () => {
        setLoading(true)
        try {
            const response = await itemService.getAllItems()
            // Filter items owned by the user
            const userId = user?.id || user?._id
            setItems(response.data.filter(item => item.ownerId === userId))
        } catch (error) {
            toast.error('Failed to fetch your items')
        } finally {
            setLoading(false)
        }
    }

    const fetchUsers = async () => {
        setUsersLoading(true)
        try {
            const res = await adminService.getUsers()
            setUsers(res.data)
        } catch (error) {
            // If backend endpoints are not available yet
            setUsers([])
        } finally {
            setUsersLoading(false)
        }
    }

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return
        }

        try {
            await adminService.deleteItem(itemId)
            toast.success('Item deleted successfully')
            fetchItems() // Refresh the list
        } catch (error) {
            toast.error('Failed to delete item')
        }
    }

    const suspendUser = async (userId) => {
        const reason = window.prompt('Enter a reason for suspension (required):')
        if (!reason || !reason.trim()) {
            toast.error('Suspension reason is required')
            return
        }
        try {
            await adminService.suspendUser(userId, reason)
            toast.success('User suspended')
            fetchUsers()
        } catch (error) {
            toast.error('Failed to suspend user')
        }
    }

    const unsuspendUser = async (userId) => {
        try {
            await adminService.unsuspendUser(userId)
            toast.success('User unsuspended')
            fetchUsers()
        } catch (error) {
            toast.error('Failed to unsuspend user')
        }
    }

    const deleteUser = async (userId) => {
        if (!window.confirm('Permanently delete this user?')) return
        try {
            await adminService.deleteUser(userId)
            toast.success('User deleted')
            fetchUsers()
        } catch (error) {
            toast.error('Failed to delete user')
        }
    }

    const availableItems = items.filter(item => item.status === 'AVAILABLE')
    const claimedItems = items.filter(item => item.status === 'CLAIMED')

    // Group items by category
    const itemsByCategory = items.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
    }, {})

    // Group items by location
    const itemsByLocation = items.reduce((acc, item) => {
        acc[item.location] = (acc[item.location] || 0) + 1
        return acc
    }, {})

    if (!admin) {
        return (
            <div className="text-center py-12">
                <Shield className="mx-auto text-gray-400 mb-4" size={48} />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
                <p className="text-gray-600">You need admin privileges to access this page.</p>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Manage items and monitor platform activity</p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="card text-center">
                    <div className="flex justify-center mb-2">
                        <Package className="text-primary-600" size={24} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{items.length}</div>
                    <div className="text-sm text-gray-600">Total Items</div>
                </div>

                <div className="card text-center">
                    <div className="flex justify-center mb-2">
                        <TrendingUp className="text-green-600" size={24} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{availableItems.length}</div>
                    <div className="text-sm text-gray-600">Available Items</div>
                </div>

                <div className="card text-center">
                    <div className="flex justify-center mb-2">
                        <Users className="text-blue-600" size={24} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{claimedItems.length}</div>
                    <div className="text-sm text-gray-600">Claimed Items</div>
                </div>

                <div className="card text-center">
                    <div className="flex justify-center mb-2">
                        <Shield className="text-purple-600" size={24} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">Admin</div>
                    <div className="text-sm text-gray-600">User Role</div>
                </div>
            </div>

            {/* Analytics */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Items by Category</h3>
                    <div className="space-y-2">
                        {Object.entries(itemsByCategory).map(([category, count]) => (
                            <div key={category} className="flex justify-between items-center">
                                <span className="text-gray-600">{category}</span>
                                <span className="font-semibold text-gray-800">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Items by Location</h3>
                    <div className="space-y-2">
                        {Object.entries(itemsByLocation).map(([location, count]) => (
                            <div key={location} className="flex justify-between items-center">
                                <span className="text-gray-600">{location}</span>
                                <span className="font-semibold text-gray-800">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Items Management */}
            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">All Items</h3>
                    <div className="text-sm text-gray-600">
                        {loading ? 'Loading...' : `${items.length} items`}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="mx-auto text-gray-400 mb-4" size={48} />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No items found</h3>
                        <p className="text-gray-600">No items have been posted yet.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map(item => (
                            <div key={item.id} className="relative">
                                <ItemCard item={item} onUpdate={admin ? fetchItems : fetchUserItems} />
                                {/* Show edit button only if user is owner and not admin. Support multiple owner field names. */}
                                {(!admin && user && (
                                    [item.ownerId, item.userId, item.owner, item._owner].includes(user.id || user._id)
                                )) && (
                                    <button
                                        onClick={() => handleEditClick(item)}
                                        className="absolute top-2 left-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                        title="Edit item"
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    title="Delete item"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        
        {/* Edit Modal/Form */}
        {editingItem && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <form
                    onSubmit={handleEditSubmit}
                    className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                >
                    <h2 className="text-xl font-bold mb-4">Edit Item</h2>
                    <input
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                        className="w-full mb-2 p-2 border rounded"
                        placeholder="Title"
                    />
                    <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        className="w-full mb-2 p-2 border rounded"
                        placeholder="Description"
                    />
                    <input
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                        className="w-full mb-2 p-2 border rounded"
                        placeholder="Category"
                    />
                    <input
                        name="location"
                        value={editForm.location}
                        onChange={handleEditChange}
                        className="w-full mb-2 p-2 border rounded"
                        placeholder="Location"
                    />
                    <input
                        name="type"
                        value={editForm.type}
                        onChange={handleEditChange}
                        className="w-full mb-2 p-2 border rounded"
                        placeholder="Type"
                    />
                    <input
                        name="exchangeFor"
                        value={editForm.exchangeFor}
                        onChange={handleEditChange}
                        className="w-full mb-2 p-2 border rounded"
                        placeholder="Exchange For"
                    />
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={() => setEditingItem(null)}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        )}

        {/* Users Management */}
        <div className="card mt-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Users</h3>
                <div className="text-sm text-gray-600">
                    {usersLoading ? 'Loading...' : `${users.length} users`}
                </div>
            </div>
            {usersLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-12">
                    <Users className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No users found</h3>
                </div>
            ) : (
                <div className="space-y-3">
                    {users.map(u => (
                        <div key={u.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                            <div>
                                <div className="font-semibold text-gray-800">{u.name} <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-gray-100">{u.role}</span></div>
                                <div className="text-sm text-gray-600">{u.email} • {u.phone} • {u.location}</div>
                                {u.suspensionReason && (
                                    <div className="text-xs text-red-600 mt-1">Suspended: {u.suspensionReason}</div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => suspendUser(u.id)} className="px-3 py-1.5 text-sm bg-yellow-600 hover:bg-yellow-700 text-white rounded-md">Suspend</button>
                                <button onClick={() => unsuspendUser(u.id)} className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md">Unsuspend</button>
                                <button onClick={() => deleteUser(u.id)} className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-1"><Trash2 size={14}/>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
    )
}

export default Dashboard
