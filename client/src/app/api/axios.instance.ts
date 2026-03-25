import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8500';

interface FailedQueueItem {
    resolve: (token: string) => void;
    reject: (error: AxiosError) => void;
}

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: AxiosError | null, token: string | null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else if (token) prom.resolve(token);
    });
    failedQueue = [];
};

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});


// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        // ✅ Debugging জন্য console.log
        console.log('Request Interceptor - Token:', token);
        console.log('Request URL:', config.url);

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

//  FIXED RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // If token expired (401 error)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                            }
                            resolve(axiosInstance(originalRequest));
                        },
                        reject,
                    });
                });
            }

            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");

                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                // ✅ Refresh token request
                const res = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });

                // ✅ Get both tokens from response
                const newAccessToken = res.data.data.accessToken;
                const newRefreshToken = res.data.data.refreshToken;

                // ✅ Store BOTH new tokens
                localStorage.setItem("accessToken", newAccessToken);
                localStorage.setItem("refreshToken", newRefreshToken);
                sessionStorage.setItem("accessToken", newAccessToken);
                sessionStorage.setItem("refreshToken", newRefreshToken);

                processQueue(null, newAccessToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }

                return axiosInstance(originalRequest);
            }  catch (refreshError: unknown) {
                console.error('❌ Token refresh failed:', refreshError);
                
                if (refreshError instanceof AxiosError) {
                    processQueue(refreshError, null);
                } else if (refreshError instanceof Error) {
                    processQueue(new AxiosError(refreshError.message), null);
                } else {
                    processQueue(new AxiosError('Refresh failed'), null);
                }

                // ✅ Clear tokens
                if (typeof window !== 'undefined') {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("userRole");
                    localStorage.removeItem("userData");
                    localStorage.removeItem("greenmet-auth");
                    
                    sessionStorage.removeItem("accessToken");
                    sessionStorage.removeItem("refreshToken");
                    sessionStorage.removeItem("userRole");
                    sessionStorage.removeItem("userData");
                }

                // Redirect to login if not already there
                if (typeof window !== 'undefined' && window.location.pathname !== '/auth/signin') {
                    window.location.href = '/auth/signin';
                }

                if (refreshError instanceof AxiosError) {
                    return Promise.reject(refreshError);
                } else if (refreshError instanceof Error) {
                    return Promise.reject(new AxiosError(refreshError.message));
                } else {
                    return Promise.reject(new AxiosError('Refresh failed'));
                }
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
