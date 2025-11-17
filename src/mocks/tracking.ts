import { User } from '@/types';
import { mockTechnicians } from '@/mocks/jobs';

export type TechnicianLocation = {
  technicianId: string;
  technician: User;
  lat: number;
  lng: number;
  status: 'off' | 'en_route' | 'on_site';
  updatedAt: string;
  nextJobAddress?: string;
};

let base = [
  { lat: 40.7128, lng: -74.0060 }, // NYC
  { lat: 34.0522, lng: -118.2437 }, // LA
  { lat: 41.8781, lng: -87.6298 }, // Chicago
  { lat: 29.7604, lng: -95.3698 }, // Houston
];

export let mockTechnicianLocations: TechnicianLocation[] = mockTechnicians.map((t, i) => ({
  technicianId: t.id,
  technician: t,
  lat: base[i % base.length].lat + (Math.random() - 0.5) * 0.05,
  lng: base[i % base.length].lng + (Math.random() - 0.5) * 0.05,
  status: (['on_site', 'en_route', 'off'] as const)[i % 3],
  updatedAt: new Date().toISOString(),
  nextJobAddress: 'Next job location',
}));

export function jitterLocations() {
  mockTechnicianLocations = mockTechnicianLocations.map((loc) => ({
    ...loc,
    lat: loc.lat + (Math.random() - 0.5) * 0.01,
    lng: loc.lng + (Math.random() - 0.5) * 0.01,
    updatedAt: new Date().toISOString(),
  }));
  return mockTechnicianLocations;
}


