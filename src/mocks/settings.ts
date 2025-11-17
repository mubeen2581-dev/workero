import { Role, Permission } from '@/types';

// Settings and Configuration Types
export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string;
  timezone: string;
  language: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  notifications: NotificationSettings;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  email: {
    enabled: boolean;
    leads: boolean;
    jobs: boolean;
    invoices: boolean;
    payments: boolean;
    system: boolean;
  };
  sms: {
    enabled: boolean;
    urgent: boolean;
    reminders: boolean;
  };
  push: {
    enabled: boolean;
    desktop: boolean;
    mobile: boolean;
  };
  frequency: 'immediate' | 'daily' | 'weekly' | 'never';
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  sidebarCollapsed: boolean;
  compactMode: boolean;
  showTutorials: boolean;
  autoSave: boolean;
  defaultView: 'dashboard' | 'leads' | 'jobs' | 'invoices';
}

export interface BusinessSettings {
  id: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  website: string;
  logo?: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  businessHours: {
    monday: { start: string; end: string; enabled: boolean };
    tuesday: { start: string; end: string; enabled: boolean };
    wednesday: { start: string; end: string; enabled: boolean };
    thursday: { start: string; end: string; enabled: boolean };
    friday: { start: string; end: string; enabled: boolean };
    saturday: { start: string; end: string; enabled: boolean };
    sunday: { start: string; end: string; enabled: boolean };
  };
  taxSettings: {
    enabled: boolean;
    rate: number;
    name: string;
  };
  invoiceSettings: {
    prefix: string;
    nextNumber: number;
    terms: string;
    footer: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationSettings {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'payment' | 'calendar' | 'storage' | 'other';
  provider: string;
  status: 'active' | 'inactive' | 'error';
  configuration: Record<string, any>;
  lastSync?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
    expirationDays: number;
  };
  twoFactor: {
    enabled: boolean;
    method: 'sms' | 'email' | 'app';
  };
  sessionTimeout: number; // minutes
  ipWhitelist: string[];
  auditLogging: boolean;
  dataRetention: {
    enabled: boolean;
    days: number;
  };
}

export interface DataSettings {
  backup: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    retention: number; // days
    location: 'local' | 'cloud';
  };
  export: {
    formats: string[];
    includeDeleted: boolean;
    dateRange: {
      start: string;
      end: string;
    };
  };
  import: {
    allowedFormats: string[];
    maxFileSize: number; // MB
  };
}

export interface SystemSettings {
  maintenance: {
    enabled: boolean;
    message: string;
    startTime: string;
    endTime: string;
  };
  updates: {
    autoUpdate: boolean;
    notifyUpdates: boolean;
    currentVersion: string;
    latestVersion: string;
  };
  performance: {
    cacheEnabled: boolean;
    cacheTimeout: number; // minutes
    compressionEnabled: boolean;
  };
}

// Mock User Profiles
export const mockUserProfiles: UserProfile[] = [
  {
    id: 'profile-1',
    userId: 'user-1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@workero.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Operations Manager with 10+ years experience in field service management.',
    timezone: 'America/New_York',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    notifications: {
      email: {
        enabled: true,
        leads: true,
        jobs: true,
        invoices: true,
        payments: true,
        system: true,
      },
      sms: {
        enabled: true,
        urgent: true,
        reminders: false,
      },
      push: {
        enabled: true,
        desktop: true,
        mobile: true,
      },
      frequency: 'immediate',
    },
    preferences: {
      theme: 'light',
      sidebarCollapsed: false,
      compactMode: false,
      showTutorials: true,
      autoSave: true,
      defaultView: 'dashboard',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-15T14:30:00Z',
  },
  {
    id: 'profile-2',
    userId: 'user-2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@workero.com',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Senior Technician specializing in electrical and HVAC systems.',
    timezone: 'America/Los_Angeles',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '24h',
    notifications: {
      email: {
        enabled: true,
        leads: false,
        jobs: true,
        invoices: false,
        payments: false,
        system: true,
      },
      sms: {
        enabled: true,
        urgent: true,
        reminders: true,
      },
      push: {
        enabled: true,
        desktop: false,
        mobile: true,
      },
      frequency: 'immediate',
    },
    preferences: {
      theme: 'dark',
      sidebarCollapsed: true,
      compactMode: true,
      showTutorials: false,
      autoSave: true,
      defaultView: 'jobs',
    },
    createdAt: '2024-02-20T09:15:00Z',
    updatedAt: '2024-12-10T16:45:00Z',
  },
];

// Mock Business Settings
export const mockBusinessSettings: BusinessSettings = {
  id: 'business-1',
  companyName: 'Workero Services',
  companyEmail: 'info@workero.com',
  companyPhone: '+1 (555) 123-4567',
  companyAddress: {
    street: '123 Business Ave',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
  },
  website: 'https://workero.com',
  logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
  timezone: 'America/New_York',
  currency: 'GBP',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  businessHours: {
    monday: { start: '08:00', end: '18:00', enabled: true },
    tuesday: { start: '08:00', end: '18:00', enabled: true },
    wednesday: { start: '08:00', end: '18:00', enabled: true },
    thursday: { start: '08:00', end: '18:00', enabled: true },
    friday: { start: '08:00', end: '18:00', enabled: true },
    saturday: { start: '09:00', end: '15:00', enabled: true },
    sunday: { start: '10:00', end: '14:00', enabled: false },
  },
  taxSettings: {
    enabled: true,
    rate: 8.5,
    name: 'Sales Tax',
  },
  invoiceSettings: {
    prefix: 'INV',
    nextNumber: 1001,
    terms: 'Payment due within 15 days of invoice date.',
    footer: 'Thank you for your business!',
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-12-15T10:30:00Z',
};

// Mock Integration Settings
export const mockIntegrationSettings: IntegrationSettings[] = [
  {
    id: 'integration-1',
    name: 'Email Service',
    type: 'email',
    provider: 'SendGrid',
    status: 'active',
    configuration: {
      apiKey: 'SG.****',
      fromEmail: 'noreply@workero.com',
      fromName: 'Workero Services',
    },
    lastSync: '2024-12-15T14:30:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-15T14:30:00Z',
  },
  {
    id: 'integration-2',
    name: 'SMS Service',
    type: 'sms',
    provider: 'Twilio',
    status: 'active',
    configuration: {
      accountSid: 'AC****',
      authToken: '****',
      fromNumber: '+15551234567',
    },
    lastSync: '2024-12-15T14:25:00Z',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-12-15T14:25:00Z',
  },
  {
    id: 'integration-3',
    name: 'Payment Processing',
    type: 'payment',
    provider: 'Stripe',
    status: 'active',
    configuration: {
      publishableKey: 'pk_****',
      secretKey: 'sk_****',
      webhookSecret: 'whsec_****',
    },
    lastSync: '2024-12-15T14:20:00Z',
    createdAt: '2024-03-01T11:00:00Z',
    updatedAt: '2024-12-15T14:20:00Z',
  },
  {
    id: 'integration-4',
    name: 'Calendar Sync',
    type: 'calendar',
    provider: 'Google Calendar',
    status: 'inactive',
    configuration: {
      clientId: '****',
      clientSecret: '****',
      calendarId: 'primary',
    },
    createdAt: '2024-04-01T14:00:00Z',
    updatedAt: '2024-12-01T16:00:00Z',
  },
];

// Mock Security Settings
export const mockSecuritySettings: SecuritySettings = {
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    expirationDays: 90,
  },
  twoFactor: {
    enabled: true,
    method: 'app',
  },
  sessionTimeout: 480, // 8 hours
  ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
  auditLogging: true,
  dataRetention: {
    enabled: true,
    days: 2555, // 7 years
  },
};

// Mock Data Settings
export const mockDataSettings: DataSettings = {
  backup: {
    enabled: true,
    frequency: 'daily',
    retention: 30,
    location: 'cloud',
  },
  export: {
    formats: ['CSV', 'Excel', 'PDF', 'JSON'],
    includeDeleted: false,
    dateRange: {
      start: '2024-01-01',
      end: '2024-12-31',
    },
  },
  import: {
    allowedFormats: ['CSV', 'Excel'],
    maxFileSize: 10,
  },
};

// Mock System Settings
export const mockSystemSettings: SystemSettings = {
  maintenance: {
    enabled: false,
    message: 'System maintenance in progress. Please try again later.',
    startTime: '2024-12-20T02:00:00Z',
    endTime: '2024-12-20T04:00:00Z',
  },
  updates: {
    autoUpdate: true,
    notifyUpdates: true,
    currentVersion: '1.2.3',
    latestVersion: '1.2.4',
  },
  performance: {
    cacheEnabled: true,
    cacheTimeout: 30,
    compressionEnabled: true,
  },
};

// Mock Roles and Permissions
export const mockRoles: Role[] = [
  {
    id: 'role-1',
    name: 'Admin',
    description: 'Full system access',
    permissions: ['*'],
    isDefault: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-2',
    name: 'Manager',
    description: 'Management access to leads, jobs, and reports',
    permissions: ['leads:read', 'leads:write', 'jobs:read', 'jobs:write', 'reports:read'],
    isDefault: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-3',
    name: 'Technician',
    description: 'Field technician access',
    permissions: ['jobs:read', 'jobs:update', 'customers:read'],
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-4',
    name: 'Dispatcher',
    description: 'Job scheduling and dispatch',
    permissions: ['jobs:read', 'jobs:write', 'scheduling:read', 'scheduling:write'],
    isDefault: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockPermissions: Permission[] = [
  { id: 'perm-1', name: 'leads:read', description: 'View leads' },
  { id: 'perm-2', name: 'leads:write', description: 'Create and edit leads' },
  { id: 'perm-3', name: 'leads:delete', description: 'Delete leads' },
  { id: 'perm-4', name: 'jobs:read', description: 'View jobs' },
  { id: 'perm-5', name: 'jobs:write', description: 'Create and edit jobs' },
  { id: 'perm-6', name: 'jobs:delete', description: 'Delete jobs' },
  { id: 'perm-7', name: 'invoices:read', description: 'View invoices' },
  { id: 'perm-8', name: 'invoices:write', description: 'Create and edit invoices' },
  { id: 'perm-9', name: 'reports:read', description: 'View reports' },
  { id: 'perm-10', name: 'settings:read', description: 'View settings' },
  { id: 'perm-11', name: 'settings:write', description: 'Modify settings' },
  { id: 'perm-12', name: 'users:read', description: 'View users' },
  { id: 'perm-13', name: 'users:write', description: 'Create and edit users' },
  { id: 'perm-14', name: 'users:delete', description: 'Delete users' },
];

// Utility Functions
export const getUserProfile = (userId: string): UserProfile | undefined => {
  return mockUserProfiles.find(profile => profile.userId === userId);
};

export const updateUserProfile = (userId: string, updates: Partial<UserProfile>): UserProfile | null => {
  const profileIndex = mockUserProfiles.findIndex(profile => profile.userId === userId);
  if (profileIndex === -1) return null;
  
  mockUserProfiles[profileIndex] = {
    ...mockUserProfiles[profileIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  return mockUserProfiles[profileIndex];
};

export const getBusinessSettings = (): BusinessSettings => {
  return mockBusinessSettings;
};

export const updateBusinessSettings = (updates: Partial<BusinessSettings>): BusinessSettings => {
  Object.assign(mockBusinessSettings, updates, {
    updatedAt: new Date().toISOString(),
  });
  return mockBusinessSettings;
};

export const getIntegrationSettings = (): IntegrationSettings[] => {
  return mockIntegrationSettings;
};

export const updateIntegrationSettings = (id: string, updates: Partial<IntegrationSettings>): IntegrationSettings | null => {
  const integrationIndex = mockIntegrationSettings.findIndex(integration => integration.id === id);
  if (integrationIndex === -1) return null;
  
  mockIntegrationSettings[integrationIndex] = {
    ...mockIntegrationSettings[integrationIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  return mockIntegrationSettings[integrationIndex];
};

export const getSecuritySettings = (): SecuritySettings => {
  return mockSecuritySettings;
};

export const updateSecuritySettings = (updates: Partial<SecuritySettings>): SecuritySettings => {
  Object.assign(mockSecuritySettings, updates);
  return mockSecuritySettings;
};

export const getDataSettings = (): DataSettings => {
  return mockDataSettings;
};

export const updateDataSettings = (updates: Partial<DataSettings>): DataSettings => {
  Object.assign(mockDataSettings, updates);
  return mockDataSettings;
};

export const getSystemSettings = (): SystemSettings => {
  return mockSystemSettings;
};

export const updateSystemSettings = (updates: Partial<SystemSettings>): SystemSettings => {
  Object.assign(mockSystemSettings, updates);
  return mockSystemSettings;
};

export const getRoles = (): Role[] => {
  return mockRoles;
};

export const getPermissions = (): Permission[] => {
  return mockPermissions;
};

export const validatePassword = (password: string, policy: SecuritySettings['passwordPolicy']): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < policy.minLength) {
    errors.push(`Password must be at least ${policy.minLength} characters long`);
  }
  
  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (policy.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (policy.requireSymbols && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getTimezoneOptions = () => {
  return [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
  ];
};

export const getLanguageOptions = () => {
  return [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Português' },
    { value: 'zh', label: '中文' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' },
  ];
};

export const getCurrencyOptions = () => {
  return [
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'AUD', label: 'Australian Dollar (A$)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
    { value: 'CNY', label: 'Chinese Yuan (¥)' },
    { value: 'INR', label: 'Indian Rupee (₹)' },
    { value: 'BRL', label: 'Brazilian Real (R$)' },
  ];
};
