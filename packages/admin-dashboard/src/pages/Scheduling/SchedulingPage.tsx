import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Grid, 
  User, 
  RotateCcw,
  Plus,
  Filter,
  Download,
  Clock,
  MapPin,
  Users,
  CheckCircle
} from 'lucide-react';
import { ScheduleEvent, RecurringJob } from '@/types';
import { mockScheduleEvents, mockRecurringJobs, getScheduleStats } from '@/mocks/schedules';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CalendarView from '@/components/Scheduling/CalendarView';
import ScheduleGrid from '@/components/Scheduling/ScheduleGrid';
import TechnicianSchedule from '@/components/Scheduling/TechnicianSchedule';
import RecurringJobsManager from '@/components/Scheduling/RecurringJobsManager';
import SmartMatchPanel from '@/components/Scheduling/SmartMatchPanel';
import AIScheduler from '@/components/Scheduling/AIScheduler';
import DragDropDispatch from '@/components/Scheduling/DragDropDispatch';
import WorkloadOptimizer from '@/components/Scheduling/WorkloadOptimizer';
import { mockTechnicians } from '@/mocks/jobs';

type ViewMode = 'calendar' | 'grid' | 'technician' | 'recurring' | 'ai' | 'dispatch' | 'workload';

const SchedulingPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<string>('');
  const [showSmart, setShowSmart] = useState<boolean>(false);

  const stats = getScheduleStats();

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    console.log('Event clicked:', event);
  };

  const handleAddEvent = (technicianId?: string, date?: Date) => {
    console.log('Add event for technician:', technicianId, 'on date:', date);
  };

  const handleEditRecurringJob = (job: RecurringJob) => {
    console.log('Edit recurring job:', job);
  };

  const handleDeleteRecurringJob = (jobId: string) => {
    console.log('Delete recurring job:', jobId);
  };

  const handleToggleRecurringJob = (jobId: string) => {
    console.log('Toggle recurring job:', jobId);
  };

  const handleAddRecurringJob = () => {
    console.log('Add recurring job');
  };

  const viewOptions = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'grid', label: 'Grid', icon: Grid },
    { id: 'technician', label: 'Technician', icon: User },
    { id: 'recurring', label: 'Recurring', icon: RotateCcw },
    { id: 'ai', label: 'AI Scheduler', icon: Users },
    { id: 'dispatch', label: 'Dispatch', icon: MapPin },
    { id: 'workload', label: 'Workload', icon: CheckCircle },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Scheduling & Calendar
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage schedules, track availability, and automate recurring jobs
            </p>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button variant="secondary" size="sm" icon={Download} className="hidden sm:flex">
              Export
            </Button>
            <Button variant="secondary" size="sm" icon={Download} className="sm:hidden p-2">
              <span className="sr-only">Export</span>
            </Button>
            <Button variant="secondary" size="sm" icon={Users} onClick={() => setShowSmart(true)}>
              Smart Match
            </Button>
            <Button variant="primary" icon={Plus} className="flex-1 sm:flex-none">
              <span className="hidden sm:inline">Add Event</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
      >
        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-xl" style={{ backgroundColor: '#F3F0FF' }}>
              <Calendar className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#8552C5' }} />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-600">{stats.scheduled}</p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-lg sm:text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
            </div>
            <div className="p-2 sm:p-3 bg-yellow-100 rounded-xl">
              <Users className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Completed</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* View Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-0">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {viewOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setViewMode(option.id as ViewMode)}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  viewMode === option.id
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={viewMode === option.id ? { backgroundColor: '#F3F0FF' } : {}}
              >
                <option.icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{option.label}</span>
                <span className="sm:hidden">{option.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {viewMode === 'calendar' && (
          <CalendarView
            events={mockScheduleEvents}
            onEventClick={handleEventClick}
            onEventSelect={handleEventClick}
            onDateSelect={(date) => handleAddEvent(undefined, date)}
          />
        )}

        {viewMode === 'grid' && (
          <ScheduleGrid
            events={mockScheduleEvents}
            onEventClick={handleEventClick}
            onAddEvent={handleAddEvent}
          />
        )}

        {viewMode === 'technician' && (
          <TechnicianSchedule
            events={mockScheduleEvents}
            selectedTechnician={selectedTechnician}
            onTechnicianSelect={setSelectedTechnician}
            onEventClick={handleEventClick}
            onAddEvent={handleAddEvent}
          />
        )}

        {viewMode === 'recurring' && (
          <RecurringJobsManager
            recurringJobs={mockRecurringJobs}
            onEdit={handleEditRecurringJob}
            onDelete={handleDeleteRecurringJob}
            onToggle={handleToggleRecurringJob}
            onAdd={handleAddRecurringJob}
          />
        )}

        {viewMode === 'ai' && (
          <AIScheduler
            jobType="HVAC Maintenance"
            duration={2}
            location="Downtown Office"
            priority="high"
            onSelectSlot={(slot) => console.log('Selected slot:', slot)}
          />
        )}

        {viewMode === 'dispatch' && (
          <DragDropDispatch
            onJobAssign={(jobId, techId) => console.log('Assigned job:', jobId, 'to:', techId)}
            onJobUnassign={(jobId) => console.log('Unassigned job:', jobId)}
          />
        )}

        {viewMode === 'workload' && (
          <WorkloadOptimizer />
        )}
      </motion.div>

      {showSmart && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl mx-4">
            <SmartMatchPanel technicians={mockTechnicians as any} job={selectedEvent as any} onAssign={(id) => { setShowSmart(false); console.log('assign', id); }} onClose={() => setShowSmart(false)} />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SchedulingPage;
