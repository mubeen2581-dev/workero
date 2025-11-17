import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { LeadService, LeadFilters, CreateLeadRequest, UpdateLeadRequest, UpdateLeadStatusRequest, AssignLeadRequest, DistributeLeadsRequest } from '@/services/leads';
import { toast } from 'react-toastify';

/**
 * Get all leads with optional filters
 */
export function useLeads(filters?: LeadFilters) {
  return useQuery({
    queryKey: queryKeys.leads.list(filters),
    queryFn: async () => {
      const response = await LeadService.getAll(filters);
      return response.data || [];
    },
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Get a single lead by ID
 */
export function useLead(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.leads.detail(id || ''),
    queryFn: async () => {
      if (!id) return null;
      const response = await LeadService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Get lead activities
 */
export function useLeadActivities(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.leads.activities(id || ''),
    queryFn: async () => {
      if (!id) return [];
      const response = await LeadService.getActivities(id);
      return response.data || [];
    },
    enabled: !!id,
  });
}

/**
 * Get workload statistics
 */
export function useLeadWorkloads(role?: string) {
  return useQuery({
    queryKey: queryKeys.leads.workloads(role),
    queryFn: async () => {
      const response = await LeadService.getWorkloads(role);
      return response.data || [];
    },
    staleTime: 60000, // 1 minute
  });
}

/**
 * Create a new lead
 */
export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLeadRequest) => LeadService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.lists() });
      toast.success('Lead created successfully');
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        // Show validation errors
        const errorMessages = Object.values(errorData.errors).flat().join(', ');
        toast.error(`Validation error: ${errorMessages}`);
      } else {
        const message = errorData?.message || 'Failed to create lead';
        toast.error(message);
      }
    },
  });
}

/**
 * Update a lead
 */
export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadRequest }) =>
      LeadService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.detail(variables.id) });
      toast.success('Lead updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update lead';
      toast.error(message);
    },
  });
}

/**
 * Delete a lead
 */
export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => LeadService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
      toast.success('Lead deleted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete lead';
      toast.error(message);
    },
  });
}

/**
 * Update lead status
 */
export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadStatusRequest }) =>
      LeadService.updateStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.activities(variables.id) });
      toast.success('Lead status updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update lead status';
      toast.error(message);
    },
  });
}

/**
 * Assign a lead to a user
 */
export function useAssignLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignLeadRequest }) =>
      LeadService.assign(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.activities(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.workloads() });
      toast.success('Lead assigned successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to assign lead';
      toast.error(message);
    },
  });
}

/**
 * Distribute leads automatically
 */
export function useDistributeLeads() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DistributeLeadsRequest) => LeadService.distribute(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.workloads() });
      const count = response.data?.total_distributed || 0;
      toast.success(`${count} lead(s) distributed successfully`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to distribute leads';
      toast.error(message);
    },
  });
}

