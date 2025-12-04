import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Route as RouteIcon, Loader2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import LeafletMap from '../ui/LeafletMap';
import { ScheduleService } from '@/services/schedule';
import { geocodeAddress } from '@/utils/geocoding';
import { toast } from 'react-toastify';

interface RouteVisualizerProps {
  locations?: string[];
  onRouteOptimized?: (optimizedRoute: any) => void;
  className?: string;
}

const RouteVisualizer: React.FC<RouteVisualizerProps> = ({
  locations: initialLocations = [],
  onRouteOptimized,
  className = '',
}) => {
  const [locations, setLocations] = useState<string[]>(initialLocations);
  const [startLocation, setStartLocation] = useState<string>('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [routeData, setRouteData] = useState<any>(null);
  const [routePolyline, setRoutePolyline] = useState<Array<[number, number]>>([]);
  const [routeMarkers, setRouteMarkers] = useState<Array<{ position: [number, number]; title: string }>>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.7749, -122.4194]);

  const handleAddLocation = () => {
    const input = document.getElementById('location-input') as HTMLInputElement;
    if (input && input.value.trim()) {
      setLocations([...locations, input.value.trim()]);
      input.value = '';
    }
  };

  const handleRemoveLocation = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const handleOptimizeRoute = async () => {
    if (locations.length < 2) {
      toast.error('Please add at least 2 locations');
      return;
    }

    setIsOptimizing(true);
    try {
      const result = await ScheduleService.optimizeRoute({
        locations,
        start_location: startLocation || undefined,
        mode: 'driving',
      });

      setRouteData(result);
      onRouteOptimized?.(result);

      // Geocode waypoints to get coordinates for markers and polyline
      try {
        const markerCoords: Array<[number, number]> = [];
        const markers: Array<{ position: [number, number]; title: string }> = [];

        for (const waypoint of result.waypoints) {
          const coords = await geocodeAddress(waypoint);
          if (coords) {
            markerCoords.push(coords);
            markers.push({
              position: coords,
              title: waypoint,
            });
          }
        }

        setRouteMarkers(markers);
        setRoutePolyline(markerCoords);

        // Center map on route
        if (markerCoords.length > 0) {
          const avgLat = markerCoords.reduce((sum, coord) => sum + coord[0], 0) / markerCoords.length;
          const avgLng = markerCoords.reduce((sum, coord) => sum + coord[1], 0) / markerCoords.length;
          setMapCenter([avgLat, avgLng]);
        }
      } catch (error) {
        console.error('Failed to geocode waypoints for map:', error);
        // Still show the route data even if map drawing fails
      }

      toast.success(`Route optimized! Total distance: ${result.total_distance_km}km, Duration: ${result.total_duration_text}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to optimize route');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <Card className={`p-4 sm:p-6 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Route Planner</h3>
          <p className="text-sm text-gray-600">Optimize multi-stop routes for efficient scheduling</p>
        </div>
        <RouteIcon className="w-6 h-6 text-primary-600" />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Location (Optional)
          </label>
          <Input
            id="start-location"
            placeholder="123 Main St, City, State"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            icon={Navigation}
          />
          <p className="text-xs text-gray-500 mt-1">
            If specified, route will start from this location
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Locations to Visit
          </label>
          <div className="flex gap-2">
            <Input
              id="location-input"
              placeholder="Add location address"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddLocation();
                }
              }}
              icon={MapPin}
            />
            <Button variant="primary" onClick={handleAddLocation}>
              Add
            </Button>
          </div>
        </div>

        {locations.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Locations ({locations.length}):</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {locations.map((location, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <Badge className="bg-primary-100 text-primary-800">{index + 1}</Badge>
                    <span className="text-sm text-gray-700 truncate">{location}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveLocation(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          variant="primary"
          onClick={handleOptimizeRoute}
          disabled={locations.length < 2 || isOptimizing}
          icon={isOptimizing ? Loader2 : RouteIcon}
          className="w-full"
        >
          {isOptimizing ? 'Optimizing Route...' : 'Optimize Route'}
        </Button>

        {routeData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 p-4 bg-primary-50 rounded-xl border border-primary-200"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-primary-900">Optimized Route</h4>
              <Badge className="bg-primary-600 text-white">
                {routeData.total_distance_km} km
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-primary-600" />
                <span className="text-gray-700">
                  Total Duration: <strong>{routeData.total_duration_text}</strong> ({routeData.total_duration_minutes} min)
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-700">Route Order:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  {routeData.waypoints.map((wp: string, idx: number) => (
                    <li key={idx} className="pl-2">{wp}</li>
                  ))}
                </ol>
              </div>

              {routeData.legs && routeData.legs.length > 0 && (
                <div className="mt-3 pt-3 border-t border-primary-200">
                  <p className="text-xs font-medium text-gray-700 mb-2">Leg Details:</p>
                  <div className="space-y-1">
                    {routeData.legs.map((leg: any, idx: number) => (
                      <div key={idx} className="text-xs text-gray-600 flex justify-between">
                        <span>Leg {idx + 1}:</span>
                        <span>{leg.distance_km} km • {leg.duration_minutes} min</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Route Map
          </label>
          <LeafletMap
            center={mapCenter}
            zoom={routePolyline.length > 0 ? 10 : 5}
            markers={routeMarkers}
            polyline={routePolyline}
            style={{ height: '400px', width: '100%' }}
            className="rounded-lg border border-gray-200"
          />
        </div>
      </div>
    </Card>
  );
};

export default RouteVisualizer;
