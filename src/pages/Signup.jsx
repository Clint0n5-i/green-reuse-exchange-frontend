import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        location: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [addressOptions, setAddressOptions] = useState([]);
    const [customAddress, setCustomAddress] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);

    const locations = [
        'Bomachoge Borabu',
        'Bomachoge Chache',
        'Bobasi',
        'Bonchari',
        'Kitutu Chache North',
        'Kitutu Chache South',
        'Nyaribari Chache',
        'Nyaribari Masaba',
        'South Mugirango',
        'Ogembo',
        'Other',
    ];

    // Load addresses from localStorage or use default addresses
    const loadLocationAddresses = () => {
        const savedAddresses = localStorage.getItem('locationAddresses');
        if (savedAddresses) {
            return JSON.parse(savedAddresses);
        }
        
        // Default addresses for Kisii County
        return {
            'Bomachoge Borabu': [
                'Nyabiomi Trading Center',
                'Nyamache Town',
                'Kegogi Market',
                'Nyamarambe Trading Center',
                'Bomorenda Shopping Center',
                'Mokomoni Market',
                'Borabu Corner',
                'Nyansakia Trading Center',
                'Nyamongo Market',
                'Rigoma Junction'
            ],
            'Bomachoge Chache': [
                'Nyatieko Market',
                'Kisii University Campus Area',
                'Nyakoe Center',
                'Riana Shopping Center',
                'Egetuki Market',
                'Nyamage Trading Center',
                'Bokimonge Market',
                'Kionganyo Shopping Center',
                'Mogonga Center',
                'Nyanturago Trading Center'
            ],
            'Bobasi': [
                'Nyamache Town',
                'Manga Market',
                'Nyamarambe Trading Center',
                'Getenga Shopping Center',
                'Boikanga Center',
                'Bokimonge Market',
                'Itierio Market',
                'Nyaisa Trading Center',
                'Mochenwa Market',
                'Bomorenda Shopping Center'
            ],
            'Bonchari': [
                'Suneka Town',
                'Rongo University Campus Area',
                'Ogembo Town',
                'Kenyenya Market',
                'Kegogi Shopping Center',
                'Nyangiti Trading Center',
                'Bokimonge Market',
                'Nyaisa Market',
                'Bomorenda Center',
                'Rigoma Junction'
            ],
            'Kitutu Chache North': [
                'Kisii Town Central',
                'Jogoo Road Area',
                'Mwembe Area',
                'Nyanchwa Estate',
                'Egesa Estate',
                'Daraja Mbili Area',
                'Mwembe TTI Area',
                'Nyamage Area',
                'Nyakoe Center',
                'Kisii Hospital Area'
            ],
            'Kitutu Chache South': [
                'Daraja Mbili Area',
                'Egesa Estate',
                'Nyamataro Area',
                'Kegochi Market',
                'Nyakoe Center',
                'Mogonga Area',
                'Bokimonge Market',
                'Nyaisa Trading Center',
                'Riana Shopping Center',
                'Nyatieko Market'
            ],
            'Nyaribari Chache': [
                'Itierio Market',
                'Kionganyo Area',
                'Riomega Shopping Center',
                'Kiamokama Market',
                'Nyakoe Center',
                'Mogonga Area',
                'Nyatieko Market',
                'Riana Shopping Center',
                'Egetuki Market',
                'Nyamage Trading Center'
            ],
            'Nyaribari Masaba': [
                'Marani Market',
                'Keroka Town',
                'Magena Market',
                'Ekerenyo Shopping Center',
                'Nyamira Town',
                'Ikonge Market',
                'Rigoma Junction',
                'Bomorenda Shopping Center',
                'Nyansakia Trading Center',
                'Borabu Corner'
            ],
            'South Mugirango': [
                'Nyamarambe Trading Center',
                'Ogembo Town',
                'Nyabigege Market',
                'Bokeira Market',
                'Kegogi Shopping Center',
                'Nyangiti Trading Center',
                'Bokimonge Market',
                'Nyaisa Market',
                'Bomorenda Center',
                'Rigoma Junction'
            ],
            'Ogembo': [
                'Ogembo Town Center',
                'Rigoma Market',
                'Bonyamatuta Area',
                'Gesusu Shopping Center',
                'Nyabigege Market',
                'Bokeira Market',
                'Kegogi Shopping Center',
                'Nyangiti Trading Center',
                'Bokimonge Market',
                'Nyaisa Market'
            ],
            'Other': [
                'Enter custom address'
            ]
        };
    };

    const [locationAddresses, setLocationAddresses] = useState(loadLocationAddresses());

    useEffect(() => {
        // Update address options when location changes
        if (formData.location) {
            setAddressOptions(locationAddresses[formData.location] || []);
            
            // Reset address when location changes
            setFormData(prev => ({
                ...prev,
                address: ''
            }));
            setCustomAddress('');
            setShowCustomInput(false);
        } else {
            setAddressOptions([]);
        }
    }, [formData.location, locationAddresses]);

    // Save addresses to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('locationAddresses', JSON.stringify(locationAddresses));
    }, [locationAddresses]);

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        // 8+ chars, at least one special character
        const regex = /^(?=.*[!@#$%^&*()_+\-={}\[\]:;"'<>,.?/]).{8,}$/;
        return regex.test(password);
    };

    const validateKenyanPhone = (phone) => {
        // Accept +2547XXXXXXXX or 07XXXXXXXX
        const regex = /^(\+254|0)7\d{8}$/;
        return regex.test(phone);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddressSelect = (e) => {
        const selectedValue = e.target.value;
        
        if (selectedValue === 'add_custom') {
            // Show custom address input
            setShowCustomInput(true);
            setFormData({
                ...formData,
                address: ''
            });
        } else {
            setShowCustomInput(false);
            setFormData({
                ...formData,
                address: selectedValue
            });
        }
    };

    const handleCustomAddressChange = (e) => {
        const value = e.target.value;
        setCustomAddress(value);
        setFormData({
            ...formData,
            address: value
        });
    };

    const handleAddCustomAddress = () => {
        if (customAddress.trim() && formData.location) {
            // Add the custom address to the location's address list
            const updatedAddresses = {
                ...locationAddresses,
                [formData.location]: [...(locationAddresses[formData.location] || []), customAddress.trim()]
            };
            
            setLocationAddresses(updatedAddresses);
            setAddressOptions(updatedAddresses[formData.location]);
            
            // Select the newly added address
            setFormData({
                ...formData,
                address: customAddress.trim()
            });
            
            setShowCustomInput(false);
            setCustomAddress('');
        }
    };

    const handleCancelCustomAddress = () => {
        setShowCustomInput(false);
        setCustomAddress('');
        setFormData({
            ...formData,
            address: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const email = formData.email;

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!validatePassword(formData.password)) {
            setError('Password must be 8+ characters and include at least one special character');
            return;
        }

        if (!validateKenyanPhone(formData.phone)) {
            setError('Enter a valid Kenyan phone number e.g. +254712345678 or 0712345678');
            return;
        }

        if (!formData.location) {
            setError('Please select your location');
            return;
        }

        if (!formData.address) {
            setError('Please select or enter your address');
            return;
        }

        setLoading(true);

        try {
            const result = await signup({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                location: formData.location,
                phone: formData.phone,
                address: formData.address
            });

            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error || 'Signup failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Join the Green Reuse Exchange community in Kisii County
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <div className="mt-1">
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    placeholder="+254700123456"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                Sub-County
                            </label>
                            <div className="mt-1">
                                <select
                                    id="location"
                                    name="location"
                                    required
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">Select your sub-county</option>
                                    {locations.map((location) => (
                                        <option key={location} value={location}>
                                            {location}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <div className="mt-1">
                                {formData.location ? (
                                    <>
                                        {!showCustomInput ? (
                                            <select
                                                id="address"
                                                name="address"
                                                required
                                                value={formData.address}
                                                onChange={handleAddressSelect}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            >
                                                <option value="">Select your address</option>
                                                {addressOptions.map((address) => (
                                                    <option key={address} value={address}>
                                                        {address}
                                                    </option>
                                                ))}
                                                <option value="add_custom">+ Add custom address</option>
                                            </select>
                                        ) : (
                                            <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                                                <label htmlFor="customAddress" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Enter your custom address
                                                </label>
                                                <textarea
                                                    id="customAddress"
                                                    rows={3}
                                                    placeholder="Enter your full address"
                                                    value={customAddress}
                                                    onChange={handleCustomAddressChange}
                                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                                    autoFocus
                                                />
                                                <div className="mt-3 flex space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={handleAddCustomAddress}
                                                        disabled={!customAddress.trim()}
                                                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                                                    >
                                                        Add Address
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleCancelCustomAddress}
                                                        className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-sm text-gray-500 py-2 px-3 bg-gray-100 rounded-md">
                                        Please select a sub-county first to see address options
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                                {loading ? 'Creating account...' : 'Sign up'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                to="/login"
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;