import axios from "axios";
import axiosInstance from "./axios.instance";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8500';

export const signup = async (formData: FormData) => {
    try {
        console.log('🔵 Sending signup request to:', `${API_URL}/auth/signup`);

        const res = await axios.post(`${API_URL}/auth/signup`, formData, {
            headers: { "Content-Type": "multipart/form-data" },

        })
        console.log('✅ Signup response:', res.data);

        return res.data;

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log('Signup error:', error.response?.data);
            console.error('Signup error:', error.response?.data);
        }

    }
}

export const login = async (formData: { email: string, password: string }) => {
    try {
        const res = await axios.post(`${API_URL}/auth/signin`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        })
        console.log('✅ Login response:', res.data);
        return res.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log('email and password is incorrect', error.response?.data);
        }

    }
}

export const verifyOtp = async (data: { userId: string, otp: string, type?: string }) => {
    try {
        console.log('Sending verify OTP request:', data);

        const response = await axios.post(`${API_URL}/auth/verify-otp`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Verify OTP response:', response.data);
        return response.data;

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log('Verify OTP API error:', error.response?.data);
            throw new Error(error.response?.data?.message || 'OTP verification failed');

        }
        throw new Error('Network error occurred');
    }
}

// Resend OTP function - FIXED
export const resendOtp = async (userId: string) => {
    try {
        console.log('🔄 Sending resend OTP request for user:', userId);

        const response = await axios.post(`${API_URL}/auth/resend-otp`,
            { userId },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        console.log('Resend OTP response:', response.data);
        return response.data;

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log('Resend OTP API error:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Failed to resend OTP');
        }
        throw new Error('Network error occurred');
    }
}

export const logout = async (role: string) => {
    try {
        const res = await axiosInstance.post(`${API_URL}/${role}/auth/logout`, {},
            {
                withCredentials: true
            }
        );
        window.location.href = '/'
        return res.data;

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Logout failed';
            console.log(errorMessage)
        }

    }
}

