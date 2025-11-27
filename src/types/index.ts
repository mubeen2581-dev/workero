// Core entity types for Workero Admin Dashboard

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'technician' | 'dispatcher' | 'warehouse' | 'client';
  avatar?: string;
  skills?: string[]; // optional skills for technician matching
  team?: string; // optional team grouping
  region?: string; // optional region grouping
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
  client_id?: string;
  clientId?: string;
  client?: Client;
  source: 'website' | 'referral' | 'advertisement' | 'cold_call' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'quoted' | 'converted' | 'lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimated_value?: number;
  estimatedValue?: number;
  notes?: string;
  assigned_to?: string;
  assignedTo?: string;
  assigned_user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  user_id?: string;
  type: 'created' | 'status_changed' | 'assigned' | 'note_added' | 'contacted' | 'quote_sent' | 'converted' | 'lost' | 'updated';
  description: string;
  metadata?: Record<string, any>;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface LeadWorkload {
  user_id: string;
  user_name: string;
  role: string;
  total_leads: number;
  active_leads: number;
  urgent_leads: number;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  lineTotal: number;
  groupName?: string | null;
  sortOrder?: number;
  optionType?: 'good' | 'better' | 'best' | 'optional' | 'required' | null;
  materialChoiceId?: string | null;
  materialOptions?: MaterialOption[];
  isOptional?: boolean;
  category?: string | null;
}

export interface MaterialOption {
  id: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  priceDifference: number;
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
  options?: Record<string, any>;
  hasSignature?: boolean;
  requiresEsignature?: boolean;
  esignatureSentAt?: string;
  esignatureSignedAt?: string;
  esignatureStatus?: 'pending' | 'sent' | 'signed' | 'declined';
  packageType?: 'basic' | 'standard' | 'premium' | null;
  variants?: Record<string, any>;
  depositAmount?: number;
  depositPercentage?: number;
  paymentSchedule?: Array<{
    id: string;
    name: string;
    description: string;
    amount: number;
    percentage: number;
    dueDate?: string;
    type: 'deposit' | 'milestone' | 'final';
    trigger: 'signature' | 'completion' | 'date';
  }>;
  permitCosts?: Array<{
    id: string;
    type: string;
    description: string;
    cost: number;
    category: string;
    required: boolean;
  }>;
  totalPermitCost?: number;
  contractGenerated?: boolean;
  contractTemplateId?: string | null;
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
  estimatedCost?: number;
  actualCost?: number;
  laborCost?: number;
  materialCost?: number;
  profitMargin?: number;
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
  jobId?: string | null;
  technicianId?: string | null;
  recurringScheduleId?: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  type: 'job' | 'break' | 'training' | 'maintenance' | 'meeting';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  description?: string | null;
  location?: string | null;
  color?: string | null;
  travelTimeMinutes?: number | null;
  bufferMinutes?: number | null;
  flexibilityMinutes?: number | null;
  metadata?: Record<string, any> | null;
  job?: any;
  technician?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScheduleAvailabilitySlot {
  start: string;
  end: string;
  durationMinutes: number;
  dayOfWeek: number;
  timezone?: string;
}

export interface ScheduleConflict {
  technicianId: string;
  type: 'overlap' | 'workload';
  events?: Array<{
    id: string;
    title: string;
    start: string;
    end: string;
    job_id?: string | null;
    status: string;
  }>;
  date?: string;
  scheduledJobs?: number;
  message?: string;
}

export interface RecurringSchedule {
  id: string;
  companyId: string;
  jobId?: string | null;
  technicianId?: string | null;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval: number;
  weekdays?: number[] | null;
  monthDay?: number | null;
  startDate: string;
  endDate?: string | null;
  timezone?: string | null;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  nextOccurrence?: string | null;
  constraints?: {
    title?: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    location?: string;
    color?: string;
    duration_minutes?: number;
    custom_dates?: string[];
    [key: string]: any;
  };
  job?: Job;
  technician?: User;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * @deprecated Legacy mock data interface
 */
export interface Availability {
  id: string;
  technicianId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * @deprecated Legacy mock data interface for older UI components.
 */
export interface RecurringJob {
  id: string;
  title: string;
  description: string;
  clientId: string;
  client: Client;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  dayOfWeek: number;
  startTime: string;
  duration: number;
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

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  lineTotal: number;
}

export interface Invoice {
  id: string;
  jobId: string;
  job: Job;
  clientId: string;
  client: Client;
  items: InvoiceItem[];
  amount: number;
  taxAmount: number;
  total: number;
  currency?: string; // Multi-currency support
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
  company_id?: string;
  warehouse_id?: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  category: string;
  quantity: number;
  current_stock?: number;
  currentStock?: number;
  min_quantity?: number;
  minQuantity?: number;
  min_stock?: number;
  minStock?: number;
  max_quantity?: number;
  maxQuantity?: number;
  max_stock?: number;
  maxStock?: number;
  unit_price?: number;
  unitPrice?: number;
  cost_price?: number;
  costPrice?: number;
  reorder_point?: number;
  reorderPoint?: number;
  location: 'warehouse' | 'van_1' | 'van_2' | 'van_3' | 'A-1-15' | 'B-2-08' | 'C-3-12' | 'D-4-25' | 'E-5-18' | 'F-6-02' | string;
  last_audit_date?: string;
  lastAuditDate?: string;
  warehouse?: Warehouse;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StockMovement {
  id: string;
  company_id?: string;
  item_id?: string;
  itemId?: string;
  item?: InventoryItem;
  type: 'in' | 'out' | 'transfer' | 'adjustment';
  quantity: number;
  from_location?: string;
  fromLocation?: string;
  to_location?: string;
  toLocation?: string;
  reason: string;
  reference?: string;
  performed_by?: string;
  performedBy?: string;
  performed_at?: string;
  performedAt?: string;
  performer?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  company_id?: string;
  name: string;
  contact_person?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  zipCode?: string;
  country?: string;
  website?: string;
  notes?: string;
  is_active?: boolean;
  isActive?: boolean;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Warehouse {
  id: string;
  company_id?: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  zipCode?: string;
  country?: string;
  contact_person?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  is_active?: boolean;
  isActive?: boolean;
  notes?: string;
  inventory_items?: InventoryItem[];
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VanStock {
  id: string;
  company_id?: string;
  technician_id?: string;
  technicianId?: string;
  item_id?: string;
  itemId?: string;
  item?: InventoryItem;
  technician?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  quantity: number;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobMaterial {
  id: string;
  company_id?: string;
  job_id?: string;
  jobId?: string;
  item_id?: string;
  itemId?: string;
  item?: InventoryItem;
  quantity: number;
  unit_cost?: number;
  unitCost?: number;
  total_cost?: number;
  totalCost?: number;
  status: 'issued' | 'returned' | 'wasted';
  issued_by?: string;
  issuedBy?: string;
  issuer?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  issued_at?: string;
  issuedAt?: string;
  issued_from?: string;
  issuedFrom?: string;
  issued_from_type?: string;
  issuedFromType?: string;
  returned_at?: string;
  returnedAt?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplier: Supplier;
  items: {
    itemId: string;
    item: InventoryItem;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  orderDate: string;
  expectedDelivery: string;
  receivedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color?: string;
  itemCount?: number;
  parentId?: string;
  isActive: boolean;
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
