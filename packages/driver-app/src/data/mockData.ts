import { DriverJob, DriverUser } from '../types';

export const mockUser: DriverUser = {
  id: '1',
  name: 'John Smith',
  email: 'john@workero.com',
  phone: '+1234567890',
  vanId: 'van-001',
  skills: ['plumbing', 'electrical'],
};

export const mockJobs: DriverJob[] = [
  {
    id: '1',
    title: 'Kitchen Sink Repair',
    description: 'Fix leaking kitchen sink and replace faucet',
    client: {
      id: 'c1',
      name: 'Sarah Johnson',
      phone: '+1234567891',
    },
    status: 'assigned',
    priority: 'high',
    scheduledDate: new Date().toISOString(),
    estimatedDuration: 2,
    location: {
      address: '123 Main St, New York, NY 10001',
      coordinates: { lat: 40.7128, lng: -74.0060 },
    },
    materials: [],
    photos: [],
    notes: 'Customer will be home after 2 PM',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Electrical Outlet Installation',
    description: 'Install 3 new electrical outlets in living room',
    client: {
      id: 'c2',
      name: 'Mike Davis',
      phone: '+1234567892',
    },
    status: 'en_route',
    priority: 'medium',
    scheduledDate: new Date(Date.now() + 3600000).toISOString(),
    estimatedDuration: 1.5,
    location: {
      address: '456 Oak Ave, Brooklyn, NY 11201',
      coordinates: { lat: 40.6892, lng: -73.9442 },
    },
    materials: [],
    photos: [],
    notes: 'Bring extra wire and outlets',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'HVAC Maintenance',
    description: 'Annual HVAC system maintenance and filter replacement',
    client: {
      id: 'c3',
      name: 'Lisa Wilson',
      phone: '+1234567893',
    },
    status: 'completed',
    priority: 'low',
    scheduledDate: new Date(Date.now() - 86400000).toISOString(),
    estimatedDuration: 1,
    location: {
      address: '789 Pine St, Queens, NY 11375',
      coordinates: { lat: 40.7282, lng: -73.7949 },
    },
    materials: [],
    photos: [],
    notes: 'Completed successfully',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];