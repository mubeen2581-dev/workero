import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, X, Clock, Users, MapPin, RefreshCw, CheckCircle, Loader2, Filter } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { ScheduleService } from '@/services/schedule';
import { useScheduleEvents } from '@/services/scheduleQueries';
import { useTechnicians } from '@/services/userQueries';
import { toast } from 'react-toastify';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

import { ScheduleConflict } from '@/types';

interface ScheduleConflictAlertsProps {
  timeRange?: 'today' | 'week' | 'month';
  technicianIds?: string[];
  onResolveConflict?: (conflict: ScheduleConflict) => void;
  className?: string;
}

const ScheduleConflictAlerts: React.FC<ScheduleConflictAlertsProps> = ({
  timeRange = 'week',
  technicianIds,
  onResolveConflict,
  className = '',
}) => {
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'overlap' | 'workload'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const techniciansQuery = useTechnicians();
  const technicians = techniciansQuery.data ?? [];

  const timeRangeDates = useMemo(() => {
    const now = new Date();
    switch (timeRange) {
      case 'today':
        return { start: new Date(now.setHours(0, 0, 0, 0)), end: new Date(now.setHours(23, 59, 59, 999)) };
      case 'week':
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      default:
        return { start: startOfWeek(now), end: endOfWeek(now) };
    }
  }, [timeRange]);

  const loadConflicts = async () => {
    setIsLoading(true);
    try {
      const techIds = technicianIds || technicians.map((t) => t.id);
      if (techIds.length === 0) {
        setConflicts([]);
        return;
      }

      const result = await ScheduleService.getConflicts({
        technician_ids: techIds,
        start: timeRangeDates.start.toISOString(),
        end: timeRangeDates.end.toISOString(),
      });

      setConflicts(result.conflicts || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load conflicts');
      setConflicts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConflicts();
  }, [timeRange, technicianIds, timeRangeDates]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadConflicts, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, timeRange, technicianIds, timeRangeDates]);

  const filteredConflicts = useMemo(() => {
    if (selectedFilter === 'all') return conflicts;
    return conflicts.filter((c) => c.type === selectedFilter);
  }, [conflicts, selectedFilter]);

  const getConflictIcon = (type: string) => {
    switch (type) {
      case 'overlap':
        return <Clock className="w-5 h-5 text-red-600" />;
      case 'workload':
        return <Users className="w-5 h-5 text-orange-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getConflictColor = (type: string) => {
    switch (type) {
      case 'overlap':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'workload':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTechnicianName = (technicianId: string) => {
    const tech = technicians.find((t) => t.id === technicianId);
    return tech ? `${tech.firstName} ${tech.lastName}`.trim() || tech.email : 'Unknown Technician';
  };

  const conflictStats = useMemo(() => {
    return {
      total: conflicts.length,
      overlap: conflicts.filter((c) => c.type === 'overlap').length,
      workload: conflicts.filter((c) => c.type === 'workload').length,
    };
  }, [conflicts]);

  if (isLoading && conflicts.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Schedule Conflicts</h3>
              <p className="text-sm text-gray-600">Detected scheduling issues and overlaps</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadConflicts}
              disabled={isLoading}
              icon={isLoading ? Loader2 : RefreshCw}
            >
              Refresh
            </Button>
            <Button
              variant={autoRefresh ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              Auto
            </Button>
          </div>
        </div>

        {/* Stats */}
        {conflictStats.total > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{conflictStats.total}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-600">{conflictStats.overlap}</div>
              <div className="text-xs text-gray-600">Overlaps</div>
            </div>
            <div className="text-center p-2 bg-orange-50 rounded-lg">
              <div className="text-lg font-bold text-orange-600">{conflictStats.workload}</div>
              <div className="text-xs text-gray-600">Workload</div>
            </div>
          </div>
        )}

        {/* Filters */}
        {conflicts.length > 0 && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
            {['all', 'overlap', 'workload'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter as any)}
                className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedFilter === filter
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Conflicts List */}
      {filteredConflicts.length === 0 ? (
        <Card className="p-8">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-gray-900 mb-1">No Conflicts Detected</h4>
            <p className="text-sm text-gray-600">
              All schedules are conflict-free for the selected time range.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredConflicts.map((conflict, index) => (
            <motion.div
              key={`${conflict.technicianId}-${conflict.type}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`p-4 border-l-4 ${getConflictColor(conflict.type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-0.5">{getConflictIcon(conflict.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {getTechnicianName(conflict.technicianId)}
                        </h4>
                        <Badge className={`text-xs ${getConflictColor(conflict.type)}`}>
                          {conflict.type}
                        </Badge>
                        {conflict.date && (
                          <span className="text-xs text-gray-500">
                            {format(new Date(conflict.date), 'MMM d, yyyy')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{conflict.message}</p>

                      {conflict.events && conflict.events.length > 0 && (
                        <div className="space-y-2 mt-3">
                          <p className="text-xs font-medium text-gray-600">Conflicting Events:</p>
                          {conflict.events.map((event, eventIndex) => (
                            <div
                              key={event.id || eventIndex}
                              className="p-2 bg-white rounded-lg border border-gray-200"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {event.title}
                                  </p>
                                  <div className="flex items-center space-x-3 mt-1 text-xs text-gray-600">
                                    <span className="flex items-center space-x-1">
                                      <Clock className="w-3 h-3" />
                                      <span>
                                        {format(new Date(event.start), 'h:mm a')} -{' '}
                                        {format(new Date(event.end), 'h:mm a')}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {conflict.scheduledJobs !== undefined && (
                        <div className="mt-2 text-xs text-gray-600">
                          <span className="font-medium">Scheduled Jobs:</span> {conflict.scheduledJobs}
                        </div>
                      )}
                    </div>
                  </div>
                  {onResolveConflict && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onResolveConflict(conflict)}
                      className="ml-3 flex-shrink-0"
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduleConflictAlerts;

