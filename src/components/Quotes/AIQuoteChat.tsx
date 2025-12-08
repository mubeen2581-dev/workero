import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Bot, User, Sparkles, Loader2, X, Plus } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { QuoteService } from '@/services/quotes';
import { QuoteItem } from '@/types';
import { toast } from 'react-toastify';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: any[];
  timestamp: Date;
}

interface AIQuoteChatProps {
  onAddItems: (items: QuoteItem[]) => void;
  onClose?: () => void;
  className?: string;
}

const AIQuoteChat: React.FC<AIQuoteChatProps> = ({ onAddItems, onClose, className = '' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm your AI quote assistant. I can help you create accurate quotes by understanding your project requirements.\n\n" +
               "Please describe your project in detail, including:\n" +
               "• Project type (kitchen, bathroom, electrical, etc.)\n" +
               "• Scope and size\n" +
               "• Materials or specific requirements\n" +
               "• Budget preferences\n\n" +
               "I'll generate quote suggestions based on your description!",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useGroq, setUseGroq] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build conversation history
      const conversationHistory = messages
        .filter((m) => m.role !== 'assistant' || m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const response = await QuoteService.chatQuote(
        userMessage.content,
        conversationHistory,
        useGroq,
        !useGroq
      );

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.data.response,
        suggestions: response.data.suggestions || [],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (response.data.suggestions && response.data.suggestions.length > 0) {
        toast.success(`Generated ${response.data.suggestions.length} quote suggestion(s) using ${response.data.source}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to get AI response');
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again or describe your project in a different way.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleAddSuggestion = (suggestion: any) => {
    const itemsToAdd: QuoteItem[] = [];
    
    if (suggestion.items && Array.isArray(suggestion.items)) {
      suggestion.items.forEach((item: any) => {
        itemsToAdd.push({
          id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          description: item.name || item.description || 'AI Generated Item',
          quantity: 1,
          unitPrice: item.price || 0,
          taxRate: 8.5,
          lineTotal: (item.price || 0) * 1.085,
        });
      });
    }

    if (itemsToAdd.length > 0) {
      onAddItems(itemsToAdd);
      toast.success(`Added ${itemsToAdd.length} item(s) to quote`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className={`p-0 flex flex-col h-[600px] ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Quote Assistant</h3>
            <p className="text-xs text-gray-500">Chat to create quotes</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={useGroq ? 'groq' : 'xe'}
            onChange={(e) => setUseGroq(e.target.value === 'groq')}
            className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
          >
            <option value="groq">GROQ AI</option>
            <option value="xe">XE AI</option>
          </select>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} icon={X} />
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[80%] ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-purple-100 text-purple-600'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div
                className={`rounded-xl p-3 ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {/* Show suggestions if available */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <div
                        key={suggestion.id || idx}
                        className="p-3 bg-white rounded-lg border border-gray-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {suggestion.title || 'Quote Suggestion'}
                            </h4>
                            {suggestion.description && (
                              <p className="text-xs text-gray-600 mt-1">
                                {suggestion.description}
                              </p>
                            )}
                          </div>
                          {suggestion.totalEstimate && (
                            <div className="text-sm font-bold text-primary-600">
                              £{suggestion.totalEstimate.toLocaleString()}
                            </div>
                          )}
                        </div>
                        
                        {suggestion.items && suggestion.items.length > 0 && (
                          <div className="text-xs text-gray-600 mb-2">
                            {suggestion.items.length} item(s)
                          </div>
                        )}
                        
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAddSuggestion(suggestion)}
                          className="w-full mt-2"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add to Quote
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-gray-100 rounded-xl p-3">
              <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end space-x-2">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your project..."
            rows={2}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
          />
          <Button
            variant="primary"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            icon={isLoading ? Loader2 : Send}
            className="px-4 py-2"
          >
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </Card>
  );
};

export default AIQuoteChat;

