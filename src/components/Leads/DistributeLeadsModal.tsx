import React, { useState, useMemo } from 'react';
import { X, Users, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { useDistributeLeads, useLeadWorkloads } from '@/services/leadQueries';
import { Lead } from '@/types';

interface DistributeLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLeads: Lead[];
  onSuccess?: () => void;
}

const DistributeLeadsModal: React.FC<DistributeLeadsModalProps> = ({
  isOpen,
  onClose,
  selectedLeads,
  onSuccess,
}) => {
  const [method, setMethod] = useState<'round_robin' | 'workload' | 'priority'>('workload');
  const [role, setRole] = useState<string>('');
  const [distributionResult, setDistributionResult] = useState<any>(null);

  const { data: workloads = [], isLoading: workloadsLoading } = useLeadWorkloads(role || undefined);
  const distributeMutation = useDistributeLeads();

  const methodOptions = [
    { value: 'round_robin', label: 'Round Robin - Distribute evenly' },
    { value: 'workload', label: 'Workload-based - Assign to least busy' },
    { value: 'priority', label: 'Priority-based - Urgent first, then by workload' },
  ];

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'dispatcher', label: 'Dispatcher' },
  ];

  const unassignedLeads = useMemo(() => {
    return selectedLeads.filter(lead => !lead.assignedTo && !lead.assigned_to);
  }, [selectedLeads]);

  const handleDistribute = async () => {
    if (unassignedLeads.length === 0) {
      return;
    }

    try {
      const leadIds = unassignedLeads.map(lead => lead.id);
      const result = await distributeMutation.mutateAsync({
        leadIds,
        method,
        role: role || undefined,
      });
      
      setDistributionResult(result.data);
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Distribution failed:', error);
    }
  };

  const handleClose = () => {
    setDistributionResult(null);
    setMethod('workload');
    setRole('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Distribute Leads</h2>
            <p className="text-sm text-gray-600 mt-1">
              Automatically assign {unassignedLeads.length} unassigned lead(s)
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {distributionResult ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">
                Successfully distributed {distributionResult.total_distributed} lead(s)
              </span>
            </div>

            <Card className="p-4">
              <h3 className="font-medium text-gray-900 mb-3">Assignment Summary</h3>
              <div className="space-y-2">
                {distributionResult.assignments.map((assignment: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{assignment.user_name}</span>
                    </div>
                    <Badge variant="primary" size="sm">
                      Lead {index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Method Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distribution Method
              </label>
              <Select
                options={methodOptions}
                value={method}
                onChange={(value) => setMethod(value as any)}
              />
              <p className="text-xs text-gray-500 mt-1">
                {method === 'round_robin' && 'Leads will be distributed evenly among eligible users'}
                {method === 'workload' && 'Leads will be assigned to users with the fewest active leads'}
                {method === 'priority' && 'Urgent leads first, then distributed by workload'}
              </p>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Role (Optional)
              </label>
              <Select
                options={roleOptions}
                value={role}
                onChange={setRole}
              />
              <p className="text-xs text-gray-500 mt-1">
                Only assign to users with this role. Leave empty to use all eligible users.
              </p>
            </div>

            {/* Workload Preview */}
            {workloads.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Workloads
                </label>
                <Card className="p-4">
                  <div className="space-y-2">
                    {workloads.map((workload) => (
                      <div
                        key={workload.user_id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {workload.user_name}
                          </p>
                          <p className="text-xs text-gray-500">{workload.role}</p>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="text-center">
                            <p className="font-medium text-gray-900">{workload.active_leads}</p>
                            <p className="text-xs text-gray-500">Active</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-gray-900">{workload.total_leads}</p>
                            <p className="text-xs text-gray-500">Total</p>
                          </div>
                          {workload.urgent_leads > 0 && (
                            <Badge variant="danger" size="sm">
                              {workload.urgent_leads} Urgent
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Selected Leads Preview */}
            {unassignedLeads.length === 0 && (
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">
                  All selected leads are already assigned. Please select unassigned leads.
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleDistribute}
                disabled={unassignedLeads.length === 0 || distributeMutation.isPending}
                icon={distributeMutation.isPending ? Loader2 : Users}
              >
                {distributeMutation.isPending ? 'Distributing...' : 'Distribute Leads'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DistributeLeadsModal;

