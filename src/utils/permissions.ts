/**
 * Role-Based Access Control (RBAC) Utilities
 * 
 * This file defines permissions for each role and provides
 * utility functions to check user permissions.
 */

export type UserRole = 
  | 'admin' 
  | 'manager' 
  | 'technician' 
  | 'dispatcher' 
  | 'warehouse' 
  | 'client';

export type Permission = 
  // CRM
  | 'crm.view' | 'crm.create' | 'crm.update' | 'crm.delete'
  // Quotes
  | 'quotes.view' | 'quotes.create' | 'quotes.update' | 'quotes.delete' | 'quotes.send' | 'quotes.approve' | 'quotes.view.own'
  // Jobs
  | 'jobs.view' | 'jobs.create' | 'jobs.update' | 'jobs.delete' | 'jobs.assign' | 'jobs.complete' | 'jobs.view.own'
  // Scheduling
  | 'scheduling.view' | 'scheduling.create' | 'scheduling.update' | 'scheduling.delete'
  // Inventory
  | 'inventory.view' | 'inventory.create' | 'inventory.update' | 'inventory.delete' | 'inventory.transfer' | 'inventory.audit'
  // Invoicing
  | 'invoices.view' | 'invoices.create' | 'invoices.update' | 'invoices.delete' | 'invoices.send' | 'invoices.view.own'
  // Payments
  | 'payments.view' | 'payments.create' | 'payments.update'
  // Reports
  | 'reports.view' | 'reports.export' | 'reports.view.inventory'
  // Compliance
  | 'compliance.view' | 'compliance.create' | 'compliance.update' | 'compliance.delete'
  // Users
  | 'users.view' | 'users.create' | 'users.update' | 'users.delete'
  // AI Tools
  | 'ai.scheduling' | 'ai.quoting' | 'ai.inventory'
  // Communication
  | 'communication.view' | 'communication.send' | 'communication.view.own'
  // Settings
  | 'settings.view' | 'settings.update';

/**
 * Role permissions configuration
 */
const rolePermissions: Record<UserRole, Record<Permission, boolean>> = {
  admin: {
    // CRM
    'crm.view': true,
    'crm.create': true,
    'crm.update': true,
    'crm.delete': true,
    // Quotes
    'quotes.view': true,
    'quotes.create': true,
    'quotes.update': true,
    'quotes.delete': true,
    'quotes.send': true,
    'quotes.approve': true,
    'quotes.view.own': false,
    // Jobs
    'jobs.view': true,
    'jobs.create': true,
    'jobs.update': true,
    'jobs.delete': true,
    'jobs.assign': true,
    'jobs.complete': true,
    'jobs.view.own': false,
    // Scheduling
    'scheduling.view': true,
    'scheduling.create': true,
    'scheduling.update': true,
    'scheduling.delete': true,
    // Inventory
    'inventory.view': true,
    'inventory.create': false,
    'inventory.update': false,
    'inventory.delete': false,
    'inventory.transfer': false,
    'inventory.audit': false,
    // Invoicing
    'invoices.view': true,
    'invoices.create': true,
    'invoices.update': true,
    'invoices.delete': true,
    'invoices.send': true,
    'invoices.view.own': false,
    // Payments
    'payments.view': true,
    'payments.create': true,
    'payments.update': true,
    // Reports
    'reports.view': true,
    'reports.export': true,
    'reports.view.inventory': true,
    // Compliance
    'compliance.view': true,
    'compliance.create': true,
    'compliance.update': true,
    'compliance.delete': true,
    // Users
    'users.view': true,
    'users.create': true,
    'users.update': true,
    'users.delete': true,
    // AI Tools
    'ai.scheduling': true,
    'ai.quoting': true,
    'ai.inventory': true,
    // Communication
    'communication.view': true,
    'communication.send': true,
    'communication.view.own': false,
    // Settings
    'settings.view': true,
    'settings.update': true,
  },

  manager: {
    // Same as admin
    'crm.view': true,
    'crm.create': true,
    'crm.update': true,
    'crm.delete': true,
    'quotes.view': true,
    'quotes.create': true,
    'quotes.update': true,
    'quotes.delete': true,
    'quotes.send': true,
    'quotes.approve': true,
    'quotes.view.own': false,
    'jobs.view': true,
    'jobs.create': true,
    'jobs.update': true,
    'jobs.delete': true,
    'jobs.assign': true,
    'jobs.complete': true,
    'jobs.view.own': false,
    'scheduling.view': true,
    'scheduling.create': true,
    'scheduling.update': true,
    'scheduling.delete': true,
    'inventory.view': true,
    'inventory.create': false,
    'inventory.update': false,
    'inventory.delete': false,
    'inventory.transfer': false,
    'inventory.audit': false,
    'invoices.view': true,
    'invoices.create': true,
    'invoices.update': true,
    'invoices.delete': true,
    'invoices.send': true,
    'invoices.view.own': false,
    'payments.view': true,
    'payments.create': true,
    'payments.update': true,
    'reports.view': true,
    'reports.export': true,
    'reports.view.inventory': true,
    'compliance.view': true,
    'compliance.create': true,
    'compliance.update': true,
    'compliance.delete': true,
    'users.view': true,
    'users.create': true,
    'users.update': true,
    'users.delete': true,
    'ai.scheduling': true,
    'ai.quoting': true,
    'ai.inventory': true,
    'communication.view': true,
    'communication.send': true,
    'communication.view.own': false,
    'settings.view': true,
    'settings.update': true,
  },

  technician: {
    // Jobs (limited)
    'jobs.view': true,
    'jobs.create': false,
    'jobs.update': true,
    'jobs.delete': false,
    'jobs.assign': false,
    'jobs.complete': true,
    'jobs.view.own': true,
    // Quotes (create/update on-site)
    'quotes.view': true,
    'quotes.create': true,
    'quotes.update': true,
    'quotes.delete': false,
    'quotes.send': false,
    'quotes.approve': false,
    'quotes.view.own': false,
    // No access
    'crm.view': false,
    'crm.create': false,
    'crm.update': false,
    'crm.delete': false,
    'invoices.view': false,
    'invoices.create': false,
    'invoices.update': false,
    'invoices.delete': false,
    'invoices.send': false,
    'invoices.view.own': false,
    'payments.view': false,
    'payments.create': false,
    'payments.update': false,
    'reports.view': false,
    'reports.export': false,
    'reports.view.inventory': false,
    'compliance.view': false,
    'compliance.create': false,
    'compliance.update': false,
    'compliance.delete': false,
    'users.view': false,
    'users.create': false,
    'users.update': false,
    'users.delete': false,
    'scheduling.view': false,
    'scheduling.create': false,
    'scheduling.update': false,
    'scheduling.delete': false,
    'inventory.view': false,
    'inventory.create': false,
    'inventory.update': false,
    'inventory.delete': false,
    'inventory.transfer': false,
    'inventory.audit': false,
    // Communication (limited)
    'communication.view': true,
    'communication.send': true,
    'communication.view.own': true,
    // AI Tools (limited)
    'ai.scheduling': false,
    'ai.quoting': true,
    'ai.inventory': false,
    // Settings
    'settings.view': false,
    'settings.update': false,
  },

  dispatcher: {
    // CRM
    'crm.view': true,
    'crm.create': true,
    'crm.update': true,
    'crm.delete': false,
    // Quotes
    'quotes.view': true,
    'quotes.create': true,
    'quotes.update': true,
    'quotes.delete': false,
    'quotes.send': true,
    'quotes.approve': true,
    'quotes.view.own': false,
    // Jobs (view only)
    'jobs.view': true,
    'jobs.create': false,
    'jobs.update': false,
    'jobs.delete': false,
    'jobs.assign': false,
    'jobs.complete': false,
    'jobs.view.own': false,
    // Invoicing
    'invoices.view': true,
    'invoices.create': true,
    'invoices.update': true,
    'invoices.delete': false,
    'invoices.send': true,
    'invoices.view.own': false,
    // Payments
    'payments.view': true,
    'payments.create': true,
    'payments.update': false,
    // Communication
    'communication.view': true,
    'communication.send': true,
    'communication.view.own': false,
    // Reports (limited)
    'reports.view': true,
    'reports.export': false,
    'reports.view.inventory': false,
    // Compliance
    'compliance.view': true,
    'compliance.create': true,
    'compliance.update': true,
    'compliance.delete': false,
    // No access
    'users.view': false,
    'users.create': false,
    'users.update': false,
    'users.delete': false,
    'scheduling.view': false,
    'scheduling.create': false,
    'scheduling.update': false,
    'scheduling.delete': false,
    'inventory.view': false,
    'inventory.create': false,
    'inventory.update': false,
    'inventory.delete': false,
    'inventory.transfer': false,
    'inventory.audit': false,
    'ai.scheduling': false,
    'ai.quoting': false,
    'ai.inventory': false,
    'settings.view': false,
    'settings.update': false,
  },

  warehouse: {
    // Inventory (full access)
    'inventory.view': true,
    'inventory.create': true,
    'inventory.update': true,
    'inventory.delete': true,
    'inventory.transfer': true,
    'inventory.audit': true,
    // Reports (inventory only)
    'reports.view': true,
    'reports.export': false,
    'reports.view.inventory': true,
    // No access to other features
    'crm.view': false,
    'crm.create': false,
    'crm.update': false,
    'crm.delete': false,
    'quotes.view': false,
    'quotes.create': false,
    'quotes.update': false,
    'quotes.delete': false,
    'quotes.send': false,
    'quotes.approve': false,
    'quotes.view.own': false,
    'jobs.view': false,
    'jobs.create': false,
    'jobs.update': false,
    'jobs.delete': false,
    'jobs.assign': false,
    'jobs.complete': false,
    'jobs.view.own': false,
    'invoices.view': false,
    'invoices.create': false,
    'invoices.update': false,
    'invoices.delete': false,
    'invoices.send': false,
    'invoices.view.own': false,
    'payments.view': false,
    'payments.create': false,
    'payments.update': false,
    'compliance.view': false,
    'compliance.create': false,
    'compliance.update': false,
    'compliance.delete': false,
    'users.view': false,
    'users.create': false,
    'users.update': false,
    'users.delete': false,
    'scheduling.view': false,
    'scheduling.create': false,
    'scheduling.update': false,
    'scheduling.delete': false,
    'ai.scheduling': false,
    'ai.quoting': false,
    'ai.inventory': false,
    'communication.view': false,
    'communication.send': false,
    'communication.view.own': false,
    'settings.view': false,
    'settings.update': false,
  },

  client: {
    // View-only access
    'quotes.view': true,
    'quotes.create': false,
    'quotes.update': false,
    'quotes.delete': false,
    'quotes.send': false,
    'quotes.approve': true,
    'quotes.view.own': true,
    'jobs.view': true,
    'jobs.create': false,
    'jobs.update': false,
    'jobs.delete': false,
    'jobs.assign': false,
    'jobs.complete': false,
    'jobs.view.own': true,
    'invoices.view': true,
    'invoices.create': false,
    'invoices.update': false,
    'invoices.delete': false,
    'invoices.send': false,
    'invoices.view.own': true,
    'payments.view': true,
    'payments.create': true,
    'payments.update': false,
    // No other access
    'crm.view': false,
    'crm.create': false,
    'crm.update': false,
    'crm.delete': false,
    'reports.view': false,
    'reports.export': false,
    'reports.view.inventory': false,
    'compliance.view': false,
    'compliance.create': false,
    'compliance.update': false,
    'compliance.delete': false,
    'users.view': false,
    'users.create': false,
    'users.update': false,
    'users.delete': false,
    'scheduling.view': false,
    'scheduling.create': false,
    'scheduling.update': false,
    'scheduling.delete': false,
    'inventory.view': false,
    'inventory.create': false,
    'inventory.update': false,
    'inventory.delete': false,
    'inventory.transfer': false,
    'inventory.audit': false,
    'communication.view': false,
    'communication.send': false,
    'communication.view.own': false,
    'ai.scheduling': false,
    'ai.quoting': false,
    'ai.inventory': false,
    'settings.view': false,
    'settings.update': false,
  },
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.[permission] ?? false;
}

/**
 * Check if current user has a permission
 */
export function can(userRole: UserRole | undefined, permission: Permission): boolean {
  if (!userRole) return false;
  return hasPermission(userRole, permission);
}

/**
 * Check if user has any of the provided permissions
 */
export function canAny(userRole: UserRole | undefined, permissions: Permission[]): boolean {
  if (!userRole) return false;
  return permissions.some(permission => hasPermission(userRole, permission));
}

/**
 * Check if user has all of the provided permissions
 */
export function canAll(userRole: UserRole | undefined, permissions: Permission[]): boolean {
  if (!userRole) return false;
  return permissions.every(permission => hasPermission(userRole, permission));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Record<Permission, boolean> {
  return rolePermissions[role] || {};
}

/**
 * Get role display name
 */
export function getRoleName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    admin: 'Business Owner / Manager',
    manager: 'Business Owner / Manager',
    technician: 'Technician / Driver',
    dispatcher: 'Office Admin',
    warehouse: 'Warehouse / Stock Manager',
    client: 'Client',
  };
  return roleNames[role] || role;
}

