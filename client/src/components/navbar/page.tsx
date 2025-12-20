'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const router= useRouter()

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
                const status = localStorage.getItem('greenmet-auth');
                setTimeout(() => {
                    setIsLoggedIn(status === 'true');
                }, 0);
            } catch (error) {
                console.error('Error reading auth:', error);
            }
        };

        checkAuth();
        const handleStorageChange = () => checkAuth();
        window.addEventListener('storage', handleStorageChange);

        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogin = () => {
        try {
            localStorage.setItem('greenmet-auth', 'true');
            setTimeout(() => setIsLoggedIn(true), 0);
        } catch (error) {
            console.error('Error saving auth:', error);
        }
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        try {
            localStorage.removeItem('greenmet-auth');
            setTimeout(() => setIsLoggedIn(false), 0);
        } catch (error) {
            console.error('Error removing auth:', error);
        }
        setIsMenuOpen(false);
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
                ? "bg-white/20 backdrop-blur-md shadow-lg"
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
                        <Link 
                            href="/" 
                            className={`font-medium hover:text-emerald-500 transition-colors duration-300 ${isScrolled ? "text-gray-700" : "text-white"}`}
                        >
                            Home
                        </Link>
                        <Link 
                            href="/about" 
                            className={`font-medium hover:text-emerald-500 transition-colors duration-300 ${isScrolled ? "text-gray-700" : "text-white"}`}
                        >
                            About
                        </Link>
                        <Link 
                            href="/contact" 
                            className={`font-medium hover:text-emerald-500 transition-colors duration-300 ${isScrolled ? "text-gray-700" : "text-white"}`}
                        >
                            Contact
                        </Link>

                        {/* Auth Button */}
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => router.push('/auth/signin')}
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
                                            <button
                                                onClick={handleLogout}
                                                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-3 rounded-full font-medium transition-all duration-300 shadow-md"
                                            >
                                                Logout
                                            </button>
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