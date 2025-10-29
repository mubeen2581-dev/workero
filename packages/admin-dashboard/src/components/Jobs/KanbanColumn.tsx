import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { Job } from '@/types';
import JobCard from './JobCard';

interface KanbanColumnProps {
  title: string;
  status: string;
  jobs: Job[];
  onJobClick?: (job: Job) => void;
  className?: string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  jobs,
  onJobClick,
  className = '',
}) => {
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      scheduled: 'border-blue-200 bg-blue-50',
      in_progress: 'border-yellow-200 bg-yellow-50',
      completed: 'border-green-200 bg-green-50',
      cancelled: 'border-red-200 bg-red-50',
    };
    return colorMap[status] || 'border-gray-200 bg-gray-50';
  };

  return (
    <div className={`flex-1 min-w-72 sm:min-w-80 ${className}`}>
      {/* Column Header */}
      <div className={`p-3 sm:p-4 rounded-t-xl border-2 border-b-0 ${getStatusColor(status)}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-600">
            {jobs.length}
          </span>
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-96 p-3 sm:p-4 rounded-b-xl border-2 border-t-0 transition-colors duration-200 ${
              snapshot.isDraggingOver
                ? 'border-purple-300'
                : getStatusColor(status)
            }`}
            style={snapshot.isDraggingOver ? { backgroundColor: '#F3F0FF' } : {}}
          >
            <div className="space-y-3 sm:space-y-4">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <JobCard
                    job={job}
                    onClick={() => onJobClick?.(job)}
                  />
                </motion.div>
              ))}
              
              {jobs.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-gray-400 text-xl">📋</span>
                  </div>
                  <p className="text-sm text-gray-500">No jobs in this status</p>
                </div>
              )}
            </div>
            
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
