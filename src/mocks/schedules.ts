import { Job, User, ScheduleEvent, Availability, RecurringJob } from '@/types';
import { mockJobs, mockTechnicians } from './jobs';

export const mockScheduleEvents: ScheduleEvent[] = [
  {
    id: 'event-1',
    title: 'Kitchen Renovation - Complete',
    start: new Date('2024-12-16T09:00:00Z'),
    end: new Date('2024-12-16T17:00:00Z'),
    jobId: 'job-1',
    technicianId: 'tech-1',
    status: 'scheduled',
    type: 'job',
    priority: 'high',
    description: 'Complete kitchen renovation including custom oak cabinets, granite countertops, stainless steel sink, backsplash installation, and electrical work.',
    location: '123 Main St, New York, NY 10001',
    color: '#3B82F6',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'event-2',
    title: 'Bathroom Remodel - Urgent',
    start: new Date('2024-12-18T08:00:00Z'),
    end: new Date('2024-12-18T16:00:00Z'),
    jobId: 'job-2',
    technicianId: 'tech-2',
    status: 'scheduled',
    type: 'job',
    priority: 'urgent',
    description: 'Complete bathroom remodel with new vanity, tile flooring, shower tile, and toilet installation. Water damage repair required.',
    location: '456 Oak Ave, Los Angeles, CA 90210',
    color: '#EF4444',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'event-3',
    title: 'Electrical Panel Upgrade',
    start: new Date('2024-12-05T10:00:00Z'),
    end: new Date('2024-12-05T17:00:00Z'),
    jobId: 'job-3',
    technicianId: 'tech-3',
    status: 'completed',
    type: 'job',
    priority: 'medium',
    description: 'Upgrade electrical panel to 200 amp service, install GFCI outlets, and run new wiring for kitchen appliances.',
    location: '789 Pine St, Chicago, IL 60601',
    color: '#10B981',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'event-4',
    title: 'Premium Kitchen Design',
    start: new Date('2024-12-20T09:00:00Z'),
    end: new Date('2024-12-20T17:00:00Z'),
    jobId: 'job-4',
    technicianId: 'tech-1',
    status: 'scheduled',
    type: 'job',
    priority: 'high',
    description: 'High-end kitchen renovation with custom cabinetry, premium quartz countertops, and luxury appliance package.',
    location: '321 Elm St, Houston, TX 77001',
    color: '#F59E0B',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'event-5',
    title: 'Emergency Plumbing Repair',
    start: new Date('2024-12-15T14:00:00Z'),
    end: new Date('2024-12-15T18:00:00Z'),
    jobId: 'job-5',
    technicianId: 'tech-4',
    status: 'in_progress',
    type: 'job',
    priority: 'urgent',
    description: 'Emergency plumbing repair due to water damage. Replace damaged pipes and assess water damage.',
    location: '654 Maple Dr, Phoenix, AZ 85001',
    color: '#EF4444',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'event-6',
    title: 'HVAC Maintenance Contract',
    start: new Date('2024-12-22T10:00:00Z'),
    end: new Date('2024-12-22T14:00:00Z'),
    jobId: 'job-6',
    technicianId: 'tech-2',
    status: 'scheduled',
    type: 'job',
    priority: 'low',
    description: 'Annual HVAC system maintenance including filter replacement, duct cleaning, and system inspection.',
    location: '987 Cedar Ln, Miami, FL 33101',
    color: '#8B5CF6',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'event-7',
    title: 'Team Meeting',
    start: new Date('2024-12-17T10:00:00Z'),
    end: new Date('2024-12-17T11:00:00Z'),
    technicianId: 'tech-1',
    status: 'scheduled',
    type: 'meeting',
    priority: 'low',
    description: 'Weekly team meeting to discuss project updates and scheduling.',
    location: 'Office',
    color: '#6B7280',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'event-8',
    title: 'Training Session',
    start: new Date('2024-12-19T14:00:00Z'),
    end: new Date('2024-12-19T16:00:00Z'),
    technicianId: 'tech-3',
    status: 'scheduled',
    type: 'training',
    priority: 'low',
    description: 'Safety training session for new equipment.',
    location: 'Training Center',
    color: '#8B5CF6',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
];

export const mockAvailability: Availability[] = [
  {
    id: 'avail-1',
    technicianId: 'tech-1',
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'avail-2',
    technicianId: 'tech-1',
    dayOfWeek: 2, // Tuesday
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'avail-3',
    technicianId: 'tech-1',
    dayOfWeek: 3, // Wednesday
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'avail-4',
    technicianId: 'tech-1',
    dayOfWeek: 4, // Thursday
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'avail-5',
    technicianId: 'tech-1',
    dayOfWeek: 5, // Friday
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'avail-6',
    technicianId: 'tech-2',
    dayOfWeek: 1, // Monday
    startTime: '08:00',
    endTime: '16:00',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'avail-7',
    technicianId: 'tech-2',
    dayOfWeek: 2, // Tuesday
    startTime: '08:00',
    endTime: '16:00',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'avail-8',
    technicianId: 'tech-2',
    dayOfWeek: 3, // Wednesday
    startTime: '08:00',
    endTime: '16:00',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'avail-9',
    technicianId: 'tech-2',
    dayOfWeek: 4, // Thursday
    startTime: '08:00',
    endTime: '16:00',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'avail-10',
    technicianId: 'tech-2',
    dayOfWeek: 5, // Friday
    startTime: '08:00',
    endTime: '16:00',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'avail-11',
    technicianId: 'tech-3',
    dayOfWeek: 1, // Monday
    startTime: '10:00',
    endTime: '18:00',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'avail-12',
    technicianId: 'tech-3',
    dayOfWeek: 2, // Tuesday
    startTime: '10:00',
    endTime: '18:00',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'avail-13',
    technicianId: 'tech-3',
    dayOfWeek: 3, // Wednesday
    startTime: '10:00',
    endTime: '18:00',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'avail-14',
    technicianId: 'tech-3',
    dayOfWeek: 4, // Thursday
    startTime: '10:00',
    endTime: '18:00',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'avail-15',
    technicianId: 'tech-3',
    dayOfWeek: 5, // Friday
    startTime: '10:00',
    endTime: '18:00',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'avail-16',
    technicianId: 'tech-4',
    dayOfWeek: 1, // Monday
    startTime: '07:00',
    endTime: '15:00',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'avail-17',
    technicianId: 'tech-4',
    dayOfWeek: 2, // Tuesday
    startTime: '07:00',
    endTime: '15:00',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'avail-18',
    technicianId: 'tech-4',
    dayOfWeek: 3, // Wednesday
    startTime: '07:00',
    endTime: '15:00',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'avail-19',
    technicianId: 'tech-4',
    dayOfWeek: 4, // Thursday
    startTime: '07:00',
    endTime: '15:00',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'avail-20',
    technicianId: 'tech-4',
    dayOfWeek: 5, // Friday
    startTime: '07:00',
    endTime: '15:00',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockRecurringJobs: RecurringJob[] = [
  {
    id: 'recurring-1',
    title: 'Weekly Office Cleaning',
    description: 'Regular office cleaning service',
    clientId: 'client-1',
    client: {
      id: 'client-1',
      name: 'ABC Corporation',
      email: 'contact@abc.com',
      phone: '555-123-4567',
      address: {
        street: '123 Business St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      tags: ['corporate', 'recurring'],
      leadScore: 85,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    frequency: 'weekly',
    dayOfWeek: 1, // Monday
    startTime: '18:00',
    duration: 2,
    isActive: true,
    nextOccurrence: new Date('2024-12-23T18:00:00Z'),
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'recurring-2',
    title: 'Monthly HVAC Maintenance',
    description: 'Monthly HVAC system check and maintenance',
    clientId: 'client-2',
    client: {
      id: 'client-2',
      name: 'XYZ Building',
      email: 'maintenance@xyz.com',
      phone: '555-987-6543',
      address: {
        street: '456 Commercial Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA',
      },
      tags: ['commercial', 'maintenance'],
      leadScore: 92,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    frequency: 'monthly',
    dayOfWeek: 1, // First Monday of month
    startTime: '09:00',
    duration: 3,
    isActive: true,
    nextOccurrence: new Date('2025-01-06T09:00:00Z'),
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z',
  },
  {
    id: 'recurring-3',
    title: 'Quarterly Electrical Inspection',
    description: 'Quarterly electrical system inspection and testing',
    clientId: 'client-3',
    client: {
      id: 'client-3',
      name: 'Industrial Complex',
      email: 'safety@industrial.com',
      phone: '555-456-7890',
      address: {
        street: '789 Industrial Blvd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA',
      },
      tags: ['industrial', 'safety'],
      leadScore: 78,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    frequency: 'quarterly',
    dayOfWeek: 1, // First Monday of quarter
    startTime: '08:00',
    duration: 8,
    isActive: true,
    nextOccurrence: new Date('2025-01-06T08:00:00Z'),
    createdAt: '2024-10-01T00:00:00Z',
    updatedAt: '2024-10-01T00:00:00Z',
  },
];

export const getTechnicianAvailability = (technicianId: string, date: Date) => {
  const dayOfWeek = date.getDay();
  const availability = mockAvailability.find(
    avail => avail.technicianId === technicianId && avail.dayOfWeek === dayOfWeek
  );
  return availability;
};

export const getTechnicianSchedule = (technicianId: string, startDate: Date, endDate: Date) => {
  return mockScheduleEvents.filter(event => {
    const eventDate = new Date(event.start);
    return event.technicianId === technicianId && 
           eventDate >= startDate && 
           eventDate <= endDate;
  });
};

export const getConflictingEvents = (technicianId: string, startTime: Date, endTime: Date) => {
  return mockScheduleEvents.filter(event => {
    if (event.technicianId !== technicianId) return false;
    
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    
    // Check for overlap
    return (startTime < eventEnd && endTime > eventStart);
  });
};

export const generateRecurringEvents = (recurringJob: RecurringJob, startDate: Date, endDate: Date) => {
  const events: ScheduleEvent[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Find the next occurrence based on frequency
    let nextDate = new Date(currentDate);
    
    switch (recurringJob.frequency) {
      case 'weekly':
        // Find next occurrence of the specified day of week
        const daysUntilTarget = (recurringJob.dayOfWeek - currentDate.getDay() + 7) % 7;
        nextDate.setDate(currentDate.getDate() + daysUntilTarget);
        break;
      case 'monthly':
        // Find first occurrence of the specified day of week in the month
        nextDate.setDate(1);
        const firstDayOfMonth = nextDate.getDay();
        const daysUntilFirstTarget = (recurringJob.dayOfWeek - firstDayOfMonth + 7) % 7;
        nextDate.setDate(1 + daysUntilFirstTarget);
        break;
      case 'quarterly':
        // Find first occurrence of the specified day of week in the quarter
        const quarterStart = new Date(currentDate.getFullYear(), Math.floor(currentDate.getMonth() / 3) * 3, 1);
        nextDate = new Date(quarterStart);
        const firstDayOfQuarter = nextDate.getDay();
        const daysUntilFirstTargetQuarter = (recurringJob.dayOfWeek - firstDayOfQuarter + 7) % 7;
        nextDate.setDate(1 + daysUntilFirstTargetQuarter);
        break;
    }
    
    if (nextDate >= startDate && nextDate <= endDate) {
      const eventStart = new Date(nextDate);
      eventStart.setHours(parseInt(recurringJob.startTime.split(':')[0]), parseInt(recurringJob.startTime.split(':')[1]));
      
      const eventEnd = new Date(eventStart);
      eventEnd.setHours(eventStart.getHours() + recurringJob.duration);
      
      events.push({
        id: `recurring-${recurringJob.id}-${nextDate.getTime()}`,
        title: recurringJob.title,
        start: eventStart,
        end: eventEnd,
        status: 'scheduled',
        type: 'job',
        description: recurringJob.description,
        location: recurringJob.client.address.street,
        color: '#8B5CF6',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      });
    }
    
    // Move to next period
    switch (recurringJob.frequency) {
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case 'quarterly':
        currentDate.setMonth(currentDate.getMonth() + 3);
        break;
    }
  }
  
  return events;
};

export const getScheduleStats = () => {
  const totalEvents = mockScheduleEvents.length;
  const scheduledEvents = mockScheduleEvents.filter(event => event.status === 'scheduled').length;
  const inProgressEvents = mockScheduleEvents.filter(event => event.status === 'in_progress').length;
  const completedEvents = mockScheduleEvents.filter(event => event.status === 'completed').length;
  
  return {
    total: totalEvents,
    scheduled: scheduledEvents,
    inProgress: inProgressEvents,
    completed: completedEvents,
  };
};
