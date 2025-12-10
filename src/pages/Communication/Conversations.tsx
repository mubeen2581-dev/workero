import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Clock, CheckCircle2, Search, Filter, MoreVertical, Bell } from 'lucide-react';
import ThreadList from '@/components/Communication/ThreadList';
import ChatPane from '@/components/Communication/ChatPane';
import NotificationCenter from '@/components/Communication/NotificationCenter';
import MessageSearch from '@/components/Communication/MessageSearch';
import { MessagesService, Message, Conversation } from '@/services/messages';
import { NotificationService } from '@/services/notifications';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from 'react-toastify';

const ConversationsPage: React.FC = () => {
  const [threads, setThreads] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  useEffect(() => {
    loadThreads();
    loadUnreadCount();
    
    // Poll for unread count and refresh threads every 30 seconds
    const interval = setInterval(() => {
      loadUnreadCount();
      loadThreads(); // Refresh threads to get updated unread counts
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedId && threads.length > 0) setSelectedId(threads[0].id);
  }, [threads, selectedId]);

  useEffect(() => {
    if (selectedId) {
      loadMessages(selectedId);
      
      // Poll for new messages every 3 seconds when a conversation is selected
      const messageInterval = setInterval(() => {
        loadMessages(selectedId);
        loadThreads(); // Also refresh thread list to update unread counts
      }, 3000);
      
      return () => clearInterval(messageInterval);
    }
  }, [selectedId]);

  const loadThreads = async () => {
    try {
      const data = await MessagesService.getThreads();
      setThreads(data);
    } catch (error: any) {
      toast.error('Failed to load conversations');
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const data = await MessagesService.getThreadMessages(conversationId);
      setMessages(data);
    } catch (error: any) {
      toast.error('Failed to load messages');
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await NotificationService.getUnreadCount();
      setUnreadNotificationCount(response.data.count);
    } catch (error) {
      // Silently fail
    }
  };

  const handleSend = async (text: string) => {
    if (!selectedId) return;
    
    const selectedThread = threads.find(t => t.id === selectedId);
    if (!selectedThread) return;

    try {
      await MessagesService.sendMessage({
        conversation_id: selectedId,
        receiver_id: selectedThread.participant_id,
        receiver_type: selectedThread.participant_type as 'App\Models\User' | 'App\Models\Client',
        content: text,
        type: 'text',
      });
      
      // Reload messages and threads
      await loadMessages(selectedId);
      await loadThreads();
    } catch (error: any) {
      toast.error('Failed to send message: ' + (error.message || 'Unknown error'));
    }
  };

  // Calculate stats
  const totalThreads = threads.length;
  const unreadThreads = threads.filter(t => t.unreadCount > 0).length;
  const totalUnread = threads.reduce((sum, t) => sum + (t.unreadCount || 0), 0);
  const selectedThread = threads.find(t => t.id === selectedId);

  // Filter threads based on search
  const filteredThreads = threads.filter(thread => {
    const searchLower = searchQuery.toLowerCase();
    return (
      thread.title?.toLowerCase().includes(searchLower) ||
      (thread.participant as any)?.name?.toLowerCase().includes(searchLower) ||
      (thread.participant as any)?.email?.toLowerCase().includes(searchLower)
    );
  });

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
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Communication Hub</h1>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600">Active</span>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Internal messaging and team communication
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <MessageSearch conversationId={selectedId} />
            <Button
              variant="ghost"
              onClick={() => setShowNotifications(true)}
              className="relative"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </Button>
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

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => {
          setShowNotifications(false);
          loadUnreadCount(); // Refresh count when closing
        }}
      />
    </div>
  );
};

export default ConversationsPage;


