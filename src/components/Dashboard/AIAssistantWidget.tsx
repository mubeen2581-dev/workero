import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, MessageCircle, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface AIAssistantWidgetProps {
  className?: string;
}

const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const aiStats = {
    messagesProcessed: 1247,
    suggestionsAccepted: 89,
    timeSaved: '12.5h',
    satisfactionRate: 94
  };

  const quickActions = [
    { name: 'Generate Quote', icon: MessageCircle, color: 'bg-blue-100 text-blue-600' },
    { name: 'Schedule Job', icon: Zap, color: 'bg-purple-100 text-purple-600' },
    { name: 'Analyze Leads', icon: TrendingUp, color: 'bg-green-100 text-green-600' },
    { name: 'Customer Insights', icon: Users, color: 'bg-orange-100 text-orange-600' }
  ];

  return (
    <Card className={`${className}`}>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
              <p className="text-sm text-gray-600">Powered by Workero AI</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Sparkles className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{aiStats.messagesProcessed}</div>
            <div className="text-xs text-gray-600">Messages Processed</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{aiStats.satisfactionRate}%</div>
            <div className="text-xs text-gray-600">Satisfaction Rate</div>
          </div>
        </div>

        {/* Quick Actions */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="text-sm font-medium text-gray-700 mb-2">Quick Actions</div>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className={`justify-start p-3 h-auto ${action.color}`}
                >
                  <action.icon className="w-4 h-4 mr-2" />
                  <span className="text-xs font-medium">{action.name}</span>
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Time saved this week</span>
            <span className="font-semibold text-green-600">{aiStats.timeSaved}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AIAssistantWidget;
