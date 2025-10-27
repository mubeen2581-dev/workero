import { mockScheduleEvents } from '@/mocks/schedules';
import { ScheduleEvent } from '@/types';

let events: ScheduleEvent[] = [...mockScheduleEvents];

export const SchedulingService = {
  list(): ScheduleEvent[] {
    return events;
  },

  updateEvent(id: string, patch: Partial<ScheduleEvent>): ScheduleEvent | undefined {
    const idx = events.findIndex((e) => e.id === id);
    if (idx === -1) return undefined;
    events[idx] = { ...events[idx], ...patch, updatedAt: new Date().toISOString() } as ScheduleEvent;
    return events[idx];
  },
};


