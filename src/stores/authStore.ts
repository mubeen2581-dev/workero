import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@/types';
import { authService, AuthResponse } from '@/services/auth';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    password_confirmation: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    companyId?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  tokenExpiresAt: number | null;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      tokenExpiresAt: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const response: AuthResponse = await authService.login({ email, password });
          
          // Map backend user format to frontend User type
          const user: User = {
            id: response.user.id,
            email: response.user.email,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            role: response.user.role,
            avatar: response.user.avatar,
            skills: response.user.skills,
            team: response.user.team,
            region: response.user.region,
            isActive: response.user.isActive,
            createdAt: response.user.createdAt,
            lastLoginAt: response.user.lastLoginAt,
          };

          // Calculate token expiration time (default: 60 minutes from now)
          const expiresIn = response.expires_in || 3600; // Default to 1 hour
          const expiresAt = Date.now() + (expiresIn * 1000);

          set({
            user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            tokenExpiresAt: expiresAt,
          });
        } catch (error: any) {
          set({ isLoading: false });
          // Re-throw with user-friendly message
          const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
          throw new Error(errorMessage);
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        
        try {
          const response: AuthResponse = await authService.register({
            email: data.email,
            password: data.password,
            password_confirmation: data.password_confirmation,
            firstName: data.firstName,
            lastName: data.lastName,
            companyName: data.companyName,
            companyId: data.companyId,
          });
          
          // Map backend user format to frontend User type
          const user: User = {
            id: response.user.id,
            email: response.user.email,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            role: response.user.role,
            avatar: response.user.avatar,
            skills: response.user.skills,
            team: response.user.team,
            region: response.user.region,
            isActive: response.user.isActive,
            createdAt: response.user.createdAt,
            lastLoginAt: response.user.lastLoginAt,
          };

          // Calculate token expiration time (default: 60 minutes from now)
          const expiresIn = response.expires_in || 3600; // Default to 1 hour
          const expiresAt = Date.now() + (expiresIn * 1000);

          set({
            user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            tokenExpiresAt: expiresAt,
          });
        } catch (error: any) {
          set({ isLoading: false });
          const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
          throw new Error(errorMessage);
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear all auth state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            tokenExpiresAt: null,
          });
          
          // Clear persisted storage
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth-storage');
          
          // Redirect to login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      },

      refreshUser: async () => {
        try {
          const user = await authService.getCurrentUser();
          set({ 
            user,
            isAuthenticated: true, // Ensure authenticated state is set
          });
        } catch (error) {
          console.error('Failed to refresh user:', error);
          // If refresh fails, user might be logged out
          get().logout();
        }
      },

      refreshToken: async () => {
        try {
          const refreshResult = await authService.refreshToken();
          if (refreshResult && refreshResult.token) {
            // Get expires_in from the response if available, default to 1 hour
            const expiresIn = refreshResult.expires_in || 3600; // Default to 1 hour (3600 seconds)
            const expiresAt = Date.now() + (expiresIn * 1000);
            
            set({
              token: refreshResult.token,
              isAuthenticated: true,
              tokenExpiresAt: expiresAt,
            });
            
            return refreshResult.token;
          }
          return null;
        } catch (error) {
          console.error('Token refresh failed:', error);
          // If refresh fails, logout user
          get().logout();
          return null;
        }
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          // Create a new object to ensure React detects the change
          const updatedUser: User = { 
            ...currentUser, 
            ...userData 
          } as User;
          set({
            user: updatedUser,
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        tokenExpiresAt: state.tokenExpiresAt,
      }),
    }
  )
);
