import React, { useState } from 'react';
import { Users, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Select from '../ui/Select';
import { useLeadWorkloads } from '@/services/leadQueries';
import { LeadWorkload } from '@/types';

interface WorkloadStatisticsProps {
  onUserSelect?: (userId: string) => void;
}

const WorkloadStatistics: React.FC<WorkloadStatisticsProps> = ({ onUserSelect }) => {
  const [roleFilter, setRoleFilter] = useState<string>('');
  const { data: workloads = [], isLoading, error } = useLeadWorkloads(roleFilter || undefined);

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'dispatcher', label: 'Dispatcher' },
  ];

  const totalStats = React.useMemo(() => {
    return workloads.reduce(
      (acc, workload) => ({
        totalLeads: acc.totalLeads + workload.total_leads,
        activeLeads: acc.activeLeads + workload.active_leads,
        urgentLeads: acc.urgentLeads + workload.urgent_leads,
      }),
      { totalLeads: 0, activeLeads: 0, urgentLeads: 0 }
    );
  }, [workloads]);

  const getWorkloadStatus = (workload: LeadWorkload) => {
    if (workload.urgent_leads > 0) return 'urgent';
    if (workload.active_leads > 10) return 'high';
    if (workload.active_leads > 5) return 'medium';
    return 'low';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p className="font-medium">Error loading workloads</p>
          <p className="text-sm mt-1">Please try again later</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : totalStats.totalLeads}
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-xl">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Active Leads</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : totalStats.activeLeads}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Urgent Leads</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : totalStats.urgentLeads}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Workload Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">User Workloads</h3>
          <div className="w-48">
            <Select
              options={roleOptions}
              value={roleFilter}
              onChange={setRoleFilter}
              placeholder="Filter by role"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Loading workloads...</span>
          </div>
        ) : workloads.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No users found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {workloads.map((workload) => {
              const status = getWorkloadStatus(workload);
              return (
                <div
                  key={workload.user_id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${getStatusColor(status)}`}
                  onClick={() => onUserSelect?.(workload.user_id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">{workload.user_name}</h4>
                        <Badge variant="secondary" size="sm">
                          {workload.role}
                        </Badge>
                        <Badge
                          variant={status === 'urgent' ? 'danger' : status === 'high' ? 'warning' : 'primary'}
                          size="sm"
                        >
                          {status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{workload.active_leads}</p>
                        <p className="text-xs text-gray-600">Active</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{workload.total_leads}</p>
                        <p className="text-xs text-gray-600">Total</p>
                      </div>
                      {workload.urgent_leads > 0 && (
                        <div className="text-center">
                          <p className="font-semibold text-red-600">{workload.urgent_leads}</p>
                          <p className="text-xs text-gray-600">Urgent</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default WorkloadStatistics;

