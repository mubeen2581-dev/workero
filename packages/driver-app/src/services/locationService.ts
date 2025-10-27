import * as ExpoLocation from 'expo-location';
import { Location } from '../types';

// Functional location service with closure for state management
const createLocationService = () => {
  let subscription: ExpoLocation.LocationSubscription | null = null;
  let isTracking = false;

  return {
    async startTracking(callback: (location: Location) => void): Promise<void> {
      if (isTracking) return;

      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission not granted');
        return;
      }

      isTracking = true;
      subscription = await ExpoLocation.watchPositionAsync(
        {
          accuracy: ExpoLocation.Accuracy.High,
          timeInterval: 60000,
          distanceInterval: 10,
        },
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: Date.now(),
          };
          callback(location);
        }
      );
    },

    stopTracking(): void {
      if (subscription) {
        subscription.remove();
        subscription = null;
      }
      isTracking = false;
    },

    async getCurrentLocation(): Promise<Location> {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }

      const position = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.High,
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: Date.now(),
      };
    },

    calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    }
  };
};

export const locationService = createLocationService();