import React from 'react';
import { CreditCard, Smartphone, Building2, DollarSign } from 'lucide-react';
import { PaymentMethod, XEPayLink } from '@/types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface XEPayDashboardProps {
  className?: string;
}

const XEPayDashboard: React.FC<XEPayDashboardProps> = ({ className = '' }) => {
  // Mock data for demo
  const paymentStats = {
    totalProcessed: 45230,
    pendingAmount: 8750,
    successRate: 98.5,
    activeLinks: 12
  };

  const recentTransactions = [
    {
      id: 'xe_001',
      amount: 1250,
      method: 'xe_pay',
      status: 'completed',
      client: 'ABC Construction',
      date: new Date().toISOString()
    },
    {
      id: 'xe_002', 
      amount: 750,
      method: 'apple_pay',
      status: 'processing',
      client: 'Smith Plumbing',
      date: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const getMethodIcon = (method: string) => {
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
        return <DollarSign className="w-4 h-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Processed</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(paymentStats.totalProcessed)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {formatCurrency(paymentStats.pendingAmount)}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {paymentStats.successRate}%
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Links</p>
              <p className="text-2xl font-bold text-blue-600">
                {paymentStats.activeLinks}
              </p>
            </div>
            <Smartphone className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg">
                  {getMethodIcon(transaction.method)}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {transaction.client}
                  </div>
                  <div className="text-sm text-gray-600">
                    {transaction.id} • {new Date(transaction.date).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatCurrency(transaction.amount)}
                </div>
                <Badge className={
                  transaction.status === 'completed' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }>
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="primary" className="w-full">
            Generate Payment Link
          </Button>
          <Button variant="secondary" className="w-full">
            Process Manual Payment
          </Button>
          <Button variant="ghost" className="w-full">
            View Payment Methods
          </Button>
          <Button variant="ghost" className="w-full">
            Export Transactions
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default XEPayDashboard;