import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '@/config/api';
import { Invoice, InvoiceItem, Client, Job } from '@/types';

// Create axios instance with auth interceptor
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const invoicesClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
invoicesClient.interceptors.request.use(
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
invoicesClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface InvoiceFilters {
  search?: string;
  status?: string;
  client_id?: string;
  job_id?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface CreateInvoiceRequest {
  client_id: string;
  job_id?: string;
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate?: number;
  }>;
  due_date: string;
  currency?: string;
  notes?: string;
}

export interface UpdateInvoiceRequest {
  items?: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate?: number;
  }>;
  due_date?: string;
  currency?: string;
  notes?: string;
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
}

export interface PayInvoiceRequest {
  payment_method: 'cash' | 'card' | 'bank_transfer' | 'xe_pay';
  amount: number;
  reference?: string;
}

export interface GenerateFromJobRequest {
  due_date: string;
  notes?: string;
}

export const InvoiceService = {
  /**
   * Get all invoices with optional filters
   */
  async getAll(filters?: InvoiceFilters): Promise<{ data: Invoice[]; pagination?: any }> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.client_id) params.append('client_id', filters.client_id);
    if (filters?.job_id) params.append('job_id', filters.job_id);
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.sort_direction) params.append('sort_direction', filters.sort_direction);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());

    const response = await invoicesClient.get('/invoices', { params });
    return response.data;
  },

  /**
   * Get a single invoice by ID
   */
  async getById(id: string): Promise<{ data: Invoice }> {
    const response = await invoicesClient.get(`/invoices/${id}`);
    return response.data;
  },

  /**
   * Create a new invoice
   */
  async create(data: CreateInvoiceRequest): Promise<{ data: Invoice }> {
    const response = await invoicesClient.post('/invoices', data);
    return response.data;
  },

  /**
   * Update an existing invoice
   */
  async update(id: string, data: UpdateInvoiceRequest): Promise<{ data: Invoice }> {
    const response = await invoicesClient.put(`/invoices/${id}`, data);
    return response.data;
  },

  /**
   * Delete an invoice
   */
  async delete(id: string): Promise<void> {
    await invoicesClient.delete(`/invoices/${id}`);
  },

  /**
   * Send an invoice
   */
  async send(id: string): Promise<{ data: Invoice }> {
    const response = await invoicesClient.post(`/invoices/${id}/send`);
    return response.data;
  },

  /**
   * Pay an invoice
   */
  async pay(id: string, data: PayInvoiceRequest): Promise<{ data: Invoice }> {
    const response = await invoicesClient.post(`/invoices/${id}/pay`, data);
    return response.data;
  },

  /**
   * Generate invoice from job
   */
  async generateFromJob(jobId: string, data: GenerateFromJobRequest): Promise<{ data: Invoice }> {
    const response = await invoicesClient.post(`/invoices/generate-from-job/${jobId}`, data);
    return response.data;
  },

  /**
   * Download invoice PDF
   */
  async downloadPdf(id: string): Promise<Blob> {
    const response = await invoicesClient.get(`/invoices/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

