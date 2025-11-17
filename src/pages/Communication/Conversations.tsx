import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Clock, CheckCircle2, Search, Filter, MoreVertical } from 'lucide-react';
import ThreadList from '@/components/Communication/ThreadList';
import ChatPane from '@/components/Communication/ChatPane';
import { Message, ConversationThread } from '@/mocks/messages';
import { WhatsHubService } from '@/services/whatsHub';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const ConversationsPage: React.FC = () => {
  const [threads, setThreads] = useState<ConversationThread[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Calculate stats
  const totalThreads = threads.length;
  const unreadThreads = threads.filter(t => t.unreadCount > 0).length;
  const totalUnread = threads.reduce((sum, t) => sum + (t.unreadCount || 0), 0);
  const selectedThread = threads.find(t => t.id === selectedId);

  // Filter threads based on search
  const filteredThreads = threads.filter(thread => 
    thread.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">WhatsApp CRM</h1>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs font-medium text-green-600">Connected</span>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Manage customer conversations via WhatsApp Business API
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button variant="secondary" icon={Filter} className="hidden sm:flex">
              Filter
            </Button>
            <Button variant="secondary" icon={Filter} className="sm:hidden p-2">
              <span className="sr-only">Filter</span>
            </Button>
            <Button variant="secondary" icon={MoreVertical} className="hidden sm:flex">
              More
            </Button>
            <Button variant="secondary" icon={MoreVertical} className="sm:hidden p-2">
              <span className="sr-only">More</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
      >
        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Conversations</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{totalThreads}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-xl" style={{ backgroundColor: '#F3F0FF' }}>
              <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#8552C5' }} />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Unread Messages</p>
              <p className="text-lg sm:text-2xl font-bold text-yellow-600">{totalUnread}</p>
            </div>
            <div className="p-2 sm:p-3 bg-yellow-100 rounded-xl">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Unread Threads</p>
              <p className="text-lg sm:text-2xl font-bold text-orange-600">{unreadThreads}</p>
            </div>
            <div className="p-2 sm:p-3 bg-orange-100 rounded-xl">
              <Users className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Status</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">Active</p>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
              <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Content - Side by Side Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        {/* Thread List Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-0 h-[calc(100vh-300px)] flex flex-col">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Thread List */}
            <div className="flex-1 overflow-y-auto">
              <ThreadList 
                threads={filteredThreads} 
                selectedId={selectedId} 
                onSelect={setSelectedId}
                className="h-full border-0"
              />
            </div>
          </Card>
        </div>

        {/* Chat Pane */}
        <div className="lg:col-span-2">
          {selectedThread ? (
            <ChatPane 
              messages={messages} 
              onSend={handleSend}
              selectedThread={selectedThread}
              className="h-[calc(100vh-300px)]"
            />
          ) : (
            <Card className="h-[calc(100vh-300px)] flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-sm text-gray-600">Choose a conversation from the list to start messaging</p>
              </div>
            </Card>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ConversationsPage;


