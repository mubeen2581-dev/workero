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
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableHeaderCell } from '@/components/ui/Table';
import QuoteCard from '@/components/Quotes/QuoteCard';
import QuoteTableRow from '@/components/Quotes/QuoteTableRow';
import QuotePreviewModal from '@/components/Quotes/QuotePreviewModal';
import PermissionGate from '@/components/auth/PermissionGate';
import { useQuotes, useDeleteQuote, useSendQuote, useAcceptQuote, useRejectQuote, useConvertQuoteToJob, useCreateQuote } from '@/services/quoteQueries';
import { QuoteFilters, QuoteService } from '@/services/quotes';
import { toast } from 'react-toastify';

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

  // Build filters for API
  const apiFilters: QuoteFilters = useMemo(() => {
    const filters: QuoteFilters = {};
    
    if (searchQuery?.trim()) filters.search = searchQuery.trim();
    if (statusFilter) filters.status = statusFilter;
    
    // Map frontend sort fields to backend
    const sortMap: Record<SortField, string> = {
      createdAt: 'created_at',
      total: 'total',
      clientName: 'client_name',
      status: 'status',
    };
    
    if (sortField && sortMap[sortField]) {
      filters.sortBy = sortMap[sortField];
      filters.sortDirection = sortDirection;
    }
    
    return filters;
  }, [searchQuery, statusFilter, sortField, sortDirection]);

  // Fetch quotes from API
  const { data: quotesData = [], isLoading, error } = useQuotes(apiFilters);
  const deleteQuoteMutation = useDeleteQuote();
  const sendQuoteMutation = useSendQuote();
  const acceptQuoteMutation = useAcceptQuote();
  const rejectQuoteMutation = useRejectQuote();
  const convertToJobMutation = useConvertQuoteToJob();
  const createQuoteMutation = useCreateQuote();

  // Normalize quotes data
  const normalizedQuotes = useMemo(() => {
    return quotesData.map((quote: any) => ({
      ...quote,
      clientId: quote.client_id || quote.clientId,
      client: quote.client,
      subtotal: parseFloat(quote.subtotal || 0),
      taxAmount: parseFloat(quote.tax_amount || quote.taxAmount || 0),
      total: parseFloat(quote.total || 0),
      profitMargin: parseFloat(quote.profit_margin || quote.profitMargin || 0),
      validUntil: quote.valid_until || quote.validUntil,
      createdAt: quote.created_at || quote.createdAt,
      updatedAt: quote.updated_at || quote.updatedAt,
      items: (quote.items || []).map((item: any) => ({
        ...item,
        unitPrice: parseFloat(item.unit_price || item.unitPrice || 0),
        taxRate: parseFloat(item.tax_rate || item.taxRate || 0),
        lineTotal: parseFloat(item.line_total || item.lineTotal || 0),
        quantity: parseFloat(item.quantity || 0),
      })),
    }));
  }, [quotesData]);

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
    try {
      await sendQuoteMutation.mutateAsync(quote.id);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDeleteQuote = async (quote: Quote) => {
    if (window.confirm(`Are you sure you want to delete this quote? This action cannot be undone.`)) {
      try {
        await deleteQuoteMutation.mutateAsync(quote.id);
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  const handleAcceptQuote = async (quote: Quote) => {
    try {
      await acceptQuoteMutation.mutateAsync(quote.id);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleRejectQuote = async (quote: Quote) => {
    try {
      await rejectQuoteMutation.mutateAsync(quote.id);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCreateQuote = () => {
    navigate('/quotes/new');
  };

  const handleConvertToJob = async (quote: Quote, jobData: Partial<Job>) => {
    try {
      await convertToJobMutation.mutateAsync({
        id: quote.id,
        data: {
          scheduled_date: jobData.scheduled_date || new Date().toISOString(),
          assigned_technician: jobData.assigned_technician,
          priority: jobData.priority || 'medium',
          estimated_duration: jobData.estimated_duration,
          location: jobData.location,
          notes: jobData.notes,
        },
      });
      navigate('/jobs');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDuplicateQuote = async (quote: Quote) => {
    try {
      const duplicateData = {
        client_id: quote.clientId || quote.client?.id,
        items: quote.items.map((item: any) => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unitPrice || item.unit_price,
          tax_rate: item.taxRate || item.tax_rate || 0,
        })),
        valid_until: quote.validUntil || quote.valid_until || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: quote.notes || undefined,
        profit_margin: quote.profitMargin || quote.profit_margin || 0,
      };

      await createQuoteMutation.mutateAsync(duplicateData);
      // Success message is handled by the mutation
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDownloadPdf = async (quote: Quote) => {
    try {
      const blob = await QuoteService.downloadPdf(quote.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quote-${quote.id.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to download PDF';
      toast.error(message);
    }
  };

  const getSortDirection = (field: SortField) => {
    return sortField === field ? sortDirection : null;
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'expired', label: 'Expired' },
  ];

  // Calculate statistics
  const totalQuotes = normalizedQuotes.length;
  const totalValue = normalizedQuotes.reduce((sum, quote) => sum + (quote.total || 0), 0);
  const acceptedQuotes = normalizedQuotes.filter(q => q.status === 'accepted').length;
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
          
          <PermissionGate permission="quotes.create">
            <Button
              variant="primary"
              icon={Plus}
              onClick={handleCreateQuote}
              className="w-full sm:w-auto"
            >
              Create Quote
            </Button>
          </PermissionGate>
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
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Loading quotes...
                  </td>
                </tr>
              ) : normalizedQuotes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No quotes found
                  </td>
                </tr>
              ) : (
                normalizedQuotes.map((quote) => (
                  <QuoteTableRow
                    key={quote.id}
                    quote={quote}
                    onClick={() => handleQuoteClick(quote)}
                    onView={() => handleViewQuote(quote)}
                    onEdit={() => handleEditQuote(quote)}
                    onSend={() => handleSendQuote(quote)}
                    onConvertToJob={(jobData) => handleConvertToJob(quote, jobData)}
                    onDuplicate={() => handleDuplicateQuote(quote)}
                    onDownloadPdf={() => handleDownloadPdf(quote)}
                    onDelete={() => handleDeleteQuote(quote)}
                    onMore={() => console.log('More actions for', quote.id)}
                  />
                ))
              )}
            </TableBody>
          </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                Loading quotes...
              </div>
            ) : normalizedQuotes.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                No quotes found
              </div>
            ) : (
              normalizedQuotes.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  onClick={() => handleQuoteClick(quote)}
                  onConvertToJob={(jobData) => handleConvertToJob(quote, jobData)}
                />
              ))
            )}
          </div>
        )}

        {!isLoading && normalizedQuotes.length === 0 && (
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
            <PermissionGate permission="quotes.create">
              <Button
                variant="primary"
                icon={Plus}
                onClick={handleCreateQuote}
                className="w-full sm:w-auto"
              >
                Create Your First Quote
              </Button>
            </PermissionGate>
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
