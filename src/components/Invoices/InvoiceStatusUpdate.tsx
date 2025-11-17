import React, { useState } from 'react';
import { X, CheckCircle, Clock, Send, AlertTriangle, XCircle, FileText } from 'lucide-react';
import { Invoice } from '@/types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { toast } from 'react-toastify';

interface InvoiceStatusUpdateProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (invoiceId: string, newStatus: Invoice['status']) => void;
}

const InvoiceStatusUpdate: React.FC<InvoiceStatusUpdateProps> = ({
  invoice,
  isOpen,
  onClose,
  onStatusUpdate,
}) => {
  const [newStatus, setNewStatus] = useState<Invoice['status']>(invoice.status);
  const [notes, setNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions: Array<{ value: Invoice['status']; label: string; icon: React.ComponentType<any>; color: string }> = [
    { value: 'draft', label: 'Draft', icon: FileText, color: 'bg-gray-100 text-gray-800' },
    { value: 'sent', label: 'Sent', icon: Send, color: 'bg-blue-100 text-blue-800' },
    { value: 'paid', label: 'Paid', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    { value: 'overdue', label: 'Overdue', icon: AlertTriangle, color: 'bg-red-100 text-red-800' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'bg-gray-100 text-gray-800' },
  ];

  const getStatusInfo = (status: Invoice['status']) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[0];
  };

  const handleUpdate = async () => {
    if (newStatus === invoice.status) {
      toast.error('Status unchanged');
      return;
    }

    setIsUpdating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onStatusUpdate(invoice.id, newStatus);
      toast.success(`Invoice status updated to ${getStatusInfo(newStatus).label}`);
      onClose();
    } catch (error) {
      toast.error('Failed to update invoice status');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  const currentStatusInfo = getStatusInfo(invoice.status);
  const newStatusInfo = getStatusInfo(newStatus);
  const CurrentIcon = currentStatusInfo.icon;
  const NewIcon = newStatusInfo.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Update Invoice Status</h2>
            <p className="text-sm text-gray-600">Invoice: {invoice.id}</p>
          </div>

          {/* Current Status */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CurrentIcon className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600 mb-1">Current Status</p>
                  <Badge className={currentStatusInfo.color}>
                    {currentStatusInfo.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* New Status Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status *
            </label>
            <Select
              value={newStatus}
              onChange={(value) => setNewStatus(value as Invoice['status'])}
              options={statusOptions.map(opt => ({
                value: opt.value,
                label: opt.label,
              }))}
            />
          </div>

          {/* New Status Preview */}
          {newStatus !== invoice.status && (
            <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3">
                <NewIcon className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-600 mb-1">New Status</p>
                  <Badge className={newStatusInfo.color}>
                    {newStatusInfo.label}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Add notes about this status change..."
            />
          </div>

          {/* Warning Messages */}
          {newStatus === 'cancelled' && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Cancelling this invoice cannot be undone. Please confirm this action.
              </p>
            </div>
          )}

          {newStatus === 'paid' && invoice.status !== 'paid' && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ Marking as paid will update the invoice payment status.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleUpdate}
              className="flex-1"
              disabled={isUpdating || newStatus === invoice.status}
            >
              {isUpdating ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceStatusUpdate;

