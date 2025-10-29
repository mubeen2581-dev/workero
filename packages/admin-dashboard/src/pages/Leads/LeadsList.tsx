import React, { useState, useMemo } from 'react';
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
  Clock
} from 'lucide-react';
import { Lead } from '@/types';
import { mockLeads, mockLeadStatuses, mockLeadPriorities, mockLeadSources } from '@/mocks/leads';
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
import { getMessagesForLead } from '@/mocks/messages';

type ViewMode = 'grid' | 'table';
type SortField = 'name' | 'createdAt' | 'estimatedValue' | 'leadScore';
type SortDirection = 'asc' | 'desc';

const LeadsList: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showChat, setShowChat] = useState(false);

  // Filter and sort leads
  const filteredAndSortedLeads = useMemo(() => {
    let filtered = mockLeads.filter(lead => {
      const matchesSearch = lead.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lead.client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lead.client.phone.includes(searchQuery);
      
      const matchesStatus = !statusFilter || lead.status === statusFilter;
      const matchesPriority = !priorityFilter || lead.priority === priorityFilter;
      const matchesSource = !sourceFilter || lead.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesSource;
    });

    // Sort leads
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.client.name;
          bValue = b.client.name;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'estimatedValue':
          aValue = a.estimatedValue;
          bValue = b.estimatedValue;
          break;
        case 'leadScore':
          aValue = a.client.leadScore;
          bValue = b.client.leadScore;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchQuery, statusFilter, priorityFilter, sourceFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setShowChat(true);
  };

  const handleMessageClick = (lead: Lead) => {
    setSelectedLead(lead);
    setShowChat(true);
  };

  const handleAddLead = (data: any) => {
    console.log('Adding new lead:', data);
    setShowAddModal(false);
    // In a real app, this would make an API call
  };

  const getSortDirection = (field: SortField) => {
    return sortField === field ? sortDirection : null;
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    ...mockLeadStatuses.map(status => ({
      value: status.value,
      label: `${status.label} (${status.count})`,
    })),
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    ...mockLeadPriorities.map(priority => ({
      value: priority.value,
      label: `${priority.label} (${priority.count})`,
    })),
  ];

  const sourceOptions = [
    { value: '', label: 'All Sources' },
    ...mockLeadSources.map(source => ({
      value: source.value,
      label: `${source.label} (${source.count})`,
    })),
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
              Leads Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage your leads and track conversion progress
            </p>
          </div>
          
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto"
          >
            Add Lead
          </Button>
        </div>
      </motion.div>

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
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{mockLeads.length}</p>
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
              <p className="text-xl sm:text-2xl font-bold text-gray-900">12</p>
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
              <p className="text-xl sm:text-2xl font-bold text-gray-900">68.5%</p>
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
              {filteredAndSortedLeads.map((lead) => (
                <LeadTableRow
                  key={lead.id}
                  lead={lead}
                  onClick={() => handleLeadClick(lead)}
                  onMessage={() => handleMessageClick(lead)}
                  onMore={() => console.log('More actions for', lead.id)}
                />
              ))}
            </TableBody>
          </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredAndSortedLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={() => handleLeadClick(lead)}
              />
            ))}
          </div>
        )}

        {filteredAndSortedLeads.length === 0 && (
          <Card className="p-8 sm:p-12 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No leads found
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6">
              Try adjusting your search criteria or add a new lead.
            </p>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto"
            >
              Add Your First Lead
            </Button>
          </Card>
        )}
      </motion.div>

      {/* Modals */}
      <AddLeadModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddLead}
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
