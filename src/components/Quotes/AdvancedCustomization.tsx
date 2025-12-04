import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Palette, Type, Image as ImageIcon, Layers } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface CustomizationOptions {
  theme: 'light' | 'dark' | 'custom';
  primaryColor: string;
  logo?: string;
  fontFamily: string;
  showCompanyLogo: boolean;
  showTerms: boolean;
  customFooter?: string;
  watermark?: string;
}

interface AdvancedCustomizationProps {
  onCustomizationChange: (options: CustomizationOptions) => void;
  existingOptions?: CustomizationOptions;
}

const AdvancedCustomization: React.FC<AdvancedCustomizationProps> = ({
  onCustomizationChange,
  existingOptions,
}) => {
  const [options, setOptions] = useState<CustomizationOptions>(
    existingOptions || {
      theme: 'light',
      primaryColor: '#667eea',
      fontFamily: 'Inter',
      showCompanyLogo: true,
      showTerms: true,
    }
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleOptionChange = (key: keyof CustomizationOptions, value: any) => {
    const updated = { ...options, [key]: value };
    setOptions(updated);
    onCustomizationChange(updated);
  };

  const fontOptions = [
    { value: 'Inter', label: 'Inter (Modern)' },
    { value: 'Roboto', label: 'Roboto (Clean)' },
    { value: 'Open Sans', label: 'Open Sans (Professional)' },
    { value: 'Montserrat', label: 'Montserrat (Elegant)' },
    { value: 'Poppins', label: 'Poppins (Friendly)' },
  ];

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'custom', label: 'Custom' },
  ];

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Advanced Customization</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Hide' : 'Show'} Options
        </Button>
      </div>

      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Theme
            </label>
            <Select
              options={themeOptions}
              value={options.theme}
              onChange={(value) => handleOptionChange('theme', value)}
            />
          </div>

          {/* Primary Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={options.primaryColor}
                onChange={(e) => handleOptionChange('primaryColor', e.target.value)}
                className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <Input
                value={options.primaryColor}
                onChange={(e) => handleOptionChange('primaryColor', e.target.value)}
                placeholder="#667eea"
                className="flex-1"
              />
            </div>
          </div>

          {/* Font Family */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Font Family
            </label>
            <Select
              options={fontOptions}
              value={options.fontFamily}
              onChange={(value) => handleOptionChange('fontFamily', value)}
            />
          </div>

          {/* Display Options */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Display Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.showCompanyLogo}
                  onChange={(e) => handleOptionChange('showCompanyLogo', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Show Company Logo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.showTerms}
                  onChange={(e) => handleOptionChange('showTerms', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Show Terms & Conditions</span>
              </label>
            </div>
          </div>

          {/* Custom Footer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Footer Text
            </label>
            <textarea
              value={options.customFooter || ''}
              onChange={(e) => handleOptionChange('customFooter', e.target.value)}
              placeholder="Add custom footer text for quotes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows={2}
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Custom Logo
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      handleOptionChange('logo', reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              {options.logo && (
                <img src={options.logo} alt="Logo" className="w-16 h-16 object-contain rounded" />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  );
};

export default AdvancedCustomization;


