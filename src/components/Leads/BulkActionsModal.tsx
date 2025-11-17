import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { Lead } from '@/types';
import { useUpdateLeadStatus, useAssignLead, useDeleteLead } from '@/services/leadQueries';
import { useLeadWorkloads } from '@/services/leadQueries';

interface BulkActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLeads: Lead[];
  action: 'status' | 'assign' | 'delete';
  onSuccess?: () => void;
}

const BulkActionsModal: React.FC<BulkActionsModalProps> = ({
  isOpen,
  onClose,
  selectedLeads,
  action,
  onSuccess,
}) => {
  const [status, setStatus] = useState<string>('');
  const [assignedTo, setAssignedTo] = useState<string>('');

  const updateStatusMutation = useUpdateLeadStatus();
  const assignMutation = useAssignLead();
  const deleteMutation = useDeleteLead();
  const { data: workloads = [] } = useLeadWorkloads();

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'quoted', label: 'Quoted' },
    { value: 'converted', label: 'Converted' },
    { value: 'lost', label: 'Lost' },
  ];

  const userOptions = workloads.map(workload => ({
    value: workload.user_id,
    label: workload.user_name,
  }));

  const handleSubmit = async () => {
    try {
      if (action === 'status' && status) {
        await Promise.all(
          selectedLeads.map(lead =>
            updateStatusMutation.mutateAsync({
              id: lead.id,
              data: { status: status as any },
            })
          )
        );
      } else if (action === 'assign' && assignedTo) {
        await Promise.all(
          selectedLeads.map(lead =>
            assignMutation.mutateAsync({
              id: lead.id,
              data: { assignedTo: assignedTo },
            })
          )
        );
      } else if (action === 'delete') {
        await Promise.all(
          selectedLeads.map(lead => deleteMutation.mutateAsync(lead.id))
        );
      }

      if (onSuccess) {
        onSuccess();
      }
      handleClose();
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const handleClose = () => {
    setStatus('');
    setAssignedTo('');
    onClose();
  };

  const getTitle = () => {
    switch (action) {
      case 'status':
        return `Update Status for ${selectedLeads.length} Lead(s)`;
      case 'assign':
        return `Assign ${selectedLeads.length} Lead(s)`;
      case 'delete':
        return `Delete ${selectedLeads.length} Lead(s)`;
      default:
        return 'Bulk Action';
    }
  };

  const isLoading =
    updateStatusMutation.isPending ||
    assignMutation.isPending ||
    deleteMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {action === 'delete' ? (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                Are you sure you want to delete {selectedLeads.length} lead(s)? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end space-x-3 pt-4 border-t">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleSubmit}
                disabled={isLoading}
                icon={isLoading ? Loader2 : undefined}
              >
                {isLoading ? 'Deleting...' : 'Delete Leads'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {action === 'status' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <Select
                  options={statusOptions}
                  value={status}
                  onChange={setStatus}
                />
              </div>
            )}

            {action === 'assign' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign To
                </label>
                <Select
                  options={userOptions}
                  value={assignedTo}
                  onChange={setAssignedTo}
                />
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-4 border-t">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={
                  isLoading ||
                  (action === 'status' && !status) ||
                  (action === 'assign' && !assignedTo)
                }
                icon={isLoading ? Loader2 : undefined}
              >
                {isLoading
                  ? 'Processing...'
                  : action === 'status'
                  ? 'Update Status'
                  : action === 'assign'
                  ? 'Assign Leads'
                  : 'Confirm'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BulkActionsModal;

