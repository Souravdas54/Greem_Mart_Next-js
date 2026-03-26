'use client';

import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiClock, FiMail, FiRefreshCw, FiCheckCircle, FiLock, FiUser, FiHome } from 'react-icons/fi';
import Link from 'next/link';

// Import your API functions (adjust the path as needed)
import { verifyOtp, resendOtp } from '@/app/api/auth.endpoint';

const OTPVerification = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId') || '';
    const userEmail = searchParams.get('email') || 'user@example.com';

    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [timer, setTimer] = useState<number>(60);
    const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [resendCount, setResendCount] = useState<number>(0);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Timer countdown
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isTimerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        setIsTimerActive(false);
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTimerActive, timer]);

    // Auto-focus first input on mount
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0]?.focus();
        }
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError('');

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);

        if (/^\d+$/.test(pastedData)) {
            const newOtp = [...otp];
            pastedData.split('').forEach((char, index) => {
                if (index < 6) {
                    newOtp[index] = char;
                }
            });
            setOtp(newOtp);

            const lastIndex = Math.min(pastedData.length, 5);
            inputRefs.current[lastIndex]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const enteredOtp = otp.join('');

        if (enteredOtp.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        if (!userId) {
            setError('User ID is missing. Please try logging in again.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Call your verify OTP API
            const response = await verifyOtp({ userId, otp: enteredOtp });

            setSuccess('OTP verified successfully!');
            setIsVerified(true);

            // Store token if returned
            if (response.token) {
                localStorage.setItem('auth_token', response.token);
                localStorage.setItem('user_email', userEmail);
                localStorage.setItem('greenmet-auth', 'true');
            }

            // Redirect after success
            setTimeout(() => {
                router.push('/auth/signin');
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'Invalid OTP. Please try again.');
            setOtp(Array(6).fill(''));
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (resendCount >= 3) {
            setError('Maximum resend attempts reached. Please try again later.');
            return;
        }

        if (!userId) {
            setError('User ID is missing. Please try logging in again.');
            return;
        }

        try {
            // Call your resend OTP API
            await resendOtp(userId);

            // Reset state
            setOtp(Array(6).fill(''));
            setTimer(60);
            setIsTimerActive(true);
            setResendCount(prev => prev + 1);
            setError('');
            setSuccess('New OTP has been sent to your email!');

            // Focus first input
            inputRefs.current[0]?.focus();

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);

        } catch (err: any) {
            setError(err.message || 'Failed to resend OTP. Please try again.');
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 "
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=2070&auto=format&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}
        >
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="w-full max-w-6xl mx-auto relative z-10 mt-15">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row"
                >
                    {/* Left Side - OTP Verification */}
                    <div className="w-full lg:w-1/2 p-8 md:p-10 lg:p-12">
                        <div className="max-w-md mx-auto lg:mx-0">
                            {/* Logo & Header */}
                            <div className="text-center lg:text-left mb-10">
                                <Link href="/" className="inline-block">
                                    <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                                            {/* <FiHome className="w-6 h-6 text-white" /> */}
                                            <span className="text-white text-2xl font-bold">G</span>
                                        </div>
                                        <h2 className="text-3xl font-bold text-white-900">
                                            Green<span className="text-green-600">Met</span>
                                        </h2>
                                    </div>
                                </Link>
                                <h2 className="text-3xl font-extrabold text-white-900">
                                    Verify Your Account
                                </h2>
                                <p className="mt-2 text-sm text-white-600">
                                    Enter the 6-digit code sent to your email
                                </p>
                                <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-50 rounded-full">
                                    <FiMail className="w-4 h-4 text-green-600 mr-2" />
                                    <span className="text-sm text-gray-700">{userEmail}</span>
                                </div>
                            </div>

                            {/* Success Message */}
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6"
                                >
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <FiCheckCircle className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-green-700 font-medium">{success}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
                                >
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-red-400"
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
                                            <p className="text-sm text-red-700 font-medium">{error}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Timer Display */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <FiClock className="w-5 h-5 text-gray-400 mr-2" />
                                        <span className={`text-lg font-medium ${timer <= 10 ? 'text-red-600' : 'text-gray-700'}`}>
                                            {formatTime(timer)}
                                        </span>
                                    </div>
                                    <span className="text-sm text-white-500">
                                        {isTimerActive ? 'Expires in' : 'Expired'}
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <motion.div
                                        className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
                                        initial={{ width: '100%' }}
                                        animate={{ width: `${(timer / 60) * 100}%` }}
                                        transition={{ duration: 1 }}
                                    />
                                </div>
                            </div>

                            {/* OTP Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-white-700 mb-4">
                                        6-Digit Verification Code
                                    </label>
                                    <div className="flex justify-center space-x-3 mb-2">
                                        {Array.from({ length: 6 }).map((_, index) => (
                                            <motion.div
                                                key={index}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="relative"
                                            >
                                                <input
                                                    ref={(el) => { inputRefs.current[index] = el }}
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="\d*"
                                                    maxLength={1}
                                                    value={otp[index]}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                        handleChange(index, e.target.value)
                                                    }
                                                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                                                        handleKeyDown(index, e)
                                                    }
                                                    onPaste={handlePaste}
                                                    disabled={isVerified || isLoading}
                                                    className="w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:opacity-70"
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                    <p className="text-center text-sm text-white-500 mt-3">
                                        Enter all 6 digits from your email
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isLoading || isVerified}
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
                                            Verifying...
                                        </div>
                                    ) : isVerified ? (
                                        <span className="flex items-center">
                                            <FiCheckCircle className="w-5 h-5 mr-2" />
                                            Verified Successfully
                                        </span>
                                    ) : (
                                        'Verify & Continue'
                                    )}
                                </motion.button>
                            </form>

                            {/* Resend OTP Section */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="text-center">
                                    <p className="text-white-600 mb-4">
                                        {isTimerActive ? "Didn't receive the code?" : "Code expired?"}
                                    </p>

                                    <motion.button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={isTimerActive || resendCount >= 3 || isLoading}
                                        whileHover={{ scale: isTimerActive ? 1 : 1.05 }}
                                        whileTap={{ scale: isTimerActive ? 1 : 0.95 }}
                                        className={`inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${isTimerActive || resendCount >= 3
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-md'
                                            }`}
                                    >
                                        <FiRefreshCw className="w-4 h-4 mr-2" />
                                        {resendCount === 0 ? 'Resend OTP' : `Resend OTP (${resendCount}/3)`}
                                    </motion.button>

                                    {resendCount >= 3 && (
                                        <p className="text-red-500 text-sm mt-3">
                                            Maximum resend attempts reached. Please contact support.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Back to Login */}
                            <div className="text-center mt-8">
                                <button
                                    onClick={() => router.push('/auth/signin')}
                                    className="text-green-600 hover:text-green-700 font-medium inline-flex items-center text-sm"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to login
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Green Community */}
                    <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-green-600/90 to-emerald-800/90 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-black/20"></div>

                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-white">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-center max-w-lg"
                            >
                                <div className="mb-10">
                                    <div className="w-32 h-32 mx-auto mb-8 relative">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                                <FiLock className="w-16 h-16" />
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-4xl font-bold mb-6">
                                        Secure Your <span className="text-emerald-300">Green</span> Journey
                                    </h3>

                                    <p className="text-lg mb-10 opacity-90 leading-relaxed">
                                        Complete verification to access personalized sustainability tracking, exclusive green projects, and connect with our eco-conscious community.
                                    </p>

                                    {/* Security Features */}
                                    <div className="space-y-6 text-left mb-12">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center mr-4 mt-1">
                                                <span className="text-white font-bold text-sm">✓</span>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold mb-1">Bank-Level Security</h4>
                                                <p className="text-emerald-100/80 text-sm">Your data is protected with 256-bit encryption</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center mr-4 mt-1">
                                                <span className="text-white font-bold text-sm">✓</span>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold mb-1">Instant Access</h4>
                                                <p className="text-emerald-100/80 text-sm">Get immediate access to all green features</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center mr-4 mt-1">
                                                <span className="text-white font-bold text-sm">✓</span>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold mb-1">Community Verified</h4>
                                                <p className="text-emerald-100/80 text-sm">Join thousands of verified eco-warriors</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-8 mb-12">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold mb-2">10K+</div>
                                            <div className="text-sm opacity-80">Verified Users</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold mb-2">99.9%</div>
                                            <div className="text-sm opacity-80">Success Rate</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold mb-2">24/7</div>
                                            <div className="text-sm opacity-80">Support</div>
                                        </div>
                                    </div>

                                    {/* Note */}
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                        <p className="text-sm opacity-90">
                                            <strong>Note:</strong> The OTP code is valid for 1 minute only.
                                            If you don&apos;t receive the code, check your spam folder or request a new one.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Mobile Community Section */}
                    <div className="lg:hidden w-full bg-gradient-to-r from-green-600/90 to-emerald-800/90 p-8">
                        <div className="text-center text-white">
                            <h3 className="text-2xl font-bold mb-4">Secure Your Green Journey</h3>
                            <p className="opacity-90 mb-6">
                                Complete verification to access exclusive sustainability features
                            </p>
                            <div className="flex justify-center space-x-6">
                                <div className="text-center">
                                    <div className="text-xl font-bold">10K+</div>
                                    <div className="text-xs opacity-80">Users</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold">99.9%</div>
                                    <div className="text-xs opacity-80">Secure</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold">24/7</div>
                                    <div className="text-xs opacity-80">Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OTPVerification;