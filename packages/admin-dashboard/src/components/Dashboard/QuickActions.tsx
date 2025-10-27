import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, FileText, Briefcase, Calendar } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'create-lead',
    title: 'Add New Lead',
    description: 'Create a new lead from any source',
    icon: Users,
    href: '/leads/new',
    color: 'bg-blue-500',
  },
  {
    id: 'create-quote',
    title: 'Create Quote',
    description: 'Generate a new quote for a client',
    icon: FileText,
    href: '/quotes/new',
    color: 'bg-green-500',
  },
  {
    id: 'schedule-job',
    title: 'Schedule Job',
    description: 'Schedule a new job or appointment',
    icon: Calendar,
    href: '/scheduling/new',
    color: 'bg-purple-500',
  },
  {
    id: 'create-job',
    title: 'Create Job',
    description: 'Set up a new job from a quote',
    icon: Briefcase,
    href: '/jobs/new',
    color: 'bg-orange-500',
  },
];

interface QuickActionsProps {
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ className = '' }) => {
  const handleActionClick = (action: QuickAction) => {
    // In a real app, this would navigate to the action
    console.log(`Quick action clicked: ${action.title}`);
  };

  return (
    <Card className={className}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Quick Actions
        </h3>
        <p className="text-sm text-gray-600">
          Common tasks to get you started
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleActionClick(action)}
            className="group p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-medium transition-all duration-200 text-left"
          >
            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className={`p-2 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                <action.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-primary-600 transition-colors truncate">
                  {action.title}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {action.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          className="w-full"
        >
          View All Actions
        </Button>
      </div>
    </Card>
  );
};

export default QuickActions;
