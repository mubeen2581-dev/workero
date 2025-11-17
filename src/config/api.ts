// API Configuration
// Automatically detect production environment and use appropriate API URL
const isProduction = import.meta.env.PROD;
const defaultApiUrl = isProduction 
  ? 'https://api-workero.xepos.co.uk'  // Production default (HTTPS required for mixed content)
  : 'http://localhost:3001/api';            // Development default

export const API_BASE_URL = import.meta.env.VITE_API_URL || defaultApiUrl;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    PROFILE: '/auth/profile',
    AVATAR: '/auth/profile/avatar',
    PASSWORD: '/auth/password',
  },
  LEADS: {
    BASE: '/leads',
    WORKLOADS: '/leads/workloads',
    DISTRIBUTE: '/leads/distribute',
  },
  CLIENTS: {
    BASE: '/clients',
  },
} as const;

