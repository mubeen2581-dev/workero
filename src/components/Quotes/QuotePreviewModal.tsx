import React from 'react';
import { motion } from 'framer-motion';
import { X, User, Calendar, DollarSign, FileText, MapPin } from 'lucide-react';
import { Quote } from '@/types';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import { formatDistanceToNow } from 'date-fns';

interface QuotePreviewModalProps {
  quote: Quote | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuotePreviewModal: React.FC<QuotePreviewModalProps> = ({
  quote,
  isOpen,
  onClose,
}) => {
  if (!quote) return null;

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-yellow-100 text-yellow-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Quote #${quote.id.split('-')[1].toUpperCase()}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Quote Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Quote #{quote.id.split('-')[1].toUpperCase()}
              </h3>
              <p className="text-sm text-gray-600">
                Created {formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge className={getStatusColor(quote.status)}>
              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
            </Badge>
            <div className="text-2xl font-bold text-primary-600 mt-1">
              {formatCurrency(quote.total || 0)}
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary-600" />
              Client Information
            </h4>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-600">Name:</span>
                <span className="ml-2 text-sm text-gray-900">{quote.client.name}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Email:</span>
                <span className="ml-2 text-sm text-gray-900">{quote.client.email}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Phone:</span>
                <span className="ml-2 text-sm text-gray-900">{quote.client.phone}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-900">
                  <div>{quote.client.address.street}</div>
                  <div>{quote.client.address.city}, {quote.client.address.state} {quote.client.address.zipCode}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary-600" />
              Quote Details
            </h4>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-600">Valid Until:</span>
                <span className="ml-2 text-sm text-gray-900">
                  {new Date(quote.validUntil).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Profit Margin:</span>
                <span className="ml-2 text-sm font-semibold text-green-600">
                  {typeof quote.profitMargin === 'number' 
                    ? quote.profitMargin.toFixed(1) 
                    : parseFloat(quote.profitMargin || quote.profit_margin || '0').toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Items:</span>
                <span className="ml-2 text-sm text-gray-900">
                  {quote.items.length} item{quote.items.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Items */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Quote Items</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tax
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quote.items.map((item: any) => {
                  const taxRate = typeof item.taxRate === 'number' 
                    ? item.taxRate 
                    : parseFloat(item.tax_rate || item.taxRate || '0');
                  const unitPrice = typeof item.unitPrice === 'number'
                    ? item.unitPrice
                    : parseFloat(item.unit_price || item.unitPrice || '0');
                  const lineTotal = typeof item.lineTotal === 'number'
                    ? item.lineTotal
                    : parseFloat(item.line_total || item.lineTotal || '0');
                  
                  return (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(unitPrice)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{taxRate.toFixed(1)}%</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(lineTotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quote Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Subtotal:</span>
            <span className="text-sm text-gray-900">{formatCurrency(quote.subtotal || 0)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Tax:</span>
            <span className="text-sm text-gray-900">{formatCurrency(quote.taxAmount || 0)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-lg font-bold text-primary-600">{formatCurrency(quote.total || 0)}</span>
          </div>
        </div>

        {/* Notes */}
        {quote.notes && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Notes</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{quote.notes}</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default QuotePreviewModal;