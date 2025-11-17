import React, { useState } from 'react';
import { X, DollarSign, Calendar, FileText } from 'lucide-react';
import { Invoice, Payment } from '@/types';
import { XEPayService } from '@/services/xepay';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { toast } from 'react-toastify';

interface PartPaymentModalProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
  onPaymentRecorded: (payment: Payment) => void | Promise<void>;
}

const PartPaymentModal: React.FC<PartPaymentModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onPaymentRecorded,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('xe_pay');
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>('');
  const [isDeposit, setIsDeposit] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate outstanding amount
  // In a real app, this would come from payments data
  // For now, we'll use a simple calculation
  const totalPaid = invoice.status === 'paid' ? invoice.total : 0;
  const outstanding = invoice.total - totalPaid;
  const maxAmount = outstanding;

  const formatCurrency = (amount: number, currency: string = invoice.currency || 'GBP') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const paymentAmount = parseFloat(amount);
    
    if (!paymentAmount || paymentAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (paymentAmount > maxAmount) {
      toast.error(`Amount cannot exceed outstanding balance of ${formatCurrency(maxAmount)}`);
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create payment record
      const newPayment: Payment = {
        id: `pay-${Date.now()}`,
        invoiceId: invoice.id,
        amount: paymentAmount,
        paymentMethod: paymentMethod as any,
        paymentDate: new Date(paymentDate).toISOString(),
        reference: `PART-${invoice.id}-${Date.now()}`,
        notes: isDeposit ? `Deposit payment. ${notes}` : `Partial payment. ${notes}`,
        status: paymentMethod === 'xe_pay' || paymentMethod === 'apple_pay' || paymentMethod === 'google_pay' 
          ? 'processing' 
          : 'completed',
        createdAt: new Date().toISOString(),
      };

      // If using XE Pay, create payment link
      if (paymentMethod === 'xe_pay' || paymentMethod === 'apple_pay' || paymentMethod === 'google_pay') {
        await XEPayService.createPaymentLink({
          invoiceId: invoice.id,
          amount: paymentAmount,
          currency: 'GBP',
          description: isDeposit ? 'Deposit payment' : 'Partial payment',
          customerEmail: invoice.client?.email || '',
        });
      }

      // Call the payment recorded handler (which will call the API)
      await onPaymentRecorded(newPayment);
      
      // Only show success and close if handler didn't throw
      toast.success(isDeposit ? 'Deposit recorded successfully' : 'Partial payment recorded successfully');
      
      // Reset form
      setAmount('');
      setNotes('');
      setIsDeposit(false);
      onClose();
    } catch (error) {
      toast.error('Failed to record payment');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50" onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <Card className="w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Record {isDeposit ? 'Deposit' : 'Partial Payment'}
              </h2>
              <p className="text-sm text-gray-600">Invoice: {invoice.id}</p>
            </div>
          </div>

          {/* Outstanding Balance Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Invoice Total:</span>
              <span className="text-lg font-bold text-gray-900">{formatCurrency(invoice.total, invoice.currency || 'GBP')}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium text-gray-700">Outstanding:</span>
              <span className="text-lg font-bold text-blue-600">{formatCurrency(outstanding, invoice.currency || 'GBP')}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Amount *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={maxAmount}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                  placeholder="0.00"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Maximum: {formatCurrency(maxAmount, invoice.currency || 'GBP')}
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                options={[
                  { value: 'xe_pay', label: 'XE Pay (Card)' },
                  { value: 'apple_pay', label: 'Apple Pay' },
                  { value: 'google_pay', label: 'Google Pay' },
                  { value: 'bank_transfer', label: 'Bank Transfer' },
                  { value: 'cash', label: 'Cash' },
                  { value: 'check', label: 'Check' },
                ]}
                required
              />
            </div>

            {/* Payment Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Deposit Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDeposit"
                checked={isDeposit}
                onChange={(e) => setIsDeposit(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="isDeposit" className="text-sm font-medium text-gray-700">
                Mark as Deposit
              </label>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Record Payment'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default PartPaymentModal;

