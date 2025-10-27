import { apiService } from './api';
import { User, LoginForm, AuthState } from '../types';

export interface AuthService {
  login(credentials: LoginForm): Promise<{ user: User; token: string }>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User>;
  refreshToken(): Promise<string>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
}

export class AuthServiceImpl implements AuthService {
  async login(credentials: LoginForm): Promise<{ user: User; token: string }> {
    const response = await apiService.post<{ user: User; token: string }>('/auth/login', credentials);
    
    if (response.success) {
      const { user, token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set token in API service
      apiService.setAuthToken(token);
      
      return { user, token };
    }
    
    throw new Error(response.message || 'Login failed');
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      // Remove token from API service
      apiService.removeAuthToken();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/auth/me');
    
    if (response.success) {
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get current user');
  }

  async refreshToken(): Promise<string> {
    const response = await apiService.post<{ token: string }>('/auth/refresh');
    
    if (response.success) {
      const { token } = response.data;
      
      // Update stored token
      localStorage.setItem('auth_token', token);
      apiService.setAuthToken(token);
      
      return token;
    }
    
    throw new Error(response.message || 'Token refresh failed');
  }

  async forgotPassword(email: string): Promise<void> {
    const response = await apiService.post('/auth/forgot-password', { email });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to send password reset email');
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const response = await apiService.post('/auth/reset-password', { token, password });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to reset password');
    }
  }
}

// Create auth service instance
export const authService = new AuthServiceImpl();

// Helper functions for auth state management
export const getStoredAuthState = (): AuthState => {
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('user');
  
  return {
    user: userStr ? JSON.parse(userStr) : null,
    token,
    isAuthenticated: !!token,
    isLoading: false,
  };
};

export const clearStoredAuthState = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};
