'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { signup } from "@/app/api/auth.endpoint";
import toast from "react-hot-toast";

interface FormDataType {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    avatarUrl?: File | null;
}

interface SignupResponse {
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

    };
}
const SignUp: React.FC = () => {
    const [formData, setFormData] = useState<FormDataType>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        avatarUrl: null,
    });
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, files } = e.target;

        if (type === "file" && files) {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
        // setError("");
        // setSuccess("");
    };

    const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
        setShowPassword({
            ...showPassword,
            [field]: !showPassword[field],
        });
    };

    const validateForm = (): boolean => {

        toast.dismiss();

        if (!formData.name.trim()) {
            toast.error("Please enter your full name");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }


        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const submitFormData = new FormData();
            submitFormData.append('name', formData.name);
            submitFormData.append('email', formData.email);
            submitFormData.append('password', formData.password);
            submitFormData.append('confirmPassword', formData.confirmPassword);

            if (formData.avatarUrl) {
                submitFormData.append('avatarUrl', formData.avatarUrl);
            }

            console.log("Signup attempt:", {
                name: `${formData.name}`,
                email: formData.email,
            });

            // Call signup API
            const res = await signup(submitFormData);

            if (res && res.success) {
                toast.success("Account created successfully! Please verify your email with OTP.");

                // Store user ID for OTP verification

                const userId = res.data?._id;

                console.log("User ID = res.data?._id", res.data?._id);

                if (userId) {
                    localStorage.setItem('UserId', userId);
                }

                // Navigate to OTP verification page
                setTimeout(() => {
                    router.push(`/auth/otp?userId=${userId}&email=${encodeURIComponent(formData.email)}`);
                }, 1500);

            } else {
                const errorMessage = res?.message || 'Registration failed. Please try again.';
                toast.error(errorMessage);
            }

        } catch (err: any) {
            console.error("Signup error:", err);
            toast.error(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp =  () => {
        try {
            setIsLoading(true);
            setError("");

            // Simulate Google OAuth (Replace with actual implementation)
            window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
            
            console.log("Google sign-up initiated");

            // router.push("/dashboard");
        } catch (err) {
            setError("Failed to sign up with Google. Please try again.");
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
            <div className="w-full max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row mt-15"
                >
                    {/* Left Side - SignUp Form */}
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
                                    Create Your Account
                                </h2>
                                <p className="mt-2 text-sm text-white-600">
                                    Already have an account?{" "}
                                    <Link
                                        href="/auth/signin"
                                        className="font-medium text-green-600 hover:text-green-500"
                                    >
                                        Sign in here
                                    </Link>
                                </p>
                            </div>

                            {/* Success Message */}
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6"
                                >
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className="h-5 w-5 text-green-400"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-green-700">{success}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

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
                                    onClick={handleGoogleSignUp}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center py-3.5 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FcGoogle className="w-5 h-5 mr-3" />
                                    Sign up with Google
                                </motion.button>
                            </div>

                            {/* Divider */}
                            <div className="relative mt-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
                                </div>
                            </div>

                            {/* Signup Form */}
                            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    {/* Name Fields */}
                                    <div>
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-white-700 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                autoComplete="given-name"
                                                required
                                                value={formData?.name || ""}
                                                onChange={handleChange}
                                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-white-500 text-white-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition duration-300"
                                                placeholder="Enter your full name"
                                            />
                                        </div>

                                    </div>

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
                                            value={formData?.email || ""}
                                            onChange={handleChange}
                                            className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-white-500 text-white-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition duration-300"
                                            placeholder="Enter your email Id"
                                        />
                                    </div>

                                    {/* Password Input */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-white-700 mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                name="password"
                                                type={showPassword.password ? "text" : "password"}
                                                autoComplete="new-password"
                                                required
                                                value={formData?.password || ""}
                                                onChange={handleChange}
                                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-white-500 text-white-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition duration-300 pr-12"
                                                placeholder="••••••••"
                                                minLength={6}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility("password")}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white-400 hover:text-white-600"
                                            >
                                                {showPassword.password ? (
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

                                    {/* Confirm Password Input */}
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white-700 mb-2">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showPassword.confirmPassword ? "text" : "password"}
                                                autoComplete="new-password"
                                                required
                                                value={formData?.confirmPassword || ""}
                                                onChange={handleChange}
                                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-white-500 text-white-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition duration-300 pr-12"
                                                placeholder="••••••••"
                                                minLength={6}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility("confirmPassword")}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white-400 hover:text-white-600"
                                            >
                                                {showPassword.confirmPassword ? (
                                                    <AiFillEyeInvisible className="w-5 h-5" />
                                                ) : (
                                                    <AiFillEye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Profile Picture Upload */}
                                    <div>
                                        <label htmlFor="avatarUrl" className="block text-sm font-medium text-white-700 mb-2">
                                            Profile Picture
                                        </label>
                                        <input
                                            id="avatarUrl"
                                            name="avatarUrl"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleChange}
                                            className="block w-full text-sm text-white-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-emerald-50 file:text-emerald-700
                                                hover:file:bg-emerald-100"
                                        />
                                        <p className="mt-1 text-xs text-white-500">
                                            PNG, JPG, GIF up to 5MB
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
                                            Creating Account...
                                        </div>
                                    ) : (
                                        "Create Account"
                                    )}
                                </motion.button>

                                {/* Security Note */}
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className="h-5 w-5 text-green-500"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-gray-600">
                                                Your data is secure with us. We use industry-standard encryption
                                                to protect your personal information.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Side - Transparent with Text */}
                    <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-green-600/90 to-emerald-800/90 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-black/20"></div>

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
                                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-4xl font-bold mb-4">
                                        Join Our Green Community
                                    </h3>

                                    <p className="text-lg mb-8 opacity-90">
                                        Create an account to unlock exclusive features and start your green journey today.
                                    </p>

                                    <div className="grid grid-cols-3 gap-6 mb-8">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold mb-2">500+</div>
                                            <div className="text-sm opacity-80">Plant Varieties</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold mb-2">2K+</div>
                                            <div className="text-sm opacity-80">Happy Members</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold mb-2">50+</div>
                                            <div className="text-sm opacity-80">Expert Nurseries</div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 text-left">
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>Personalized plant recommendations</span>
                                        </div>
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>Track your plant care journey</span>
                                        </div>
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>Exclusive deals and discounts</span>
                                        </div>
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>Connect with plant enthusiasts</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Mobile Image */}
                    <div className="lg:hidden w-full h-64 relative bg-gradient-to-r from-green-600/90 to-emerald-800/90">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="relative z-10 h-full flex items-center justify-center text-white p-6">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold mb-2">Start Your Green Journey</h3>
                                <p className="opacity-90">Join thousands of plant lovers today</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SignUp;