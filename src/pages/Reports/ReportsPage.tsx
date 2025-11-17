import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Download,
  Filter,
  RefreshCw,
  Eye,
  FileText,
  PieChart,
  Activity,
  Target,
  Star,
  Bot
} from 'lucide-react';
import AnalyticsDashboard from '@/components/Analytics/AnalyticsDashboard';
import PerformanceReports from '@/components/Analytics/PerformanceReports';
import FinancialAnalytics from '@/components/Analytics/FinancialAnalytics';
import CustomerAnalytics from '@/components/Analytics/CustomerAnalytics';
import AIAnalytics from '@/components/Analytics/AIAnalytics';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'ai', label: 'AI Analytics', icon: Bot },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AnalyticsDashboard />;
      case 'performance':
        return <PerformanceReports />;
      case 'financial':
        return <FinancialAnalytics />;
      case 'customers':
        return <CustomerAnalytics />;
      case 'ai':
        return <AIAnalytics />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Reports & Analytics
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Comprehensive business intelligence and performance insights
            </p>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button variant="secondary" icon={Filter} className="hidden sm:flex">
              Filter
            </Button>
            <Button variant="secondary" icon={Filter} className="sm:hidden p-2">
              <span className="sr-only">Filter</span>
            </Button>
            <Button variant="secondary" icon={Download} className="hidden sm:flex">
              Export All
            </Button>
            <Button variant="secondary" icon={Download} className="sm:hidden p-2">
              <span className="sr-only">Export</span>
            </Button>
            <Button variant="primary" icon={RefreshCw} className="flex-1 sm:flex-none">
              <span className="hidden sm:inline">Refresh Data</span>
              <span className="sm:hidden">Refresh</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
      >
          <Card className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">£485,750</p>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                  <span className="hidden sm:inline">+12.5% from last period</span>
                  <span className="sm:hidden">+12.5%</span>
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
                <p className="text-xs sm:text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">1,247</p>
                <p className="text-xs text-gray-500 hidden sm:block">91.8% retention rate</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Jobs Completed</p>
                <p className="text-lg sm:text-2xl font-bold text-purple-600">1,189</p>
                <p className="text-xs text-gray-500 hidden sm:block">95.3% completion rate</p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-100 rounded-xl">
                <Activity className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Customer Satisfaction</p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-600">4.8</p>
                <p className="text-xs text-gray-500 hidden sm:block">out of 5.0</p>
              </div>
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-xl">
                <Star className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
      </motion.div>

      {/* View Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-0">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  style={activeTab === tab.id ? { backgroundColor: '#F3F0FF' } : {}}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {renderTabContent()}

        {/* Report Templates */}
        <Card className="p-6 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Report Templates</h3>
            <Button variant="secondary" icon={FileText}>
              Create Custom Report
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Monthly Revenue Report</h4>
                  <p className="text-sm text-gray-500">Comprehensive revenue analysis</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge className="bg-green-100 text-green-800">Financial</Badge>
                <Button variant="ghost" size="sm" icon={Eye}>
                  Preview
                </Button>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Performance Dashboard</h4>
                  <p className="text-sm text-gray-500">Team performance metrics</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-100 text-blue-800">Performance</Badge>
                <Button variant="ghost" size="sm" icon={Eye}>
                  Preview
                </Button>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Customer Analytics</h4>
                  <p className="text-sm text-gray-500">Customer satisfaction insights</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge className="bg-purple-100 text-purple-800">Customer</Badge>
                <Button variant="ghost" size="sm" icon={Eye}>
                  Preview
                </Button>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Activity className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Operational Report</h4>
                  <p className="text-sm text-gray-500">Efficiency and utilization</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge className="bg-yellow-100 text-yellow-800">Operational</Badge>
                <Button variant="ghost" size="sm" icon={Eye}>
                  Preview
                </Button>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Target className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">KPI Summary</h4>
                  <p className="text-sm text-gray-500">Key performance indicators</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge className="bg-red-100 text-red-800">KPI</Badge>
                <Button variant="ghost" size="sm" icon={Eye}>
                  Preview
                </Button>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <PieChart className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Custom Report</h4>
                  <p className="text-sm text-gray-500">Build your own report</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge className="bg-indigo-100 text-indigo-800">Custom</Badge>
                <Button variant="ghost" size="sm" icon={Eye}>
                  Create
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ReportsPage;
