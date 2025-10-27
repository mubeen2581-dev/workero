import React, { useState } from 'react';
import { Save, FileText } from 'lucide-react';
import { QuoteItem } from '@/types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface SaveAsTemplateModalProps {
  items: QuoteItem[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (templateData: { name: string; description: string; items: QuoteItem[] }) => void;
  isLoading?: boolean;
}

const SaveAsTemplateModal: React.FC<SaveAsTemplateModalProps> = ({
  items,
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  const handleSave = () => {
    if (!templateName.trim()) return;

    const templateData = {
      name: templateName.trim(),
      description: templateDescription.trim() || `Template with ${items.length} items`,
      items: items.map(item => ({
        ...item,
        id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      })),
    };

    onSave(templateData);
    setTemplateName('');
    setTemplateDescription('');
  };

  const handleClose = () => {
    setTemplateName('');
    setTemplateDescription('');
    onClose();
  };

  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Save as Template"
      size="md"
    >
      <div className="space-y-6">
        {/* Template Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FileText className="w-4 h-4 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-900">Template Preview</span>
            </div>
            <span className="text-lg font-bold text-primary-600">
              {formatCurrency(totalValue)}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {items.length} item{items.length !== 1 ? 's' : ''} will be saved in this template
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <Input
            label="Template Name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="e.g., Kitchen Renovation Standard"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder="Brief description of this template..."
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Items Preview */}
        <div className="max-h-40 overflow-y-auto">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Items to include:</h4>
          <div className="space-y-1">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                <span className="text-gray-900 truncate flex-1 mr-2">
                  {item.description}
                </span>
                <span className="text-gray-600">
                  {item.quantity} × {formatCurrency(item.unitPrice)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            loading={isLoading}
            disabled={!templateName.trim()}
            icon={Save}
          >
            Save Template
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SaveAsTemplateModal;