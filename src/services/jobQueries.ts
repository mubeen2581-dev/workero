import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { JobService, JobFilters, CreateJobRequest, UpdateJobRequest, AssignJobRequest, CompleteJobRequest } from './jobs';
import { queryKeys } from './queryKeys';
import { Job } from '@/types';

export const useJobs = (filters?: JobFilters) => {
  return useQuery({
    queryKey: queryKeys.jobs.list(filters),
    queryFn: () => JobService.getAll(filters),
    select: (response) => response.data,
  });
};

export const useJob = (id: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.jobs.detail(id || ''),
    queryFn: () => JobService.getById(id!),
    enabled: !!id,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobRequest) => JobService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
      toast.success('Job created successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create job';
      toast.error(message);
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobRequest }) => JobService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(data.id) });
      toast.success('Job updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update job';
      toast.error(message);
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => JobService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
      toast.success('Job deleted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete job';
      toast.error(message);
    },
  });
};

export const useAssignJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignJobRequest }) => JobService.assign(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(data.id) });
      toast.success('Job assigned successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to assign job';
      toast.error(message);
    },
  });
};

export const useCompleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CompleteJobRequest }) => JobService.complete(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(data.id) });
      toast.success('Job completed successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to complete job';
      toast.error(message);
    },
  });
};

export const useJobActivities = (id: string | undefined) => {
  return useQuery({
    queryKey: [...queryKeys.jobs.detail(id || ''), 'activities'],
    queryFn: () => JobService.getActivities(id!),
    enabled: !!id,
  });
};

