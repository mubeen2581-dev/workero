import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '@/config/api';

const getAuthToken = (): string | null => localStorage.getItem('auth_token');

const messagesClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds for file uploads
});

messagesClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

messagesClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface FileAttachment {
  name: string;
  path: string;
  size: number;
  mime_type: string;
  url: string;
}

export interface SendMessageRequest {
  conversation_id: string;
  receiver_id: string;
  receiver_type: 'App\Models\User' | 'App\Models\Client';
  content?: string;
  type?: 'text' | 'image' | 'file' | 'voice' | 'template';
  attachments?: File[];
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: string;
  receiver_id: string;
  receiver_type: string;
  type: 'text' | 'image' | 'file' | 'voice' | 'template';
  content: string;
  attachments?: FileAttachment[];
  is_read: boolean;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  company_id: string;
  title?: string;
  type: string;
  participant_id: string;
  participant_type: string;
  last_message_at?: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export const MessagesService = {
  /**
   * Upload a file and get attachment info
   */
  async uploadFile(file: File): Promise<FileAttachment> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await messagesClient.post<{ success: boolean; data: FileAttachment }>(
      '/messages/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error('File upload failed');
  },

  /**
   * Send a message with optional file attachments
   */
  async sendMessage(data: SendMessageRequest): Promise<Message> {
    const formData = new FormData();
    formData.append('conversation_id', data.conversation_id);
    formData.append('receiver_id', data.receiver_id);
    formData.append('receiver_type', data.receiver_type);
    
    if (data.content) {
      formData.append('content', data.content);
    }
    
    if (data.type) {
      formData.append('type', data.type);
    }

    // Add file attachments
    if (data.attachments && data.attachments.length > 0) {
      data.attachments.forEach((file) => {
        formData.append('attachments[]', file);
      });
    }

    const response = await messagesClient.post<{ success: boolean; data: Message }>(
      '/messages/send',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to send message');
  },

  /**
   * Get all conversations/threads
   */
  async getThreads(): Promise<Conversation[]> {
    const response = await messagesClient.get<{ success: boolean; data: Conversation[] }>(
      '/messages/threads'
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    return [];
  },

  /**
   * Get messages for a specific thread/conversation
   */
  async getThreadMessages(conversationId: string): Promise<Message[]> {
    const response = await messagesClient.get<{ success: boolean; data: Message[] }>(
      `/messages/threads/${conversationId}/messages`
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    return [];
  },

  /**
   * Get message templates
   */
  async getTemplates(): Promise<Array<{ id: string; name: string; content: string }>> {
    const response = await messagesClient.get<{ success: boolean; data: Array<{ id: string; name: string; content: string }> }>(
      '/messages/templates'
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    return [];
  },
};


