import { User, Lead, Job, Invoice, Payment, Client } from '@/types';

// Analytics and Reporting Types
export interface BusinessMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  revenueGrowth: number;
  customerCount: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
  churnRate: number;
  retentionRate: number;
}

export interface PerformanceMetrics {
  technicianId: string;
  technicianName: string;
  jobsCompleted: number;
  jobsOnTime: number;
  averageRating: number;
  totalHours: number;
  revenue: number;
  efficiency: number;
  customerSatisfaction: number;
}

export interface CustomerAnalytics {
  clientId: string;
  clientName: string;
  totalSpent: number;
  jobCount: number;
  averageRating: number;
  lastJobDate: string;
  satisfactionScore: number;
  retentionScore: number;
  lifetimeValue: number;
}

export interface OperationalMetrics {
  totalJobs: number;
  completedJobs: number;
  onTimeJobs: number;
  averageJobDuration: number;
  averageResponseTime: number;
  utilizationRate: number;
  equipmentEfficiency: number;
  resourceOptimization: number;
}

export interface ReportData {
  id: string;
  name: string;
  type: 'financial' | 'operational' | 'customer' | 'performance' | 'custom';
  description: string;
  data: any;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  createdBy: string;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
  percentage?: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

// Mock Business Metrics
export const mockBusinessMetrics: BusinessMetrics = {
  totalRevenue: 485750.00,
  totalExpenses: 312450.00,
  netProfit: 173300.00,
  profitMargin: 35.7,
  revenueGrowth: 12.5,
  customerCount: 1247,
  averageOrderValue: 389.50,
  customerLifetimeValue: 2150.00,
  churnRate: 8.2,
  retentionRate: 91.8,
};

// Mock Performance Metrics
export const mockPerformanceMetrics: PerformanceMetrics[] = [
  {
    technicianId: 'tech-1',
    technicianName: 'John Smith',
    jobsCompleted: 156,
    jobsOnTime: 142,
    averageRating: 4.8,
    totalHours: 1248,
    revenue: 45600.00,
    efficiency: 94.2,
    customerSatisfaction: 4.7,
  },
  {
    technicianId: 'tech-2',
    technicianName: 'Sarah Johnson',
    jobsCompleted: 134,
    jobsOnTime: 128,
    averageRating: 4.9,
    totalHours: 1072,
    revenue: 38900.00,
    efficiency: 95.5,
    customerSatisfaction: 4.8,
  },
  {
    technicianId: 'tech-3',
    technicianName: 'Mike Davis',
    jobsCompleted: 98,
    jobsOnTime: 89,
    averageRating: 4.6,
    totalHours: 784,
    revenue: 28900.00,
    efficiency: 90.8,
    customerSatisfaction: 4.5,
  },
  {
    technicianId: 'tech-4',
    technicianName: 'Lisa Wilson',
    jobsCompleted: 112,
    jobsOnTime: 105,
    averageRating: 4.7,
    totalHours: 896,
    revenue: 32400.00,
    efficiency: 93.8,
    customerSatisfaction: 4.6,
  },
];

// Mock Customer Analytics
export const mockCustomerAnalytics: CustomerAnalytics[] = [
  {
    clientId: 'client-1',
    clientName: 'Acme Corporation',
    totalSpent: 45600.00,
    jobCount: 23,
    averageRating: 4.8,
    lastJobDate: '2024-12-15T00:00:00Z',
    satisfactionScore: 4.7,
    retentionScore: 9.2,
    lifetimeValue: 45600.00,
  },
  {
    clientId: 'client-2',
    clientName: 'TechStart Inc',
    totalSpent: 28900.00,
    jobCount: 15,
    averageRating: 4.6,
    lastJobDate: '2024-12-10T00:00:00Z',
    satisfactionScore: 4.5,
    retentionScore: 8.8,
    lifetimeValue: 28900.00,
  },
  {
    clientId: 'client-3',
    clientName: 'Global Solutions',
    totalSpent: 67800.00,
    jobCount: 31,
    averageRating: 4.9,
    lastJobDate: '2024-12-12T00:00:00Z',
    satisfactionScore: 4.8,
    retentionScore: 9.5,
    lifetimeValue: 67800.00,
  },
  {
    clientId: 'client-4',
    clientName: 'Innovation Labs',
    totalSpent: 32400.00,
    jobCount: 18,
    averageRating: 4.7,
    lastJobDate: '2024-12-08T00:00:00Z',
    satisfactionScore: 4.6,
    retentionScore: 8.9,
    lifetimeValue: 32400.00,
  },
];

// Mock Operational Metrics
export const mockOperationalMetrics: OperationalMetrics = {
  totalJobs: 1247,
  completedJobs: 1189,
  onTimeJobs: 1087,
  averageJobDuration: 4.2,
  averageResponseTime: 2.1,
  utilizationRate: 87.3,
  equipmentEfficiency: 92.1,
  resourceOptimization: 89.7,
};

// Mock Revenue Data (Last 12 months)
export const mockRevenueData: TimeSeriesData[] = [
  { date: '2024-01-01', value: 38500, label: 'January' },
  { date: '2024-02-01', value: 41200, label: 'February' },
  { date: '2024-03-01', value: 38900, label: 'March' },
  { date: '2024-04-01', value: 45600, label: 'April' },
  { date: '2024-05-01', value: 42300, label: 'May' },
  { date: '2024-06-01', value: 47800, label: 'June' },
  { date: '2024-07-01', value: 51200, label: 'July' },
  { date: '2024-08-01', value: 48900, label: 'August' },
  { date: '2024-09-01', value: 53400, label: 'September' },
  { date: '2024-10-01', value: 56700, label: 'October' },
  { date: '2024-11-01', value: 52300, label: 'November' },
  { date: '2024-12-01', value: 48500, label: 'December' },
];

// Mock Job Status Distribution
export const mockJobStatusData: ChartData[] = [
  { name: 'Completed', value: 1189, color: '#10B981', percentage: 95.3 },
  { name: 'In Progress', value: 34, color: '#3B82F6', percentage: 2.7 },
  { name: 'Scheduled', value: 18, color: '#F59E0B', percentage: 1.4 },
  { name: 'Cancelled', value: 6, color: '#EF4444', percentage: 0.5 },
];

// Mock Service Category Performance
export const mockServiceCategoryData: ChartData[] = [
  { name: 'Electrical', value: 145600, color: '#3B82F6', percentage: 30.0 },
  { name: 'Plumbing', value: 123400, color: '#10B981', percentage: 25.4 },
  { name: 'HVAC', value: 98700, color: '#F59E0B', percentage: 20.3 },
  { name: 'General Maintenance', value: 78900, color: '#8B5CF6', percentage: 16.2 },
  { name: 'Emergency Services', value: 39150, color: '#EF4444', percentage: 8.1 },
];

// Mock Customer Satisfaction Data
export const mockSatisfactionData: TimeSeriesData[] = [
  { date: '2024-01-01', value: 4.2, label: 'January' },
  { date: '2024-02-01', value: 4.3, label: 'February' },
  { date: '2024-03-01', value: 4.4, label: 'March' },
  { date: '2024-04-01', value: 4.5, label: 'April' },
  { date: '2024-05-01', value: 4.6, label: 'May' },
  { date: '2024-06-01', value: 4.7, label: 'June' },
  { date: '2024-07-01', value: 4.6, label: 'July' },
  { date: '2024-08-01', value: 4.8, label: 'August' },
  { date: '2024-09-01', value: 4.7, label: 'September' },
  { date: '2024-10-01', value: 4.8, label: 'October' },
  { date: '2024-11-01', value: 4.9, label: 'November' },
  { date: '2024-12-01', value: 4.8, label: 'December' },
];

// Mock Technician Utilization Data
export const mockUtilizationData: TimeSeriesData[] = [
  { date: '2024-01-01', value: 82.5, label: 'January' },
  { date: '2024-02-01', value: 85.2, label: 'February' },
  { date: '2024-03-01', value: 87.1, label: 'March' },
  { date: '2024-04-01', value: 89.3, label: 'April' },
  { date: '2024-05-01', value: 86.7, label: 'May' },
  { date: '2024-06-01', value: 88.9, label: 'June' },
  { date: '2024-07-01', value: 91.2, label: 'July' },
  { date: '2024-08-01', value: 89.8, label: 'August' },
  { date: '2024-09-01', value: 87.4, label: 'September' },
  { date: '2024-10-01', value: 90.1, label: 'October' },
  { date: '2024-11-01', value: 88.6, label: 'November' },
  { date: '2024-12-01', value: 87.3, label: 'December' },
];

// Mock Report Templates
export const mockReportTemplates: ReportData[] = [
  {
    id: 'report-1',
    name: 'Monthly Revenue Report',
    type: 'financial',
    description: 'Comprehensive monthly revenue analysis with trends and forecasts',
    data: mockRevenueData,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z',
    isPublic: true,
    createdBy: 'admin',
  },
  {
    id: 'report-2',
    name: 'Technician Performance',
    type: 'performance',
    description: 'Individual technician performance metrics and rankings',
    data: mockPerformanceMetrics,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z',
    isPublic: true,
    createdBy: 'admin',
  },
  {
    id: 'report-3',
    name: 'Customer Analytics',
    type: 'customer',
    description: 'Customer satisfaction, retention, and lifetime value analysis',
    data: mockCustomerAnalytics,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z',
    isPublic: true,
    createdBy: 'admin',
  },
  {
    id: 'report-4',
    name: 'Operational Efficiency',
    type: 'operational',
    description: 'Operational metrics including utilization, efficiency, and productivity',
    data: mockOperationalMetrics,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z',
    isPublic: true,
    createdBy: 'admin',
  },
];

// Analytics Utility Functions
export const getBusinessMetrics = (): BusinessMetrics => {
  return mockBusinessMetrics;
};

export const getPerformanceMetrics = (): PerformanceMetrics[] => {
  return mockPerformanceMetrics;
};

export const getCustomerAnalytics = (): CustomerAnalytics[] => {
  return mockCustomerAnalytics;
};

export const getOperationalMetrics = (): OperationalMetrics => {
  return mockOperationalMetrics;
};

export const getRevenueTrend = (months: number = 12): TimeSeriesData[] => {
  return mockRevenueData.slice(-months);
};

export const getSatisfactionTrend = (months: number = 12): TimeSeriesData[] => {
  return mockSatisfactionData.slice(-months);
};

export const getUtilizationTrend = (months: number = 12): TimeSeriesData[] => {
  return mockUtilizationData.slice(-months);
};

export const getTopPerformers = (limit: number = 5): PerformanceMetrics[] => {
  return mockPerformanceMetrics
    .sort((a, b) => b.efficiency - a.efficiency)
    .slice(0, limit);
};

export const getTopCustomers = (limit: number = 5): CustomerAnalytics[] => {
  return mockCustomerAnalytics
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit);
};

export const calculateGrowthRate = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

export const calculatePercentage = (part: number, total: number): number => {
  if (total === 0) return 0;
  return (part / total) * 100;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};
