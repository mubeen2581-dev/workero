import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle, AlertCircle, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { Payment, PaymentMethod } from '@/types';
import { XEPayService } from '@/services/xepay';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface PaymentStatusTrackerProps {
  invoiceId: string;
  onPaymentUpdate?: (payment: Payment) => void;
}

const PaymentStatusTracker: React.FC<PaymentStatusTrackerProps> = ({
  invoiceId,
  onPaymentUpdate,
}) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPaymentData();
    const interval = setInterval(loadPaymentData, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [invoiceId]);

  const loadPaymentData = async () => {
    try {
      const [methodsData] = await Promise.all([
        XEPayService.getPaymentMethods(),
      ]);
      
      setPaymentMethods(methodsData);
      
      // Mock payment data for demo
      const mockPayments: Payment[] = [
        {
          id: 'pay_1',
          invoiceId,
          amount: 1250,
          paymentMethod: 'xe_pay',
          paymentDate: new Date().toISOString(),
          reference: 'XE123456789',
          status: 'completed',
          xePayTransactionId: 'xe_txn_123',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'pay_2',
          invoiceId,
          amount: 500,
          paymentMethod: 'apple_pay',
          paymentDate: new Date().toISOString(),
          reference: 'AP987654321',
          status: 'processing',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        }
      ];
      
      setPayments(mockPayments);
    } catch (error) {
      console.error('Failed to load payment data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: Payment['paymentMethod']) => {
    switch (method) {
      case 'xe_pay':
      case 'credit_card':
        return <CreditCard className="w-4 h-4" />;
      case 'apple_pay':
      case 'google_pay':
        return <Smartphone className="w-4 h-4" />;
      case 'bank_transfer':
        return <Building2 className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const formatPaymentMethod = (method: Payment['paymentMethod']) => {
    const methodMap: Record<string, string> = {
      xe_pay: 'XE Pay',
      credit_card: 'Credit Card',
      apple_pay: 'Apple Pay',
      google_pay: 'Google Pay',
      bank_transfer: 'Bank Transfer',
      cash: 'Cash',
      check: 'Check',
    };
    return methodMap[method] || method;
  };

  const totalPaid = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalProcessing = payments
    .filter(p => p.status === 'processing')
    .reduce((sum, p) => sum + p.amount, 0);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Payment Summary */}
      <Card className="p-3">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Payment Status</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-lg p-2">
            <div className="text-xs text-green-600 font-medium">Total Paid</div>
            <div className="text-lg font-bold text-green-900">
              {formatCurrency(totalPaid)}
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-2">
            <div className="text-xs text-yellow-600 font-medium">Processing</div>
            <div className="text-lg font-bold text-yellow-900">
              {formatCurrency(totalProcessing)}
            </div>
          </div>
        </div>
      </Card>

      {/* Payment History */}
      <Card className="p-3">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Payment History</h3>
        
        {payments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No payments recorded yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {payments.map((payment) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4">{getStatusIcon(payment.status)}</div>
                  <div>
                    <div className="flex items-center space-x-1">
                      {getPaymentMethodIcon(payment.paymentMethod)}
                      <span className="text-sm font-medium text-gray-900">
                        {formatPaymentMethod(payment.paymentMethod)}
                      </span>
                      <Badge className={`text-xs ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      {payment.reference} • {new Date(payment.paymentDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(payment.amount)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Available Payment Methods */}
      <Card className="p-3">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Payment Methods</h3>
        <div className="grid grid-cols-2 gap-2">
          {paymentMethods.slice(0, 4).map((method) => (
            <div
              key={method.id}
              className={`p-2 rounded-lg border ${
                method.enabled 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-1">
                {method.id === 'card' && <CreditCard className="w-3 h-3" />}
                {(method.id === 'apple_pay' || method.id === 'google_pay') && <Smartphone className="w-3 h-3" />}
                {method.id === 'bank_transfer' && <Building2 className="w-3 h-3" />}
                <span className="text-xs font-medium truncate">{method.name}</span>
              </div>
              {method.fees && (
                <div className="text-xs text-gray-600 mt-1">
                  {method.fees.percentage}%
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default PaymentStatusTracker;