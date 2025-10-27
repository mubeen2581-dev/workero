import { JobUpdate, VanStock, ExpenseEntry, DriverJob, Material } from '../types';

const BASE_URL = 'http://localhost:3001/api';

// Functional API service
const apiService = {
  async get<T>(url: string): Promise<{ data: T }> {
    // Mock response for demo
    return { data: [] as any };
  },
  
  async post<T>(url: string, data?: any): Promise<{ data: T }> {
    console.log('API POST:', url, data);
    return { data: {} as any };
  },
  
  async patch<T>(url: string, data?: any): Promise<{ data: T }> {
    console.log('API PATCH:', url, data);
    return { data: {} as any };
  }
};

// Functional driver API service
export const driverApiService = {
  async getJobs(): Promise<DriverJob[]> {
    // Return mock data for demo
    const { mockJobs } = await import('../data/mockData');
    return mockJobs;
  },

  async updateJobStatus(update: JobUpdate): Promise<void> {
    await apiService.patch(`/driver/jobs/${update.jobId}`, update);
  },

  async clockIn(jobId: string, location: { lat: number; lng: number }): Promise<void> {
    await apiService.post('/driver/clock-in', { jobId, location });
  },

  async clockOut(jobId: string, location: { lat: number; lng: number }): Promise<void> {
    await apiService.post('/driver/clock-out', { jobId, location });
  },

  async uploadPhoto(jobId: string, photo: string): Promise<string> {
    const formData = new FormData();
    formData.append('photo', {
      uri: photo,
      type: 'image/jpeg',
      name: 'job-photo.jpg',
    } as any);
    
    const response = await apiService.post<{ url: string }>(`/driver/jobs/${jobId}/photos`, formData);
    return response.data.url;
  },

  async getVanStock(): Promise<VanStock[]> {
    const response = await apiService.get<VanStock[]>('/driver/van-stock');
    return response.data;
  },

  async useMaterial(jobId: string, materialId: string, quantity: number): Promise<void> {
    await apiService.post(`/driver/jobs/${jobId}/materials`, {
      materialId,
      quantity,
    });
  },

  async submitExpense(expense: Omit<ExpenseEntry, 'id'>): Promise<void> {
    await apiService.post('/driver/expenses', expense);
  },

  async updateLocation(location: { lat: number; lng: number }): Promise<void> {
    await apiService.post('/driver/location', location);
  }
};