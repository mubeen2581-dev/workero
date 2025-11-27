import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { queryKeys } from '@/services/queryKeys';
import {
  ScheduleService,
  ScheduleEventFilters,
  CreateScheduleEventRequest,
  UpdateScheduleEventRequest,
  AvailabilityParams,
  ConflictParams,
  CreateRecurringScheduleRequest,
  UpdateRecurringScheduleRequest,
} from '@/services/schedule';

export function useScheduleEvents(filters?: ScheduleEventFilters) {
  return useQuery({
    queryKey: queryKeys.schedule.events(filters),
    queryFn: () => ScheduleService.getEvents(filters),
    enabled: Boolean(filters?.start && filters?.end),
  });
}

export function useCreateScheduleEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateScheduleEventRequest) => ScheduleService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedule.all });
      toast.success('Event created successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create event';
      toast.error(message);
    },
  });
}

export function useUpdateScheduleEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateScheduleEventRequest }) =>
      ScheduleService.updateEvent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedule.all });
      toast.success('Event updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update event';
      toast.error(message);
    },
  });
}

export function useDeleteScheduleEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ScheduleService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedule.all });
      toast.success('Event deleted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete event';
      toast.error(message);
    },
  });
}

export function useScheduleAvailability(params?: AvailabilityParams) {
  return useQuery({
    queryKey: queryKeys.schedule.availability(params),
    queryFn: () => {
      if (!params?.technician_id) return null;
      return ScheduleService.getAvailability(params);
    },
    enabled: Boolean(params?.technician_id && params?.start && params?.end),
  });
}

export function useScheduleConflicts(params?: ConflictParams) {
  return useQuery({
    queryKey: queryKeys.schedule.conflicts(params),
    queryFn: () => {
      if (!params?.start || !params?.end) return null;
      return ScheduleService.getConflicts(params);
    },
    enabled: Boolean(params?.start && params?.end),
  });
}

export function useRecurringSchedules() {
  return useQuery({
    queryKey: queryKeys.schedule.recurring(),
    queryFn: () => ScheduleService.getRecurringSchedules(),
  });
}

export function useCreateRecurringSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRecurringScheduleRequest) => ScheduleService.createRecurringSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedule.recurring() });
      queryClient.invalidateQueries({ queryKey: queryKeys.schedule.all });
      toast.success('Recurring schedule created');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create recurring schedule';
      toast.error(message);
    },
  });
}

export function useUpdateRecurringSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecurringScheduleRequest }) =>
      ScheduleService.updateRecurringSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedule.recurring() });
      queryClient.invalidateQueries({ queryKey: queryKeys.schedule.all });
      toast.success('Recurring schedule updated');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update recurring schedule';
      toast.error(message);
    },
  });
}

export function useDeleteRecurringSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, deleteEvents }: { id: string; deleteEvents?: boolean }) =>
      ScheduleService.deleteRecurringSchedule(id, deleteEvents),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedule.recurring() });
      queryClient.invalidateQueries({ queryKey: queryKeys.schedule.all });
      toast.success('Recurring schedule deleted');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete recurring schedule';
      toast.error(message);
    },
  });
}

export function useGenerateRecurringSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, days }: { id: string; days?: number }) =>
      ScheduleService.generateRecurringOccurrences(id, days),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedule.recurring() });
      queryClient.invalidateQueries({ queryKey: queryKeys.schedule.all });
      toast.success('Recurring events generated');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to generate occurrences';
      toast.error(message);
    },
  });
}


