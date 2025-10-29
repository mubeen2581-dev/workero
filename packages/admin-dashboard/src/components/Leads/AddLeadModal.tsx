import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Tag } from 'lucide-react';
import { CreateLeadForm } from '@/types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { mockLeadSources } from '@/mocks/leads';

const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  source: z.enum(['website', 'referral', 'advertisement', 'cold_call', 'other']),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type CreateLeadFormData = z.infer<typeof createLeadSchema>;

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLeadForm) => void;
  isLoading?: boolean;
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [newTag, setNewTag] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateLeadFormData>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      source: 'website',
      tags: [],
    },
  });

  const sourceOptions = mockLeadSources.map(source => ({
    value: source.value,
    label: source.label,
  }));

  const handleFormSubmit = (data: CreateLeadFormData) => {
    const formData: CreateLeadForm = {
      ...data,
      tags,
    };
    onSubmit(formData);
  };

  const handleClose = () => {
    reset();
    setTags([]);
    setNewTag('');
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setValue('tags', updatedTags);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    setValue('tags', updatedTags);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Lead"
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="Enter client's full name"
            error={errors.name?.message}
            {...register('name')}
          />
          
          <Input
            label="Email Address"
            type="email"
            placeholder="client@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 123-4567"
            error={errors.phone?.message}
            {...register('phone')}
          />
          
          <Select
            label="Lead Source"
            options={sourceOptions}
            placeholder="Select lead source"
            error={errors.source?.message}
            {...register('source')}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder="Add a tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={addTag}
              disabled={!newTag.trim()}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            rows={4}
            className="input resize-none"
            placeholder="Add any additional notes about this lead..."
            {...register('notes')}
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-error-600">{errors.notes.message}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
          >
            Create Lead
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddLeadModal;
