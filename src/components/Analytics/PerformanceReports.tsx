import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Clock, 
  Star, 
  Target,
  Users,
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
  AlertTriangle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  getPerformanceMetrics, 
  getTopPerformers,
  formatCurrency,
  formatPercentage,
  formatNumber
} from '@/mocks/analytics';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { Table } from '../ui/Table';

interface PerformanceReportsProps {
  className?: string;
}

const PerformanceReports: React.FC<PerformanceReportsProps> = ({
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('efficiency');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedMetric, setSelectedMetric] = useState<string>('efficiency');
  const [timeRange, setTimeRange] = useState<string>('12');

  const performanceMetrics = getPerformanceMetrics();
  const topPerformers = getTopPerformers(10);

  const filteredMetrics = useMemo(() => {
    let filtered = performanceMetrics.filter(metric => 
      metric.technicianName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'efficiency':
          aValue = a.efficiency;
          bValue = b.efficiency;
          break;
        case 'revenue':
          aValue = a.revenue;
          bValue = b.revenue;
          break;
        case 'rating':
          aValue = a.averageRating;
          bValue = b.averageRating;
          break;
        case 'jobs':
          aValue = a.jobsCompleted;
          bValue = b.jobsCompleted;
          break;
        case 'satisfaction':
          aValue = a.customerSatisfaction;
          bValue = b.customerSatisfaction;
          break;
        default:
          aValue = a.efficiency;
          bValue = b.efficiency;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [performanceMetrics, searchTerm, sortBy, sortOrder]);

  const getPerformanceLevel = (efficiency: number) => {
    if (efficiency >= 95) return { level: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (efficiency >= 90) return { level: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (efficiency >= 80) return { level: 'Average', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.8) return 'text-green-600';
    if (rating >= 4.5) return 'text-blue-600';
    if (rating >= 4.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (value: number, threshold: number) => {
    return value >= threshold ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (value: number, threshold: number) => {
    return value >= threshold ? 'text-green-600' : 'text-red-600';
  };

  // Mock performance trend data
  const performanceTrendData = [
    { name: 'Jan', efficiency: 87.2, satisfaction: 4.3, revenue: 32000 },
    { name: 'Feb', efficiency: 89.1, satisfaction: 4.4, revenue: 34500 },
    { name: 'Mar', efficiency: 91.3, satisfaction: 4.5, revenue: 37800 },
    { name: 'Apr', efficiency: 88.7, satisfaction: 4.6, revenue: 35600 },
    { name: 'May', efficiency: 92.4, satisfaction: 4.7, revenue: 41200 },
    { name: 'Jun', efficiency: 94.1, satisfaction: 4.8, revenue: 43900 },
    { name: 'Jul', efficiency: 93.8, satisfaction: 4.7, revenue: 42500 },
    { name: 'Aug', efficiency: 95.2, satisfaction: 4.9, revenue: 46800 },
    { name: 'Sep', efficiency: 94.7, satisfaction: 4.8, revenue: 45200 },
    { name: 'Oct', efficiency: 96.1, satisfaction: 4.9, revenue: 48900 },
    { name: 'Nov', efficiency: 95.8, satisfaction: 4.8, revenue: 47100 },
    { name: 'Dec', efficiency: 97.2, satisfaction: 4.9, revenue: 51200 },
  ];

  const radarData = [
    { metric: 'Efficiency', value: 94.2, fullMark: 100 },
    { metric: 'Quality', value: 96.8, fullMark: 100 },
    { metric: 'Speed', value: 91.5, fullMark: 100 },
    { metric: 'Communication', value: 93.7, fullMark: 100 },
    { metric: 'Reliability', value: 95.1, fullMark: 100 },
    { metric: 'Customer Satisfaction', value: 97.3, fullMark: 100 },
  ];

  const columns = [
    {
      key: 'rank',
      header: 'Rank',
      render: (metric: any, index: number) => (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
          {index < 3 && <Award className="w-4 h-4 text-yellow-500" />}
        </div>
      ),
    },
    {
      key: 'technician',
      header: 'Technician',
      render: (metric: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{metric.technicianName}</p>
            <p className="text-xs text-gray-500">{metric.jobsCompleted} jobs completed</p>
          </div>
        </div>
      ),
    },
    {
      key: 'efficiency',
      header: 'Efficiency',
      render: (metric: any) => {
        const performance = getPerformanceLevel(metric.efficiency);
        return (
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">{formatPercentage(metric.efficiency)}</p>
            <Badge className={performance.color}>
              {performance.level}
            </Badge>
          </div>
        );
      },
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (metric: any) => (
        <div className="flex items-center space-x-2">
          <Star className={`w-4 h-4 ${getRatingColor(metric.averageRating)}`} />
          <span className={`text-sm font-medium ${getRatingColor(metric.averageRating)}`}>
            {metric.averageRating.toFixed(1)}
          </span>
        </div>
      ),
    },
    {
      key: 'revenue',
      header: 'Revenue',
      render: (metric: any) => (
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{formatCurrency(metric.revenue)}</p>
          <p className="text-xs text-gray-500">{metric.totalHours} hours</p>
        </div>
      ),
    },
    {
      key: 'satisfaction',
      header: 'Satisfaction',
      render: (metric: any) => (
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900">{formatPercentage(metric.customerSatisfaction * 20)}</p>
          <p className="text-xs text-gray-500">{metric.customerSatisfaction.toFixed(1)}/5.0</p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (metric: any) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" icon={Eye}>
            View
          </Button>
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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Performance Reports</h2>
          <p className="text-sm sm:text-base text-gray-600">Track and analyze team performance metrics</p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button variant="secondary" icon={Download} className="flex-1 sm:flex-none">
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-8">
        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Average Efficiency</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-600">
                {formatPercentage(performanceMetrics.reduce((sum, m) => sum + m.efficiency, 0) / performanceMetrics.length)}
              </p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                <span className="hidden sm:inline">+2.3% from last month</span>
                <span className="sm:hidden">+2.3%</span>
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
              <Target className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-lg sm:text-2xl font-bold text-yellow-600">
                {(performanceMetrics.reduce((sum, m) => sum + m.averageRating, 0) / performanceMetrics.length).toFixed(1)}
              </p>
              <p className="text-xs text-gray-500 hidden sm:block">out of 5.0</p>
            </div>
            <div className="p-2 sm:p-3 bg-yellow-100 rounded-xl">
              <Star className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">
                {formatCurrency(performanceMetrics.reduce((sum, m) => sum + m.revenue, 0))}
              </p>
              <p className="text-xs text-gray-500 hidden sm:block">from all technicians</p>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
              <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">On-Time Rate</p>
              <p className="text-lg sm:text-2xl font-bold text-purple-600">
                {formatPercentage(performanceMetrics.reduce((sum, m) => sum + m.jobsOnTime, 0) / performanceMetrics.reduce((sum, m) => sum + m.jobsCompleted, 0) * 100)}
              </p>
              <p className="text-xs text-gray-500 hidden sm:block">job completion rate</p>
            </div>
            <div className="p-2 sm:p-3 bg-purple-100 rounded-xl">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Trend */}
        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Trend</h3>
            <Select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              options={[
                { value: 'efficiency', label: 'Efficiency' },
                { value: 'satisfaction', label: 'Satisfaction' },
                { value: 'revenue', label: 'Revenue' },
              ]}
            />
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => selectedMetric === 'revenue' ? formatCurrency(value) : `${value.toFixed(1)}${selectedMetric === 'efficiency' ? '%' : '/5.0'}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey={selectedMetric} 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Performance Radar */}
        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Radar</h3>
            <Badge className="bg-blue-100 text-blue-800">
              Overall Score
            </Badge>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar 
                  name="Performance" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
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
              placeholder="Search technicians..."
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
                { value: 'efficiency', label: 'Efficiency' },
                { value: 'revenue', label: 'Revenue' },
                { value: 'rating', label: 'Rating' },
                { value: 'jobs', label: 'Jobs Completed' },
                { value: 'satisfaction', label: 'Satisfaction' },
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

      {/* Performance Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Technician Performance</h3>
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
            {filteredMetrics.map((metric, index) => (
              <tr key={metric.technicianId} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 text-sm text-gray-900">
                    {column.render(metric, index)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Performance Insights */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-900">Top Performers</h4>
            </div>
            <p className="text-sm text-green-700">
              {topPerformers.slice(0, 3).map(p => p.technicianName).join(', ')} are leading the team with exceptional performance.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Improvement Areas</h4>
            </div>
            <p className="text-sm text-blue-700">
              Focus on communication and speed training to boost overall team performance.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h4 className="font-medium text-yellow-900">Attention Needed</h4>
            </div>
            <p className="text-sm text-yellow-700">
              {filteredMetrics.filter(m => m.efficiency < 85).length} technicians need performance improvement.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PerformanceReports;
