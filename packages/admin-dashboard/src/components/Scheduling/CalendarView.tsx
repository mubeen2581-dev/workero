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
import { mockScheduleEvents, getScheduleStats } from '@/mocks/schedules';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Badge from '../ui/Badge';

const localizer = momentLocalizer(moment);

interface CalendarViewProps {
  events?: ScheduleEvent[];
  onEventClick?: (event: ScheduleEvent) => void;
  onEventSelect?: (event: ScheduleEvent) => void;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  events = mockScheduleEvents,
  onEventClick,
  onEventSelect,
  onDateSelect,
  className = '',
}) => {
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [date, setDate] = useState(new Date());
  const [technicianFilter, setTechnicianFilter] = useState<string>('');

  const technicianOptions = [
    { value: '', label: 'All Technicians' },
    { value: 'tech-1', label: 'Mike Smith' },
    { value: 'tech-2', label: 'Sarah Johnson' },
    { value: 'tech-3', label: 'David Wilson' },
    { value: 'tech-4', label: 'Lisa Brown' },
  ];

  // Filter events by technician
  const filteredEvents = useMemo(() => {
    if (!technicianFilter) return events;
    return events.filter(event => event.technicianId === technicianFilter);
  }, [events, technicianFilter]);

  const stats = getScheduleStats();

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
    onDateSelect?.(slotInfo.start);
  };

  const CustomToolbar = ({ label, onNavigate, onView }: any) => (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
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
      
      <div className="flex items-center space-x-3">
        <Select
          options={technicianOptions}
          value={technicianFilter}
          onChange={setTechnicianFilter}
          className="w-40"
        />
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
        <Button variant="secondary" size="sm" icon={Plus}>
          Add Event
        </Button>
      </div>
    </div>
  );

  const EventComponent = ({ event }: { event: ScheduleEvent }) => (
    <div className="p-1">
      <div className="text-xs font-medium truncate">{event.title}</div>
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
              <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
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
              <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
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
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Calendar */}
      <Card className="p-0 overflow-hidden">
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
          selectable
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
