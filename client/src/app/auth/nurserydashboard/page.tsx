'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUser, FiPackage, FiShoppingBag, FiBarChart2, FiSettings,
    FiBell, FiDollarSign, FiTrendingUp, FiTrendingDown, FiAlertCircle,
    FiPlus, FiEdit, FiTrash2, FiEye, FiDownload, FiFilter,
    FiCheckCircle, FiXCircle, FiClock, FiTruck, FiMapPin,
    FiPrinter, FiRefreshCw, FiHeart, FiStar
} from 'react-icons/fi';
import { MdStore, MdLocalFlorist, MdInventory } from 'react-icons/md';

// Mock data for demonstration
interface MockNurseryAdmin {
    name: string;
    email: string;
    role: string;
    nursery: string;
    avaterUrl: string;
    location: string;
    phone: string;
    joinDate: string;
};

const mockNursery = {
    id: 1,
    name: "Urban Jungle Nursery",
    description: "Premium indoor plants for modern living spaces",
    address: "123 Green Street, New York, NY 10001",
    contact: "contact@urbanjungle.com",
    phone: "+1 (555) 123-4567",
    established: "2020",
    rating: 4.8,
    totalReviews: 245,
    commissionRate: 7.5,
    status: "active"
};

const mockDashboardMetrics = {
    totalOrders: 1245,
    totalSales: 152345.50,
    netRevenue: 140845.71,
    commissionPaid: 11499.79,
    todayOrders: 12,
    todaySales: 1545.75,
    pendingOrders: 24,
    lowStockItems: 8
};

const mockRecentOrders = [
    {
        id: "ORD-78945",
        customer: "John Doe",
        items: 3,
        amount: 149.99,
        status: "processing",
        statusText: "Processing",
        date: "2024-03-20 14:30",
        plants: ["Monstera Deliciosa", "Snake Plant", "Peace Lily"]
    },
    {
        id: "ORD-78946",
        customer: "Jane Smith",
        items: 1,
        amount: 89.99,
        status: "shipped",
        statusText: "Shipped",
        date: "2024-03-20 11:15",
        plants: ["Fiddle Leaf Fig"]
    },
    {
        id: "ORD-78947",
        customer: "Robert Brown",
        items: 2,
        amount: 129.99,
        status: "delivered",
        statusText: "Delivered",
        date: "2024-03-19 16:45",
        plants: ["Rubber Plant", "ZZ Plant"]
    }
];

const mockLowStockPlants = [
    {
        id: 1,
        name: "Monstera Deliciosa",
        currentStock: 5,
        minStock: 10,
        lastOrder: "2024-03-15",
        category: "Indoor",
        price: 59.99
    },
    {
        id: 2,
        name: "Fiddle Leaf Fig",
        currentStock: 3,
        minStock: 8,
        lastOrder: "2024-03-18",
        category: "Indoor",
        price: 89.99
    },
    {
        id: 3,
        name: "Snake Plant",
        currentStock: 7,
        minStock: 15,
        lastOrder: "2024-03-19",
        category: "Indoor",
        price: 39.99
    }
];

const mockPlants = [
    {
        id: 1,
        name: "Monstera Deliciosa",
        category: "Indoor",
        price: 59.99,
        stock: 45,
        sold: 245,
        status: "active",
        rating: 4.8,
        createdAt: "2023-02-15",
        image: "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=400&h=400&fit=crop"
    },
    {
        id: 2,
        name: "Fiddle Leaf Fig",
        category: "Indoor",
        price: 89.99,
        stock: 28,
        sold: 189,
        status: "active",
        rating: 4.6,
        createdAt: "2023-03-10",
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop"
    },
    {
        id: 3,
        name: "Snake Plant",
        category: "Indoor",
        price: 39.99,
        stock: 67,
        sold: 321,
        status: "active",
        rating: 4.7,
        createdAt: "2023-01-28",
        image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=400&fit=crop"
    }
];

const mockSalesData = [
    { day: "Mon", sales: 1450, orders: 18 },
    { day: "Tue", sales: 1890, orders: 22 },
    { day: "Wed", sales: 1560, orders: 19 },
    { day: "Thu", sales: 2345, orders: 28 },
    { day: "Fri", sales: 2870, orders: 32 },
    { day: "Sat", sales: 3120, orders: 35 },
    { day: "Sun", sales: 1890, orders: 21 }
];

const mockBestSellers = [
    { name: "Monstera Deliciosa", sales: 245, revenue: 14697.55 },
    { name: "Snake Plant", sales: 189, revenue: 7558.11 },
    { name: "Fiddle Leaf Fig", sales: 156, revenue: 14038.44 },
    { name: "Peace Lily", sales: 132, revenue: 5543.88 },
    { name: "ZZ Plant", sales: 98, revenue: 4898.02 }
];

const mockPayouts = [
    { date: "2024-03-15", amount: 12545.75, commission: 941.18, net: 11604.57, status: "paid" },
    { date: "2024-03-01", amount: 11489.50, commission: 861.71, net: 10627.79, status: "paid" },
    { date: "2024-02-15", amount: 13245.25, commission: 993.39, net: 12251.86, status: "pending" }
];

const mockNotifications = [
    {
        id: 1,
        title: "New Order Received",
        message: "Order #ORD-78948 for $89.99 from Sarah Johnson",
        time: "10 minutes ago",
        read: false,
        type: "order"
    },
    {
        id: 2,
        title: "Low Stock Alert",
        message: "Monstera Deliciosa stock is below minimum (5 left)",
        time: "2 hours ago",
        read: false,
        type: "stock"
    },
    {
        id: 3,
        title: "Order Shipped",
        message: "Order #ORD-78946 has been shipped successfully",
        time: "1 day ago",
        read: true,
        type: "order"
    }
];

type TabType = 'dashboard' | 'plants' | 'orders' | 'inventory' | 'analytics' | 'profile' | 'payouts' | 'notifications';

const NurseryAdminDashboard = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [showPlantModal, setShowPlantModal] = useState(false);
    const [editingPlant, setEditingPlant] = useState<any>(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [notifications, setNotifications] = useState(mockNotifications);
    const [adminData, setAdminData] = useState<MockNurseryAdmin | null>(null);
    const [nurseryData, setNurseryData] = useState(mockNursery);
    const [loading, setLoading] = useState(true);

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: FiBarChart2 },
        { id: 'plants', label: 'Plants', icon: MdLocalFlorist },
        { id: 'orders', label: 'Orders', icon: FiShoppingBag },
        { id: 'inventory', label: 'Inventory', icon: MdInventory },
        { id: 'analytics', label: 'Analytics', icon: FiTrendingUp },
        { id: 'profile', label: 'Profile', icon: FiUser },
        { id: 'settings', label: 'Settings', icon: FiSettings },
        { id: 'payouts', label: 'Payouts', icon: FiDollarSign },
        { id: 'notifications', label: 'Notifications', icon: FiBell },
    ];

    useEffect(() => {

        const fetchUserData = () => {
            try {
                const userDataLocal = localStorage.getItem('userData')
                const userDataSession = sessionStorage.getItem('userData')

                if (userDataLocal) {
                    const parsedData = JSON.parse(userDataLocal);
                    console.log("User data from localStorage:", parsedData);
                    setAdminData(parsedData);
                } else if (userDataSession) {
                    const parsedData = JSON.parse(userDataSession);
                    console.log("User data from sessionStorage:", parsedData);
                    setAdminData(parsedData);
                } else {
                    console.log("No user data found in storage");
                    // Redirect to login if no user data
                    router.push('/login');
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchUserData();
    },[router])

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_email');
        localStorage.removeItem('greenmet-auth');
        router.push('/');
    };

    const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
        console.log(`Updating order ${orderId} status to ${newStatus}`);
        // API call here
    };

    const handleUpdateStock = (plantId: number, newStock: number) => {
        console.log(`Updating plant ${plantId} stock to ${newStock}`);
        // API call here
    };

    const handleMarkNotificationAsRead = (id: number) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    };

    const handleExportReport = (type: string) => {
        console.log(`Exporting ${type} report`);
        // Export logic here
    };

    const renderStatusBadge = (status: string) => {
        const config = {
            processing: { color: 'bg-yellow-100 text-yellow-800', icon: FiClock },
            shipped: { color: 'bg-blue-100 text-blue-800', icon: FiTruck },
            delivered: { color: 'bg-green-100 text-green-800', icon: FiCheckCircle },
            cancelled: { color: 'bg-red-100 text-red-800', icon: FiXCircle },
            active: { color: 'bg-green-100 text-green-800', icon: FiCheckCircle },
            inactive: { color: 'bg-gray-100 text-gray-800', icon: FiXCircle },
            paid: { color: 'bg-green-100 text-green-800', icon: FiCheckCircle },
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: FiClock }
        };

        const statusConfig = config[status as keyof typeof config] || config.active;
        const Icon = statusConfig.icon;

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                <Icon className="w-3 h-3 mr-1" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Welcome Header */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">Welcome back, {adminData?.name}!</h2>
                                    <p className="opacity-90 mt-1">Manage your nursery efficiently with real-time insights</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm opacity-80">Today&apos;s Date</p>
                                    <p className="text-lg font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Orders', value: mockDashboardMetrics.totalOrders.toLocaleString(), icon: FiShoppingBag, color: 'bg-blue-500', change: '+12.5%' },
                                { label: 'Total Sales', value: `$${mockDashboardMetrics.totalSales.toLocaleString()}`, icon: FiDollarSign, color: 'bg-green-500', change: '+8.3%' },
                                { label: 'Net Revenue', value: `$${mockDashboardMetrics.netRevenue.toLocaleString()}`, icon: FiTrendingUp, color: 'bg-purple-500', change: '+7.8%' },
                                { label: 'Pending Orders', value: mockDashboardMetrics.pendingOrders.toString(), icon: FiClock, color: 'bg-yellow-500', change: '-2.1%' }
                            ].map((metric, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-lg ${metric.color} flex items-center justify-center`}>
                                            <metric.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className={`text-sm font-medium ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                            {metric.change}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</h3>
                                    <p className="text-sm text-gray-600">{metric.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Orders */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
                                    <button
                                        onClick={() => setActiveTab('orders')}
                                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                                    >
                                        View All →
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {mockRecentOrders.map((order) => (
                                        <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                                            <div>
                                                <div className="flex items-center space-x-3">
                                                    <h4 className="font-medium text-gray-800">{order.id}</h4>
                                                    {renderStatusBadge(order.status)}
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{order.customer} • {order.items} item{order.items > 1 ? 's' : ''}</p>
                                                <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-800">${order.amount}</p>
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowOrderModal(true);
                                                    }}
                                                    className="text-sm text-green-600 hover:text-green-800 mt-1"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Low Stock Alerts */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">Low Stock Alerts</h3>
                                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                        {mockLowStockPlants.length} Items
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {mockLowStockPlants.map((plant) => (
                                        <div key={plant.id} className="flex items-center justify-between p-4 border border-red-100 rounded-lg bg-red-50/50">
                                            <div>
                                                <h4 className="font-medium text-gray-800">{plant.name}</h4>
                                                <div className="flex items-center mt-2 space-x-4">
                                                    <span className={`text-sm px-2 py-1 rounded-full ${plant.currentStock < 5 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {plant.currentStock} in stock
                                                    </span>
                                                    <span className="text-sm text-gray-600">Min: {plant.minStock}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleUpdateStock(plant.id, plant.minStock + 10)}
                                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                                            >
                                                Restock
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-gray-700">Commission Rate</h4>
                                    <FiDollarSign className="w-5 h-5 text-green-500" />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">{mockNursery.commissionRate}%</p>
                                <p className="text-sm text-gray-500 mt-2">Platform commission on sales</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-gray-700">Today&apos;s Sales</h4>
                                    <FiTrendingUp className="w-5 h-5 text-green-500" />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">${mockDashboardMetrics.todaySales.toLocaleString()}</p>
                                <p className="text-sm text-gray-500 mt-2">From {mockDashboardMetrics.todayOrders} orders</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-gray-700">Nursery Rating</h4>
                                    <FiStar className="w-5 h-5 text-yellow-500" />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">{mockNursery.rating}/5</p>
                                <p className="text-sm text-gray-500 mt-2">Based on {mockNursery.totalReviews} reviews</p>
                            </div>
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
                            <h3 className="text-xl font-bold text-gray-800">Plant Management</h3>
                            <div className="flex space-x-3">
                                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                                    <FiFilter className="w-4 h-4 mr-2" />
                                    Filter
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingPlant(null);
                                        setShowPlantModal(true);
                                    }}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                                >
                                    <FiPlus className="w-4 h-4 mr-2" />
                                    Add Plant
                                </button>
                            </div>
                        </div>

                        {/* Plants Table with Images */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h4 className="font-bold text-gray-800">Plants List & Inventory Status</h4>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plant Details</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mockPlants.map((plant) => (
                                            <tr key={plant.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="relative w-16 h-16">
                                                        <img
                                                            src={plant.image}
                                                            alt={plant.name}
                                                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                                        />
                                                        {plant.stock < 10 && (
                                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                                                <span className="text-xs text-white font-bold">!</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{plant.name}</div>
                                                        <div className="flex items-center mt-1">
                                                            <FiStar className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                                            <span className="text-sm text-gray-600">{plant.rating}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                                        {plant.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-bold text-green-600">
                                                    ${plant.price}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                                            <div
                                                                className={`h-2 rounded-full ${plant.stock < 10 ? 'bg-red-500' :
                                                                    plant.stock < 30 ? 'bg-yellow-500' :
                                                                        'bg-green-500'
                                                                    }`}
                                                                style={{ width: `${Math.min((plant.stock / 100) * 100, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className={`font-medium ${plant.stock < 10 ? 'text-red-600' :
                                                            plant.stock < 30 ? 'text-yellow-600' :
                                                                'text-green-600'
                                                            }`}>
                                                            {plant.stock}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
                                                    {plant.sold} units
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {renderStatusBadge(plant.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                setEditingPlant(plant);
                                                                setShowPlantModal(true);
                                                            }}
                                                            className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100"
                                                            title="Edit"
                                                        >
                                                            <FiEdit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStock(plant.id, plant.stock + 10)}
                                                            className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-100"
                                                            title="Restock"
                                                        >
                                                            <FiPlus className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100"
                                                            title="Delete"
                                                        >
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

                        {/* Plant Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-gray-700">Total Plants</h4>
                                    <MdLocalFlorist className="w-6 h-6 text-green-500" />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">{mockPlants.length}</p>
                                <p className="text-sm text-gray-500 mt-2">Active listings</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-gray-700">Total Stock</h4>
                                    <FiPackage className="w-6 h-6 text-blue-500" />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">
                                    {mockPlants.reduce((sum, plant) => sum + plant.stock, 0)}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">Available units</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-gray-700">Total Sold</h4>
                                    <FiTrendingUp className="w-6 h-6 text-green-500" />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">
                                    {mockPlants.reduce((sum, plant) => sum + plant.sold, 0)}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">Units sold</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-gray-700">Low Stock</h4>
                                    <FiAlertCircle className="w-6 h-6 text-red-500" />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">
                                    {mockPlants.filter(p => p.stock < 10).length}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">Need restocking</p>
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
                            <h3 className="text-xl font-bold text-gray-800">Order Management</h3>
                            <div className="flex space-x-3">
                                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                                    <FiFilter className="w-4 h-4 mr-2" />
                                    Filter by Status
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

                        {/* Order Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Processing', count: 24, color: 'bg-yellow-500' },
                                { label: 'Shipped', count: 18, color: 'bg-blue-500' },
                                { label: 'Delivered', count: 1203, color: 'bg-green-500' },
                                { label: 'Cancelled', count: 8, color: 'bg-red-500' }
                            ].map((stat, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-sm p-4">
                                    <div className="flex items-center">
                                        <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mr-4`}>
                                            <span className="text-white font-bold">{stat.count}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">{stat.label}</p>
                                            <p className="font-bold text-gray-800">Orders</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mockRecentOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                    {order.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {order.customer}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {order.date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                                                    ${order.amount}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {renderStatusBadge(order.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedOrder(order);
                                                                setShowOrderModal(true);
                                                            }}
                                                            className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                                                        >
                                                            Details
                                                        </button>
                                                        {order.status === 'processing' && (
                                                            <button
                                                                onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                                                                className="px-3 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100"
                                                            >
                                                                Ship
                                                            </button>
                                                        )}
                                                        {order.status === 'shipped' && (
                                                            <button
                                                                onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                                                                className="px-3 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100"
                                                            >
                                                                Deliver
                                                            </button>
                                                        )}
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

            case 'inventory':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-800">Inventory Management</h3>
                            <div className="flex space-x-3">
                                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                                    <FiFilter className="w-4 h-4 mr-2" />
                                    Filter
                                </button>
                                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center">
                                    <FiPlus className="w-4 h-4 mr-2" />
                                    Bulk Update
                                </button>
                            </div>
                        </div>

                        {/* Stock Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-gray-700">Total Items</h4>
                                    <MdInventory className="w-6 h-6 text-green-500" />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">{mockPlants.length}</p>
                                <p className="text-sm text-gray-500 mt-2">Active plant varieties</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-gray-700">Total Stock</h4>
                                    <FiPackage className="w-6 h-6 text-blue-500" />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">
                                    {mockPlants.reduce((sum, plant) => sum + plant.stock, 0)}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">Available units</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-gray-700">Low Stock</h4>
                                    <FiAlertCircle className="w-6 h-6 text-red-500" />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">{mockLowStockPlants.length}</p>
                                <p className="text-sm text-gray-500 mt-2">Items need restocking</p>
                            </div>
                        </div>

                        {/* Stock Management Table */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h4 className="font-bold text-gray-800">Stock Management</h4>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plant</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minimum Stock</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mockPlants.map((plant) => (
                                            <tr key={plant.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <img src={plant.image} alt={plant.name} className="w-10 h-10 rounded-lg object-cover mr-3" />
                                                        <div>
                                                            <div className="font-medium text-gray-900">{plant.name}</div>
                                                            <div className="text-sm text-gray-500">{plant.category}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="number"
                                                            defaultValue={plant.stock}
                                                            className="w-20 px-3 py-1 border border-gray-300 rounded-lg text-center"
                                                            onChange={(e) => handleUpdateStock(plant.id, parseInt(e.target.value))}
                                                        />
                                                        <span className="ml-2 text-sm text-gray-600">units</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    10 units
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${plant.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                        {plant.stock < 10 ? 'Low Stock' : 'In Stock'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {plant.createdAt}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleUpdateStock(plant.id, plant.stock + 10)}
                                                            className="px-3 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100"
                                                        >
                                                            +10
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStock(plant.id, plant.stock + 50)}
                                                            className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                                                        >
                                                            +50
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

            case 'analytics':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-800">Analytics & Reports</h3>
                            <div className="flex space-x-3">
                                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                                    <option>Last 7 Days</option>
                                    <option>Last 30 Days</option>
                                    <option>Last 90 Days</option>
                                </select>
                                <button
                                    onClick={() => handleExportReport('analytics')}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                                >
                                    <FiDownload className="w-4 h-4 mr-2" />
                                    Export Report
                                </button>
                            </div>
                        </div>

                        {/* Sales Chart */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h4 className="font-bold text-gray-800 mb-6">Weekly Sales Trend</h4>
                            <div className="h-64 flex items-end space-x-2">
                                {mockSalesData.map((day, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div
                                            className="w-10 bg-gradient-to-t from-green-400 to-emerald-600 rounded-t-lg"
                                            style={{ height: `${(day.sales / 3500) * 100}%` }}
                                        />
                                        <span className="mt-2 text-xs text-gray-600">${day.sales.toLocaleString()}</span>
                                        <span className="mt-1 text-xs text-gray-500">{day.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Best Sellers */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h4 className="font-bold text-gray-800 mb-6">Best Selling Plants</h4>
                            <div className="space-y-4">
                                {mockBestSellers.map((plant, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-4">
                                                <span className="font-bold text-green-600">{index + 1}</span>
                                            </div>
                                            <div>
                                                <h5 className="font-medium text-gray-800">{plant.name}</h5>
                                                <p className="text-sm text-gray-600">{plant.sales} units sold</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">${plant.revenue.toLocaleString()}</p>
                                            <p className="text-sm text-gray-600">Revenue</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Performance Insights */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h4 className="font-bold text-gray-800 mb-4">Performance Insights</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Average Order Value</span>
                                        <span className="font-bold">$124.50</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Conversion Rate</span>
                                        <span className="font-bold text-green-600">4.2%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Returning Customers</span>
                                        <span className="font-bold">42%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h4 className="font-bold text-gray-800 mb-4">Quick Reports</h4>
                                <div className="space-y-3">
                                    <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-between">
                                        <span>Sales Summary Report</span>
                                        <FiDownload className="w-4 h-4 text-gray-400" />
                                    </button>
                                    <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-between">
                                        <span>Inventory Report</span>
                                        <FiDownload className="w-4 h-4 text-gray-400" />
                                    </button>
                                    <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-between">
                                        <span>Customer Insights</span>
                                        <FiDownload className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'profile':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Profile Header */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Profile & Settings</h3>
                                <button
                                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                                    className="flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <FiEdit className="w-4 h-4 mr-2" />
                                    {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                                </button>
                            </div>
                            {
                                loading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                                        <p className="mt-4 text-gray-600">Loading user data...</p>
                                    </div>
                                ) : adminData ? (


                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                        {/* Profile Photo */}
                                        <div className="relative">
                                            <img
                                                src={adminData?.avaterUrl}
                                                alt={adminData?.name}
                                                className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                                            />
                                            {isEditingProfile && (
                                                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                                                    <FiEdit className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Profile Details */}
                                        <div className="flex-1">
                                            {isEditingProfile ? (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                            <input
                                                                type="text"
                                                                value={adminData?.name}
                                                                onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                            <input
                                                                type="email"
                                                                value={adminData?.email}
                                                                onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                                            <input
                                                                type="tel"
                                                                value={adminData.phone}
                                                                onChange={(e) => setAdminData({ ...adminData, phone: e.target.value })}
                                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                                            <input
                                                                type="text"
                                                                value={adminData.location}
                                                                onChange={(e) => setAdminData({ ...adminData, location: e.target.value })}
                                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <button
                                                            onClick={() => setIsEditingProfile(false)}
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
                                                        <h4 className="text-2xl font-bold text-gray-800">{adminData.name}</h4>
                                                        <p className="text-gray-600">{adminData.email}</p>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="flex items-center">
                                                            <FiUser className="w-5 h-5 text-gray-400 mr-3" />
                                                            <div>
                                                                <p className="text-sm text-gray-500">Role</p>
                                                                <p className="font-medium">{adminData.role}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <MdStore className="w-5 h-5 text-gray-400 mr-3" />
                                                            <div>
                                                                <p className="text-sm text-gray-500">Nursery</p>
                                                                <p className="font-medium">{adminData.nursery}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <FiMapPin className="w-5 h-5 text-gray-400 mr-3" />
                                                            <div>
                                                                <p className="text-sm text-gray-500">Location</p>
                                                                <p className="font-medium">{adminData.location}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <FiClock className="w-5 h-5 text-gray-400 mr-3" />
                                                            <div>
                                                                <p className="text-sm text-gray-500">Joined</p>
                                                                <p className="font-medium">{adminData.joinDate}</p>
                                                            </div>
                                                        </div>
                                                    </div>
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

                        {/* Nursery Settings */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h4 className="font-bold text-gray-800 text-lg mb-4">Nursery Settings</h4>
                            <div className="space-y-4 max-w-2xl">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nursery Name</label>
                                    <input
                                        type="text"
                                        value={nurseryData.name}
                                        onChange={(e) => setNurseryData({ ...nurseryData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={nurseryData.description}
                                        onChange={(e) => setNurseryData({ ...nurseryData, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea
                                        value={nurseryData.address}
                                        onChange={(e) => setNurseryData({ ...nurseryData, address: e.target.value })}
                                        rows={2}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                                        <input
                                            type="email"
                                            value={nurseryData.contact}
                                            onChange={(e) => setNurseryData({ ...nurseryData, contact: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={nurseryData.phone}
                                            onChange={(e) => setNurseryData({ ...nurseryData, phone: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                    Save Nursery Settings
                                </button>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'payouts':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-800">Payouts & Revenue</h3>
                            <button
                                onClick={() => handleExportReport('payouts')}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                            >
                                <FiDownload className="w-4 h-4 mr-2" />
                                Export Statement
                            </button>
                        </div>

                        {/* Revenue Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-gray-700">Total Revenue</h4>
                                    <FiDollarSign className="w-6 h-6 text-green-500" />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">
                                    ${mockDashboardMetrics.totalSales.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">Gross sales amount</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-gray-700">Commission Paid</h4>
                                    <FiTrendingDown className="w-6 h-6 text-red-500" />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">
                                    ${mockDashboardMetrics.commissionPaid.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">{mockNursery.commissionRate}% of sales</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-gray-700">Net Earnings</h4>
                                    <FiTrendingUp className="w-6 h-6 text-blue-500" />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">
                                    ${mockDashboardMetrics.netRevenue.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">After commission</p>
                            </div>
                        </div>

                        {/* Payout History */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h4 className="font-bold text-gray-800">Payout History</h4>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mockPayouts.map((payout, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {payout.date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                    ${payout.amount.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-red-600">
                                                    -${payout.commission.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-bold text-green-600">
                                                    ${payout.net.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {renderStatusBadge(payout.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Commission Breakdown */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h4 className="font-bold text-gray-800 mb-4">Commission Breakdown</h4>
                            <div className="max-w-md">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Platform Commission Rate</span>
                                        <span className="font-medium">{mockNursery.commissionRate}%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Total Commission Paid</span>
                                        <span className="font-medium text-red-600">${mockDashboardMetrics.commissionPaid.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Next Payout Date</span>
                                        <span className="font-medium">April 1, 2024</span>
                                    </div>
                                </div>
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
                            <h3 className="text-xl font-bold text-gray-800">Notifications</h3>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="px-4 py-2 text-green-600 hover:text-green-800 font-medium"
                                >
                                    Mark all as read
                                </button>
                                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                                    <FiSettings className="w-4 h-4 mr-2" />
                                    Settings
                                </button>
                            </div>
                        </div>

                        {/* Notification Preferences */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h4 className="font-bold text-gray-800 text-lg mb-4">Notification Preferences</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">New Order Alerts</p>
                                        <p className="text-sm text-gray-600">Get notified when new orders are placed</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">Low Stock Alerts</p>
                                        <p className="text-sm text-gray-600">Get alerts when stock is low</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">Sales Reports</p>
                                        <p className="text-sm text-gray-600">Weekly and monthly sales reports</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${notification.read ? 'border-gray-300' : 'border-green-500'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${notification.type === 'order' ? 'bg-blue-100' : 'bg-red-100'
                                                    }`}>
                                                    {notification.type === 'order' ? (
                                                        <FiShoppingBag className={`w-4 h-4 ${notification.read ? 'text-blue-500' : 'text-blue-600'}`} />
                                                    ) : (
                                                        <FiAlertCircle className={`w-4 h-4 ${notification.read ? 'text-red-500' : 'text-red-600'}`} />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800">{notification.title}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-500">{notification.time}</span>
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

            case 'settings':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">System Settings</h3>

                            {/* General Settings */}
                            <div className="space-y-6">
                                <h4 className="font-bold text-gray-800 text-lg mb-4">General Settings</h4>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-800">Dark Mode</p>
                                            <p className="text-sm text-gray-600">Enable dark theme for the dashboard</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-800">Email Notifications</p>
                                            <p className="text-sm text-gray-600">Receive email notifications for orders and alerts</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-800">Push Notifications</p>
                                            <p className="text-sm text-gray-600">Enable browser push notifications</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Display Settings */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h4 className="font-bold text-gray-800 text-lg mb-4">Display Settings</h4>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Items Per Page</label>
                                        <select className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                            <option>10 items</option>
                                            <option selected>25 items</option>
                                            <option>50 items</option>
                                            <option>100 items</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Default Dashboard View</label>
                                        <select className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                            <option selected>Cards View</option>
                                            <option>Table View</option>
                                            <option>List View</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                                        <select className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                            <option selected>MM/DD/YYYY</option>
                                            <option>DD/MM/YYYY</option>
                                            <option>YYYY-MM-DD</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Security Settings */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h4 className="font-bold text-gray-800 text-lg mb-4">Security Settings</h4>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                                            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-800">Auto Logout</p>
                                            <p className="text-sm text-gray-600">Automatically logout after 30 minutes of inactivity</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout</label>
                                        <select className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                            <option>15 minutes</option>
                                            <option selected>30 minutes</option>
                                            <option>1 hour</option>
                                            <option>4 hours</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Data Management */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h4 className="font-bold text-gray-800 text-lg mb-4">Data Management</h4>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-800">Automatic Data Backup</p>
                                            <p className="text-sm text-gray-600">Automatically backup your data daily</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => handleExportReport('all-data')}
                                            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                                        >
                                            <FiDownload className="w-5 h-5 mr-2" />
                                            Export All Data
                                        </button>
                                        <button className="px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center">
                                            <FiTrash2 className="w-5 h-5 mr-2" />
                                            Clear Cache
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Save Settings */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex justify-end space-x-4">
                                    <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                                        Reset to Default
                                    </button>
                                    <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                        Save Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-800"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8 mt-15">
                    {/* Sidebar Navigation */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-xl shadow-sm p-4 sticky top-8">
                            {/* Admin Profile */}
                            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                                <img
                                    src={adminData?.avaterUrl}
                                    alt={adminData?.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                                />
                                <div>
                                    <h3 className="font-bold text-gray-800">{adminData?.name}</h3>
                                    <p className="text-sm text-gray-600">{adminData?.role}</p>
                                    <p className="text-xs text-green-600 font-medium mt-1">{mockNursery.name}</p>
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
                                <h4 className="font-medium text-gray-700 mb-3">Today&apos;s Snapshot</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">New Orders</span>
                                        <span className="font-medium text-green-600">{mockDashboardMetrics.todayOrders}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Today&apos;s Sales</span>
                                        <span className="font-medium">${mockDashboardMetrics.todaySales.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Low Stock Items</span>
                                        <span className="font-medium text-red-600">{mockLowStockPlants.length}</span>
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

            {/* Plant Management Modal */}
            {showPlantModal && (
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
                                    {editingPlant ? 'Edit Plant' : 'Add New Plant'}
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowPlantModal(false);
                                        setEditingPlant(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Plant Name</label>
                                        <input
                                            type="text"
                                            defaultValue={editingPlant?.name || ''}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="e.g., Monstera Deliciosa"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                            <option value="indoor">Indoor</option>
                                            <option value="outdoor">Outdoor</option>
                                            <option value="succulent">Succulent</option>
                                            <option value="flowering">Flowering</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            defaultValue={editingPlant?.price || ''}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="59.99"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
                                        <input
                                            type="number"
                                            defaultValue={editingPlant?.stock || '10'}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Describe your plant..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Care Instructions</label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Light, water, and care requirements..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                    <input
                                        type="url"
                                        defaultValue={editingPlant?.image || ''}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="https://example.com/plant-image.jpg"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                    <div className="flex items-center">
                                        <input
                                            id="active-status"
                                            type="checkbox"
                                            defaultChecked={!editingPlant || editingPlant.status === 'active'}
                                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                        />
                                        <label htmlFor="active-status" className="ml-2 text-sm text-gray-700">
                                            Set as Active
                                        </label>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => {
                                                setShowPlantModal(false);
                                                setEditingPlant(null);
                                            }}
                                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                            {editingPlant ? 'Update Plant' : 'Add Plant'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

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
                                        <p className="text-sm text-gray-500">Customer</p>
                                        <p className="font-medium">{selectedOrder.user}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-medium">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <div className="mt-1">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedOrder.statusColor}`}>
                                                {selectedOrder.statusText}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-800 mb-3">Order Items</h4>
                                    <div className="space-y-3">
                                        {selectedOrder.plants.map((plant: string, index: number) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                        <MdLocalFlorist className="w-5 h-5 text-green-600" />
                                                    </div>
                                                    <span className="font-medium">{plant}</span>
                                                </div>
                                                <span className="text-green-600">${(selectedOrder.amount / selectedOrder.items).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-200">
                                    <h4 className="font-medium text-gray-800 mb-4">Order Actions</h4>
                                    <div className="flex space-x-4">
                                        {selectedOrder.status === 'processing' && (
                                            <button
                                                onClick={() => {
                                                    handleUpdateOrderStatus(selectedOrder.id, 'shipped');
                                                    setShowOrderModal(false);
                                                }}
                                                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                            >
                                                <FiTruck className="inline w-4 h-4 mr-2" />
                                                Mark as Shipped
                                            </button>
                                        )}
                                        {selectedOrder.status === 'shipped' && (
                                            <button
                                                onClick={() => {
                                                    handleUpdateOrderStatus(selectedOrder.id, 'delivered');
                                                    setShowOrderModal(false);
                                                }}
                                                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                            >
                                                <FiCheckCircle className="inline w-4 h-4 mr-2" />
                                                Mark as Delivered
                                            </button>
                                        )}
                                        <button className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                                            Print Invoice
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-500">Subtotal</p>
                                            <p className="text-lg font-bold text-gray-800">${selectedOrder.amount.toFixed(2)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Total Amount</p>
                                            <p className="text-2xl font-bold text-green-600">${selectedOrder.amount.toFixed(2)}</p>
                                            <p className="text-sm text-gray-500">Including taxes</p>
                                        </div>
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
export default NurseryAdminDashboard;