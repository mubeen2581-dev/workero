import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import { RecurringSchedule } from '@/types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatDistanceToNow } from 'date-fns';

interface RecurringJobsManagerProps {
  recurringJobs?: RecurringSchedule[];
  isLoading?: boolean;
  onEdit?: (job: RecurringSchedule) => void;
  onDelete?: (jobId: string) => void;
  onToggle?: (job: RecurringSchedule) => void;
  onGenerate?: (jobId: string) => void;
  onAdd?: () => void;
  className?: string;
}

const RecurringJobsManager: React.FC<RecurringJobsManagerProps> = ({
  recurringJobs = [],
  isLoading = false,
  onEdit,
  onDelete,
  onToggle,
  onGenerate,
  onAdd,
  className = '',
}) => {
  const getFrequencyColor = (frequency: string) => {
    const colorMap: Record<string, string> = {
      weekly: 'bg-blue-100 text-blue-800',
      monthly: 'bg-green-100 text-green-800',
      custom: 'bg-purple-100 text-purple-800',
      daily: 'bg-orange-100 text-orange-800',
    };
    return colorMap[frequency] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  const getWeekdayNames = (days?: number[] | null) => {
    if (!days || days.length === 0) return 'Flexible';
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map((day) => labels[day]).join(', ');
  };

  const getScheduleSummary = (job: RecurringSchedule) => {
    switch (job.frequency) {
      case 'daily':
        return `Every ${job.interval || 1} day(s)`;
      case 'weekly':
        return `${getWeekdayNames(job.weekdays)} • every ${job.interval || 1} week(s)`;
      case 'monthly':
        return `Day ${job.monthDay ?? '—'} • every ${job.interval || 1} month(s)`;
      case 'custom':
        return `${job.constraints?.custom_dates?.length || 0} custom date(s)`;
      default:
        return 'Flexible schedule';
    }
  };

  const getDurationLabel = (job: RecurringSchedule) => {
    const minutes = job.constraints?.duration_minutes ?? 60;
    if (minutes >= 60) {
      const hours = minutes / 60;
      return `${hours} hr${hours > 1 ? 's' : ''}`;
    }
    return `${minutes} min`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recurring Jobs</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Manage automated recurring job schedules
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={onAdd} className="w-full sm:w-auto">
          Add Recurring Job
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading && (
          <Card className="p-6 text-center text-gray-500">Loading recurring schedules...</Card>
        )}

        {!isLoading &&
          recurringJobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                        {job.constraints?.title || job.job?.title || 'Recurring Job'}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(job.status)} text-xs capitalize`}>
                          {job.status}
                        </Badge>
                        <Badge className={`${getFrequencyColor(job.frequency)} text-xs capitalize`}>
                          {job.frequency}
                        </Badge>
                      </div>
                    </div>

                    {(job.constraints?.description || job.job?.description) && (
                      <p className="text-sm sm:text-base text-gray-600 mb-4">
                        {job.constraints?.description || job.job?.description}
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">Client</p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {job.job?.client?.name || '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">Schedule</p>
                        <p className="text-xs sm:text-sm text-gray-600">{getScheduleSummary(job)}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">Duration</p>
                        <p className="text-xs sm:text-sm text-gray-600">{getDurationLabel(job)}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>
                          Next:{' '}
                          {job.nextOccurrence
                            ? new Date(job.nextOccurrence).toLocaleString()
                            : 'TBD'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>
                          Created{' '}
                          {job.createdAt
                            ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
                            : '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end lg:justify-start space-x-1 sm:space-x-2 lg:ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={RotateCcw}
                      onClick={() => onGenerate?.(job.id)}
                      className="text-blue-600 hover:text-blue-700 p-2 sm:p-2"
                    >
                      <span className="hidden sm:inline">Generate</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={job.status === 'active' ? Pause : Play}
                      onClick={() => onToggle?.(job)}
                      className={`${
                        job.status === 'active'
                          ? 'text-yellow-600 hover:text-yellow-700'
                          : 'text-green-600 hover:text-green-700'
                      } p-2 sm:p-2`}
                    >
                      <span className="hidden sm:inline">
                        {job.status === 'active' ? 'Pause' : 'Resume'}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit}
                      onClick={() => onEdit?.(job)}
                      className="p-2 sm:p-2"
                    >
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => onDelete?.(job.id)}
                      className="text-red-600 hover:text-red-700 p-2 sm:p-2"
                    >
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

        {!isLoading && recurringJobs.length === 0 && (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recurring jobs</h3>
            <p className="text-gray-500 mb-6">
              Create recurring jobs to automate your scheduling
            </p>
            <Button variant="primary" icon={Plus} onClick={onAdd}>
              Create First Recurring Job
            </Button>
          </Card>
        )}
      </div>
    </motion.div>
  );
};

export default RecurringJobsManager;


