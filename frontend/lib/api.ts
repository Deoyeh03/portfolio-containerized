import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// Create generic instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-backend-e5yd.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to attach token
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
