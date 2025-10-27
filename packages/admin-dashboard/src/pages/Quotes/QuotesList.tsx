import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical,
  Grid,
  List,
  FileText,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';
import { Quote, Job } from '@/types';
import { mockQuotes, mockQuoteStatuses } from '@/mocks/quotes';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableHeaderCell } from '@/components/ui/Table';
import QuoteCard from '@/components/Quotes/QuoteCard';
import QuoteTableRow from '@/components/Quotes/QuoteTableRow';
import QuotePreviewModal from '@/components/Quotes/QuotePreviewModal';

type ViewMode = 'grid' | 'table';
type SortField = 'createdAt' | 'total' | 'clientName' | 'status';
type SortDirection = 'asc' | 'desc';

const QuotesList: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showQuotePreview, setShowQuotePreview] = useState(false);

  // Filter and sort quotes
  const filteredAndSortedQuotes = useMemo(() => {
    let filtered = mockQuotes.filter(quote => {
      const matchesSearch = quote.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           quote.client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           quote.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !statusFilter || quote.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort quotes
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'clientName':
          aValue = a.client.name;
          bValue = b.client.name;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'total':
          aValue = a.total;
          bValue = b.total;
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
  }, [searchQuery, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleQuoteClick = (quote: Quote) => {
    setSelectedQuote(quote);
    setShowQuotePreview(true);
  };

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setShowQuotePreview(true);
  };

  const handleEditQuote = (quote: Quote) => {
    navigate(`/quotes/${quote.id}/edit`);
  };

  const handleSendQuote = async (quote: Quote) => {
    // Simulate sending quote
    console.log('Sending quote:', quote.id);
    // In real app, this would call API to send quote
    alert(`Quote #${quote.id.split('-')[1].toUpperCase()} sent to ${quote.client.name}`);
  };

  const handleCreateQuote = () => {
    navigate('/quotes/new');
  };

  const handleConvertToJob = (jobData: Partial<Job>) => {
    console.log('Converting quote to job:', jobData);
    // In real app, this would create a job via API
  };

  const getSortDirection = (field: SortField) => {
    return sortField === field ? sortDirection : null;
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    ...mockQuoteStatuses.map(status => ({
      value: status.value,
      label: `${status.label} (${status.count})`,
    })),
  ];

  // Calculate statistics
  const totalQuotes = mockQuotes.length;
  const totalValue = mockQuotes.reduce((sum, quote) => sum + quote.total, 0);
  const acceptedQuotes = mockQuotes.filter(q => q.status === 'accepted').length;
  const conversionRate = totalQuotes > 0 ? (acceptedQuotes / totalQuotes) * 100 : 0;

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
              Quotes & Estimates
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage quotes, track conversions, and build estimates
            </p>
          </div>
          
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleCreateQuote}
            className="w-full sm:w-auto"
          >
            Create Quote
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
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Quotes</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalQuotes}</p>
            </div>
            <div className="p-2 sm:p-3 bg-primary-100 rounded-xl">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                £{totalValue.toLocaleString()}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{conversionRate.toFixed(1)}%</p>
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
              <p className="text-xl sm:text-2xl font-bold text-gray-900">2.1 days</p>
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
                placeholder="Search quotes..."
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
                <Button variant="secondary" size="sm" icon={Download} className="sm:hidden p-2" />
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
                <TableHeaderCell>Quote & Client</TableHeaderCell>
                <TableHeaderCell>Client Info</TableHeaderCell>
                <TableHeaderCell>Items</TableHeaderCell>
                <TableHeaderCell 
                  sortable 
                  sortDirection={getSortDirection('status')}
                  onSort={() => handleSort('status')}
                >
                  Status
                </TableHeaderCell>
                <TableHeaderCell 
                  sortable 
                  sortDirection={getSortDirection('total')}
                  onSort={() => handleSort('total')}
                >
                  Total
                </TableHeaderCell>
                <TableHeaderCell 
                  sortable 
                  sortDirection={getSortDirection('createdAt')}
                  onSort={() => handleSort('createdAt')}
                >
                  Created
                </TableHeaderCell>
                <TableHeaderCell>Valid Until</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredAndSortedQuotes.map((quote) => (
                <QuoteTableRow
                  key={quote.id}
                  quote={quote}
                  onClick={() => handleQuoteClick(quote)}
                  onView={() => handleViewQuote(quote)}
                  onEdit={() => handleEditQuote(quote)}
                  onSend={() => handleSendQuote(quote)}
                  onConvertToJob={handleConvertToJob}
                  onMore={() => console.log('More actions for', quote.id)}
                />
              ))}
            </TableBody>
          </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredAndSortedQuotes.map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                onClick={() => handleQuoteClick(quote)}
                onConvertToJob={handleConvertToJob}
              />
            ))}
          </div>
        )}

        {filteredAndSortedQuotes.length === 0 && (
          <Card className="p-8 sm:p-12 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No quotes found
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6">
              Try adjusting your search criteria or create a new quote.
            </p>
            <Button
              variant="primary"
              icon={Plus}
              onClick={handleCreateQuote}
              className="w-full sm:w-auto"
            >
              Create Your First Quote
            </Button>
          </Card>
        )}
      </motion.div>

      {/* Quote Preview Modal */}
      <QuotePreviewModal
        quote={selectedQuote}
        isOpen={showQuotePreview}
        onClose={() => {
          setShowQuotePreview(false);
          setSelectedQuote(null);
        }}
      />
    </div>
  );
};

export default QuotesList;
