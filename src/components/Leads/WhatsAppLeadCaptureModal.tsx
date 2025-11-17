import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { mockLeadSources } from '@/mocks/leads';

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email().optional().or(z.literal('')),
  source: z.string(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  defaultPhone?: string;
  defaultName?: string;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

const WhatsAppLeadCaptureModal: React.FC<Props> = ({ isOpen, defaultPhone, defaultName, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { source: 'website', phone: defaultPhone, name: defaultName },
  });

  const sourceOptions = [{ value: 'whatsapp', label: 'WhatsApp' }, ...mockLeadSources.map(s => ({ value: s.value, label: s.label }))];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Lead from WhatsApp" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Name" placeholder="Client name" error={errors.name?.message} {...register('name')} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Phone" placeholder="WhatsApp number" error={errors.phone?.message} {...register('phone')} />
          <Input label="Email" placeholder="client@example.com" error={errors.email?.message} {...register('email')} />
        </div>
        <Select label="Source" options={sourceOptions} {...register('source')} />
        <textarea className="input" rows={4} placeholder="Notes" {...register('notes')} />
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">Create Lead</Button>
        </div>
      </form>
    </Modal>
  );
};

export default WhatsAppLeadCaptureModal;


