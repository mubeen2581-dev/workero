import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Zap } from 'lucide-react';
import { QuoteItem } from '@/types';
import Card from '../ui/Card';

interface LivePricingProps {
  items: QuoteItem[];
  onPriceChange?: (newTotal: number) => void;
}

const LivePricing: React.FC<LivePricingProps> = ({ items, onPriceChange }) => {
  const [previousTotal, setPreviousTotal] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate live totals
  const subtotal = items.reduce((sum, item) => {
    const lineTotal = item.lineTotal || (item.quantity * item.unitPrice);
    return sum + lineTotal;
  }, 0);

  const taxAmount = items.reduce((sum, item) => {
    const lineTotal = item.lineTotal || (item.quantity * item.unitPrice);
    return sum + (lineTotal * (item.taxRate || 0) / 100);
  }, 0);

  const total = subtotal + taxAmount;
  const itemCount = items.length;
  const averageItemPrice = itemCount > 0 ? subtotal / itemCount : 0;

  // Track price changes
  useEffect(() => {
    if (previousTotal > 0 && total !== previousTotal) {
      const change = total - previousTotal;
      setPriceChange(change);
      setIsAnimating(true);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
    }
    setPreviousTotal(total);
    
    if (onPriceChange) {
      onPriceChange(total);
    }
  }, [total, previousTotal, onPriceChange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary-600 animate-pulse" />
          <h3 className="text-sm font-semibold text-gray-900">Live Pricing</h3>
        </div>
        <AnimatePresence>
          {isAnimating && priceChange !== 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                priceChange > 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {priceChange > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {priceChange > 0 ? '+' : ''}
              {formatCurrency(priceChange)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2">
        <motion.div
          key={total}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-baseline justify-between"
        >
          <span className="text-xs text-gray-600">Subtotal:</span>
          <span className="text-sm font-medium text-gray-900">{formatCurrency(subtotal)}</span>
        </motion.div>

        <div className="flex items-baseline justify-between">
          <span className="text-xs text-gray-600">Tax:</span>
          <span className="text-sm font-medium text-gray-900">{formatCurrency(taxAmount)}</span>
        </div>

        <div className="pt-2 border-t border-primary-200">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-gray-900">Total:</span>
            <motion.span
              key={total}
              initial={{ scale: 1.1, color: '#10b981' }}
              animate={{ scale: 1, color: '#1f2937' }}
              transition={{ duration: 0.3 }}
              className="text-lg font-bold text-primary-700"
            >
              {formatCurrency(total)}
            </motion.span>
          </div>
        </div>

        <div className="pt-2 border-t border-primary-200 flex items-center justify-between text-xs text-gray-500">
          <span>{itemCount} items</span>
          {itemCount > 0 && (
            <span>Avg: {formatCurrency(averageItemPrice)}</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default LivePricing;


