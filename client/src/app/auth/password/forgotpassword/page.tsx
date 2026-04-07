'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { forgotpassword } from '@/app/api/password.endpoint';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            // Call actual API
            const response = await forgotpassword(email, "");

            if (response.success) {
                // Store email and userId in sessionStorage
                sessionStorage.setItem('resetEmail', email);
                sessionStorage.setItem('resetUserId', response.userId);

                toast.success('OTP sent to your email!');

                // Redirect to OTP verification page
                router.push(`/auth/otp?email=${encodeURIComponent(email)}&type=password-reset`);
            } else {
                toast.error(response.message || 'Failed to send OTP');
            }
        } catch (error) {
            toast.error('Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=2070&auto=format&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}
        >
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="w-full max-w-md mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 mt-10"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link href="/auth/signin" className="inline-block mb-6">
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                                    <span className="text-white text-xl font-bold">G</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Green<span className="text-green-600">Met</span>
                                </h2>
                            </div>
                        </Link>

                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                            Forgot Password?
                        </h2>
                        <p className="text-gray-600">
                            Don&apos;t worry! Enter your email and we&apos;ll send you an OTP to reset your password.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiMail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 text-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3.5 px-4 rounded-xl text-white font-semibold text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending OTP...
                                </div>
                            ) : (
                                'Confirm'
                            )}
                        </motion.button>

                        <div className="text-center">
                            <Link
                                href="/auth/signin"
                                className="inline-flex items-center text-sm text-green-600 hover:text-green-700 font-medium"
                            >
                                <FiArrowLeft className="w-4 h-4 mr-2" />
                                Back to Sign In
                            </Link>
                        </div>
                    </form>

                    {/* Help Text */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 text-center">
                            We&apos;ll send a 6-digit OTP to your email address. The OTP is valid for 1 minute.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;