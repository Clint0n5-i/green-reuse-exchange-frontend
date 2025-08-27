import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { KISII_SUB_COUNTIES } from '../constants/locations.js'

const SearchBar = ({ onSearch, onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [category, setCategory] = useState('')
    const [location, setLocation] = useState('')

    const categories = [
        { value: '', label: 'All Categories' },
        { value: 'BOOKS', label: 'Books' },
        { value: 'FURNITURE', label: 'Furniture' },
        { value: 'ELECTRONICS', label: 'Electronics' },
        { value: 'CLOTHING', label: 'Clothing' },
        { value: 'TOYS', label: 'Toys' },
        { value: 'KITCHEN', label: 'Kitchen' },
        { value: 'GARDEN', label: 'Garden' },
        { value: 'SPORTS', label: 'Sports' },
        { value: 'OTHER', label: 'Other' }
    ]

    const locations = [
        { value: '', label: 'All Locations' },
        ...KISII_SUB_COUNTIES.map(l => ({ value: l, label: l })),
    ]

    const handleSearch = (e) => {
        e.preventDefault()
        onSearch(searchTerm, category, location)
    }

    const handleFilterChange = (type, value) => {
        if (type === 'category') {
            setCategory(value)
            onFilterChange(searchTerm, value, location)
        } else if (type === 'location') {
            setLocation(value)
            onFilterChange(searchTerm, category, value)
        }
    }

    return (
        <div className="card mb-6">
            <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-10"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                value={category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="input-field pl-10 appearance-none"
                            >
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                value={location}
                                onChange={(e) => handleFilterChange('location', e.target.value)}
                                className="input-field pl-10 appearance-none"
                            >
                                {locations.map(loc => (
                                    <option key={loc.value} value={loc.value}>
                                        {loc.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <button type="submit" className="btn-primary">
                        Search
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setSearchTerm('')
                            setCategory('')
                            setLocation('')
                            onSearch('', '', '')
                        }}
                        className="btn-secondary"
                    >
                        Clear Filters
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SearchBar
