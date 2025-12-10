import React, { useState } from 'react';
import { Search, X, Filter, Calendar, FileText } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { MessagesService, Message } from '@/services/messages';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

interface MessageSearchProps {
  onSelectMessage?: (message: Message) => void;
  conversationId?: string;
}

const MessageSearch: React.FC<MessageSearchProps> = ({ onSelectMessage, conversationId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Message[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    type: '' as '' | 'text' | 'image' | 'file' | 'voice' | 'template',
    date_from: '',
    date_to: '',
  });

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsSearching(true);
    try {
      const searchFilters: any = {
        query: query.trim(),
        conversation_id: conversationId,
      };

      if (filters.type) {
        searchFilters.type = filters.type;
      }
      if (filters.date_from) {
        searchFilters.date_from = filters.date_from;
      }
      if (filters.date_to) {
        searchFilters.date_to = filters.date_to;
      }

      const response = await MessagesService.searchMessages(searchFilters);
      setResults(response.data || []);
      
      if (response.data.length === 0) {
        toast.info('No messages found');
      }
    } catch (error: any) {
      toast.error('Search failed: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setFilters({
      type: '',
      date_from: '',
      date_to: '',
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        icon={Search}
      >
        Search
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 z-50 shadow-xl">
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Search Messages</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} icon={X} />
            </div>

            {/* Search Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Search messages..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                icon={Search}
                className="flex-1"
              />
              <Button
                variant="primary"
                onClick={handleSearch}
                loading={isSearching}
                disabled={!query.trim()}
              >
                Search
              </Button>
            </div>

            {/* Filters */}
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filters</span>
              </div>
              
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Types</option>
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="file">File</option>
                <option value="voice">Voice</option>
                <option value="template">Template</option>
              </select>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">From Date</label>
                  <input
                    type="date"
                    value={filters.date_from}
                    onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">To Date</label>
                  <input
                    type="date"
                    value={filters.date_to}
                    onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {(filters.type || filters.date_from || filters.date_to) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="w-full text-xs"
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="border-t border-gray-200 pt-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {results.map((message) => (
                    <div
                      key={message.id}
                      className="p-3 rounded-lg border border-gray-200 hover:border-purple-300 cursor-pointer transition-colors"
                      onClick={() => {
                        if (onSelectMessage) {
                          onSelectMessage(message);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-xs font-medium text-gray-600">
                          {format(new Date(message.created_at), 'MMM d, yyyy h:mm a')}
                        </span>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                          {message.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 line-clamp-2">{message.content}</p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                          <FileText className="w-3 h-3" />
                          <span>{message.attachments.length} attachment(s)</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MessageSearch;

