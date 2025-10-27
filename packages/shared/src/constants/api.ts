export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // User endpoints
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  
  // Client endpoints
  CLIENTS: {
    LIST: '/clients',
    CREATE: '/clients',
    GET: (id: string) => `/clients/${id}`,
    UPDATE: (id: string) => `/clients/${id}`,
    DELETE: (id: string) => `/clients/${id}`,
  },
  
  // Lead endpoints
  LEADS: {
    LIST: '/leads',
    CREATE: '/leads',
    GET: (id: string) => `/leads/${id}`,
    UPDATE: (id: string) => `/leads/${id}`,
    DELETE: (id: string) => `/leads/${id}`,
  },
  
  // Quote endpoints
  QUOTES: {
    LIST: '/quotes',
    CREATE: '/quotes',
    GET: (id: string) => `/quotes/${id}`,
    UPDATE: (id: string) => `/quotes/${id}`,
    DELETE: (id: string) => `/quotes/${id}`,
    SEND: (id: string) => `/quotes/${id}/send`,
    ACCEPT: (id: string) => `/quotes/${id}/accept`,
    REJECT: (id: string) => `/quotes/${id}/reject`,
  },
  
  // Job endpoints
  JOBS: {
    LIST: '/jobs',
    CREATE: '/jobs',
    GET: (id: string) => `/jobs/${id}`,
    UPDATE: (id: string) => `/jobs/${id}`,
    DELETE: (id: string) => `/jobs/${id}`,
    ASSIGN: (id: string) => `/jobs/${id}/assign`,
    COMPLETE: (id: string) => `/jobs/${id}/complete`,
  },
  
  // Schedule endpoints
  SCHEDULE: {
    EVENTS: '/schedule/events',
    AVAILABILITY: '/schedule/availability',
    CONFLICTS: '/schedule/conflicts',
  },
  
  // Invoice endpoints
  INVOICES: {
    LIST: '/invoices',
    CREATE: '/invoices',
    GET: (id: string) => `/invoices/${id}`,
    UPDATE: (id: string) => `/invoices/${id}`,
    DELETE: (id: string) => `/invoices/${id}`,
    SEND: (id: string) => `/invoices/${id}/send`,
    PAY: (id: string) => `/invoices/${id}/pay`,
  },
  
  // Payment endpoints
  PAYMENTS: {
    LIST: '/payments',
    CREATE: '/payments',
    GET: (id: string) => `/payments/${id}`,
    METHODS: '/payments/methods',
    XE_PAY_LINK: '/payments/xe-pay/link',
    XE_PAY_STATUS: '/payments/xe-pay/status',
  },
  
  // Inventory endpoints
  INVENTORY: {
    ITEMS: '/inventory/items',
    MOVEMENTS: '/inventory/movements',
    STOCK: '/inventory/stock',
    TRANSFERS: '/inventory/transfers',
  },
  
  // Communication endpoints
  MESSAGES: {
    LIST: '/messages',
    SEND: '/messages/send',
    THREADS: '/messages/threads',
    TEMPLATES: '/messages/templates',
  },
  
  // Compliance endpoints
  COMPLIANCE: {
    DOCUMENTS: '/compliance/documents',
    UPLOAD: '/compliance/documents/upload',
    DELETE: (id: string) => `/compliance/documents/${id}`,
  },
  
  // Analytics endpoints
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    REPORTS: '/analytics/reports',
    KPIS: '/analytics/kpis',
  },
} as const;

export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;
