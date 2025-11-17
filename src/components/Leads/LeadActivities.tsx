import React from 'react';
import { Clock, User, MessageSquare, CheckCircle, XCircle, ArrowRight, FileText, Phone, Mail } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { LeadActivity } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface LeadActivitiesProps {
  activities: LeadActivity[];
  isLoading?: boolean;
}

const LeadActivities: React.FC<LeadActivitiesProps> = ({ activities, isLoading }) => {
  const getActivityIcon = (type: LeadActivity['type']) => {
    switch (type) {
      case 'created':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'status_changed':
        return <ArrowRight className="w-4 h-4 text-purple-500" />;
      case 'assigned':
        return <User className="w-4 h-4 text-green-500" />;
      case 'note_added':
        return <MessageSquare className="w-4 h-4 text-yellow-500" />;
      case 'contacted':
        return <Phone className="w-4 h-4 text-blue-500" />;
      case 'quote_sent':
        return <Mail className="w-4 h-4 text-indigo-500" />;
      case 'converted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'lost':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'updated':
        return <FileText className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityColor = (type: LeadActivity['type']) => {
    switch (type) {
      case 'created':
        return 'bg-blue-100 text-blue-700';
      case 'status_changed':
        return 'bg-purple-100 text-purple-700';
      case 'assigned':
        return 'bg-green-100 text-green-700';
      case 'note_added':
        return 'bg-yellow-100 text-yellow-700';
      case 'contacted':
        return 'bg-blue-100 text-blue-700';
      case 'quote_sent':
        return 'bg-indigo-100 text-indigo-700';
      case 'converted':
        return 'bg-green-100 text-green-700';
      case 'lost':
        return 'bg-red-100 text-red-700';
      case 'updated':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatActivityType = (type: LeadActivity['type']) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading activities...</span>
        </div>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No activities recorded yet</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const isLast = index === activities.length - 1;
          const activityDate = new Date(activity.created_at);
          const timeAgo = formatDistanceToNow(activityDate, { addSuffix: true });

          return (
            <div key={activity.id} className="relative flex items-start space-x-3">
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" />
              )}

              {/* Icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" size="sm" className={getActivityColor(activity.type)}>
                      {formatActivityType(activity.type)}
                    </Badge>
                    {activity.user && (
                      <span className="text-sm text-gray-600">
                        by {activity.user.first_name} {activity.user.last_name}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{timeAgo}</span>
                </div>
                <p className="text-sm text-gray-900 mt-1">{activity.description}</p>
                
                {/* Metadata display */}
                {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                    {activity.metadata.old_status && activity.metadata.new_status && (
                      <div className="flex items-center space-x-2">
                        <span className="line-through">{activity.metadata.old_status}</span>
                        <ArrowRight className="w-3 h-3" />
                        <span className="font-medium">{activity.metadata.new_status}</span>
                      </div>
                    )}
                    {activity.metadata.assigned_to_name && (
                      <div>Assigned to: {activity.metadata.assigned_to_name}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default LeadActivities;

