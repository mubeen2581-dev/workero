import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Calculator } from 'lucide-react';
import { QuoteItem } from '@/types';
import Card from '../ui/Card';

interface QuoteSummaryProps {
  items: QuoteItem[];
  className?: string;
}

const QuoteSummary: React.FC<QuoteSummaryProps> = ({ items, className = '' }) => {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxRate / 100), 0);
  const total = subtotal + taxAmount;

  // Calculate profit margin (mock calculation - in real app this would be based on cost vs price)
  const estimatedCost = subtotal * 0.7; // Assume 30% profit margin
  const profit = subtotal - estimatedCost;
  const profitMargin = subtotal > 0 ? (profit / subtotal) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calculator className="w-5 h-5 mr-2 text-primary-600" />
          Quote Summary
        </h3>

        <div className="space-y-4">
          {/* Subtotal */}
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Subtotal</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(subtotal)}
            </span>
          </div>

          {/* Tax */}
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Tax</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(taxAmount)}
            </span>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between py-3 bg-gray-50 rounded-lg px-4">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-lg font-bold text-primary-600">
              {formatCurrency(total)}
            </span>
          </div>

          {/* Profit Analysis */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">Estimated Profit</span>
              </div>
              <span className="text-sm font-semibold text-green-800">
                {formatCurrency(profit)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-600">Profit Margin</span>
              <span className="text-sm font-medium text-green-700">
                {profitMargin.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Item Count */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
            <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
            <span>Total value: {formatCurrency(subtotal)}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default QuoteSummary;
