import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '@/config/api';
import { User } from '@/types';

const getAuthToken = (): string | null => localStorage.getItem('auth_token');

const usersClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

usersClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

usersClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface UserFilters {
  role?: string;
  search?: string;
}

export const UserService = {
  async getAll(filters?: UserFilters): Promise<User[]> {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.search) params.append('search', filters.search);

    const response = await usersClient.get(`/users${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data?.data || [];
  },

  async getTechnicians(): Promise<User[]> {
    return this.getAll({ role: 'technician' });
  },
};


