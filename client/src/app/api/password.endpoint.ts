import axios from "axios";
import axiosInstance from "./axios.instance";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8500';

export const forgotpassword = async (email: string, userId: string) => {
    try {
        const res = await axiosInstance.post(`${API_URL}/auth/forgot-password`,
            { email, userId },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        return res.data

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Failed to send OTP';
            console.log(errorMessage)
            throw new Error(errorMessage);
        }
        throw new Error('Network error occurred');
    }
}

export const resetPassword = async (formData: {userId: string, newPassword: string, confirmPassword: string }) => {
    try {
        const res = await axios.post(`${API_URL}/auth/reset-password`, formData, {
            // withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        })
        console.log('✅ Reset password response:', res.data);

        return res.data;

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log('Reset password error:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Failed to reset password');
        }
        throw new Error('Network error occurred');
    }
}
