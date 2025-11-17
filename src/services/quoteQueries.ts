import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { QuoteService, QuoteFilters, CreateQuoteRequest, UpdateQuoteRequest, ConvertQuoteToJobRequest } from '@/services/quotes';
import { toast } from 'react-toastify';

/**
 * Get all quotes with optional filters
 */
export function useQuotes(filters?: QuoteFilters) {
  return useQuery({
    queryKey: queryKeys.quotes.list(filters),
    queryFn: async () => {
      const response = await QuoteService.getAll(filters);
      return response.data || [];
    },
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Get a single quote by ID
 */
export function useQuote(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.quotes.detail(id || ''),
    queryFn: async () => {
      if (!id) return null;
      const response = await QuoteService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create a new quote
 */
export function useCreateQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuoteRequest) => QuoteService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.lists() });
      toast.success('Quote created successfully');
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        const errorMessages = Object.values(errorData.errors).flat().join(', ');
        toast.error(`Validation error: ${errorMessages}`);
      } else {
        const message = errorData?.message || 'Failed to create quote';
        toast.error(message);
      }
    },
  });
}

/**
 * Update a quote
 */
export function useUpdateQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuoteRequest }) =>
      QuoteService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.detail(variables.id) });
      toast.success('Quote updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update quote';
      toast.error(message);
    },
  });
}

/**
 * Delete a quote
 */
export function useDeleteQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => QuoteService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.lists() });
      toast.success('Quote deleted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete quote';
      toast.error(message);
    },
  });
}

/**
 * Send a quote
 */
export function useSendQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => QuoteService.send(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.detail(id) });
      toast.success('Quote sent successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to send quote';
      toast.error(message);
    },
  });
}

/**
 * Accept a quote
 */
export function useAcceptQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => QuoteService.accept(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.detail(id) });
      toast.success('Quote accepted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to accept quote';
      toast.error(message);
    },
  });
}

/**
 * Reject a quote
 */
export function useRejectQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => QuoteService.reject(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.detail(id) });
      toast.success('Quote rejected successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to reject quote';
      toast.error(message);
    },
  });
}

/**
 * Convert quote to job
 */
export function useConvertQuoteToJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ConvertQuoteToJobRequest }) =>
      QuoteService.convertToJob(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.detail(variables.id) });
      toast.success('Job created from quote successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create job from quote';
      toast.error(message);
    },
  });
}

