import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical,
  X,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import { Message } from '@/mocks/messages';
import { Lead } from '@/types';
import Button from '../ui/Button';
import WhatsAppLeadCaptureModal from './WhatsAppLeadCaptureModal';
import { formatDistanceToNow } from 'date-fns';

interface ChatPaneProps {
  lead: Lead;
  messages: Message[];
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (content: string, type: 'text' | 'image' | 'file') => void;
  className?: string;
}

const ChatPane: React.FC<ChatPaneProps> = ({
  lead,
  messages,
  isOpen,
  onClose,
  onSendMessage,
  className = '',
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim(), 'text');
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const renderMessage = (message: Message) => {
    const isFromClient = message.senderId === lead.clientId;
    const isSystem = message.type === 'system';

    if (isSystem) {
      return (
        <div key={message.id} className="flex justify-center my-2">
          <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
            {message.content}
          </div>
        </div>
      );
    }

    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`flex ${isFromClient ? 'justify-start' : 'justify-end'} mb-4`}
      >
        <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${isFromClient ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-medium text-sm">
                {message.sender.firstName[0]}{message.sender.lastName[0]}
              </span>
            </div>
          </div>

          {/* Message Content */}
          <div className={`flex flex-col ${isFromClient ? 'items-start' : 'items-end'}`}>
            <div
              className={`px-4 py-2 rounded-2xl ${
                isFromClient
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-primary-600 text-white'
              }`}
            >
              {message.type === 'image' ? (
                <div className="space-y-2">
                  <img
                    src={message.metadata?.imageUrl}
                    alt={message.metadata?.fileName}
                    className="rounded-lg max-w-full h-auto"
                  />
                  {message.content && (
                    <p className="text-sm">{message.content}</p>
                  )}
                </div>
              ) : message.type === 'file' ? (
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">{message.metadata?.fileName}</span>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
            
            {/* Timestamp */}
            <span className="text-xs text-gray-500 mt-1">
              {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed right-0 top-[22px] h-screen w-full sm:w-96 lg:max-w-md bg-white shadow-large border-l border-gray-200 z-[100] flex flex-col ${className}`}
        style={{ top: 0, left: 'auto', right: 0, height: '100vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-600 font-medium text-xs sm:text-sm">
                {lead.client?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'L'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{lead.client?.name || 'Unknown Client'}</h3>
              <p className="text-xs sm:text-sm text-gray-500 truncate">{lead.client?.email || ''}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <Button variant="secondary" size="sm" onClick={() => setShowCreateLead(true)}>
              Create Lead
            </Button>
            <Button variant="ghost" size="sm" className="p-1 sm:p-2 hidden sm:flex">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1 sm:p-2 hidden sm:flex">
              <Video className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1 sm:p-2">
              <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-1 sm:p-2">
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Start a conversation
                </h3>
                <p className="text-gray-500">
                  Send a message to {lead.client?.name || 'the client'} to begin your conversation.
                </p>
              </div>
            </div>
          ) : (
            messages.map(renderMessage)
          )}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start mb-4"
            >
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-sm">
                    {lead.client?.name?.[0] || 'C'}
                  </span>
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-3 border-t border-gray-200 bg-white mb-5">
          <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>
            
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" type="button" className="p-2">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" type="button" className="p-2">
                <ImageIcon className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" type="button" className="p-2">
                <Smile className="w-4 h-4" />
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!newMessage.trim()}
                className="p-2"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
    <WhatsAppLeadCaptureModal
      isOpen={showCreateLead}
      defaultPhone={lead.client?.phone || ''}
      defaultName={lead.client?.name || ''}
      onClose={() => setShowCreateLead(false)}
      onSubmit={(data) => { console.log('Create lead from WhatsApp', data); setShowCreateLead(false); }}
    />
    </>
  );
};

export default ChatPane;
