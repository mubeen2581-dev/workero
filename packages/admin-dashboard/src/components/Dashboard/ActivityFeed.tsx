import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from '@/types';
import Card from '../ui/Card';
import { formatDistanceToNow } from 'date-fns';

interface ActivityFeedProps {
  activities: Activity[];
  className?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, className = '' }) => {
  const getActivityIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      lead_created: '👤',
      quote_sent: '📄',
      job_scheduled: '📅',
      job_completed: '✅',
      invoice_sent: '🧾',
      payment_received: '💰',
    };
    return iconMap[type] || '📋';
  };

  const getActivityColor = (type: string) => {
    const colorMap: Record<string, string> = {
      lead_created: 'bg-blue-100 text-blue-600',
      quote_sent: 'bg-yellow-100 text-yellow-600',
      job_scheduled: 'bg-purple-100 text-purple-600',
      job_completed: 'bg-green-100 text-green-600',
      invoice_sent: 'bg-orange-100 text-orange-600',
      payment_received: 'bg-emerald-100 text-emerald-600',
    };
    return colorMap[type] || 'bg-gray-100 text-gray-600';
  };

  return (
    <Card className={className}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Recent Activity
        </h3>
        <p className="text-sm text-gray-600">
          Latest updates from your team
        </p>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 mb-1">
                {activity.description}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{activity.user.firstName} {activity.user.lastName}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
          View all activity
        </button>
      </div>
    </Card>
  );
};

export default ActivityFeed;
