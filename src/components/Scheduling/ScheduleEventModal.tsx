import React, { useEffect, useMemo, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { ScheduleEvent } from '@/types';

export type ScheduleEventFormValues = {
  title: string;
  description?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  type: 'job' | 'break' | 'training' | 'maintenance' | 'meeting';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  location?: string;
  technicianId?: string;
  start: Date;
  end: Date;
};

interface ScheduleEventModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialEvent?: ScheduleEvent | null;
  defaultStart?: Date | null;
  defaultTechnicianId?: string;
  onClose: () => void;
  onSubmit: (values: ScheduleEventFormValues) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
  isSubmitting?: boolean;
  isDeleting?: boolean;
}

const toInputValue = (date: Date) => {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

const emptyForm = {
  title: '',
  description: '',
  status: 'scheduled' as const,
  type: 'job' as const,
  priority: '',
  location: '',
  technicianId: '',
};

const ScheduleEventModal: React.FC<ScheduleEventModalProps> = ({
  isOpen,
  mode,
  initialEvent,
  defaultStart,
  defaultTechnicianId,
  onClose,
  onSubmit,
  onDelete,
  isSubmitting = false,
  isDeleting = false,
}) => {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    start: toInputValue(defaultStart || new Date()),
    end: toInputValue(new Date((defaultStart || new Date()).getTime() + 60 * 60 * 1000)),
  }));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && initialEvent) {
      setForm({
        title: initialEvent.title ?? '',
        description: initialEvent.description ?? '',
        status: initialEvent.status,
        type: initialEvent.type,
        priority: initialEvent.priority ?? '',
        location: initialEvent.location ?? '',
        technicianId: initialEvent.technicianId ?? '',
        start: toInputValue(initialEvent.start),
        end: toInputValue(initialEvent.end),
      });
    } else if (mode === 'create') {
      const baseStart = defaultStart || new Date();
      setForm({
        ...emptyForm,
        technicianId: defaultTechnicianId || '',
        start: toInputValue(baseStart),
        end: toInputValue(new Date(baseStart.getTime() + 60 * 60 * 1000)),
      });
    }
  }, [mode, initialEvent, defaultStart, defaultTechnicianId, isOpen]);

  const statusOptions = useMemo(
    () => [
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'in_progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' },
    ],
    []
  );

  const typeOptions = useMemo(
    () => [
      { value: 'job', label: 'Job' },
      { value: 'meeting', label: 'Meeting' },
      { value: 'training', label: 'Training' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'break', label: 'Break' },
    ],
    []
  );

  const priorityOptions = useMemo(
    () => [
      { value: '', label: 'None' },
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'urgent', label: 'Urgent' },
    ],
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }

    const startDate = new Date(form.start);
    const endDate = new Date(form.end);
    if (endDate <= startDate) {
      setError('End time must be after start time.');
      return;
    }

    await onSubmit({
      title: form.title.trim(),
      description: form.description?.trim() || undefined,
      status: form.status,
      type: form.type,
      priority: (form.priority as ScheduleEventFormValues['priority']) || undefined,
      location: form.location?.trim() || undefined,
      technicianId: form.technicianId?.trim() || undefined,
      start: startDate,
      end: endDate,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add Schedule Event' : 'Edit Schedule Event'}
      size="lg"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Input
          label="Title"
          placeholder="Event title"
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="datetime-local"
            label="Start"
            value={form.start}
            onChange={(e) => setForm((prev) => ({ ...prev, start: e.target.value }))}
            required
          />
          <Input
            type="datetime-local"
            label="End"
            value={form.end}
            onChange={(e) => setForm((prev) => ({ ...prev, end: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Status"
            value={form.status}
            onChange={(value) => setForm((prev) => ({ ...prev, status: value as typeof prev.status }))}
            options={statusOptions}
          />
          <Select
            label="Type"
            value={form.type}
            onChange={(value) => setForm((prev) => ({ ...prev, type: value as typeof prev.type }))}
            options={typeOptions}
          />
          <Select
            label="Priority"
            value={form.priority}
            onChange={(value) => setForm((prev) => ({ ...prev, priority: value as typeof prev.priority }))}
            options={priorityOptions}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Technician ID"
            placeholder="Technician ID (optional)"
            value={form.technicianId}
            onChange={(e) => setForm((prev) => ({ ...prev, technicianId: e.target.value }))}
          />
          <Input
            label="Location"
            placeholder="Location (optional)"
            value={form.location}
            onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
          />
        </div>

        <Textarea
          label="Description"
          placeholder="Additional details"
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          rows={4}
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200">
          {mode === 'edit' && onDelete && (
            <Button
              type="button"
              variant="secondary"
              className="text-red-600 hover:text-red-700"
              onClick={() => onDelete()}
              disabled={isSubmitting || isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Event'}
            </Button>
          )}
          <div className="flex items-center gap-3 sm:ml-auto">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Event' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ScheduleEventModal;


