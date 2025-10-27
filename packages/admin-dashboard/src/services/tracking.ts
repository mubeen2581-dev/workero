import { jitterLocations, mockTechnicianLocations, TechnicianLocation } from '@/mocks/tracking';

export const TrackingService = {
  async listLocations(): Promise<TechnicianLocation[]> {
    return mockTechnicianLocations;
  },
  async pollLocations(): Promise<TechnicianLocation[]> {
    return jitterLocations();
  },
};


