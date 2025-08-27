import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { itemService } from '../services/api';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const ItemCard = ({ item, onUpdate, onClick }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showContactDetails, setShowContactDetails] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(item.status);
    const [claimedById, setClaimedById] = useState(item.claimedBy?.id ?? null);
    const [showImageGallery, setShowImageGallery] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleClaimAction = async () => {
        if (!user) {
            toast.error('Please login to claim items');
            return;
        }

        if (item.postedBy?.id === user.id) {
            toast.error('You cannot claim your own item');
            return;
        }

        setLoading(true);
        try {
            if (currentStatus === 'AVAILABLE') {
                await itemService.claimItem(item.id);
                setCurrentStatus('CLAIMED');
                setClaimedById(user.id);
                toast.success('Item claimed successfully! Contact the owner to arrange pickup.');
            } else {
                // Only allow unclaim if current user is the claimer
                if (claimedById !== user.id) {
                    toast.error('Only the claimer can unclaim this item');
                    return;
                }
                await itemService.unclaimItem(item.id);
                setCurrentStatus('AVAILABLE');
                setClaimedById(null);
                setShowContactDetails(false);
                toast.success('Item unclaimed successfully.');
            }

            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update item status');
        } finally {
            setLoading(false);
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            BOOKS: 'bg-blue-100 text-blue-800',
            FURNITURE: 'bg-amber-100 text-amber-800',
            ELECTRONICS: 'bg-purple-100 text-purple-800',
            CLOTHING: 'bg-pink-100 text-pink-800',
            TOYS: 'bg-yellow-100 text-yellow-800',
            KITCHEN: 'bg-orange-100 text-orange-800',
            GARDEN: 'bg-green-100 text-green-800',
            SPORTS: 'bg-red-100 text-red-800',
            OTHER: 'bg-gray-100 text-gray-800'
        };
        return colors[category] || colors.OTHER;
    };

    // Use new imageIds from backend
    const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
    const imageUrls = item.imageIds && item.imageIds.length > 0
        ? item.imageIds.map(id => `${apiBaseUrl}/items/images/${id}`)
        : [];

    const openImageGallery = (index = 0) => {
        setCurrentImageIndex(index);
        setShowImageGallery(true);
    };

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => 
            prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => 
            prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
        );
    };

    const closeGallery = () => {
        setShowImageGallery(false);
    };

    // Prevent gallery navigation from closing when clicking on the image
    const handleImageClick = (e) => {
        e.stopPropagation();
    };

    return (
        <>
            <div
                className="glass-card overflow-hidden transition-shadow cursor-pointer flex flex-col h-full min-h-[480px] items-stretch"
                style={{ height: 'auto' }}
                onClick={onClick}
            >
                {/* Image section with multiple image indicator */}
                {imageUrls.length > 0 && (
                    <div className="relative cursor-pointer" onClick={() => openImageGallery()}>
                        <img
                            src={imageUrls[0]}
                            alt={item.title}
                            className="w-full h-64 object-cover mb-2 rounded-t-lg"
                        />
                        
                        {/* Multiple images indicator */}
                        {imageUrls.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md text-sm">
                                {imageUrls.length} photos
                            </div>
                        )}
                    </div>
                )}
                
                <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{item.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(item.category)}`}>
                            {item.category}
                        </span>
                    </div>
                    <div className="mb-2">
                        {item.type === 'EXCHANGE' ? (
                            <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 mr-2">Exchange</span>
                        ) : (
                            <span className="px-2 py-1 rounded bg-green-100 text-green-800 mr-2">Free</span>
                        )}
                        {item.type === 'EXCHANGE' && item.exchangeFor && (
                            <span className="px-2 py-1 rounded bg-blue-50 text-blue-700">Exchange for: {item.exchangeFor}</span>
                        )}
                    </div>

                    {item.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                    )}

                    <div className="space-y-2 mb-4 flex-1">
                        <div className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {item.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Posted by {item.postedBy.name}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                            currentStatus === 'AVAILABLE'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {currentStatus}
                        </span>

                        <div className="flex items-center gap-2">
                            {currentStatus === 'CLAIMED' && claimedById === user?.id && user?.role !== 'ADMIN' && (
                                <button
                                    onClick={() => setShowContactDetails(!showContactDetails)}
                                    className="text-green-600 hover:text-green-700 text-sm font-medium px-3 py-1.5 border border-green-200 rounded-md"
                                >
                                    {showContactDetails ? 'Hide Contact' : 'Show Contact'}
                                </button>
                            )}

                            {user && item.postedBy?.id !== user.id && user.role !== 'ADMIN' && (
                                <>
                                    {currentStatus === 'AVAILABLE' && (
                                        <button
                                            onClick={handleClaimAction}
                                            disabled={loading}
                                            className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-primary animate-claim-pulse hover:bg-primary-600 disabled:opacity-50`}
                                        >
                                            {loading ? 'Processing...' : 'Claim Item'}
                                        </button>
                                    )}
                                    {currentStatus === 'CLAIMED' && claimedById === user.id && (
                                        <button
                                            onClick={handleClaimAction}
                                            disabled={loading}
                                            className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50`}
                                        >
                                            {loading ? 'Processing...' : 'Unclaim Item'}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Contact Details Section */}
                    {showContactDetails && currentStatus === 'CLAIMED' && claimedById === user?.id && user?.role !== 'ADMIN' && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Contact Details for Exchange</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="text-gray-700">{item.postedBy.phone}</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-4 h-4 mr-2 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-gray-700">{item.postedBy.address}</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                    <span className="text-gray-700">{item.postedBy.email}</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">
                                Contact {item.postedBy.name} to arrange pickup of this item.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Gallery Modal */}
            {showImageGallery && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={closeGallery}>
                    <div className="relative max-w-4xl max-h-full w-full">
                        <button
                            onClick={closeGallery}
                            className="absolute top-4 right-4 z-10 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
                        >
                            <X size={24} />
                        </button>
                        
                        <div className="relative" onClick={handleImageClick}>
                            <img
                                src={imageUrls[currentImageIndex]}
                                alt={`${item.title} - Image ${currentImageIndex + 1}`}
                                className="w-full max-h-[80vh] object-contain rounded-lg"
                            />
                            
                            {imageUrls.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>
                        
                        {/* Image counter and thumbnails */}
                        <div className="mt-4 flex items-center justify-center space-x-2">
                            <span className="text-white text-sm">
                                {currentImageIndex + 1} / {imageUrls.length}
                            </span>
                        </div>
                        
                        {/* Thumbnail navigation */}
                        {imageUrls.length > 1 && (
                            <div className="mt-4 flex justify-center space-x-2 overflow-x-auto pb-2">
                                {imageUrls.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`Thumbnail ${index + 1}`}
                                        className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                                            index === currentImageIndex 
                                                ? 'border-white' 
                                                : 'border-transparent opacity-60'
                                        } hover:opacity-100`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(index);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ItemCard;