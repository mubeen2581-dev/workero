import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain, Clock, MapPin, User, Star, Calendar, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface TimeSlot {
  id: string;
  start: Date;
  end: Date;
  score: number;
  technicianId: string;
  technicianName: string;
  reasons: string[];
  travelTime: number;
  workloadBefore: number;
  workloadAfter: number;
}

interface AISchedulerProps {
  jobId?: string;
  jobType?: string;
  duration?: number;
  location?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  onSelectSlot?: (slot: TimeSlot) => void;
  className?: string;
}

const AIScheduler: React.FC<AISchedulerProps> = ({
  jobId,
  jobType = 'Maintenance',
  duration = 2,
  location = 'Downtown',
  priority = 'medium',
  onSelectSlot,
  className = '',
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    maxTravelTime: 30,
    preferredTechnician: '',
    timeRange: 'business' as 'business' | 'extended' | 'any',
  });

  // Mock AI-generated time slots
  const aiRecommendations = useMemo<TimeSlot[]>(() => {
    const slots: TimeSlot[] = [];
    const technicians = [
      { id: 'tech-1', name: 'Mike Smith' },
      { id: 'tech-2', name: 'Sarah Johnson' },
      { id: 'tech-3', name: 'David Wilson' },
    ];

    technicians.forEach((tech, techIndex) => {
      for (let day = 0; day < 3; day++) {
        for (let hour = 9; hour < 17; hour += 2) {
          const start = new Date();
          start.setDate(start.getDate() + day);
          start.setHours(hour, 0, 0, 0);
          
          const end = new Date(start);
          end.setHours(hour + duration);

          const travelTime = 5 + (techIndex * 8) + Math.random() * 15;
          const workloadBefore = 4 + (techIndex * 2) + Math.random() * 6;
          const workloadAfter = workloadBefore + duration;
          
          // AI scoring algorithm
          const travelScore = Math.max(0, 30 - travelTime) * 2;
          const workloadScore = Math.max(0, 24 - workloadAfter) * 3;
          const timeScore = hour >= 9 && hour <= 15 ? 20 : 10;
          const priorityBonus = priority === 'urgent' ? 25 : priority === 'high' ? 15 : 5;
          
          const score = Math.min(100, travelScore + workloadScore + timeScore + priorityBonus + Math.random() * 10);

          const reasons = [];
          if (travelTime < 15) reasons.push('Short travel time');
          if (workloadBefore < 6) reasons.push('Low current workload');
          if (hour >= 10 && hour <= 14) reasons.push('Optimal time slot');
          if (score > 80) reasons.push('High efficiency match');

          slots.push({
            id: `slot-${tech.id}-${day}-${hour}`,
            start,
            end,
            score: Math.round(score),
            technicianId: tech.id,
            technicianName: tech.name,
            reasons,
            travelTime: Math.round(travelTime),
            workloadBefore: Math.round(workloadBefore),
            workloadAfter: Math.round(workloadAfter),
          });
        }
      }
    });

    return slots
      .filter(slot => slot.travelTime <= filters.maxTravelTime)
      .filter(slot => !filters.preferredTechnician || slot.technicianId === filters.preferredTechnician)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [duration, priority, filters]);

  const handleSelectSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot.id);
    onSelectSlot?.(slot);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-xl">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Scheduler</h3>
            <p className="text-sm text-gray-600">Optimal time slots for {jobType}</p>
          </div>
        </div>
        <Badge className={getPriorityColor(priority)}>
          {priority.toUpperCase()} Priority
        </Badge>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">{duration}h duration</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">{location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">Next 3 days</span>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Travel Time</label>
          <select
            value={filters.maxTravelTime}
            onChange={(e) => setFilters({ ...filters, maxTravelTime: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>1 hour</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Technician</label>
          <select
            value={filters.preferredTechnician}
            onChange={(e) => setFilters({ ...filters, preferredTechnician: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Any Technician</option>
            <option value="tech-1">Mike Smith</option>
            <option value="tech-2">Sarah Johnson</option>
            <option value="tech-3">David Wilson</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
          <select
            value={filters.timeRange}
            onChange={(e) => setFilters({ ...filters, timeRange: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="business">Business Hours</option>
            <option value="extended">Extended Hours</option>
            <option value="any">Any Time</option>
          </select>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900 flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span>Top Recommendations</span>
        </h4>
        
        {aiRecommendations.map((slot, index) => (
          <motion.div
            key={slot.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 border rounded-xl cursor-pointer transition-all ${
              selectedSlot === slot.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => handleSelectSlot(slot)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900">{slot.technicianName}</span>
                </div>
                <Badge className={`px-2 py-1 text-xs rounded-full ${getScoreColor(slot.score)}`}>
                  {slot.score}% match
                </Badge>
              </div>
              {selectedSlot === slot.id && (
                <CheckCircle className="w-5 h-5 text-primary-600" />
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
              <div>
                <span className="text-gray-500">Time:</span>
                <div className="font-medium">
                  {slot.start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div className="text-gray-600">
                  {slot.start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - 
                  {slot.end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Travel:</span>
                <div className="font-medium">{slot.travelTime} min</div>
              </div>
              <div>
                <span className="text-gray-500">Workload:</span>
                <div className="font-medium">{slot.workloadBefore}h → {slot.workloadAfter}h</div>
              </div>
              <div>
                <span className="text-gray-500">Efficiency:</span>
                <div className="font-medium">{slot.score}%</div>
              </div>
            </div>

            {slot.reasons.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {slot.reasons.map((reason, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                  >
                    {reason}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {selectedSlot && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button variant="primary" className="w-full">
            Schedule Selected Time Slot
          </Button>
        </div>
      )}
    </Card>
  );
};

export default AIScheduler;