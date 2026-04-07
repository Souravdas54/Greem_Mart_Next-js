'use client';

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUser, FiShoppingBag, FiMapPin, FiHeart, FiEye,
    FiStar, FiCreditCard, FiBell, FiSettings, FiLock,
    FiTruck, FiCheckCircle, FiClock, FiPackage,
    FiEdit, FiTrash2, FiPlus, FiDownload, FiFilter,
    FiHome
} from 'react-icons/fi';
import { MdLocationOn } from 'react-icons/md';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';

// Mock data for demonstration
interface UserDetails {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl: string;
    location: string;
    isActive: string;
}

const mockOrders = [
    {
        id: "ORD-78945",
        date: "2024-03-15",
        items: 3,
        total: 149.99,
        status: "delivered",
        statusText: "Delivered",
        statusColor: "bg-green-500",
        plants: ["Monstera Deliciosa", "Snake Plant", "Peace Lily"]
    },
    {
        id: "ORD-78946",
        date: "2024-03-10",
        items: 1,
        total: 89.99,
        status: "shipped",
        statusText: "Shipped",
        statusColor: "bg-blue-500",
        plants: ["Fiddle Leaf Fig"]
    },
    {
        id: "ORD-78947",
        date: "2024-03-05",
        items: 2,
        total: 129.99,
        status: "processing",
        statusText: "Processing",
        statusColor: "bg-yellow-500",
        plants: ["Rubber Plant", "ZZ Plant"]
    }
];

const mockAddresses = [
    {
        id: 1,
        name: "Home",
        address: "123 Green Street, Apt 4B",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "USA",
        phone: "+1 (555) 123-4567",
        isDefault: true
    },
    {
        id: 2,
        name: "Office",
        address: "456 Business Ave, Suite 1200",
        city: "New York",
        state: "NY",
        zip: "10017",
        country: "USA",
        phone: "+1 (555) 987-6543",
        isDefault: false
    }
];

const mockWishlist = [
    {
        id: 1,
        name: "Monstera Deliciosa",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=400&h=400&fit=crop",
        nursery: "Urban Jungle",
        category: "Indoor",
        stock: 15
    },
    {
        id: 2,
        name: "Fiddle Leaf Fig",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
        nursery: "Green Haven",
        category: "Indoor",
        stock: 8
    }
];

const mockRecentViews = [
    {
        id: 1,
        name: "Snake Plant",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=400&fit=crop",
        viewedAt: "2 hours ago"
    },
    {
        id: 2,
        name: "Peace Lily",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1517191434949-5e90cd67d2b6?w=400&h=400&fit=crop",
        viewedAt: "1 day ago"
    }
];

const mockReviews = [
    {
        id: 1,
        plant: "Monstera Deliciosa",
        rating: 5,
        comment: "Beautiful plant, arrived in perfect condition!",
        date: "2024-03-10",
        helpful: 12
    },
    {
        id: 2,
        plant: "Snake Plant",
        rating: 4,
        comment: "Very healthy plant, would recommend!",
        date: "2024-03-05",
        helpful: 8
    }
];

const mockPayments = [
    {
        id: "INV-001",
        date: "2024-03-15",
        amount: 149.99,
        method: "Credit Card",
        status: "Paid",
        items: 3
    },
    {
        id: "INV-002",
        date: "2024-03-10",
        amount: 89.99,
        method: "PayPal",
        status: "Paid",
        items: 1
    }
];

const mockNotifications = [
    {
        id: 1,
        title: "Order Shipped",
        message: "Your order ORD-78946 has been shipped",
        time: "2 hours ago",
        read: false,
        type: "order"
    },
    {
        id: 2,
        title: "Price Drop Alert",
        message: "Monstera Deliciosa price dropped 20%",
        time: "1 day ago",
        read: true,
        type: "price"
    }
];

type TabType = 'profile' | 'orders' | 'addresses' | 'wishlist' | 'recent' | 'reviews' | 'payments' | 'notifications' | 'security';

const UserDashboard: React.FC = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState(mockNotifications);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const { user, isLoggedIn, isLoading } = useAuth();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarUpload = async (file: File) => {
        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('avatar', file);

            // Upload to your API endpoint
            const response = await fetch('/api/upload-avatar', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                // Update user data with new avatar URL
                // setUserData({ ...userData, avatarUrl: data.avatarUrl });
                console.log('Upload successful:', data);
            } else {
                console.error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
        }
    };

    // Handler for file input change
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type and size
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('File size should be less than 5MB');
                return;
            }

            // Optional: Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                // If you want to show preview before upload
                // setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload the file
            handleAvatarUpload(file);

            // Reset the input to allow selecting same file again
            e.target.value = '';
        }
    };


    const tabs = [
        { id: 'profile', label: 'Profile', icon: FiUser },
        { id: 'orders', label: 'My Orders', icon: FiShoppingBag },
        { id: 'addresses', label: 'Addresses', icon: FiMapPin },
        { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
        { id: 'recent', label: 'Recently Viewed', icon: FiEye },
        { id: 'reviews', label: 'My Reviews', icon: FiStar },
        { id: 'payments', label: 'Payments', icon: FiCreditCard },
        { id: 'notifications', label: 'Notifications', icon: FiBell },
        { id: 'security', label: 'Security', icon: FiLock }
    ];

    // useEffect(() => {

    //     const fetchUserData = () => {
    //         try {
    //             const userDataLocal = localStorage.getItem('userData')
    //             const userDataSession = sessionStorage.getItem('userData')

    //             if (userDataLocal) {
    //                 const parsedData = JSON.parse(userDataLocal);
    //                 console.log("User data from localStorage:", parsedData);
    //                 setUserData(parsedData);
    //             } else if (userDataSession) {
    //                 const parsedData = JSON.parse(userDataSession);
    //                 console.log("User data from sessionStorage:", parsedData);
    //                 setUserData(parsedData);
    //             } else {
    //                 console.log("No user data found in storage");
    //                 // Redirect to login if no user data
    //                 router.push('/login');
    //             }

    //         } catch (error) {
    //             console.error("Error parsing user data:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    //     fetchUserData();
    // }, [router])

    useEffect(() => {
        if (isLoading) return; // wait for /auth/me to finish

        if (!isLoggedIn || !user) {
            router.replace('/auth/signin'); // ✅ fixed: was '/auth/login' → 404
            return;
        }

        if (user.role !== 'user') {
            if (user.role === 'super_admin') router.replace('/auth/superadmindashboard');
            else if (user.role === 'nursery_admin') router.replace('/auth/nurserydashboard');
        }
    }, [isLoading, isLoggedIn, user, router]);


    const handleForgotPassword = () => {
        toast.loading("Redirecting to forgot password page...");
        router.push("/auth/password/forgotpassword");
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('UserId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('greenmet-auth');

        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('userRole');

        router.push('/');
    };

    const handleViewOrderDetails = (order: any) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    const handleMarkNotificationAsRead = (id: number) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    };

    const renderStatusBadge = (status: string) => {
        const statusConfig = {
            processing: { color: 'bg-yellow-100 text-yellow-800', icon: FiClock },
            shipped: { color: 'bg-blue-100 text-blue-800', icon: FiTruck },
            delivered: { color: 'bg-green-100 text-green-800', icon: FiCheckCircle }
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.processing;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                <Icon className="w-4 h-4 mr-1" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Profile Header */}
                        <div className="bg-white-100 rounded-xl shadow-sm p-6 backdrop-blur-md  ">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white-800">Profile Information</h3>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <FiEdit className="w-4 h-4 mr-2" />
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-sm font-medium text-green-600 hover:text-green-500"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {
                                isLoading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                                        <p className="mt-4 text-gray-600">Loading user data...</p>
                                    </div>
                                ) : user ? (
                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                        {/* Profile Photo */}
                                        <div className="relative">
                                            <img
                                                src={user?.avatarUrl}
                                                alt={user?.name}
                                                className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                                            />
                                            {isEditing && (
                                                <>
                                                    <button
                                                        onClick={() => document.getElementById('avatar-upload')?.click()}
                                                        className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                                                        <FiEdit className="w-4 h-4" />

                                                    </button>
                                                    <input
                                                        ref={fileInputRef}
                                                        type='file'
                                                        id="avatar-upload"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                    />
                                                </>
                                            )}
                                        </div>

                                        {/* Profile Details */}
                                        <div className="flex-1">
                                            {isEditing ? (
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-100 mb-1">Full Name</label>
                                                        <input
                                                            type="text"
                                                            value={user?.name}
                                                            // onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-100 mb-1">Email</label>
                                                        <input
                                                            type="email"
                                                            value={user?.email}
                                                            // onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                                            disabled
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-100 mb-1">Address</label>
                                                        <input
                                                            type="text"
                                                            // value={user?}
                                                            // onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <button
                                                            onClick={() => setIsEditing(false)}
                                                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                                            Save Changes
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="text-2xl font-bold text-white-800">{user?.name}</h4>
                                                        <p className="text-white-600">{user?.email}</p>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="flex items-center">
                                                            <MdLocationOn className="w-5 h-5 text-white-400 mr-3" />
                                                            <span className="text-white-700">{user?.location}</span>
                                                        </div>
                                                        {/* <div className="flex items-center">
                                                            <FiUser className="w-5 h-5 text-gray-400 mr-3" />
                                                            <span className="text-gray-700">{userData?.membership}</span>
                                                        </div> */}
                                                    </div>
                                                    {/* <div className="pt-4 border-t border-gray-100">
                                                        <p className="text-sm text-gray-500">Member since {userData?.joinDate}</p>
                                                    </div> */}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-red-600">No user data found. Please login again.</p>
                                        <button
                                            onClick={() => router.push('/login')}
                                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                        >
                                            Go to Login
                                        </button>
                                    </div>
                                )
                            }

                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white-100 rounded-xl shadow-sm p-6 backdrop-blur-md">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-white-700">Total Orders</h4>
                                    <FiShoppingBag className="w-6 h-6 text-green-500" />
                                </div>
                                <p className="text-3xl font-bold text-white-800">{mockOrders.length}</p>
                                <p className="text-sm text-white-500 mt-2">All time orders</p>
                            </div>

                            <div className="bg-white-100 rounded-xl shadow-sm p-6 backdrop-blur-md">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-white-700">Wishlist Items</h4>
                                    <FiHeart className="w-6 h-6 text-red-500" />
                                </div>
                                <p className="text-3xl font-bold text-white-800">{mockWishlist.length}</p>
                                <p className="text-sm text-white-500 mt-2">Saved for later</p>
                            </div>

                            <div className="bg-white-100 rounded-xl shadow-sm p-6 backdrop-blur-md">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-white-700">Total Reviews</h4>
                                    <FiStar className="w-6 h-6 text-yellow-500" />
                                </div>
                                <p className="text-3xl font-bold text-white-800">{mockReviews.length}</p>
                                <p className="text-sm text-white-500 mt-2">Your feedback</p>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'orders':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white-800">Order History</h3>
                            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <FiFilter className="w-4 h-4 mr-2" />
                                Filter
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mockOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="font-medium text-gray-900">{order.id}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {new Date(order.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {order.items} item{order.items > 1 ? 's' : ''}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                    ${order.total.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {renderStatusBadge(order.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleViewOrderDetails(order)}
                                                        className="text-green-600 hover:text-green-800 font-medium"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Order Tracking Visualization */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h4 className="text-lg font-bold text-gray-800 mb-6">Order Tracking Status</h4>
                            <div className="relative">
                                {/* Tracking Line */}
                                <div className="absolute left-8 top-1/2 transform -translate-y-1/2 w-3/4 h-2 bg-gray-200 rounded-full"></div>

                                {/* Tracking Steps */}
                                <div className="relative flex justify-between items-center">
                                    {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((step, index) => {
                                        const isActive = index <= 2; // Example: Order is shipped
                                        return (
                                            <div key={step} className="flex flex-col items-center relative z-10">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${isActive ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <span className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {step}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'addresses':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white-800">Saved Addresses</h3>
                            <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                <FiPlus className="w-4 h-4 mr-2" />
                                Add New Address
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {mockAddresses.map((address) => (
                                <div key={address.id} className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 hover:border-green-300 transition-colors">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-lg">{address.name}</h4>
                                            {address.isDefault && (
                                                <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="p-2 text-gray-400 hover:text-green-600">
                                                <FiEdit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600">
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-gray-600">
                                        <p>{address.address}</p>
                                        <p>{address.city}, {address.state} {address.zip}</p>
                                        <p>{address.country}</p>
                                        <p className="mt-4 flex items-center">
                                            <span className="font-medium mr-2">Phone:</span>
                                            {address.phone}
                                        </p>
                                    </div>
                                    {!address.isDefault && (
                                        <button className="mt-4 w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                            Set as Default
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'wishlist':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white-800">Wishlist ({mockWishlist.length} items)</h3>
                            <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                Move All to Cart
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mockWishlist.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="relative">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-600 transition-colors">
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-bold text-gray-800">{item.name}</h4>
                                                <p className="text-sm text-gray-500">{item.nursery}</p>
                                            </div>
                                            <span className="font-bold text-green-600">${item.price}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <span className={`text-sm px-2 py-1 rounded-full ${item.stock > 5 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {item.stock > 5 ? 'In Stock' : 'Low Stock'}
                                            </span>
                                            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'recent':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold text-white-800">Recently Viewed Plants</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {mockRecentViews.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-40 object-cover rounded-lg mb-4"
                                    />
                                    <h4 className="font-bold text-gray-800 mb-1">{item.name}</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-green-600">${item.price}</span>
                                        <span className="text-sm text-gray-500">{item.viewedAt}</span>
                                    </div>
                                    <button className="w-full mt-4 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                                        View Again
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'reviews':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold text-white-800">My Reviews & Ratings</h3>

                        <div className="space-y-4">
                            {mockReviews.map((review) => (
                                <div key={review.id} className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-lg">{review.plant}</h4>
                                            <div className="flex items-center mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FiStar
                                                        key={i}
                                                        className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500">{review.date}</span>
                                    </div>
                                    <p className="text-gray-600 mb-4">{review.comment}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            {review.helpful} people found this helpful
                                        </span>
                                        <div className="flex space-x-2">
                                            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                                                Edit
                                            </button>
                                            <button className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'payments':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white-800">Payment History</h3>
                            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <FiDownload className="w-4 h-4 mr-2" />
                                Export History
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mockPayments.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                    {payment.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {new Date(payment.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {payment.items} item{payment.items > 1 ? 's' : ''}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                                                    ${payment.amount.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {payment.method}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button className="text-green-600 hover:text-green-800 font-medium text-sm">
                                                        View Invoice
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'notifications':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white-800">Notifications</h3>
                            <button
                                onClick={handleMarkAllAsRead}
                                className="px-4 py-2 text-green-600 hover:text-green-800 font-medium"
                            >
                                Mark all as read
                            </button>
                        </div>

                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${notification.read ? 'border-gray-300' : 'border-green-500'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800">{notification.title}</h4>
                                            <p className="text-gray-600 mt-1">{notification.message}</p>
                                            <span className="text-sm text-gray-500 mt-2 block">{notification.time}</span>
                                        </div>
                                        {!notification.read && (
                                            <button
                                                onClick={() => handleMarkNotificationAsRead(notification.id)}
                                                className="ml-4 px-3 py-1 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'security':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold text-white-800">Security Settings</h3>

                        {/* Change Password */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h4 className="font-bold text-gray-800 text-lg mb-4">Change Password</h4>
                            <div className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                    Update Password
                                </button>
                            </div>
                        </div>

                        {/* Account Actions */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h4 className="font-bold text-gray-800 text-lg mb-4">Account Actions</h4>
                            <div className="space-y-4">
                                <button className="w-full text-left p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="font-medium text-gray-800">Download My Data</div>
                                    <p className="text-sm text-gray-600 mt-1">Get a copy of all your personal data</p>
                                </button>
                                <button className="w-full text-left p-4 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                                    <div className="font-medium">Delete My Account</div>
                                    <p className="text-sm mt-1">Permanently delete your account and all data</p>
                                </button>
                            </div>
                        </div>

                        {/* Logout */}
                        <div className="text-center">
                            <button
                                onClick={handleLogout}
                                className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                            >
                                Logout from All Devices
                            </button>
                        </div>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}>

            {/* Header */}
            {/* <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                                <FiUser className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
                                <p className="text-sm text-gray-600">Welcome back, {userData?.name}!</p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center px-4 py-2 text-gray-700 hover:text-green-600"
                        >
                            <FiHome className="w-5 h-5 mr-2" />
                            Back to Home
                        </button>
                    </div>
                </div>
            </header> */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8 mt-15">
                    {/* Sidebar Navigation */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-xl shadow-sm p-4 sticky top-8">
                            <nav className="space-y-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as TabType)}
                                            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                                                ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5 mr-3" />
                                            {tab.label}
                                            {tab.id === 'notifications' && notifications.filter(n => !n.read).length > 0 && (
                                                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                                                    {notifications.filter(n => !n.read).length}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>

                            {/* Quick Stats */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <h4 className="font-medium text-gray-700 mb-3">Quick Stats</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Total Orders</span>
                                        <span className="font-medium text-gray-700">{mockOrders.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Wishlist Items</span>
                                        <span className="font-medium text-gray-700">{mockWishlist.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Unread Notifications</span>
                                        <span className="font-medium text-gray-700">{notifications.filter(n => !n.read).length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        <AnimatePresence mode="wait">
                            {renderTabContent()}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {showOrderModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
                                <button
                                    onClick={() => setShowOrderModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Order ID</p>
                                        <p className="font-medium">{selectedOrder.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-medium">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <div className="mt-1">{renderStatusBadge(selectedOrder.status)}</div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Amount</p>
                                        <p className="font-bold text-lg">${selectedOrder.total.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-800 mb-3">Ordered Plants</h4>
                                    <div className="space-y-3">
                                        {selectedOrder.plants.map((plant: string, index: number) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="font-medium">{plant}</span>
                                                <span className="text-green-600">${(selectedOrder.total / selectedOrder.items).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-200">
                                    <h4 className="font-medium text-gray-800 mb-4">Shipping Information</h4>
                                    <p className="text-gray-600">{mockAddresses[0].address}</p>
                                    <p className="text-gray-600">{mockAddresses[0].city}, {mockAddresses[0].state} {mockAddresses[0].zip}</p>
                                    <p className="text-gray-600 mt-2">Phone: {mockAddresses[0].phone}</p>
                                </div>

                                <div className="pt-6 border-t border-gray-200 flex justify-end space-x-4">
                                    <button
                                        onClick={() => setShowOrderModal(false)}
                                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Close
                                    </button>
                                    <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                        Download Invoice
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;