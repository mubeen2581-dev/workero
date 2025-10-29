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
      initial={{ 
        x: -300, 
        opacity: 0,
        width: sidebarCollapsed ? '4rem' : '16rem' 
      }}
      animate={{ 
        x: 0, 
        opacity: 1,
        width: sidebarCollapsed ? '4rem' : '16rem' 
      }}
      transition={{ 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.1
      }}
      className="bg-gradient-to-b from-slate-50 to-white border-r border-slate-200/60 flex flex-col h-full shadow-2xl lg:shadow-xl w-full lg:w-auto backdrop-blur-sm"
    >
      {/* Logo Section */}
      <motion.div 
        className="p-6 border-b border-slate-200/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: 0.1,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        <div className="flex items-center justify-between">
          <Logo collapsed={sidebarCollapsed} />
          <div className="flex items-center space-x-2">
            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </Button>
            {/* Desktop Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="hidden lg:flex p-2 hover:bg-slate-100 rounded-xl transition-all duration-200 group"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-800 transition-colors" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-slate-600 group-hover:text-slate-800 transition-colors" />
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navigation.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: 0.2 + (index * 0.05),
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <NavLink
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              end={item.href === '/scheduling'}
              className={({ isActive }) =>
                `group relative flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 shadow-sm border border-purple-100'
                    : 'text-slate-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-purple-700 hover:shadow-sm'
                } ${sidebarCollapsed ? 'justify-center' : ''}`
              }
            > 
            {({ isActive }) => (
              <>
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full" style={{ background: 'linear-gradient(to bottom, #8552C5, #7A4BB8)' }} />
                )}
                
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'text-purple-600' 
                    : 'text-slate-500 group-hover:text-purple-600'
                }`} style={{
                  backgroundColor: isActive ? '#F3F0FF' : 'transparent'
                }}>
                  <item.icon className="w-5 h-5" />
                  {item.badge && sidebarCollapsed && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full shadow-sm" style={{ background: 'linear-gradient(to right, #8552C5, #7A4BB8)' }} />
                  )}
                </div>
                
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 flex-1 font-medium"
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
                    className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${
                      isActive 
                        ? 'text-purple-800' 
                        : 'bg-slate-100 text-slate-700'
                    }`}
                    style={{
                      backgroundColor: isActive ? '#E9D5FF' : undefined
                    }}
                  >
                    {item.badge}
                  </motion.span>
                )}
                
                
                {/* WhatsApp Status Indicator */}
                {item.name === 'WhatsApp CRM' && (
                  <div className="ml-auto flex items-center space-x-2">
                    <div className="relative">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                    {!sidebarCollapsed && (
                      <span className="text-xs text-green-600 font-semibold">Live</span>
                    )}
                  </div>
                )}
              </>
            )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ 
            duration: 0.4, 
            delay: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="p-2.5 border-t border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-white/50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0" style={{ background: 'linear-gradient(135deg, #BC6FE8 0%, #9F7AEA 100%)' }}>
              <span className="text-white font-semibold text-sm">W</span>
            </div>
            <div>
              <p className="text-sm text-slate-700 font-semibold">Workero Admin</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Sidebar;
