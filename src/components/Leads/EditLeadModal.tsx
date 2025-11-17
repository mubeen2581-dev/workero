import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lead } from '@/types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { mockLeadSources } from '@/mocks/leads';

const editLeadSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'quoted', 'converted', 'lost']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  estimatedValue: z.number().min(0, 'Estimated value must be 0 or greater').optional(),
  notes: z.string().optional(),
  assignedTo: z.string().uuid().optional().nullable(),
});

type EditLeadFormData = z.infer<typeof editLeadSchema>;

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditLeadFormData) => void;
  lead: Lead | null;
  isLoading?: boolean;
}

const EditLeadModal: React.FC<EditLeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  lead,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EditLeadFormData>({
    resolver: zodResolver(editLeadSchema),
  });

  // Reset form when lead changes
  useEffect(() => {
    if (lead && isOpen) {
      reset({
        status: lead.status as any,
        priority: lead.priority as any,
        estimatedValue: lead.estimatedValue || lead.estimated_value || 0,
        notes: lead.notes || '',
        assignedTo: lead.assignedTo || lead.assigned_to || null,
      });
    }
  }, [lead, isOpen, reset]);

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'quoted', label: 'Quoted' },
    { value: 'converted', label: 'Converted' },
    { value: 'lost', label: 'Lost' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const handleFormSubmit = (data: EditLeadFormData) => {
    onSubmit(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!lead) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Lead"
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Client Info (Read-only) */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Client Information</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Name:</span> {lead.client?.name || 'N/A'}</p>
            <p><span className="font-medium">Email:</span> {lead.client?.email || 'N/A'}</p>
            <p><span className="font-medium">Phone:</span> {lead.client?.phone || 'N/A'}</p>
          </div>
        </div>

        {/* Status */}
        <div>
          <Select
            label="Status"
            options={statusOptions}
            {...register('status')}
            error={errors.status?.message}
          />
        </div>

        {/* Priority */}
        <div>
          <Select
            label="Priority"
            options={priorityOptions}
            {...register('priority')}
            error={errors.priority?.message}
          />
        </div>

        {/* Estimated Value */}
        <div>
          <Input
            label="Estimated Value (£)"
            type="number"
            step="0.01"
            min="0"
            {...register('estimatedValue', { valueAsNumber: true })}
            error={errors.estimatedValue?.message}
            defaultValue={lead.estimatedValue || lead.estimated_value || 0}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            {...register('notes')}
            rows={4}
            className="input w-full"
            placeholder="Add notes about this lead..."
            defaultValue={lead.notes || ''}
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          <Button variant="secondary" type="button" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditLeadModal;

