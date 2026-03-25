'use client';

import {
    createContext, useContext, useState,
    useEffect, useCallback, ReactNode
} from 'react';

export interface AuthUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string | null;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (userData: AuthUser) => void;   // called after regular login
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;        // called after OAuth redirect
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // ✅ Runs on every page load — reads HTTP-only cookie via /auth/me
    // This handles BOTH regular login (cookie set by backend) and
    // OAuth login (cookie set by passport callback)
    const checkAuth = useCallback(async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
                {
                    method: 'GET',
                    credentials: 'include'
                } // ✅ sends cookie automatically
            );
            if (res.ok) {
                const data = await res.json();
                setUser(data.user ?? null);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // ✅ Called right after regular login response — instant Navbar update
    const login = useCallback((userData: AuthUser) => {
        setUser(userData);
    }, []);

    // ✅ Clears cookie on backend + wipes context state
    const logout = useCallback(async () => {
        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/oauth/logout`,
                { method: 'POST', credentials: 'include' }
            );
        } catch {
            // proceed with local logout even if request fails
        } finally {
            setUser(null);
            // ✅ Clean up any old localStorage remnants
          const keys=  ['accessToken', 'refreshToken', 'userData',
                'UserId', 'userRole', 'greenmet-auth', 'authMethod'];
                keys.forEach(k => {
                    localStorage.removeItem(k);
                    sessionStorage.removeItem(k);
                });
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn: !!user,
            isLoading,
            login,
            logout,
            checkAuth,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// HOOK //
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}