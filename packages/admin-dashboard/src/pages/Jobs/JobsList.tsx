import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
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
import { mockJobs, jobStatuses, jobPriorities, getJobsByStatus, getJobsByTechnician } from '@/mocks/jobs';
import { mockTechnicians } from '@/mocks/jobs';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import KanbanBoard from '@/components/Jobs/KanbanBoard';
import JobDetailDrawer from '@/components/Jobs/JobDetailDrawer';
import { mockJobActivities } from '@/mocks/jobs';

type ViewMode = 'kanban' | 'table';
type SortField = 'scheduledDate' | 'priority' | 'clientName' | 'status';
type SortDirection = 'asc' | 'desc';

const JobsList: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [technicianFilter, setTechnicianFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('scheduledDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = mockJobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !statusFilter || job.status === statusFilter;
      const matchesPriority = !priorityFilter || job.priority === priorityFilter;
      const matchesTechnician = !technicianFilter || job.assignedTechnician === technicianFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesTechnician;
    });

    // Sort jobs
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'clientName':
          aValue = a.client.name;
          bValue = b.client.name;
          break;
        case 'scheduledDate':
          aValue = new Date(a.scheduledDate);
          bValue = new Date(b.scheduledDate);
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchQuery, statusFilter, priorityFilter, technicianFilter, sortField, sortDirection]);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsDrawerOpen(true);
  };

  const handleJobStatusChange = (jobId: string, newStatus: string) => {
    console.log(`Job ${jobId} status changed to ${newStatus}`);
    // In a real app, this would update the job status via API
  };

  const handleJobUpdate = (jobId: string, updates: Partial<Job>) => {
    console.log(`Job ${jobId} updated:`, updates);
    // In a real app, this would update the job via API
    // For now, just log the updates
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedJob(null);
  };

  const handleEditJob = () => {
    console.log('Edit job:', selectedJob?.id);
  };

  const getSortDirection = (field: SortField) => {
    return sortField === field ? sortDirection : null;
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    ...jobStatuses.map(status => ({
      value: status.value,
      label: `${status.label} (${status.count})`,
    })),
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    ...jobPriorities.map(priority => ({
      value: priority.value,
      label: `${priority.label} (${priority.count})`,
    })),
  ];

  const technicianOptions = [
    { value: '', label: 'All Technicians' },
    ...mockTechnicians.map(tech => ({
      value: tech.id,
      label: `${tech.firstName} ${tech.lastName}`,
    })),
  ];

  // Calculate statistics
  const totalJobs = mockJobs.length;
  const scheduledJobs = getJobsByStatus('scheduled').length;
  const inProgressJobs = getJobsByStatus('in_progress').length;
  const completedJobs = getJobsByStatus('completed').length;
  const urgentJobs = mockJobs.filter(job => job.priority === 'urgent').length;

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
          
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => console.log('Create new job')}
            className="w-full sm:w-auto"
          >
            Create Job
          </Button>
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
                <Button variant="secondary" size="sm" icon={Download} className="sm:hidden p-2" />
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
        {viewMode === 'kanban' ? (
          <KanbanBoard
            jobs={filteredAndSortedJobs}
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
          activities={mockJobActivities.filter(activity => activity.entityId === selectedJob.id)}
        />
      )}
    </div>
  );
};

export default JobsList;
