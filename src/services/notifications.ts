import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '@/config/api';

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const notificationsClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

notificationsClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

notificationsClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface Notification {
  id: string;
  company_id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  data?: any;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface NotificationFilters {
  is_read?: boolean;
  type?: string;
  page?: number;
  limit?: number;
}

export const NotificationService = {
  /**
   * Get all notifications
   */
  async getAll(filters?: NotificationFilters): Promise<{ data: Notification[]; meta?: any }> {
    const response = await notificationsClient.get('/notifications', { params: filters });
    return response.data;
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<{ data: { count: number } }> {
    const response = await notificationsClient.get('/notifications/unread-count');
    return response.data;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<{ data: Notification }> {
    const response = await notificationsClient.put(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ data: { updated_count: number } }> {
    const response = await notificationsClient.put('/notifications/mark-all-read');
    return response.data;
  },

  /**
   * Delete notification
   */
  async delete(id: string): Promise<void> {
    await notificationsClient.delete(`/notifications/${id}`);
  },
};

