import React, { useState, useMemo } from 'react';
import { GoogleMap, Circle, Marker, useJsApiLoader } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { Shield, MapPin, Clock, CheckCircle, AlertTriangle, Plus, Settings } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import Input from '../ui/Input';

interface Geofence {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
  type: 'job_site' | 'warehouse' | 'office' | 'restricted';
  isActive: boolean;
  autoCheckin: boolean;
  notifications: boolean;
}

interface GeofenceEvent {
  id: string;
  technicianId: string;
  technicianName: string;
  geofenceId: string;
  geofenceName: string;
  type: 'enter' | 'exit';
  timestamp: Date;
  duration?: number;
}

interface GeofenceManagerProps {
  className?: string;
}

const GeofenceManager: React.FC<GeofenceManagerProps> = ({ className = '' }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
  const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: apiKey || '' });
  
  const [selectedGeofence, setSelectedGeofence] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGeofence, setNewGeofence] = useState({
    name: '',
    lat: 40.7128,
    lng: -74.0060,
    radius: 100,
    type: 'job_site' as const,
    autoCheckin: true,
    notifications: true,
  });

  // Mock geofences
  const [geofences, setGeofences] = useState<Geofence[]>([
    {
      id: 'geo-1',
      name: 'Main Office',
      lat: 40.7128,
      lng: -74.0060,
      radius: 50,
      type: 'office',
      isActive: true,
      autoCheckin: true,
      notifications: true,
    },
    {
      id: 'geo-2',
      name: 'Client Site A',
      lat: 40.7589,
      lng: -73.9851,
      radius: 75,
      type: 'job_site',
      isActive: true,
      autoCheckin: true,
      notifications: false,
    },
    {
      id: 'geo-3',
      name: 'Warehouse',
      lat: 40.7505,
      lng: -73.9934,
      radius: 100,
      type: 'warehouse',
      isActive: true,
      autoCheckin: false,
      notifications: true,
    },
  ]);

  // Mock recent events
  const recentEvents = useMemo<GeofenceEvent[]>(() => [
    {
      id: 'event-1',
      technicianId: 'tech-1',
      technicianName: 'Mike Smith',
      geofenceId: 'geo-1',
      geofenceName: 'Main Office',
      type: 'enter',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      id: 'event-2',
      technicianId: 'tech-2',
      technicianName: 'Sarah Johnson',
      geofenceId: 'geo-2',
      geofenceName: 'Client Site A',
      type: 'enter',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      duration: 90,
    },
    {
      id: 'event-3',
      technicianId: 'tech-1',
      technicianName: 'Mike Smith',
      geofenceId: 'geo-3',
      geofenceName: 'Warehouse',
      type: 'exit',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      duration: 15,
    },
  ], []);

  const center = geofences[0] ? 
    { lat: geofences[0].lat, lng: geofences[0].lng } : 
    { lat: 40.7128, lng: -74.0060 };

  const getGeofenceColor = (type: string) => {
    switch (type) {
      case 'job_site': return '#3B82F6';
      case 'warehouse': return '#10B981';
      case 'office': return '#8B5CF6';
      case 'restricted': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'job_site': return '🔧';
      case 'warehouse': return '📦';
      case 'office': return '🏢';
      case 'restricted': return '🚫';
      default: return '📍';
    }
  };

  const getEventColor = (type: string) => {
    return type === 'enter' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const handleCreateGeofence = () => {
    const geofence: Geofence = {
      id: `geo-${Date.now()}`,
      name: newGeofence.name,
      lat: newGeofence.lat,
      lng: newGeofence.lng,
      radius: newGeofence.radius,
      type: newGeofence.type,
      isActive: true,
      autoCheckin: newGeofence.autoCheckin,
      notifications: newGeofence.notifications,
    };
    setGeofences([...geofences, geofence]);
    setNewGeofence({
      name: '',
      lat: 40.7128,
      lng: -74.0060,
      radius: 100,
      type: 'job_site',
      autoCheckin: true,
      notifications: true,
    });
    setShowCreateModal(false);
  };

  const toggleGeofence = (id: string) => {
    setGeofences(geofences.map(geo => 
      geo.id === id ? { ...geo, isActive: !geo.isActive } : geo
    ));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Geofence Manager</h3>
              <p className="text-sm text-gray-600">Automatic check-in and location monitoring</p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            icon={Plus}
          >
            Add Geofence
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          {!apiKey && (
            <div className="p-6 text-sm text-red-600">
              Google Maps API key missing. Add VITE_GOOGLE_MAPS_API_KEY to your .env file.
            </div>
          )}
          {apiKey && isLoaded && (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '500px' }}
              center={center}
              zoom={12}
            >
              {geofences.map((geofence) => (
                <React.Fragment key={geofence.id}>
                  <Circle
                    center={{ lat: geofence.lat, lng: geofence.lng }}
                    radius={geofence.radius}
                    options={{
                      fillColor: getGeofenceColor(geofence.type),
                      fillOpacity: geofence.isActive ? 0.2 : 0.1,
                      strokeColor: getGeofenceColor(geofence.type),
                      strokeOpacity: geofence.isActive ? 0.8 : 0.4,
                      strokeWeight: 2,
                    }}
                    onClick={() => setSelectedGeofence(geofence.id)}
                  />
                  <Marker
                    position={{ lat: geofence.lat, lng: geofence.lng }}
                    title={geofence.name}
                    onClick={() => setSelectedGeofence(geofence.id)}
                  />
                </React.Fragment>
              ))}
            </GoogleMap>
          )}
        </Card>

        {/* Geofence List */}
        <div className="space-y-4">
          <Card className="p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Active Geofences</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {geofences.map((geofence) => (
                <motion.div
                  key={geofence.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedGeofence === geofence.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedGeofence(geofence.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getTypeIcon(geofence.type)}</span>
                      <span className="font-medium text-gray-900">{geofence.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {geofence.isActive ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-gray-400" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleGeofence(geofence.id);
                        }}
                        className="p-1"
                      >
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    <p>Radius: {geofence.radius}m</p>
                    <p>Type: {geofence.type.replace('_', ' ')}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      {geofence.autoCheckin && (
                        <span className="text-green-600">Auto Check-in</span>
                      )}
                      {geofence.notifications && (
                        <span className="text-blue-600">Notifications</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Recent Events */}
          <Card className="p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Recent Events</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`text-xs ${getEventColor(event.type)}`}>
                      {event.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {event.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {event.technicianName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {event.geofenceName}
                  </p>
                  {event.duration && (
                    <p className="text-xs text-gray-500 mt-1">
                      Duration: {event.duration}min
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Create Geofence Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Geofence"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={newGeofence.name}
            onChange={(e) => setNewGeofence({ ...newGeofence, name: e.target.value })}
            placeholder="Enter geofence name"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitude"
              type="number"
              step="any"
              value={newGeofence.lat}
              onChange={(e) => setNewGeofence({ ...newGeofence, lat: Number(e.target.value) })}
            />
            <Input
              label="Longitude"
              type="number"
              step="any"
              value={newGeofence.lng}
              onChange={(e) => setNewGeofence({ ...newGeofence, lng: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Radius (meters)"
            type="number"
            value={newGeofence.radius}
            onChange={(e) => setNewGeofence({ ...newGeofence, radius: Number(e.target.value) })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={newGeofence.type}
              onChange={(e) => setNewGeofence({ ...newGeofence, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="job_site">Job Site</option>
              <option value="warehouse">Warehouse</option>
              <option value="office">Office</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newGeofence.autoCheckin}
                onChange={(e) => setNewGeofence({ ...newGeofence, autoCheckin: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Enable auto check-in</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newGeofence.notifications}
                onChange={(e) => setNewGeofence({ ...newGeofence, notifications: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Enable notifications</span>
            </label>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateGeofence}
              disabled={!newGeofence.name}
            >
              Create Geofence
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GeofenceManager;