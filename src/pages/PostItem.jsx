import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { itemService } from '../services/api.js'
import { Package, Tag, MapPin, FileText, X, Upload } from 'lucide-react'
import { KISII_SUB_COUNTIES } from '../constants/locations.js'
import toast from 'react-hot-toast'

const PostItem = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        location: ''
    })
    const [images, setImages] = useState([])
    const [imagePreviews, setImagePreviews] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [itemType, setItemType] = useState('free')
    const [exchangeFor, setExchangeFor] = useState('')
    const fileInputRef = useRef(null)

    const navigate = useNavigate()

    const categories = [
        { value: '', label: 'Select a category' },
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

    const locations = KISII_SUB_COUNTIES

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        
        if (files.length < 1) {
            setError('Please upload at least 1 image')
            return
        }
        
        // Check if adding these files would exceed the 5 image limit
        if (images.length + files.length > 5) {
            setError('Maximum 5 images allowed')
            return
        }
        
        // Validate file types
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        const invalidFiles = files.filter(file => !validImageTypes.includes(file.type))
        
        if (invalidFiles.length > 0) {
            setError('Please upload only image files (JPEG, PNG, GIF, WebP)')
            return
        }
        
        // Create previews for the new files
        const newPreviews = files.map(file => URL.createObjectURL(file))
        
        setImages(prev => [...prev, ...files])
        setImagePreviews(prev => [...prev, ...newPreviews])
        setError('')
    }

    const removeImage = (index) => {
        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(imagePreviews[index])
        
        setImages(prev => prev.filter((_, i) => i !== index))
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    const handleTypeChange = (e) => {
        setItemType(e.target.value)
        if (e.target.value === 'free') {
            setExchangeFor('')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (images.length < 1) {
            setError('Please upload at least 1 image')
            return
        }
        if (itemType === 'exchange' && !exchangeFor.trim()) {
            setError('Please specify what you want in exchange')
            return
        }
        setLoading(true)

        try {
            const formDataWithImages = new FormData()
            formDataWithImages.append('title', formData.title)
            formDataWithImages.append('description', formData.description)
            formDataWithImages.append('category', formData.category)
            formDataWithImages.append('location', formData.location)
            formDataWithImages.append('type', itemType === 'free' ? 'FREE' : 'EXCHANGE')
            if (itemType === 'exchange') {
                formDataWithImages.append('exchangeFor', exchangeFor)
            }
            
            // Append all images
            images.forEach((image) => {
                formDataWithImages.append('images', image)
            })

            await itemService.createItemWithUpload(formDataWithImages)
            toast.success('Item posted successfully!')
            navigate('/browse')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post item')
        } finally {
            setLoading(false)
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Post an Item</h1>
                <p className="text-gray-600">Share your reusable items with the community</p>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Item Title
                        </label>
                        <div className="relative">
                            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                id="title"
                                name="title"
                                type="text"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="input-field pl-10"
                                placeholder="Enter item title"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className="input-field pl-10 resize-none"
                                placeholder="Describe your item (condition, size, etc.)"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                id="category"
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                className="input-field pl-10"
                            >
                                {categories.map(category => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                id="location"
                                name="location"
                                required
                                value={formData.location}
                                onChange={handleChange}
                                className="input-field pl-10"
                            >
                                <option value="">Select location</option>
                                {locations.map(location => (
                                    <option key={location} value={location}>
                                        {location}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Item Type</label>
                        <div className="flex gap-4 mb-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="itemType"
                                    value="free"
                                    checked={itemType === 'free'}
                                    onChange={handleTypeChange}
                                />
                                <span>Free</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="itemType"
                                    value="exchange"
                                    checked={itemType === 'exchange'}
                                    onChange={handleTypeChange}
                                />
                                <span>Exchange</span>
                            </label>
                        </div>
                        {itemType === 'exchange' && (
                            <div className="mt-2">
                                <label htmlFor="exchangeFor" className="block text-sm font-medium text-gray-700 mb-1">
                                    What do you want in exchange?
                                </label>
                                <input
                                    id="exchangeFor"
                                    name="exchangeFor"
                                    type="text"
                                    value={exchangeFor}
                                    onChange={e => setExchangeFor(e.target.value)}
                                    className="input-field"
                                    placeholder="e.g. Books, Kitchenware, etc."
                                    required={itemType === 'exchange'}
                                />
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Images ({images.length}/5)
                        </label>
                        
                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        
                        {/* Upload button */}
                        <button
                            type="button"
                            onClick={triggerFileInput}
                            disabled={images.length >= 5}
                            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                        >
                            <Upload size={18} />
                            <span>Select Images</span>
                        </button>
                        
                        <p className="text-sm text-gray-500 mb-3">
                            Upload 1-5 images of your item. Supported formats: JPG, PNG, GIF, WebP
                        </p>
                        
                        {/* Image previews */}
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                                {imagePreviews.map((src, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="w-full h-32 border rounded-md overflow-hidden flex items-center justify-center bg-gray-100">
                                            <img 
                                                src={src} 
                                                alt={`Preview ${idx + 1}`} 
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">Tips for posting:</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Be descriptive about the item's condition</li>
                            <li>• Include relevant details like size, brand, or age</li>
                            <li>• Choose the most appropriate category</li>
                            <li>• Set a location where the item can be picked up</li>
                            <li>• Upload clear photos from different angles</li>
                        </ul>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading || images.length === 0}
                            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Posting...' : 'Post Item'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/browse')}
                            className="flex-1 btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PostItem