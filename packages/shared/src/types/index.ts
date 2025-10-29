// Core entity types for Workero Platform

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'technician' | 'dispatcher';
  avatar?: string;
  skills?: string[]; // optional skills for technician matching
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  tags: string[];
  leadScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  clientId: string;
  client: Client;
  source: 'website' | 'referral' | 'advertisement' | 'cold_call' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'quoted' | 'converted' | 'lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedValue: number;
  notes: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  lineTotal: number;
}

export interface Quote {
  id: string;
  clientId: string;
  client: Client;
  items: QuoteItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  profitMargin: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  clientId: string;
  client: Client;
  quoteId?: string;
  title: string;
  description: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration: number; // in hours
  actualDuration?: number;
  assignedTechnician?: string;
  scheduledDate: string;
  completedDate?: string;
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  materials: Material[];
  photos: string[];
  notes: string;
  signature?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  jobId?: string;
  technicianId?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  type: 'job' | 'break' | 'training' | 'maintenance';
  description?: string;
  location?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Availability {
  id: string;
  technicianId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringJob {
  id: string;
  title: string;
  description: string;
  clientId: string;
  client: Client;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // HH:MM format
  duration: number; // in hours
  isActive: boolean;
  nextOccurrence: Date;
  createdAt: string;
  updatedAt: string;
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

export interface Invoice {
  id: string;
  jobId: string;
  job: Job;
  clientId: string;
  client: Client;
  amount: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'xe_pay';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  unitPrice: number;
  location: 'warehouse' | 'van_1' | 'van_2' | 'van_3';
  lastAuditDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: 'lead_created' | 'quote_sent' | 'job_scheduled' | 'job_completed' | 'invoice_sent' | 'payment_received';
  entityId: string;
  entityType: 'lead' | 'quote' | 'job' | 'invoice';
  description: string;
  userId: string;
  user: User;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface KPIMetric {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  format: 'currency' | 'number' | 'percentage';
  icon: string;
  color: string;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
  [key: string]: any;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface CreateLeadForm {
  name: string;
  email: string;
  phone: string;
  source: Lead['source'];
  notes: string;
  tags: string[];
}

// Store types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface UIState {
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  unreadCount: number;
}

// Invoice and Billing types
export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: 'credit_card' | 'bank_transfer' | 'check' | 'cash' | 'xe_pay' | 'apple_pay' | 'google_pay';
  paymentDate: string;
  reference: string;
  notes?: string;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  xePayTransactionId?: string;
  createdAt: string;
}

export interface XEPayLink {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  paymentUrl: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'used';
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'digital_wallet';
  name: string;
  icon: string;
  enabled: boolean;
  fees?: {
    percentage: number;
    fixed: number;
  };
}

export interface RecurringBilling {
  id: string;
  clientId: string;
  client: Client;
  description: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  nextBillingDate: string;
  isActive: boolean;
  createdAt: string;
}

// Settings and Configuration types
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

// Compliance & Documents
export type DocumentStatus = 'valid' | 'expiring' | 'expired';
export interface ComplianceDocument {
  id: string;
  entityType: 'user' | 'company' | 'vehicle' | 'job';
  entityId: string;
  type: 'insurance' | 'certification' | 'license' | 'rams' | 'other';
  name: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  expiresAt?: string;
  status: DocumentStatus;
  notes?: string;
}

// Driver App specific types
export interface DriverJob {
  id: string;
  title: string;
  description: string;
  client: Client;
  status: 'assigned' | 'en_route' | 'on_site' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate: string;
  estimatedDuration: number;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  materials: Material[];
  photos: string[];
  notes: string;
  signature?: string;
  clockInTime?: string;
  clockOutTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClockEntry {
  id: string;
  jobId: string;
  technicianId: string;
  clockInTime: string;
  clockOutTime?: string;
  location: {
    lat: number;
    lng: number;
  };
  notes?: string;
  createdAt: string;
}

// Client Portal specific types
export interface ClientQuote {
  id: string;
  items: QuoteItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: string;
  notes: string;
  createdAt: string;
}

export interface ClientJob {
  id: string;
  title: string;
  description: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  completedDate?: string;
  technician?: {
    name: string;
    phone: string;
    photo?: string;
  };
  location: {
    address: string;
  };
  photos: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}
