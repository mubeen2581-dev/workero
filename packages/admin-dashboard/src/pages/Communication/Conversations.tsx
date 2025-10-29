import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ThreadList from '@/components/Communication/ThreadList';
import ChatPane from '@/components/Communication/ChatPane';
import { Message } from '@/mocks/messages';
import { WhatsHubService } from '@/services/whatsHub';

const ConversationsPage: React.FC = () => {
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    WhatsHubService.listThreads().then(setThreads);
  }, []);

  useEffect(() => {
    if (!selectedId && threads.length > 0) setSelectedId(threads[0].id);
  }, [threads, selectedId]);

  useEffect(() => {
    if (selectedId) {
      WhatsHubService.listMessages(selectedId).then(setMessages);
    }
  }, [selectedId]);

  const handleSend = async (text: string) => {
    if (!selectedId) return;
    const msg = await WhatsHubService.sendMessage({ conversationId: selectedId, type: 'text', body: text });
    setMessages((prev) => [...prev, msg]);
    // refresh threads to update last message
    const t = await WhatsHubService.listThreads();
    setThreads(t);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center space-x-3 mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">WhatsApp CRM</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Connected</span>
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-600">Manage customer conversations via WhatsApp Business API through WhatsHub integration.</p>
      </motion.div>

      <div className="space-y-4">
        <ThreadList threads={threads} selectedId={selectedId} onSelect={setSelectedId} />
        <ChatPane messages={messages} onSend={handleSend} />
      </div>
    </div>
  );
};

export default ConversationsPage;


