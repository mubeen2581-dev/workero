import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '@/config/api';

const getAuthToken = (): string | null => localStorage.getItem('auth_token');

const calendarClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

calendarClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

calendarClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface CalendarSyncResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface CalendarSyncStatus {
  connected: boolean;
  connection?: {
    id: string;
    google_email: string;
    calendar_id: string;
    last_sync_at: string | null;
    last_sync_status: string | null;
    is_token_valid: boolean;
  };
}

export interface SyncPushResult {
  created: number;
  updated: number;
  errors: Array<{
    event_id?: string;
    error: string;
  }>;
}

export interface SyncPullResult {
  pulled: number;
  conflicts: number;
  skipped: number;
  conflict_details: any[];
}

export const CalendarSyncService = {
  /**
   * Get OAuth authorization URL and redirect user to Google
   */
  async connect(): Promise<CalendarSyncResult> {
    try {
      const response = await calendarClient.get('/calendar/connect');
      const authUrl = response.data?.data?.auth_url;

      if (authUrl) {
        // Redirect to Google OAuth
        window.location.href = authUrl;
        return { success: true, message: 'Redirecting to Google...' };
      }

      return { success: false, message: 'Failed to get authorization URL' };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to connect to Google Calendar',
      };
    }
  },

  /**
   * Get connection status
   */
  async getStatus(): Promise<CalendarSyncStatus> {
    try {
      const response = await calendarClient.get('/calendar/status');
      return response.data?.data || { connected: false };
    } catch (error: any) {
      return { connected: false };
    }
  },

  /**
   * Push Workero events to Google Calendar
   */
  async syncPush(params?: {
    start?: string;
    end?: string;
    event_ids?: string[];
  }): Promise<CalendarSyncResult & { data?: SyncPushResult }> {
    try {
      const response = await calendarClient.post('/calendar/sync/push', params || {});
      const data = response.data?.data;

      return {
        success: true,
        message: `Synced ${data?.created || 0} new and ${data?.updated || 0} updated events to Google Calendar`,
        data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to sync events to Google Calendar',
      };
    }
  },

  /**
   * Pull events from Google Calendar
   */
  async syncPull(params?: {
    start?: string;
    end?: string;
  }): Promise<CalendarSyncResult & { data?: SyncPullResult }> {
    try {
      const response = await calendarClient.post('/calendar/sync/pull', params || {});
      const data = response.data?.data;

      let message = `Pulled ${data?.pulled || 0} events from Google Calendar`;
      if (data?.conflicts && data.conflicts > 0) {
        message += ` (${data.conflicts} conflicts detected)`;
      }

      return {
        success: true,
        message,
        data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to pull events from Google Calendar',
      };
    }
  },

  /**
   * Disconnect Google Calendar
   */
  async disconnect(): Promise<CalendarSyncResult> {
    try {
      await calendarClient.post('/calendar/disconnect');
      return { success: true, message: 'Google Calendar disconnected successfully' };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to disconnect Google Calendar',
      };
    }
  },
};
