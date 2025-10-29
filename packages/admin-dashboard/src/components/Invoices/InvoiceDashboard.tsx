import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Clock,
  CheckCircle,
  FileText,
  Eye,
  Plus,
  Filter,
  Download,
  Calendar,
  CreditCard,
  Banknote
} from 'lucide-react';
import { Invoice, Payment } from '@/types';
import { 
  mockInvoices, 
  mockPayments, 
  getInvoiceStats, 
  getAgingReport,
  getPaymentStats,
  getOverdueInvoices,
  getUpcomingInvoices
} from '@/mocks/invoices';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatDistanceToNow } from 'date-fns';

interface InvoiceDashboardProps {
  invoices?: Invoice[];
  payments?: Payment[];
  onInvoiceClick?: (invoice: Invoice) => void;
  onAddInvoice?: () => void;
  className?: string;
}

const InvoiceDashboard: React.FC<InvoiceDashboardProps> = ({
  invoices = mockInvoices,
  payments = mockPayments,
  onInvoiceClick,
  onAddInvoice,
  className = '',
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30');

  const stats = getInvoiceStats();
  const agingReport = getAgingReport();
  const paymentStats = getPaymentStats();
  const overdueInvoices = getOverdueInvoices();
  const upcomingInvoices = getUpcomingInvoices();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      draft: FileText,
      sent: Clock,
      paid: CheckCircle,
      overdue: AlertTriangle,
    };
    return iconMap[status] || FileText;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.outstandingAmount)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.overdueAmount)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-xl">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overdue Invoices */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Overdue Invoices</h3>
            <Badge className="bg-red-100 text-red-800">
              {overdueInvoices.length} invoices
            </Badge>
          </div>
          
          <div className="space-y-3">
            {overdueInvoices.slice(0, 5).map((invoice) => {
              const StatusIcon = getStatusIcon(invoice.status);
              const daysPastDue = Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                  onClick={() => onInvoiceClick?.(invoice)}
                >
                  <div className="flex items-center space-x-3">
                    <StatusIcon className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{invoice.id}</p>
                      <p className="text-xs text-gray-500">{invoice.client.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(invoice.total)}</p>
                    <p className="text-xs text-red-600">{daysPastDue} days overdue</p>
                  </div>
                </motion.div>
              );
            })}
            
            {overdueInvoices.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-500">No overdue invoices</p>
              </div>
            )}
          </div>
        </Card>

        {/* Upcoming Due Dates */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Due Dates</h3>
            <Badge className="bg-blue-100 text-blue-800">
              {upcomingInvoices.length} invoices
            </Badge>
          </div>
          
          <div className="space-y-3">
            {upcomingInvoices.slice(0, 5).map((invoice) => {
              const StatusIcon = getStatusIcon(invoice.status);
              const daysUntilDue = Math.ceil((new Date(invoice.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => onInvoiceClick?.(invoice)}
                >
                  <div className="flex items-center space-x-3">
                    <StatusIcon className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{invoice.id}</p>
                      <p className="text-xs text-gray-500">{invoice.client.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(invoice.total)}</p>
                    <p className="text-xs text-blue-600">Due in {daysUntilDue} days</p>
                  </div>
                </motion.div>
              );
            })}
            
            {upcomingInvoices.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming due dates</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Payments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
            <Button variant="ghost" size="sm" icon={Eye}>
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {payments.slice(0, 5).map((payment) => {
              const PaymentIcon = getPaymentMethodIcon(payment.paymentMethod);
              
              return (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <PaymentIcon className="w-5 h-5 text-green-600" />
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
      </div>

      {/* Aging Report */}
      <Card className="p-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Aging Report</h3>
          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm" icon={Download}>
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Current</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(agingReport.current)}</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600">1-30 Days</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(agingReport.days30)}</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600">31-60 Days</p>
            <p className="text-2xl font-bold text-yellow-600">{formatCurrency(agingReport.days60)}</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600">61-90 Days</p>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(agingReport.days90)}</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600">90+ Days</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(agingReport.over90)}</p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-600">Manage your invoices efficiently</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm" icon={Filter}>
              Filter
            </Button>
            <Button variant="secondary" size="sm" icon={Download}>
              Export
            </Button>
            <Button variant="primary" size="sm" icon={Plus} onClick={onAddInvoice}>
              Create Invoice
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default InvoiceDashboard;
