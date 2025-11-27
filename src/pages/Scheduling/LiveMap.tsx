import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Route, Shield, Car } from 'lucide-react';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import RoutePreview from '@/components/Tracking/RoutePreview';
import GeofenceManager from '@/components/Tracking/GeofenceManager';
import MileageTracker from '@/components/Tracking/MileageTracker';
import LeafletMap from '@/components/ui/LeafletMap';
import { TrackingService } from '@/services/tracking';
import { TechnicianLocation } from '@/mocks/tracking';

type ViewMode = 'live' | 'routes' | 'geofence' | 'mileage';

const LiveMapPage: React.FC = () => {
  const [locations, setLocations] = useState<TechnicianLocation[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('live');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const data = await TrackingService.listLocations();
      if (!cancelled) setLocations(data);
    };
    load();
    const interval = setInterval(async () => {
      const polled = await TrackingService.pollLocations();
      setLocations([...polled]);
    }, 5000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const filtered = locations.filter(l => statusFilter === 'all' || l.status === statusFilter);
  const center: [number, number] = filtered[0] 
    ? [filtered[0].lat, filtered[0].lng] 
    : [39.8283, -98.5795];
  
  const markers = filtered.map((t) => ({
    position: [t.lat, t.lng] as [number, number],
    title: `${t.technician.firstName} ${t.technician.lastName} • ${t.status}`,
  }));

  const viewOptions = [
    { id: 'live', label: 'Live Map', icon: Map },
    { id: 'routes', label: 'Routes', icon: Route },
    { id: 'geofence', label: 'Geofences', icon: Shield },
    { id: 'mileage', label: 'Mileage', icon: Car },
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
              Live Map & Tracking
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Real-time technician locations, routes, and mileage tracking
            </p>
          </div>
        </div>
      </motion.div>

      {/* View Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
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
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {viewMode === 'live' && (
          <div className="space-y-6">
            <Card className="p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Live Technician Locations</h2>
              <div className="w-40">
                <Select value={statusFilter} onChange={(v) => setStatusFilter(v)} options={[
                  { value: 'all', label: 'All' },
                  { value: 'en_route', label: 'En Route' },
                  { value: 'on_site', label: 'On Site' },
                  { value: 'off', label: 'Off' },
                ]} />
              </div>
            </Card>
            <Card className="p-0 overflow-hidden">
              <LeafletMap
                center={center}
                zoom={5}
                markers={markers}
                style={{ height: '70vh', width: '100%' }}
              />
            </Card>
          </div>
        )}

        {viewMode === 'routes' && (
          <RoutePreview />
        )}

        {viewMode === 'geofence' && (
          <GeofenceManager />
        )}

        {viewMode === 'mileage' && (
          <MileageTracker />
        )}
      </motion.div>
    </div>
  );
};

export default LiveMapPage;


