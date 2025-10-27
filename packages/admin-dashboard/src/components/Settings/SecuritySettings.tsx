import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Clock, 
  Globe, 
  Database, 
  Check, 
  X, 
  Save, 
  RefreshCw, 
  Download, 
  FileText, 
  Trash2, 
  Plus, 
  AlertCircle
} from 'lucide-react';
import { 
  mockSecuritySettings,
  mockDataSettings,
  updateSecuritySettings,
  updateDataSettings,
  validatePassword
} from '@/mocks/settings';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';

interface SecuritySettingsProps {
  className?: string;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  className = '',
}) => {
  const [securitySettings, setSecuritySettings] = useState(mockSecuritySettings);
  const [dataSettings, setDataSettings] = useState(mockDataSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testPassword, setTestPassword] = useState('');
  const [passwordValidation, setPasswordValidation] = useState<{ valid: boolean; errors: string[] } | null>(null);

  const handleSecurityChange = (key: string, value: any) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handlePasswordPolicyChange = (key: string, value: any) => {
    setSecuritySettings(prev => ({
      ...prev,
      passwordPolicy: {
        ...prev.passwordPolicy,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleTwoFactorChange = (key: string, value: any) => {
    setSecuritySettings(prev => ({
      ...prev,
      twoFactor: {
        ...prev.twoFactor,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleDataRetentionChange = (key: string, value: any) => {
    setSecuritySettings(prev => ({
      ...prev,
      dataRetention: {
        ...prev.dataRetention,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };


  const handleBackupChange = (key: string, value: any) => {
    setDataSettings(prev => ({
      ...prev,
      backup: {
        ...prev.backup,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleExportChange = (key: string, value: any) => {
    setDataSettings(prev => ({
      ...prev,
      export: {
        ...prev.export,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleImportChange = (key: string, value: any) => {
    setDataSettings(prev => ({
      ...prev,
      import: {
        ...prev.import,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleTestPassword = () => {
    const validation = validatePassword(testPassword, securitySettings.passwordPolicy);
    setPasswordValidation(validation);
  };

  const handleAddIP = () => {
    const newIP = prompt('Enter IP address or CIDR block:');
    if (newIP && newIP.trim()) {
      setSecuritySettings(prev => ({
        ...prev,
        ipWhitelist: [...prev.ipWhitelist, newIP.trim()],
      }));
      setHasChanges(true);
    }
  };

  const handleRemoveIP = (index: number) => {
    setSecuritySettings(prev => ({
      ...prev,
      ipWhitelist: prev.ipWhitelist.filter((_, i) => i !== index),
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update mock data
      updateSecuritySettings(securitySettings);
      updateDataSettings(dataSettings);
      
      setHasChanges(false);
      console.log('Security settings saved successfully');
    } catch (error) {
      console.error('Failed to save security settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSecuritySettings(mockSecuritySettings);
    setDataSettings(mockDataSettings);
    setHasChanges(false);
  };

  const getStatusColor = (enabled: boolean) => {
    return enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };


  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    return {
      score: strength,
      level: strength < 2 ? 'Weak' : strength < 4 ? 'Medium' : 'Strong',
      color: strength < 2 ? 'bg-red-100 text-red-800' : strength < 4 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
    };
  };

  const passwordStrength = testPassword ? getPasswordStrength(testPassword) : null;

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
          <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
          <p className="text-gray-600">Configure security policies and data protection settings</p>
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
          {/* Password Policy */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Password Policy</h3>
                <p className="text-sm text-gray-600">Configure password requirements and security</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Length</label>
                <Input
                  type="number"
                  value={securitySettings.passwordPolicy.minLength}
                  onChange={(e) => handlePasswordPolicyChange('minLength', parseInt(e.target.value))}
                  placeholder="Enter minimum length"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiration (Days)</label>
                <Input
                  type="number"
                  value={securitySettings.passwordPolicy.expirationDays}
                  onChange={(e) => handlePasswordPolicyChange('expirationDays', parseInt(e.target.value))}
                  placeholder="Enter expiration days"
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Require Uppercase</label>
                  <p className="text-xs text-gray-500">Password must contain uppercase letters</p>
                </div>
                <button
                  onClick={() => handlePasswordPolicyChange('requireUppercase', !securitySettings.passwordPolicy.requireUppercase)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    securitySettings.passwordPolicy.requireUppercase ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      securitySettings.passwordPolicy.requireUppercase ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Require Lowercase</label>
                  <p className="text-xs text-gray-500">Password must contain lowercase letters</p>
                </div>
                <button
                  onClick={() => handlePasswordPolicyChange('requireLowercase', !securitySettings.passwordPolicy.requireLowercase)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    securitySettings.passwordPolicy.requireLowercase ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      securitySettings.passwordPolicy.requireLowercase ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Require Numbers</label>
                  <p className="text-xs text-gray-500">Password must contain numbers</p>
                </div>
                <button
                  onClick={() => handlePasswordPolicyChange('requireNumbers', !securitySettings.passwordPolicy.requireNumbers)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    securitySettings.passwordPolicy.requireNumbers ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      securitySettings.passwordPolicy.requireNumbers ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Require Symbols</label>
                  <p className="text-xs text-gray-500">Password must contain special characters</p>
                </div>
                <button
                  onClick={() => handlePasswordPolicyChange('requireSymbols', !securitySettings.passwordPolicy.requireSymbols)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    securitySettings.passwordPolicy.requireSymbols ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      securitySettings.passwordPolicy.requireSymbols ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Password Tester */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Password Tester</h4>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={testPassword}
                    onChange={(e) => setTestPassword(e.target.value)}
                    placeholder="Test password against policy"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={showPassword ? EyeOff : Eye}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    Toggle
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleTestPassword}
                    disabled={!testPassword}
                  >
                    Test
                  </Button>
                </div>
                
                {passwordStrength && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Strength:</span>
                    <Badge className={passwordStrength.color}>
                      {passwordStrength.level}
                    </Badge>
                  </div>
                )}
                
                {passwordValidation && (
                  <div className="space-y-2">
                    {passwordValidation.valid ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Password meets all requirements</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {passwordValidation.errors.map((error, index) => (
                          <div key={index} className="flex items-center space-x-2 text-red-600">
                            <X className="w-4 h-4" />
                            <span className="text-sm">{error}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">Configure 2FA settings for enhanced security</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Enable 2FA</label>
                  <p className="text-xs text-gray-500">Require two-factor authentication for all users</p>
                </div>
                <button
                  onClick={() => handleTwoFactorChange('enabled', !securitySettings.twoFactor.enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    securitySettings.twoFactor.enabled ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      securitySettings.twoFactor.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {securitySettings.twoFactor.enabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">2FA Method</label>
                  <Select
                    value={securitySettings.twoFactor.method}
                    onChange={(value) => handleTwoFactorChange('method', value)}
                    options={[
                      { value: 'sms', label: 'SMS' },
                      { value: 'email', label: 'Email' },
                      { value: 'app', label: 'Authenticator App' },
                    ]}
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Session Management */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Session Management</h3>
                <p className="text-sm text-gray-600">Configure session timeout and security</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (Minutes)</label>
                <Input
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                  placeholder="Enter timeout in minutes"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Audit Logging</label>
                  <p className="text-xs text-gray-500">Log all user actions and system events</p>
                </div>
                <button
                  onClick={() => handleSecurityChange('auditLogging', !securitySettings.auditLogging)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    securitySettings.auditLogging ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      securitySettings.auditLogging ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* IP Whitelist */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Globe className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">IP Whitelist</h3>
                <p className="text-sm text-gray-600">Restrict access to specific IP addresses</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button variant="secondary" icon={Plus} onClick={handleAddIP}>
                  Add IP Address
                </Button>
              </div>

              <div className="space-y-2">
                {securitySettings.ipWhitelist.map((ip, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-mono text-gray-900">{ip}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleRemoveIP(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                  </div>
                ))}
              </div>

              {securitySettings.ipWhitelist.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Globe className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No IP addresses whitelisted</p>
                  <p className="text-xs">All IP addresses are allowed</p>
                </div>
              )}
            </div>
          </Card>

          {/* Data Retention */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Database className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Data Retention</h3>
                <p className="text-sm text-gray-600">Configure data retention and cleanup policies</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Enable Data Retention</label>
                  <p className="text-xs text-gray-500">Automatically delete old data</p>
                </div>
                <button
                  onClick={() => handleDataRetentionChange('enabled', !securitySettings.dataRetention.enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    securitySettings.dataRetention.enabled ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      securitySettings.dataRetention.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {securitySettings.dataRetention.enabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period (Days)</label>
                  <Input
                    type="number"
                    value={securitySettings.dataRetention.days}
                    onChange={(e) => handleDataRetentionChange('days', parseInt(e.target.value))}
                    placeholder="Enter retention period"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Data Management */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
                <p className="text-sm text-gray-600">Configure backup, export, and import settings</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Backup Settings */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Backup Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Enable Backup</label>
                      <p className="text-xs text-gray-500">Automatically backup data</p>
                    </div>
                    <button
                      onClick={() => handleBackupChange('enabled', !dataSettings.backup.enabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        dataSettings.backup.enabled ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          dataSettings.backup.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {dataSettings.backup.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                        <Select
                          value={dataSettings.backup.frequency}
                          onChange={(value) => handleBackupChange('frequency', value)}
                          options={[
                            { value: 'daily', label: 'Daily' },
                            { value: 'weekly', label: 'Weekly' },
                            { value: 'monthly', label: 'Monthly' },
                          ]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Retention (Days)</label>
                        <Input
                          type="number"
                          value={dataSettings.backup.retention}
                          onChange={(e) => handleBackupChange('retention', parseInt(e.target.value))}
                          placeholder="Enter retention days"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Export Settings */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Export Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Export Formats</label>
                    <div className="flex flex-wrap gap-2">
                      {['CSV', 'Excel', 'PDF', 'JSON'].map((format) => (
                        <label key={format} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={dataSettings.export.formats.includes(format)}
                            onChange={(e) => {
                              const formats = e.target.checked
                                ? [...dataSettings.export.formats, format]
                                : dataSettings.export.formats.filter(f => f !== format);
                              handleExportChange('formats', formats);
                            }}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{format}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Include Deleted Records</label>
                      <p className="text-xs text-gray-500">Export deleted records in exports</p>
                    </div>
                    <button
                      onClick={() => handleExportChange('includeDeleted', !dataSettings.export.includeDeleted)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        dataSettings.export.includeDeleted ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          dataSettings.export.includeDeleted ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Import Settings */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Import Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Formats</label>
                    <div className="flex flex-wrap gap-2">
                      {['CSV', 'Excel', 'JSON'].map((format) => (
                        <label key={format} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={dataSettings.import.allowedFormats.includes(format)}
                            onChange={(e) => {
                              const formats = e.target.checked
                                ? [...dataSettings.import.allowedFormats, format]
                                : dataSettings.import.allowedFormats.filter(f => f !== format);
                              handleImportChange('allowedFormats', formats);
                            }}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{format}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
                    <Input
                      type="number"
                      value={dataSettings.import.maxFileSize}
                      onChange={(e) => handleImportChange('maxFileSize', parseInt(e.target.value))}
                      placeholder="Enter max file size"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Security Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">2FA</span>
                <Badge className={getStatusColor(securitySettings.twoFactor.enabled)}>
                  {securitySettings.twoFactor.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Audit Logging</span>
                <Badge className={getStatusColor(securitySettings.auditLogging)}>
                  {securitySettings.auditLogging ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Data Retention</span>
                <Badge className={getStatusColor(securitySettings.dataRetention.enabled)}>
                  {securitySettings.dataRetention.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Backup</span>
                <Badge className={getStatusColor(dataSettings.backup.enabled)}>
                  {dataSettings.backup.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-start" icon={Download}>
                Export Security Log
              </Button>
              <Button variant="secondary" className="w-full justify-start" icon={RefreshCw}>
                Reset to Defaults
              </Button>
              <Button variant="secondary" className="w-full justify-start" icon={Shield}>
                Security Audit
              </Button>
            </div>
          </Card>

          {/* Password Policy Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Policy</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Min Length</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {securitySettings.passwordPolicy.minLength}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Expiration</span>
                <Badge className="bg-green-100 text-green-800">
                  {securitySettings.passwordPolicy.expirationDays} days
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Uppercase</span>
                <Badge className={getStatusColor(securitySettings.passwordPolicy.requireUppercase)}>
                  {securitySettings.passwordPolicy.requireUppercase ? 'Required' : 'Optional'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Numbers</span>
                <Badge className={getStatusColor(securitySettings.passwordPolicy.requireNumbers)}>
                  {securitySettings.passwordPolicy.requireNumbers ? 'Required' : 'Optional'}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Data Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Backup Frequency</span>
                <Badge className="bg-purple-100 text-purple-800 capitalize">
                  {dataSettings.backup.frequency}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Export Formats</span>
                <Badge className="bg-orange-100 text-orange-800">
                  {dataSettings.export.formats.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Max File Size</span>
                <Badge className="bg-indigo-100 text-indigo-800">
                  {dataSettings.import.maxFileSize} MB
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default SecuritySettings;
