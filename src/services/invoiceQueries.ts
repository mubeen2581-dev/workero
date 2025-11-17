import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { InvoiceService, InvoiceFilters, CreateInvoiceRequest, UpdateInvoiceRequest, PayInvoiceRequest, GenerateFromJobRequest } from '@/services/invoices';
import { toast } from 'react-toastify';

/**
 * Get all invoices with optional filters
 */
export function useInvoices(filters?: InvoiceFilters) {
  return useQuery({
    queryKey: queryKeys.invoices.list(filters),
    queryFn: async () => {
      const response = await InvoiceService.getAll(filters);
      return response.data || [];
    },
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Get a single invoice by ID
 */
export function useInvoice(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.invoices.detail(id || ''),
    queryFn: async () => {
      if (!id) return null;
      const response = await InvoiceService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create a new invoice
 */
export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvoiceRequest) => InvoiceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.lists() });
      toast.success('Invoice created successfully');
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        const errorMessages = Object.values(errorData.errors).flat().join(', ');
        toast.error(`Validation error: ${errorMessages}`);
      } else {
        const message = errorData?.message || 'Failed to create invoice';
        toast.error(message);
      }
    },
  });
}

/**
 * Update an invoice
 */
export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInvoiceRequest }) =>
      InvoiceService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.detail(variables.id) });
      toast.success('Invoice updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update invoice';
      toast.error(message);
    },
  });
}

/**
 * Delete an invoice
 */
export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => InvoiceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.lists() });
      toast.success('Invoice deleted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete invoice';
      toast.error(message);
    },
  });
}

/**
 * Send an invoice
 */
export function useSendInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => InvoiceService.send(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.detail(id) });
      toast.success('Invoice sent successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to send invoice';
      toast.error(message);
    },
  });
}

/**
 * Pay an invoice
 */
export function usePayInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PayInvoiceRequest }) =>
      InvoiceService.pay(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.detail(variables.id) });
      toast.success('Payment processed successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to process payment';
      toast.error(message);
    },
  });
}

/**
 * Generate invoice from job
 */
export function useGenerateInvoiceFromJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: GenerateFromJobRequest }) =>
      InvoiceService.generateFromJob(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.lists() });
      toast.success('Invoice generated from job successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to generate invoice from job';
      toast.error(message);
    },
  });
}

/**
 * Download invoice PDF
 */
export function useDownloadInvoicePdf() {
  return useMutation({
    mutationFn: async (id: string) => {
      const blob = await InvoiceService.downloadPdf(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${id.substring(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast.success('Invoice PDF downloaded successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to download invoice PDF';
      toast.error(message);
    },
  });
}
