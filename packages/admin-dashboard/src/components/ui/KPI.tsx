import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { KPIMetric } from '@/types';
import Card from './Card';

interface KPICardProps {
  metric: KPIMetric;
  className?: string;
}

const KPICard: React.FC<KPICardProps> = ({ metric, className = '' }) => {
  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'GBP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return '↗';
      case 'decrease':
        return '↘';
      default:
        return '→';
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-success-600';
      case 'decrease':
        return 'text-error-600';
      default:
        return 'text-gray-600';
    }
  };

  // Dynamic icon import - in a real app, you'd use a proper icon mapping
  const IconComponent = ({ name }: { name: string }) => {
    // This is a simplified approach - in production, use a proper icon library
    const iconMap: Record<string, string> = {
      DollarSign: '💰',
      Briefcase: '💼',
      Users: '👥',
      TrendingUp: '📈',
    };
    
    return <span className="text-2xl">{iconMap[name] || '📊'}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="h-full">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
              <div className={`p-2 rounded-xl bg-gray-50 ${metric.color} flex-shrink-0`}>
                <IconComponent name={metric.icon} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">
                  {metric.title}
                </h3>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                  {formatValue(metric.value, metric.format)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <span className={`text-xs sm:text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                {getChangeIcon(metric.changeType)} {Math.abs(metric.change).toFixed(1)}%
              </span>
              <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">vs last month</span>
              <span className="text-xs text-gray-500 sm:hidden">vs last mo</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default KPICard;
