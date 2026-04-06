import Axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});

// Request Interceptor
axios.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Using Bearer token as specified
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (!error.response) {
            // Network Error
            useToastStore.getState().addToast({
                title: 'Erreur réseau',
                message: 'Impossible de contacter le serveur.',
                type: 'error'
            });
            return Promise.reject({ networkError: true, message: 'Network Error' });
        }

        const { status, data } = error.response;

        if (status === 401) {
            // Auto logout
            useAuthStore.getState().logout();
            
            // Note: In Next.js App Router, window.location.href works but breaks SPA feeling.
            // However, inside an interceptor outside components, this is the most reliable fallback.
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                // Determine language prefix from current path if possible
                const pathParts = window.location.pathname.split('/');
                const lang = pathParts[1] && ['fr', 'ar', 'en'].includes(pathParts[1]) ? `/${pathParts[1]}` : '/fr';
                window.location.href = `${lang}/login`; 
            }
        } else if (status === 422) {
            // Validation errors formatter
            const formattedErrors = {};
            if (data.errors) {
                Object.keys(data.errors).forEach(key => {
                    formattedErrors[key] = data.errors[key][0]; // Take first error message per field
                });
            }
            return Promise.reject({ status: 422, errors: formattedErrors, original: data.errors });
        } else if (status >= 500) {
            useToastStore.getState().addToast({
                title: 'Erreur serveur',
                message: 'Une erreur interne est survenue.',
                type: 'error'
            });
        }

        return Promise.reject(error);
    }
);

export default axios;
