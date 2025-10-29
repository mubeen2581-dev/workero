import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  TrendingUp, 
  MessageCircle, 
  Users, 
  Clock, 
  Target, 
  Zap, 
  Brain,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface AIAnalyticsProps {
  className?: string;
}

interface AIMetric {
  id: string;
  label: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface AIUsageData {
  date: string;
  suggestions: number;
  autoResponses: number;
  leadScoring: number;
  timeSaved: number;
}

const AIAnalytics: React.FC<AIAnalyticsProps> = ({ className = '' }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d');
  const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'performance'>('overview');

  const aiMetrics: AIMetric[] = [
    {
      id: 'suggestions',
      label: 'AI Suggestions',
      value: 1247,
      change: 12.5,
      trend: 'up',
      icon: Brain,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 'auto_responses',
      label: 'Auto Responses',
      value: 89,
      change: 8.2,
      trend: 'up',
      icon: MessageCircle,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 'lead_scoring',
      label: 'Lead Scoring Accuracy',
      value: '94%',
      change: 2.1,
      trend: 'up',
      icon: Target,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 'time_saved',
      label: 'Time Saved (hours)',
      value: '156.5',
      change: 15.3,
      trend: 'up',
      icon: Clock,
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  const usageData: AIUsageData[] = [
    { date: '2024-01-01', suggestions: 45, autoResponses: 23, leadScoring: 89, timeSaved: 12.5 },
    { date: '2024-01-02', suggestions: 52, autoResponses: 28, leadScoring: 91, timeSaved: 14.2 },
    { date: '2024-01-03', suggestions: 38, autoResponses: 19, leadScoring: 87, timeSaved: 11.8 },
    { date: '2024-01-04', suggestions: 61, autoResponses: 31, leadScoring: 93, timeSaved: 16.1 },
    { date: '2024-01-05', suggestions: 47, autoResponses: 25, leadScoring: 90, timeSaved: 13.4 },
    { date: '2024-01-06', suggestions: 55, autoResponses: 29, leadScoring: 92, timeSaved: 15.7 },
    { date: '2024-01-07', suggestions: 43, autoResponses: 22, leadScoring: 88, timeSaved: 12.9 }
  ];

  const performanceInsights = [
    {
      title: 'Top Performing AI Feature',
      description: 'Lead scoring accuracy increased by 15% this week',
      icon: TrendingUp,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'AI Response Time',
      description: 'Average AI response time: 2.3 seconds',
      icon: Zap,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Customer Satisfaction',
      description: '94% satisfaction rate with AI suggestions',
      icon: CheckCircle,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Analytics</h2>
            <p className="text-sm text-gray-600">Comprehensive AI performance insights</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {(['7d', '30d', '90d'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'usage', label: 'Usage', icon: PieChart },
          { id: 'performance', label: 'Performance', icon: Activity }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab.id as any)}
            className="flex-1"
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiMetrics.map((metric) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${metric.color}`}>
                    <metric.icon className="w-5 h-5" />
                  </div>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                  <div className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}% from last period
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'usage' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Usage Trends</h3>
            <div className="space-y-4">
              {usageData.slice(-7).map((data, index) => (
                <div key={data.date} className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {new Date(data.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-blue-600">{data.suggestions} suggestions</span>
                    <span className="text-green-600">{data.autoResponses} responses</span>
                    <span className="text-purple-600">{data.leadScoring}% accuracy</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Feature Usage</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Message Suggestions</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-medium">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Auto Responses</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <span className="text-sm font-medium">72%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Lead Scoring</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                  <span className="text-sm font-medium">94%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {performanceInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${insight.color}`}>
                      <insight.icon className="w-4 h-4" />
                    </div>
                    <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Performance Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total AI Interactions</span>
                  <span className="font-semibold text-gray-900">2,847</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Successful Suggestions</span>
                  <span className="font-semibold text-green-600">2,156 (89%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Response Time</span>
                  <span className="font-semibold text-blue-600">2.3s</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Time Saved</span>
                  <span className="font-semibold text-purple-600">156.5 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Customer Satisfaction</span>
                  <span className="font-semibold text-green-600">94%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cost Savings</span>
                  <span className="font-semibold text-orange-600">£3,240</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AIAnalytics;
