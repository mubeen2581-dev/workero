import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Warehouse } from '@/types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import { useCreateWarehouse, useUpdateWarehouse } from '@/services/inventoryQueries';
import { CreateWarehouseRequest, UpdateWarehouseRequest } from '@/services/inventory';

interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouse?: Warehouse | null;
  onSuccess?: () => void;
}

const WarehouseModal: React.FC<WarehouseModalProps> = ({
  isOpen,
  onClose,
  warehouse,
  onSuccess,
}) => {
  const isEditMode = !!warehouse;
  const createMutation = useCreateWarehouse();
  const updateMutation = useUpdateWarehouse();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    contact_person: '',
    phone: '',
    email: '',
    is_active: true,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when editing
  useEffect(() => {
    if (warehouse) {
      setFormData({
        name: warehouse.name || '',
        code: warehouse.code || '',
        address: warehouse.address || '',
        city: warehouse.city || '',
        state: warehouse.state || '',
        zip_code: warehouse.zip_code ?? warehouse.zipCode ?? '',
        country: warehouse.country || '',
        contact_person: warehouse.contact_person ?? warehouse.contactPerson ?? '',
        phone: warehouse.phone || '',
        email: warehouse.email || '',
        is_active: warehouse.is_active ?? warehouse.isActive ?? true,
        notes: warehouse.notes || '',
      });
    } else {
      // Reset form for new warehouse
      setFormData({
        name: '',
        code: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
        contact_person: '',
        phone: '',
        email: '',
        is_active: true,
        notes: '',
      });
    }
    setErrors({});
  }, [warehouse, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Warehouse name is required';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Warehouse code is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditMode && warehouse) {
        const updateData: UpdateWarehouseRequest = {
          name: formData.name,
          code: formData.code,
          address: formData.address || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          zip_code: formData.zip_code || undefined,
          country: formData.country || undefined,
          contact_person: formData.contact_person || undefined,
          phone: formData.phone || undefined,
          email: formData.email || undefined,
          is_active: formData.is_active,
          notes: formData.notes || undefined,
        };
        await updateMutation.mutateAsync({ id: warehouse.id, data: updateData });
      } else {
        const createData: CreateWarehouseRequest = {
          name: formData.name,
          code: formData.code,
          address: formData.address || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          zip_code: formData.zip_code || undefined,
          country: formData.country || undefined,
          contact_person: formData.contact_person || undefined,
          phone: formData.phone || undefined,
          email: formData.email || undefined,
          is_active: formData.is_active,
          notes: formData.notes || undefined,
        };
        await createMutation.mutateAsync(createData);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      // Error handling is done by the mutation hooks
      console.error('Failed to save warehouse:', error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Warehouse' : 'Add Warehouse'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Warehouse Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Main Warehouse"
                error={errors.name}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Warehouse Code <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="WH-001"
                error={errors.code}
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <Textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Street address"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <Input
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <Input
                value={formData.zip_code}
                onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                placeholder="ZIP Code"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <Input
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              placeholder="Country"
            />
          </div>

          {/* Contact Information */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person
                </label>
                <Input
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="warehouse@example.com"
                error={errors.email}
              />
            </div>
          </div>

          {/* Additional Settings */}
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Active Warehouse
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about this warehouse..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Update Warehouse' : 'Create Warehouse'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default WarehouseModal;

