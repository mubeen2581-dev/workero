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
    group_name?: string | null;
    sort_order?: number;
    option_type?: 'good' | 'better' | 'best' | 'optional' | 'required' | null;
    material_choice_id?: string | null;
    material_options?: any[];
    is_optional?: boolean;
    category?: string | null;
  }>;
  valid_until: string;
  notes?: string;
  profit_margin?: number;
  requires_esignature?: boolean;
  package_type?: 'basic' | 'standard' | 'premium' | null;
  variants?: Record<string, any>;
  deposit_amount?: number;
  deposit_percentage?: number;
  payment_schedule?: Array<any>;
  permit_costs?: Array<any>;
  total_permit_cost?: number;
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

  /**
   * Sign quote with e-signature
   */
  async sign(id: string, signatureData: string, signatureType: string = 'electronic'): Promise<{ data: Quote }> {
    const response = await quotesClient.post(`/quotes/${id}/sign`, {
      signature_data: signatureData,
      signature_type: signatureType,
    });
    return response.data;
  },

  /**
   * Decline quote
   */
  async decline(id: string): Promise<{ data: Quote }> {
    const response = await quotesClient.post(`/quotes/${id}/decline`);
    return response.data;
  },

  /**
   * Generate contract from quote
   */
  async generateContract(id: string): Promise<{ data: Quote }> {
    const response = await quotesClient.post(`/quotes/${id}/generate-contract`);
    return response.data;
  },

  /**
   * Generate AI quote suggestions
   */
  async generateAISuggestions(description: string, smartPricing: boolean = true, useGroq: boolean = true, useXEAIService: boolean = false): Promise<{ data: { suggestions: any[], count: number, source: string } }> {
    const response = await quotesClient.post('/quotes/ai/generate', {
      description,
      smart_pricing: smartPricing,
      use_groq: useGroq,
      use_xe_ai: useXEAIService,
    });
    return response.data;
  },

  /**
   * Get historical pricing analysis
   */
  async getHistoricalPricing(projectType: string, itemName?: string): Promise<{ data: any }> {
    const response = await quotesClient.get('/quotes/ai/historical-pricing', {
      params: {
        project_type: projectType,
        item_name: itemName,
      },
    });
    return response.data;
  },

  /**
   * Get material recommendations
   */
  async getMaterialRecommendations(projectType: string, budgetTier: string = 'standard', materials: string[] = []): Promise<{ data: any }> {
    const response = await quotesClient.post('/quotes/ai/material-recommendations', {
      project_type: projectType,
      budget_tier: budgetTier,
      materials,
    });
    return response.data;
  },

  /**
   * Optimize quote pricing
   */
  async optimizePricing(items: Array<{ description: string, unit_price: number }>, targetMargin: number = 25): Promise<{ data: any }> {
    const response = await quotesClient.post('/quotes/ai/optimize-pricing', {
      items,
      target_margin: targetMargin,
    });
    return response.data;
  },
};

