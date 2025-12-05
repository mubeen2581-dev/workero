import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import { InventoryItem, Warehouse } from '@/types';
import { InventoryService, CreateStockAuditRequest } from '@/services/inventory';
import { toast } from 'react-toastify';

const auditSchema = z.object({
  item_id: z.string().uuid('Please select an item'),
  warehouse_id: z.string().uuid().optional(),
  expected_quantity: z.number().min(0, 'Expected quantity must be 0 or greater'),
  actual_quantity: z.number().min(0, 'Actual quantity must be 0 or greater'),
  reason: z.enum(['damaged', 'lost', 'theft', 'error', 'other']).optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  adjust_stock: z.boolean().default(false),
});

type AuditFormValues = z.infer<typeof auditSchema>;

interface StockAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  item?: InventoryItem;
  items?: InventoryItem[];
  warehouses?: Warehouse[];
}

const StockAuditModal: React.FC<StockAuditModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  item: preselectedItem,
  items = [],
  warehouses = [],
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(preselectedItem || null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<AuditFormValues>({
    resolver: zodResolver(auditSchema),
    defaultValues: {
      item_id: preselectedItem?.id || '',
      expected_quantity: preselectedItem?.current_stock || preselectedItem?.currentStock || 0,
      actual_quantity: preselectedItem?.current_stock || preselectedItem?.currentStock || 0,
      adjust_stock: false,
    },
  });

  const expectedQuantity = watch('expected_quantity');
  const actualQuantity = watch('actual_quantity');
  const variance = actualQuantity - expectedQuantity;

  useEffect(() => {
    if (preselectedItem) {
      setSelectedItem(preselectedItem);
      setValue('item_id', preselectedItem.id);
      setValue('expected_quantity', preselectedItem.current_stock || preselectedItem.currentStock || 0);
      setValue('actual_quantity', preselectedItem.current_stock || preselectedItem.currentStock || 0);
    }
  }, [preselectedItem, setValue]);

  useEffect(() => {
    if (!isOpen) {
      reset();
      setSelectedItem(preselectedItem || null);
    }
  }, [isOpen, reset, preselectedItem]);

  const handleItemChange = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    setSelectedItem(item || null);
    if (item) {
      setValue('item_id', item.id);
      setValue('expected_quantity', item.current_stock || item.currentStock || 0);
      setValue('actual_quantity', item.current_stock || item.currentStock || 0);
    }
  };

  const onSubmit = async (data: AuditFormValues) => {
    setIsSubmitting(true);
    try {
      const payload: CreateStockAuditRequest = {
        item_id: data.item_id,
        warehouse_id: data.warehouse_id || undefined,
        expected_quantity: data.expected_quantity,
        actual_quantity: data.actual_quantity,
        reason: data.reason || undefined,
        notes: data.notes || undefined,
        adjust_stock: data.adjust_stock,
      };

      await InventoryService.createAudit(payload);
      toast.success('Stock audit created successfully');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create stock audit';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Stock Audit</h2>
          <Button variant="ghost" size="sm" onClick={onClose} icon={X} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Item Selection */}
          {!preselectedItem && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inventory Item *
              </label>
              <Select
                value={watch('item_id')}
                onChange={(e) => handleItemChange(e.target.value)}
                error={errors.item_id?.message}
              >
                <option value="">Select an item</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.sku}) - Stock: {item.current_stock || item.currentStock || 0}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {/* Selected Item Info */}
          {selectedItem && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">{selectedItem.name}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">SKU:</span> {selectedItem.sku}
                </div>
                <div>
                  <span className="text-gray-600">Category:</span> {selectedItem.category}
                </div>
                <div>
                  <span className="text-gray-600">Location:</span> {selectedItem.location || 'N/A'}
                </div>
                <div>
                  <span className="text-gray-600">Last Audit:</span>{' '}
                  {selectedItem.last_audit_date || 'Never'}
                </div>
              </div>
            </div>
          )}

          {/* Warehouse Selection */}
          {warehouses.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warehouse (Optional)
              </label>
              <Select {...register('warehouse_id')}>
                <option value="">Select a warehouse</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {/* Expected Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Quantity *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              {...register('expected_quantity', { valueAsNumber: true })}
              error={errors.expected_quantity?.message}
            />
          </div>

          {/* Actual Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actual Quantity *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              {...register('actual_quantity', { valueAsNumber: true })}
              error={errors.actual_quantity?.message}
            />
          </div>

          {/* Variance Display */}
          {expectedQuantity !== undefined && actualQuantity !== undefined && (
            <div
              className={`p-4 rounded-lg flex items-center gap-3 ${
                variance === 0
                  ? 'bg-green-50 border border-green-200'
                  : variance > 0
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {variance === 0 ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              )}
              <div>
                <div className="font-semibold text-gray-900">
                  Variance: {variance > 0 ? '+' : ''}
                  {variance.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">
                  {variance === 0
                    ? 'Stock matches expected quantity'
                    : variance > 0
                    ? 'Stock is higher than expected (surplus)'
                    : 'Stock is lower than expected (shortage)'}
                </div>
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Variance (Optional)
            </label>
            <Select {...register('reason')}>
              <option value="">Select a reason</option>
              <option value="damaged">Damaged</option>
              <option value="lost">Lost</option>
              <option value="theft">Theft</option>
              <option value="error">Recording Error</option>
              <option value="other">Other</option>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <Textarea
              {...register('notes')}
              rows={3}
              error={errors.notes?.message}
              placeholder="Add any additional notes about this audit..."
            />
          </div>

          {/* Adjust Stock */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="adjust_stock"
              {...register('adjust_stock')}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="adjust_stock" className="text-sm font-medium text-gray-700">
              Automatically adjust stock to actual quantity
            </label>
          </div>

          {watch('adjust_stock') && variance !== 0 && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm text-yellow-800">
              <strong>Note:</strong> Stock will be adjusted from {expectedQuantity} to {actualQuantity}{' '}
              ({variance > 0 ? '+' : ''}
              {variance.toFixed(2)}). A stock movement record will be created.
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Audit'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StockAuditModal;


