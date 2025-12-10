import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, CheckCheck, Trash2, Filter, Search } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { NotificationService, Notification } from '@/services/notifications';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [isOpen, filter]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const filters: any = {};
      if (filter === 'unread') {
        filters.is_read = false;
      } else if (filter === 'read') {
        filters.is_read = true;
      }

      const response = await NotificationService.getAll(filters);
      setNotifications(response.data || []);
    } catch (error: any) {
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await NotificationService.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      // Silently fail
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error: any) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error: any) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await NotificationService.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success('Notification deleted');
    } catch (error: any) {
      toast.error('Failed to delete notification');
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(query) ||
        n.body.toLowerCase().includes(query) ||
        n.type.toLowerCase().includes(query)
      );
    }
    return true;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-2xl max-h-[80vh] bg-white rounded-xl shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bell className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                {unreadCount > 0 && (
                  <p className="text-xs text-gray-500">{unreadCount} unread</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  icon={CheckCheck}
                >
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose} icon={X} />
            </div>
          </div>

          {/* Filters and Search */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'unread' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Unread
              </Button>
              <Button
                variant={filter === 'read' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('read')}
              >
                Read
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                <p className="text-sm text-gray-600">
                  {searchQuery ? 'No notifications match your search' : "You're all caught up!"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border transition-all ${
                      notification.is_read
                        ? 'bg-white border-gray-200'
                        : 'bg-purple-50 border-purple-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {notification.title}
                          </h4>
                          {!notification.is_read && (
                            <span className="w-2 h-2 bg-purple-600 rounded-full mt-1.5"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.body}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                            {notification.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            icon={Check}
                            className="text-purple-600"
                          />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(notification.id)}
                          icon={Trash2}
                          className="text-red-600"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationCenter;

