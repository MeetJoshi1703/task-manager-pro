import axios from 'axios';


import { useBoardStore } from '../store/boardStore';

// Define a generic API response interface
interface ApiResponse<T> {
  data: T;
  status: string;
  message?: string;
}

// Define a custom API error interface
interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string>;
}

// Configure the base URL for the API
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      statusCode: error.response?.status,
      errors: error.response?.data?.errors,
    };

    switch (error.response?.status) {
      case 401:
        useBoardStore.getState().logout();
        localStorage.removeItem('authToken');
        window.location.href = '/';
        break;
      case 403:
        apiError.message = 'Access denied';
        break;
      case 404:
        apiError.message = 'Resource not found';
        break;
      case 500:
        apiError.message = 'Server error occurred';
        break;
      default:
        break;
    }

    return Promise.reject(apiError);
  }
);

// Generic API request function
export const apiRequest = async <T>(
  config: any // Temporarily use 'any' to bypass type issues; replace with proper type later
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.request<ApiResponse<T>>(config);
    return response;
  } catch (error) {
    throw error;
  }
};

// Helper methods for common HTTP operations
export const get = <T>(url: string, params?: any) =>
  apiRequest<T>({ method: 'GET', url, params });

export const post = <T>(url: string, data?: any) =>
  apiRequest<T>({ method: 'POST', url, data });

export const put = <T>(url: string, data?: any) =>
  apiRequest<T>({ method: 'PUT', url, data });

export const patch = <T>(url: string, data?: any) =>
  apiRequest<T>({ method: 'PATCH', url, data });

export const del = <T>(url: string) =>
  apiRequest<T>({ method: 'DELETE', url });

// Export types for use in other parts of the app
export type { ApiResponse, ApiError };

// Export the Axios instance for direct use if needed
export default apiClient;