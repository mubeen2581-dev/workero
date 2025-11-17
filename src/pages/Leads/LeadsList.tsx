import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical,
  Grid,
  List,
  Users,
  TrendingUp,
  Clock,
  Loader2,
  X
} from 'lucide-react';
import { Lead } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableHeaderCell } from '@/components/ui/Table';
import LeadCard from '@/components/Leads/LeadCard';
import LeadTableRow from '@/components/Leads/LeadTableRow';
import AddLeadModal from '@/components/Leads/AddLeadModal';
import ChatPane from '@/components/Leads/ChatPane';
import PermissionGate from '@/components/auth/PermissionGate';
import { getMessagesForLead } from '@/mocks/messages';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead, useAssignLead, useUpdateLeadStatus } from '@/services/leadQueries';
import { LeadFilters } from '@/services/leads';
import DistributeLeadsModal from '@/components/Leads/DistributeLeadsModal';
import WorkloadStatistics from '@/components/Leads/WorkloadStatistics';
import BulkActionsBar from '@/components/Leads/BulkActionsBar';
import BulkActionsModal from '@/components/Leads/BulkActionsModal';
import { exportLeadsToCSV } from '@/utils/exportLeads';

type ViewMode = 'grid' | 'table';
type SortField = 'name' | 'createdAt' | 'estimatedValue' | 'leadScore';
type SortDirection = 'asc' | 'desc';

// Helper function to normalize lead data from backend
const normalizeLead = (lead: any): Lead => {
  return {
    id: lead.id,
    clientId: lead.client_id || lead.clientId,
    client_id: lead.client_id,
    client: lead.client ? {
      id: lead.client.id,
      name: lead.client.name,
      email: lead.client.email,
      phone: lead.client.phone,
      address: lead.client.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      tags: lead.client.tags || [],
      leadScore: lead.client.lead_score || lead.client.leadScore || 0,
      createdAt: lead.client.created_at || lead.client.createdAt || '',
      updatedAt: lead.client.updated_at || lead.client.updatedAt || '',
    } : undefined,
    source: lead.source,
    status: lead.status,
    priority: lead.priority,
    estimatedValue: lead.estimated_value || lead.estimatedValue,
    estimated_value: lead.estimated_value,
    notes: lead.notes,
    assignedTo: lead.assigned_to || lead.assignedTo,
    assigned_to: lead.assigned_to,
    assigned_user: lead.assigned_user,
    createdAt: lead.created_at || lead.createdAt,
    created_at: lead.created_at,
    updatedAt: lead.updated_at || lead.updatedAt,
    updated_at: lead.updated_at,
  };
};

const LeadsList: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [showWorkloads, setShowWorkloads] = useState(false);
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [showBulkActionsModal, setShowBulkActionsModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<'status' | 'assign' | 'delete' | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [assignedToFilter, setAssignedToFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // Build filters for API
  const apiFilters: LeadFilters = useMemo(() => {
    const filters: LeadFilters = {};
    
    if (searchQuery?.trim()) filters.search = searchQuery.trim();
    if (statusFilter) filters.status = statusFilter;
    if (priorityFilter) filters.priority = priorityFilter;
    if (sourceFilter) filters.source = sourceFilter;
    if (assignedToFilter?.trim()) filters.assignedTo = assignedToFilter.trim();
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;
    
    // Map frontend sort fields to backend
    const sortMap: Record<SortField, string> = {
      name: 'client_name',
      createdAt: 'created_at',
      estimatedValue: 'estimated_value',
      leadScore: 'lead_score',
    };
    
    if (sortField && sortMap[sortField]) {
      filters.sort = sortMap[sortField];
      filters.direction = sortDirection;
    }
    
    return filters;
  }, [searchQuery, statusFilter, priorityFilter, sourceFilter, assignedToFilter, dateFrom, dateTo, sortField, sortDirection]);

  // Fetch leads from API
  const { data: leadsData = [], isLoading, error } = useLeads(apiFilters);
  const createLeadMutation = useCreateLead();

  // Normalize leads data
  const normalizedLeads = useMemo(() => {
    return leadsData.map(normalizeLead);
  }, [leadsData]);

  // Get selected leads
  const selectedLeads = useMemo(() => {
    return normalizedLeads.filter(lead => selectedLeadIds.has(lead.id));
  }, [normalizedLeads, selectedLeadIds]);

  // Handle lead selection
  const handleSelectLead = useCallback((leadId: string, selected: boolean) => {
    setSelectedLeadIds(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(leadId);
      } else {
        newSet.delete(leadId);
      }
      return newSet;
    });
  }, []);

  // Handle select all
  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedLeadIds(new Set(normalizedLeads.map(lead => lead.id)));
    } else {
      setSelectedLeadIds(new Set());
    }
  }, [normalizedLeads]);

  const isAllSelected = normalizedLeads.length > 0 && selectedLeadIds.size === normalizedLeads.length;
  const isSomeSelected = selectedLeadIds.size > 0 && selectedLeadIds.size < normalizedLeads.length;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleLeadClick = (lead: Lead) => {
    // Navigate to lead detail page instead of opening chat
    window.location.href = `/leads/${lead.id}`;
  };

  const handleMessageClick = (lead: Lead) => {
    setSelectedLead(lead);
    setShowChat(true);
  };

  // Individual lead action handlers
  const updateLeadMutation = useUpdateLead();
  const deleteLeadMutation = useDeleteLead();
  const assignLeadMutation = useAssignLead();
  const updateStatusMutation = useUpdateLeadStatus();

  const handleEditLead = (lead: Lead) => {
    // Navigate to lead detail page for editing
    window.location.href = `/leads/${lead.id}`;
  };

  const handleDeleteLead = async (lead: Lead) => {
    if (window.confirm(`Are you sure you want to delete this lead? This action cannot be undone.`)) {
      try {
        await deleteLeadMutation.mutateAsync(lead.id);
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  const handleAssignLead = async (lead: Lead) => {
    // This will be handled by a modal or inline assignment
    // For now, we'll use the bulk assign modal with a single lead
    setSelectedLeadIds(new Set([lead.id]));
    setBulkAction('assign');
    setShowBulkActionsModal(true);
  };

  const handleViewDetails = (lead: Lead) => {
    window.location.href = `/leads/${lead.id}`;
  };

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('');
    setPriorityFilter('');
    setSourceFilter('');
    setAssignedToFilter('');
    setDateFrom('');
    setDateTo('');
    setShowAdvancedFilters(false);
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      searchQuery ||
      statusFilter ||
      priorityFilter ||
      sourceFilter ||
      assignedToFilter ||
      dateFrom ||
      dateTo
    );
  }, [searchQuery, statusFilter, priorityFilter, sourceFilter, assignedToFilter, dateFrom, dateTo]);

  const handleAddLead = useCallback(async (data: any) => {
    try {
      await createLeadMutation.mutateAsync(data);
      setShowAddModal(false);
    } catch (error) {
      // Error is handled by the mutation's onError
      console.error('Failed to create lead:', error);
    }
  }, [createLeadMutation]);

  const getSortDirection = (field: SortField) => {
    return sortField === field ? sortDirection : null;
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'quoted', label: 'Quoted' },
    { value: 'converted', label: 'Converted' },
    { value: 'lost', label: 'Lost' },
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const sourceOptions = [
    { value: '', label: 'All Sources' },
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Referral' },
    { value: 'advertisement', label: 'Advertisement' },
    { value: 'cold_call', label: 'Cold Call' },
    { value: 'other', label: 'Other' },
  ];

  // Calculate stats from leads
  const stats = useMemo(() => {
    const total = normalizedLeads.length;
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const newThisWeek = normalizedLeads.filter(lead => {
      const createdAt = new Date(lead.createdAt || lead.created_at || '');
      return createdAt >= weekAgo;
    }).length;
    const converted = normalizedLeads.filter(l => l.status === 'converted').length;
    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : '0.0';
    
    return { total, newThisWeek, conversionRate };
  }, [normalizedLeads]);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 pb-24">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Leads Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage your leads and track conversion progress
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <PermissionGate permission="crm.distribute">
              <Button
                variant="secondary"
                icon={Users}
                onClick={() => setShowWorkloads(!showWorkloads)}
                className="w-full sm:w-auto"
              >
                {showWorkloads ? 'Hide Workloads' : 'View Workloads'}
              </Button>
            </PermissionGate>
            <PermissionGate permission="crm.distribute">
              <Button
                variant="secondary"
                icon={Users}
                onClick={() => {
                  const unassigned = normalizedLeads.filter(l => !l.assignedTo && !l.assigned_to);
                  setSelectedLeadIds(new Set(unassigned.map(l => l.id)));
                  setShowDistributeModal(true);
                }}
                className="w-full sm:w-auto"
                disabled={normalizedLeads.filter(l => !l.assignedTo && !l.assigned_to).length === 0}
              >
                Distribute Leads
              </Button>
            </PermissionGate>
            <PermissionGate permission="crm.create">
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => setShowAddModal(true)}
                className="w-full sm:w-auto"
              >
                Add Lead
              </Button>
            </PermissionGate>
          </div>
        </div>
      </motion.div>

      {/* Workload Statistics */}
      {showWorkloads && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <WorkloadStatistics />
        </motion.div>
      )}

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {isLoading ? '...' : stats.total}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-primary-100 rounded-xl">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">New This Week</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {isLoading ? '...' : stats.newThisWeek}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {isLoading ? '...' : `${stats.conversionRate}%`}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-yellow-100 rounded-xl">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">2.4h</p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col space-y-4">
            {/* Search */}
            <div className="w-full">
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </div>

            {/* Filters and Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  className="w-full sm:w-40"
                />
                <Select
                  options={priorityOptions}
                  value={priorityFilter}
                  onChange={setPriorityFilter}
                  className="w-full sm:w-40"
                />
                <Select
                  options={sourceOptions}
                  value={sourceFilter}
                  onChange={setSourceFilter}
                  className="w-full sm:w-40"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Filter}
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="w-full sm:w-auto"
                >
                  {showAdvancedFilters ? 'Hide Filters' : 'More Filters'}
                </Button>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={X}
                    onClick={handleClearFilters}
                    className="w-full sm:w-auto"
                    title="Clear all filters"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>

              {/* View Controls */}
              <div className="flex items-center justify-between sm:justify-end space-x-2">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'table' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className="p-2"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="p-2"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                </div>
                
                <PermissionGate permission="reports.export">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Download}
                    onClick={() => {
                      const filename = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
                      exportLeadsToCSV(normalizedLeads, filename);
                    }}
                    className="hidden sm:flex"
                  >
                    Export All
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Download}
                    onClick={() => {
                      const filename = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
                      exportLeadsToCSV(normalizedLeads, filename);
                    }}
                    className="sm:hidden p-2"
                  >
                    <span className="sr-only">Export</span>
                  </Button>
                </PermissionGate>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="pt-4 border-t border-gray-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assigned To
                    </label>
                    <Input
                      type="text"
                      placeholder="User name or email"
                      value={assignedToFilter}
                      onChange={(e) => setAssignedToFilter(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date From
                    </label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date To
                    </label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isSomeSelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </TableHeaderCell>
                <TableHeaderCell 
                  sortable 
                  sortDirection={getSortDirection('name')}
                  onSort={() => handleSort('name')}
                >
                  Client
                </TableHeaderCell>
                <TableHeaderCell>Contact</TableHeaderCell>
                <TableHeaderCell>Location</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Priority</TableHeaderCell>
                <TableHeaderCell 
                  sortable 
                  sortDirection={getSortDirection('estimatedValue')}
                  onSort={() => handleSort('estimatedValue')}
                >
                  Value
                </TableHeaderCell>
                <TableHeaderCell>Assigned</TableHeaderCell>
                <TableHeaderCell 
                  sortable 
                  sortDirection={getSortDirection('createdAt')}
                  onSort={() => handleSort('createdAt')}
                >
                  Created
                </TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                      <span className="ml-2 text-gray-600">Loading leads...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="text-center py-8">
                    <div className="text-red-600">
                      <p className="font-medium">Error loading leads</p>
                      <p className="text-sm mt-1">
                        {error instanceof Error ? error.message : 'An unexpected error occurred'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                normalizedLeads.map((lead) => (
                  <LeadTableRow
                    key={lead.id}
                    lead={lead}
                    onClick={() => handleLeadClick(lead)}
                    onMessage={() => handleMessageClick(lead)}
                    onEdit={() => handleEditLead(lead)}
                    onDelete={() => handleDeleteLead(lead)}
                    onAssign={() => handleAssignLead(lead)}
                    onViewDetails={() => handleViewDetails(lead)}
                    isSelected={selectedLeadIds.has(lead.id)}
                    onSelect={handleSelectLead}
                    showCheckbox={true}
                  />
                ))
              )}
            </TableBody>
          </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary-600 mx-auto" />
                <p className="mt-2 text-gray-600">Loading leads...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-8">
                <p className="text-red-600 font-medium">Error loading leads</p>
                <p className="text-sm mt-1 text-gray-600">
                  {error instanceof Error ? error.message : 'An unexpected error occurred'}
                </p>
              </div>
            ) : (
              normalizedLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onClick={() => handleLeadClick(lead)}
                />
              ))
            )}
          </div>
        )}

        {!isLoading && !error && normalizedLeads.length === 0 && (
          <Card className="p-8 sm:p-12 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No leads found
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4">
              {hasActiveFilters 
                ? 'No leads match your current filters. Try adjusting your search criteria or clear filters to see all leads.'
                : 'There are no leads in the system yet. Add your first lead to get started.'}
            </p>
            {hasActiveFilters && (
              <div className="mb-6">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={X}
                  onClick={handleClearFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
            <PermissionGate permission="crm.create">
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => setShowAddModal(true)}
                className="w-full sm:w-auto"
              >
                {hasActiveFilters ? 'Add New Lead' : 'Add Your First Lead'}
              </Button>
            </PermissionGate>
          </Card>
        )}
      </motion.div>

      {/* Modals */}
      <AddLeadModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddLead}
      />

      <DistributeLeadsModal
        isOpen={showDistributeModal}
        onClose={() => {
          setShowDistributeModal(false);
          setSelectedLeadIds(new Set());
        }}
        selectedLeads={selectedLeads}
        onSuccess={() => {
          setSelectedLeadIds(new Set());
        }}
      />

      <BulkActionsModal
        isOpen={showBulkActionsModal && bulkAction !== null}
        onClose={() => {
          setShowBulkActionsModal(false);
          setBulkAction(null);
        }}
        selectedLeads={selectedLeads}
        action={bulkAction || 'status'}
        onSuccess={() => {
          setSelectedLeadIds(new Set());
        }}
      />

      <BulkActionsBar
        selectedLeads={selectedLeads}
        onClearSelection={() => setSelectedLeadIds(new Set())}
        onBulkDelete={() => {
          setBulkAction('delete');
          setShowBulkActionsModal(true);
        }}
        onBulkAssign={() => {
          setBulkAction('assign');
          setShowBulkActionsModal(true);
        }}
        onBulkUpdateStatus={() => {
          setBulkAction('status');
          setShowBulkActionsModal(true);
        }}
        onExport={() => {
          const filename = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
          exportLeadsToCSV(selectedLeads, filename);
        }}
      />

      {selectedLead && (
        <ChatPane
          lead={selectedLead}
          messages={getMessagesForLead(selectedLead.id)}
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          onSendMessage={(content, type) => {
            console.log('Sending message:', { content, type, leadId: selectedLead.id });
          }}
        />
      )}
    </div>
  );
};

export default LeadsList;
