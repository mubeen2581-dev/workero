import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { Conversation } from '@/services/messages';

interface ThreadListProps {
  threads: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
  className?: string;
}

const ThreadList: React.FC<ThreadListProps> = ({ threads, selectedId, onSelect, className = '' }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const mins = Math.floor(diffInHours * 60);
      return mins <= 0 ? 'Just now' : `${mins}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className={className}>
      <div className="divide-y divide-gray-100">
        {threads.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">No conversations found</p>
          </div>
        ) : (
          threads.map((t) => {
            const isSelected = selectedId === t.id;
            const hasUnread = (t.unreadCount || 0) > 0;
            
            return (
              <button
                key={t.id}
                onClick={() => onSelect(t.id)}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-600'
                    : 'hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                <div className="flex-shrink-0 mt-1 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    isSelected 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {t.title?.charAt(0).toUpperCase() || '?'}
                  </div>
                  {hasUnread && (
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-purple-600 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`text-sm font-semibold truncate ${
                      hasUnread ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {t.title || 'Unknown'}
                    </p>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {t.last_message_at ? formatTime(t.last_message_at) : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-xs truncate ${
                      hasUnread ? 'text-gray-900 font-medium' : 'text-gray-600'
                    }`}>
                      {(t as any).last_message?.content || 'No messages'}
                    </p>
                    {hasUnread && (
                      <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold bg-purple-600 text-white flex-shrink-0">
                        {t.unreadCount}
                      </span>
                    )}
                    {!hasUnread && isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ThreadList;


