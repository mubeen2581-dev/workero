import React, { useMemo, useState } from 'react';
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
  CheckCircle,
  CalendarPlus
} from 'lucide-react';
import { ScheduleEvent, RecurringSchedule } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CalendarView from '@/components/Scheduling/CalendarView';
import ScheduleGrid from '@/components/Scheduling/ScheduleGrid';
import TechnicianSchedule from '@/components/Scheduling/TechnicianSchedule';
import RecurringJobsManager from '@/components/Scheduling/RecurringJobsManager';
import ScheduleEventModal, { ScheduleEventFormValues } from '@/components/Scheduling/ScheduleEventModal';
import RecurringScheduleModal, { RecurringScheduleFormValues } from '@/components/Scheduling/RecurringScheduleModal';
import SmartMatchPanel from '@/components/Scheduling/SmartMatchPanel';
import AIScheduler from '@/components/Scheduling/AIScheduler';
import DragDropDispatch, { DispatchJob, DispatchTechnician } from '@/components/Scheduling/DragDropDispatch';
import WorkloadOptimizer from '@/components/Scheduling/WorkloadOptimizer';
import TravelTimeEstimator from '@/components/Scheduling/TravelTimeEstimator';
import CalendarSyncStatus from '@/components/Scheduling/CalendarSyncStatus';
import RouteVisualizer from '@/components/Scheduling/RouteVisualizer';
import { CalendarSyncService } from '@/services/calendarSync';
import { toast } from 'react-toastify';
import {
  useScheduleEvents,
  useRecurringSchedules,
  useCreateRecurringSchedule,
  useUpdateRecurringSchedule,
  useDeleteRecurringSchedule,
  useGenerateRecurringSchedule,
  useCreateScheduleEvent,
  useUpdateScheduleEvent,
  useDeleteScheduleEvent,
} from '@/services/scheduleQueries';
import { useJobs, useAssignJob, useUpdateJob } from '@/services/jobQueries';
import { UpdateJobRequest } from '@/services/jobs';
import { useTechnicians } from '@/services/userQueries';
import { ScheduleService } from '@/services/schedule';
import { startOfMonth, endOfMonth } from 'date-fns';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

type ViewMode = 'calendar' | 'grid' | 'technician' | 'recurring' | 'ai' | 'dispatch' | 'workload' | 'route';

const SchedulingPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<string>('');
  const [showSmart, setShowSmart] = useState<boolean>(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState<boolean>(false);
  const [eventModalMode, setEventModalMode] = useState<'create' | 'edit'>('create');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTechnicianForEvent, setSelectedTechnicianForEvent] = useState<string>('');
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [recurringModalMode, setRecurringModalMode] = useState<'create' | 'edit'>('create');
  const [selectedRecurring, setSelectedRecurring] = useState<RecurringSchedule | null>(null);
  const [calendarRange, setCalendarRange] = useState<{ start: Date; end: Date }>(() => ({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  }));
  const [isDownloadingIcs, setIsDownloadingIcs] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle OAuth callback
  useEffect(() => {
    const connected = searchParams.get('calendar_connected');
    const error = searchParams.get('calendar_error');

    if (connected === 'true') {
      toast.success('Google Calendar connected successfully!');
      setSearchParams({}, { replace: true });
    } else if (error) {
      toast.error(`Calendar connection failed: ${decodeURIComponent(error)}`);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const eventsQuery = useScheduleEvents({
    start: calendarRange.start.toISOString(),
    end: calendarRange.end.toISOString(),
  });
  const events = eventsQuery.data ?? [];

  const stats = useMemo(() => {
    return {
      total: events.length,
      scheduled: events.filter((event) => event.status === 'scheduled').length,
      inProgress: events.filter((event) => event.status === 'in_progress').length,
      completed: events.filter((event) => event.status === 'completed').length,
    };
  }, [events]);

  const recurringQuery = useRecurringSchedules();
  const recurringSchedules = recurringQuery.data ?? [];
  const createRecurringMutation = useCreateRecurringSchedule();
  const updateRecurringMutation = useUpdateRecurringSchedule();
  const deleteRecurringMutation = useDeleteRecurringSchedule();
  const generateRecurringMutation = useGenerateRecurringSchedule();
  const createEventMutation = useCreateScheduleEvent();
  const updateEventMutation = useUpdateScheduleEvent();
  const deleteEventMutation = useDeleteScheduleEvent();
  const jobsQuery = useJobs({ per_page: 100 });
  const jobsData = jobsQuery.data ?? [];
  const techniciansQuery = useTechnicians();
  const techniciansData = techniciansQuery.data ?? [];
  const assignJobMutation = useAssignJob();
  const unassignJobMutation = useUpdateJob();

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setEventModalMode('edit');
    setSelectedTechnicianForEvent(event.technicianId || '');
    setIsEventModalOpen(true);
  };

  const handleAddEvent = (technicianId?: string, date?: Date) => {
    setSelectedTechnicianForEvent(technicianId || '');
    setSelectedDate(date || new Date());
    setSelectedEvent(null);
    setEventModalMode('create');
    setIsEventModalOpen(true);
  };

  const handleEditRecurringJob = (job: RecurringSchedule) => {
    setSelectedRecurring(job);
    setRecurringModalMode('edit');
    setIsRecurringModalOpen(true);
  };

  const handleDeleteRecurringJob = (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this recurring job?')) {
      deleteRecurringMutation.mutate({ id: jobId });
    }
  };

  const handleToggleRecurringJob = (job: RecurringSchedule) => {
    const nextStatus = job.status === 'active' ? 'paused' : 'active';
    updateRecurringMutation.mutate({
      id: job.id,
      data: { status: nextStatus },
    });
  };

  const handleGenerateRecurringJob = (jobId: string) => {
    generateRecurringMutation.mutate({ id: jobId });
  };

  const handleAddRecurringJob = () => {
    setSelectedRecurring(null);
    setRecurringModalMode('create');
    setIsRecurringModalOpen(true);
  };

  const closeEventModal = () => {
    setIsEventModalOpen(false);
    setSelectedDate(null);
    setSelectedTechnicianForEvent('');
    if (eventModalMode === 'create') {
      setSelectedEvent(null);
    }
  };

  const handleEventModalSubmit = async (values: ScheduleEventFormValues) => {
    const payload = {
      title: values.title,
      description: values.description,
      status: values.status,
      type: values.type,
      priority: values.priority,
      location: values.location,
      technician_id: values.technicianId || undefined,
      start: values.start.toISOString(),
      end: values.end.toISOString(),
    };

    if (eventModalMode === 'edit' && selectedEvent) {
      await updateEventMutation.mutateAsync({ id: selectedEvent.id, data: payload });
    } else {
      await createEventMutation.mutateAsync(payload);
    }

    closeEventModal();
  };

  const handleEventDelete = async () => {
    if (!selectedEvent) return;
    await deleteEventMutation.mutateAsync(selectedEvent.id);
    closeEventModal();
    setSelectedEvent(null);
  };

  const closeRecurringModal = () => {
    setIsRecurringModalOpen(false);
    setSelectedRecurring(null);
  };

  const handleRecurringSubmit = async (values: RecurringScheduleFormValues) => {
    const payload = {
      job_id: values.jobId || undefined,
      technician_id: values.technicianId || undefined,
      frequency: values.frequency,
      interval: values.interval,
      weekdays: values.frequency === 'weekly' ? values.weekdays : undefined,
      month_day: values.frequency === 'monthly' ? values.monthDay : undefined,
      start_date: values.startDate.toISOString(),
      end_date: values.endDate ? values.endDate.toISOString() : undefined,
      timezone: values.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      duration_minutes: values.durationMinutes,
      title: values.title,
      description: values.description,
      priority: values.priority,
      location: values.location,
      color: values.color,
      custom_dates: values.frequency === 'custom' ? values.customDates : undefined,
    };

    if (recurringModalMode === 'edit' && selectedRecurring) {
      await updateRecurringMutation.mutateAsync({ id: selectedRecurring.id, data: payload });
    } else {
      await createRecurringMutation.mutateAsync(payload);
    }

    closeRecurringModal();
  };

  const handleRecurringDelete = async () => {
    if (!selectedRecurring) return;
    await deleteRecurringMutation.mutateAsync({ id: selectedRecurring.id });
    closeRecurringModal();
  };

  const dispatchJobs: DispatchJob[] = useMemo(() => {
    return jobsData.map((job) => ({
      id: job.id,
      title: job.title,
      client: job.client?.name || 'Client',
      duration: Number(job.estimatedDuration ?? job.actualDuration ?? 1),
      priority: job.priority ?? 'medium',
      location:
        (job.location as any)?.address ||
        job.client?.address?.city ||
        job.client?.address?.street ||
        'N/A',
      skills: job.materials?.map((m) => m.category || m.name || 'General') || [],
      status: job.assignedTechnician ? 'assigned' : 'unassigned',
      assignedTechnician: job.assignedTechnician,
    }));
  }, [jobsData]);

  const dispatchTechnicians: DispatchTechnician[] = useMemo(() => {
    return techniciansData.map((tech) => {
      const assignedJobs = dispatchJobs.filter((job) => job.assignedTechnician === tech.id);
      const workload = assignedJobs.reduce((sum, job) => sum + job.duration, 0);
      return {
        id: tech.id,
        name: `${tech.firstName} ${tech.lastName}`.trim() || tech.email,
        avatar: tech.avatar,
        skills: tech.skills || [],
        workload,
        maxCapacity: 8,
        jobs: assignedJobs,
      };
    });
  }, [techniciansData, dispatchJobs]);

  const handleDispatchAssign = async (jobId: string, technicianId: string) => {
    await assignJobMutation.mutateAsync({
      id: jobId,
      data: { assigned_technician: technicianId },
    });
  };

  const handleDispatchUnassign = async (jobId: string) => {
    const payload: UpdateJobRequest = { assigned_technician: null };
    await unassignJobMutation.mutateAsync({
      id: jobId,
      data: payload,
    });
  };

  const handleDownloadIcs = async () => {
    setIsDownloadingIcs(true);
    try {
      const blob = await ScheduleService.downloadICal({
        start: calendarRange.start.toISOString(),
        end: calendarRange.end.toISOString(),
      });
      const fileBlob = blob instanceof Blob ? blob : new Blob([blob]);
      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `workero-schedule-${calendarRange.start.toISOString().slice(0, 10)}.ics`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('ICS calendar exported successfully.');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Unable to export ICS calendar.';
      toast.error(message);
    } finally {
      setIsDownloadingIcs(false);
    }
  };

  const viewOptions = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'grid', label: 'Grid', icon: Grid },
    { id: 'technician', label: 'Technician', icon: User },
    { id: 'recurring', label: 'Recurring', icon: RotateCcw },
    { id: 'ai', label: 'AI Scheduler', icon: Users },
    { id: 'dispatch', label: 'Dispatch', icon: MapPin },
    { id: 'workload', label: 'Workload', icon: CheckCircle },
    { id: 'route', label: 'Route Planner', icon: MapPin },
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
                const status = await CalendarSyncService.getStatus();
                if (status.connected) {
                  const result = await CalendarSyncService.syncPush({
                    start: calendarRange.start.toISOString(),
                    end: calendarRange.end.toISOString(),
                  });
                  if (result.success) {
                  toast.success(result.message);
                    // Refresh events after sync
                    eventsQuery.refetch();
                  } else {
                    toast.error(result.message);
                  }
                } else {
                  await CalendarSyncService.connect();
                }
              }}
            >
              Sync Google Calendar
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={CalendarPlus}
              onClick={handleDownloadIcs}
              disabled={isDownloadingIcs}
            >
              {isDownloadingIcs ? 'Preparing ICS...' : 'Download ICS'}
            </Button>
            <Button variant="secondary" size="sm" icon={Users} onClick={() => setShowSmart(true)}>
              Smart Match
            </Button>
            <Button
              variant="primary"
              icon={Plus}
              className="flex-1 sm:flex-none"
              onClick={() => handleAddEvent()}
            >
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-2"
        >
          <TravelTimeEstimator />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CalendarSyncStatus
            onSyncPush={() => {
              eventsQuery.refetch();
            }}
            onSyncPull={() => {
              eventsQuery.refetch();
            }}
            onDisconnect={() => {
              eventsQuery.refetch();
            }}
          />
        </motion.div>
      </div>

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
            events={events}
            stats={stats}
            isLoading={eventsQuery.isLoading}
            onEventClick={handleEventClick}
            onEventSelect={handleEventClick}
            onDateSelect={(date) => handleAddEvent(undefined, date)}
            onEventDrop={async (event, newStart, newEnd) => {
              try {
                await updateEventMutation.mutateAsync({
                  id: event.id,
                  data: {
                    start: newStart.toISOString(),
                    end: newEnd.toISOString(),
                  },
                });
                toast.success('Event rescheduled successfully');
              } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to reschedule event');
              }
            }}
            onEventResize={async (event, newStart, newEnd) => {
              try {
                await updateEventMutation.mutateAsync({
                  id: event.id,
                  data: {
                    start: newStart.toISOString(),
                    end: newEnd.toISOString(),
                  },
                });
                toast.success('Event duration updated successfully');
              } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to update event duration');
              }
            }}
            onRangeChange={(range) => {
              if (range?.start && range?.end) {
                setCalendarRange(range);
              }
            }}
          />
        )}

        {viewMode === 'grid' && (
          <ScheduleGrid
            events={events}
            onEventClick={handleEventClick}
            onAddEvent={handleAddEvent}
          />
        )}

        {viewMode === 'technician' && (
          <TechnicianSchedule
            events={events}
            selectedTechnician={selectedTechnician}
            onTechnicianSelect={setSelectedTechnician}
            onEventClick={handleEventClick}
            onAddEvent={handleAddEvent}
          />
        )}

        {viewMode === 'recurring' && (
          <RecurringJobsManager
            recurringJobs={recurringSchedules}
            isLoading={recurringQuery.isLoading}
            onEdit={handleEditRecurringJob}
            onDelete={handleDeleteRecurringJob}
            onToggle={handleToggleRecurringJob}
            onGenerate={handleGenerateRecurringJob}
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
            jobs={dispatchJobs}
            technicians={dispatchTechnicians}
            onJobAssign={handleDispatchAssign}
            onJobUnassign={handleDispatchUnassign}
            isLoading={
              jobsQuery.isLoading ||
              techniciansQuery.isLoading ||
              assignJobMutation.isPending ||
              unassignJobMutation.isPending
            }
          />
        )}

        {viewMode === 'workload' && (
          <WorkloadOptimizer />
        )}

        {viewMode === 'route' && (
          <RouteVisualizer />
        )}
      </motion.div>

      {showSmart && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl mx-4">
            <SmartMatchPanel
              technicians={techniciansData as any}
              job={selectedEvent as any}
              onAssign={async (id) => {
                const jobId = (selectedEvent as any)?.job?.id;
                if (!jobId) {
                  toast.error('No related job found for this event.');
                  return;
                }
                await handleDispatchAssign(jobId, id);
                toast.success('Job assigned successfully');
                setShowSmart(false);
              }}
              onClose={() => setShowSmart(false)}
            />
          </div>
        </motion.div>
      )}

      <ScheduleEventModal
        isOpen={isEventModalOpen}
        mode={eventModalMode}
        initialEvent={eventModalMode === 'edit' ? selectedEvent ?? undefined : undefined}
        defaultStart={eventModalMode === 'create' ? selectedDate ?? undefined : undefined}
        defaultTechnicianId={
          eventModalMode === 'create' ? selectedTechnicianForEvent || undefined : undefined
        }
        onClose={closeEventModal}
        onSubmit={handleEventModalSubmit}
        onDelete={eventModalMode === 'edit' ? handleEventDelete : undefined}
        isSubmitting={
          eventModalMode === 'edit' ? updateEventMutation.isPending : createEventMutation.isPending
        }
        isDeleting={deleteEventMutation.isPending}
      />

      <RecurringScheduleModal
        isOpen={isRecurringModalOpen}
        mode={recurringModalMode}
        initialSchedule={recurringModalMode === 'edit' ? selectedRecurring ?? undefined : undefined}
        onClose={closeRecurringModal}
        onSubmit={handleRecurringSubmit}
        onDelete={recurringModalMode === 'edit' ? handleRecurringDelete : undefined}
        isSubmitting={
          recurringModalMode === 'edit'
            ? updateRecurringMutation.isPending
            : createRecurringMutation.isPending
        }
        isDeleting={deleteRecurringMutation.isPending}
      />
    </div>
  );
};

export default SchedulingPage;
