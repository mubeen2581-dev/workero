import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Bell, 
  Monitor, 
  Save, 
  RefreshCw,
  Sun,
  Moon,
  Computer,
  Smartphone,
  AlertCircle,
  Settings,
  Upload,
  Download
} from 'lucide-react';
import { 
  mockSystemSettings,
  getTimezoneOptions,
  getLanguageOptions,
  updateSystemSettings
} from '@/mocks/settings';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Badge from '../ui/Badge';

interface SystemPreferencesProps {
  className?: string;
}

const SystemPreferences: React.FC<SystemPreferencesProps> = ({
  className = '',
}) => {
  const [preferences, setPreferences] = useState({
    theme: 'light' as 'light' | 'dark' | 'auto',
    sidebarCollapsed: false,
    compactMode: false,
    showTutorials: true,
    autoSave: true,
    defaultView: 'dashboard' as 'dashboard' | 'leads' | 'jobs' | 'invoices',
    timezone: 'America/New_York',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h' as '12h' | '24h',
  });

  const [notifications, setNotifications] = useState({
    email: {
      enabled: true,
      leads: true,
      jobs: true,
      invoices: true,
      payments: true,
      system: true,
    },
    sms: {
      enabled: true,
      urgent: true,
      reminders: false,
    },
    push: {
      enabled: true,
      desktop: true,
      mobile: true,
    },
    frequency: 'immediate' as 'immediate' | 'daily' | 'weekly' | 'never',
  });

  const [systemSettings, setSystemSettings] = useState(mockSystemSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleNotificationChange = (category: string, key: string, value: any) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...(prev[category as keyof typeof prev] as any),
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSystemSettingChange = (key: string, value: any) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update mock data
      updateSystemSettings(systemSettings);
      
      setHasChanges(false);
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPreferences({
      theme: 'light' as 'light' | 'dark' | 'auto',
      sidebarCollapsed: false,
      compactMode: false,
      showTutorials: true,
      autoSave: true,
      defaultView: 'dashboard' as 'dashboard' | 'leads' | 'jobs' | 'invoices',
      timezone: 'America/New_York',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h' as '12h' | '24h',
    });
    setNotifications({
      email: {
        enabled: true,
        leads: true,
        jobs: true,
        invoices: true,
        payments: true,
        system: true,
      },
      sms: {
        enabled: true,
        urgent: true,
        reminders: false,
      },
      push: {
        enabled: true,
        desktop: true,
        mobile: true,
      },
      frequency: 'immediate' as 'immediate' | 'daily' | 'weekly' | 'never',
    });
    setSystemSettings(mockSystemSettings);
    setHasChanges(false);
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'light': return Sun;
      case 'dark': return Moon;
      case 'auto': return Computer;
      default: return Sun;
    }
  };

  const getStatusColor = (enabled: boolean) => {
    return enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">System Preferences</h2>
          <p className="text-sm sm:text-base text-gray-600">Customize your application experience and settings</p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          {hasChanges && (
            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Unsaved Changes</span>
              <span className="sm:hidden">Unsaved</span>
            </Badge>
          )}
          <Button variant="secondary" onClick={handleReset} className="hidden sm:flex">
            Reset
          </Button>
          <Button variant="secondary" onClick={handleReset} className="sm:hidden p-2">
            <span className="sr-only">Reset</span>
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            icon={isSaving ? RefreshCw : Save}
            className="flex-1 sm:flex-none"
          >
            <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save Changes'}</span>
            <span className="sm:hidden">{isSaving ? 'Saving...' : 'Save'}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Appearance Settings */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Palette className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
                <p className="text-sm text-gray-600">Customize the look and feel of your interface</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {['light', 'dark', 'auto'].map((theme) => {
                    const ThemeIcon = getThemeIcon(theme);
                    const isSelected = preferences.theme === theme;
                    return (
                      <button
                        key={theme}
                        onClick={() => handlePreferenceChange('theme', theme)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <ThemeIcon className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs font-medium capitalize">{theme}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default View</label>
                <Select
                  value={preferences.defaultView}
                  onChange={(value) => handlePreferenceChange('defaultView', value as 'dashboard' | 'leads' | 'jobs' | 'invoices')}
                  options={[
                    { value: 'dashboard', label: 'Dashboard' },
                    { value: 'leads', label: 'Leads' },
                    { value: 'jobs', label: 'Jobs' },
                    { value: 'invoices', label: 'Invoices' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <Select
                  value={preferences.language}
                  onChange={(value) => handlePreferenceChange('language', value)}
                  options={getLanguageOptions()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <Select
                  value={preferences.timezone}
                  onChange={(value) => handlePreferenceChange('timezone', value)}
                  options={getTimezoneOptions()}
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Compact Mode</label>
                  <p className="text-xs text-gray-500">Use smaller spacing and components</p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('compactMode', !preferences.compactMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.compactMode ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.compactMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Show Tutorials</label>
                  <p className="text-xs text-gray-500">Display helpful tips and guides</p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('showTutorials', !preferences.showTutorials)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.showTutorials ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.showTutorials ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Auto Save</label>
                  <p className="text-xs text-gray-500">Automatically save changes</p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('autoSave', !preferences.autoSave)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.autoSave ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.autoSave ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-600">Configure how you receive notifications</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Email Notifications */}
              <div>
                <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-900">Email Notifications</span>
                </div>
                  <button
                    onClick={() => handleNotificationChange('email', 'enabled', !notifications.email.enabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.email.enabled ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.email.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                {notifications.email.enabled && (
                  <div className="grid grid-cols-2 gap-4 ml-6">
                    {Object.entries(notifications.email).filter(([key]) => key !== 'enabled').map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 capitalize">{key}</span>
                        <button
                          onClick={() => handleNotificationChange('email', key, !value)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            value ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SMS Notifications */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">SMS Notifications</span>
                  </div>
                  <button
                    onClick={() => handleNotificationChange('sms', 'enabled', !notifications.sms.enabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.sms.enabled ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.sms.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                {notifications.sms.enabled && (
                  <div className="grid grid-cols-2 gap-4 ml-6">
                    {Object.entries(notifications.sms).filter(([key]) => key !== 'enabled').map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 capitalize">{key}</span>
                        <button
                          onClick={() => handleNotificationChange('sms', key, !value)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            value ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Push Notifications */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Push Notifications</span>
                  </div>
                  <button
                    onClick={() => handleNotificationChange('push', 'enabled', !notifications.push.enabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.push.enabled ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.push.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                {notifications.push.enabled && (
                  <div className="grid grid-cols-2 gap-4 ml-6">
                    {Object.entries(notifications.push).filter(([key]) => key !== 'enabled').map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 capitalize">{key}</span>
                        <button
                          onClick={() => handleNotificationChange('push', key, !value)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            value ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notification Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notification Frequency</label>
                <Select
                  value={notifications.frequency}
                  onChange={(value) => setNotifications(prev => ({ ...prev, frequency: value as 'immediate' | 'daily' | 'weekly' | 'never' }))}
                  options={[
                    { value: 'immediate', label: 'Immediate' },
                    { value: 'daily', label: 'Daily Digest' },
                    { value: 'weekly', label: 'Weekly Summary' },
                    { value: 'never', label: 'Never' },
                  ]}
                />
              </div>
            </div>
          </Card>

          {/* System Settings */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Settings className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
                <p className="text-sm text-gray-600">Configure system-wide preferences</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Maintenance Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                  <p className="text-xs text-gray-500">Enable maintenance mode for system updates</p>
                </div>
                <button
                  onClick={() => handleSystemSettingChange('maintenance', {
                    ...systemSettings.maintenance,
                    enabled: !systemSettings.maintenance.enabled
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    systemSettings.maintenance.enabled ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      systemSettings.maintenance.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Auto Updates */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Auto Updates</label>
                  <p className="text-xs text-gray-500">Automatically install system updates</p>
                </div>
                <button
                  onClick={() => handleSystemSettingChange('updates', {
                    ...systemSettings.updates,
                    autoUpdate: !systemSettings.updates.autoUpdate
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    systemSettings.updates.autoUpdate ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      systemSettings.updates.autoUpdate ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Performance Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Enable Caching</label>
                    <p className="text-xs text-gray-500">Improve performance with data caching</p>
                  </div>
                  <button
                    onClick={() => handleSystemSettingChange('performance', {
                      ...systemSettings.performance,
                      cacheEnabled: !systemSettings.performance.cacheEnabled
                    })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      systemSettings.performance.cacheEnabled ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        systemSettings.performance.cacheEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Enable Compression</label>
                    <p className="text-xs text-gray-500">Compress data for faster loading</p>
                  </div>
                  <button
                    onClick={() => handleSystemSettingChange('performance', {
                      ...systemSettings.performance,
                      compressionEnabled: !systemSettings.performance.compressionEnabled
                    })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      systemSettings.performance.compressionEnabled ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        systemSettings.performance.compressionEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Settings Summary */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Theme</span>
                <Badge className="bg-purple-100 text-purple-800 capitalize">
                  {preferences.theme}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Language</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {preferences.language.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Timezone</span>
                <Badge className="bg-green-100 text-green-800">
                  {preferences.timezone.split('/')[1]}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Notifications</span>
                <Badge className={getStatusColor(notifications.email.enabled)}>
                  {notifications.email.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-start" icon={RefreshCw}>
                Reset to Defaults
              </Button>
              <Button variant="secondary" className="w-full justify-start" icon={Download}>
                Export Settings
              </Button>
              <Button variant="secondary" className="w-full justify-start" icon={Upload}>
                Import Settings
              </Button>
            </div>
          </Card>

          {/* System Status */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Version</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {systemSettings.updates.currentVersion}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Updates</span>
                <Badge className="bg-green-100 text-green-800">
                  Available
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Maintenance</span>
                <Badge className={getStatusColor(!systemSettings.maintenance.enabled)}>
                  {systemSettings.maintenance.enabled ? 'Scheduled' : 'Normal'}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default SystemPreferences;
