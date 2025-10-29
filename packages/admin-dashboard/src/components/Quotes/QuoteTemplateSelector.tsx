import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Check } from 'lucide-react';
import { QuoteItem } from '@/types';
import { mockQuoteTemplates } from '@/mocks/quotes';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface QuoteTemplateSelectorProps {
  onSelectTemplate: (items: QuoteItem[]) => void;
  className?: string;
}

const QuoteTemplateSelector: React.FC<QuoteTemplateSelectorProps> = ({
  onSelectTemplate,
  className = '',
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleTemplateSelect = (templateId: string) => {
    const template = mockQuoteTemplates.find(t => t.id === templateId);
    if (!template) return;

    const templateItems: QuoteItem[] = template.items.map((item, index) => ({
      id: `template-${templateId}-${index}`,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      taxRate: 8.5,
      lineTotal: item.quantity * item.unitPrice * 1.085,
    }));

    onSelectTemplate(templateItems);
    setSelectedTemplate(templateId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <FileText className="w-5 h-5 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Quote Templates</h3>
        </div>

        <div className="space-y-3">
          {mockQuoteTemplates.map((template) => {
            const totalValue = template.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
            const isSelected = selectedTemplate === template.id;

            return (
              <div
                key={template.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-purple-300'
                    : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
                }`}
                style={isSelected ? { backgroundColor: '#F3F0FF' } : {}}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(totalValue)}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-primary-600" />
                    )}
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 mb-3">{template.description}</p>
                
                <div className="space-y-1">
                  {template.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 truncate flex-1 mr-2">
                        {item.description}
                      </span>
                      <span className="text-gray-900">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </span>
                    </div>
                  ))}
                  {template.items.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{template.items.length - 3} more items
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Select a template to add items to your quote
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default QuoteTemplateSelector;