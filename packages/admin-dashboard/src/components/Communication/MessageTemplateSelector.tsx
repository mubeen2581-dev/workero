import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, FileText, DollarSign, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: 'quote' | 'reminder' | 'receipt' | 'general';
  variables: string[];
}

interface MessageTemplateSelectorProps {
  onSelectTemplate: (template: MessageTemplate) => void;
  className?: string;
}

const MessageTemplateSelector: React.FC<MessageTemplateSelectorProps> = ({
  onSelectTemplate,
  className = '',
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({ name: '', content: '', category: 'general' as const });

  const defaultTemplates: MessageTemplate[] = [
    {
      id: 'quote_sent',
      name: 'Quote Sent',
      content: 'Hi {client_name}, your quote #{quote_number} for {service_type} is ready. Total: {quote_amount}. Please review and let us know if you have any questions.',
      category: 'quote',
      variables: ['client_name', 'quote_number', 'service_type', 'quote_amount']
    },
    {
      id: 'payment_reminder',
      name: 'Payment Reminder',
      content: 'Hello {client_name}, this is a friendly reminder that invoice #{invoice_number} for {invoice_amount} is due on {due_date}. You can pay securely using this link: {payment_link}',
      category: 'reminder',
      variables: ['client_name', 'invoice_number', 'invoice_amount', 'due_date', 'payment_link']
    },
    {
      id: 'job_complete',
      name: 'Job Completed',
      content: 'Great news {client_name}! We\'ve completed your {service_type} project. Thank you for choosing Workero. Your invoice will be sent shortly.',
      category: 'general',
      variables: ['client_name', 'service_type']
    },
    {
      id: 'payment_received',
      name: 'Payment Received',
      content: 'Thank you {client_name}! We\'ve received your payment of {payment_amount} for invoice #{invoice_number}. Receipt: {receipt_link}',
      category: 'receipt',
      variables: ['client_name', 'payment_amount', 'invoice_number', 'receipt_link']
    }
  ];

  const [templates, setTemplates] = useState<MessageTemplate[]>(defaultTemplates);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'quote': return <FileText className="w-4 h-4" />;
      case 'reminder': return <Clock className="w-4 h-4" />;
      case 'receipt': return <DollarSign className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'quote': return 'bg-blue-100 text-blue-800';
      case 'reminder': return 'bg-yellow-100 text-yellow-800';
      case 'receipt': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSaveTemplate = () => {
    if (newTemplate.name && newTemplate.content) {
      const template: MessageTemplate = {
        id: `custom_${Date.now()}`,
        name: newTemplate.name,
        content: newTemplate.content,
        category: newTemplate.category,
        variables: extractVariables(newTemplate.content)
      };
      setTemplates([...templates, template]);
      setNewTemplate({ name: '', content: '', category: 'general' });
      setShowModal(false);
    }
  };

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{([^}]+)\}/g);
    return matches ? matches.map(match => match.slice(1, -1)) : [];
  };

  return (
    <>
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Message Templates</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowModal(true)}
            icon={Plus}
          >
            New
          </Button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onSelectTemplate(template)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(template.category)}
                  <span className="font-medium text-gray-900">{template.name}</span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(template.category)}`}>
                  {template.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{template.content}</p>
              {template.variables.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {template.variables.map((variable) => (
                    <span
                      key={variable}
                      className="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded"
                    >
                      {variable}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Card>

      {/* New Template Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Message Template"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Template Name"
            value={newTemplate.name}
            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
            placeholder="Enter template name"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={newTemplate.category}
              onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="general">General</option>
              <option value="quote">Quote</option>
              <option value="reminder">Reminder</option>
              <option value="receipt">Receipt</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Content
            </label>
            <textarea
              value={newTemplate.content}
              onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
              placeholder="Enter message content. Use {variable_name} for dynamic content."
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Use curly braces for variables: {'{client_name}, {quote_amount}, etc.'}
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveTemplate}
              disabled={!newTemplate.name || !newTemplate.content}
            >
              Save Template
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MessageTemplateSelector;