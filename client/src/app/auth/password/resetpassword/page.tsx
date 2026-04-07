'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { resetPassword } from '@/app/api/password.endpoint';

function ResetPassword() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState({
        newPassword: false,
        confirmPassword: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        // Check if email exists in sessionStorage
        const resetEmail = sessionStorage.getItem('resetEmail');
        if (!resetEmail && !email) {
            toast.error('Session expired. Please try again.');
            router.push('/auth/forgot-password');
        }
    }, [email, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const togglePasswordVisibility = (field: 'newPassword' | 'confirmPassword') => {
        setShowPassword({
            ...showPassword,
            [field]: !showPassword[field],
        });
    };

    const validateForm = () => {
        if (!formData.newPassword) {
            toast.error('Please enter a new password');
            return false;
        }

        if (formData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const userId = sessionStorage.getItem('resetUserId');
            if (!userId) {
                toast.error('Session expired. Please try again.');
                router.push('/auth/password/forgotpassword');
                return;
            }

            const response = await resetPassword({
                userId: userId,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            });

            if (response.success) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('userData');
                localStorage.removeItem('UserId');
                localStorage.removeItem('userRole');
                localStorage.removeItem('greenmet-auth');

                localStorage.removeItem('googleOAuthInProgress'); // Google OAuth

                sessionStorage.removeItem('resetEmail');
                sessionStorage.removeItem('resetUserId');
                sessionStorage.removeItem('otpVerified');

                sessionStorage.setItem('passwordResetSuccess', 'true')

                toast.success('Password changed successfully!');
                setIsSuccess(true);
                setTimeout(() => router.push('/auth/signin'), 2000);
            }
        } catch (error) {
            toast.error('Failed to reset password');
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
                    className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10"
                >
                    {/* Success Message */}
                    {isSuccess ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center"
                        >
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiCheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                Password Changed!
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Your password has been successfully changed. Redirecting to sign in...
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                                <motion.div
                                    className="h-full bg-green-500 rounded-full"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 2 }}
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <>
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
                                    Create New Password
                                </h2>
                                <p className="text-gray-600">
                                    Enter your new password below
                                </p>
                                <div className="mt-3 inline-flex items-center px-3 py-1 bg-green-50 rounded-full">
                                    <span className="text-sm text-gray-700">
                                        Resetting for: {email}
                                    </span>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* New Password */}
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiLock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="newPassword"
                                            name="newPassword"
                                            type={showPassword.newPassword ? "text" : "password"}
                                            required
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-10 py-3 text-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('newPassword')}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword.newPassword ? (
                                                <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Must be at least 6 characters long
                                    </p>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiLock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showPassword.confirmPassword ? "text" : "password"}
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-10 py-3 text-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('confirmPassword')}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword.confirmPassword ? (
                                                <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Password Requirements */}
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li className="flex items-center">
                                            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${formData.newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                            At least 6 characters
                                        </li>
                                        <li className="flex items-center">
                                            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${formData.newPassword && formData.newPassword === formData.confirmPassword ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                            Passwords match
                                        </li>
                                    </ul>
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
                                            Changing Password...
                                        </div>
                                    ) : (
                                        'Change Password'
                                    )}
                                </motion.button>

                                <div className="text-center">
                                    <Link
                                        href="/auth/signin"
                                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                                    >
                                        Back to Sign In
                                    </Link>
                                </div>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ResetPassword;