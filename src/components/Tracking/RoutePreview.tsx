import React, { useState, useMemo } from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { Route, Clock, MapPin, Navigation, Play, Pause, RotateCcw } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface RoutePoint {
  id: string;
  lat: number;
  lng: number;
  timestamp: Date;
  address: string;
  type: 'start' | 'job' | 'break' | 'end';
  duration?: number;
}

interface RouteData {
  id: string;
  technicianId: string;
  technicianName: string;
  date: Date;
  points: RoutePoint[];
  totalDistance: number;
  totalTime: number;
  efficiency: number;
}

interface RoutePreviewProps {
  technicianId?: string;
  selectedDate?: Date;
  className?: string;
}

const RoutePreview: React.FC<RoutePreviewProps> = ({
  technicianId = 'tech-1',
  selectedDate = new Date(),
  className = '',
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
  const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: apiKey || '' });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPoint, setCurrentPoint] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Mock route data
  const routeData = useMemo<RouteData>(() => ({
    id: 'route-1',
    technicianId,
    technicianName: 'Mike Smith',
    date: selectedDate,
    points: [
      {
        id: 'start',
        lat: 40.7128,
        lng: -74.0060,
        timestamp: new Date(selectedDate.getTime() + 8 * 60 * 60 * 1000),
        address: '123 Main St, NYC',
        type: 'start',
      },
      {
        id: 'job1',
        lat: 40.7589,
        lng: -73.9851,
        timestamp: new Date(selectedDate.getTime() + 9 * 60 * 60 * 1000),
        address: '456 Park Ave, NYC',
        type: 'job',
        duration: 90,
      },
      {
        id: 'job2',
        lat: 40.7505,
        lng: -73.9934,
        timestamp: new Date(selectedDate.getTime() + 11 * 60 * 60 * 1000),
        address: '789 Broadway, NYC',
        type: 'job',
        duration: 120,
      },
      {
        id: 'break',
        lat: 40.7614,
        lng: -73.9776,
        timestamp: new Date(selectedDate.getTime() + 13 * 60 * 60 * 1000),
        address: 'Central Park, NYC',
        type: 'break',
        duration: 30,
      },
      {
        id: 'job3',
        lat: 40.7282,
        lng: -73.9942,
        timestamp: new Date(selectedDate.getTime() + 14 * 60 * 60 * 1000),
        address: '321 5th Ave, NYC',
        type: 'job',
        duration: 75,
      },
      {
        id: 'end',
        lat: 40.7128,
        lng: -74.0060,
        timestamp: new Date(selectedDate.getTime() + 17 * 60 * 60 * 1000),
        address: '123 Main St, NYC',
        type: 'end',
      },
    ],
    totalDistance: 45.2,
    totalTime: 9 * 60,
    efficiency: 87,
  }), [technicianId, selectedDate]);

  const pathCoordinates = routeData.points.map(point => ({
    lat: point.lat,
    lng: point.lng,
  }));

  const center = routeData.points[0] ? 
    { lat: routeData.points[0].lat, lng: routeData.points[0].lng } : 
    { lat: 40.7128, lng: -74.0060 };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'start': return '🏠';
      case 'job': return '🔧';
      case 'break': return '☕';
      case 'end': return '🏁';
      default: return '📍';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'start': return 'bg-green-100 text-green-800';
      case 'job': return 'bg-blue-100 text-blue-800';
      case 'break': return 'bg-yellow-100 text-yellow-800';
      case 'end': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      // Simulate route playback
      const interval = setInterval(() => {
        setCurrentPoint(prev => {
          if (prev >= routeData.points.length - 1) {
            setIsPlaying(false);
            clearInterval(interval);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
  };

  const resetPlayback = () => {
    setIsPlaying(false);
    setCurrentPoint(0);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Route className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Route Preview</h3>
              <p className="text-sm text-gray-600">{routeData.technicianName} - {selectedDate.toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-xl text-sm"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={4}>4x</option>
            </select>
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePlayback}
              icon={isPlaying ? Pause : Play}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetPlayback}
              icon={RotateCcw}
            >
              <span className="sr-only">Reset</span>
            </Button>
          </div>
        </div>

        {/* Route Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Distance</p>
              <p className="font-semibold">{routeData.totalDistance} miles</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-semibold">{Math.floor(routeData.totalTime / 60)}h {routeData.totalTime % 60}m</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Navigation className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Stops</p>
              <p className="font-semibold">{routeData.points.filter(p => p.type === 'job').length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full" />
            <div>
              <p className="text-sm text-gray-600">Efficiency</p>
              <p className="font-semibold">{routeData.efficiency}%</p>
            </div>
          </div>
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
              {/* Route polyline */}
              <Polyline
                path={pathCoordinates.slice(0, currentPoint + 1)}
                options={{
                  strokeColor: '#3B82F6',
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                }}
              />
              
              {/* Markers */}
              {routeData.points.map((point, index) => (
                <Marker
                  key={point.id}
                  position={{ lat: point.lat, lng: point.lng }}
                  title={`${point.address} - ${point.timestamp.toLocaleTimeString()}`}
                  opacity={index <= currentPoint ? 1 : 0.5}
                />
              ))}
            </GoogleMap>
          )}
        </Card>

        {/* Route Timeline */}
        <Card className="p-4">
          <h4 className="font-semibold text-gray-900 mb-4">Route Timeline</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {routeData.points.map((point, index) => (
              <motion.div
                key={point.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border transition-all ${
                  index === currentPoint
                    ? 'border-blue-500 bg-blue-50'
                    : index < currentPoint
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-lg">{getMarkerIcon(point.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <Badge className={`text-xs ${getTypeColor(point.type)}`}>
                        {point.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {point.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {point.address}
                    </p>
                    {point.duration && (
                      <p className="text-xs text-gray-600 mt-1">
                        Duration: {point.duration}min
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RoutePreview;