'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUser, FiUsers, FiPackage, FiShoppingBag, FiDollarSign,
    FiBarChart2, FiSettings, FiLock, FiShield, FiDatabase,
    FiTrendingUp, FiTrendingDown, FiCheckCircle, FiXCircle,
    FiEdit, FiTrash2, FiEye, FiDownload, FiFilter,
    FiCalendar, FiHome, FiActivity, FiClipboard,
    FiHeart,
    FiStar
} from 'react-icons/fi';
import { MdBusiness, MdStore, MdLocalFlorist, MdLocationOn } from 'react-icons/md';

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

const mockMetrics = {
    totalUsers: 12542,
    totalOrders: 8945,
    totalRevenue: 1256890.50,
    totalCommission: 94266.79,
    activeNurseries: 178,
    totalPlants: 14523,
    pendingOrders: 124,
    todayRevenue: 12545.75
};

const mockCommissionData = [
    { date: "2024-03-20", amount: 4523.50 },
    { date: "2024-03-19", amount: 4120.25 },
    { date: "2024-03-18", amount: 3987.60 },
    { date: "2024-03-17", amount: 5123.40 },
    { date: "2024-03-16", amount: 4875.90 }
];

const mockNurseries = [
    {
        id: 1,
        name: "Urban Jungle Nursery",
        owner: "Alex Morgan",
        email: "alex@urbanjungle.com",
        plants: 245,
        orders: 1245,
        revenue: 152345.50,
        status: "active",
        commissionRate: 7.5,
        joinedDate: "2023-01-15"
    },
    {
        id: 2,
        name: "Green Haven Farms",
        owner: "Sarah Chen",
        email: "sarah@greenhaven.com",
        plants: 189,
        orders: 987,
        revenue: 98765.25,
        status: "active",
        commissionRate: 7.5,
        joinedDate: "2023-03-22"
    },
    {
        id: 3,
        name: "Eco Plant Co",
        owner: "David Park",
        email: "david@ecoplant.com",
        plants: 156,
        orders: 654,
        revenue: 76543.80,
        status: "suspended",
        commissionRate: 7.5,
        joinedDate: "2023-05-10"
    }
];

const mockAllUsers = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "user",
        orders: 12,
        joinDate: "2023-02-15",
        status: "active"
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        role: "nursery_admin",
        nursery: "Urban Jungle Nursery",
        joinDate: "2023-03-10",
        status: "active"
    },
    {
        id: 3,
        name: "Robert Brown",
        email: "robert@example.com",
        role: "user",
        orders: 3,
        joinDate: "2023-04-22",
        status: "inactive"
    }
];

const mockAllOrders = [
    {
        id: "ORD-78945",
        user: "John Doe",
        nursery: "Urban Jungle Nursery",
        amount: 149.99,
        status: "delivered",
        commission: 11.25,
        date: "2024-03-20"
    },
    {
        id: "ORD-78946",
        user: "Jane Smith",
        nursery: "Green Haven Farms",
        amount: 89.99,
        status: "shipped",
        commission: 6.75,
        date: "2024-03-19"
    },
    {
        id: "ORD-78947",
        user: "Robert Brown",
        nursery: "Eco Plant Co",
        amount: 199.99,
        status: "processing",
        commission: 15.00,
        date: "2024-03-18"
    }
];

const mockAllPlants = [
    {
        id: 1,
        name: "Monstera Deliciosa",
        nursery: "Urban Jungle Nursery",
        category: "Indoor",
        price: 59.99,
        stock: 45,
        status: "active",
        createdAt: "2024-01-15"
    },
    {
        id: 2,
        name: "Fiddle Leaf Fig",
        nursery: "Green Haven Farms",
        category: "Indoor",
        price: 89.99,
        stock: 28,
        status: "active",
        createdAt: "2024-02-10"
    },
    {
        id: 3,
        name: "Snake Plant",
        nursery: "Eco Plant Co",
        category: "Indoor",
        price: 39.99,
        stock: 0,
        status: "out_of_stock",
        createdAt: "2024-01-28"
    }
];

const mockSystemLogs = [
    {
        id: 1,
        action: "Commission Rate Updated",
        user: "Admin Green",
        details: "Changed global commission rate from 7% to 7.5%",
        timestamp: "2024-03-20 14:30:00",
        ip: "192.168.1.1"
    },
    {
        id: 2,
        action: "Nursery Suspended",
        user: "Admin Green",
        details: "Suspended Eco Plant Co for policy violation",
        timestamp: "2024-03-19 11:15:00",
        ip: "192.168.1.1"
    },
    {
        id: 3,
        action: "User Role Updated",
        user: "Admin Green",
        details: "Promoted Jane Smith to nursery_admin",
        timestamp: "2024-03-18 16:45:00",
        ip: "192.168.1.1"
    }
];

type TabType = 'profile' | 'overview' | 'users' | 'nurseries' | 'plants' | 'orders' | 'commission' | 'reports' | 'logs' | 'settings';

const SuperAdminDashboard = () => {
    const router = useRouter();
    const [userData, setUserData] = useState<UserDetails | null>(null);

    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [commissionRate, setCommissionRate] = useState(7.5);
    const [selectedDateRange, setSelectedDateRange] = useState('7days');
    const [showNurseryModal, setShowNurseryModal] = useState(false);
    const [showCommissionModal, setShowCommissionModal] = useState(false);
    const [editingNursery, setEditingNursery] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);



    const tabs = [
        { id: 'profile', label: 'profile', icon: FiUser },
        { id: 'overview', label: 'Overview', icon: FiBarChart2 },
        { id: 'users', label: 'Users', icon: FiUsers },
        { id: 'nurseries', label: 'Nurseries', icon: MdBusiness },
        { id: 'plants', label: 'All Plants', icon: MdLocalFlorist },
        { id: 'orders', label: 'All Orders', icon: FiShoppingBag },
        { id: 'commission', label: 'Commission', icon: FiDollarSign },
        { id: 'reports', label: 'Reports', icon: FiClipboard },
        { id: 'logs', label: 'System Logs', icon: FiActivity },
        { id: 'settings', label: 'Settings', icon: FiSettings }
    ];

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_email');
        localStorage.removeItem('greenmet-auth');
        router.push('/');
    };

    const handleChangeUserRole = (userId: number, newRole: string) => {
        console.log(`Changing user ${userId} role to ${newRole}`);
        // API call here
    };

    const handleToggleStatus = (type: 'user' | 'nursery', id: number) => {
        console.log(`Toggling ${type} ${id} status`);
        // API call here
    };

    const handleUpdateCommissionRate = () => {
        console.log(`Updating commission rate to ${commissionRate}%`);
        setShowCommissionModal(false);
    };

    const handleExportReport = (type: string) => {
        console.log(`Exporting ${type} report`);
        // Export logic here
    };

    const renderStatusBadge = (status: string) => {
        const config = {
            active: { color: 'bg-green-100 text-green-800', icon: FiCheckCircle },
            suspended: { color: 'bg-red-100 text-red-800', icon: FiXCircle },
            inactive: { color: 'bg-gray-100 text-gray-800', icon: FiXCircle },
            processing: { color: 'bg-yellow-100 text-yellow-800', icon: FiActivity },
            shipped: { color: 'bg-blue-100 text-blue-800', icon: FiPackage },
            delivered: { color: 'bg-green-100 text-green-800', icon: FiCheckCircle },
            out_of_stock: { color: 'bg-red-100 text-red-800', icon: FiXCircle }
        };

        const statusConfig = config[status as keyof typeof config] || config.active;
        const Icon = statusConfig.icon;

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                <Icon className="w-3 h-3 mr-1" />
                {status.replace('_', ' ').toUpperCase()}
            </span>
        );
    };

    useEffect(() => {

        const fetchUserData = () => {
            try {
                const userDataLocal = localStorage.getItem('userData')
                const userDataSession = sessionStorage.getItem('userData')

                if (userDataLocal) {
                    const parsedData = JSON.parse(userDataLocal);
                    console.log("User data from localStorage:", parsedData);
                    setUserData(parsedData);
                } else if (userDataSession) {
                    const parsedData = JSON.parse(userDataSession);
                    console.log("User data from sessionStorage:", parsedData);
                    setUserData(parsedData);
                } else {
                    console.log("No user data found in storage");
                    // Redirect to login if no user data
                    // router.push('/login');
                }

            } catch (error) {
                console.error("Error parsing user data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchUserData();
    }, [router])

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
                            </div>

                            {
                                loading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                                        <p className="mt-4 text-gray-600">Loading user data...</p>
                                    </div>
                                ) : userData ? (
                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                        {/* Profile Photo */}
                                        <div className="relative">
                                            <img
                                                src={userData?.avatarUrl}
                                                alt={userData?.name}
                                                className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                                            />
                                            {isEditing && (
                                                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                                                    <FiEdit className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Profile Details */}
                                        <div className="flex-1">
                                            {isEditing ? (
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                        <input
                                                            type="text"
                                                            value={userData?.name}
                                                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                        <input
                                                            type="email"
                                                            value={userData?.email}
                                                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
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
                                                        <h4 className="text-2xl font-bold text-white-800">{userData?.name}</h4>
                                                        <p className="text-white-600">{userData?.email}</p>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="flex items-center">
                                                            <MdLocationOn className="w-5 h-5 text-white-400 mr-3" />
                                                            <span className="text-white-700">{userData?.location}</span>
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
                    </motion.div>
                );

            case 'overview':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Users', value: mockMetrics.totalUsers.toLocaleString(), icon: FiUsers, color: 'bg-blue-500', change: '+12.5%' },
                                { label: 'Total Orders', value: mockMetrics.totalOrders.toLocaleString(), icon: FiShoppingBag, color: 'bg-green-500', change: '+8.3%' },
                                { label: 'Total Revenue', value: `$${mockMetrics.totalRevenue.toLocaleString()}`, icon: FiTrendingUp, color: 'bg-purple-500', change: '+15.2%' },
                                { label: 'Commission', value: `$${mockMetrics.totalCommission.toLocaleString()}`, icon: FiDollarSign, color: 'bg-yellow-500', change: '+9.8%' }
                            ].map((metric, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-lg ${metric.color} flex items-center justify-center`}>
                                            <metric.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-green-600">{metric.change}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</h3>
                                    <p className="text-sm text-gray-600">{metric.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Commission Chart */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Commission Collection</h3>
                                <select
                                    value={selectedDateRange}
                                    onChange={(e) => setSelectedDateRange(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                    <option value="7days">Last 7 Days</option>
                                    <option value="30days">Last 30 Days</option>
                                    <option value="90days">Last 90 Days</option>
                                </select>
                            </div>
                            <div className="h-64 flex items-end space-x-2">
                                {mockCommissionData.map((item, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div
                                            className="w-12 bg-gradient-to-t from-green-400 to-emerald-600 rounded-t-lg"
                                            style={{ height: `${(item.amount / 6000) * 100}%` }}
                                        />
                                        <span className="mt-2 text-xs text-gray-600">${item.amount.toLocaleString()}</span>
                                        <span className="mt-1 text-xs text-gray-500">
                                            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h4 className="font-bold text-gray-800 mb-4">Quick Actions</h4>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setShowCommissionModal(true)}
                                        className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                                    >
                                        <span>Update Commission Rate</span>
                                        <FiEdit className="w-4 h-4 text-gray-400" />
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('users')}
                                        className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                                    >
                                        <span>Manage Users</span>
                                        <FiUsers className="w-4 h-4 text-gray-400" />
                                    </button>
                                    <button
                                        onClick={() => setShowNurseryModal(true)}
                                        className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                                    >
                                        <span>Add New Nursery</span>
                                        <MdBusiness className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
                                <h4 className="font-bold text-gray-800 mb-4">Recent Activity</h4>
                                <div className="space-y-4">
                                    {mockSystemLogs.slice(0, 3).map((log) => (
                                        <div key={log.id} className="flex items-start space-x-3 p-3 border border-gray-100 rounded-lg">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <FiActivity className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="font-medium text-gray-800">{log.action}</h5>
                                                    <span className="text-xs text-gray-500">{log.timestamp}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                                                <div className="flex items-center mt-2 text-xs text-gray-500">
                                                    <span className="mr-4">By: {log.user}</span>
                                                    <span>IP: {log.ip}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'users':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-800">User Management</h3>
                            <div className="flex space-x-3">
                                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                                    <FiFilter className="w-4 h-4 mr-2" />
                                    Filter
                                </button>
                                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center">
                                    <FiUser className="w-4 h-4 mr-2" />
                                    Add User
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mockAllUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <FiUser className="w-5 h-5 text-gray-500" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="font-medium text-gray-900">{user.name}</div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                        {user.role.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                    {user.role === 'nursery_admin' && (
                                                        <div className="text-xs text-gray-500 mt-1">{user.nursery}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {renderStatusBadge(user.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {new Date(user.joinDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleChangeUserRole(user.id, 'nursery_admin')}
                                                            className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                                                        >
                                                            Promote
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleStatus('user', user.id)}
                                                            className={`px-3 py-1 text-xs rounded ${user.status === 'active' ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                                                        >
                                                            {user.status === 'active' ? 'Disable' : 'Enable'}
                                                        </button>
                                                        <button className="p-1 text-gray-400 hover:text-red-600">
                                                            <FiTrash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'nurseries':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-800">Nursery Management</h3>
                            <button
                                onClick={() => setShowNurseryModal(true)}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                            >
                                <MdBusiness className="w-4 h-4 mr-2" />
                                Add Nursery
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mockNurseries.map((nursery) => (
                                <div key={nursery.id} className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-lg">{nursery.name}</h4>
                                            <p className="text-sm text-gray-600">{nursery.owner}</p>
                                        </div>
                                        {renderStatusBadge(nursery.status)}
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Plants:</span>
                                            <span className="font-medium">{nursery.plants}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Orders:</span>
                                            <span className="font-medium">{nursery.orders}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Revenue:</span>
                                            <span className="font-medium">${nursery.revenue.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Commission:</span>
                                            <span className="font-medium">{nursery.commissionRate}%</span>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setEditingNursery(nursery);
                                                setShowNurseryModal(true);
                                            }}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                                        >
                                            <FiEdit className="w-4 h-4 mr-2" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleToggleStatus('nursery', nursery.id)}
                                            className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center ${nursery.status === 'active'
                                                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                                                }`}
                                        >
                                            {nursery.status === 'active' ? 'Suspend' : 'Activate'}
                                        </button>
                                        <button className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'plants':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-800">Global Plant Inventory</h3>
                            <div className="flex space-x-3">
                                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                                    <FiFilter className="w-4 h-4 mr-2" />
                                    Filter
                                </button>
                                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center">
                                    <MdLocalFlorist className="w-4 h-4 mr-2" />
                                    Add Plant
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plant</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nursery</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mockAllPlants.map((plant) => (
                                            <tr key={plant.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">{plant.name}</div>
                                                    <div className="text-sm text-gray-500">{plant.category}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {plant.nursery}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                    ${plant.price}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${plant.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {plant.stock} units
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {renderStatusBadge(plant.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex space-x-2">
                                                        <button className="p-1 text-gray-400 hover:text-blue-600">
                                                            <FiEdit className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-1 text-gray-400 hover:text-red-600">
                                                            <FiTrash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
                            <h3 className="text-xl font-bold text-gray-800">All Orders</h3>
                            <div className="flex space-x-3">
                                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                                    <FiCalendar className="w-4 h-4 mr-2" />
                                    Date Range
                                </button>
                                <button
                                    onClick={() => handleExportReport('orders')}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                                >
                                    <FiDownload className="w-4 h-4 mr-2" />
                                    Export
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nursery</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mockAllOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                    {order.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {order.user}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {order.nursery}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                                                    ${order.amount}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">
                                                    ${order.commission}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {renderStatusBadge(order.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex space-x-2">
                                                        <button className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                                                            Update Status
                                                        </button>
                                                        <button className="px-3 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100">
                                                            Refund
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'commission':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Current Commission Rate */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Global Commission Rate</h3>
                                    <p className="text-gray-600">Current commission rate applied to all orders</p>
                                </div>
                                <button
                                    onClick={() => setShowCommissionModal(true)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                                >
                                    <FiEdit className="w-4 h-4 mr-2" />
                                    Update Rate
                                </button>
                            </div>
                            <div className="text-center">
                                <div className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 px-8 py-6 rounded-2xl">
                                    <div className="text-5xl font-bold text-gray-800 mb-2">{commissionRate}%</div>
                                    <p className="text-gray-600">Current Commission Rate</p>
                                </div>
                            </div>
                        </div>

                        {/* Commission History */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Commission History</h3>
                            <div className="space-y-4">
                                {mockCommissionData.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-800">{new Date(item.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                                            <p className="text-sm text-gray-600">Total commission collected</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-green-600">${item.amount.toFixed(2)}</div>
                                            <button className="text-sm text-blue-600 hover:text-blue-800 mt-1">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );

            case 'reports':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold text-gray-800">Reports & Analytics</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { title: 'Sales Report', desc: 'Detailed sales breakdown by date, nursery, and category', icon: FiTrendingUp },
                                { title: 'Commission Report', desc: 'Commission collection and distribution reports', icon: FiDollarSign },
                                { title: 'User Analytics', desc: 'User growth, activity, and behavior analytics', icon: FiUsers },
                                { title: 'Nursery Performance', desc: 'Nursery-wise sales and performance metrics', icon: MdBusiness },
                                { title: 'Inventory Report', desc: 'Stock levels, turnover rates, and demand analysis', icon: FiPackage },
                                { title: 'Revenue Summary', desc: 'Monthly/quarterly revenue and growth reports', icon: FiBarChart2 }
                            ].map((report, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                                        <report.icon className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h4 className="font-bold text-gray-800 mb-2">{report.title}</h4>
                                    <p className="text-sm text-gray-600 mb-4">{report.desc}</p>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleExportReport(report.title.toLowerCase())}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                                        >
                                            <FiDownload className="w-4 h-4 mr-2" />
                                            CSV
                                        </button>
                                        <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center">
                                            <FiDownload className="w-4 h-4 mr-2" />
                                            PDF
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'logs':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-800">System Logs</h3>
                            <button
                                onClick={() => handleExportReport('logs')}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                            >
                                <FiDownload className="w-4 h-4 mr-2" />
                                Export Logs
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mockSystemLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {log.timestamp}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {log.user}
                                                </td>
                                                <td className="px-6 py-4 text-gray-700">
                                                    {log.details}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{log.ip}</code>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'settings':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold text-gray-800">System Settings</h3>

                        {/* General Settings */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h4 className="font-bold text-gray-800 text-lg mb-4">General Settings</h4>
                            <div className="space-y-4 max-w-md">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">Site Maintenance Mode</p>
                                        <p className="text-sm text-gray-600">Put the entire site under maintenance</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">New User Registration</p>
                                        <p className="text-sm text-gray-600">Allow new users to register</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">Email Notifications</p>
                                        <p className="text-sm text-gray-600">Send email notifications for system events</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Security Settings */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h4 className="font-bold text-gray-800 text-lg mb-4">Security Settings</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                                    <input
                                        type="number"
                                        defaultValue="30"
                                        className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Failed Login Attempts Before Lockout</label>
                                    <input
                                        type="number"
                                        defaultValue="5"
                                        className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                    Save Security Settings
                                </button>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
                            <h4 className="font-bold text-red-700 text-lg mb-4">Danger Zone</h4>
                            <div className="space-y-4">
                                <button className="w-full text-left p-4 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                                    <div className="font-medium">Clear All System Logs</div>
                                    <p className="text-sm mt-1">Permanently delete all system activity logs</p>
                                </button>
                                <button className="w-full text-left p-4 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                                    <div className="font-medium">Reset All Settings to Default</div>
                                    <p className="text-sm mt-1">Reset all system settings to factory defaults</p>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-scree "
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
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center">
                                <FiShield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Super Admin Dashboard</h1>
                                <p className="text-sm text-gray-600">Welcome back, {userData?.name}!</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="flex items-center px-4 py-2 text-gray-700 hover:text-green-600"
                            >
                                <FiHome className="w-5 h-5 mr-2" />
                                User Dashboard
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header> */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8 mt-15">
                    {/* Sidebar Navigation */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-xl shadow-sm p-4 sticky top-8">
                            {/* Admin Profile */}
                            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                                <img
                                    src={userData?.avatarUrl}
                                    alt={userData?.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                                />
                                <div>
                                    <h3 className="font-bold text-gray-800">{userData?.name}</h3>
                                    <p className="text-sm text-gray-600">{userData?.role}</p>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as TabType)}
                                            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                                                ? 'bg-red-50 text-red-700 border-l-4 border-red-500'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5 mr-3" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>

                            {/* System Status */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <h4 className="font-medium text-gray-700 mb-3">System Status</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Server Uptime</span>
                                        <span className="font-medium text-green-600">99.8%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Active Sessions</span>
                                        <span className="font-medium">1,245</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Last Login</span>
                                        <span className="font-medium text-xs">Today 14:30</span>
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

            {/* Commission Rate Modal */}
            {showCommissionModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white rounded-2xl max-w-md w-full"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Update Commission Rate</h3>
                                <button
                                    onClick={() => setShowCommissionModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Commission Rate (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="50"
                                        value={commissionRate}
                                        onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-bold focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                        Enter a percentage value (e.g., 7.5 for 7.5%)
                                    </p>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <FiShield className="w-5 h-5 text-yellow-600" />
                                        </div>
                                        <div className="ml-3">
                                            <h4 className="text-sm font-medium text-yellow-800">Important Notice</h4>
                                            <p className="text-sm text-yellow-700 mt-1">
                                                This change will affect all future orders. Existing orders will retain their original commission rates.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => setShowCommissionModal(false)}
                                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdateCommissionRate}
                                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                        Update Commission Rate
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Nursery Management Modal */}
            {showNurseryModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800">
                                    {editingNursery ? 'Edit Nursery' : 'Add New Nursery'}
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowNurseryModal(false);
                                        setEditingNursery(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nursery Name</label>
                                        <input
                                            type="text"
                                            defaultValue={editingNursery?.name || ''}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                                        <input
                                            type="text"
                                            defaultValue={editingNursery?.owner || ''}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            defaultValue={editingNursery?.email || ''}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            defaultValue={editingNursery?.commissionRate || commissionRate}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Full address of the nursery..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Brief description about the nursery..."
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                    <div className="flex items-center">
                                        <input
                                            id="active-status"
                                            type="checkbox"
                                            defaultChecked={!editingNursery || editingNursery.status === 'active'}
                                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                        />
                                        <label htmlFor="active-status" className="ml-2 text-sm text-gray-700">
                                            Set as Active
                                        </label>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => {
                                                setShowNurseryModal(false);
                                                setEditingNursery(null);
                                            }}
                                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                            {editingNursery ? 'Update Nursery' : 'Create Nursery'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;