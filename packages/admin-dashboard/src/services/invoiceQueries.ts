import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockInvoices, mockPayments, mockInvoiceTimeline } from '@/mocks/invoices';
import { XEPayService } from '@/services/xepay';
import { Invoice } from '@/types';

export const invoiceKeys = {
  all: ['invoices'] as const,
  list: ['invoices', 'list'] as const,
  byId: (id: string) => ['invoices', id] as const,
  payments: (invoiceId: string) => ['invoices', invoiceId, 'payments'] as const,
};

export function useInvoicesQuery() {
  return useQuery({ queryKey: invoiceKeys.list, queryFn: async () => mockInvoices });
}

export function useInvoiceQuery(id: string) {
  return useQuery({ queryKey: invoiceKeys.byId(id), queryFn: async () => mockInvoices.find(i => i.id === id) as Invoice });
}

export function usePaymentsQuery(invoiceId: string) {
  return useQuery({ queryKey: invoiceKeys.payments(invoiceId), queryFn: async () => mockPayments.filter(p => p.invoiceId === invoiceId) });
}

export function useTimelineQuery(invoiceId: string) {
  return useQuery({ queryKey: ['invoices', invoiceId, 'timeline'], queryFn: async () => mockInvoiceTimeline[invoiceId] || [] });
}

export function useRecordPaymentMutation(invoiceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ amount, method, reference }: { amount: number; method: any; reference?: string }) => {
      // TODO: Implement payment recording in XEPayService
      console.log('Recording payment:', { invoiceId, amount, method, reference });
      return Promise.resolve();
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: invoiceKeys.byId(invoiceId) }),
        qc.invalidateQueries({ queryKey: invoiceKeys.payments(invoiceId) }),
        qc.invalidateQueries({ queryKey: invoiceKeys.list }),
      ]);
    },
  });
}

export function useSendLinkMutation(invoiceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ amount }: { amount?: number }) => XEPayService.createPaymentLink({ invoiceId, amount: amount || 0, currency: 'GBP', description: 'Payment', customerEmail: '' }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: invoiceKeys.byId(invoiceId) });
    },
  });
}

export function useReminderMutation(invoiceId: string) {
  return useMutation({ mutationFn: () => Promise.resolve() }); // XEPayService.sendReminder not implemented yet
}


