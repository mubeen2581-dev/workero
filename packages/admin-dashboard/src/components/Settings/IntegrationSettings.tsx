import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plug, 
  Mail, 
  MessageSquare, 
  CreditCard, 
  Calendar, 
  Cloud, 
  Settings, 
  Check, 
  X, 
  AlertCircle, 
  Info, 
  RefreshCw, 
  Edit, 
  Trash2, 
  Plus, 
  ExternalLink, 
  Shield, 
  Key, 
  Eye, 
  EyeOff, 
  Wifi, 
  WifiOff, 
  Clock, 
  Download, 
  Upload, 
  Save, 
  TestTube,
  Zap,
  Database,
  Server,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { 
  mockIntegrationSettings,
  updateIntegrationSettings
} from '@/mocks/settings';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';

interface IntegrationSettingsProps {
  className?: string;
}

const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({
  className = '',
}) => {
  const [integrations, setIntegrations] = useState(mockIntegrationSettings);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const getIntegrationIcon = (type: string) => {
    const iconMap: Record<string, any> = {
      email: Mail,
      sms: MessageSquare,
      payment: CreditCard,
      calendar: Calendar,
      storage: Cloud,
      other: Plug,
    };
    return iconMap[type] || Plug;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      error: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const iconMap: Record<string, any> = {
      active: Check,
      inactive: X,
      error: AlertCircle,
    };
    return iconMap[status] || X;
  };

  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      email: 'bg-blue-100 text-blue-800',
      sms: 'bg-green-100 text-green-800',
      payment: 'bg-purple-100 text-purple-800',
      calendar: 'bg-orange-100 text-orange-800',
      storage: 'bg-gray-100 text-gray-800',
      other: 'bg-indigo-100 text-indigo-800',
    };
    return colorMap[type] || 'bg-gray-100 text-gray-800';
  };

  const handleStatusToggle = (id: string) => {
    const integration = integrations.find(int => int.id === id);
    if (integration) {
      const newStatus = integration.status === 'active' ? 'inactive' : 'active';
      updateIntegrationSettings(id, { status: newStatus });
      setIntegrations(prev => 
        prev.map(int => 
          int.id === id ? { ...int, status: newStatus } : int
        )
      );
    }
  };

  const handleTestConnection = async (id: string) => {
    setIsTesting(true);
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update status based on test result
      const success = Math.random() > 0.3; // 70% success rate
      const newStatus = success ? 'active' : 'error';
      
      updateIntegrationSettings(id, { status: newStatus });
      setIntegrations(prev => 
        prev.map(int => 
          int.id === id ? { ...int, status: newStatus } : int
        )
      );
      
      console.log(`Connection test ${success ? 'passed' : 'failed'} for ${id}`);
    } catch (error) {
      console.error('Connection test failed:', error);
    } finally {
      setIsTesting(false);
    }
  };

  const handleEditIntegration = (id: string) => {
    setSelectedIntegration(id);
    setIsEditing(true);
  };

  const handleDeleteIntegration = (id: string) => {
    if (window.confirm('Are you sure you want to delete this integration?')) {
      setIntegrations(prev => prev.filter(int => int.id !== id));
      console.log('Integration deleted:', id);
    }
  };

  const handleAddIntegration = () => {
    const newIntegration = {
      id: `integration-${Date.now()}`,
      name: 'New Integration',
      type: 'other' as const,
      provider: 'Custom',
      status: 'inactive' as const,
      configuration: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setIntegrations(prev => [...prev, newIntegration]);
    setSelectedIntegration(newIntegration.id);
    setIsEditing(true);
  };

  const getIntegrationStats = () => {
    const total = integrations.length;
    const active = integrations.filter(int => int.status === 'active').length;
    const inactive = integrations.filter(int => int.status === 'inactive').length;
    const error = integrations.filter(int => int.status === 'error').length;
    
    return { total, active, inactive, error };
  };

  const stats = getIntegrationStats();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Integration Settings</h2>
          <p className="text-gray-600">Manage third-party integrations and API connections</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="secondary" icon={Download}>
            Export Config
          </Button>
          <Button variant="primary" icon={Plus} onClick={handleAddIntegration}>
            Add Integration
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Integrations</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Plug className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-xl">
              <X className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Errors</p>
              <p className="text-2xl font-bold text-red-600">{stats.error}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const IntegrationIcon = getIntegrationIcon(integration.type);
          const StatusIcon = getStatusIcon(integration.status);
          
          return (
            <Card key={integration.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    integration.status === 'active' ? 'bg-green-100' : 
                    integration.status === 'error' ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <IntegrationIcon className={`w-5 h-5 ${
                      integration.status === 'active' ? 'text-green-600' : 
                      integration.status === 'error' ? 'text-red-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-600">{integration.provider}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(integration.status)}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {integration.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Type</span>
                  <Badge className={getTypeColor(integration.type)}>
                    {integration.type}
                  </Badge>
                </div>

                {integration.lastSync && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Sync</span>
                    <span className="text-sm text-gray-900">
                      {new Date(integration.lastSync).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm text-gray-900">
                    {new Date(integration.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={integration.status === 'active' ? WifiOff : Wifi}
                    onClick={() => handleStatusToggle(integration.id)}
                    className={integration.status === 'active' ? 'text-red-600' : 'text-green-600'}
                  >
                    {integration.status === 'active' ? 'Disable' : 'Enable'}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={TestTube}
                    onClick={() => handleTestConnection(integration.id)}
                    disabled={isTesting}
                    className="text-blue-600"
                  >
                    {isTesting ? 'Testing...' : 'Test'}
                  </Button>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Edit}
                    onClick={() => handleEditIntegration(integration.id)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleDeleteIntegration(integration.id)}
                    className="text-red-600 hover:text-red-700"
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {integrations.length === 0 && (
        <Card className="p-12 text-center">
          <Plug className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations configured</h3>
          <p className="text-gray-600 mb-6">
            Get started by adding your first integration to connect with external services.
          </p>
          <Button variant="primary" icon={Plus} onClick={handleAddIntegration}>
            Add Integration
          </Button>
        </Card>
      )}

      {/* Integration Types Info */}
      <Card className="p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Integration Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
            <Mail className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-medium text-gray-900">Email Service</h4>
              <p className="text-sm text-gray-600">SendGrid, Mailgun, SMTP</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
            <MessageSquare className="w-5 h-5 text-green-600" />
            <div>
              <h4 className="font-medium text-gray-900">SMS Service</h4>
              <p className="text-sm text-gray-600">Twilio, AWS SNS</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
            <CreditCard className="w-5 h-5 text-purple-600" />
            <div>
              <h4 className="font-medium text-gray-900">Payment Processing</h4>
              <p className="text-sm text-gray-600">Stripe, PayPal, Square</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
            <Calendar className="w-5 h-5 text-orange-600" />
            <div>
              <h4 className="font-medium text-gray-900">Calendar Sync</h4>
              <p className="text-sm text-gray-600">Google Calendar, Outlook</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <Cloud className="w-5 h-5 text-gray-600" />
            <div>
              <h4 className="font-medium text-gray-900">Cloud Storage</h4>
              <p className="text-sm text-gray-600">AWS S3, Google Drive</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg">
            <Plug className="w-5 h-5 text-indigo-600" />
            <div>
              <h4 className="font-medium text-gray-900">Custom API</h4>
              <p className="text-sm text-gray-600">REST, GraphQL, Webhook</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default IntegrationSettings;
