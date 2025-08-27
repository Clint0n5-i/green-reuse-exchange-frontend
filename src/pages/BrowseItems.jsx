import { useState, useEffect } from 'react'
import { itemService } from '../services/api.js'
import ItemCard from '../components/ItemCard.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { Filter, Grid, List } from 'lucide-react'

const BrowseItems = () => {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = async (searchTerm = '', category = '', location = '') => {
        setLoading(true)
        try {
            let response

            if (searchTerm) {
                response = await itemService.searchItems(searchTerm, location)
            } else if (category) {
                response = await itemService.getItemsByCategory(category)
            } else if (location) {
                response = await itemService.getItemsByLocation(location)
            } else {
                response = await itemService.getAllItems()
            }

            setItems(response.data)
        } catch (error) {
            console.error('Error fetching items:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (searchTerm, category, location) => {
        fetchItems(searchTerm, category, location)
    }

    const handleFilterChange = (searchTerm, category, location) => {
        fetchItems(searchTerm, category, location)
    }

    const handleItemUpdate = () => {
        fetchItems() // Refresh the list after an item is claimed
    }

    const availableItems = items.filter(item => item.status === 'AVAILABLE')
    const claimedItems = items.filter(item => item.status === 'CLAIMED')

    // For modal details


    return (
    <div className="flex">
            {/* Sidebar for filters */}
            <div className="w-1/4 bg-gray-100 p-4 min-h-screen">
                <h3 className="text-lg font-semibold mb-4">Quick Filters</h3>
                <div className="space-y-4">
                    <button
                        onClick={() => fetchItems()}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded"
                    >
                        All Items
                    </button>
                    <button
                        onClick={() => fetchItems('', '', 'Kisii Town')}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded"
                    >
                        Kisii Town
                    </button>
                    <button
                        onClick={() => fetchItems('', '', 'Ogembo')}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded"
                    >
                        Ogembo
                    </button>
                    <button
                        onClick={() => fetchItems('', '', 'Keroka')}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded"
                    >
                        Keroka
                    </button>
                    <button
                        onClick={() => fetchItems('', 'BOOKS', '')}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded"
                    >
                        Books
                    </button>
                    <button
                        onClick={() => fetchItems('', 'FURNITURE', '')}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded"
                    >
                        Furniture
                    </button>
                    <button
                        onClick={() => fetchItems('', 'ELECTRONICS', '')}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded"
                    >
                        Electronics
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="w-3/4 p-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Items</h1>
                    <p className="text-gray-600">Find reusable items in your community</p>
                </div>

                <SearchBar onSearch={handleSearch} onFilterChange={handleFilterChange} />

                {/* View Mode Toggle */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">View:</span>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'
                                    }`}
                            >
                                <Grid size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'
                                    }`}
                            >
                                <List size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="text-sm text-gray-600">
                        {loading ? 'Loading...' : `${items.length} items found`}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-primary-600">{availableItems.length}</div>
                        <div className="text-sm text-gray-600">Available Items</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-gray-600">{claimedItems.length}</div>
                        <div className="text-sm text-gray-600">Claimed Items</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-green-600">{items.length}</div>
                        <div className="text-sm text-gray-600">Total Items</div>
                    </div>
                </div>

                {/* Available Items Section */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Available Items</h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                        {availableItems.length === 0 ? (
                            <div className="col-span-full text-center text-gray-500 py-8">No available items found.</div>
                        ) : (
                            availableItems.map(item => (
                                <ItemCard
                                    key={item.id}
                                    item={item}
                                    onUpdate={handleItemUpdate}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* All Items Grid/List */}
                <h2 className="text-2xl font-bold text-gray-700 mb-4">All Items</h2>
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-12">
                        <Filter className="mx-auto text-gray-400 mb-4" size={48} />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No items found</h3>
                        <p className="text-gray-600">Try adjusting your search criteria or browse all items.</p>
                    </div>
                ) : (
                    <div className={viewMode === 'grid'
                        ? 'grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6'
                        : 'space-y-4'
                    }>
                        {items.map(item => (
                            <div key={item.id}>
                                <ItemCard
                                    item={item}
                                    onUpdate={handleItemUpdate}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default BrowseItems
