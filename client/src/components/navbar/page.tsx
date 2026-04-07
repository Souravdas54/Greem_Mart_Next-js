'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useAuth } from '@/app/context/AuthContext';

interface UserData {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl: string;
    isActive: string;
}

interface NavItem {
    name: string;
    path: string;
    icon?: string;
}

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [dynamicNavItems, setDynamicNavItems] = useState<NavItem[]>([]);

    const router = useRouter()
    const pathname = usePathname();

    const { user, isLoading, logout } = useAuth();

    // Define your base navigation items
    const baseNavItems: NavItem[] = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Plants', path: '/plant' }
    ];

    const fetchDynamicRoutes = async () => {
        try {
            const storedRoutes = localStorage.getItem('dynamicRoutes');
            if (storedRoutes) {
                setDynamicNavItems(JSON.parse(storedRoutes));
            }
        } catch (error) {
            console.error('Error fetching dynamic routes:', error);
        }
    };

    // Combine base and dynamic navigation items
    const allNavItems = useMemo(() => {
        return [...baseNavItems, ...dynamicNavItems];
    }, [dynamicNavItems]);

    // Check if current path is active
    const isActivePath = (path: string) => {
        if (path === '/') {
            return pathname === path;
        }
        return pathname.startsWith(path);
    };


    const navTextColor = useMemo(() => {
        if (isScrolled) {
            return 'text-gray-800';
        }

        const darkBagroungPage = ['/components/footer'];

        if (darkBagroungPage.includes(pathname)) {
            return 'text-gray-800'
        }
        return 'text-white'
    }, [isScrolled, pathname])

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const checkAuth = () => {
            try {
                const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
                const userDataStr = localStorage.getItem('userData') || sessionStorage.getItem('userData');

                // Check for Google OAuth flag
                const googleOAuthInProgress = sessionStorage.getItem('googleOAuthInProgress');
                const isGoogleAuthenticated = googleOAuthInProgress === 'true';

                if (accessToken) {
                    setIsLoggedIn(true);
                    if (userDataStr) {
                        try {
                            const parsedUserData: UserData = JSON.parse(userDataStr);
                            setUserData(parsedUserData);
                        } catch (error) {
                            console.error('Error parsing user data:', error);
                        }
                    }
                } else if (isGoogleAuthenticated) {
                    setIsLoggedIn(true);

                    // Try to get user data from storage if available
                    if (userDataStr) {
                        try {
                            const parsedUserData: UserData = JSON.parse(userDataStr);
                            setUserData(parsedUserData);
                        } catch (error) {
                            console.error('Error parsing user data:', error);
                            // Set default user data if parsing fails
                            setUserData({
                                _id: '',
                                name: 'Google User',
                                email: '',
                                role: 'user',
                                avatarUrl: '',
                                isActive: 'true'
                            });
                        }
                    } else {
                        // Set default user data if no user data found
                        setUserData({
                            _id: '',
                            name: 'Google User',
                            email: '',
                            role: 'user',
                            avatarUrl: '',
                            isActive: 'true'
                        });
                    }
                } else {
                    setIsLoggedIn(false);
                    setUserData(null);
                }

                // Fetch dynamic routes after authentication
                if (accessToken || isGoogleAuthenticated) {
                    fetchDynamicRoutes();
                }

            } catch (error) {
                console.error('Error reading auth:', error);
                setIsLoggedIn(false);
                setUserData(null);
            }
        };

        checkAuth();
        const handleStorageChange = () => checkAuth();
        window.addEventListener('storage', handleStorageChange);

        return () => window.removeEventListener('storage', handleStorageChange);
    }, [pathname]);

    const handleLogin = () => {

        router.push('/auth/signin');
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        try {

            // Clear all authentication data
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userData');
            localStorage.removeItem('UserId');
            localStorage.removeItem('userRole');
            localStorage.removeItem('greenmet-auth');

            localStorage.removeItem('googleOAuthInProgress'); // Google OAuth

            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
            sessionStorage.removeItem('userData');
            sessionStorage.removeItem('userRole');

            sessionStorage.removeItem('googleOAuthInProgress'); // Google OAuth

            const chnagePassword = sessionStorage.getItem('passwordResetSuccess')

            if (chnagePassword) {
                sessionStorage.removeItem('passwordResetSuccess')
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('userData');
                localStorage.removeItem('UserId');
                localStorage.removeItem('userRole');
                localStorage.removeItem('greenmet-auth');

                localStorage.removeItem('googleOAuthInProgress'); // Google OAuth

                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
                sessionStorage.removeItem('userData');
                sessionStorage.removeItem('userRole');
            }

            setIsLoggedIn(false);
            setUserData(null);

            // toast.success('Logged out successfully!');

            if (chnagePassword) {
                toast.success('Password changed successfully! Please login with your new password.');
            } else {
                toast.success('Logged out successfully!');
            }

            setTimeout(() => {
                router.push('/');
            }, 1000);
        } catch (error) {
            console.error('Error removing auth:', error);
            toast.error('Failed to logout. Please try again.');
        }
        setIsMenuOpen(false);
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
                ? "bg-white/70 backdrop-blur-md shadow-lg"
                : "bg-gradient-to-r from-green-000 to-emerald-000"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">GM</span>
                                </div>
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 blur opacity-30"></div>
                            </div>
                            <span className={`text-2xl font-bold tracking-tight  ${isScrolled ? "text-gray-800" : "text-white"
                                }`}>
                                Green<span className={isScrolled ? "text-emerald-600" : "text-emerald-300"}>Mert</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {
                            allNavItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`font-medium hover:text-white transition-colors duration-300 relative group ${isActivePath(item.path)
                                        ? (isScrolled ? "text-emerald-600" : "text-emerald-300")
                                        : (isScrolled ? "text-gray-700" : "text-white")
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                    {isActivePath(item.path) && (
                                        <motion.span
                                            layoutId="activeNavIndicator"
                                            className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-full"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            ))
                        }

                        {/* Auth Button */}
                        {isLoggedIn ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-4">
                                    {
                                        userData?.avatarUrl || user?.avatarUrl ? (
                                            <Link href='/auth/superadmindashboard'>
                                                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500">
                                                    <Image
                                                        src={userData?.avatarUrl || user?.avatarUrl}
                                                        alt={userData?.name || user?.name || ''}
                                                        fill
                                                        className="object-cover hover:opacity-90 transition-opacity cursor-pointer"
                                                        sizes="40px"
                                                    />
                                                </div>
                                            </Link>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                                                {userData?.name?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || ''}
                                            </div>
                                        )}
                                    <Link href='/auth/superadmindashboard'>
                                        <span className={`font-medium ${navTextColor}`}>
                                            {userData?.name || user?.name || ''}
                                        </span>
                                    </Link>
                                </div>

                                <button
                                    onClick={handleLogout || logout}
                                    className="bg-emerald-900 hover:bg-emerald-800 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleLogin}
                                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg ${isScrolled
                                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                    : "bg-white text-emerald-700 hover:bg-emerald-50"}`}
                            >
                                Sign In
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled
                            ? "hover:bg-gray-100 text-gray-700"
                            : "hover:bg-emerald-800 text-white"}`}
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu with Blur Background */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden overflow-hidden"
                        >
                            {/* Backdrop Blur */}
                            <div className="fixed inset-0 bg-black/30 z-40 md:hidden"
                                onClick={() => setIsMenuOpen(false)}
                            />

                            {/* Mobile Menu Content */}
                            <motion.div
                                initial={{ y: -20 }}
                                animate={{ y: 0 }}
                                className="relative z-50 bg-white/10 backdrop-blur-sm rounded-md shadow-2xl mt-2 p-4"
                            >
                                <div className="space-y-2">
                                    <Link
                                        href="/"
                                        className="block px-4 py-3 rounded-lg text-gray-800 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="/about"
                                        className="block px-4 py-3 rounded-lg text-gray-800 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        About
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className="block px-4 py-3 rounded-lg text-gray-800 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Contact
                                    </Link>

                                    <div className="pt-4 border-t border-gray-200">
                                        {isLoggedIn ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-3 px-4 py-2">
                                                    {userData?.avatarUrl ? (
                                                        <Link href='/auth/superadmindashboard'>
                                                            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500">
                                                                <Image
                                                                    src={userData.avatarUrl}
                                                                    alt={userData.name || 'User'}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes="40px"
                                                                />
                                                            </div>
                                                        </Link>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                                                            {userData?.name?.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-800">{userData?.name || 'User'}</p>
                                                        <p className="text-sm text-gray-600">{userData?.email}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-3 rounded-full font-medium transition-all duration-300 shadow-md"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleLogin}
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full font-medium transition-all duration-300 shadow-md"
                                            >
                                                Sign In
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

export default Navbar;