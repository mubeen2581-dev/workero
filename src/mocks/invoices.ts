import { Invoice, Payment, InvoiceItem, Client, RecurringBilling } from '@/types';
import { mockClients } from './leads';

export const mockInvoiceItems: InvoiceItem[] = [
  {
    id: 'item-1',
    description: 'Kitchen Renovation - Labor',
    quantity: 40,
    unitPrice: 75.00,
    taxRate: 8.5,
    lineTotal: 3255.00,
  },
  {
    id: 'item-2',
    description: 'Kitchen Renovation - Materials',
    quantity: 1,
    unitPrice: 2500.00,
    taxRate: 8.5,
    lineTotal: 2712.50,
  },
  {
    id: 'item-3',
    description: 'Bathroom Remodel - Labor',
    quantity: 25,
    unitPrice: 75.00,
    taxRate: 8.5,
    lineTotal: 2034.38,
  },
  {
    id: 'item-4',
    description: 'Bathroom Remodel - Materials',
    quantity: 1,
    unitPrice: 1200.00,
    taxRate: 8.5,
    lineTotal: 1302.00,
  },
  {
    id: 'item-5',
    description: 'Electrical Panel Upgrade',
    quantity: 1,
    unitPrice: 1800.00,
    taxRate: 8.5,
    lineTotal: 1953.00,
  },
  {
    id: 'item-6',
    description: 'Emergency Plumbing Repair',
    quantity: 4,
    unitPrice: 150.00,
    taxRate: 8.5,
    lineTotal: 651.00,
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: 'INV-2024-001',
    jobId: 'job-1',
    job: {
      id: 'job-1',
      clientId: 'client-1',
      title: 'Kitchen Renovation',
      description: 'Complete kitchen renovation',
      status: 'completed',
      priority: 'high',
      scheduledDate: '2024-12-01T09:00:00Z',
      completedDate: '2024-12-10T17:00:00Z',
      estimatedDuration: 480,
      actualDuration: 450,
      location: {
        address: '123 Main St, New York, NY 10001, USA',
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      notes: 'Kitchen renovation completed successfully',
      photos: [],
      client: mockClients[0],
      materials: [],
      createdAt: '2024-11-15T00:00:00Z',
      updatedAt: '2024-12-10T17:00:00Z'
    },
    clientId: 'client-1',
    client: mockClients[0],
    amount: 5755.00,
    items: mockInvoiceItems.slice(0, 2),
    taxAmount: 489.18,
    total: 6244.18,
    status: 'paid',
    dueDate: '2024-12-15T00:00:00Z',
    paidDate: '2024-12-10T00:00:00Z',
    notes: 'Thank you for your business!',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-10T00:00:00Z',
  },
  {
    id: 'INV-2024-002',
    jobId: 'job-2',
    job: {
      id: 'job-2',
      clientId: 'client-2',
      title: 'Bathroom Remodel',
      description: 'Complete bathroom renovation',
      status: 'in_progress',
      priority: 'medium',
      scheduledDate: '2024-11-20T10:00:00Z',
      estimatedDuration: 360,
      location: {
        address: '456 Oak Ave, Los Angeles, CA 90210, USA',
        coordinates: { lat: 34.0522, lng: -118.2437 }
      },
      notes: 'Bathroom remodel in progress',
      photos: [],
      client: mockClients[1],
      materials: [],
      createdAt: '2024-11-15T00:00:00Z',
      updatedAt: '2024-12-15T00:00:00Z'
    },
    clientId: 'client-2',
    client: mockClients[1],
    amount: 3336.38,
    items: mockInvoiceItems.slice(2, 4),
    taxAmount: 283.59,
    total: 3619.97,
    status: 'overdue',
    dueDate: '2024-12-05T00:00:00Z',
    paidDate: undefined,
    notes: 'Please remit payment within 15 days.',
    createdAt: '2024-11-20T14:30:00Z',
    updatedAt: '2024-12-15T00:00:00Z',
  },
  {
    id: 'INV-2024-003',
    jobId: 'job-3',
    job: {
      id: 'job-3',
      clientId: 'client-3',
      title: 'Electrical Panel Upgrade',
      description: 'Upgrade electrical panel and install new outlets',
      status: 'completed',
      priority: 'high',
      scheduledDate: '2024-12-05T08:00:00Z',
      completedDate: '2024-12-05T16:00:00Z',
      estimatedDuration: 480,
      actualDuration: 450,
      location: {
        address: '789 Pine St, Chicago, IL 60601, USA',
        coordinates: { lat: 41.8781, lng: -87.6298 }
      },
      notes: 'Electrical work completed successfully',
      photos: [],
      client: mockClients[2],
      materials: [],
      createdAt: '2024-11-25T00:00:00Z',
      updatedAt: '2024-12-05T16:00:00Z'
    },
    clientId: 'client-3',
    client: mockClients[2],
    amount: 1800.00,
    items: [mockInvoiceItems[4]],
    taxAmount: 153.00,
    total: 1953.00,
    status: 'sent',
    dueDate: '2024-12-25T00:00:00Z',
    paidDate: undefined,
    notes: 'Electrical work completed successfully.',
    createdAt: '2024-12-05T09:15:00Z',
    updatedAt: '2024-12-05T09:15:00Z',
  },
  {
    id: 'INV-2024-004',
    jobId: 'job-4',
    job: {
      id: 'job-4',
      clientId: 'client-4',
      title: 'Emergency Repair',
      description: 'Emergency plumbing repair',
      status: 'completed',
      priority: 'urgent',
      scheduledDate: '2024-12-15T14:00:00Z',
      completedDate: '2024-12-15T16:30:00Z',
      estimatedDuration: 120,
      actualDuration: 150,
      location: {
        address: '321 Elm St, Houston, TX 77001, USA',
        coordinates: { lat: 29.7604, lng: -95.3698 }
      },
      notes: 'Emergency repair completed',
      photos: [],
      client: mockClients[3],
      materials: [],
      createdAt: '2024-12-15T13:00:00Z',
      updatedAt: '2024-12-15T16:30:00Z'
    },
    clientId: 'client-4',
    client: mockClients[3],
    amount: 600.00,
    items: [mockInvoiceItems[5]],
    taxAmount: 51.00,
    total: 651.00,
    status: 'draft',
    dueDate: '2024-12-30T00:00:00Z',
    paidDate: undefined,
    notes: 'Emergency repair completed.',
    createdAt: '2024-12-15T16:30:00Z',
    updatedAt: '2024-12-15T16:30:00Z',
  },
  {
    id: 'INV-2024-005',
    jobId: 'job-5',
    job: {
      id: 'job-5',
      clientId: 'client-5',
      title: 'HVAC Maintenance',
      description: 'Annual HVAC maintenance service',
      status: 'completed',
      priority: 'low',
      scheduledDate: '2024-12-10T15:00:00Z',
      completedDate: '2024-12-10T17:20:00Z',
      estimatedDuration: 120,
      actualDuration: 140,
      location: {
        address: '654 Maple Dr, Phoenix, AZ 85001, USA',
        coordinates: { lat: 33.4484, lng: -112.0740 }
      },
      notes: 'Annual maintenance completed',
      photos: [],
      client: mockClients[4],
      materials: [],
      createdAt: '2024-12-05T00:00:00Z',
      updatedAt: '2024-12-10T17:20:00Z'
    },
    clientId: 'client-5',
    client: mockClients[4],
    amount: 800.00,
    items: [
      {
        id: 'item-7',
        description: 'HVAC Maintenance - Annual Service',
        quantity: 1,
        unitPrice: 800.00,
        taxRate: 8.5,
        lineTotal: 868.00,
      },
    ],
    taxAmount: 68.00,
    total: 868.00,
    status: 'paid',
    dueDate: '2024-12-20T00:00:00Z',
    paidDate: '2024-12-18T00:00:00Z',
    notes: 'Annual maintenance completed.',
    createdAt: '2024-12-10T15:20:00Z',
    updatedAt: '2024-12-18T00:00:00Z',
  },
];

export const mockPayments: Payment[] = [
  {
    id: 'PAY-001',
    invoiceId: 'INV-2024-001',
    amount: 6244.18,
    paymentMethod: 'credit_card',
    paymentDate: '2024-12-10T14:30:00Z',
    reference: 'TXN-123456789',
    notes: 'Payment processed successfully',
    status: 'completed',
    createdAt: '2024-12-10T14:30:00Z',
  },
  {
    id: 'PAY-002',
    invoiceId: 'INV-2024-005',
    amount: 868.00,
    paymentMethod: 'bank_transfer',
    paymentDate: '2024-12-18T10:15:00Z',
    reference: 'ACH-987654321',
    notes: 'Bank transfer received',
    status: 'completed',
    createdAt: '2024-12-18T10:15:00Z',
  },
  {
    id: 'PAY-003',
    invoiceId: 'INV-2024-002',
    amount: 1000.00,
    paymentMethod: 'check',
    paymentDate: '2024-12-12T09:30:00Z',
    reference: 'CHK-456789123',
    notes: 'Partial payment received',
    status: 'completed',
    createdAt: '2024-12-12T09:30:00Z',
  },
];

// Simple timeline events per invoice (mock)
export type InvoiceEvent = { type: 'created' | 'sent' | 'reminded' | 'paid'; at: string; note?: string };
export const mockInvoiceTimeline: Record<string, InvoiceEvent[]> = {
  'INV-2024-001': [
    { type: 'created', at: '2024-12-01T10:00:00Z' },
    { type: 'sent', at: '2024-12-01T11:00:00Z' },
    { type: 'paid', at: '2024-12-10T14:30:00Z' },
  ],
  'INV-2024-002': [
    { type: 'created', at: '2024-11-20T14:30:00Z' },
    { type: 'sent', at: '2024-11-20T15:00:00Z' },
    { type: 'reminded', at: '2024-12-06T09:00:00Z' },
  ],
  'INV-2024-003': [
    { type: 'created', at: '2024-12-05T09:15:00Z' },
    { type: 'sent', at: '2024-12-05T10:00:00Z' },
  ],
};

export const mockRecurringBilling: RecurringBilling[] = [
  {
    id: 'REC-001',
    clientId: 'client-1',
    client: mockClients[0],
    description: 'Monthly Office Cleaning',
    amount: 500.00,
    frequency: 'monthly',
    startDate: '2024-01-01T00:00:00Z',
    nextBillingDate: '2025-01-01T00:00:00Z',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'REC-002',
    clientId: 'client-5',
    client: mockClients[4],
    description: 'Quarterly HVAC Maintenance',
    amount: 300.00,
    frequency: 'quarterly',
    startDate: '2024-01-01T00:00:00Z',
    nextBillingDate: '2025-01-01T00:00:00Z',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const getInvoiceStats = () => {
  const totalInvoices = mockInvoices.length;
  const paidInvoices = mockInvoices.filter(inv => inv.status === 'paid').length;
  const overdueInvoices = mockInvoices.filter(inv => inv.status === 'overdue').length;
  const sentInvoices = mockInvoices.filter(inv => inv.status === 'sent').length;
  const draftInvoices = mockInvoices.filter(inv => inv.status === 'draft').length;
  
  const totalRevenue = mockInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  
  const outstandingAmount = mockInvoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  
  const overdueAmount = mockInvoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total, 0);

  return {
    totalInvoices,
    paidInvoices,
    overdueInvoices,
    sentInvoices,
    draftInvoices,
    totalRevenue,
    outstandingAmount,
    overdueAmount,
  };
};

export const getAgingReport = () => {
  const now = new Date();
  const agingCategories = {
    current: 0,
    days30: 0,
    days60: 0,
    days90: 0,
    over90: 0,
  };

  mockInvoices
    .filter(inv => inv.status !== 'paid')
    .forEach(invoice => {
      const daysPastDue = Math.floor((now.getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysPastDue <= 0) {
        agingCategories.current += invoice.total;
      } else if (daysPastDue <= 30) {
        agingCategories.days30 += invoice.total;
      } else if (daysPastDue <= 60) {
        agingCategories.days60 += invoice.total;
      } else if (daysPastDue <= 90) {
        agingCategories.days90 += invoice.total;
      } else {
        agingCategories.over90 += invoice.total;
      }
    });

  return agingCategories;
};

export const getPaymentStats = () => {
  const totalPayments = mockPayments.length;
  const totalPaidAmount = mockPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
  const paymentMethods = mockPayments.reduce((acc, payment) => {
    acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalPayments,
    totalPaidAmount,
    paymentMethods,
  };
};

export const calculateInvoiceTotal = (items: InvoiceItem[]): { subtotal: number; taxAmount: number; total: number } => {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxRate / 100), 0);
  const total = subtotal + taxAmount;
  
  return { subtotal, taxAmount, total };
};

export const getOverdueInvoices = () => {
  const now = new Date();
  return mockInvoices.filter(invoice => {
    if (invoice.status === 'paid') return false;
    const dueDate = new Date(invoice.dueDate);
    return dueDate < now;
  });
};

export const getUpcomingInvoices = () => {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return mockInvoices.filter(invoice => {
    if (invoice.status === 'paid') return false;
    const dueDate = new Date(invoice.dueDate);
    return dueDate >= now && dueDate <= nextWeek;
  });
};
