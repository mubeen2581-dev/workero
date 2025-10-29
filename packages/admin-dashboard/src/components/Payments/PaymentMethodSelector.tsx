import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Building2, Check } from 'lucide-react';
import { PaymentMethod } from '@/types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface PaymentMethodSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onMethodSelect: (method: PaymentMethod) => void;
  amount: number;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  isOpen,
  onClose,
  onMethodSelect,
  amount,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'xe_pay',
      type: 'card',
      name: 'XE Pay (Recommended)',
      icon: 'CreditCard',
      enabled: true,
      fees: { percentage: 2.9, fixed: 0.30 }
    },
    {
      id: 'apple_pay',
      type: 'digital_wallet',
      name: 'Apple Pay',
      icon: 'Smartphone',
      enabled: true,
      fees: { percentage: 2.9, fixed: 0.30 }
    },
    {
      id: 'google_pay',
      type: 'digital_wallet',
      name: 'Google Pay',
      icon: 'Smartphone',
      enabled: true,
      fees: { percentage: 2.9, fixed: 0.30 }
    },
    {
      id: 'bank_transfer',
      type: 'bank',
      name: 'Bank Transfer',
      icon: 'Building2',
      enabled: true,
      fees: { percentage: 0.8, fixed: 0 }
    },
    {
      id: 'credit_card',
      type: 'card',
      name: 'Credit/Debit Card',
      icon: 'CreditCard',
      enabled: true,
      fees: { percentage: 3.2, fixed: 0.30 }
    }
  ];

  const getMethodIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard':
        return <CreditCard className="w-6 h-6" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6" />;
      case 'Building2':
        return <Building2 className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  const calculateFees = (method: PaymentMethod) => {
    if (!method.fees) return 0;
    return (amount * method.fees.percentage / 100) + method.fees.fixed;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  const handleConfirm = () => {
    if (selectedMethod) {
      onMethodSelect(selectedMethod);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Payment Method"
      size="md"
    >
      <div className="space-y-4">
        {/* Amount Summary */}
        <div className="bg-primary-50 rounded-lg p-4 text-center">
          <div className="text-sm text-primary-600 font-medium">Payment Amount</div>
          <div className="text-2xl font-bold text-primary-900">
            {formatCurrency(amount)}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Choose Payment Method</h4>
          
          {paymentMethods.map((method) => {
            const fees = calculateFees(method);
            const total = amount + fees;
            const isSelected = selectedMethod?.id === method.id;
            const isRecommended = method.id === 'xe_pay';

            return (
              <motion.div
                key={method.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'ring-2 ring-primary-500 bg-primary-50'
                      : 'hover:bg-gray-50'
                  } ${!method.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => method.enabled && handleMethodSelect(method)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? 'bg-primary-100' : 'bg-gray-100'
                      }`}>
                        {getMethodIcon(method.icon)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {method.name}
                          </span>
                          {isRecommended && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              Recommended
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {method.fees ? (
                            <>
                              Fee: {method.fees.percentage}% + ${method.fees.fixed} = {formatCurrency(fees)}
                            </>
                          ) : (
                            'No fees'
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {isSelected && (
                        <div className="flex items-center justify-center w-6 h-6 bg-primary-600 rounded-full">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        Total: {formatCurrency(total)}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Method Summary */}
        {selectedMethod && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Fee:</span>
                <span>{formatCurrency(calculateFees(selectedMethod))}</span>
              </div>
              <div className="flex justify-between font-medium text-gray-900 pt-1 border-t">
                <span>Total:</span>
                <span>{formatCurrency(amount + calculateFees(selectedMethod))}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedMethod}
          >
            Continue with {selectedMethod?.name || 'Selected Method'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentMethodSelector;