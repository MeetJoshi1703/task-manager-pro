import { post, get } from '../utils/api';
import type { AuthUser } from '../types/types';

interface AuthResponse {
  message: string;
  user: AuthUser;
  access_token: string;
  refresh_token: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    console.log('[authService.login] Attempting login for:', email);
    try {
      const response = await post<AuthResponse>('/auth/signin', { email, password });
      console.log('[authService.login] Login successful:', {
        userId: response.user.id,
        email: response.user.email,
      });
      return response;
    } catch (error: any) {
      console.error('[authService.login] Login failed:', {
        message: error.message,
        status: error.statusCode,
      });
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    }
  },

  signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    console.log('[authService.signup] Attempting signup for:', email);
    try {
      const response = await post<AuthResponse>('/auth/signup', { name, email, password });
      console.log('[authService.signup] Signup successful:', {
        userId: response.user.id,
        email: response.user.email,
      });
      return response;
    } catch (error: any) {
      console.error('[authService.signup] Signup failed:', {
        message: error.message,
        status: error.statusCode,
      });
      const errorMessage =
        error.statusCode === 409
          ? 'Email already exists'
          : error.statusCode === 400
          ? 'Invalid input data'
          : 'Failed to create account';
      throw new Error(errorMessage);
    }
  },

  getCurrentUser: async (): Promise<AuthUser> => {
    console.log('[authService.getCurrentUser] Fetching current user');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('[authService.getCurrentUser] No auth token found');
        throw new Error('No authentication token found');
      }

      const response = await get<AuthUser>('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[authService.getCurrentUser] Fetched user:', {
        userId: response.id,
        email: response.email,
      });
      return response;
    } catch (error: any) {
      console.error('[authService.getCurrentUser] Failed to fetch user:', {
        message: error.message,
        status: error.statusCode,
      });
      throw new Error(error.message || 'Failed to fetch user data');
    }
  },
};