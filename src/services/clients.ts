import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '@/config/api';
import { Client } from '@/types';

// Create axios instance with auth interceptor
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const clientsClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
clientsClient.interceptors.request.use(
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

// Handle token refresh on 401
clientsClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface ClientFilters {
  search?: string;
  tags?: string | string[];
  minLeadScore?: number;
  maxLeadScore?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
  };
  tags?: string[];
  lead_score?: number;
}

export interface UpdateClientRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
  };
  tags?: string[];
  lead_score?: number;
}

export const ClientService = {
  /**
   * Get all clients with optional filters
   */
  async getAll(filters?: ClientFilters): Promise<{ data: Client[]; meta?: any }> {
    const response = await clientsClient.get('/clients', { params: filters });
    return response.data;
  },

  /**
   * Get a single client by ID
   */
  async getById(id: string): Promise<{ data: Client }> {
    const response = await clientsClient.get(`/clients/${id}`);
    return response.data;
  },

  /**
   * Create a new client
   */
  async create(data: CreateClientRequest): Promise<{ data: Client }> {
    const response = await clientsClient.post('/clients', data);
    return response.data;
  },

  /**
   * Update a client
   */
  async update(id: string, data: UpdateClientRequest): Promise<{ data: Client }> {
    const response = await clientsClient.put(`/clients/${id}`, data);
    return response.data;
  },

  /**
   * Delete a client
   */
  async delete(id: string): Promise<void> {
    await clientsClient.delete(`/clients/${id}`);
  },
};

