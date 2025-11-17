import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  PauseCircle
} from 'lucide-react';
import { ScheduleEvent, User as Technician } from '@/types';
import { mockScheduleEvents, getTechnicianSchedule } from '@/mocks/schedules';
import { mockTechnicians } from '@/mocks/jobs';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Badge from '../ui/Badge';

interface TechnicianScheduleProps {
  events?: ScheduleEvent[];
  technicians?: Technician[];
  selectedTechnician?: string;
  onTechnicianSelect?: (technicianId: string) => void;
  onEventClick?: (event: ScheduleEvent) => void;
  onAddEvent?: (technicianId: string, date: Date) => void;
  className?: string;
}

const TechnicianSchedule: React.FC<TechnicianScheduleProps> = ({
  events = mockScheduleEvents,
  technicians = mockTechnicians,
  selectedTechnician,
  onTechnicianSelect,
  onEventClick,
  onAddEvent,
  className = '',
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [teamFilter, setTeamFilter] = useState<string>('');
  const [regionFilter, setRegionFilter] = useState<string>('');

  const filteredTechnicians = useMemo(() => {
    return technicians.filter(t => {
      const okTeam = teamFilter ? t.team === teamFilter : true;
      const okRegion = regionFilter ? t.region === regionFilter : true;
      return okTeam && okRegion;
    });
  }, [technicians, teamFilter, regionFilter]);

  const technicianOptions = filteredTechnicians.map(tech => ({
    value: tech.id,
    label: `${tech.firstName} ${tech.lastName}`,
  }));

  const selectedTech = (filteredTechnicians.find(tech => tech.id === selectedTechnician) || filteredTechnicians[0] || technicians[0]);

  // Get start and end of current week
  const getWeekStart = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const getWeekEnd = (date: Date) => {
    const end = new Date(date);
    end.setDate(date.getDate() - date.getDay() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  };

  const getDayStart = (date: Date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const getDayEnd = (date: Date) => {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
  };

  const weekStart = getWeekStart(currentDate);
  const weekEnd = getWeekEnd(currentDate);
  const dayStart = getDayStart(currentDate);
  const dayEnd = getDayEnd(currentDate);

  // Get technician's schedule
  const technicianSchedule = useMemo(() => {
    if (!selectedTech) return [];
    
    const startDate = viewMode === 'week' ? weekStart : dayStart;
    const endDate = viewMode === 'week' ? weekEnd : dayEnd;
    
    return getTechnicianSchedule(selectedTech.id, startDate, endDate);
  }, [selectedTech, currentDate, viewMode, weekStart, weekEnd, dayStart, dayEnd]);

  // Generate time slots (8 AM to 6 PM)
  const timeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = 8 + i;
    return {
      time: `${hour.toString().padStart(2, '0')}:00`,
      hour,
    };
  });

  // Generate date columns
  const dateColumns = useMemo(() => {
    if (viewMode === 'day') {
      return [currentDate];
    }
    
    const columns = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      columns.push(date);
    }
    return columns;
  }, [currentDate, weekStart, viewMode]);

  // Get events for each time slot
  const getEventsForSlot = (date: Date, hour: number) => {
    const slotStart = new Date(date);
    slotStart.setHours(hour, 0, 0, 0);
    
    const slotEnd = new Date(date);
    slotEnd.setHours(hour + 1, 0, 0, 0);

    return technicianSchedule.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      return eventStart < slotEnd && eventEnd > slotStart;
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setDate(currentDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  // Initialize from URL
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tech = params.get('tech');
    const team = params.get('team') || '';
    const region = params.get('region') || '';
    const vm = (params.get('tview') as 'week' | 'day') || 'week';
    const dateParam = params.get('tdate');

    if (tech && onTechnicianSelect) onTechnicianSelect(tech);
    setTeamFilter(team);
    setRegionFilter(region);
    setViewMode(vm);
    if (dateParam) {
      const d = new Date(dateParam);
      if (!isNaN(d.getTime())) setCurrentDate(d);
    }
  }, [onTechnicianSelect]);

  // Persist to URL
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const setOrDelete = (k: string, v: string) => { if (v) params.set(k, v); else params.delete(k); };
    setOrDelete('tech', selectedTechnician || '');
    setOrDelete('team', teamFilter);
    setOrDelete('region', regionFilter);
    setOrDelete('tview', viewMode);
    params.set('tdate', currentDate.toISOString());
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [selectedTechnician, teamFilter, regionFilter, viewMode, currentDate]);

  const getEventStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getEventStatusIcon = (status: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      scheduled: PlayCircle,
      in_progress: PauseCircle,
      completed: CheckCircle,
      cancelled: AlertCircle,
    };
    return iconMap[status] || PlayCircle;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getTotalHours = () => {
    return technicianSchedule.reduce((total, event) => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return total + duration;
    }, 0);
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
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Technician Schedule</h2>
          <Select
            options={technicianOptions}
            value={selectedTechnician || technicians[0]?.id}
            onChange={(techId) => onTechnicianSelect?.(techId)}
            className="w-full sm:w-48"
          />
          <Select
            options={[{ value: '', label: 'All Teams' }, ...Array.from(new Set(technicians.map(t => t.team).filter(Boolean))).map(t => ({ value: t as string, label: t as string }))]}
            value={teamFilter}
            onChange={(v) => setTeamFilter(v as string)}
            className="w-full sm:w-40"
          />
          <Select
            options={[{ value: '', label: 'All Regions' }, ...Array.from(new Set(technicians.map(t => t.region).filter(Boolean))).map(r => ({ value: r as string, label: r as string }))]}
            value={regionFilter}
            onChange={(v) => setRegionFilter(v as string)}
            className="w-full sm:w-40"
          />
        </div>
        
        <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'week' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('week')}
              className="px-2 sm:px-3 py-1 text-xs"
            >
              Week
            </Button>
            <Button
              variant={viewMode === 'day' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('day')}
              className="px-2 sm:px-3 py-1 text-xs"
            >
              Day
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => viewMode === 'week' ? navigateWeek('prev') : navigateDay('prev')}
              className="p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <span className="text-xs sm:text-sm font-medium text-gray-900 min-w-24 sm:min-w-32 text-center">
              {viewMode === 'week' 
                ? `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`
                : currentDate.toLocaleDateString()
              }
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => viewMode === 'week' ? navigateWeek('next') : navigateDay('next')}
              className="p-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Technician Info */}
      {selectedTech && (
        <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <img
                src={selectedTech.avatar}
                alt={`${selectedTech.firstName} ${selectedTech.lastName}`}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                  {selectedTech.firstName} {selectedTech.lastName}
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{selectedTech.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>555-123-4567</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center sm:text-right">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {getTotalHours().toFixed(1)}h
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Total Hours</div>
            </div>
          </div>
        </Card>
      )}

      {/* Schedule Grid */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16 sm:w-24">
                  Time
                </th>
                {dateColumns.map((date, index) => (
                  <th key={index} className="px-2 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-24 sm:min-w-32">
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-xs sm:text-sm">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className="text-gray-600 text-xs">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timeSlots.map((slot, slotIndex) => (
                <tr key={slotIndex} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                    {slot.time}
                  </td>
                  
                  {dateColumns.map((date, dateIndex) => (
                    <td key={dateIndex} className="px-2 sm:px-4 py-3 sm:py-4">
                      <div className="space-y-1">
                        {getEventsForSlot(date, slot.hour).map((event, eventIndex) => {
                          const StatusIcon = getEventStatusIcon(event.status);
                          
                          return (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.2, delay: eventIndex * 0.1 }}
                              className="p-2 sm:p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors border border-blue-200"
                              onClick={() => onEventClick?.(event)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs sm:text-sm font-medium text-blue-900 truncate">
                                    {event.title}
                                  </div>
                                  <div className="text-xs text-blue-700 mt-1">
                                    {formatTime(new Date(event.start))} - {formatTime(new Date(event.end))}
                                  </div>
                                  <div className="text-xs text-blue-600 truncate mt-1 hidden sm:block">
                                    {event.location}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                                  <StatusIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                  <Badge className={`text-xs ${getEventStatusColor(event.status)}`}>
                                    {event.status.replace('_', ' ')}
                                  </Badge>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                        
                        {getEventsForSlot(date, slot.hour).length === 0 && (
                          <button
                            onClick={() => onAddEvent?.(selectedTech?.id || '', date)}
                            className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
                          >
                            + Add Event
                          </button>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
};

export default TechnicianSchedule;
