import React from 'react';
import { CheckCircle, Clock, AlertTriangle, DollarSign, Calendar } from 'lucide-react';
import { Payment, Invoice } from '@/types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface PaymentHistoryProps {
  invoice: Invoice;
  payments: Payment[];
  className?: string;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  invoice,
  payments,
  className = '',
}) => {
  const invoicePayments = payments.filter(p => p.invoiceId === invoice.id);
  const totalPaid = invoicePayments.reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0);
  const outstanding = invoice.total - totalPaid;
  const isFullyPaid = outstanding <= 0.01; // Account for rounding

  const formatCurrency = (amount: number, currency: string = invoice.currency || 'GBP') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: Payment['status']) => {
    const statusMap = {
      completed: { label: 'Completed', className: 'bg-green-100 text-green-800' },
      processing: { label: 'Processing', className: 'bg-yellow-100 text-yellow-800' },
      pending: { label: 'Pending', className: 'bg-blue-100 text-blue-800' },
      failed: { label: 'Failed', className: 'bg-red-100 text-red-800' },
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  const getPaymentMethodLabel = (method: string) => {
    const methodMap: Record<string, string> = {
      xe_pay: 'XE Pay',
      apple_pay: 'Apple Pay',
      google_pay: 'Google Pay',
      credit_card: 'Credit Card',
      bank_transfer: 'Bank Transfer',
      cash: 'Cash',
      check: 'Check',
    };
    return methodMap[method] || method;
  };

  return (
    <Card className={className}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
          <Badge className={isFullyPaid ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
            {isFullyPaid ? 'Fully Paid' : 'Partially Paid'}
          </Badge>
        </div>

        {/* Payment Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs text-gray-600 mb-1">Invoice Total</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(invoice.total, invoice.currency || 'GBP')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Total Paid</p>
            <p className="text-lg font-bold text-green-600">{formatCurrency(totalPaid, invoice.currency || 'GBP')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Outstanding</p>
            <p className={`text-lg font-bold ${outstanding > 0 ? 'text-orange-600' : 'text-green-600'}`}>
              {formatCurrency(Math.max(0, outstanding), invoice.currency || 'GBP')}
            </p>
          </div>
        </div>

        {/* Payment Progress Bar */}
        {invoice.total > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Payment Progress</span>
              <span>{Math.round((totalPaid / invoice.total) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((totalPaid / invoice.total) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Payment List */}
        {invoicePayments.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600">No payments recorded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invoicePayments
              .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
              .map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      {getStatusIcon(payment.status)}
                    </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatCurrency(payment.amount, invoice.currency || 'GBP')}
                          </p>
                        {getStatusBadge(payment.status)}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(payment.paymentDate)}
                        </span>
                        <span>{getPaymentMethodLabel(payment.paymentMethod)}</span>
                        {payment.reference && (
                          <span className="text-gray-500">Ref: {payment.reference}</span>
                        )}
                      </div>
                      {payment.notes && (
                        <p className="text-xs text-gray-500 mt-1">{payment.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default PaymentHistory;

