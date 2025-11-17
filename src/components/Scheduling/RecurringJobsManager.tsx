import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { RecurringJob } from '@/types';
import { mockRecurringJobs, generateRecurringEvents } from '@/mocks/schedules';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatDistanceToNow } from 'date-fns';

interface RecurringJobsManagerProps {
  recurringJobs?: RecurringJob[];
  onEdit?: (job: RecurringJob) => void;
  onDelete?: (jobId: string) => void;
  onToggle?: (jobId: string) => void;
  onAdd?: () => void;
  className?: string;
}

const RecurringJobsManager: React.FC<RecurringJobsManagerProps> = ({
  recurringJobs = mockRecurringJobs,
  onEdit,
  onDelete,
  onToggle,
  onAdd,
  className = '',
}) => {
  const [selectedJob, setSelectedJob] = useState<RecurringJob | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const getFrequencyColor = (frequency: string) => {
    const colorMap: Record<string, string> = {
      weekly: 'bg-blue-100 text-blue-800',
      monthly: 'bg-green-100 text-green-800',
      quarterly: 'bg-purple-100 text-purple-800',
      yearly: 'bg-orange-100 text-orange-800',
    };
    return colorMap[frequency] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getDayOfWeekName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getNextOccurrences = (job: RecurringJob, count: number = 3) => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3);
    
    const events = generateRecurringEvents(job, startDate, endDate);
    return events.slice(0, count);
  };

  const handlePreviewJob = (job: RecurringJob) => {
    setSelectedJob(job);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedJob(null);
  };

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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recurring Jobs</h2>
          <p className="text-sm sm:text-base text-gray-600">Manage automated recurring job schedules</p>
        </div>
        
        <Button
          variant="primary"
          icon={Plus}
          onClick={onAdd}
          className="w-full sm:w-auto"
        >
          Add Recurring Job
        </Button>
      </div>

      {/* Recurring Jobs List */}
      <div className="space-y-4">
        {recurringJobs.map((job) => (
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
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{job.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(job.isActive)} text-xs`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge className={`${getFrequencyColor(job.frequency)} text-xs`}>
                        {job.frequency.charAt(0).toUpperCase() + job.frequency.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm sm:text-base text-gray-600 mb-4">{job.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">Client</p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{job.client.name}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">Schedule</p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {getDayOfWeekName(job.dayOfWeek)} at {formatTime(job.startTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">Duration</p>
                      <p className="text-xs sm:text-sm text-gray-600">{job.duration} hours</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>Next: {job.nextOccurrence.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>Created {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end lg:justify-start space-x-1 sm:space-x-2 lg:ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={job.isActive ? Pause : Play}
                    onClick={() => onToggle?.(job.id)}
                    className={`${job.isActive ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'} p-2 sm:p-2`}
                  >
                    <span className="hidden sm:inline">{job.isActive ? 'Pause' : 'Resume'}</span>
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
        
        {recurringJobs.length === 0 && (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No recurring jobs
            </h3>
            <p className="text-gray-500 mb-6">
              Create recurring jobs to automate your scheduling
            </p>
            <Button
              variant="primary"
              icon={Plus}
              onClick={onAdd}
            >
              Create First Recurring Job
            </Button>
          </Card>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedJob && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleClosePreview}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-large max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedJob.title} - Preview
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClosePreview}
                  className="p-2"
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Next Occurrences</h4>
                  <div className="space-y-2">
                    {getNextOccurrences(selectedJob, 5).map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {event.title}
                          </p>
                          <p className="text-xs text-gray-600">
                            {event.start.toLocaleDateString()} at {formatTime(event.start.toTimeString().slice(0, 5))}
                          </p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {event.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <Button
                    variant="secondary"
                    onClick={handleClosePreview}
                  >
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      onEdit?.(selectedJob);
                      handleClosePreview();
                    }}
                  >
                    Edit Job
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecurringJobsManager;
