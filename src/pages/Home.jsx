import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { Link } from 'react-router-dom'
import { itemService } from '../services/api.js'
import ItemCard from '../components/ItemCard.jsx'
import { ArrowRight, Leaf, Users, MapPin, Package } from 'lucide-react'

const Home = () => {
    const [recentItems, setRecentItems] = useState([])
    const [loading, setLoading] = useState(true)
    const { user, admin } = useAuth();

    useEffect(() => {
        const fetchRecentItems = async () => {
            try {
                const response = await itemService.getAvailableItems()
                setRecentItems(response.data.slice(0, 6)) // Show only 6 recent items
            } catch (error) {
                console.error('Error fetching recent items:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchRecentItems()
    }, [])

    const features = [
        {
            icon: <Leaf className="w-8 h-8 text-primary-600" />,
            title: 'Reduce Waste',
            description: 'Give items a second life and help reduce environmental impact'
        },
        {
            icon: <Users className="w-8 h-8 text-primary-600" />,
            title: 'Community Building',
            description: 'Connect with neighbors and build a sustainable community'
        },
        {
            icon: <MapPin className="w-8 h-8 text-primary-600" />,
            title: 'Local Exchange',
            description: 'Find items near you for easy pickup and exchange'
        },
        {
            icon: <Package className="w-8 h-8 text-primary-600" />,
            title: 'Easy Sharing',
            description: 'Simple platform to list and claim reusable items'
        }
    ]

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center py-16 bg-gradient-to-br from-primary-50 to-green-50 rounded-2xl">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                        Give Items a
                        <span className="text-primary-600"> Second Life</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join our community platform to exchange reusable items, reduce waste, and build a more sustainable future together.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/browse" className="btn-primary text-lg px-8 py-3">
                            Browse Items
                            <ArrowRight className="ml-2" size={20} />
                        </Link>
                        {!(user || admin) && (
                            <Link to="/signup" className="btn-secondary text-lg px-8 py-3">
                                Join Community
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    Why Choose Green Reuse?
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center">
                            <div className="flex justify-center mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recent Items Section */}
            <section>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Recently Added Items
                    </h2>
                    <Link to="/browse" className="text-primary-600 hover:text-primary-700 font-medium">
                        View All Items
                        <ArrowRight className="ml-1 inline" size={16} />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentItems.map(item => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>
                )}

                {!loading && recentItems.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No items available at the moment.</p>
                        <Link to="/post-item" className="text-primary-600 hover:text-primary-700 font-medium">
                            Be the first to post an item!
                        </Link>
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="bg-primary-600 text-white rounded-2xl p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">
                    Ready to Start Sharing?
                </h2>
                <p className="text-xl mb-6 opacity-90">
                    Join thousands of users who are already making a difference in their communities.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {!(user || admin) && (
                        <Link to="/signup" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors">
                            Get Started
                        </Link>
                    )}
                    <Link to="/browse" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors">
                        Explore Items
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default Home
