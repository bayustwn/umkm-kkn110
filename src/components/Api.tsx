import axios from "axios";
import Cookies from "js-cookie";

const Api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
})

// Add request interceptor to automatically include authorization header
Api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration
Api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, remove from cookies and redirect to login
            Cookies.remove('token');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

export default Api;