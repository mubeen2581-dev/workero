import React from 'react';
import { motion } from 'framer-motion';
import { Invoice } from '@/types';
import Card from '../ui/Card';
import { formatDistanceToNow } from 'date-fns';

interface RecentInvoicesProps {
  invoices: Invoice[];
  className?: string;
}

const RecentInvoices: React.FC<RecentInvoicesProps> = ({ invoices, className = '' }) => {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className={className}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Recent Invoices
        </h3>
        <p className="text-sm text-gray-600">
          Latest invoices and payment status
        </p>
      </div>

      <div className="space-y-4">
        {invoices.map((invoice, index) => (
          <motion.div
            key={invoice.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="text-sm font-medium text-gray-900">
                  {invoice.client.name}
                </h4>
                <span className={`badge ${getStatusColor(invoice.status)}`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-1">
                {invoice.job.title}
              </p>
              <p className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(invoice.createdAt), { addSuffix: true })}
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {formatCurrency(invoice.total)}
              </p>
              {invoice.paidDate && (
                <p className="text-xs text-green-600">
                  Paid {formatDistanceToNow(new Date(invoice.paidDate), { addSuffix: true })}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
          View all invoices
        </button>
      </div>
    </Card>
  );
};

export default RecentInvoices;
