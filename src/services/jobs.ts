import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '@/config/api';
import { Job } from '@/types';

// Create axios instance with auth interceptor
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const jobsClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
jobsClient.interceptors.request.use(
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
jobsClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface JobFilters {
  search?: string;
  status?: string;
  priority?: string;
  assigned_technician?: string;
  client_id?: string;
  sort_field?: string;
  sort_direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface CreateJobRequest {
  client_id: string;
  quote_id?: string;
  title: string;
  description: string;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  estimated_duration?: number;
  assigned_technician?: string;
  scheduled_date: string;
  location?: Record<string, any>;
  materials?: Array<Record<string, any>>;
  notes?: string;
}

export interface UpdateJobRequest {
  title?: string;
  description?: string;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  estimated_duration?: number;
  actual_duration?: number;
  assigned_technician?: string;
  scheduled_date?: string;
  location?: Record<string, any>;
  materials?: Array<Record<string, any>>;
  photos?: Array<string>;
  notes?: string;
  signature?: string;
}

export interface AssignJobRequest {
  assigned_technician: string;
}

export interface CompleteJobRequest {
  actual_duration?: number;
  signature?: string;
  notes?: string;
  photos?: Array<string>;
}

export class JobService {
  static async getAll(filters?: JobFilters): Promise<{ data: Job[]; pagination: any }> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.assigned_technician) params.append('assigned_technician', filters.assigned_technician);
    if (filters?.client_id) params.append('client_id', filters.client_id);
    if (filters?.sort_field) params.append('sort_field', filters.sort_field);
    if (filters?.sort_direction) params.append('sort_direction', filters.sort_direction);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());

    const response = await jobsClient.get(`/jobs?${params.toString()}`);
    return {
      data: response.data.data || [],
      pagination: response.data.pagination || {},
    };
  }

  static async getById(id: string): Promise<Job> {
    const response = await jobsClient.get(`/jobs/${id}`);
    return response.data.data;
  }

  static async create(data: CreateJobRequest): Promise<Job> {
    const response = await jobsClient.post('/jobs', data);
    return response.data.data;
  }

  static async update(id: string, data: UpdateJobRequest): Promise<Job> {
    const response = await jobsClient.put(`/jobs/${id}`, data);
    return response.data.data;
  }

  static async delete(id: string): Promise<void> {
    await jobsClient.delete(`/jobs/${id}`);
  }

  static async assign(id: string, data: AssignJobRequest): Promise<Job> {
    const response = await jobsClient.post(`/jobs/${id}/assign`, data);
    return response.data.data;
  }

  static async complete(id: string, data: CompleteJobRequest): Promise<Job> {
    const response = await jobsClient.post(`/jobs/${id}/complete`, data);
    return response.data.data;
  }

  static async getActivities(id: string): Promise<any[]> {
    const response = await jobsClient.get(`/jobs/${id}/activities`);
    return response.data.data || [];
  }
}

