import React, { useEffect, useMemo, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { RecurringSchedule } from '@/types';

export type RecurringScheduleFormValues = {
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval: number;
  weekdays?: number[];
  monthDay?: number;
  startDate: Date;
  endDate?: Date | null;
  timezone?: string;
  durationMinutes: number;
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  location?: string;
  color?: string;
  jobId?: string;
  technicianId?: string;
  customDates?: string[];
};

interface RecurringScheduleModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialSchedule?: RecurringSchedule | null;
  onClose: () => void;
  onSubmit: (values: RecurringScheduleFormValues) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
  isSubmitting?: boolean;
  isDeleting?: boolean;
}

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom Dates' },
];

const priorityOptions = [
  { value: '', label: 'None' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const toInputValue = (date: Date | string | undefined | null) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
};

const fromInputValue = (value: string): Date => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date();
  }
  return date;
};

const RecurringScheduleModal: React.FC<RecurringScheduleModalProps> = ({
  isOpen,
  mode,
  initialSchedule,
  onClose,
  onSubmit,
  onDelete,
  isSubmitting = false,
  isDeleting = false,
}) => {
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('weekly');
  const [interval, setInterval] = useState<number>(1);
  const [weekdays, setWeekdays] = useState<number[]>([1]);
  const [monthDay, setMonthDay] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>(toInputValue(new Date()));
  const [endDate, setEndDate] = useState<string>('');
  const [timezone, setTimezone] = useState<string>('UTC');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [jobId, setJobId] = useState<string>('');
  const [technicianId, setTechnicianId] = useState<string>('');
  const [customDates, setCustomDates] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'edit' && initialSchedule) {
      setFrequency(initialSchedule.frequency);
      setInterval(initialSchedule.interval || 1);
      setWeekdays(initialSchedule.weekdays ?? []);
      setMonthDay(initialSchedule.monthDay ?? 1);
      setStartDate(toInputValue(initialSchedule.startDate));
      setEndDate(toInputValue(initialSchedule.endDate || ''));
      setTimezone(initialSchedule.timezone || 'UTC');
      setDurationMinutes(initialSchedule.constraints?.duration_minutes ?? 60);
      setTitle(initialSchedule.constraints?.title || initialSchedule.job?.title || '');
      setDescription(initialSchedule.constraints?.description || initialSchedule.job?.description || '');
      setPriority(initialSchedule.constraints?.priority || '');
      setLocation(initialSchedule.constraints?.location || initialSchedule.job?.client?.name || '');
      setColor(initialSchedule.constraints?.color || '');
      setJobId(initialSchedule.jobId || '');
      setTechnicianId(initialSchedule.technicianId || '');
      setCustomDates((initialSchedule.constraints?.custom_dates || []).join(', '));
    } else {
      const now = new Date();
      setFrequency('weekly');
      setInterval(1);
      setWeekdays([now.getDay()]);
      setMonthDay(now.getDate());
      setStartDate(toInputValue(now));
      setEndDate('');
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
      setDurationMinutes(60);
      setTitle('');
      setDescription('');
      setPriority('');
      setLocation('');
      setColor('');
      setJobId('');
      setTechnicianId('');
      setCustomDates('');
    }
    setError(null);
  }, [isOpen, mode, initialSchedule]);

  const toggleWeekday = (day: number) => {
    setWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const start = fromInputValue(startDate);
    const end = endDate ? fromInputValue(endDate) : null;

    if (!startDate) {
      setError('Start date/time is required.');
      return;
    }

    if (!Number.isFinite(interval) || interval < 1) {
      setError('Interval must be at least 1.');
      return;
    }

    if (frequency === 'weekly' && weekdays.length === 0) {
      setError('Select at least one weekday for weekly schedules.');
      return;
    }

    if (frequency === 'monthly' && (!monthDay || monthDay < 1 || monthDay > 31)) {
      setError('Select a valid day of the month (1-31).');
      return;
    }

    if (frequency === 'custom' && !customDates.trim()) {
      setError('Provide at least one custom date.');
      return;
    }

    await onSubmit({
      frequency,
      interval,
      weekdays: frequency === 'weekly' ? weekdays : undefined,
      monthDay: frequency === 'monthly' ? monthDay : undefined,
      startDate: start,
      endDate: end || undefined,
      timezone,
      durationMinutes,
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      priority: (priority as RecurringScheduleFormValues['priority']) || undefined,
      location: location.trim() || undefined,
      color: color.trim() || undefined,
      jobId: jobId.trim() || undefined,
      technicianId: technicianId.trim() || undefined,
      customDates:
        frequency === 'custom'
          ? customDates
              .split(',')
              .map((c) => c.trim())
              .filter(Boolean)
          : undefined,
    });
  };

  const showWeekdayPicker = frequency === 'weekly';
  const showMonthDay = frequency === 'monthly';
  const showCustomDates = frequency === 'custom';

  const footerActions = useMemo(
    () => (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200">
        {mode === 'edit' && onDelete && (
          <Button
            type="button"
            variant="secondary"
            className="text-red-600 hover:text-red-700"
            onClick={() => onDelete()}
            disabled={isSubmitting || isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Schedule'}
          </Button>
        )}
        <div className="flex items-center gap-3 sm:ml-auto">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Schedule' : 'Save Changes'}
          </Button>
        </div>
      </div>
    ),
    [mode, onDelete, isDeleting, isSubmitting, onClose]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create Recurring Schedule' : 'Edit Recurring Schedule'}
      size="lg"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Job ID"
            placeholder="Optional job ID"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
          />
          <Input
            label="Technician ID"
            placeholder="Optional technician ID"
            value={technicianId}
            onChange={(e) => setTechnicianId(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Frequency"
            value={frequency}
            options={frequencyOptions}
            onChange={(value) => setFrequency(value as typeof frequency)}
          />
          <Input
            label="Interval"
            type="number"
            min={1}
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            required
          />
          <Input
            label="Time Zone"
            placeholder="e.g. UTC, America/New_York"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          />
        </div>

        {showWeekdayPicker && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Weekdays</p>
            <div className="flex flex-wrap gap-2">
              {weekdayLabels.map((label, idx) => (
                <button
                  type="button"
                  key={label}
                  className={`px-3 py-1 rounded-full border text-sm ${
                    weekdays.includes(idx)
                      ? 'bg-primary-100 text-primary-700 border-primary-200'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                  onClick={() => toggleWeekday(idx)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {showMonthDay && (
          <Input
            type="number"
            label="Day of Month"
            min={1}
            max={31}
            value={monthDay}
            onChange={(e) => setMonthDay(Number(e.target.value))}
          />
        )}

        {showCustomDates && (
          <Textarea
            label="Custom Dates"
            placeholder="Comma-separated dates (YYYY-MM-DD)"
            value={customDates}
            onChange={(e) => setCustomDates(e.target.value)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="datetime-local"
            label="Start Date & Time"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            type="datetime-local"
            label="End Date (optional)"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="number"
            min={15}
            label="Duration (minutes)"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
          />
          <Select
            label="Priority"
            value={priority}
            onChange={(value) => setPriority(value)}
            options={priorityOptions}
          />
          <Input
            label="Color (hex or CSS color)"
            placeholder="#3B82F6"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        <Input
          label="Location"
          placeholder="Optional location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <Input
          label="Title (Display)"
          placeholder="Optional override for job title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          label="Description"
          placeholder="Optional description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        {footerActions}
      </form>
    </Modal>
  );
};

export default RecurringScheduleModal;


