import axios from "axios";
import axiosInstance from "./axios.instance";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8500';

export const getAllPlants = async () => {
    try {
        const res = await axios.get(`${API_URL}/plant/user-plant`);
        if (res.data && res.data.success) {
            return res.data.data; // Return the actual movies array
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to fetch movies');
        }
        throw new Error('Failed to fetch movies');
        // throw new Error('Movies endpoint not found. Please check the API route.');
    }
}