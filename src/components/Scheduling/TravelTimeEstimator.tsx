import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { ScheduleService } from '@/services/schedule';
import { toast } from 'react-toastify';

const travelModes = [
  { value: 'driving', label: 'Driving' },
  { value: 'walking', label: 'Walking' },
  { value: 'bicycling', label: 'Bicycling' },
  { value: 'transit', label: 'Transit' },
];

const TravelTimeEstimator: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [mode, setMode] = useState<'driving' | 'walking' | 'bicycling' | 'transit'>('driving');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    distanceText: string;
    distanceKm: number;
    durationText: string;
    durationMinutes: number;
  } | null>(null);

  const handleEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    try {
      const data = await ScheduleService.getTravelTime({
        origin,
        destination,
        mode,
      });
      setResult({
        distanceText: data.distance_text,
        distanceKm: data.distance_km,
        durationText: data.duration_text,
        durationMinutes: data.duration_minutes,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Unable to calculate travel time.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Travel Time Estimator</h3>
          <p className="text-sm text-gray-600">
            Quickly check the travel distance and duration between two addresses.
          </p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleEstimate}>
        <Input
          label="Origin"
          placeholder="123 Market Street, San Francisco"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          required
        />
        <Input
          label="Destination"
          placeholder="456 Oak Avenue, Oakland"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
        <Select
          label="Mode"
          value={mode}
          onChange={(value) => setMode(value as typeof mode)}
          options={travelModes}
        />
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Calculating...' : 'Estimate Travel Time'}
        </Button>
      </form>

      {result && (
        <div className="rounded-xl border border-primary-100 bg-primary-50 p-4 text-sm text-primary-800 space-y-1">
          <div className="font-semibold">
            Estimated Duration: {result.durationText} ({result.durationMinutes} min)
          </div>
          <div>Distance: {result.distanceText} ({result.distanceKm} km)</div>
          <div className="text-xs text-primary-700">Mode: {mode}</div>
        </div>
      )}
    </Card>
  );
};

export default TravelTimeEstimator;


