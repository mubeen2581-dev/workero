// import { DriverJob, ClockEntry, Material } from '@workero/shared';

// Temporary local types until shared package is set up
export interface DriverJob {
  id: string;
  title: string;
  description: string;
  client: {
    id: string;
    name: string;
    phone: string;
  };
  status: 'assigned' | 'en_route' | 'on_site' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate: string;
  estimatedDuration: number;
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  materials: Material[];
  photos: string[];
  notes: string;
  signature?: string;
  clockInTime?: string;
  clockOutTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

export interface ClockEntry {
  id: string;
  jobId: string;
  technicianId: string;
  clockInTime: string;
  clockOutTime?: string;
  location: {
    lat: number;
    lng: number;
  };
  notes?: string;
  createdAt: string;
}

export interface DriverState {
  user: DriverUser | null;
  currentJob: DriverJob | null;
  jobs: DriverJob[];
  isOnline: boolean;
  location: Location | null;
  clockedIn: boolean;
}

export interface DriverUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  vanId: string;
  skills: string[];
}

export interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface JobUpdate {
  jobId: string;
  status: 'assigned' | 'en_route' | 'on_site' | 'completed' | 'cancelled';
  notes?: string;
  photos?: string[];
  materialsUsed?: Material[];
  signature?: string;
  location?: Location;
}

export interface VanStock {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  category: string;
}

export interface ExpenseEntry {
  id: string;
  jobId: string;
  type: 'fuel' | 'parking' | 'materials' | 'other';
  amount: number;
  description: string;
  receipt?: string;
  location?: Location;
  timestamp: string;
}