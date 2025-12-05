import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ScheduleEvent, User as Technician } from '@/types';
import { mockScheduleEvents } from '@/mocks/schedules';
import { mockTechnicians } from '@/mocks/jobs';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Select from '../ui/Select';
import { ScheduleService } from '@/services/schedule';
import { useUpdateScheduleEvent } from '@/services/scheduleQueries';
import { toast } from 'react-toastify';

interface ScheduleGridProps {
  events?: ScheduleEvent[];
  technicians?: Technician[];
  onEventClick?: (event: ScheduleEvent) => void;
  onAddEvent?: (technicianId: string, date: Date) => void;
  className?: string;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  events = mockScheduleEvents,
  technicians = mockTechnicians,
  onEventClick,
  onAddEvent,
  className = '',
}) => {
  const updateEventMutation = useUpdateScheduleEvent();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [localEvents, setLocalEvents] = useState<ScheduleEvent[]>(events);
  const [resizing, setResizing] = useState<
    | { id: string; edge: 'start' | 'end'; originY: number; originalStart: Date; originalEnd: Date }
    | null
  >(null);
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [statusFilter, setStatusFilter] = useState<'' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'>('');
  const [priorityFilter, setPriorityFilter] = useState<'' | 'low' | 'medium' | 'high' | 'urgent'>('');
  const [teamFilter, setTeamFilter] = useState<string>('');
  const [regionFilter, setRegionFilter] = useState<string>('');

  // Sync local events with prop events
  useEffect(() => {
    setLocalEvents(events);
  }, [events]);

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


  const weekStart = getWeekStart(currentDate);
  const weekEnd = getWeekEnd(currentDate);

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

  // Get events for each technician and time slot
  const getEventsForSlot = (technicianId: string, date: Date, hour: number) => {
    const slotStart = new Date(date);
    slotStart.setHours(hour, 0, 0, 0);
    
    const slotEnd = new Date(date);
    slotEnd.setHours(hour + 1, 0, 0, 0);

    return localEvents.filter(event => {
      if (event.technicianId !== technicianId) return false;
      if (statusFilter && event.status !== statusFilter) return false;
      if (priorityFilter && event.priority !== priorityFilter) return false;
      
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      return eventStart < slotEnd && eventEnd > slotStart;
    });
  };

  const hasConflict = (technicianId: string, date: Date, hour: number) => {
    return getEventsForSlot(technicianId, date, hour).length > 1;
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

  // URL sync for filters
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setStatusFilter((params.get('status') as any) || '');
    setPriorityFilter((params.get('prio') as any) || '');
    setTeamFilter(params.get('team') || '');
    setRegionFilter(params.get('region') || '');
  }, []);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const setOrDelete = (k: string, v: string) => { if (v) params.set(k, v); else params.delete(k); };
    setOrDelete('status', statusFilter);
    setOrDelete('prio', priorityFilter);
    setOrDelete('team', teamFilter);
    setOrDelete('region', regionFilter);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [statusFilter, priorityFilter, teamFilter, regionFilter]);

  const teams = useMemo(() => {
    const all = (technicians || []).map(t => t.team).filter(Boolean) as string[];
    return Array.from(new Set(all));
  }, [technicians]);

  const regions = useMemo(() => {
    const all = (technicians || []).map(t => t.region).filter(Boolean) as string[];
    return Array.from(new Set(all));
  }, [technicians]);

  const filteredTechnicians = useMemo(() => {
    return (technicians || []).filter(t => {
      const okTeam = teamFilter ? t.team === teamFilter : true;
      const okRegion = regionFilter ? t.region === regionFilter : true;
      return okTeam && okRegion;
    });
  }, [technicians, teamFilter, regionFilter]);

  const getEventStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, ev: ScheduleEvent) => {
    setDraggingId(ev.id);
    event.dataTransfer.setData('text/plain', ev.id);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDropOnCell = async (technicianId: string, date: Date) => {
    if (!draggingId) return;
    const event = localEvents.find(e => e.id === draggingId);
    if (!event) return;

    const start = new Date(event.start);
    const end = new Date(event.end);
    const newStart = new Date(date);
    newStart.setHours(start.getHours(), start.getMinutes(), 0, 0);
    const durationMs = end.getTime() - start.getTime();
    const newEnd = new Date(newStart.getTime() + durationMs);

    // Optimistic update
    setLocalEvents(prev => prev.map(e => {
      if (e.id !== draggingId) return e;
      return { ...e, technicianId, start: newStart, end: newEnd } as ScheduleEvent;
    }));

    try {
      await updateEventMutation.mutateAsync({
        id: draggingId,
        data: {
          technician_id: technicianId,
          start: newStart.toISOString(),
          end: newEnd.toISOString(),
        },
      });
      // Toast is handled by the mutation
    } catch (error: any) {
      // Revert on error
      setLocalEvents(prev => prev.map(e => {
        if (e.id !== draggingId) return event;
        return e;
      }));
      toast.error(error?.response?.data?.message || 'Failed to reassign event');
    } finally {
      setDraggingId(null);
    }
  };

  // Resize handlers (simple vertical drag: 10px = 30 minutes)
  const onResizeMouseMove = (e: MouseEvent) => {
    if (!resizing) return;
    const dy = e.clientY - resizing.originY;
    const minutes = Math.round(dy / 10) * 30;
    setLocalEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== resizing.id) return ev;
        if (resizing.edge === 'start') {
          const newStart = new Date(resizing.originalStart.getTime() + minutes * 60000);
          if (newStart >= ev.end) return ev;
          return { ...ev, start: newStart };
        }
        const newEnd = new Date(resizing.originalEnd.getTime() + minutes * 60000);
        if (newEnd <= ev.start) return ev;
        return { ...ev, end: newEnd };
      })
    );
  };

  const onResizeMouseUp = async () => {
    if (!resizing) return;
    const ev = localEvents.find((x) => x.id === resizing.id);
    if (!ev) {
      setResizing(null);
      window.removeEventListener('mousemove', onResizeMouseMove);
      window.removeEventListener('mouseup', onResizeMouseUp);
      return;
    }

    const originalEvent = events.find((x) => x.id === resizing.id);
    
    try {
      await updateEventMutation.mutateAsync({
        id: ev.id,
        data: {
          start: ev.start instanceof Date ? ev.start.toISOString() : ev.start,
          end: ev.end instanceof Date ? ev.end.toISOString() : ev.end,
        },
      });
      // Toast is handled by the mutation
    } catch (error: any) {
      // Revert on error
      if (originalEvent) {
        setLocalEvents(prev => prev.map(e => {
          if (e.id === resizing.id) return originalEvent;
          return e;
        }));
      }
      toast.error(error?.response?.data?.message || 'Failed to update event duration');
    } finally {
      setResizing(null);
      window.removeEventListener('mousemove', onResizeMouseMove);
      window.removeEventListener('mouseup', onResizeMouseUp);
    }
  };

  const startResize = (edge: 'start' | 'end', ev: ScheduleEvent, originY: number) => {
    setResizing({ id: ev.id, edge, originY, originalStart: new Date(ev.start), originalEnd: new Date(ev.end) });
    window.addEventListener('mousemove', onResizeMouseMove);
    window.addEventListener('mouseup', onResizeMouseUp);
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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Schedule Grid</h2>
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
        </div>
        
        <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
        {/* Priority Legend */}
        <div className="hidden sm:flex items-center gap-2 mr-2">
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
        <Select
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'scheduled', label: 'Scheduled' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as any)}
          className="w-40"
        />
        <Select
          options={[
            { value: '', label: 'All Priorities' },
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'urgent', label: 'Urgent' },
          ]}
          value={priorityFilter}
          onChange={(v) => setPriorityFilter(v as any)}
          className="w-40"
        />
        <Select
          options={[{ value: '', label: 'All Teams' }, ...teams.map(t => ({ value: t, label: t }))]}
          value={teamFilter}
          onChange={(v) => setTeamFilter(v as string)}
          className="w-40"
        />
        <Select
          options={[{ value: '', label: 'All Regions' }, ...regions.map(r => ({ value: r, label: r }))]}
          value={regionFilter}
          onChange={(v) => setRegionFilter(v as string)}
          className="w-40"
        />
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
          
          <Button variant="secondary" size="sm" icon={Plus} className="hidden sm:flex">
            Add Event
          </Button>
          <Button variant="secondary" size="sm" icon={Plus} className="sm:hidden p-2">
            <span className="sr-only">Add Event</span>
          </Button>
        </div>
      </div>

      {/* Schedule Grid */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24 sm:w-32">
                  Technician
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
              {technicians.map((technician) => (
                <tr key={technician.id} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={technician.avatar}
                        alt={`${technician.firstName} ${technician.lastName}`}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover mr-2 sm:mr-3 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {technician.firstName} {technician.lastName}
                        </div>
                        <div className="text-xs text-gray-500 truncate hidden sm:block">{technician.email}</div>
                      </div>
                    </div>
                  </td>
                  
                  {dateColumns.map((date, dateIndex) => (
                    <td key={dateIndex} className={`px-2 sm:px-4 py-3 sm:py-4 ${hasConflict(technician.id, date, 8) ? 'bg-red-50' : ''}`}>
                      <div className="space-y-1">
                        {getEventsForSlot(technician.id, date, 8).map((event, eventIndex) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: eventIndex * 0.1 }}
                            className="p-2 bg-blue-100 rounded-lg cursor-move hover:bg-blue-200 transition-colors"
                            draggable
                            onDragStart={(e) => handleDragStart(e as React.DragEvent<HTMLDivElement>, event)}
                            onClick={() => onEventClick?.(event)}
                          >
                            <div className="relative">
                              <div
                                className="absolute -top-1 left-0 right-0 h-1 cursor-ns-resize"
                                onMouseDown={(e) => startResize('start', event, e.clientY)}
                              />
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-xs font-medium text-blue-900 truncate">
                                {event.title}
                              </div>
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
                              <div className="text-xs text-blue-700">
                                {formatTime(new Date(event.start))} - {formatTime(new Date(event.end))}
                              </div>
                              <Badge className={`text-xs ${getEventStatusColor(event.status)}`}>
                                {event.status.replace('_', ' ')}
                              </Badge>
                              <div
                                className="absolute -bottom-1 left-0 right-0 h-1 cursor-ns-resize"
                                onMouseDown={(e) => startResize('end', event, e.clientY)}
                              />
                            </div>
                          </motion.div>
                        ))}
                        
                        <div
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => handleDropOnCell(technician.id, date)}
                          className="w-full p-1 rounded-lg"
                        >
                          {getEventsForSlot(technician.id, date, 8).length === 0 && (
                            <button
                              onClick={() => onAddEvent?.(technician.id, date)}
                              className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
                            >
                              + Add Event
                            </button>
                          )}
                        </div>
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

export default ScheduleGrid;
