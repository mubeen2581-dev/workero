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
import { CalendarSyncService } from '@/services/calendarSync';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { toast } from 'react-toastify';

type ViewMode = 'calendar' | 'grid' | 'technician' | 'recurring' | 'ai' | 'dispatch' | 'workload';

const SchedulingPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<string>('');
  const [showSmart, setShowSmart] = useState<boolean>(false);
  const [showAddEventModal, setShowAddEventModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTechnicianForEvent, setSelectedTechnicianForEvent] = useState<string>('');

  const stats = getScheduleStats();

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
  };

  const handleAddEvent = (technicianId?: string, date?: Date) => {
    setSelectedTechnicianForEvent(technicianId || '');
    setSelectedDate(date || new Date());
    setShowAddEventModal(true);
  };

  const handleEditRecurringJob = (job: RecurringJob) => {
    // TODO: Implement edit recurring job
    toast.info(`Edit recurring job: ${job.title || job.id}`);
  };

  const handleDeleteRecurringJob = (jobId: string) => {
    // TODO: Implement delete recurring job
    if (window.confirm('Are you sure you want to delete this recurring job?')) {
      toast.success('Recurring job deleted');
    }
  };

  const handleToggleRecurringJob = (jobId: string) => {
    // TODO: Implement toggle recurring job
    toast.success('Recurring job status updated');
  };

  const handleAddRecurringJob = () => {
    // TODO: Implement add recurring job
    toast.info('Add recurring job feature coming soon');
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
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => {
                const conn = await CalendarSyncService.connect();
                if (conn.success) {
                  toast.success(conn.message);
                  const result = await CalendarSyncService.syncPush();
                  toast.success(result.message);
                } else {
                  toast.error(conn.message);
                }
              }}
            >
              Sync Google Calendar
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
            <SmartMatchPanel technicians={mockTechnicians as any} job={selectedEvent as any} onAssign={(id) => { setShowSmart(false); toast.success(`Assigned to technician: ${id}`); }} onClose={() => setShowSmart(false)} />
          </div>
        </motion.div>
      )}

      {/* Add Event Modal */}
      {showAddEventModal && (
        <Modal
          isOpen={showAddEventModal}
          onClose={() => {
            setShowAddEventModal(false);
            setSelectedDate(null);
            setSelectedTechnicianForEvent('');
          }}
          title="Add New Event"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Event creation feature coming soon. This will allow you to create new schedule events.
            </p>
            {selectedDate && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selected Date & Time
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedDate.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            )}
            {selectedTechnicianForEvent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Technician
                </label>
                <p className="text-gray-900">{selectedTechnicianForEvent}</p>
              </div>
            )}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowAddEventModal(false);
                  setSelectedDate(null);
                  setSelectedTechnicianForEvent('');
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SchedulingPage;
