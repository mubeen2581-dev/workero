import React, { useState, useCallback, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { Clock, MapPin, User, AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { useUIStore } from '@/stores/uiStore';

export interface DispatchJob {
  id: string;
  title: string;
  client: string;
  duration: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: string;
  skills: string[];
  status: 'unassigned' | 'assigned';
  assignedTechnician?: string | null;
}

export interface DispatchTechnician {
  id: string;
  name: string;
  avatar?: string;
  skills: string[];
  workload: number;
  maxCapacity: number;
  jobs: DispatchJob[];
}

interface DragDropDispatchProps {
  jobs: DispatchJob[];
  technicians: DispatchTechnician[];
  onJobAssign?: (jobId: string, technicianId: string) => void;
  onJobUnassign?: (jobId: string) => void;
  isLoading?: boolean;
  className?: string;
}

const DragDropDispatch: React.FC<DragDropDispatchProps> = ({
  jobs,
  technicians,
  onJobAssign,
  onJobUnassign,
  isLoading = false,
  className = '',
}) => {
  const { addNotification } = useUIStore();
  const [localJobs, setLocalJobs] = useState<DispatchJob[]>(jobs);
  const [techs, setTechs] = useState<DispatchTechnician[]>(technicians);

  useEffect(() => {
    setLocalJobs(jobs);
  }, [jobs]);

  useEffect(() => {
    setTechs(technicians);
  }, [technicians]);

  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const jobId = draggableId;
    const sourceTechId = source.droppableId === 'unassigned' ? null : source.droppableId;
    const destTechId = destination.droppableId === 'unassigned' ? null : destination.droppableId;

    if (sourceTechId === destTechId) return;

    const job = localJobs.find((j) => j.id === jobId) || techs.flatMap((t) => t.jobs).find((j) => j.id === jobId);
    if (!job) return;

    setLocalJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, status: destTechId ? 'assigned' : 'unassigned', assignedTechnician: destTechId || undefined }
          : j
      )
    );

    setTechs((prevTechs) => {
      let updated = prevTechs.map((tech) => {
        if (tech.id === sourceTechId) {
          return {
            ...tech,
            jobs: tech.jobs.filter((j) => j.id !== jobId),
            workload: Math.max(0, tech.workload - job.duration),
          };
        }
        return tech;
      });

      if (destTechId) {
        updated = updated.map((tech) =>
          tech.id === destTechId
            ? {
                ...tech,
                jobs: [...tech.jobs.filter((j) => j.id !== jobId), job],
                workload: tech.workload + job.duration,
              }
            : tech
        );
      }

      return updated;
    });

    if (destTechId) {
      onJobAssign?.(jobId, destTechId);
      const techName = (techs.find(t => t.id === destTechId)?.name) || destTechId;
      addNotification({
        title: 'Job assigned',
        message: `${job.title} assigned to ${techName}`,
        type: 'success',
        isRead: false,
      });
    } else {
      onJobUnassign?.(jobId);
      addNotification({
        title: 'Job unassigned',
        message: `${job.title} moved to Unassigned`,
        type: 'warning',
        isRead: false,
      });
    }
  }, [jobs, onJobAssign, onJobUnassign, addNotification, techs]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getWorkloadColor = (workload: number, maxCapacity: number) => {
    const percentage = (workload / maxCapacity) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const canAcceptJob = (tech: Technician, job: Job) => {
    const hasSkills = job.skills.some(skill => tech.skills.includes(skill));
    const hasCapacity = tech.workload + job.duration <= tech.maxCapacity;
    return hasSkills && hasCapacity;
  };

  const JobCard = ({ job, index }: { job: DispatchJob; index: number }) => (
    <Draggable draggableId={job.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-3 bg-white border rounded-xl shadow-sm transition-all ${
            snapshot.isDragging ? 'shadow-lg rotate-2 scale-105' : 'hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900 text-sm">{job.title}</h4>
            <Badge className={`text-xs ${getPriorityColor(job.priority)}`}>
              {job.priority}
            </Badge>
          </div>
          <p className="text-xs text-gray-600 mb-2">{job.client}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{job.duration}h</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{job.location}</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {job.skills.map(skill => (
              <span key={skill} className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-700 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </Draggable>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 relative ${className}`}>
        {/* Unassigned Jobs */}
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900">Unassigned Jobs</h3>
            <Badge className="bg-orange-100 text-orange-800">
              {localJobs.filter(j => j.status === 'unassigned').length}
            </Badge>
          </div>
          
          <Droppable droppableId="unassigned">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`space-y-3 min-h-[200px] p-2 rounded-xl transition-colors ${
                  snapshot.isDraggingOver ? 'bg-orange-50 border-2 border-dashed border-orange-300' : ''
                }`}
              >
                {localJobs
                  .filter(job => job.status === 'unassigned')
                  .map((job, index) => (
                    <JobCard key={job.id} job={job} index={index} />
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Card>

        {/* Technicians */}
        {techs.map((tech) => (
          <Card key={tech.id} className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={tech.avatar || 'https://via.placeholder.com/40'}
                alt={tech.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{tech.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getWorkloadColor(tech.workload, tech.maxCapacity)}`}
                      style={{ width: `${Math.min(100, (tech.workload / tech.maxCapacity) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">
                    {tech.workload}/{tech.maxCapacity}h
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {tech.skills.map(skill => (
                  <span key={skill} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <Droppable droppableId={tech.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-3 min-h-[200px] p-2 rounded-xl transition-colors ${
                    snapshot.isDraggingOver 
                      ? tech.workload >= tech.maxCapacity
                        ? 'bg-red-50 border-2 border-dashed border-red-300'
                        : 'bg-green-50 border-2 border-dashed border-green-300'
                      : ''
                  }`}
                >
                  {tech.jobs.map((job, index) => (
                    <JobCard key={job.id} job={job} index={index} />
                  ))}
                  {provided.placeholder}
                  
                  {tech.jobs.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Drop jobs here</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </Card>
        ))}

        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <span className="text-sm font-medium text-gray-600">Syncing assignments...</span>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default DragDropDispatch;