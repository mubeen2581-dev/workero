import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import RevenueChart from '@/components/Charts/RevenueChart';
import JobStatusChart from '@/components/Charts/JobStatusChart';
import ActivityFeed from '@/components/Dashboard/ActivityFeed';
import RecentInvoices from '@/components/Dashboard/RecentInvoices';
import QuickActions from '@/components/Dashboard/QuickActions';
import SummaryPanel from '@/components/Dashboard/SummaryPanel';
import AIAssistantWidget from '@/components/Dashboard/AIAssistantWidget';
import Card from '@/components/ui/Card';
import NotificationService from '@/services/notificationService';
import { useUIStore } from '@/stores/uiStore';
import {
  mockRevenueChartData,
  mockJobStatusData,
  mockRecentActivities,
  mockRecentInvoices,
  mockSummaryCounts,
} from '@/mocks/dashboard';

const Dashboard: React.FC = () => {
  // Generate demo notifications on component mount
  useEffect(() => {
    // Only generate demo notifications if there are no existing notifications
    const { notifications } = useUIStore.getState();
    if (notifications.length === 0) {
      NotificationService.generateDemoNotifications();
    }
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Welcome back! Here's what's happening with your business today.
        </p>
      </motion.div>

      {/* Summary + Top Counters/Chart (inspired layout) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Left dark summary panel */}
        <SummaryPanel className="xl:col-span-1" />

        {/* Right quick stats and chart */}
        <Card className="xl:col-span-2 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">{mockSummaryCounts.customers}</div>
              <div className="text-sm text-gray-600 mt-1">Customers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{mockSummaryCounts.companies}</div>
              <div className="text-sm text-gray-600 mt-1">Companies</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{mockSummaryCounts.leads}</div>
              <div className="text-sm text-gray-600 mt-1">Leads</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-3xl font-bold text-gray-900">
              {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(mockSummaryCounts.netWorth)}
            </div>
            <div className="text-sm text-gray-600">Net Worth</div>
          </div>

          <div className="mt-6">
            <RevenueChart data={mockRevenueChartData} />
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6"
      >
        <JobStatusChart data={mockJobStatusData} />
        <QuickActions />
      </motion.div>

      {/* Bottom Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
      >
        {/* Activity Feed */}
        <ActivityFeed activities={mockRecentActivities} />

        {/* Recent Invoices */}
        <RecentInvoices invoices={mockRecentInvoices} />
      </motion.div>

      {/* Additional Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Team Performance */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Team Performance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 text-sm font-medium">MS</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Mike Smith</p>
                  <p className="text-xs text-gray-500">Senior Technician</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">8 jobs</p>
                <p className="text-xs text-success-600">+2 this week</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-medium">LB</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Lisa Brown</p>
                  <p className="text-xs text-gray-500">Project Manager</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">12 quotes</p>
                <p className="text-xs text-success-600">+5 this week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Appointments
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Kitchen Renovation</p>
                <p className="text-xs text-gray-500">Sarah Johnson • Tomorrow 9:00 AM</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Bathroom Remodel</p>
                <p className="text-xs text-gray-500">David Wilson • Dec 18, 2:00 PM</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Electrical Panel</p>
                <p className="text-xs text-gray-500">Robert Taylor • Dec 20, 10:00 AM</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            System Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Status</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                Online
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                Healthy
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">WhatsHub Integration</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                Connected
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">XE Pay Integration</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                Pending
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Assistant Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-6"
      >
        <AIAssistantWidget className="lg:col-span-1" />
        
        {/* Additional AI Features */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">AI</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">AI Analytics</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Smart Suggestions</span>
                <span className="text-sm font-semibold text-gray-900">47 today</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Auto-responses</span>
                <span className="text-sm font-semibold text-gray-900">23 sent</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Lead scoring</span>
                <span className="text-sm font-semibold text-gray-900">89% accuracy</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">W</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">WhatsApp CRM</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active conversations</span>
                <span className="text-sm font-semibold text-gray-900">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Messages today</span>
                <span className="text-sm font-semibold text-gray-900">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response time</span>
                <span className="text-sm font-semibold text-gray-900">2.3 min</span>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
