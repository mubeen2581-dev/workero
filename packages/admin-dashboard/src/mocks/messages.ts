import { User } from '@/types';

export interface Message {
  id: string;
  leadId: string;
  senderId: string;
  sender: User;
  recipientId?: string;
  recipient?: User;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  timestamp: string;
  isRead: boolean;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    imageUrl?: string;
  };
}

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'mike@workero.com',
    firstName: 'Mike',
    lastName: 'Smith',
    role: 'technician',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-12-15T10:30:00Z',
  },
  {
    id: 'user-2',
    email: 'lisa@workero.com',
    firstName: 'Lisa',
    lastName: 'Brown',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-12-15T09:15:00Z',
  },
  {
    id: 'user-3',
    email: 'admin@workero.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-12-15T08:45:00Z',
  },
];

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    leadId: 'lead-1',
    senderId: 'client-1',
    sender: {
      id: 'client-1',
      email: 'sarah.johnson@email.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'admin', // Client role for messaging
      isActive: true,
      createdAt: '2024-11-01T00:00:00Z',
    },
    content: 'Hi! I saw your website and I\'m interested in getting a quote for a kitchen renovation. When would be a good time to discuss this?',
    type: 'text',
    timestamp: '2024-12-01T10:15:00Z',
    isRead: true,
  },
  {
    id: 'msg-2',
    leadId: 'lead-1',
    senderId: 'user-2',
    sender: mockUsers[1],
    recipientId: 'client-1',
    content: 'Hello Sarah! Thank you for reaching out. I\'d be happy to help you with your kitchen renovation project. I can schedule a consultation for this week. What days work best for you?',
    type: 'text',
    timestamp: '2024-12-01T10:45:00Z',
    isRead: true,
  },
  {
    id: 'msg-3',
    leadId: 'lead-1',
    senderId: 'client-1',
    sender: {
      id: 'client-1',
      email: 'sarah.johnson@email.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'admin',
      isActive: true,
      createdAt: '2024-11-01T00:00:00Z',
    },
    content: 'Great! I\'m available Tuesday or Wednesday afternoon. Here are some photos of my current kitchen to give you an idea of what we\'re working with.',
    type: 'text',
    timestamp: '2024-12-01T11:20:00Z',
    isRead: true,
  },
  {
    id: 'msg-4',
    leadId: 'lead-1',
    senderId: 'client-1',
    sender: {
      id: 'client-1',
      email: 'sarah.johnson@email.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'admin',
      isActive: true,
      createdAt: '2024-11-01T00:00:00Z',
    },
    content: '',
    type: 'image',
    timestamp: '2024-12-01T11:22:00Z',
    isRead: true,
    metadata: {
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      fileName: 'kitchen-current-1.jpg',
    },
  },
  {
    id: 'msg-5',
    leadId: 'lead-1',
    senderId: 'user-2',
    sender: mockUsers[1],
    recipientId: 'client-1',
    content: 'Perfect! I can see the space. Let me schedule you for Tuesday at 2 PM. I\'ll send you a calendar invite shortly.',
    type: 'text',
    timestamp: '2024-12-01T11:30:00Z',
    isRead: true,
  },
  {
    id: 'msg-6',
    leadId: 'lead-2',
    senderId: 'client-2',
    sender: {
      id: 'client-2',
      email: 'david.wilson@email.com',
      firstName: 'David',
      lastName: 'Wilson',
      role: 'admin',
      isActive: true,
      createdAt: '2024-11-05T00:00:00Z',
    },
    content: 'Hi Mike, Sarah Johnson referred me to you. I need a bathroom remodel done urgently - my current bathroom is having major issues. Can you help?',
    type: 'text',
    timestamp: '2024-12-05T09:20:00Z',
    isRead: true,
  },
  {
    id: 'msg-7',
    leadId: 'lead-2',
    senderId: 'user-1',
    sender: mockUsers[0],
    recipientId: 'client-2',
    content: 'Hello David! Yes, I can definitely help with your bathroom remodel. What specific issues are you experiencing? I can come out today for an emergency assessment if needed.',
    type: 'text',
    timestamp: '2024-12-05T09:35:00Z',
    isRead: true,
  },
  {
    id: 'msg-8',
    leadId: 'lead-2',
    senderId: 'client-2',
    sender: {
      id: 'client-2',
      email: 'david.wilson@email.com',
      firstName: 'David',
      lastName: 'Wilson',
      role: 'admin',
      isActive: true,
      createdAt: '2024-11-05T00:00:00Z',
    },
    content: 'The main issue is water damage from a leak. The floor is starting to rot and the walls are getting moldy. I need this fixed ASAP.',
    type: 'text',
    timestamp: '2024-12-05T09:45:00Z',
    isRead: true,
  },
  {
    id: 'msg-9',
    leadId: 'lead-3',
    senderId: 'user-2',
    sender: mockUsers[1],
    recipientId: 'client-3',
    content: 'Hello Robert, this is Lisa from Workero. I\'m calling about your electrical panel upgrade inquiry. When would be a good time to discuss your needs?',
    type: 'text',
    timestamp: '2024-12-08T14:30:00Z',
    isRead: false,
  },
  {
    id: 'msg-10',
    leadId: 'lead-4',
    senderId: 'system',
    sender: {
      id: 'system',
      email: 'system@workero.com',
      firstName: 'System',
      lastName: 'Notification',
      role: 'admin',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
    content: 'New lead Emma Davis has been assigned to you. Please review the lead details and make initial contact within 24 hours.',
    type: 'system',
    timestamp: '2024-12-15T08:50:00Z',
    isRead: false,
  },
];

export const getMessagesForLead = (leadId: string): Message[] => {
  return mockMessages.filter(message => message.leadId === leadId);
};

export const getUnreadMessageCount = (leadId: string): number => {
  return mockMessages.filter(message => 
    message.leadId === leadId && !message.isRead
  ).length;
};

export const markMessagesAsRead = (leadId: string): void => {
  mockMessages.forEach(message => {
    if (message.leadId === leadId) {
      message.isRead = true;
    }
  });
};

// Conversations (threads) derived from messages by leadId
export interface ConversationThread {
  id: string; // leadId used as thread id for now
  title: string; // client name or lead label
  lastMessage: Message;
  unreadCount: number;
}

export const buildThreads = (): ConversationThread[] => {
  const byLead = new Map<string, Message[]>();
  mockMessages.forEach((m) => {
    const arr = byLead.get(m.leadId) || [];
    arr.push(m);
    byLead.set(m.leadId, arr);
  });

  const threads: ConversationThread[] = [];
  byLead.forEach((messages, leadId) => {
    const sorted = [...messages].sort((a, b) => +new Date(a.timestamp) - +new Date(b.timestamp));
    const last = sorted[sorted.length - 1];
    const unread = messages.filter((m) => !m.isRead).length;
    const title = last.sender?.firstName ? `${last.sender.firstName} ${last.sender.lastName || ''}`.trim() : `Lead ${leadId}`;
    threads.push({ id: leadId, title, lastMessage: last, unreadCount: unread });
  });

  // Sort by recent activity desc
  return threads.sort((a, b) => +new Date(b.lastMessage.timestamp) - +new Date(a.lastMessage.timestamp));
};
