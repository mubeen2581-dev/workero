import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Banknote, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Payment, Invoice } from '@/types';
import { mockPayments, mockInvoices } from '@/mocks/invoices';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { Table } from '../ui/Table';
import { formatDistanceToNow } from 'date-fns';

interface PaymentTrackerProps {
  payments?: Payment[];
  invoices?: Invoice[];
  onPaymentClick?: (payment: Payment) => void;
  onAddPayment?: () => void;
  onEditPayment?: (payment: Payment) => void;
  onDeletePayment?: (payment: Payment) => void;
  className?: string;
}

const PaymentTracker: React.FC<PaymentTrackerProps> = ({
  payments = mockPayments,
  invoices = mockInvoices,
  onPaymentClick,
  onAddPayment,
  onEditPayment,
  onDeletePayment,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('paymentDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredPayments = useMemo(() => {
    let filtered = payments.filter(payment => {
      const invoice = invoices.find(inv => inv.id === payment.invoiceId);
      const matchesSearch = 
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (invoice && invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      
      const matchesDate = (() => {
        if (dateFilter === 'all') return true;
        const now = new Date();
        const paymentDate = new Date(payment.paymentDate);
        
        switch (dateFilter) {
          case 'today':
            return paymentDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return paymentDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return paymentDate >= monthAgo;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesMethod && matchesStatus && matchesDate;
    });

    // Sort payments
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'paymentDate':
          aValue = new Date(a.paymentDate).getTime();
          bValue = new Date(b.paymentDate).getTime();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'method':
          aValue = a.paymentMethod;
          bValue = b.paymentMethod;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = new Date(a.paymentDate).getTime();
          bValue = new Date(b.paymentDate).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [payments, invoices, searchTerm, methodFilter, statusFilter, dateFilter, sortBy, sortOrder]);

  const paymentStats = useMemo(() => {
    const totalPayments = payments.length;
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const completedPayments = payments.filter(p => p.status === 'completed').length;
    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    const failedPayments = payments.filter(p => p.status === 'failed').length;

    const methodBreakdown = payments.reduce((acc, payment) => {
      acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + payment.amount;
      return acc;
    }, {} as Record<string, number>);

    const recentPayments = payments
      .filter(p => p.status === 'completed')
      .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
      .slice(0, 5);

    return {
      totalPayments,
      totalAmount,
      completedPayments,
      pendingPayments,
      failedPayments,
      methodBreakdown,
      recentPayments,
    };
  }, [payments]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const getPaymentMethodIcon = (method: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      credit_card: CreditCard,
      bank_transfer: Banknote,
      check: FileText,
      cash: Banknote,
    };
    return iconMap[method] || CreditCard;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      completed: CheckCircle,
      pending: Clock,
      failed: AlertTriangle,
    };
    return iconMap[status] || Clock;
  };

  const columns = [
    {
      key: 'payment',
      header: 'Payment',
      render: (payment: Payment) => {
        const invoice = invoices.find(inv => inv.id === payment.invoiceId);
        return (
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <DollarSign className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{payment.id}</p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(payment.paymentDate), { addSuffix: true })}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'invoice',
      header: 'Invoice',
      render: (payment: Payment) => {
        const invoice = invoices.find(inv => inv.id === payment.invoiceId);
        return (
          <div>
            <p className="text-sm font-medium text-gray-900">{payment.invoiceId}</p>
            {invoice && (
              <p className="text-xs text-gray-500">{invoice.client.name}</p>
            )}
          </div>
        );
      },
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (payment: Payment) => (
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
          <p className="text-xs text-gray-500">{payment.reference}</p>
        </div>
      ),
    },
    {
      key: 'method',
      header: 'Method',
      render: (payment: Payment) => {
        const MethodIcon = getPaymentMethodIcon(payment.paymentMethod);
        return (
          <div className="flex items-center space-x-2">
            <MethodIcon className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-900">
              {payment.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (payment: Payment) => {
        const StatusIcon = getStatusIcon(payment.status);
        return (
          <Badge className={getStatusColor(payment.status)}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (payment: Payment) => (
        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            icon={Eye}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPaymentClick?.(payment);
            }}
            title="View Payment"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEditPayment?.(payment);
            }}
            title="Edit Payment"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDeletePayment?.(payment);
            }}
            className="text-red-600 hover:text-red-700"
            title="Delete Payment"
          />
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Payment Tracking</h2>
          <p className="text-sm sm:text-base text-gray-600">Monitor and manage payment transactions</p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button variant="secondary" icon={Download} className="hidden sm:flex">
            Export
          </Button>
          <Button variant="secondary" icon={Download} className="sm:hidden p-2" />
          <Button 
            variant="primary" 
            icon={Plus} 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddPayment?.();
            }} 
            className="flex-1 sm:flex-none"
          >
            <span className="hidden sm:inline">Record Payment</span>
            <span className="sm:hidden">Record</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-8">
        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{paymentStats.totalPayments}</p>
            </div>
            <div className="p-2 sm:p-3 bg-primary-100 rounded-xl">
              <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{formatCurrency(paymentStats.totalAmount)}</p>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
              <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Completed</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{paymentStats.completedPayments}</p>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Pending</p>
              <p className="text-lg sm:text-2xl font-bold text-yellow-600">{paymentStats.pendingPayments}</p>
            </div>
            <div className="p-2 sm:p-3 bg-yellow-100 rounded-xl">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Payment Methods Breakdown */}
        <Card className="p-3 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          
          <div className="space-y-3">
            {Object.entries(paymentStats.methodBreakdown).map(([method, amount]) => {
              const percentage = (amount / paymentStats.totalAmount) * 100;
              const MethodIcon = getPaymentMethodIcon(method);
              
              return (
                <div key={method} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MethodIcon className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(amount)}</p>
                    <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Payments */}
        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
            <Button variant="ghost" size="sm" icon={Eye}>
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {paymentStats.recentPayments.map((payment) => {
              const MethodIcon = getPaymentMethodIcon(payment.paymentMethod);
              
              return (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <MethodIcon className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{payment.invoiceId}</p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(payment.paymentDate), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                    <p className="text-xs text-gray-500">{payment.paymentMethod.replace('_', ' ')}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Payment Status */}
        <Card className="p-3 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Completed</span>
              </div>
              <Badge className="bg-green-100 text-green-800">
                {paymentStats.completedPayments}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-900">Pending</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">
                {paymentStats.pendingPayments}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-gray-900">Failed</span>
              </div>
              <Badge className="bg-red-100 text-red-800">
                {paymentStats.failedPayments}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <Input
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <Select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Methods' },
                { value: 'credit_card', label: 'Credit Card' },
                { value: 'bank_transfer', label: 'Bank Transfer' },
                { value: 'check', label: 'Check' },
                { value: 'cash', label: 'Cash' },
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'completed', label: 'Completed' },
                { value: 'pending', label: 'Pending' },
                { value: 'failed', label: 'Failed' },
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Time' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredPayments.length} of {payments.length} payments
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" icon={Filter}>
            More Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table className="w-full">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment, rowIndex) => (
              <tr 
                key={payment.id} 
                className="hover:bg-gray-50"
                onClick={(e) => {
                  // Only trigger payment click if clicking on the row (not on action buttons)
                  if ((e.target as HTMLElement).closest('button') === null) {
                    onPaymentClick?.(payment);
                  }
                }}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 text-sm text-gray-900">
                    {column.render(payment)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Empty State */}
      {filteredPayments.length === 0 && (
        <Card className="p-12 text-center">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || methodFilter !== 'all' || statusFilter !== 'all' || dateFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by recording your first payment.'
            }
          </p>
          <Button 
            variant="primary" 
            icon={Plus} 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddPayment?.();
            }}
          >
            Record Payment
          </Button>
        </Card>
      )}
    </motion.div>
  );
};

export default PaymentTracker;
