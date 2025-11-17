import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, User, MapPin, Clock } from 'lucide-react';
import { Quote, Job } from '@/types';
import { mockTechnicians } from '@/mocks/jobs';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface ConvertToJobModalProps {
  quote: Quote;
  isOpen: boolean;
  onClose: () => void;
  onConvert: (jobData: Partial<Job>) => void;
  isLoading?: boolean;
}

const ConvertToJobModal: React.FC<ConvertToJobModalProps> = ({
  quote,
  isOpen,
  onClose,
  onConvert,
  isLoading = false,
}) => {
  const [jobTitle, setJobTitle] = useState(`${quote.client.name} - Project`);
  const [scheduledDate, setScheduledDate] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(8);
  const [assignedTechnician, setAssignedTechnician] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [notes, setNotes] = useState(quote.notes || '');

  const technicianOptions = [
    { value: '', label: 'Select Technician' },
    ...mockTechnicians.map(tech => ({
      value: tech.id,
      label: `${tech.firstName} ${tech.lastName}`,
    })),
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const handleConvert = () => {
    const jobData: Partial<Job> = {
      clientId: quote.clientId,
      client: quote.client,
      quoteId: quote.id,
      title: jobTitle,
      description: `Job created from Quote #${quote.id.split('-')[1].toUpperCase()}`,
      status: 'scheduled',
      priority,
      estimatedDuration,
      assignedTechnician: assignedTechnician || undefined,
      scheduledDate: scheduledDate ? new Date(scheduledDate).toISOString() : new Date().toISOString(),
      location: {
        address: `${quote.client.address.street}, ${quote.client.address.city}, ${quote.client.address.state}`,
        coordinates: {
          lat: 40.7128 + (Math.random() - 0.5) * 0.1,
          lng: -74.0060 + (Math.random() - 0.5) * 0.1,
        },
      },
      materials: quote.items.map(item => ({
        id: `mat-${item.id}`,
        name: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.lineTotal,
        category: 'General',
      })),
      photos: [],
      notes,
    };

    onConvert(jobData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Convert Quote to Job"
      size="lg"
    >
      <div className="space-y-4">
        {/* Quote Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900">
              Quote #{quote.id.split('-')[1].toUpperCase()}
            </h4>
            <span className="text-lg font-bold text-primary-600">
              {formatCurrency(quote.total)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Client:</span>
              <span className="ml-2 text-gray-900">{quote.client.name}</span>
            </div>
            <div>
              <span className="text-gray-600">Items:</span>
              <span className="ml-2 text-gray-900">{quote.items.length}</span>
            </div>
          </div>
        </div>

        {/* Job Details Form */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Enter job title"
            icon={Briefcase}
          />
          
          <Input
            label="Scheduled Date"
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            icon={Calendar}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (hrs)
            </label>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(parseInt(e.target.value) || 0)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="1"
                max="100"
              />
            </div>
          </div>
          
          <Select
            label="Priority"
            options={priorityOptions}
            value={priority}
            onChange={(value) => setPriority(value as any)}
          />

          <Select
            label="Technician"
            options={technicianOptions}
            value={assignedTechnician}
            onChange={setAssignedTechnician}
            placeholder="Select technician"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes for this job..."
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            rows={2}
          />
        </div>

        {/* Location Info */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center mb-1">
            <MapPin className="w-4 h-4 text-blue-600 mr-2" />
            <h4 className="text-sm font-medium text-blue-900">Job Location</h4>
          </div>
          <p className="text-sm text-blue-800">
            {quote.client.address.street}, {quote.client.address.city}, {quote.client.address.state} {quote.client.address.zipCode}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConvert}
            loading={isLoading}
            disabled={!jobTitle.trim() || !scheduledDate}
            icon={Briefcase}
          >
            Create Job
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConvertToJobModal;