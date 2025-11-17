import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2, Plus, Minus } from 'lucide-react';
import { QuoteItem } from '@/types';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface QuoteItemRowProps {
  item: QuoteItem;
  onUpdate: (item: QuoteItem) => void;
  onDelete: (itemId: string) => void;
  isEditable?: boolean;
}

const QuoteItemRow: React.FC<QuoteItemRowProps> = ({
  item,
  onUpdate,
  onDelete,
  isEditable = true,
}) => {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 0) return;
    
    const updatedItem = {
      ...item,
      quantity: newQuantity,
      lineTotal: newQuantity * item.unitPrice, // Line total is before tax
    };
    onUpdate(updatedItem);
  };

  const handleUnitPriceChange = (newPrice: number) => {
    if (newPrice < 0) return;
    
    const updatedItem = {
      ...item,
      unitPrice: newPrice,
      lineTotal: item.quantity * newPrice, // Line total is before tax
    };
    onUpdate(updatedItem);
  };

  const handleTaxRateChange = (newRate: number) => {
    if (newRate < 0 || newRate > 100) return;
    
    const updatedItem = {
      ...item,
      taxRate: newRate,
      lineTotal: item.quantity * item.unitPrice, // Line total is before tax
    };
    onUpdate(updatedItem);
  };

  const handleDescriptionChange = (newDescription: string) => {
    const updatedItem = {
      ...item,
      description: newDescription,
    };
    onUpdate(updatedItem);
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
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
    >
      {/* Description */}
      <td className="px-4 py-3">
        {isEditable ? (
          <input
            type="text"
            value={item.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            placeholder="Item description"
          />
        ) : (
          <span className="text-sm text-gray-900">{item.description}</span>
        )}
      </td>

      {/* Quantity */}
      <td className="px-4 py-3">
        {isEditable ? (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 0}
              className="p-1"
            >
              <Minus className="w-3 h-3" />
            </Button>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              min="0"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-1"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <span className="text-sm text-gray-900">{item.quantity}</span>
        )}
      </td>

      {/* Unit Price */}
      <td className="px-4 py-3">
        {isEditable ? (
          <input
            type="number"
            value={item.unitPrice}
            onChange={(e) => handleUnitPriceChange(parseFloat(e.target.value) || 0)}
            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            min="0"
            step="0.01"
          />
        ) : (
          <span className="text-sm text-gray-900">{formatCurrency(item.unitPrice)}</span>
        )}
      </td>

      {/* Tax Rate */}
      <td className="px-4 py-3">
        {isEditable ? (
          <div className="flex items-center space-x-1">
            <input
              type="number"
              value={item.taxRate}
              onChange={(e) => handleTaxRateChange(parseFloat(e.target.value) || 0)}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              min="0"
              max="100"
              step="0.1"
            />
            <span className="text-xs text-gray-500">%</span>
          </div>
        ) : (
          <span className="text-sm text-gray-900">{item.taxRate.toFixed(1)}%</span>
        )}
      </td>

      {/* Line Total */}
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-gray-900">
          {formatCurrency(item.lineTotal)}
        </span>
      </td>

      {/* Actions */}
      {isEditable && (
        <td className="px-4 py-3">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(item.id)}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </td>
      )}
    </motion.tr>
  );
};

export default QuoteItemRow;
