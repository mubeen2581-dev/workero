import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Users, 
  Palette, 
  Building, 
  Plug, 
  Shield, 
  Database, 
  Bell, 
  FileText,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import UserManagement from '@/components/Settings/UserManagement';
import SystemPreferences from '@/components/Settings/SystemPreferences';
import BusinessConfiguration from '@/components/Settings/BusinessConfiguration';
import IntegrationSettings from '@/components/Settings/IntegrationSettings';
import SecuritySettings from '@/components/Settings/SecuritySettings';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface SettingsPageProps {
  className?: string;
}

type SettingsTab = 'overview' | 'users' | 'preferences' | 'business' | 'integrations' | 'security';

const SettingsPage: React.FC<SettingsPageProps> = ({
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('overview');

  const settingsTabs = [
    {
      id: 'overview' as SettingsTab,
      name: 'Overview',
      icon: Settings,
      description: 'Settings dashboard and quick actions',
    },
    {
      id: 'users' as SettingsTab,
      name: 'User Management',
      icon: Users,
      description: 'Manage users, roles, and permissions',
    },
    {
      id: 'preferences' as SettingsTab,
      name: 'System Preferences',
      icon: Palette,
      description: 'Appearance, notifications, and preferences',
    },
    {
      id: 'business' as SettingsTab,
      name: 'Business Configuration',
      icon: Building,
      description: 'Company info, hours, and business settings',
    },
    {
      id: 'integrations' as SettingsTab,
      name: 'Integrations',
      icon: Plug,
      description: 'Third-party services and API connections',
    },
    {
      id: 'security' as SettingsTab,
      name: 'Security Settings',
      icon: Shield,
      description: 'Security policies and data protection',
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SettingsOverview />;
      case 'users':
        return <UserManagement />;
      case 'preferences':
        return <SystemPreferences />;
      case 'business':
        return <BusinessConfiguration />;
      case 'integrations':
        return <IntegrationSettings />;
      case 'security':
        return <SecuritySettings />;
      default:
        return <SettingsOverview />;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Configure your application settings, user management, and system preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-4 sm:p-6">
              <nav className="space-y-1 sm:space-y-2">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between p-2 sm:p-3 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-primary-600' : 'text-gray-500'}`} />
                        <div>
                          <div className="font-medium text-sm sm:text-base">{tab.name}</div>
                          <div className="text-xs text-gray-500 hidden sm:block">{tab.description}</div>
                        </div>
                      </div>
                      <ChevronRight className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Overview Component
const SettingsOverview: React.FC = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const quickActions = [
    {
      title: 'Add New User',
      description: 'Create a new user account with role assignment',
      icon: Users,
      action: () => console.log('Add user'),
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Configure Integrations',
      description: 'Set up third-party service connections',
      icon: Plug,
      action: () => console.log('Configure integrations'),
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Security Audit',
      description: 'Review security settings and policies',
      icon: Shield,
      action: () => console.log('Security audit'),
      color: 'bg-red-100 text-red-600',
    },
    {
      title: 'Export Settings',
      description: 'Download all configuration settings',
      icon: FileText,
      action: () => console.log('Export settings'),
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const systemStatus = [
    {
      name: 'User Management',
      status: 'healthy',
      lastUpdated: '2 minutes ago',
      icon: Users,
    },
    {
      name: 'System Preferences',
      status: 'healthy',
      lastUpdated: '5 minutes ago',
      icon: Palette,
    },
    {
      name: 'Business Configuration',
      status: 'warning',
      lastUpdated: '1 hour ago',
      icon: Building,
    },
    {
      name: 'Integrations',
      status: 'error',
      lastUpdated: '3 hours ago',
      icon: Plug,
    },
    {
      name: 'Security Settings',
      status: 'healthy',
      lastUpdated: '10 minutes ago',
      icon: Shield,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return CheckCircle;
      case 'warning':
        return AlertCircle;
      case 'error':
        return AlertCircle;
      default:
        return Info;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings Overview</h2>
          <p className="text-gray-600">Monitor and manage your application settings</p>
        </div>
        
        {hasUnsavedChanges && (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Unsaved Changes
          </Badge>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={action.action}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{action.title}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* System Status */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        <Card className="p-6">
          <div className="space-y-4">
            {systemStatus.map((item, index) => {
              const Icon = item.icon;
              const StatusIcon = getStatusIcon(item.status);
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Last updated: {item.lastUpdated}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(item.status)}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {item.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New user created</p>
                <p className="text-xs text-gray-600">Sarah Johnson was added to the system</p>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <Shield className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Security settings updated</p>
                <p className="text-xs text-gray-600">Password policy was modified</p>
              </div>
              <span className="text-xs text-gray-500">4 hours ago</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <Plug className="w-5 h-5 text-purple-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Integration configured</p>
                <p className="text-xs text-gray-600">Stripe payment integration was set up</p>
              </div>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <Building className="w-5 h-5 text-orange-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Business settings updated</p>
                <p className="text-xs text-gray-600">Company information was modified</p>
              </div>
              <span className="text-xs text-gray-500">2 days ago</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Settings Summary */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">24</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Integrations</p>
                <p className="text-2xl font-bold text-green-600">8</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Plug className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Security Policies</p>
                <p className="text-2xl font-bold text-red-600">12</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
