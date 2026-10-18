import axios, { AxiosError } from "axios";
import axiosInstance from "./axios.instance";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8500';

export interface CartItemResponse {
    _id: string;
    userId: string;
    plantId: string;
    quantity: number;
    plant: string;
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiResponse<unknown>>;
        return axiosError.response?.data?.message || axiosError.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return "An unexpected error occurred";
};

export const addToCart = async (plantId: string, quantity: number = 1): Promise<CartItemResponse | null> => {
    try {
        const res = await axiosInstance.post<ApiResponse<CartItemResponse>>(`/plant/addcart`, { plantId, quantity });

        return res.data.data ?? null;

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to fetch movies');
        }
        //console.error("Failed to add to cart:", getErrorMessage(error));
        throw new Error('Failed to add to cart');

    }
};

export const getCart = async (): Promise<CartItemResponse[]> => {
    try {
        const res = await axiosInstance.get<ApiResponse<CartItemResponse[]>>(`/cart/my-cart`);

        return res.data.data ?? [];

    } catch (error: unknown) {
        //console.error("Failed to fetch cart:", getErrorMessage(error));
        throw error;
    }
};

// export const getCartById = async (userId: string): Promise<CartItemResponse[]> => {
//     try {
//         const res = await axiosInstance.get<ApiResponse<CartItemResponse[]>>(`/cart/get/${userId}`);

//         return res.data.data ?? [];

//     } catch (error: unknown) {
//         //console.error("Failed to fetch cart:", getErrorMessage(error));
//         throw error;
//     }
// };

export const updateCartItem = async (plantId: string, quantity: number): Promise<CartItemResponse | null> => {
    try {
        const res = await axiosInstance.patch<ApiResponse<CartItemResponse>>(`/cart/update/${plantId}`, { quantity });

        return res.data.data ?? null;

    } catch (error: unknown) {
        // console.error("Failed to update cart item:", getErrorMessage(error));
        throw error;
    }
};

export const removeFromCart = async (plantId: string): Promise<boolean> => {
    try {
        const res = await axiosInstance.delete<ApiResponse<null>>(`/cart/remove/${plantId}`);

        return res.data.success;

    } catch (error: unknown) {
        // console.error("Failed to remove cart item:", getErrorMessage(error));
        throw error;
    }
};

// Wishlist iems

export const addTowishlist = async (plantId: string, quantity: number = 1): Promise<CartItemResponse | null> => {
    try {
        const res = await axiosInstance.post<ApiResponse<CartItemResponse>>(`/wishlist/add`, { plantId, quantity });

        return res.data.data ?? null;

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            // throw new Error(error.response?.data?.message || 'Failed to fetch movies');
            console.log('Failed to fetch wishlist')
        }
        //console.error("Failed to add to cart:", getErrorMessage(error));
        throw error;

    }
};

export const RemoveWhishlist = async (plantId: string): Promise<boolean> => {
    try {
        const res = await axiosInstance.delete<ApiResponse<CartItemResponse>>(`/wishlist/remove/${plantId}`);
        return res.data.success ?? false;

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log('Failed to remove from wishlist')
            // throw new Error(error.response?.data?.message || 'Failed to remove from wishlist');
        }
        throw error;
    }
}

export const getWishlist = async (): Promise<{ plantId: string }[]> => {
    try {
        const res = await axiosInstance.get<ApiResponse<{ plantId: string }[]>>(`/wishlist/get`);
        return res.data.data ?? [];

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log('Failed to fetch wishlist')
            // throw new Error(error.response?.data?.message || 'Failed to fetch wishlist');
        }
        throw error;
    }
};