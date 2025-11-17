import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  PieChart, 
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Eye,
  FileText,
  CreditCard,
  Banknote,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Invoice, Payment } from '@/types';
import { mockInvoices, mockPayments, getInvoiceStats, getAgingReport, getPaymentStats } from '@/mocks/invoices';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Badge from '../ui/Badge';

interface FinancialReportsProps {
  invoices?: Invoice[];
  payments?: Payment[];
  className?: string;
}

const FinancialReports: React.FC<FinancialReportsProps> = ({
  invoices = mockInvoices,
  payments = mockPayments,
  className = '',
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30');
  const [selectedReport, setSelectedReport] = useState<string>('overview');

  const stats = getInvoiceStats();
  const agingReport = getAgingReport();
  const paymentStats = getPaymentStats();

  // Generate sample data for charts
  const revenueData = useMemo(() => {
    const data = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayRevenue = Math.random() * 5000 + 2000;
      const dayExpenses = Math.random() * 3000 + 1000;
      
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.round(dayRevenue),
        expenses: Math.round(dayExpenses),
        profit: Math.round(dayRevenue - dayExpenses),
      });
    }
    
    return data;
  }, []);

  const paymentMethodData = useMemo(() => {
    const methods = ['Credit Card', 'Bank Transfer', 'Check', 'Cash'];
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
    
    return methods.map((method, index) => ({
      name: method,
      value: Math.random() * 10000 + 5000,
      color: colors[index],
    }));
  }, []);

  const agingData = useMemo(() => {
    return [
      { name: 'Current', value: agingReport.current, color: '#10B981' },
      { name: '1-30 Days', value: agingReport.days30, color: '#3B82F6' },
      { name: '31-60 Days', value: agingReport.days60, color: '#F59E0B' },
      { name: '61-90 Days', value: agingReport.days90, color: '#F97316' },
      { name: '90+ Days', value: agingReport.over90, color: '#EF4444' },
    ];
  }, [agingReport]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalRevenue = () => {
    return revenueData.reduce((sum, day) => sum + day.revenue, 0);
  };

  const getTotalExpenses = () => {
    return revenueData.reduce((sum, day) => sum + day.expenses, 0);
  };

  const getTotalProfit = () => {
    return getTotalRevenue() - getTotalExpenses();
  };

  const getProfitMargin = () => {
    return (getTotalProfit() / getTotalRevenue()) * 100;
  };

  const getAverageDailyRevenue = () => {
    return getTotalRevenue() / revenueData.length;
  };

  const getGrowthRate = () => {
    const firstWeek = revenueData.slice(0, 7).reduce((sum, day) => sum + day.revenue, 0);
    const lastWeek = revenueData.slice(-7).reduce((sum, day) => sum + day.revenue, 0);
    return ((lastWeek - firstWeek) / firstWeek) * 100;
  };

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(getTotalRevenue())}</p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{getGrowthRate().toFixed(1)}% from last period
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(getTotalExpenses())}</p>
              <p className="text-xs text-gray-500">Operating costs</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(getTotalProfit())}</p>
              <p className="text-xs text-gray-500">{getProfitMargin().toFixed(1)}% margin</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Daily Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(getAverageDailyRevenue())}</p>
              <p className="text-xs text-gray-500">Last 30 days</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-xl">
              <Calendar className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" icon={Download}>
              Export
            </Button>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => formatCurrency(value)}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
                name="Revenue"
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stroke="#EF4444" 
                fill="#EF4444" 
                fillOpacity={0.3}
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Payment Methods & Aging */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aging Analysis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderDetailedReport = () => (
    <div className="space-y-6">
      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Paid</span>
              </div>
              <Badge className="bg-green-100 text-green-800">{stats.paidInvoices}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Sent</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800">{stats.sentInvoices}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-gray-900">Overdue</span>
              </div>
              <Badge className="bg-red-100 text-red-800">{stats.overdueInvoices}</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Payments</span>
              <span className="text-sm font-medium">{paymentStats.totalPayments}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Amount</span>
              <span className="text-sm font-medium">{formatCurrency(paymentStats.totalPaidAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Payment</span>
              <span className="text-sm font-medium">
                {formatCurrency(paymentStats.totalPaidAmount / paymentStats.totalPayments)}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Outstanding</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Outstanding Amount</span>
              <span className="text-sm font-medium text-yellow-600">{formatCurrency(stats.outstandingAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Overdue Amount</span>
              <span className="text-sm font-medium text-red-600">{formatCurrency(stats.overdueAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Collection Rate</span>
              <span className="text-sm font-medium text-green-600">
                {((stats.totalRevenue / (stats.totalRevenue + stats.outstandingAmount)) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => formatCurrency(value)}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenue" />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => formatCurrency(value)}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Legend />
                <Bar dataKey="profit" fill="#3B82F6" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Financial Reports</h2>
          <p className="text-sm sm:text-base text-gray-600">Comprehensive financial analysis and insights</p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            options={[
              { value: '7', label: 'Last 7 Days' },
              { value: '30', label: 'Last 30 Days' },
              { value: '90', label: 'Last 90 Days' },
              { value: '365', label: 'Last Year' },
            ]}
          />
          <Button variant="secondary" size="sm" className="sm:px-4 sm:py-2 sm:text-sm" icon={Download}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Report Type Selector */}
      <Card className="p-6 mb-6">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            variant={selectedReport === 'overview' ? 'primary' : 'secondary'}
            size="sm"
            className="sm:px-4 sm:py-2 sm:text-sm"
            onClick={() => setSelectedReport('overview')}
            icon={BarChart3}
          >
            Overview
          </Button>
          <Button
            variant={selectedReport === 'detailed' ? 'primary' : 'secondary'}
            size="sm"
            className="sm:px-4 sm:py-2 sm:text-sm"
            onClick={() => setSelectedReport('detailed')}
            icon={FileText}
          >
            Detailed Analysis
          </Button>
          <Button
            variant={selectedReport === 'aging' ? 'primary' : 'secondary'}
            size="sm"
            className="sm:px-4 sm:py-2 sm:text-sm"
            onClick={() => setSelectedReport('aging')}
            icon={Clock}
          >
            Aging Report
          </Button>
        </div>
      </Card>

      {/* Report Content */}
      {selectedReport === 'overview' && renderOverviewReport()}
      {selectedReport === 'detailed' && renderDetailedReport()}
      {selectedReport === 'aging' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aging Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {agingData.map((item, index) => (
              <div key={index} className="text-center p-4 rounded-lg" style={{ backgroundColor: `${item.color}20` }}>
                <p className="text-sm font-medium text-gray-600">{item.name}</p>
                <p className="text-2xl font-bold" style={{ color: item.color }}>
                  {formatCurrency(item.value)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default FinancialReports;
