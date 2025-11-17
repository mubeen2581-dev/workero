import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { ClientService, ClientFilters, CreateClientRequest, UpdateClientRequest } from '@/services/clients';
import { toast } from 'react-toastify';

/**
 * Get all clients with optional filters
 */
export function useClients(filters?: ClientFilters) {
  return useQuery({
    queryKey: queryKeys.clients.list(filters),
    queryFn: async () => {
      const response = await ClientService.getAll(filters);
      return response.data || [];
    },
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Get a single client by ID
 */
export function useClient(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.clients.detail(id || ''),
    queryFn: async () => {
      if (!id) return null;
      const response = await ClientService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create a new client
 */
export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClientRequest) => ClientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.lists() });
      toast.success('Client created successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create client';
      toast.error(message);
    },
  });
}

/**
 * Update a client
 */
export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientRequest }) =>
      ClientService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.detail(variables.id) });
      toast.success('Client updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update client';
      toast.error(message);
    },
  });
}

/**
 * Delete a client
 */
export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ClientService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.lists() });
      toast.success('Client deleted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete client';
      toast.error(message);
    },
  });
}

