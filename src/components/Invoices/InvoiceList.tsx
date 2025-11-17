import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  DollarSign,
  User,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Bell,
  CreditCard
} from 'lucide-react';
import { Invoice, Payment } from '@/types';
import { mockPayments } from '@/mocks/invoices';
import { XEPayService } from '@/services/xepay';
import InvoiceDetailDrawer from '@/components/Invoices/InvoiceDetailDrawer';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { Table } from '../ui/Table';
import PaymentActions from '@/components/Invoices/PaymentActions';
import PartPaymentModal from './PartPaymentModal';
import InvoiceStatusUpdate from './InvoiceStatusUpdate';
import PaymentReminderManager from './PaymentReminderManager';
import PaymentHistory from './PaymentHistory';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import { useInvoices, useDeleteInvoice, useSendInvoice, useDownloadInvoicePdf } from '@/services/invoiceQueries';
import { InvoiceFilters } from '@/services/invoices';

interface InvoiceListProps {
  invoices?: Invoice[];
  onInvoiceClick?: (invoice: Invoice) => void;
  onEditInvoice?: (invoice: Invoice) => void;
  onDeleteInvoice?: (invoice: Invoice) => void;
  onAddInvoice?: () => void;
  className?: string;
}

const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices: invoicesProp,
  onInvoiceClick,
  onEditInvoice,
  onDeleteInvoice,
  onAddInvoice,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPartPaymentModal, setShowPartPaymentModal] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [showReminderManager, setShowReminderManager] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [drawerId, setDrawerId] = useState<string | null>(null);

  // Build API filters
  const apiFilters = useMemo<InvoiceFilters>(() => {
    const filters: InvoiceFilters = {};
    if (searchTerm?.trim()) filters.search = searchTerm.trim();
    if (statusFilter && statusFilter !== 'all') filters.status = statusFilter;
    if (sortBy) filters.sort_by = sortBy;
    if (sortOrder) filters.sort_direction = sortOrder;
    return filters;
  }, [searchTerm, statusFilter, sortBy, sortOrder]);

  // Fetch invoices from API
  const { data: invoicesData = [], isLoading, error } = useInvoices(apiFilters);
  const deleteInvoiceMutation = useDeleteInvoice();
  const sendInvoiceMutation = useSendInvoice();
  const downloadPdfMutation = useDownloadInvoicePdf();

  // Normalize invoices data
  const normalizedInvoices = useMemo(() => {
    return invoicesData.map((invoice: any) => ({
      ...invoice,
      clientId: invoice.client_id || invoice.clientId,
      jobId: invoice.job_id || invoice.jobId,
      client: invoice.client,
      job: invoice.job,
      amount: parseFloat(invoice.amount || 0),
      taxAmount: parseFloat(invoice.tax_amount || invoice.taxAmount || 0),
      total: parseFloat(invoice.total || 0),
      dueDate: invoice.due_date || invoice.dueDate,
      paidDate: invoice.paid_date || invoice.paidDate,
      paymentMethod: invoice.payment_method || invoice.paymentMethod,
      createdAt: invoice.created_at || invoice.createdAt,
      updatedAt: invoice.updated_at || invoice.updatedAt,
      items: (invoice.items || []).map((item: any) => ({
        ...item,
        unitPrice: parseFloat(item.unit_price || item.unitPrice || 0),
        taxRate: parseFloat(item.tax_rate || item.taxRate || 0),
        lineTotal: parseFloat(item.line_total || item.lineTotal || 0),
        quantity: parseFloat(item.quantity || 0),
      })),
    }));
  }, [invoicesData]);

  // Use normalized invoices or prop invoices
  const invoices = invoicesProp || normalizedInvoices;

  const filteredInvoices = useMemo(() => {
    let filtered = invoices.filter(invoice => {
      const matchesSearch = 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      
      const matchesDate = (() => {
        if (dateFilter === 'all') return true;
        const now = new Date();
        const invoiceDate = new Date(invoice.createdAt);
        
        switch (dateFilter) {
          case 'today':
            return invoiceDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return invoiceDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return invoiceDate >= monthAgo;
          case 'overdue':
            return invoice.status === 'overdue';
          default:
            return true;
        }
      })();

      const paid = mockPayments.filter((p) => p.invoiceId === invoice.id).reduce((s, p) => s + p.amount, 0);
      const needsPayment = invoice.total - paid > 0;
      const passesNeedsPayment = statusFilter !== 'needs_payment' || needsPayment;
      const passesOverdueOnly = statusFilter !== 'overdue_only' || (invoice.status !== 'paid' && new Date(invoice.dueDate) < new Date());

      return matchesSearch && matchesStatus && matchesDate && passesNeedsPayment && passesOverdueOnly;
    });

    // Sort invoices
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'dueDate':
          aValue = new Date(a.dueDate).getTime();
          bValue = new Date(b.dueDate).getTime();
          break;
        case 'total':
          aValue = a.total;
          bValue = b.total;
          break;
        case 'client':
          aValue = a.client.name;
          bValue = b.client.name;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [invoices, searchTerm, statusFilter, dateFilter, sortBy, sortOrder]);

  const formatCurrency = (amount: number, currency: string = 'GBP') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePaymentRecorded = (payment: Payment) => {
    setPayments(prev => [...prev, payment]);
    setShowPartPaymentModal(false);
  };

  const handleStatusUpdate = async (invoiceId: string, newStatus: Invoice['status']) => {
    try {
      // If sending invoice, use the send mutation
      if (newStatus === 'sent') {
        await sendInvoiceMutation.mutateAsync(invoiceId);
      }
      // For other status updates, we would need an update mutation
      // For now, just close the modal
      setShowStatusUpdate(false);
      setSelectedInvoice(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getOutstanding = (invoice: Invoice) => {
    const paid = mockPayments.filter((p) => p.invoiceId === invoice.id).reduce((s, p) => s + p.amount, 0);
    return Math.max(0, invoice.total - paid);
  };

  const getStatusIcon = (status: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      draft: FileText,
      sent: Clock,
      paid: CheckCircle,
      overdue: AlertTriangle,
    };
    return iconMap[status] || FileText;
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(invoice => invoice.id));
    }
  };

  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleBulkAction = async (action: string) => {
    if (selectedInvoices.length === 0) {
      toast.error('Please select at least one invoice');
      return;
    }

    try {
      switch (action) {
        case 'mark_sent':
          setInvoices(prevInvoices =>
            prevInvoices.map(inv =>
              selectedInvoices.includes(inv.id) && inv.status !== 'sent'
                ? { ...inv, status: 'sent' as Invoice['status'], updatedAt: new Date().toISOString() }
                : inv
            )
          );
          toast.success(`${selectedInvoices.length} invoice(s) marked as sent`);
          setSelectedInvoices([]);
          break;

        case 'send_reminder':
          // Simulate sending reminders
          for (const id of selectedInvoices) {
            const invoice = invoices.find(inv => inv.id === id);
            if (invoice) {
              // In a real app, this would send actual reminders
              console.log(`Sending reminder for invoice ${id}`);
            }
          }
          toast.success(`Reminders sent for ${selectedInvoices.length} invoice(s)`);
          setSelectedInvoices([]);
          break;

        case 'send_payment_links':
          for (const id of selectedInvoices) {
            const invoice = invoices.find(inv => inv.id === id);
            if (invoice) {
              await XEPayService.createPaymentLink({
                invoiceId: id,
                amount: invoice.total,
                currency: invoice.currency || 'GBP',
                description: `Payment for ${invoice.id}`,
                customerEmail: invoice.client.email || ''
              });
            }
          }
          toast.success(`Payment links sent for ${selectedInvoices.length} invoice(s)`);
          setSelectedInvoices([]);
          break;

        case 'export':
          // Create export data
          const exportData = invoices
            .filter(inv => selectedInvoices.includes(inv.id))
            .map(inv => ({
              id: inv.id,
              client: inv.client.name,
              amount: inv.total,
              status: inv.status,
              dueDate: inv.dueDate,
              currency: inv.currency || 'GBP'
            }));
          
          // Convert to CSV
          const headers = ['Invoice ID', 'Client', 'Amount', 'Status', 'Due Date', 'Currency'];
          const csvContent = [
            headers.join(','),
            ...exportData.map(row =>
              [
                row.id,
                `"${row.client}"`,
                row.amount,
                row.status,
                new Date(row.dueDate).toLocaleDateString(),
                row.currency
              ].join(',')
            )
          ].join('\n');

          // Download CSV
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', `invoices_export_${new Date().toISOString().split('T')[0]}.csv`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          toast.success(`Exported ${selectedInvoices.length} invoice(s)`);
          setSelectedInvoices([]);
          break;

        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${selectedInvoices.length} invoice(s)? This action cannot be undone.`)) {
            try {
              await Promise.all(selectedInvoices.map(id => deleteInvoiceMutation.mutateAsync(id)));
              toast.success(`${selectedInvoices.length} invoice(s) deleted`);
              setSelectedInvoices([]);
            } catch (error) {
              // Error handled by mutation
            }
          }
          break;

        default:
          console.log(`Unknown bulk action: ${action}`);
      }
    } catch (error) {
      toast.error(`Failed to perform ${action} action`);
      console.error(error);
    }
  };

  const columns = [
    {
      key: 'select',
      header: (
        <input
          type="checkbox"
          checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
          onChange={handleSelectAll}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
      render: (invoice: Invoice) => (
        <input
          type="checkbox"
          checked={selectedInvoices.includes(invoice.id)}
          onChange={() => handleSelectInvoice(invoice.id)}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
    },
    {
      key: 'invoice',
      header: 'Invoice',
      render: (invoice: Invoice) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <FileText className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{invoice.id}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(invoice.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Client',
      render: (invoice: Invoice) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{invoice.client.name}</p>
            <p className="text-xs text-gray-500">{invoice.client.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (invoice: Invoice) => (
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{formatCurrency(invoice.total, invoice.currency || 'GBP')}</p>
          <p className="text-xs text-gray-500">{invoice.items.length} items</p>
          {getOutstanding(invoice) > 0 && (
            <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-800">
              Due {formatCurrency(getOutstanding(invoice))}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (invoice: Invoice) => {
        const StatusIcon = getStatusIcon(invoice.status);
        return (
          <Badge className={getStatusColor(invoice.status)}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (invoice: Invoice) => {
        const dueDate = new Date(invoice.dueDate);
        const isOverdue = dueDate < new Date() && invoice.status !== 'paid';
        
        return (
          <div className="text-right">
            <p className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
              {dueDate.toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(dueDate, { addSuffix: true })}
            </p>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (invoice: Invoice) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Eye}
            onClick={() => onInvoiceClick?.(invoice)}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={() => onEditInvoice?.(invoice)}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => onDeleteInvoice?.(invoice)}
            className="text-red-600 hover:text-red-700"
          />
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Invoices</h2>
          <p className="text-sm sm:text-base text-gray-600">Manage your invoices and payments</p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button variant="secondary" icon={Download} className="hidden sm:flex">
            Export
          </Button>
          <Button variant="secondary" icon={Download} className="sm:hidden p-2" />
          <Button variant="primary" icon={Plus} onClick={onAddInvoice} className="flex-1 sm:flex-none">
            <span className="hidden sm:inline">Create Invoice</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'draft', label: 'Draft' },
                { value: 'sent', label: 'Sent' },
                { value: 'paid', label: 'Paid' },
                { value: 'overdue', label: 'Overdue' },
                { value: 'needs_payment', label: 'Needs Payment' },
                { value: 'overdue_only', label: 'Overdue Only' },
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Time' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
                { value: 'overdue', label: 'Overdue' },
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <div className="flex space-x-2">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { value: 'createdAt', label: 'Created' },
                  { value: 'dueDate', label: 'Due Date' },
                  { value: 'total', label: 'Amount' },
                  { value: 'client', label: 'Client' },
                  { value: 'status', label: 'Status' },
                ]}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedInvoices.length > 0 && (
        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedInvoices.length} invoice{selectedInvoices.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleBulkAction('mark_sent')}
                >
                  Mark as Sent
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleBulkAction('send_reminder')}
                >
                  Send Reminder
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleBulkAction('send_payment_links')}
                >
                  Send Payment Links
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleBulkAction('export')}
                >
                  Export Selected
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedInvoices([])}
            >
              Clear Selection
            </Button>
          </div>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredInvoices.length} of {invoices.length} invoices
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" icon={Filter}>
            More Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      {!isLoading && !error && filteredInvoices.length > 0 && (
        <Card className="overflow-hidden">
          <Table className="w-full">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
              <>
                <tr key={invoice.id} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 text-sm text-gray-900">
                      {column.key === 'actions' ? (
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" icon={Eye} onClick={() => setDrawerId(invoice.id)} />
                          <Button variant="ghost" size="sm" icon={Edit} onClick={() => onEditInvoice?.(invoice)} />
                          <Button variant="ghost" size="sm" icon={Download} onClick={() => downloadPdfMutation.mutate(invoice.id)} title="Download PDF" />
                          <Button variant="ghost" size="sm" icon={Bell} onClick={() => { setSelectedInvoice(invoice); setShowReminderManager(true); }} title="Send Reminder" />
                          <Button variant="ghost" size="sm" icon={CreditCard} onClick={() => { setSelectedInvoice(invoice); setShowPartPaymentModal(true); }} title="Record Payment" />
                          <Button variant="ghost" size="sm" icon={MoreVertical} onClick={() => { setSelectedInvoice(invoice); setShowStatusUpdate(true); }} title="Update Status" />
                          <Button variant="ghost" size="sm" icon={Trash2} onClick={() => {
                            if (window.confirm('Are you sure you want to delete this invoice?')) {
                              deleteInvoiceMutation.mutate(invoice.id);
                            }
                          }} className="text-red-600 hover:text-red-700" />
                          <Button variant="primary" size="sm" onClick={() => setExpanded(expanded === invoice.id ? null : invoice.id)}>Payments</Button>
                        </div>
                      ) : (
                        column.render(invoice)
                      )}
                    </td>
                  ))}
                </tr>
                {expanded === invoice.id && (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-4 bg-gray-50">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <PaymentActions invoice={invoice} />
                        <PaymentHistory invoice={invoice} payments={payments} />
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </Table>
      </Card>
      )}

      {drawerId && <InvoiceDetailDrawer invoiceId={drawerId} onClose={() => setDrawerId(null)} />}

      {/* Modals */}
      {selectedInvoice && showPartPaymentModal && (
        <PartPaymentModal
          invoice={selectedInvoice}
          isOpen={showPartPaymentModal}
          onClose={() => { setShowPartPaymentModal(false); setSelectedInvoice(null); }}
          onPaymentRecorded={handlePaymentRecorded}
        />
      )}

      {selectedInvoice && showStatusUpdate && (
        <InvoiceStatusUpdate
          invoice={selectedInvoice}
          isOpen={showStatusUpdate}
          onClose={() => { setShowStatusUpdate(false); setSelectedInvoice(null); }}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      {selectedInvoice && showReminderManager && (
        <PaymentReminderManager
          invoice={selectedInvoice}
          isOpen={showReminderManager}
          onClose={() => { setShowReminderManager(false); setSelectedInvoice(null); }}
        />
      )}

      {selectedInvoice && showPaymentHistory && (
        <PaymentHistory
          invoice={selectedInvoice}
          payments={payments}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <Card className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoices...</p>
        </Card>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card className="p-12 text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading invoices</h3>
          <p className="text-gray-600 mb-6">
            {error instanceof Error ? error.message : 'Failed to load invoices. Please try again.'}
          </p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredInvoices.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first invoice.'
            }
          </p>
          <Button variant="primary" icon={Plus} onClick={onAddInvoice}>
            Create Invoice
          </Button>
        </Card>
      )}
    </motion.div>
  );
};

export default InvoiceList;
