import React from 'react';
import Card from '@/components/ui/Card';
import { ConversationThread } from '@/mocks/messages';

interface ThreadListProps {
  threads: ConversationThread[];
  selectedId?: string;
  onSelect: (id: string) => void;
  className?: string;
}

const ThreadList: React.FC<ThreadListProps> = ({ threads, selectedId, onSelect, className = '' }) => {
  return (
    <Card className={className}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Conversations</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {threads.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
              selectedId === t.id ? 'bg-primary-50' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">{t.title}</p>
                {t.unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {t.unreadCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 truncate">{t.lastMessage.content || t.lastMessage.metadata?.fileName || t.lastMessage.type}</p>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default ThreadList;


