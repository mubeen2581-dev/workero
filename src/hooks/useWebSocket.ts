import { useEffect, useRef } from 'react';
import { getEcho, disconnectEcho, reconnectEcho } from '@/services/websocket';
import { useAuthStore } from '@/stores/authStore';

interface UseWebSocketOptions {
  onMessage?: (message: any) => void;
  onNotification?: (notification: any) => void;
  conversationId?: string;
  userId?: string;
  companyId?: string;
  enabled?: boolean;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    onMessage,
    onNotification,
    conversationId,
    userId,
    companyId,
    enabled = true,
  } = options;

  const { user, isAuthenticated } = useAuthStore();
  const echoRef = useRef<any>(null);
  const channelsRef = useRef<any[]>([]);

  useEffect(() => {
    if (!enabled || !isAuthenticated || !user) {
      return;
    }

    try {
      const echo = getEcho();
      if (!echo) {
        console.warn('Echo not available, falling back to polling');
        return;
      }

      echoRef.current = echo;
      const channels: any[] = [];

      // Listen to user's private channel for notifications
      if (onNotification && user.id) {
        const userChannel = echo.private(`user.${user.id}`);
        userChannel.listen('.notification.created', (data: any) => {
          onNotification(data);
        });
        channels.push(userChannel);
      }

      // Listen to company channel for messages
      if (onMessage && user.company_id) {
        const companyChannel = echo.private(`company.${user.company_id}`);
        companyChannel.listen('.message.sent', (data: any) => {
          onMessage(data);
        });
        channels.push(companyChannel);
      }

      // Listen to specific conversation channel
      if (onMessage && conversationId) {
        const conversationChannel = echo.private(`conversation.${conversationId}`);
        conversationChannel.listen('.message.sent', (data: any) => {
          onMessage(data);
        });
        channels.push(conversationChannel);
      }

      channelsRef.current = channels;

      return () => {
        // Cleanup: leave all channels
        channels.forEach((channel) => {
          try {
            channel.stopListening('.message.sent');
            channel.stopListening('.notification.created');
            echo.leave(channel.name);
          } catch (error) {
            console.warn('Error leaving channel:', error);
          }
        });
        channelsRef.current = [];
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }, [enabled, isAuthenticated, user?.id, user?.company_id, conversationId, onMessage, onNotification]);

  // Reconnect when auth state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      reconnectEcho();
    } else {
      disconnectEcho();
    }
  }, [isAuthenticated, user?.id]);

  return {
    echo: echoRef.current,
    isConnected: !!echoRef.current,
  };
};

