import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '@/config/api';
import { Lead } from '@/types';

// Create axios instance with auth interceptor
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const leadsClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
leadsClient.interceptors.request.use(
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
leadsClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LeadFilters {
  search?: string;
  status?: string;
  priority?: string;
  source?: string;
  assignedTo?: string;
  unassigned?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
  sortBy?: string; // Legacy support
  sortOrder?: 'asc' | 'desc'; // Legacy support
  page?: number;
  limit?: number;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  user_id?: string;
  type: 'created' | 'status_changed' | 'assigned' | 'note_added' | 'contacted' | 'quote_sent' | 'converted' | 'lost' | 'updated';
  description: string;
  metadata?: Record<string, any>;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface LeadWorkload {
  user_id: string;
  user_name: string;
  role: string;
  total_leads: number;
  active_leads: number;
  urgent_leads: number;
}

export interface DistributeLeadsRequest {
  leadIds: string[];
  method: 'round_robin' | 'workload' | 'priority';
  role?: string;
}

export interface DistributeLeadsResponse {
  assignments: Array<{
    lead_id: string;
    assigned_to: string;
    user_name: string;
    workload_after_assignment?: number;
    priority?: string;
  }>;
  total_distributed: number;
}

export interface CreateLeadRequest {
  client_id?: string;
  client?: {
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
  };
  source: 'website' | 'referral' | 'advertisement' | 'cold_call' | 'other';
  status?: 'new' | 'contacted' | 'qualified' | 'quoted' | 'converted' | 'lost';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  estimated_value?: number;
  notes?: string;
  assigned_to?: string;
}

export interface UpdateLeadRequest {
  source?: string;
  status?: string;
  priority?: string;
  estimated_value?: number;
  notes?: string;
  assigned_to?: string;
}

export interface UpdateLeadStatusRequest {
  status: 'new' | 'contacted' | 'qualified' | 'quoted' | 'converted' | 'lost';
}

export interface AssignLeadRequest {
  assignedTo: string;
}

export const LeadService = {
  /**
   * Get all leads with optional filters
   */
  async getAll(filters?: LeadFilters): Promise<{ data: Lead[]; meta?: any }> {
    const response = await leadsClient.get('/leads', { params: filters });
    return response.data;
  },

  /**
   * Get a single lead by ID
   */
  async getById(id: string): Promise<{ data: Lead }> {
    const response = await leadsClient.get(`/leads/${id}`);
    return response.data;
  },

  /**
   * Create a new lead
   */
  async create(data: CreateLeadRequest): Promise<{ data: Lead }> {
    const response = await leadsClient.post('/leads', data);
    return response.data;
  },

  /**
   * Update a lead
   */
  async update(id: string, data: UpdateLeadRequest): Promise<{ data: Lead }> {
    const response = await leadsClient.put(`/leads/${id}`, data);
    return response.data;
  },

  /**
   * Delete a lead
   */
  async delete(id: string): Promise<void> {
    await leadsClient.delete(`/leads/${id}`);
  },

  /**
   * Get lead activities
   */
  async getActivities(id: string): Promise<{ data: LeadActivity[] }> {
    const response = await leadsClient.get(`/leads/${id}/activities`);
    return response.data;
  },

  /**
   * Update lead status
   */
  async updateStatus(id: string, data: UpdateLeadStatusRequest): Promise<{ data: Lead }> {
    const response = await leadsClient.post(`/leads/${id}/status`, data);
    return response.data;
  },

  /**
   * Assign a lead to a user
   */
  async assign(id: string, data: AssignLeadRequest): Promise<{ data: Lead }> {
    const response = await leadsClient.post(`/leads/${id}/assign`, data);
    return response.data;
  },

  /**
   * Get workload statistics
   */
  async getWorkloads(role?: string): Promise<{ data: LeadWorkload[] }> {
    const response = await leadsClient.get('/leads/workloads', { params: { role } });
    return response.data;
  },

  /**
   * Distribute leads automatically
   */
  async distribute(data: DistributeLeadsRequest): Promise<{ data: DistributeLeadsResponse }> {
    const response = await leadsClient.post('/leads/distribute', data);
    return response.data;
  },
};

