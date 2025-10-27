import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
import { mockInvoices, mockPayments, mockRecurringBilling } from '@/mocks/invoices';
import InvoiceDashboard from '@/components/Invoices/InvoiceDashboard';
import InvoiceList from '@/components/Invoices/InvoiceList';
import InvoiceBuilder from '@/components/Invoices/InvoiceBuilder';
import PaymentTracker from '@/components/Invoices/PaymentTracker';
import RecurringBillingComponent from '@/components/Invoices/RecurringBilling';
import FinancialReports from '@/components/Invoices/FinancialReports';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const InvoicesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [isEditingInvoice, setIsEditingInvoice] = useState(false);

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
    console.log('Payment clicked:', payment.id);
  };

  const handleAddPayment = () => {
    console.log('Add payment');
  };

  const handleEditPayment = (payment: Payment) => {
    console.log('Edit payment:', payment.id);
  };

  const handleDeletePayment = (payment: Payment) => {
    console.log('Delete payment:', payment.id);
  };

  const handleBillingClick = (billing: RecurringBilling) => {
    console.log('Billing clicked:', billing.id);
  };

  const handleAddBilling = () => {
    console.log('Add recurring billing');
  };

  const handleEditBilling = (billing: RecurringBilling) => {
    console.log('Edit billing:', billing.id);
  };

  const handleDeleteBilling = (billing: RecurringBilling) => {
    console.log('Delete billing:', billing.id);
  };

  const handleToggleBilling = (billing: RecurringBilling) => {
    console.log('Toggle billing:', billing.id);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <InvoiceDashboard
            invoices={mockInvoices}
            payments={mockPayments}
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
            invoices={mockInvoices}
            onInvoiceClick={handleInvoiceClick}
            onEditInvoice={handleEditInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onAddInvoice={handleAddInvoice}
          />
        );
      
      case 'payments':
        return (
          <PaymentTracker
            payments={mockPayments}
            invoices={mockInvoices}
            onPaymentClick={handlePaymentClick}
            onAddPayment={handleAddPayment}
            onEditPayment={handleEditPayment}
            onDeletePayment={handleDeletePayment}
          />
        );
      
      case 'recurring':
        return (
          <RecurringBillingComponent
            recurringBilling={mockRecurringBilling}
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
            invoices={mockInvoices}
            payments={mockPayments}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Invoices & Billing</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                Manage invoices, track payments, and generate financial reports
              </p>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button variant="secondary" icon={Calendar} className="hidden sm:flex">
                Schedule
              </Button>
              <Button variant="secondary" icon={Calendar} className="sm:hidden p-2">
                <span className="sr-only">Schedule</span>
              </Button>
              <Button variant="primary" icon={Plus} onClick={handleAddInvoice} className="flex-1 sm:flex-none">
                <span className="hidden sm:inline">Create Invoice</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-8">
          <Card className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{mockInvoices.length}</p>
              </div>
              <div className="p-2 sm:p-3 bg-primary-100 rounded-xl">
                <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Paid Invoices</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">
                  {mockInvoices.filter(inv => inv.status === 'paid').length}
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
                  {mockInvoices.filter(inv => inv.status === 'overdue').length}
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
                  ${mockInvoices
                    .filter(inv => inv.status === 'paid')
                    .reduce((sum, inv) => sum + inv.total, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
                <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Card className="mb-4 sm:mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-2 sm:space-x-8 px-3 sm:px-6 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </Card>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>

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
      </div>
    </motion.div>
  );
};

export default InvoicesPage;
