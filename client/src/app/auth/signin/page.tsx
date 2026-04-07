'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Image from "next/image";
import toast from 'react-hot-toast'

import { login } from "@/app/api/auth.endpoint";
import { useAuth } from '@/app/context/AuthContext';

interface Usertype {
    email: string;
    password: string;
}

interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: {
            _id: string;
            name: string;
            email: string;
            role: string;

            avatarUrl: string;
            isActive: string;
            createdAt: string;
            updatedAt: string;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
            accessTokenExpires: string;
            refreshTokenExpires: string;
        };
    };
}

const SignIn: React.FC = () => {
    const [formData, setFormData] = useState<Usertype>({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();
    const { login: setAuthUser } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const res = await login(formData)

            console.log("🔍 Full login response:", res);
            console.log("Login attempt:", formData);

            if (res && res.success) {
                toast.success("Login successful");
                console.log("Login Successfull");
                setFormData({ email: "", password: '' })

                // CORRECT STRUCTURE: data = user object, tokens = separate root property
                const userData = res.data;
                const tokens = res.tokens;

                const role = userData?.role;
                const accessToken = tokens?.accessToken;
                const refreshToken = tokens?.refreshToken;
                const avatarUrl = userData?.avatarUrl;

                // Store authentication data
                if (accessToken) {
                    sessionStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("accessToken", accessToken);
                    // console.log('Access token stored in sessionStorage');
                } else {
                    console.log('No access token found in response');
                }

                if (refreshToken) {
                    sessionStorage.setItem("refreshToken", refreshToken);
                    localStorage.setItem("refreshToken", refreshToken);
                    // console.log('Refresh token stored in sessionStorage');
                } else {
                    console.log('No refresh token found in response');
                }

                if (role) {
                    sessionStorage.setItem('userRole', role);
                    // console.log('Role stored in sessionStorage');
                }

                if (userData) {
                    sessionStorage.setItem('userData', JSON.stringify(userData));
                    localStorage.setItem('userData', JSON.stringify(userData));
                    // console.log('User data stored in sessionStorage');
                }

                localStorage.setItem('authMethod', 'email');
                sessionStorage.setItem('authMethod', 'email');
                // Navigate to dashboard or home

                // Redirect based on role
                setTimeout(() => {
                    if (role === 'super_admin') {
                        router.push('/auth/superadmindashboard');
                    } else if (role === 'nursery_admin') {
                        router.push('/auth/nurserydashboard');
                    } else if (role === 'user') {
                        router.push('/auth/userdashboard');
                    } else {
                        router.push('/');
                    }
                }, 1000);

            } else {
                const errorMessage = res?.message || 'Login failed. Please check your credentials.';
                toast.error(errorMessage);
                console.log(errorMessage);

            }
        } catch (err) {
            // More detailed error handling
            let errorMessage = 'Login failed. Please check your email or password.';

            // Check if it's an Axios-like error
            if (typeof error === 'object' && error !== null) {
                const err = error as {
                    response?: {
                        data?: {
                            message?: string;
                        };
                    };
                    message?: string;
                    code?: string;
                };

                if (err.response?.data?.message) {
                    errorMessage = err.response.data.message;
                } else if (err.message) {
                    errorMessage = err.message;
                } else if (err.code === 'NETWORK_ERROR') {
                    errorMessage = 'Network error. Please check your connection.';
                }
            }
            toast.error(errorMessage);
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);
            setError("");

            console.log("Google sign-in initiated");

            sessionStorage.setItem('googleOAuthInProgress', 'true');
            localStorage.setItem('googleOAuthInProgress', 'true');

            // Simulate Google OAuth (Replace with actual implementation)
            window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;


            // toast.success("Google sign-in successful! Redirecting...");

            // router.push('/auth/userdashboard');

            // setTimeout(() => {
            //     router.push('/auth/userdashboard');
            // }, 1500);

        } catch (err) {
            toast.error("Failed to sign in with Google. Please try again.");
            setError("Failed to sign in with Google. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        toast.loading("Redirecting to forgot password page...");
        router.push("/auth/password/forgotpassword");
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=2070&auto=format&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}>

            <div className="w-full max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row mt-15"
                >
                    {/* Left Side - Login Form */}
                    <div className="w-full lg:w-1/2 p-8 md:p-10 lg:p-12">
                        <div className="max-w-md mx-auto lg:mx-0">
                            {/* Logo & Header */}
                            <div className="text-center lg:text-left">
                                <Link href="/" className="inline-block">
                                    <div className="flex items-center justify-center lg:justify-start space-x-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                                            <span className="text-white text-2xl font-bold">G</span>
                                        </div>
                                        <h2 className="text-3xl font-bold text-white-900">
                                            Green<span className="text-green-600">Met</span>
                                        </h2>
                                    </div>
                                </Link>
                                <h2 className="mt-6 text-3xl font-extrabold text-white-900">
                                    Welcome Back
                                </h2>
                                <p className="mt-2 text-sm text-white-600">
                                    Don&apos;t have an account?{" "}
                                    <Link
                                        href="/auth/signup"
                                        className="font-medium text-green-600 hover:text-green-500"
                                    >
                                        Sign up for free
                                    </Link>
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6"
                                >
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className="h-5 w-5 text-red-400"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">{error}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Google OAuth Button */}
                            <div className="mt-6">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center py-3.5 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FcGoogle className="w-5 h-5 mr-3" />
                                    Continue with Google
                                </motion.button>
                            </div>

                            {/* Divider */}
                            <div className="relative mt-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            {/* Login Form */}
                            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    {/* Email Input */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-white-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-white-500 text-white-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:z-10 sm:text-sm transition duration-300"
                                            placeholder="Enter your email id"
                                        />
                                    </div>

                                    {/* Password Input */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label htmlFor="password" className="block text-sm font-medium text-white-700">
                                                Password
                                            </label>
                                            <button
                                                type="button"
                                                onClick={handleForgotPassword}
                                                className="text-sm font-medium text-green-600 hover:text-green-500"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                autoComplete="current-password"
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-white-500 text-white-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:z-10 sm:text-sm transition duration-300 pr-12"
                                                placeholder="••••••••"
                                                minLength={6}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white-400 hover:text-white-600"
                                            >
                                                {showPassword ? (
                                                    <AiFillEyeInvisible className="w-5 h-5" />
                                                ) : (
                                                    <AiFillEye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                        <p className="mt-1 text-xs text-white-500">
                                            Must be at least 6 characters long
                                        </p>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                    className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Signing in...
                                        </div>
                                    ) : (
                                        "Sign in to your account"
                                    )}
                                </motion.button>
                            </form>

                            {/* Additional Links */}
                            <div className="text-center mt-8">
                                <p className="text-sm text-white-600">
                                    By continuing, you agree to our{" "}
                                    <Link href="/terms" className="font-medium text-green-600 hover:text-green-500">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="font-medium text-green-600 hover:text-green-500">
                                        Privacy Policy
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Image */}
                    <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-green-500 to-emerald-700">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/90 to-emerald-700/90"></div>

                        {/* Plant-themed decorative elements */}
                        <div className="absolute top-8 right-8">
                            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm"></div>
                        </div>

                        <div className="absolute bottom-8 left-8">
                            <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm"></div>
                        </div>

                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-48 h-48 rounded-full bg-white/10 backdrop-blur-sm"></div>
                        </div>

                        {/* Content overlay */}
                        <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-white">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-center"
                            >
                                <div className="mb-8">
                                    <div className="w-32 h-32 mx-auto mb-6 relative">
                                        {/* Plant icon or image */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                                <svg
                                                    className="w-16 h-16"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-4xl font-bold mb-4">
                                        Join Our Green Community
                                    </h3>

                                    <p className="text-lg mb-8 opacity-90">
                                        Discover thousands of plants, connect with expert gardeners, and transform your space into a green paradise.
                                    </p>

                                    <div className="grid grid-cols-3 gap-6 mb-8">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold mb-2">500+</div>
                                            <div className="text-sm opacity-80">Plant Varieties</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold mb-2">2K+</div>
                                            <div className="text-sm opacity-80">Happy Customers</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold mb-2">50+</div>
                                            <div className="text-sm opacity-80">Expert Nurseries</div>
                                        </div>
                                    </div>

                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                        <blockquote className="text-lg italic mb-4">
                                            &ldquo;The best plant marketplace I&apos;ve ever used. My indoor garden has never been greener!&rdquo;
                                        </blockquote>
                                        <div className="flex items-center justify-center">
                                            <div className="w-10 h-10 rounded-full bg-white/20 mr-3"></div>
                                            <div>
                                                <div className="font-semibold">Sarah Johnson</div>
                                                <div className="text-sm opacity-80">Plant Enthusiast</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Mobile Image (hidden on desktop) */}
                    <div className="lg:hidden w-full h-64 relative bg-gradient-to-r from-green-500 to-emerald-600">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/90 to-emerald-600/90"></div>
                        <div className="relative z-10 h-full flex items-center justify-center text-white p-6">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold mb-2">Welcome to GreenMet</h3>
                                <p className="opacity-90">Your journey to a greener space starts here</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SignIn;