import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  DollarSign, 
  RefreshCw, 
  BarChart3,
  Plus,
  Eye,
  Edit,
  Trash2,
  CreditCard,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Invoice, Payment, RecurringBilling } from '@/types';
import { mockPayments, mockRecurringBilling } from '@/mocks/invoices';
import { useInvoices, usePayInvoice } from '@/services/invoiceQueries';
import { useInvoice } from '@/services/invoiceQueries';
import PartPaymentModal from '@/components/Invoices/PartPaymentModal';
import InvoiceDashboard from '@/components/Invoices/InvoiceDashboard';
import InvoiceList from '@/components/Invoices/InvoiceList';
import InvoiceBuilder from '@/components/Invoices/InvoiceBuilder';
import PaymentTracker from '@/components/Invoices/PaymentTracker';
import RecurringBillingComponent from '@/components/Invoices/RecurringBilling';
import FinancialReports from '@/components/Invoices/FinancialReports';
import PermissionGate from '@/components/auth/PermissionGate';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { toast } from 'react-toastify';

const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [isEditingInvoice, setIsEditingInvoice] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentInvoice, setSelectedPaymentInvoice] = useState<Invoice | null>(null);
  
  // Recurring billing state
  const [recurringBillingList, setRecurringBillingList] = useState<RecurringBilling[]>(mockRecurringBilling);
  const [showBillingDetailModal, setShowBillingDetailModal] = useState(false);
  const [showBillingEditModal, setShowBillingEditModal] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<RecurringBilling | null>(null);
  
  // Fetch invoices for dashboard stats
  const { data: invoicesData = [] } = useInvoices();
  const payInvoiceMutation = usePayInvoice();
  
  // Extract payments from invoices data (payments are included in invoice responses)
  // This ensures payment invoice IDs match actual invoice IDs from the API
  const paymentsFromInvoices = React.useMemo(() => {
    const allPayments: Payment[] = [];
    invoicesData.forEach((invoice: any) => {
      const invoicePayments = invoice.payments || [];
      invoicePayments.forEach((payment: any) => {
        allPayments.push({
          id: payment.id || `pay-${Date.now()}-${Math.random()}`,
          invoiceId: invoice.id, // Use the actual invoice ID from API
          amount: parseFloat(payment.amount || 0),
          paymentMethod: payment.payment_method || payment.paymentMethod || 'cash',
          paymentDate: payment.payment_date || payment.paymentDate || payment.created_at || payment.createdAt || new Date().toISOString(),
          reference: payment.reference || payment.transaction_id || '',
          notes: payment.notes || '',
          status: payment.status || 'completed',
          createdAt: payment.created_at || payment.createdAt || new Date().toISOString(),
        });
      });
    });
    return allPayments;
  }, [invoicesData]);
  
  // Map mock payments to actual invoice IDs if no payments from API
  // This ensures payment invoice IDs match actual invoice IDs from the API
  const mappedMockPayments = React.useMemo(() => {
    if (paymentsFromInvoices.length > 0 || invoicesData.length === 0) {
      return [];
    }
    // Map mock payments to actual invoice IDs
    return mockPayments.map((payment, index) => {
      // Try to find an invoice that matches the mock payment's invoice ID pattern
      // If not found, use the first available invoice
      const matchingInvoice = invoicesData.find((inv: any) => 
        inv.id === payment.invoiceId || inv.id?.includes(payment.invoiceId.substring(0, 8))
      ) || invoicesData[index % invoicesData.length];
      
      if (matchingInvoice) {
        return {
          ...payment,
          invoiceId: matchingInvoice.id, // Use the actual invoice ID from API
        };
      }
      return payment;
    });
  }, [invoicesData, paymentsFromInvoices]);
  
  // Use payments from invoices if available, otherwise use mapped mock payments
  const paymentsData = paymentsFromInvoices.length > 0 ? paymentsFromInvoices : mappedMockPayments;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'recurring', label: 'Recurring', icon: RefreshCw },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
  ];

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setActiveTab('invoices');
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsEditingInvoice(true);
    setActiveTab('invoices');
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    console.log('Delete invoice:', invoice.id);
    // Implement delete logic here
  };

  const handleAddInvoice = () => {
    setSelectedInvoice(null);
    setIsCreatingInvoice(true);
    setActiveTab('invoices');
  };

  const handleSaveInvoice = (invoice: Invoice) => {
    console.log('Save invoice:', invoice);
    setIsCreatingInvoice(false);
    setIsEditingInvoice(false);
    setSelectedInvoice(null);
  };

  const handleSendInvoice = (invoice: Invoice) => {
    console.log('Send invoice:', invoice);
    setIsCreatingInvoice(false);
    setIsEditingInvoice(false);
    setSelectedInvoice(null);
  };

  const handlePaymentClick = (payment: Payment) => {
    // Find the invoice for this payment and open its detail view
    const invoice = invoicesData.find((inv: any) => inv.id === payment.invoiceId);
    if (invoice) {
      setSelectedInvoice(invoice);
      setActiveTab('invoices');
      // Scroll to top to show the invoice
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error('Invoice not found for this payment');
    }
  };

  const handleAddPayment = () => {
    // Open payment modal - user will need to select an invoice
    if (invoicesData.length === 0) {
      toast.error('No invoices available. Please create an invoice first.');
      return;
    }
    // If there's a selected invoice, use it; otherwise, use the first unpaid invoice
    const invoiceToUse = selectedInvoice || invoicesData.find((inv: any) => inv.status !== 'paid');
    if (invoiceToUse) {
      setSelectedPaymentInvoice(invoiceToUse);
      setShowPaymentModal(true);
    } else {
      // If no unpaid invoice, use the first invoice
      const firstInvoice = invoicesData[0];
      if (firstInvoice) {
        setSelectedPaymentInvoice(firstInvoice);
        setShowPaymentModal(true);
      } else {
        toast.error('No invoices available');
      }
    }
  };

  const handleEditPayment = (payment: Payment) => {
    // Find the invoice for this payment
    const invoice = invoicesData.find((inv: any) => inv.id === payment.invoiceId);
    if (invoice) {
      setSelectedPaymentInvoice(invoice);
      setShowPaymentModal(true);
      toast.info('To edit a payment, please record a new payment or adjust the invoice.');
    } else {
      toast.error('Invoice not found for this payment');
    }
  };

  const handleDeletePayment = (payment: Payment) => {
    // Payment deletion is not directly supported - would need to adjust invoice
    if (window.confirm('Payment deletion is not directly supported. Would you like to view the invoice to adjust the payment status?')) {
      const invoice = invoicesData.find((inv: any) => inv.id === payment.invoiceId);
      if (invoice) {
        setSelectedInvoice(invoice);
        setActiveTab('invoices');
      }
    }
  };

  const handlePaymentRecorded = async (payment: Payment) => {
    // Record payment using the invoice payment endpoint
    if (selectedPaymentInvoice) {
      try {
        await payInvoiceMutation.mutateAsync({
          id: selectedPaymentInvoice.id,
          data: {
            payment_method: payment.paymentMethod as 'cash' | 'card' | 'bank_transfer' | 'xe_pay',
            amount: payment.amount,
            reference: payment.reference || undefined,
          },
        });
        // Modal will close itself after successful payment
        // The mutation will invalidate queries and refresh the invoice list
      } catch (error) {
        // Error handled by mutation - don't close modal on error
      }
    }
  };

  const handleBillingClick = (billing: RecurringBilling) => {
    setSelectedBilling(billing);
    setShowBillingDetailModal(true);
  };

  const handleAddBilling = () => {
    setSelectedBilling(null);
    setShowBillingEditModal(true);
  };

  const handleEditBilling = (billing: RecurringBilling) => {
    setSelectedBilling(billing);
    setShowBillingEditModal(true);
  };

  const handleDeleteBilling = (billing: RecurringBilling) => {
    if (window.confirm(`Are you sure you want to delete recurring billing "${billing.description || billing.id}"?`)) {
      setRecurringBillingList(prev => prev.filter(b => b.id !== billing.id));
      toast.success(`Recurring billing "${billing.description || billing.id}" deleted`);
      // TODO: Call API to delete recurring billing
    }
  };

  const handleToggleBilling = (billing: RecurringBilling) => {
    setRecurringBillingList(prev => prev.map(b => 
      b.id === billing.id ? { ...b, isActive: !b.isActive } : b
    ));
    const newStatus = billing.isActive ? 'paused' : 'activated';
    toast.success(`Recurring billing "${billing.description || billing.id}" ${newStatus}`);
    // TODO: Call API to update recurring billing status
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <InvoiceDashboard
            invoices={invoicesData}
            payments={paymentsData}
            onInvoiceClick={handleInvoiceClick}
            onAddInvoice={handleAddInvoice}
          />
        );
      
      case 'invoices':
        if (isCreatingInvoice || isEditingInvoice) {
          return (
            <InvoiceBuilder
              invoice={selectedInvoice || undefined}
              onSave={handleSaveInvoice}
              onSend={handleSendInvoice}
              onPreview={(invoice) => console.log('Preview invoice:', invoice.id)}
            />
          );
        }
        return (
          <InvoiceList
            onInvoiceClick={handleInvoiceClick}
            onEditInvoice={handleEditInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onAddInvoice={handleAddInvoice}
          />
        );
      
      case 'payments':
        return (
          <PaymentTracker
            payments={paymentsData}
            invoices={invoicesData}
            onPaymentClick={handlePaymentClick}
            onAddPayment={handleAddPayment}
            onEditPayment={handleEditPayment}
            onDeletePayment={handleDeletePayment}
          />
        );
      
      case 'recurring':
        return (
          <RecurringBillingComponent
            recurringBilling={recurringBillingList}
            onBillingClick={handleBillingClick}
            onAddBilling={handleAddBilling}
            onEditBilling={handleEditBilling}
            onDeleteBilling={handleDeleteBilling}
            onToggleBilling={handleToggleBilling}
          />
        );
      
      case 'reports':
        return (
          <FinancialReports
            invoices={invoicesData}
            payments={paymentsData}
          />
        );
      
      default:
        return null;
    }
  };

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
              Invoices & Billing
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage invoices, track payments, and generate financial reports
            </p>
          </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button 
                variant="secondary" 
                icon={Calendar} 
                className="hidden sm:flex"
                onClick={() => navigate('/scheduling')}
              >
                Schedule
              </Button>
              <Button 
                variant="secondary" 
                icon={Calendar} 
                className="sm:hidden p-2"
                onClick={() => navigate('/scheduling')}
              >
                <span className="sr-only">Schedule</span>
              </Button>
              <PermissionGate permission="invoices.create">
                <Button variant="primary" icon={Plus} onClick={handleAddInvoice} className="flex-1 sm:flex-none">
                  <span className="hidden sm:inline">Create Invoice</span>
                  <span className="sm:hidden">Create</span>
                </Button>
              </PermissionGate>
            </div>
          </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
      >
          <Card className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{invoicesData.length}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-xl" style={{ backgroundColor: '#F3F0FF' }}>
                <FileText className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#8552C5' }} />
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Paid Invoices</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">
                  {invoicesData.filter((inv: any) => inv.status === 'paid').length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-lg sm:text-2xl font-bold text-red-600">
                  {invoicesData.filter((inv: any) => inv.status === 'overdue').length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">
                  £{invoicesData
                    .filter((inv: any) => inv.status === 'paid')
                    .reduce((sum: number, inv: any) => sum + parseFloat(inv.total || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
                <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </Card>
      </motion.div>

      {/* View Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-0">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  style={activeTab === tab.id ? { backgroundColor: '#F3F0FF' } : {}}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {renderTabContent()}

        {/* Back to Invoices Button (when creating/editing) */}
        {(isCreatingInvoice || isEditingInvoice) && (
          <div className="mt-6">
            <Button
              variant="secondary"
              onClick={() => {
                setIsCreatingInvoice(false);
                setIsEditingInvoice(false);
                setSelectedInvoice(null);
              }}
            >
              ← Back to Invoices
            </Button>
          </div>
        )}
      </motion.div>

      {/* Payment Modal */}
      {selectedPaymentInvoice && showPaymentModal && (
        <PartPaymentModal
          invoice={selectedPaymentInvoice}
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPaymentInvoice(null);
          }}
          onPaymentRecorded={handlePaymentRecorded}
        />
      )}

      {/* Recurring Billing Detail Modal */}
      {selectedBilling && showBillingDetailModal && (
        <Modal
          isOpen={showBillingDetailModal}
          onClose={() => {
            setShowBillingDetailModal(false);
            setSelectedBilling(null);
          }}
          title={`Recurring Billing: ${selectedBilling.description}`}
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Client</label>
              <p className="text-gray-900">{selectedBilling.client?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Amount</label>
              <p className="text-gray-900">£{selectedBilling.amount.toFixed(2)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Frequency</label>
              <p className="text-gray-900 capitalize">{selectedBilling.frequency}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <Badge className={selectedBilling.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {selectedBilling.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Next Billing Date</label>
              <p className="text-gray-900">{new Date(selectedBilling.nextBillingDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Start Date</label>
              <p className="text-gray-900">{new Date(selectedBilling.startDate).toLocaleDateString()}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Recurring Billing Edit/Create Modal */}
      {showBillingEditModal && (
        <Modal
          isOpen={showBillingEditModal}
          onClose={() => {
            setShowBillingEditModal(false);
            setSelectedBilling(null);
          }}
          title={selectedBilling ? 'Edit Recurring Billing' : 'Create Recurring Billing'}
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              {selectedBilling 
                ? 'Edit recurring billing feature coming soon. This will allow you to modify billing details.'
                : 'Create recurring billing feature coming soon. This will allow you to set up automated recurring invoices.'}
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowBillingEditModal(false);
                  setSelectedBilling(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default InvoicesPage;
