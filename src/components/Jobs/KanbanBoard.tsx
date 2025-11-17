import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { Job } from '@/types';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  jobs: Job[];
  onJobClick?: (job: Job) => void;
  onJobStatusChange?: (jobId: string, newStatus: string) => void;
  className?: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  jobs,
  onJobClick,
  onJobStatusChange,
  className = '',
}) => {
  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Update job status
    const newStatus = destination.droppableId;
    onJobStatusChange?.(draggableId, newStatus);
  };

  // Group jobs by status
  const jobsByStatus = {
    scheduled: jobs.filter(job => job.status === 'scheduled'),
    in_progress: jobs.filter(job => job.status === 'in_progress'),
    completed: jobs.filter(job => job.status === 'completed'),
    cancelled: jobs.filter(job => job.status === 'cancelled'),
  };

  const columns = [
    {
      title: 'Scheduled',
      status: 'scheduled',
      jobs: jobsByStatus.scheduled,
    },
    {
      title: 'In Progress',
      status: 'in_progress',
      jobs: jobsByStatus.in_progress,
    },
    {
      title: 'Completed',
      status: 'completed',
      jobs: jobsByStatus.completed,
    },
    {
      title: 'Cancelled',
      status: 'cancelled',
      jobs: jobsByStatus.cancelled,
    },
  ];

  return (
    <div className={`w-full ${className}`}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="column">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-4"
            >
              {columns.map((column, index) => (
                <motion.div
                  key={column.status}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <KanbanColumn
                    title={column.title}
                    status={column.status}
                    jobs={column.jobs}
                    onJobClick={onJobClick}
                  />
                </motion.div>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
