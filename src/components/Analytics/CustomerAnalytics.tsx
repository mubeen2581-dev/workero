import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  Clock,
  Target,
  Award,
  Calendar,
  Download,
  Filter,
  Search,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  CheckCircle,
  AlertTriangle,
  UserPlus,
  UserMinus
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  getCustomerAnalytics, 
  getTopCustomers,
  formatCurrency,
  formatPercentage,
  formatNumber,
  calculateAverage
} from '@/mocks/analytics';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { Table } from '../ui/Table';

interface CustomerAnalyticsProps {
  className?: string;
}

const CustomerAnalytics: React.FC<CustomerAnalyticsProps> = ({
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('totalSpent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedMetric, setSelectedMetric] = useState<string>('satisfaction');
  const [timeRange, setTimeRange] = useState<string>('12');

  const customerAnalytics = getCustomerAnalytics();
  const topCustomers = getTopCustomers(10);

  const filteredCustomers = useMemo(() => {
    let filtered = customerAnalytics.filter(customer => 
      customer.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'totalSpent':
          aValue = a.totalSpent;
          bValue = b.totalSpent;
          break;
        case 'satisfaction':
          aValue = a.satisfactionScore;
          bValue = b.satisfactionScore;
          break;
        case 'retention':
          aValue = a.retentionScore;
          bValue = b.retentionScore;
          break;
        case 'lifetimeValue':
          aValue = a.lifetimeValue;
          bValue = b.lifetimeValue;
          break;
        case 'jobCount':
          aValue = a.jobCount;
          bValue = b.jobCount;
          break;
        default:
          aValue = a.totalSpent;
          bValue = b.totalSpent;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [customerAnalytics, searchTerm, sortBy, sortOrder]);

  const getCustomerSegment = (lifetimeValue: number) => {
    if (lifetimeValue >= 50000) return { segment: 'VIP', color: 'bg-purple-100 text-purple-800' };
    if (lifetimeValue >= 25000) return { segment: 'Premium', color: 'bg-blue-100 text-blue-800' };
    if (lifetimeValue >= 10000) return { segment: 'Standard', color: 'bg-green-100 text-green-800' };
    return { segment: 'Basic', color: 'bg-gray-100 text-gray-800' };
  };

  const getSatisfactionLevel = (score: number) => {
    if (score >= 4.8) return { level: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 4.5) return { level: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (score >= 4.0) return { level: 'Average', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Poor', color: 'bg-red-100 text-red-800' };
  };

  const getRetentionLevel = (score: number) => {
    if (score >= 9.0) return { level: 'High', color: 'bg-green-100 text-green-800' };
    if (score >= 7.0) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Low', color: 'bg-red-100 text-red-800' };
  };

  const getTrendIcon = (value: number, threshold: number) => {
    return value >= threshold ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (value: number, threshold: number) => {
    return value >= threshold ? 'text-green-600' : 'text-red-600';
  };

  // Mock customer satisfaction trend data
  const satisfactionTrendData = [
    { name: 'Jan', satisfaction: 4.2, retention: 85, newCustomers: 45, churn: 8 },
    { name: 'Feb', satisfaction: 4.3, retention: 87, newCustomers: 52, churn: 7 },
    { name: 'Mar', satisfaction: 4.4, retention: 89, newCustomers: 48, churn: 6 },
    { name: 'Apr', satisfaction: 4.5, retention: 91, newCustomers: 55, churn: 5 },
    { name: 'May', satisfaction: 4.6, retention: 93, newCustomers: 61, churn: 4 },
    { name: 'Jun', satisfaction: 4.7, retention: 94, newCustomers: 58, churn: 3 },
    { name: 'Jul', satisfaction: 4.6, retention: 92, newCustomers: 49, churn: 4 },
    { name: 'Aug', satisfaction: 4.8, retention: 95, newCustomers: 67, churn: 2 },
    { name: 'Sep', satisfaction: 4.7, retention: 93, newCustomers: 54, churn: 3 },
    { name: 'Oct', satisfaction: 4.8, retention: 96, newCustomers: 72, churn: 1 },
    { name: 'Nov', satisfaction: 4.9, retention: 97, newCustomers: 68, churn: 1 },
    { name: 'Dec', satisfaction: 4.8, retention: 95, newCustomers: 63, churn: 2 },
  ];

  // Mock customer segment data
  const customerSegmentData = [
    { name: 'VIP', value: 45, color: '#8B5CF6', percentage: 15.0 },
    { name: 'Premium', value: 120, color: '#3B82F6', percentage: 40.0 },
    { name: 'Standard', value: 90, color: '#10B981', percentage: 30.0 },
    { name: 'Basic', value: 45, color: '#6B7280', percentage: 15.0 },
  ];

  // Mock customer lifetime value data
  const lifetimeValueData = [
    { name: '0-6 months', value: 1250, count: 180 },
    { name: '6-12 months', value: 3200, count: 95 },
    { name: '1-2 years', value: 8500, count: 60 },
    { name: '2-3 years', value: 15600, count: 35 },
    { name: '3+ years', value: 28400, count: 20 },
  ];

  const columns = [
    {
      key: 'customer',
      header: 'Customer',
      render: (customer: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{customer.clientName}</p>
            <p className="text-xs text-gray-500">{customer.jobCount} jobs</p>
          </div>
        </div>
      ),
    },
    {
      key: 'segment',
      header: 'Segment',
      render: (customer: any) => {
        const segment = getCustomerSegment(customer.lifetimeValue);
        return (
          <Badge className={segment.color}>
            {segment.segment}
          </Badge>
        );
      },
    },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      render: (customer: any) => (
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{formatCurrency(customer.totalSpent)}</p>
          <p className="text-xs text-gray-500">LTV: {formatCurrency(customer.lifetimeValue)}</p>
        </div>
      ),
    },
    {
      key: 'satisfaction',
      header: 'Satisfaction',
      render: (customer: any) => {
        const satisfaction = getSatisfactionLevel(customer.satisfactionScore);
        return (
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-900">{customer.satisfactionScore.toFixed(1)}</span>
            <Badge className={satisfaction.color}>
              {satisfaction.level}
            </Badge>
          </div>
        );
      },
    },
    {
      key: 'retention',
      header: 'Retention',
      render: (customer: any) => {
        const retention = getRetentionLevel(customer.retentionScore);
        return (
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">{customer.retentionScore.toFixed(1)}</p>
            <Badge className={retention.color}>
              {retention.level}
            </Badge>
          </div>
        );
      },
    },
    {
      key: 'lastJob',
      header: 'Last Job',
      render: (customer: any) => (
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {new Date(customer.lastJobDate).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500">
            {Math.floor((new Date().getTime() - new Date(customer.lastJobDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
          </p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (customer: any) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" icon={Eye}>
            View
          </Button>
        </div>
      ),
    },
  ];

  const averageSatisfaction = calculateAverage(customerAnalytics.map(c => c.satisfactionScore));
  const averageRetention = calculateAverage(customerAnalytics.map(c => c.retentionScore));
  const totalRevenue = customerAnalytics.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageLifetimeValue = calculateAverage(customerAnalytics.map(c => c.lifetimeValue));

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
          <h2 className="text-2xl font-bold text-gray-900">Customer Analytics</h2>
          <p className="text-gray-600">Customer satisfaction, retention, and lifetime value insights</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="secondary" icon={Download}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Customer Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-blue-600">{formatNumber(customerAnalytics.length)}</p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <UserPlus className="w-3 h-3 mr-1 text-green-600" />
                +12% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Satisfaction</p>
              <p className="text-2xl font-bold text-yellow-600">{averageSatisfaction.toFixed(1)}</p>
              <p className="text-xs text-gray-500">out of 5.0</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Retention</p>
              <p className="text-2xl font-bold text-green-600">{averageRetention.toFixed(1)}</p>
              <p className="text-xs text-gray-500">retention score</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Lifetime Value</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(averageLifetimeValue)}</p>
              <p className="text-xs text-gray-500">per customer</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Customer Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Customer Satisfaction Trend */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Customer Satisfaction Trend</h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" icon={Eye}>
                View Details
              </Button>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={satisfactionTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip 
                  formatter={(value: any) => `${value.toFixed(1)}/5.0`}
                  labelFormatter={(label) => label}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                  name="Satisfaction"
                />
                <Line 
                  type="monotone" 
                  dataKey="retention" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                  name="Retention %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Customer Segments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Customer Segments</h3>
            <Badge className="bg-blue-100 text-blue-800">
              {formatNumber(customerSegmentData.reduce((sum, item) => sum + item.value, 0))} total
            </Badge>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerSegmentData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value: any) => `${value} customers`} />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Customer Lifetime Value and Retention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Customer Lifetime Value */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Customer Lifetime Value</h3>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">
                {formatCurrency(averageLifetimeValue)} avg
              </Badge>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lifetimeValueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => 
                    name === 'value' ? formatCurrency(value) : `${value} customers`
                  }
                />
                <Legend />
                <Bar dataKey="value" fill="#8B5CF6" name="Lifetime Value" />
                <Bar dataKey="count" fill="#3B82F6" name="Customer Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Customer Retention Radar */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Customer Health Score</h3>
            <Badge className="bg-green-100 text-green-800">
              {averageRetention.toFixed(1)}/10
            </Badge>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={[
                { metric: 'Satisfaction', value: averageSatisfaction * 20, fullMark: 100 },
                { metric: 'Retention', value: averageRetention * 10, fullMark: 100 },
                { metric: 'Lifetime Value', value: (averageLifetimeValue / 50000) * 100, fullMark: 100 },
                { metric: 'Job Frequency', value: 85, fullMark: 100 },
                { metric: 'Response Time', value: 92, fullMark: 100 },
                { metric: 'Referral Rate', value: 78, fullMark: 100 },
              ]}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar 
                  name="Customer Health" 
                  dataKey="value" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.3}
                />
                <Tooltip formatter={(value: any) => `${value.toFixed(1)}%`} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'totalSpent', label: 'Total Spent' },
                { value: 'satisfaction', label: 'Satisfaction' },
                { value: 'retention', label: 'Retention' },
                { value: 'lifetimeValue', label: 'Lifetime Value' },
                { value: 'jobCount', label: 'Job Count' },
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <div className="flex space-x-2">
              <Button
                variant={sortOrder === 'desc' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSortOrder('desc')}
              >
                Desc
              </Button>
              <Button
                variant={sortOrder === 'asc' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSortOrder('asc')}
              >
                Asc
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              options={[
                { value: '3', label: 'Last 3 Months' },
                { value: '6', label: 'Last 6 Months' },
                { value: '12', label: 'Last 12 Months' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Customer Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Customer Analytics</h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" icon={Filter}>
                Filter
              </Button>
              <Button variant="ghost" size="sm" icon={Download}>
                Export
              </Button>
            </div>
          </div>
        </div>
        
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
            {filteredCustomers.map((customer, index) => (
              <tr key={customer.clientId} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 text-sm text-gray-900">
                    {column.render(customer, index)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Customer Insights */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-900">High Satisfaction</h4>
            </div>
            <p className="text-sm text-green-700">
              {customerAnalytics.filter(c => c.satisfactionScore >= 4.5).length} customers have excellent satisfaction scores.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Growth Opportunity</h4>
            </div>
            <p className="text-sm text-blue-700">
              {customerAnalytics.filter(c => c.retentionScore < 7.0).length} customers need retention improvement.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h4 className="font-medium text-yellow-900">At Risk Customers</h4>
            </div>
            <p className="text-sm text-yellow-700">
              {customerAnalytics.filter(c => c.satisfactionScore < 4.0 || c.retentionScore < 6.0).length} customers may be at risk of churning.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CustomerAnalytics;
