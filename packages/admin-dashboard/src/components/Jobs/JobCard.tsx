import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  User, 
  MapPin, 
  DollarSign, 
  Calendar,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  Camera
} from 'lucide-react';
import { Job } from '@/types';
import { mockTechnicians } from '@/mocks/jobs';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: Job;
  onClick?: () => void;
  className?: string;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick, className = '' }) => {
  const getStatusIcon = (status: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      scheduled: PlayCircle,
      in_progress: PauseCircle,
      completed: CheckCircle,
      cancelled: AlertCircle,
    };
    return iconMap[status] || PlayCircle;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colorMap: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colorMap[priority] || 'bg-gray-100 text-gray-800';
  };

  const getTechnician = () => {
    return mockTechnicians.find(tech => tech.id === job.assignedTechnician);
  };

  const technician = getTechnician();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = () => {
    if (job.status === 'completed') return 100;
    if (job.status === 'in_progress') {
      const elapsed = job.actualDuration || 0;
      const total = job.estimatedDuration;
      return Math.min((elapsed / total) * 100, 90);
    }
    return 0;
  };

  const progressPercentage = getProgressPercentage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card 
        className="h-full cursor-pointer hover:shadow-medium transition-all duration-200"
        onClick={onClick}
        hover
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {job.title}
            </h3>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{job.location.address.split(',')[0]}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-1 sm:space-y-2 ml-2">
            <Badge className={`${getStatusColor(job.status)} text-xs`}>
              {job.status.replace('_', ' ').charAt(0).toUpperCase() + job.status.slice(1).replace('_', ' ')}
            </Badge>
            <Badge className={`${getPriorityColor(job.priority)} text-xs`}>
              {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
            <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{job.client.name}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1 truncate">
            {job.client.email}
          </div>
        </div>

        {/* Assigned Technician */}
        {technician && (
          <div className="mb-3 sm:mb-4">
            <div className="flex items-center space-x-2">
              <img
                src={technician.avatar}
                alt={`${technician.firstName} ${technician.lastName}`}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover flex-shrink-0"
              />
              <span className="text-xs sm:text-sm text-gray-600 truncate">
                {technician.firstName} {technician.lastName}
              </span>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {job.status === 'in_progress' && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Duration & Schedule */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>
              {job.actualDuration || job.estimatedDuration}h
              {job.actualDuration && job.estimatedDuration && (
                <span className="text-xs text-gray-500 ml-1">
                  (est: {job.estimatedDuration}h)
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(job.scheduledDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Materials */}
        {job.materials.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">
              {job.materials.length} material{job.materials.length !== 1 ? 's' : ''}
            </div>
            <div className="flex flex-wrap gap-1">
              {job.materials.slice(0, 2).map((material) => (
                <span
                  key={material.id}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {material.name}
                </span>
              ))}
              {job.materials.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                  +{job.materials.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Photos & Signature Indicators */}
        <div className="flex items-center space-x-4 mb-4">
          {job.photos.length > 0 && (
            <div className="flex items-center space-x-1 text-xs text-blue-600">
              <Camera className="w-3 h-3" />
              <span>{job.photos.length}</span>
            </div>
          )}
          {job.signature && (
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <CheckCircle className="w-3 h-3" />
              <span>Signed</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {job.notes && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2">
              {job.notes}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              {job.status === 'completed' && job.completedDate
                ? `Completed ${formatDistanceToNow(new Date(job.completedDate), { addSuffix: true })}`
                : `Updated ${formatDistanceToNow(new Date(job.updatedAt), { addSuffix: true })}`
              }
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default JobCard;
