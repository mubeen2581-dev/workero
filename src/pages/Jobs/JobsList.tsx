import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Grid,
  List,
  Calendar,
  User,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  PauseCircle
} from 'lucide-react';
import { Job } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import KanbanBoard from '@/components/Jobs/KanbanBoard';
import JobDetailDrawer from '@/components/Jobs/JobDetailDrawer';
import PermissionGate from '@/components/auth/PermissionGate';
import { useJobs, useUpdateJob, useDeleteJob, useAssignJob, useCompleteJob } from '@/services/jobQueries';
import { JobFilters } from '@/services/jobs';

type ViewMode = 'kanban' | 'table';
type SortField = 'scheduledDate' | 'priority' | 'clientName' | 'status';
type SortDirection = 'asc' | 'desc';

// Normalize job data from API
const normalizeJob = (job: any): Job => {
  return {
    id: job.id,
    clientId: job.client_id || job.clientId,
    client: job.client ? {
      id: job.client.id,
      name: job.client.name || `${job.client.first_name || ''} ${job.client.last_name || ''}`.trim(),
      email: job.client.email || '',
      phone: job.client.phone || '',
      address: job.client.address || { street: '', city: '', state: '', zipCode: '', country: '' },
      tags: job.client.tags || [],
      leadScore: job.client.lead_score || 0,
      createdAt: job.client.created_at || job.client.createdAt || '',
      updatedAt: job.client.updated_at || job.client.updatedAt || '',
    } : {
      id: job.client_id || job.clientId,
      name: 'Unknown Client',
      email: '',
      phone: '',
      address: { street: '', city: '', state: '', zipCode: '', country: '' },
      tags: [],
      leadScore: 0,
      createdAt: '',
      updatedAt: '',
    },
    quoteId: job.quote_id || job.quoteId,
    title: job.title || '',
    description: job.description || '',
    status: job.status || 'scheduled',
    priority: job.priority || 'medium',
    estimatedDuration: parseFloat(job.estimated_duration || job.estimatedDuration || '0'),
    actualDuration: job.actual_duration || job.actualDuration ? parseFloat(job.actual_duration || job.actualDuration) : undefined,
    estimatedCost: job.estimated_cost || job.estimatedCost ? parseFloat(job.estimated_cost || job.estimatedCost) : undefined,
    actualCost: job.actual_cost || job.actualCost ? parseFloat(job.actual_cost || job.actualCost) : undefined,
    laborCost: job.labor_cost || job.laborCost ? parseFloat(job.labor_cost || job.laborCost) : undefined,
    materialCost: job.material_cost || job.materialCost ? parseFloat(job.material_cost || job.materialCost) : undefined,
    profitMargin: job.profit_margin || job.profitMargin ? parseFloat(job.profit_margin || job.profitMargin) : undefined,
    assignedTechnician: job.assigned_technician || job.assignedTechnician,
    scheduledDate: job.scheduled_date || job.scheduledDate || '',
    completedDate: job.completed_date || job.completedDate,
    location: (() => {
      // Handle location - could be string (JSON) or object
      let location = job.location;
      if (typeof location === 'string') {
        try {
          location = JSON.parse(location);
        } catch (e) {
          location = { address: location, coordinates: undefined };
        }
      }
      // Ensure location has address property
      if (!location || typeof location !== 'object') {
        location = { address: '', coordinates: undefined };
      }
      if (!location.address && location.street) {
        // If location has street but no address, construct address
        location.address = [
          location.street,
          location.city,
          location.state,
          location.zipCode
        ].filter(Boolean).join(', ');
      }
      return location.address ? location : { address: '', coordinates: undefined };
    })(),
    materials: job.materials || [],
    photos: job.photos || [],
    notes: job.notes || '',
    signature: job.signature,
    createdAt: job.created_at || job.createdAt || '',
    updatedAt: job.updated_at || job.updatedAt || '',
  };
};

const JobsList: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [technicianFilter, setTechnicianFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('scheduledDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Build filters for API
  const apiFilters: JobFilters = useMemo(() => {
    const filters: JobFilters = {};
    
    if (searchQuery?.trim()) filters.search = searchQuery.trim();
    if (statusFilter) filters.status = statusFilter;
    if (priorityFilter) filters.priority = priorityFilter;
    if (technicianFilter) filters.assigned_technician = technicianFilter;
    
    // Map frontend sort fields to backend
    const sortMap: Record<SortField, string> = {
      scheduledDate: 'scheduled_date',
      priority: 'priority',
      clientName: 'client_id',
      status: 'status',
    };
    
    if (sortField && sortMap[sortField]) {
      filters.sort_field = sortMap[sortField];
      filters.sort_direction = sortDirection;
    }
    
    return filters;
  }, [searchQuery, statusFilter, priorityFilter, technicianFilter, sortField, sortDirection]);

  // Fetch jobs from API
  const { data: jobsData = [], isLoading, error } = useJobs(apiFilters);
  const updateJobMutation = useUpdateJob();
  const deleteJobMutation = useDeleteJob();
  const assignJobMutation = useAssignJob();
  const completeJobMutation = useCompleteJob();

  // Normalize jobs data
  const normalizedJobs = useMemo(() => {
    if (!jobsData || !Array.isArray(jobsData)) {
      return [];
    }
    return jobsData.map(normalizeJob);
  }, [jobsData]);

  // Calculate statistics
  const totalJobs = normalizedJobs.length;
  const scheduledJobs = normalizedJobs.filter(job => job.status === 'scheduled').length;
  const inProgressJobs = normalizedJobs.filter(job => job.status === 'in_progress').length;
  const completedJobs = normalizedJobs.filter(job => job.status === 'completed').length;
  const urgentJobs = normalizedJobs.filter(job => job.priority === 'urgent').length;

  // Get unique technicians from jobs for filter dropdown
  const technicianOptions = useMemo(() => {
    const technicians = new Map<string, { id: string; name: string }>();
    normalizedJobs.forEach(job => {
      if (job.assignedTechnician && job.client) {
        // We'll need to fetch users separately, for now use client name as fallback
        technicians.set(job.assignedTechnician, {
          id: job.assignedTechnician,
          name: `Technician ${job.assignedTechnician.substring(0, 8)}`,
        });
      }
    });
    return [
      { value: '', label: 'All Technicians' },
      ...Array.from(technicians.values()).map(tech => ({
        value: tech.id,
        label: tech.name,
      })),
    ];
  }, [normalizedJobs]);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsDrawerOpen(true);
  };

  const handleJobStatusChange = async (jobId: string, newStatus: string) => {
    try {
      await updateJobMutation.mutateAsync({
        id: jobId,
        data: { status: newStatus as any },
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleJobUpdate = async (jobId: string, updates: Partial<Job>) => {
    try {
      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.estimatedDuration !== undefined) updateData.estimated_duration = updates.estimatedDuration;
      if (updates.scheduledDate !== undefined) updateData.scheduled_date = updates.scheduledDate;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      
      await updateJobMutation.mutateAsync({
        id: jobId,
        data: updateData,
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedJob(null);
  };

  const handleEditJob = () => {
    if (selectedJob) {
      navigate(`/jobs/${selectedJob.id}/edit`);
    }
  };

  const handleCreateJob = () => {
    navigate('/jobs/new');
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJobMutation.mutateAsync(jobId);
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  const getSortDirection = (field: SortField) => {
    return sortField === field ? sortDirection : null;
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'scheduled', label: `Scheduled (${scheduledJobs})` },
    { value: 'in_progress', label: `In Progress (${inProgressJobs})` },
    { value: 'completed', label: `Completed (${completedJobs})` },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: `Urgent (${urgentJobs})` },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Job Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Track jobs, manage technicians, and monitor progress
            </p>
          </div>
          
          <PermissionGate permission="jobs.create">
            <Button
              variant="primary"
              icon={Plus}
              onClick={handleCreateJob}
              className="w-full sm:w-auto"
            >
              Create Job
            </Button>
          </PermissionGate>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6"
      >
        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{totalJobs}</p>
            </div>
            <div className="p-2 sm:p-3 bg-primary-100 rounded-xl">
              <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-600">{scheduledJobs}</p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
              <PlayCircle className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-lg sm:text-2xl font-bold text-yellow-600">{inProgressJobs}</p>
            </div>
            <div className="p-2 sm:p-3 bg-yellow-100 rounded-xl">
              <PauseCircle className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Completed</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{completedJobs}</p>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Urgent</p>
              <p className="text-lg sm:text-2xl font-bold text-red-600">{urgentJobs}</p>
            </div>
            <div className="p-2 sm:p-3 bg-red-100 rounded-xl">
              <AlertCircle className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
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
                placeholder="Search jobs..."
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
                  options={technicianOptions}
                  value={technicianFilter}
                  onChange={setTechnicianFilter}
                  className="w-full sm:w-40"
                />
              </div>

              {/* View Controls */}
              <div className="flex items-center justify-between sm:justify-end space-x-2">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'kanban' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('kanban')}
                    className="p-2"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className="p-2"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button variant="secondary" size="sm" icon={Download} className="hidden sm:flex">
                  Export
                </Button>
                <Button variant="secondary" size="sm" icon={Download} className="sm:hidden p-2">
                  <span className="sr-only">Export</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Kanban Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error loading jobs
            </h3>
            <p className="text-gray-500">
              {error instanceof Error ? error.message : 'Failed to load jobs'}
            </p>
          </div>
        ) : normalizedJobs.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter || priorityFilter || technicianFilter
                ? 'Try adjusting your filters'
                : 'Get started by creating your first job'}
            </p>
            <PermissionGate permission="jobs.create">
              <Button variant="primary" icon={Plus} onClick={handleCreateJob}>
                Create Job
              </Button>
            </PermissionGate>
          </div>
        ) : viewMode === 'kanban' ? (
          <KanbanBoard
            jobs={normalizedJobs}
            onJobClick={handleJobClick}
            onJobStatusChange={handleJobStatusChange}
          />
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Table view coming soon
            </h3>
            <p className="text-gray-500">
              Use the Kanban board to manage your jobs
            </p>
          </div>
        )}
      </motion.div>

      {/* Job Detail Drawer */}
      {selectedJob && (
        <JobDetailDrawer
          job={selectedJob}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          onEdit={handleEditJob}
          onJobUpdate={handleJobUpdate}
          onDelete={handleDeleteJob}
          activities={[]} // Activities are now fetched from API in JobDetailDrawer
        />
      )}
    </div>
  );
};

export default JobsList;
