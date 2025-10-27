import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  Calendar,
  MapPin,
  Package,
  Receipt,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Bot,
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import Logo from './Logo';
import Button from '../ui/Button';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Leads', href: '/leads', icon: Users, badge: 3 },
  { name: 'Quotes', href: '/quotes', icon: FileText, badge: 7 },
  { name: 'Jobs', href: '/jobs', icon: Briefcase, badge: 12 },
  { name: 'Scheduling', href: '/scheduling', icon: Calendar },
  { name: 'Live Map', href: '/scheduling/live', icon: MapPin },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Invoices', href: '/invoices', icon: Receipt, badge: 5 },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'WhatsApp CRM', href: '/communication', icon: MessageCircle, badge: 2 },
  { name: 'Compliance', href: '/compliance', icon: FileText },
];

const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar, setMobileMenuOpen } = useUIStore();

  return (
    <motion.div
      initial={false}
      animate={{ width: sidebarCollapsed ? '4rem' : '16rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white border-r border-gray-200 flex flex-col h-full shadow-lg lg:shadow-none w-full lg:w-auto"
    >
      {/* Logo Section */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <Logo collapsed={sidebarCollapsed} />
          <div className="flex items-center space-x-2">
            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {/* Desktop Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="hidden lg:flex p-2"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={() => setMobileMenuOpen(false)}
            end={item.href === '/scheduling'}
            className={({ isActive }) =>
              `group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#ECF2FF] text-[#397AFF] hover:font-semibold'
                  : 'text-gray-600 hover:bg-[#ECF2FF] hover:text-[#397AFF]'
              } ${sidebarCollapsed ? 'justify-center' : ''}`
            }
          > 
            {({ isActive }) => (
              <>
                <item.icon
                  className={`flex-shrink-0 w-5 h-5 ${
                    isActive ? 'text-[#397AFF]' : 'text-gray-400 group-hover:text-[#397AFF]'
                  }`}
                />
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 flex-1"
                  >
                    {item.name}
                  </motion.span>
                )}
                {item.badge && !sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-auto bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded-full"
                  >
                    {item.badge}
                  </motion.span>
                )}
                {item.badge && sidebarCollapsed && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full" />
                )}
                {/* WhatsApp Status Indicator */}
                {item.name === 'WhatsApp CRM' && (
                  <div className="ml-auto flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    {!sidebarCollapsed && (
                      <span className="text-xs text-green-600 font-medium">Live</span>
                    )}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4"
        >
          {/* <div className="text-xs text-gray-500 text-center">
            <p>Workero Admin v1.0</p>
            <p className="mt-1">© 2024 Workero</p>
          </div> */}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Sidebar;
