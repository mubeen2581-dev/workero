import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart as LucidePieChart, 
  Calculator,
  Target,
  Calendar,
  Download,
  Filter,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Percent
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { 
  getBusinessMetrics, 
  getRevenueTrend,
  formatCurrency,
  formatPercentage,
  formatNumber,
  calculateGrowthRate,
  calculateAverage
} from '@/mocks/analytics';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Badge from '../ui/Badge';

interface FinancialAnalyticsProps {
  className?: string;
}

const FinancialAnalytics: React.FC<FinancialAnalyticsProps> = ({
  className = '',
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('12');
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');
  const [viewType, setViewType] = useState<string>('overview');

  const businessMetrics = getBusinessMetrics();
  const revenueData = getRevenueTrend(parseInt(selectedPeriod));

  // Mock expense data
  const expenseData = [
    { date: '2024-01-01', revenue: 38500, expenses: 23100, profit: 15400, label: 'January' },
    { date: '2024-02-01', revenue: 41200, expenses: 24720, profit: 16480, label: 'February' },
    { date: '2024-03-01', revenue: 38900, expenses: 23340, profit: 15560, label: 'March' },
    { date: '2024-04-01', revenue: 45600, expenses: 27360, profit: 18240, label: 'April' },
    { date: '2024-05-01', revenue: 42300, expenses: 25380, profit: 16920, label: 'May' },
    { date: '2024-06-01', revenue: 47800, expenses: 28680, profit: 19120, label: 'June' },
    { date: '2024-07-01', revenue: 51200, expenses: 30720, profit: 20480, label: 'July' },
    { date: '2024-08-01', revenue: 48900, expenses: 29340, profit: 19560, label: 'August' },
    { date: '2024-09-01', revenue: 53400, expenses: 32040, profit: 21360, label: 'September' },
    { date: '2024-10-01', revenue: 56700, expenses: 34020, profit: 22680, label: 'October' },
    { date: '2024-11-01', revenue: 52300, expenses: 31380, profit: 20920, label: 'November' },
    { date: '2024-12-01', revenue: 48500, expenses: 29100, profit: 19400, label: 'December' },
  ];

  // Mock cost breakdown data
  const costBreakdownData = [
    { name: 'Labor', value: 187200, color: '#3B82F6', percentage: 60.0 },
    { name: 'Materials', value: 62400, color: '#10B981', percentage: 20.0 },
    { name: 'Equipment', value: 46800, color: '#F59E0B', percentage: 15.0 },
    { name: 'Overhead', value: 15600, color: '#EF4444', percentage: 5.0 },
  ];

  // Mock profit margin data
  const profitMarginData = [
    { name: 'Jan', margin: 40.0, revenue: 38500, profit: 15400 },
    { name: 'Feb', margin: 40.0, revenue: 41200, profit: 16480 },
    { name: 'Mar', margin: 40.0, revenue: 38900, profit: 15560 },
    { name: 'Apr', margin: 40.0, revenue: 45600, profit: 18240 },
    { name: 'May', margin: 40.0, revenue: 42300, profit: 16920 },
    { name: 'Jun', margin: 40.0, revenue: 47800, profit: 19120 },
    { name: 'Jul', margin: 40.0, revenue: 51200, profit: 20480 },
    { name: 'Aug', margin: 40.0, revenue: 48900, profit: 19560 },
    { name: 'Sep', margin: 40.0, revenue: 53400, profit: 21360 },
    { name: 'Oct', margin: 40.0, revenue: 56700, profit: 22680 },
    { name: 'Nov', margin: 40.0, revenue: 52300, profit: 20920 },
    { name: 'Dec', margin: 40.0, revenue: 48500, profit: 19400 },
  ];

  // Mock cash flow data
  const cashFlowData = [
    { name: 'Jan', inflow: 38500, outflow: 23100, net: 15400 },
    { name: 'Feb', inflow: 41200, outflow: 24720, net: 16480 },
    { name: 'Mar', inflow: 38900, outflow: 23340, net: 15560 },
    { name: 'Apr', inflow: 45600, outflow: 27360, net: 18240 },
    { name: 'May', inflow: 42300, outflow: 25380, net: 16920 },
    { name: 'Jun', inflow: 47800, outflow: 28680, net: 19120 },
    { name: 'Jul', inflow: 51200, outflow: 30720, net: 20480 },
    { name: 'Aug', inflow: 48900, outflow: 29340, net: 19560 },
    { name: 'Sep', inflow: 53400, outflow: 32040, net: 21360 },
    { name: 'Oct', inflow: 56700, outflow: 34020, net: 22680 },
    { name: 'Nov', inflow: 52300, outflow: 31380, net: 20920 },
    { name: 'Dec', inflow: 48500, outflow: 29100, net: 19400 },
  ];

  const getTrendIcon = (value: number) => {
    const IconComponent = value >= 0 ? TrendingUp : TrendingDown;
    return <IconComponent className="w-3 h-3" />;
  };

  const getTrendColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getMetricIcon = (metric: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      revenue: DollarSign,
      profit: TrendingUp,
      margin: Percent,
      growth: BarChart3,
    };
    return iconMap[metric] || DollarSign;
  };

  const getMetricColor = (metric: string) => {
    const colorMap: Record<string, string> = {
      revenue: 'text-green-600',
      profit: 'text-blue-600',
      margin: 'text-purple-600',
      growth: 'text-orange-600',
    };
    return colorMap[metric] || 'text-gray-600';
  };

  const getMetricBgColor = (metric: string) => {
    const bgColorMap: Record<string, string> = {
      revenue: 'bg-green-100',
      profit: 'bg-blue-100',
      margin: 'bg-purple-100',
      growth: 'bg-orange-100',
    };
    return bgColorMap[metric] || 'bg-gray-100';
  };

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.value, 0);
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const revenueGrowth = calculateGrowthRate(
    revenueData[revenueData.length - 1]?.value || 0,
    revenueData[revenueData.length - 2]?.value || 0
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
          <h2 className="text-2xl font-bold text-gray-900">Financial Analytics</h2>
          <p className="text-gray-600">Comprehensive financial analysis and insights</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            options={[
              { value: '3', label: 'Last 3 Months' },
              { value: '6', label: 'Last 6 Months' },
              { value: '12', label: 'Last 12 Months' },
              { value: '24', label: 'Last 2 Years' },
            ]}
          />
          <Button variant="secondary" icon={Download}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                {getTrendIcon(revenueGrowth)}
                <span className={`ml-1 ${getTrendColor(revenueGrowth)}`}>
                  {isFinite(revenueGrowth) ? Math.abs(revenueGrowth).toFixed(1) : '0.0'}% growth
                </span>
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
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalProfit)}</p>
              <p className="text-xs text-gray-500">{isFinite(profitMargin) ? profitMargin.toFixed(1) : '0.0'}% margin</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
              <p className="text-xs text-gray-500">Operating costs</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <Calculator className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profit Margin</p>
              <p className="text-2xl font-bold text-purple-600">{isFinite(profitMargin) ? profitMargin.toFixed(1) : '0.0'}%</p>
              <p className="text-xs text-gray-500">Industry avg: 15-20%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Percent className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Financial Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue vs Expenses */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue vs Expenses</h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" icon={Eye}>
                View Details
              </Button>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={expenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => formatCurrency(value)}
                  labelFormatter={(label) => label}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  fill="#10B981" 
                  fillOpacity={0.3}
                  stroke="#10B981"
                  name="Revenue"
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  fill="#EF4444" 
                  fillOpacity={0.3}
                  stroke="#EF4444"
                  name="Expenses"
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="Profit"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Cost Breakdown */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Cost Breakdown</h3>
            <Badge className="bg-blue-100 text-blue-800">
              {formatCurrency(costBreakdownData.reduce((sum, item) => sum + item.value, 0))} total
            </Badge>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Profit Margin and Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Profit Margin Trend */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Profit Margin Trend</h3>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">
                {isFinite(profitMargin) ? profitMargin.toFixed(1) : '0.0'}% avg
              </Badge>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profitMarginData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 50]} />
                <Tooltip 
                  formatter={(value: any) => `${isFinite(value) ? value.toFixed(1) : '0.0'}%`}
                  labelFormatter={(label) => label}
                />
                <Line 
                  type="monotone" 
                  dataKey="margin" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Cash Flow */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Cash Flow</h3>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">
                Positive
              </Badge>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => formatCurrency(value)}
                  labelFormatter={(label) => label}
                />
                <Legend />
                <Bar dataKey="inflow" fill="#10B981" name="Cash Inflow" />
                <Bar dataKey="outflow" fill="#EF4444" name="Cash Outflow" />
                <Bar dataKey="net" fill="#3B82F6" name="Net Cash Flow" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Financial Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-900">Strong Performance</h4>
            </div>
            <p className="text-sm text-green-700">
              Profit margin of {isFinite(profitMargin) ? profitMargin.toFixed(1) : '0.0'}% exceeds industry average, indicating healthy financial performance.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Growth Trend</h4>
            </div>
            <p className="text-sm text-blue-700">
              Revenue growth of {isFinite(revenueGrowth) ? Math.abs(revenueGrowth).toFixed(1) : '0.0'}% shows positive business momentum.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h4 className="font-medium text-yellow-900">Cost Management</h4>
            </div>
            <p className="text-sm text-yellow-700">
              Labor costs represent {costBreakdownData[0].percentage}% of total expenses. Consider optimization opportunities.
            </p>
          </div>
        </div>
      </Card>

      {/* Key Financial Ratios */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Financial Ratios</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Gross Profit Margin</p>
            <p className="text-2xl font-bold text-gray-900">{isFinite(profitMargin) ? profitMargin.toFixed(1) : '0.0'}%</p>
            <p className="text-xs text-gray-500">Revenue - COGS</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Operating Margin</p>
            <p className="text-2xl font-bold text-gray-900">{isFinite(profitMargin) ? (profitMargin * 0.8).toFixed(1) : '0.0'}%</p>
            <p className="text-xs text-gray-500">After operating expenses</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Revenue Growth</p>
            <p className="text-2xl font-bold text-gray-900">{isFinite(revenueGrowth) ? Math.abs(revenueGrowth).toFixed(1) : '0.0'}%</p>
            <p className="text-xs text-gray-500">Year-over-year</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Expense Ratio</p>
            <p className="text-2xl font-bold text-gray-900">{totalRevenue > 0 ? ((totalExpenses / totalRevenue) * 100).toFixed(1) : '0.0'}%</p>
            <p className="text-xs text-gray-500">Expenses / Revenue</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default FinancialAnalytics;
