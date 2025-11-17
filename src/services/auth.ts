import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';
import { User } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirmation: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  companyId?: string;
  role?: string;
  skills?: string[];
  team?: string;
  region?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  token_type: string;
  expires_in: number;
  company?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Create axios instance for auth API calls
const authClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout for file uploads
  headers: {
    Accept: 'application/json',
  },
});

// Request interceptor to add auth token
authClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If FormData, remove Content-Type header to let axios set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Flag to prevent infinite refresh loops
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// Function to subscribe to token refresh
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// Function to notify all subscribers when token is refreshed
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

// Response interceptor for error handling with token refresh
authClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - try to refresh token first
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for auth endpoints (login, register, refresh, etc.)
      const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                            originalRequest.url?.includes('/auth/register') ||
                            originalRequest.url?.includes('/auth/forgot-password') ||
                            originalRequest.url?.includes('/auth/reset-password') ||
                            originalRequest.url?.includes('/auth/refresh');
      
      // If it's an auth endpoint or refresh endpoint, just logout
      if (isAuthEndpoint) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth-storage');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      // If already refreshing, wait for the refresh to complete
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(authClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const refreshResult = await authService.refreshToken();
        
        if (refreshResult && refreshResult.token) {
          isRefreshing = false;
          // Notify all waiting requests
          onTokenRefreshed(refreshResult.token);
          
          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${refreshResult.token}`;
          // Retry the original request
          return authClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        isRefreshing = false;
        refreshSubscribers = [];
        // Fall through to logout
      }

      // If refresh failed, logout
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth-storage');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await authClient.post<{ success: boolean; data: AuthResponse; message?: string }>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    
    if (response.data.success && response.data.data) {
      // Store token
      this.setToken(response.data.data.token);
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Registration failed');
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await authClient.post<{ success: boolean; data: AuthResponse; message?: string }>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    if (response.data.success && response.data.data) {
      // Store token
      this.setToken(response.data.data.token);
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Login failed');
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await authClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear token regardless of API call result
      this.removeToken();
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await authClient.get<{ success: boolean; data: User; message?: string }>(
      API_ENDPOINTS.AUTH.ME
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to get user');
  }

  /**
   * Refresh authentication token
   * Note: This should NOT go through the interceptor to avoid infinite loops
   */
  async refreshToken(): Promise<{ token: string; expires_in?: number } | null> {
    try {
      // Use a direct axios call without interceptors to avoid infinite loop
      const token = this.getToken();
      if (!token) {
        throw new Error('No token to refresh');
      }

      const response = await axios.post<{ success: boolean; data: { token: string; expires_in: number }; message?: string }>(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      
      if (response.data.success && response.data.data) {
        this.setToken(response.data.data.token);
        return {
          token: response.data.data.token,
          expires_in: response.data.data.expires_in,
        };
      }
      
      throw new Error(response.data.message || 'Token refresh failed');
    } catch (error: any) {
      // If refresh fails with 401, the token is invalid - return null
      if (error.response?.status === 401) {
        console.warn('Token refresh failed: Invalid or expired token');
        return null;
      }
      throw error;
    }
  }

  /**
   * Request password reset
   */
  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    const response = await authClient.post<{ success: boolean; message?: string }>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to send password reset email');
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordData): Promise<void> {
    const response = await authClient.post<{ success: boolean; message?: string }>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Password reset failed');
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: FormData): Promise<User> {
    // Laravel requires POST for file uploads, use _method=PUT for method spoofing
    data.append('_method', 'PUT');
    
    const response = await authClient.post<{ success: boolean; data: User; message?: string }>(
      API_ENDPOINTS.AUTH.PROFILE,
      data,
      {
        headers: {
          // Don't set Content-Type - let axios set it automatically with boundary
        },
      }
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Profile update failed');
  }

  /**
   * Remove user avatar
   */
  async removeAvatar(): Promise<User> {
    const response = await authClient.delete<{ success: boolean; data: User; message?: string }>(
      API_ENDPOINTS.AUTH.AVATAR
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Avatar removal failed');
  }

  /**
   * Change password
   */
  async changePassword(data: { currentPassword: string; newPassword: string; newPassword_confirmation: string }): Promise<void> {
    const response = await authClient.put<{ success: boolean; message?: string }>(
      API_ENDPOINTS.AUTH.PASSWORD,
      data
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Password change failed');
    }
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Remove authentication token
   */
  removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();

