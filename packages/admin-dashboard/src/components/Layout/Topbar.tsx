import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Plus, Menu } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import Button from '../ui/Button';
import UserMenu from './UserMenu';
import NotificationPanel from './NotificationPanel';

const Topbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const { sidebarCollapsed, toggleSidebar, toggleMobileMenu, notifications, unreadCount } = useUIStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery);
  };

  const handleQuickAction = () => {
    // Handle quick action (e.g., create new lead, job, etc.)
    console.log('Quick action clicked');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="lg:hidden p-2"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search leads, jobs, invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 pr-4 py-2 w-64 sm:w-80"
              />
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Quick Action Button */}
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleQuickAction}
            className="hidden sm:flex"
          >
            Create
          </Button>
          
          {/* Mobile Quick Action */}
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleQuickAction}
            className="sm:hidden p-2"
          >
            <span className="sr-only">Create</span>
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 relative"
              onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.div>
              )}
            </Button>
          </div>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden mt-4">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 pr-4 py-2 w-full"
            />
          </div>
        </form>
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={notificationPanelOpen} 
        onClose={() => setNotificationPanelOpen(false)} 
      />
    </header>
  );
};

export default Topbar;
