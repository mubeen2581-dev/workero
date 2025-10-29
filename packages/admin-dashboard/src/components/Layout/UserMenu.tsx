import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  ChevronDown,
  Mail,
  Phone,
  Shield
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import Button from '../ui/Button';

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markAllNotificationsAsRead } = useUIStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleNotificationsClick = () => {
    markAllNotificationsAsRead();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar Button */}
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100"
      >
        <div className="relative">
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0ea5e9&color=fff`}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-8 h-8 rounded-full object-cover"
          />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-error-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </Button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-large border border-gray-200 z-50"
          >
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0ea5e9&color=fff`}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Shield className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            {unreadCount > 0 && (
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {unreadCount} new notification{unreadCount > 1 ? 's' : ''}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNotificationsClick}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Mark all read
                  </Button>
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="py-2">
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">Profile Settings</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">Preferences</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                <Bell className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">Notifications</span>
              </button>
              
              <hr className="my-2 border-gray-200" />
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-error-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
