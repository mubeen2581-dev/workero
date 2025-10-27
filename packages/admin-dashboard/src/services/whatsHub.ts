import { Message } from '@/mocks/messages';

// Mock WhatsHub service. Replace with real API wiring later.

export interface SendMessageInput {
  conversationId: string; // leadId for now
  type: 'text' | 'image' | 'file' | 'template';
  body?: string;
  attachments?: { url: string; fileName?: string; fileType?: string; fileSize?: number }[];
}

export const WhatsHubService = {
  async listThreads() {
    const { buildThreads } = await import('@/mocks/messages');
    return buildThreads();
  },

  async listMessages(conversationId: string): Promise<Message[]> {
    const { getMessagesForLead } = await import('@/mocks/messages');
    return getMessagesForLead(conversationId);
  },

  async sendMessage(input: SendMessageInput): Promise<Message> {
    const { mockUsers, mockMessages } = await import('@/mocks/messages');
    const now = new Date().toISOString();
    const me = mockUsers[2]; // admin user mock
    const newMsg: Message = {
      id: 'msg-' + (mockMessages.length + 1),
      leadId: input.conversationId,
      senderId: me.id,
      sender: me,
      content: input.body || '',
      type: input.type === 'template' ? 'text' : input.type,
      timestamp: now,
      isRead: true,
      metadata: input.attachments?.[0]
        ? {
            fileName: input.attachments[0].fileName,
            fileSize: input.attachments[0].fileSize,
            fileType: input.attachments[0].fileType,
            imageUrl: input.attachments[0].url,
          }
        : undefined,
    };
    mockMessages.push(newMsg);
    return newMsg;
  },
};


