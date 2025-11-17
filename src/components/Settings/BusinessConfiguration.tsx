import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Clock, 
  DollarSign, 
  FileText, 
  Save, 
  RefreshCw,
  Upload,
  Download,
  Check,
  X,
  AlertCircle,
  Info,
  Settings,
  Calendar,
  CreditCard,
  Receipt,
  Building2,
  Users,
  Shield,
  Lock,
  Unlock,
  Edit,
  Trash2,
  Plus,
  Minus
} from 'lucide-react';
import { 
  mockBusinessSettings,
  getTimezoneOptions,
  getCurrencyOptions,
  updateBusinessSettings
} from '@/mocks/settings';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';

interface BusinessConfigurationProps {
  className?: string;
}

const BusinessConfiguration: React.FC<BusinessConfigurationProps> = ({
  className = '',
}) => {
  const [businessSettings, setBusinessSettings] = useState(mockBusinessSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleBusinessChange = (key: string, value: any) => {
    setBusinessSettings(prev => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleAddressChange = (key: string, value: string) => {
    setBusinessSettings(prev => ({
      ...prev,
      companyAddress: {
        ...prev.companyAddress,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleBusinessHoursChange = (day: string, key: string, value: any) => {
    setBusinessSettings(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day as keyof typeof prev.businessHours],
          [key]: value,
        },
      },
    }));
    setHasChanges(true);
  };

  const handleTaxSettingsChange = (key: string, value: any) => {
    setBusinessSettings(prev => ({
      ...prev,
      taxSettings: {
        ...prev.taxSettings,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleInvoiceSettingsChange = (key: string, value: any) => {
    setBusinessSettings(prev => ({
      ...prev,
      invoiceSettings: {
        ...prev.invoiceSettings,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update mock data
      updateBusinessSettings(businessSettings);
      
      setHasChanges(false);
      console.log('Business settings saved successfully');
    } catch (error) {
      console.error('Failed to save business settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setBusinessSettings(mockBusinessSettings);
    setHasChanges(false);
  };

  const getDayName = (day: string) => {
    const dayNames: Record<string, string> = {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
    };
    return dayNames[day] || day;
  };

  const getStatusColor = (enabled: boolean) => {
    return enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusIcon = (enabled: boolean) => {
    return enabled ? Check : X;
  };

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
          <h2 className="text-2xl font-bold text-gray-900">Business Configuration</h2>
          <p className="text-gray-600">Configure your business information and settings</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <Badge className="bg-yellow-100 text-yellow-800">
              <AlertCircle className="w-3 h-3 mr-1" />
              Unsaved Changes
            </Badge>
          )}
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            icon={isSaving ? RefreshCw : Save}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                <p className="text-sm text-gray-600">Basic business details and contact information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <Input
                  value={businessSettings.companyName}
                  onChange={(e) => handleBusinessChange('companyName', e.target.value)}
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Email</label>
                <Input
                  type="email"
                  value={businessSettings.companyEmail}
                  onChange={(e) => handleBusinessChange('companyEmail', e.target.value)}
                  placeholder="Enter company email"
                  icon={Mail}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Phone</label>
                <Input
                  value={businessSettings.companyPhone}
                  onChange={(e) => handleBusinessChange('companyPhone', e.target.value)}
                  placeholder="Enter company phone"
                  icon={Phone}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <Input
                  value={businessSettings.website}
                  onChange={(e) => handleBusinessChange('website', e.target.value)}
                  placeholder="Enter website URL"
                  icon={Globe}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <Select
                  value={businessSettings.currency}
                  onChange={(value) => handleBusinessChange('currency', value)}
                  options={getCurrencyOptions()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <Select
                  value={businessSettings.timezone}
                  onChange={(value) => handleBusinessChange('timezone', value)}
                  options={getTimezoneOptions()}
                />
              </div>
            </div>

            {/* Company Address */}
            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Company Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <Input
                    value={businessSettings.companyAddress.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    placeholder="Enter street address"
                    icon={MapPin}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <Input
                    value={businessSettings.companyAddress.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    placeholder="Enter city"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <Input
                    value={businessSettings.companyAddress.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    placeholder="Enter state"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <Input
                    value={businessSettings.companyAddress.zipCode}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    placeholder="Enter ZIP code"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <Input
                    value={businessSettings.companyAddress.country}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Business Hours */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
                <p className="text-sm text-gray-600">Set your operating hours for each day</p>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(businessSettings.businessHours).map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={hours.enabled}
                      onChange={(e) => handleBusinessHoursChange(day, 'enabled', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="font-medium text-gray-900">{getDayName(day)}</span>
                  </div>
                  
                  {hours.enabled && (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={hours.start}
                        onChange={(e) => handleBusinessHoursChange(day, 'start', e.target.value)}
                        className="w-32"
                      />
                      <span className="text-gray-500">to</span>
                      <Input
                        type="time"
                        value={hours.end}
                        onChange={(e) => handleBusinessHoursChange(day, 'end', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Tax Settings */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Receipt className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tax Settings</h3>
                <p className="text-sm text-gray-600">Configure tax rates and settings</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Enable Tax</label>
                  <p className="text-xs text-gray-500">Apply tax to invoices and quotes</p>
                </div>
                <button
                  onClick={() => handleTaxSettingsChange('enabled', !businessSettings.taxSettings.enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    businessSettings.taxSettings.enabled ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      businessSettings.taxSettings.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {businessSettings.taxSettings.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={businessSettings.taxSettings.rate}
                      onChange={(e) => handleTaxSettingsChange('rate', parseFloat(e.target.value))}
                      placeholder="Enter tax rate"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Name</label>
                    <Input
                      value={businessSettings.taxSettings.name}
                      onChange={(e) => handleTaxSettingsChange('name', e.target.value)}
                      placeholder="Enter tax name"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Invoice Settings */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Invoice Settings</h3>
                <p className="text-sm text-gray-600">Configure invoice numbering and terms</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Prefix</label>
                <Input
                  value={businessSettings.invoiceSettings.prefix}
                  onChange={(e) => handleInvoiceSettingsChange('prefix', e.target.value)}
                  placeholder="Enter invoice prefix"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Next Number</label>
                <Input
                  type="number"
                  value={businessSettings.invoiceSettings.nextNumber}
                  onChange={(e) => handleInvoiceSettingsChange('nextNumber', parseInt(e.target.value))}
                  placeholder="Enter next number"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                <Input
                  value={businessSettings.invoiceSettings.terms}
                  onChange={(e) => handleInvoiceSettingsChange('terms', e.target.value)}
                  placeholder="Enter payment terms"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Footer Text</label>
                <textarea
                  value={businessSettings.invoiceSettings.footer}
                  onChange={(e) => handleInvoiceSettingsChange('footer', e.target.value)}
                  placeholder="Enter footer text"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Business Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Company</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {businessSettings.companyName}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Currency</span>
                <Badge className="bg-green-100 text-green-800">
                  {businessSettings.currency}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Timezone</span>
                <Badge className="bg-purple-100 text-purple-800">
                  {businessSettings.timezone.split('/')[1]}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tax</span>
                <Badge className={getStatusColor(businessSettings.taxSettings.enabled)}>
                  {businessSettings.taxSettings.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-start" icon={Download}>
                Export Settings
              </Button>
              <Button variant="secondary" className="w-full justify-start" icon={Upload}>
                Import Settings
              </Button>
              <Button variant="secondary" className="w-full justify-start" icon={RefreshCw}>
                Reset to Defaults
              </Button>
            </div>
          </Card>

          {/* Business Hours Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
            <div className="space-y-2">
              {Object.entries(businessSettings.businessHours).map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{getDayName(day)}</span>
                  <div className="flex items-center space-x-2">
                    {hours.enabled ? (
                      <Badge className="bg-green-100 text-green-800">
                        {hours.start} - {hours.end}
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Closed</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Tax Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className={getStatusColor(businessSettings.taxSettings.enabled)}>
                  {businessSettings.taxSettings.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              {businessSettings.taxSettings.enabled && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rate</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {businessSettings.taxSettings.rate}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Name</span>
                    <Badge className="bg-purple-100 text-purple-800">
                      {businessSettings.taxSettings.name}
                    </Badge>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default BusinessConfiguration;
