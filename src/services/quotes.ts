import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '@/config/api';
import { Quote, QuoteItem, Client } from '@/types';

// Create axios instance with auth interceptor
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const quotesClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
quotesClient.interceptors.request.use(
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
quotesClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface QuoteFilters {
  search?: string;
  status?: string;
  client_id?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateQuoteRequest {
  client_id: string;
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate?: number;
  }>;
  valid_until: string;
  notes?: string;
  profit_margin?: number;
}

export interface UpdateQuoteRequest {
  items?: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate?: number;
  }>;
  valid_until?: string;
  notes?: string;
  profit_margin?: number;
  status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
}

export interface ConvertQuoteToJobRequest {
  scheduled_date: string;
  assigned_technician?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  estimated_duration?: number;
  location?: Record<string, any>;
  notes?: string;
}

export const QuoteService = {
  /**
   * Get all quotes with optional filters
   */
  async getAll(filters?: QuoteFilters): Promise<{ data: Quote[]; meta?: any }> {
    const response = await quotesClient.get('/quotes', { params: filters });
    return response.data;
  },

  /**
   * Get a single quote by ID
   */
  async getById(id: string): Promise<{ data: Quote }> {
    const response = await quotesClient.get(`/quotes/${id}`);
    return response.data;
  },

  /**
   * Create a new quote
   */
  async create(data: CreateQuoteRequest): Promise<{ data: Quote }> {
    const response = await quotesClient.post('/quotes', data);
    return response.data;
  },

  /**
   * Update a quote
   */
  async update(id: string, data: UpdateQuoteRequest): Promise<{ data: Quote }> {
    const response = await quotesClient.put(`/quotes/${id}`, data);
    return response.data;
  },

  /**
   * Delete a quote
   */
  async delete(id: string): Promise<void> {
    await quotesClient.delete(`/quotes/${id}`);
  },

  /**
   * Send a quote to client
   */
  async send(id: string): Promise<{ data: Quote }> {
    const response = await quotesClient.post(`/quotes/${id}/send`);
    return response.data;
  },

  /**
   * Accept a quote
   */
  async accept(id: string): Promise<{ data: Quote }> {
    const response = await quotesClient.post(`/quotes/${id}/accept`);
    return response.data;
  },

  /**
   * Reject a quote
   */
  async reject(id: string): Promise<{ data: Quote }> {
    const response = await quotesClient.post(`/quotes/${id}/reject`);
    return response.data;
  },

  /**
   * Convert quote to job
   */
  async convertToJob(id: string, data: ConvertQuoteToJobRequest): Promise<{ data: any }> {
    const response = await quotesClient.post(`/quotes/${id}/convert-to-job`, data);
    return response.data;
  },

  /**
   * Download quote as PDF
   */
  async downloadPdf(id: string): Promise<Blob> {
    const response = await quotesClient.get(`/quotes/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

