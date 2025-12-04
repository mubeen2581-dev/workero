import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '@/config/api';
import {
  ScheduleEvent,
  ScheduleAvailabilitySlot,
  ScheduleConflict,
  RecurringSchedule,
} from '@/types';

const getAuthToken = (): string | null => localStorage.getItem('auth_token');

const scheduleClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

scheduleClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

scheduleClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface ScheduleEventFilters {
  start?: string;
  end?: string;
  technician_id?: string;
  status?: string | string[];
  type?: string | string[];
}

export interface CreateScheduleEventRequest {
  title: string;
  start: string;
  end: string;
  job_id?: string | null;
  technician_id?: string | null;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  type?: 'job' | 'break' | 'training' | 'maintenance' | 'meeting';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  description?: string | null;
  location?: string | null;
  color?: string | null;
  travel_time_minutes?: number | null;
  buffer_minutes?: number | null;
  flexibility_minutes?: number | null;
}

export interface UpdateScheduleEventRequest extends Partial<CreateScheduleEventRequest> {}

export interface AvailabilityParams {
  technician_id: string;
  start: string;
  end: string;
  duration_minutes?: number;
  buffer_minutes?: number;
}

export interface ConflictParams {
  technician_id?: string;
  technician_ids?: string[];
  start: string;
  end: string;
}

export interface TravelTimeParams {
  origin: string;
  destination: string;
  mode?: 'driving' | 'walking' | 'bicycling' | 'transit';
}

export interface CreateRecurringScheduleRequest {
  job_id?: string | null;
  technician_id?: string | null;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval?: number;
  weekdays?: number[];
  month_day?: number;
  start_date: string;
  end_date?: string | null;
  timezone?: string;
  status?: 'active' | 'paused' | 'completed' | 'cancelled';
  duration_minutes?: number;
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  location?: string;
  color?: string;
  custom_dates?: string[];
}

export interface UpdateRecurringScheduleRequest extends Partial<CreateRecurringScheduleRequest> {
  regenerate?: boolean;
  regenerate_days?: number;
}

const mapScheduleEvent = (event: any): ScheduleEvent => ({
  id: event.id,
  title: event.title,
  start: new Date(event.start),
  end: new Date(event.end),
  jobId: event.job_id ?? event.jobId ?? undefined,
  technicianId: event.technician_id ?? event.technicianId ?? undefined,
  recurringScheduleId: event.recurring_schedule_id ?? undefined,
  status: event.status,
  type: event.type,
  priority: event.priority ?? undefined,
  description: event.description ?? undefined,
  location: event.location ?? undefined,
  color: event.color ?? undefined,
  travelTimeMinutes: event.travel_time_minutes ?? undefined,
  bufferMinutes: event.buffer_minutes ?? undefined,
  flexibilityMinutes: event.flexibility_minutes ?? undefined,
  metadata: event.metadata ?? undefined,
  job: event.job,
  technician: event.technician,
  createdAt: event.created_at ?? event.createdAt,
  updatedAt: event.updated_at ?? event.updatedAt,
});

const mapRecurringSchedule = (schedule: any): RecurringSchedule => ({
  id: schedule.id,
  companyId: schedule.company_id ?? schedule.companyId,
  jobId: schedule.job_id ?? schedule.jobId ?? undefined,
  technicianId: schedule.technician_id ?? schedule.technicianId ?? undefined,
  frequency: schedule.frequency,
  interval: schedule.interval ?? 1,
  weekdays: schedule.weekdays ?? null,
  monthDay: schedule.month_day ?? null,
  startDate: schedule.start_date,
  endDate: schedule.end_date ?? null,
  timezone: schedule.timezone ?? null,
  status: schedule.status,
  nextOccurrence: schedule.next_occurrence ?? null,
  constraints: schedule.constraints ?? undefined,
  job: schedule.job,
  technician: schedule.technician,
  createdAt: schedule.created_at ?? schedule.createdAt,
  updatedAt: schedule.updated_at ?? schedule.updatedAt,
});

export const ScheduleService = {
  async getEvents(filters?: ScheduleEventFilters): Promise<ScheduleEvent[]> {
    const response = await scheduleClient.get('/schedule/events', { params: filters });
    return (response.data?.data || []).map(mapScheduleEvent);
  },

  async createEvent(data: CreateScheduleEventRequest): Promise<ScheduleEvent> {
    const response = await scheduleClient.post('/schedule/events', data);
    return mapScheduleEvent(response.data?.data);
  },

  async updateEvent(id: string, data: UpdateScheduleEventRequest): Promise<ScheduleEvent> {
    const response = await scheduleClient.put(`/schedule/events/${id}`, data);
    return mapScheduleEvent(response.data?.data);
  },

  async deleteEvent(id: string): Promise<void> {
    await scheduleClient.delete(`/schedule/events/${id}`);
  },

  async getAvailability(params: AvailabilityParams): Promise<{
    technicianId: string;
    technicianName?: string;
    slots: ScheduleAvailabilitySlot[];
    totalSlots: number;
    window: { start: string; end: string };
  }> {
    const response = await scheduleClient.get('/schedule/availability', { params });
    const data = response.data?.data;
    return {
      technicianId: data?.technician_id ?? data?.technicianId,
      technicianName: data?.technician_name ?? data?.technicianName,
      slots: (data?.slots || []) as ScheduleAvailabilitySlot[],
      totalSlots: data?.total_slots ?? 0,
      window: data?.window || { start: params.start, end: params.end },
    };
  },

  async getConflicts(params: ConflictParams): Promise<{
    conflicts: ScheduleConflict[];
    totalEvents: number;
  }> {
    const response = await scheduleClient.get('/schedule/conflicts', { params });
    const data = response.data?.data;
    return {
      conflicts: (data?.conflicts || []).map((conflict: any) => ({
        technicianId: conflict.technician_id ?? conflict.technicianId,
        type: conflict.type,
        events: conflict.events,
        date: conflict.date,
        scheduledJobs: conflict.scheduled_jobs ?? conflict.scheduledJobs,
        message: conflict.message,
      })),
      totalEvents: data?.total_events ?? 0,
    };
  },

  async getRecurringSchedules(): Promise<RecurringSchedule[]> {
    const response = await scheduleClient.get('/schedule/recurring');
    return (response.data?.data || []).map(mapRecurringSchedule);
  },

  async getTravelTime(params: TravelTimeParams): Promise<{
    origin: string;
    destination: string;
    mode: string;
    distance_text: string;
    distance_km: number;
    duration_text: string;
    duration_minutes: number;
  }> {
    const response = await scheduleClient.get('/schedule/travel-time', { params });
    return response.data?.data;
  },

  async downloadICal(params?: { start?: string; end?: string; technician_id?: string }): Promise<Blob> {
    const response = await scheduleClient.get('/schedule/events/ical', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  async createRecurringSchedule(
    data: CreateRecurringScheduleRequest
  ): Promise<{ schedule: RecurringSchedule; generatedEvents: number }> {
    const response = await scheduleClient.post('/schedule/recurring', data);
    return {
      schedule: mapRecurringSchedule(response.data?.data?.schedule ?? response.data?.data),
      generatedEvents: response.data?.data?.generated_events ?? 0,
    };
  },

  async updateRecurringSchedule(
    id: string,
    data: UpdateRecurringScheduleRequest
  ): Promise<{ schedule: RecurringSchedule; regeneratedEvents: number }> {
    const response = await scheduleClient.put(`/schedule/recurring/${id}`, data);
    return {
      schedule: mapRecurringSchedule(response.data?.data?.schedule ?? response.data?.data),
      regeneratedEvents: response.data?.data?.regenerated_events ?? 0,
    };
  },

  async deleteRecurringSchedule(id: string, deleteEvents: boolean = true): Promise<void> {
    await scheduleClient.delete(`/schedule/recurring/${id}`, { params: { delete_events: deleteEvents } });
  },

  async optimizeRoute(params: {
    locations: string[];
    start_location?: string;
    mode?: 'driving' | 'walking' | 'bicycling' | 'transit';
  }): Promise<any> {
    const response = await scheduleClient.post('/schedule/optimize-route', params);
    return response.data?.data;
  },

  async generateRecurringOccurrences(
    id: string,
    days: number = 30
  ): Promise<{ generatedEvents: number; nextOccurrence?: string | null }> {
    const response = await scheduleClient.post(`/schedule/recurring/${id}/generate`, { days });
    return {
      generatedEvents: response.data?.data?.generated_events ?? 0,
      nextOccurrence: response.data?.data?.next_occurrence ?? null,
    };
  },
};


