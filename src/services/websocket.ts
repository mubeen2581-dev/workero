import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { API_BASE_URL } from '@/config/api';

// Declare Pusher on window for Laravel Echo
declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo;
  }
}

// Initialize Pusher
window.Pusher = Pusher;

// Get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Create Echo instance
let echoInstance: Echo | null = null;

export const initializeEcho = (): Echo => {
  if (echoInstance) {
    return echoInstance;
  }

  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  // Extract base URL without /api
  const baseUrl = API_BASE_URL.replace('/api', '');
  const wsHost = baseUrl.replace('http://', '').replace('https://', '').split(':')[0];
  const wsPort = baseUrl.includes('localhost') ? 6001 : 443;
  const wsScheme = baseUrl.includes('https') ? 'https' : 'http';

  echoInstance = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY || 'workero-key',
    wsHost: import.meta.env.VITE_PUSHER_HOST || wsHost,
    wsPort: import.meta.env.VITE_PUSHER_PORT || (wsScheme === 'https' ? 443 : 6001),
    wssPort: import.meta.env.VITE_PUSHER_PORT || 443,
    forceTLS: wsScheme === 'https',
    encrypted: wsScheme === 'https',
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${baseUrl}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
    // Error handling
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
  });

  return echoInstance;
};

export const getEcho = (): Echo | null => {
  if (!echoInstance) {
    try {
      return initializeEcho();
    } catch (error) {
      console.error('Failed to initialize Echo:', error);
      return null;
    }
  }
  return echoInstance;
};

export const disconnectEcho = (): void => {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
};

export const reconnectEcho = (): Echo | null => {
  disconnectEcho();
  return getEcho();
};

