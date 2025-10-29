import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Clock, 
  Star,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Award,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  Filter
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
  ResponsiveContainer 
} from 'recharts';
import { 
  getBusinessMetrics, 
  getPerformanceMetrics, 
  getCustomerAnalytics, 
  getOperationalMetrics,
  getRevenueTrend,
  getSatisfactionTrend,
  getUtilizationTrend,
  getTopPerformers,
  getTopCustomers,
  mockJobStatusData,
  mockServiceCategoryData,
  formatCurrency,
  formatPercentage,
  formatNumber
} from '@/mocks/analytics';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Badge from '../ui/Badge';

interface AnalyticsDashboardProps {
  className?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  className = '',
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('12');
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');

  const businessMetrics = getBusinessMetrics();
  const performanceMetrics = getPerformanceMetrics();
  const customerAnalytics = getCustomerAnalytics();
  const operationalMetrics = getOperationalMetrics();
  const revenueData = getRevenueTrend(parseInt(selectedPeriod));
  const satisfactionData = getSatisfactionTrend(parseInt(selectedPeriod));
  const utilizationData = getUtilizationTrend(parseInt(selectedPeriod));
  const topPerformers = getTopPerformers(5);
  const topCustomers = getTopCustomers(5);

  const getMetricIcon = (metric: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      revenue: DollarSign,
      customers: Users,
      satisfaction: Star,
      efficiency: Target,
      utilization: Activity,
      growth: TrendingUp,
    };
    return iconMap[metric] || BarChart3;
  };

  const getMetricColor = (metric: string) => {
    const colorMap: Record<string, string> = {
      revenue: 'text-green-600',
      customers: 'text-blue-600',
      satisfaction: 'text-yellow-600',
      efficiency: 'text-purple-600',
      utilization: 'text-orange-600',
      growth: 'text-indigo-600',
    };
    return colorMap[metric] || 'text-gray-600';
  };

  const getMetricBgColor = (metric: string) => {
    const bgColorMap: Record<string, string> = {
      revenue: 'bg-green-100',
      customers: 'bg-blue-100',
      satisfaction: 'bg-yellow-100',
      efficiency: 'bg-purple-100',
      utilization: 'bg-orange-100',
      growth: 'bg-indigo-100',
    };
    return bgColorMap[metric] || 'bg-gray-100';
  };

  const getTrendIcon = (value: number) => {
    return value >= 0 ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-sm sm:text-base text-gray-600">Comprehensive business intelligence and performance insights</p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Select
            value={selectedPeriod}
            onChange={(value) => setSelectedPeriod(value)}
            options={[
              { value: '3', label: 'Last 3 Months' },
              { value: '6', label: 'Last 6 Months' },
              { value: '12', label: 'Last 12 Months' },
              { value: '24', label: 'Last 2 Years' },
            ]}
            className="w-full sm:w-auto"
          />
          <Button variant="secondary" icon={Download} className="flex-1 sm:flex-none">
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-8">
        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{formatCurrency(businessMetrics.totalRevenue)}</p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                <span className="hidden sm:inline">+{businessMetrics.revenueGrowth}% from last period</span>
                <span className="sm:hidden">+{businessMetrics.revenueGrowth}%</span>
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
              <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-600">{formatCurrency(businessMetrics.netProfit)}</p>
              <p className="text-xs text-gray-500 hidden sm:block">{businessMetrics.profitMargin}% margin</p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
              <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Customers</p>
              <p className="text-lg sm:text-2xl font-bold text-purple-600">{formatNumber(businessMetrics.customerCount)}</p>
              <p className="text-xs text-gray-500 hidden sm:block">{businessMetrics.retentionRate}% retention</p>
            </div>
            <div className="p-2 sm:p-3 bg-purple-100 rounded-xl">
              <Users className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-lg sm:text-2xl font-bold text-orange-600">{formatCurrency(businessMetrics.averageOrderValue)}</p>
              <p className="text-xs text-gray-500 hidden sm:block">LTV: {formatCurrency(businessMetrics.customerLifetimeValue)}</p>
            </div>
            <div className="p-2 sm:p-3 bg-orange-100 rounded-xl">
              <Target className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-8">
        {/* Revenue Trend */}
        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" icon={Eye}>
                View Details
              </Button>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => formatCurrency(value)}
                  labelFormatter={(label) => label}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Customer Satisfaction */}
        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Customer Satisfaction</h3>
            <Badge className="bg-green-100 text-green-800">
              {satisfactionData[satisfactionData.length - 1]?.value.toFixed(1)}/5.0
            </Badge>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={satisfactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis domain={[0, 5]} />
                <Tooltip 
                  formatter={(value: any) => `${value.toFixed(1)}/5.0`}
                  labelFormatter={(label) => label}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Job Status Distribution */}
        <Card className="p-3 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={mockJobStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockJobStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `${value} jobs`} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Service Categories */}
        <Card className="p-3 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockServiceCategoryData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Utilization Trend */}
        <Card className="p-3 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Utilization</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value: any) => `${value.toFixed(1)}%`}
                  labelFormatter={(label) => label}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top Performers and Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Performers */}
        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
            <Button variant="ghost" size="sm" icon={Award}>
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <motion.div
                key={performer.technicianId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{performer.technicianName}</p>
                    <p className="text-xs text-gray-500">{performer.jobsCompleted} jobs completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatPercentage(performer.efficiency)}</p>
                  <p className="text-xs text-gray-500">efficiency</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Top Customers */}
        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
            <Button variant="ghost" size="sm" icon={Users}>
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <motion.div
                key={customer.clientId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{customer.clientName}</p>
                    <p className="text-xs text-gray-500">{customer.jobCount} jobs</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(customer.totalSpent)}</p>
                  <p className="text-xs text-gray-500">total spent</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Operational Metrics */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Operational Metrics</h3>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" icon={Filter}>
              Filter
            </Button>
            <Button variant="ghost" size="sm" icon={Download}>
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Job Completion Rate</p>
            <p className="text-2xl font-bold text-blue-600">{formatPercentage(operationalMetrics.completedJobs / operationalMetrics.totalJobs * 100)}</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">On-Time Rate</p>
            <p className="text-2xl font-bold text-green-600">{formatPercentage(operationalMetrics.onTimeJobs / operationalMetrics.totalJobs * 100)}</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="p-3 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Utilization Rate</p>
            <p className="text-2xl font-bold text-purple-600">{formatPercentage(operationalMetrics.utilizationRate)}</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="p-3 bg-orange-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Efficiency</p>
            <p className="text-2xl font-bold text-orange-600">{formatPercentage(operationalMetrics.equipmentEfficiency)}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AnalyticsDashboard;
