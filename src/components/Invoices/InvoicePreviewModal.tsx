import React from 'react';
import { motion } from 'framer-motion';
import { X, User, Calendar, DollarSign, FileText, MapPin, Download, Send } from 'lucide-react';
import { Invoice } from '@/types';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';

interface InvoicePreviewModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onSend?: () => void;
  onDownload?: () => void;
}

const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onSend,
  onDownload,
}) => {
  if (!invoice) return null;

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number, currency: string = invoice.currency || 'GBP') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const subtotal = invoice.amount || 0;
  const taxAmount = invoice.taxAmount || 0;
  const total = invoice.total || subtotal + taxAmount;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invoice #${invoice.id.substring(0, 8).toUpperCase()}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Invoice Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Invoice #{invoice.id.substring(0, 8).toUpperCase()}
              </h3>
              <p className="text-sm text-gray-600">
                Created {formatDistanceToNow(new Date(invoice.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge className={getStatusColor(invoice.status)}>
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </Badge>
            <div className="text-2xl font-bold text-primary-600 mt-1">
              {formatCurrency(total)}
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary-600" />
              Bill To
            </h4>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-600">Name:</span>
                <span className="ml-2 text-sm text-gray-900">{invoice.client?.name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Email:</span>
                <span className="ml-2 text-sm text-gray-900">{invoice.client?.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Phone:</span>
                <span className="ml-2 text-sm text-gray-900">{invoice.client?.phone || 'N/A'}</span>
              </div>
              {invoice.client?.address && (
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-900">
                    <div>{invoice.client.address.street}</div>
                    <div>{invoice.client.address.city}, {invoice.client.address.state} {invoice.client.address.zipCode}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary-600" />
              Invoice Details
            </h4>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-600">Invoice Date:</span>
                <span className="ml-2 text-sm text-gray-900">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Due Date:</span>
                <span className="ml-2 text-sm text-gray-900">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </span>
              </div>
              {invoice.job && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Related Job:</span>
                  <span className="ml-2 text-sm text-gray-900">{invoice.job.title || 'N/A'}</span>
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-gray-600">Currency:</span>
                <span className="ml-2 text-sm text-gray-900">{invoice.currency || 'GBP'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Items</h4>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Rate</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item, index) => {
                    const itemSubtotal = (item.quantity || 0) * (item.unitPrice || 0);
                    const itemTax = itemSubtotal * ((item.taxRate || 0) / 100);
                    const itemTotal = itemSubtotal + itemTax;
                    
                    return (
                      <tr key={item.id || index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.unitPrice || 0)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.taxRate || 0}%</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(itemTotal)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="flex justify-end">
          <div className="w-full md:w-1/2 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900 font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax:</span>
              <span className="text-gray-900 font-medium">{formatCurrency(taxAmount)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-lg font-bold text-primary-600">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900">Notes</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{invoice.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" icon={Download} onClick={onDownload}>
            Download PDF
          </Button>
          {invoice.status === 'draft' && (
            <Button variant="primary" icon={Send} onClick={onSend}>
              Send Invoice
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default InvoicePreviewModal;

