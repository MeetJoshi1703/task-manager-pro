import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
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
// Use Vite environment variable or fallback to localhost for development
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Get auth token from store or localStorage
    const { currentUser } = useBoardStore.getState();
    const token = localStorage.getItem('authToken'); // Or use currentUser?.token if stored in user object

    // Add Authorization header if token exists
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return only the data portion of the response for successful requests
    return response.data;
  },
  (error: AxiosError<ApiError>) => {
    // Handle API errors in a standardized way
    const apiError: ApiError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      statusCode: error.response?.status,
      errors: error.response?.data?.errors,
    };

    // Handle specific HTTP status codes
    switch (error.response?.status) {
      case 401: // Unauthorized
        // Clear auth data and redirect to login
        useBoardStore.getState().logout();
        localStorage.removeItem('authToken');
        window.location.href = '/';
        break;

      case 403: // Forbidden
        apiError.message = 'Access denied';
        break;

      case 404: // Not Found
        apiError.message = 'Resource not found';
        break;

      case 500: // Server Error
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
  config: AxiosRequestConfig
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