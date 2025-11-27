import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter, 
  Download,
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin
} from 'lucide-react';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ScheduleEvent } from '@/types';
import { mockScheduleEvents } from '@/mocks/schedules';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Badge from '../ui/Badge';

const localizer = momentLocalizer(moment);

interface CalendarViewProps {
  events?: ScheduleEvent[];
  stats?: {
    total: number;
    scheduled: number;
    inProgress: number;
    completed: number;
  };
  isLoading?: boolean;
  onRangeChange?: (range: { start: Date; end: Date }) => void;
  onEventClick?: (event: ScheduleEvent) => void;
  onEventSelect?: (event: ScheduleEvent) => void;
  onDateSelect?: (date: Date) => void;
  onEventDrop?: (event: ScheduleEvent, newStart: Date, newEnd: Date) => void;
  onEventResize?: (event: ScheduleEvent, newStart: Date, newEnd: Date) => void;
  className?: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  events = mockScheduleEvents,
  stats,
  isLoading = false,
  onRangeChange,
  onEventClick,
  onEventSelect,
  onDateSelect,
  onEventDrop,
  onEventResize,
  className = '',
}) => {
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [date, setDate] = useState(new Date());
  const [technicianFilter, setTechnicianFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'>('');
  const [typeFilter, setTypeFilter] = useState<'' | 'job' | 'break' | 'training' | 'maintenance' | 'meeting'>('');
  const [priorityFilter, setPriorityFilter] = useState<'' | 'low' | 'medium' | 'high' | 'urgent'>('');
  const [teamFilter, setTeamFilter] = useState<string>('');
  const [regionFilter, setRegionFilter] = useState<string>('');

  const derivedTechnicians = useMemo(() => {
    const map = new Map<string, { value: string; label: string; team?: string; region?: string }>();
    events.forEach(event => {
      if (event.technicianId) {
        const label =
          event.technician?.full_name ||
          event.technician?.name ||
          `${event.technician?.first_name || ''} ${event.technician?.last_name || ''}`.trim() ||
          'Technician';
        map.set(event.technicianId, {
          value: event.technicianId,
          label,
          team: event.technician?.team,
          region: event.technician?.region,
        });
      }
    });
    return Array.from(map.values());
  }, [events]);

  const technicianOptions = [
    { value: '', label: 'All Technicians' },
    ...(derivedTechnicians.length > 0
      ? derivedTechnicians.map((tech) => ({ value: tech.value, label: tech.label }))
      : []),
  ];

  const teams = useMemo(() => {
    const set = new Set<string>();
    events.forEach(event => {
      if (event.technician?.team) {
        set.add(event.technician.team);
      }
    });
    return Array.from(set);
  }, [events]);

  const regions = useMemo(() => {
    const set = new Set<string>();
    events.forEach(event => {
      if (event.technician?.region) {
        set.add(event.technician.region);
      }
    });
    return Array.from(set);
  }, [events]);

  // Initialize filters from URL once
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTechnicianFilter(params.get('tech') || '');
    setStatusFilter((params.get('status') as any) || '');
    setTypeFilter((params.get('type') as any) || '');
    setPriorityFilter((params.get('prio') as any) || '');
    setTeamFilter(params.get('team') || '');
    setRegionFilter(params.get('region') || '');
  }, []);

  // Persist filters to URL on change
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const setOrDelete = (key: string, value: string) => {
      if (value) params.set(key, value); else params.delete(key);
    };
    setOrDelete('tech', technicianFilter);
    setOrDelete('status', statusFilter);
    setOrDelete('type', typeFilter);
    setOrDelete('prio', priorityFilter);
    setOrDelete('team', teamFilter);
    setOrDelete('region', regionFilter);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [technicianFilter, statusFilter, typeFilter, priorityFilter, teamFilter, regionFilter]);

  // Filter events by technician, status and type
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchTech = technicianFilter ? event.technicianId === technicianFilter : true;
      const matchStatus = statusFilter ? event.status === statusFilter : true;
      const matchType = typeFilter ? event.type === typeFilter : true;
      const matchTeam = teamFilter ? event.technician?.team === teamFilter : true;
      const matchRegion = regionFilter ? event.technician?.region === regionFilter : true;
      const matchPriority = priorityFilter ? event.priority === priorityFilter : true;
      return matchTech && matchStatus && matchType && matchTeam && matchRegion && matchPriority;
    });
  }, [events, technicianFilter, statusFilter, typeFilter, teamFilter, regionFilter, priorityFilter]);

  const computedStats = useMemo(() => {
    return {
      total: events.length,
      scheduled: events.filter((event) => event.status === 'scheduled').length,
      inProgress: events.filter((event) => event.status === 'in_progress').length,
      completed: events.filter((event) => event.status === 'completed').length,
    };
  }, [events]);

  const summaryStats = stats || computedStats;

  const eventStyleGetter = (event: ScheduleEvent) => {
    const colorMap: Record<string, string> = {
      scheduled: '#3B82F6',
      in_progress: '#F59E0B',
      completed: '#10B981',
      cancelled: '#EF4444',
    };

    return {
      style: {
        backgroundColor: colorMap[event.status] || '#6B7280',
        borderRadius: '6px',
        opacity: 0.8,
        color: 'white',
        border: 'none',
        fontSize: '12px',
        fontWeight: '500',
      },
    };
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: 'month' | 'week' | 'day' | 'agenda') => {
    setView(newView);
  };

  const handleSelectEvent = (event: ScheduleEvent) => {
    onEventClick?.(event);
  };

  const handleSelectSlot = (slotInfo: any) => {
    // Only trigger onDateSelect if explicitly clicking on an empty slot
    // This allows users to click on calendar cells to add events
    if (slotInfo && slotInfo.start) {
      onDateSelect?.(slotInfo.start);
    }
  };

  const handleEventDrop = ({ event, start, end }: { event: ScheduleEvent; start: Date; end: Date }) => {
    if (onEventDrop) {
      onEventDrop(event, start, end);
    }
  };

  const handleEventResize = ({ event, start, end }: { event: ScheduleEvent; start: Date; end: Date }) => {
    if (onEventResize) {
      onEventResize(event, start, end);
    }
  };

  const CustomToolbar = ({ label, onNavigate, onView }: any) => (
    <div className="flex flex-col space-y-3 p-4 border-b border-gray-200">
      {/* Top row: Date and Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">{label}</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('PREV')}
              className="p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('TODAY')}
              className="px-3 py-1 text-sm"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('NEXT')}
              className="p-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* View Toggle and Add Event - Always on the right */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={view === 'month' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onView('month')}
              className="px-3 py-1 text-xs"
            >
              Month
            </Button>
            <Button
              variant={view === 'week' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onView('week')}
              className="px-3 py-1 text-xs"
            >
              Week
            </Button>
            <Button
              variant={view === 'day' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onView('day')}
              className="px-3 py-1 text-xs"
            >
              Day
            </Button>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            icon={Plus}
            onClick={() => onDateSelect?.(date)}
            className="flex-shrink-0"
          >
            <span className="hidden sm:inline">Add Event</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>
      
      {/* Bottom row: Filters - Scrollable */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <Select
          options={technicianOptions}
          value={technicianFilter || ''}
          onChange={(v) => setTechnicianFilter(v)}
          className="w-40 flex-shrink-0"
        />
        <Select
          options={[
            { value: '', label: 'All Priorities' },
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'urgent', label: 'Urgent' },
          ]}
          value={priorityFilter || ''}
          onChange={(v) => setPriorityFilter(v as any)}
          className="w-40 flex-shrink-0"
        />
        <Select
          options={[{ value: '', label: 'All Teams' }, ...teams.map(t => ({ value: t, label: t }))]}
          value={teamFilter || ''}
          onChange={(v) => setTeamFilter(v)}
          className="w-40 flex-shrink-0"
        />
        <Select
          options={[{ value: '', label: 'All Regions' }, ...regions.map(r => ({ value: r, label: r }))]}
          value={regionFilter || ''}
          onChange={(v) => setRegionFilter(v)}
          className="w-40 flex-shrink-0"
        />
        <Select
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'scheduled', label: 'Scheduled' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
          value={statusFilter || ''}
          onChange={(v) => setStatusFilter(v as any)}
          className="w-40 flex-shrink-0"
        />
        <Select
          options={[
            { value: '', label: 'All Types' },
            { value: 'job', label: 'Job' },
            { value: 'meeting', label: 'Meeting' },
            { value: 'training', label: 'Training' },
            { value: 'maintenance', label: 'Maintenance' },
            { value: 'break', label: 'Break' },
          ]}
          value={typeFilter || ''}
          onChange={(v) => setTypeFilter(v as any)}
          className="w-40 flex-shrink-0"
        />
      </div>
    </div>
  );

  const handleRangeChangeInternal = (range: any) => {
    if (!onRangeChange) return;
    if (Array.isArray(range) && range.length > 0) {
      onRangeChange({ start: range[0], end: range[range.length - 1] });
    } else if (range?.start && range?.end) {
      onRangeChange({ start: range.start, end: range.end });
    }
  };

  const EventComponent = ({ event }: { event: ScheduleEvent }) => (
    <div className="p-1">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-medium truncate">{event.title}</div>
        {event.priority && (
          <Badge className={`text-[10px] ${
            event.priority === 'urgent' ? 'bg-red-100 text-red-800' :
            event.priority === 'high' ? 'bg-orange-100 text-orange-800' :
            event.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {event.priority}
          </Badge>
        )}
      </div>
      <div className="text-xs opacity-75 truncate">{event.location}</div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {/* Priority Legend */}
      <div className="flex items-center gap-2 mb-3">
        {[
          { v: '', label: 'All', cls: 'bg-gray-100 text-gray-800' },
          { v: 'low', label: 'Low', cls: 'bg-gray-100 text-gray-800' },
          { v: 'medium', label: 'Medium', cls: 'bg-blue-100 text-blue-800' },
          { v: 'high', label: 'High', cls: 'bg-orange-100 text-orange-800' },
          { v: 'urgent', label: 'Urgent', cls: 'bg-red-100 text-red-800' },
        ].map((p) => (
          <button
            key={p.v}
            onClick={() => setPriorityFilter(p.v as any)}
            className={`px-2 py-1 rounded text-xs border ${priorityFilter === p.v ? 'border-gray-400' : 'border-transparent'} ${p.cls}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.total}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-xl">
              <CalendarIcon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">{summaryStats.scheduled}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{summaryStats.inProgress}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <User className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{summaryStats.completed}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Calendar */}
      <Card className="p-0 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">Loading events...</span>
          </div>
        )}
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          view={view}
          date={date}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onEventDrop={onEventDrop ? handleEventDrop : undefined}
          onEventResize={onEventResize ? handleEventResize : undefined}
          selectable={true}
          selectableRows={true}
          resizable={!!onEventResize}
          draggableAccessor={() => true}
          onRangeChange={handleRangeChangeInternal}
          components={{
            toolbar: CustomToolbar,
            event: EventComponent,
          }}
          eventPropGetter={eventStyleGetter}
          popup
          showMultiDayTimes
          step={30}
          timeslots={2}
        />
      </Card>
    </motion.div>
  );
};

export default CalendarView;
