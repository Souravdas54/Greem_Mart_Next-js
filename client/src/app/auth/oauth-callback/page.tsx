'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/app/context/AuthContext';

// ✅ Your backend sets cookies and redirects to this page
// This page just checks for errors and routes the user correctly
function OAuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { checkAuth } = useAuth();

    useEffect(() => {

        const handleCallback = async () => {

            const error = searchParams.get('error');

            if (error) {
                // ✅ Backend redirected with error query param
                const errorMessages: Record<string, string> = {
                    oauth_failed: 'Google sign-in failed. Please try again.',
                    role_not_found: 'Account role not configured. Contact support.',
                    server_error: 'Server error during sign-in. Please try again.',
                };

                const message = errorMessages[error] || 'Sign-in failed. Please try again.';
                toast.error(message);
                router.replace('/auth/signin');
                return;
            }
            // ── Success — backend has set HTTP-only cookies ───────────────
            // ✅ CRITICAL: call checkAuth() so AuthContext fetches user from
            // /auth/me using the cookie — this updates isLoggedIn in Navbar
            await checkAuth();

            // ✅ No error — cookies already set by backend, redirect to dashboard
            toast.success('Signed in with Google successfully!');
            // router.replace('/');

            // ✅ Read role from AuthContext after checkAuth() resolves
            // We re-read from /auth/me response via checkAuth
            // Use a small callback approach to get updated user
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
                { credentials: 'include' }
            );

            if (res.ok) {
                const data = await res.json();
                const role = data?.user?.role;

                // ✅ Redirect based on role — same as regular login
                if (role === 'super_admin') {
                    router.replace('/auth/superadmindashboard');
                } else if (role === 'nursery_admin') {
                    router.replace('/auth/nurserydashboard');
                } else {
                    router.replace('/auth/userdashboard'); // ✅ regular user goes here
                }
            } else {
                // Fallback if /auth/me fails
                router.replace('/');
            }
        }
        handleCallback();

    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <svg
                    className="animate-spin w-10 h-10 text-green-500 mx-auto mb-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12" cy="12" r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                    />
                </svg>
                <p className="text-gray-600 font-medium">Completing sign-in...</p>
                <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
            </div>
        </div>
    );
}

export default function OAuthCallbackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading...</p>
            </div>
        </div>}>
            <OAuthCallbackContent />
        </Suspense>
    );
}