import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Save, 
  Send, 
  Eye, 
  Download,
  Calculator,
  Calendar,
  User,
  FileText,
  DollarSign,
  Percent,
  Hash
} from 'lucide-react';
import { Invoice, InvoiceItem, Client } from '@/types';
import { calculateInvoiceTotal } from '@/mocks/invoices';
import { getCurrencyOptions } from '@/mocks/settings';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { useClients } from '@/services/clientQueries';
import { useCreateInvoice, useUpdateInvoice, useSendInvoice } from '@/services/invoiceQueries';
import { useInvoice } from '@/services/invoiceQueries';
import { InvoiceService } from '@/services/invoices';
import { toast } from 'react-toastify';
import InvoicePreviewModal from './InvoicePreviewModal';

interface InvoiceBuilderProps {
  invoice?: Invoice;
  onSave?: (invoice: Invoice) => void;
  onSend?: (invoice: Invoice) => void;
  onPreview?: (invoice: Invoice) => void;
  className?: string;
}

const InvoiceBuilder: React.FC<InvoiceBuilderProps> = ({
  invoice,
  onSave,
  onSend,
  onPreview,
  className = '',
}) => {
  const invoiceId = invoice?.id;
  
  // Fetch existing invoice if editing
  const { data: existingInvoice } = useInvoice(invoiceId);
  
  // Fetch clients
  const { data: clientsData = [] } = useClients();
  
  // Mutations
  const createInvoiceMutation = useCreateInvoice();
  const updateInvoiceMutation = useUpdateInvoice();
  const sendInvoiceMutation = useSendInvoice();

  const [formData, setFormData] = useState({
    clientId: invoice?.clientId || existingInvoice?.clientId || '',
    paymentTerms: invoice?.paymentTerms || 'Net 15',
    notes: invoice?.notes || existingInvoice?.notes || '',
    dueDate: invoice?.dueDate 
      ? new Date(invoice.dueDate).toISOString().split('T')[0] 
      : existingInvoice?.dueDate
      ? new Date(existingInvoice.dueDate).toISOString().split('T')[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: invoice?.currency || existingInvoice?.currency || 'GBP',
  });

  const [items, setItems] = useState<InvoiceItem[]>(
    invoice?.items || existingInvoice?.items || [
      {
        id: 'item-1',
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxRate: 20,
        lineTotal: 0,
      }
    ]
  );

  const [selectedClient, setSelectedClient] = useState<Client | null>(
    invoice?.client || existingInvoice?.client || null
  );

  const [isCalculating, setIsCalculating] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Load existing invoice data when it's fetched
  React.useEffect(() => {
    if (existingInvoice && !invoice) {
      // Normalize existing invoice data
      const normalizedInvoice = {
        ...existingInvoice,
        clientId: existingInvoice.client_id || existingInvoice.clientId,
        dueDate: existingInvoice.due_date || existingInvoice.dueDate,
        items: (existingInvoice.items || []).map((item: any) => ({
          ...item,
          unitPrice: parseFloat(item.unit_price || item.unitPrice || 0),
          taxRate: parseFloat(item.tax_rate || item.taxRate || 0),
          lineTotal: parseFloat(item.line_total || item.lineTotal || 0),
          quantity: parseFloat(item.quantity || 0),
        })),
      };

      setFormData({
        clientId: normalizedInvoice.clientId || '',
        paymentTerms: 'Net 15',
        notes: normalizedInvoice.notes || '',
        dueDate: normalizedInvoice.dueDate 
          ? new Date(normalizedInvoice.dueDate).toISOString().split('T')[0] 
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currency: normalizedInvoice.currency || 'GBP',
      });
      setSelectedClient(normalizedInvoice.client || null);
      setItems(normalizedInvoice.items.length > 0 ? normalizedInvoice.items : [{
        id: 'item-1',
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxRate: 20,
        lineTotal: 0,
      }]);
    }
  }, [existingInvoice, invoice]);

  const totals = calculateInvoiceTotal(items);

  const handleClientChange = (clientId: string) => {
    const client = clientsData.find(c => c.id === clientId);
    setSelectedClient(client || null);
    setFormData(prev => ({ ...prev, clientId }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    setItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };
      
      // Recalculate line total
      if (field === 'quantity' || field === 'unitPrice' || field === 'taxRate') {
        const item = newItems[index];
        const subtotal = item.quantity * item.unitPrice;
        const taxAmount = subtotal * (item.taxRate / 100);
        newItems[index].lineTotal = subtotal + taxAmount;
      }
      
      return newItems;
    });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 8.5,
      lineTotal: 0,
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    if (!selectedClient) {
      toast.error('Please select a client');
      return;
    }

    if (items.length === 0 || items.every(item => !item.description.trim())) {
      toast.error('Please add at least one item');
      return;
    }

    try {
      const invoiceData = {
        client_id: selectedClient.id,
        items: items
          .filter(item => item.description.trim() !== '')
          .map(item => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            tax_rate: item.taxRate || 0,
          })),
        due_date: formData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currency: formData.currency,
        notes: formData.notes,
      };

      if (invoiceId || existingInvoice?.id) {
        // Update existing invoice
        await updateInvoiceMutation.mutateAsync({
          id: invoiceId || existingInvoice!.id,
          data: invoiceData,
        });
      } else {
        // Create new invoice
        await createInvoiceMutation.mutateAsync(invoiceData);
      }

      onSave?.(invoice || existingInvoice as Invoice);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleSend = async () => {
    if (!selectedClient) {
      toast.error('Please select a client');
      return;
    }

    if (items.length === 0 || items.every(item => !item.description.trim())) {
      toast.error('Please add at least one item');
      return;
    }

    try {
      // First save the invoice
      const invoiceData = {
        client_id: selectedClient.id,
        items: items
          .filter(item => item.description.trim() !== '')
          .map(item => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            tax_rate: item.taxRate || 0,
          })),
        due_date: formData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currency: formData.currency,
        notes: formData.notes,
      };

      let invoiceIdToSend: string;

      if (invoiceId || existingInvoice?.id) {
        // Update existing invoice
        const updated = await updateInvoiceMutation.mutateAsync({
          id: invoiceId || existingInvoice!.id,
          data: invoiceData,
        });
        invoiceIdToSend = updated.data.id;
      } else {
        // Create new invoice
        const created = await createInvoiceMutation.mutateAsync(invoiceData);
        invoiceIdToSend = created.data.id;
      }

      // Then send it
      await sendInvoiceMutation.mutateAsync(invoiceIdToSend);
      onSend?.(invoice || existingInvoice as Invoice);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const formatCurrency = (amount: number, currency: string = formData.currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handlePreview = () => {
    if (!selectedClient) {
      toast.error('Please select a client to preview the invoice');
      return;
    }
    if (items.length === 0 || items.every(item => !item.description.trim())) {
      toast.error('Please add at least one item to preview the invoice');
      return;
    }
    setShowPreviewModal(true);
  };

  // Create a preview invoice object for the modal
  const previewInvoice = React.useMemo(() => {
    if (!selectedClient || items.length === 0) return null;

    return {
      id: invoiceId || existingInvoice?.id || `preview-${Date.now()}`,
      clientId: selectedClient.id,
      client: selectedClient,
      items: items.filter(item => item.description.trim() !== ''),
      amount: totals.subtotal,
      taxAmount: totals.taxAmount,
      total: totals.total,
      currency: formData.currency,
      status: 'draft' as const,
      dueDate: formData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes: formData.notes,
      createdAt: invoice?.createdAt || existingInvoice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, [selectedClient, items, totals, formData, invoiceId, existingInvoice, invoice]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {invoice ? 'Edit Invoice' : 'Create Invoice'}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              {invoice ? 'Update invoice details' : 'Create a new invoice for your client'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button 
              variant="secondary" 
              size="sm" 
              className="sm:px-4 sm:py-2 sm:text-sm" 
              icon={Eye} 
              onClick={handlePreview}
              disabled={!selectedClient || items.length === 0}
            >
              Preview
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="sm:px-4 sm:py-2 sm:text-sm" 
              icon={Save} 
              onClick={handleSave}
              loading={createInvoiceMutation.isPending || updateInvoiceMutation.isPending}
              disabled={!selectedClient || items.length === 0}
            >
              Save Draft
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              className="sm:px-4 sm:py-2 sm:text-sm" 
              icon={Send} 
              onClick={handleSend}
              loading={createInvoiceMutation.isPending || updateInvoiceMutation.isPending || sendInvoiceMutation.isPending}
              disabled={!selectedClient || items.length === 0}
            >
              Send Invoice
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Selection */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Client
                  </label>
                  <Select
                    value={formData.clientId}
                    onChange={(e) => handleClientChange(e.target.value)}
                    options={[
                      { value: '', label: 'Choose a client...' },
                      ...clientsData.map(client => ({
                        value: client.id,
                        label: client.name,
                      }))
                    ]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Terms
                  </label>
                  <Select
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                    options={[
                      { value: 'Net 15', label: 'Net 15' },
                      { value: 'Net 30', label: 'Net 30' },
                      { value: 'Due on Receipt', label: 'Due on Receipt' },
                      { value: 'Custom', label: 'Custom' },
                    ]}
                  />
                </div>
              </div>

              {/* Currency Selection */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <Select
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  options={getCurrencyOptions()}
                />
              </div>

              {selectedClient && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedClient.name}</p>
                      <p className="text-sm text-gray-600">{selectedClient.email}</p>
                      <p className="text-sm text-gray-600">{selectedClient.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Invoice Items */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
                <Button variant="secondary" size="sm" icon={Plus} onClick={addItem}>
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <Input
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Item description"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Qty
                      </label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit Price
                      </label>
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tax Rate (%)
                      </label>
                      <Input
                        type="number"
                        value={item.taxRate}
                        onChange={(e) => handleItemChange(index, 'taxRate', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.1"
                        placeholder="8.5"
                      />
                    </div>
                    
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total
                        </label>
                        <div className="p-2 bg-gray-50 rounded border text-sm font-medium">
                          {formatCurrency(item.lineTotal, formData.currency)}
                        </div>
                      </div>
                      
                      {items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700"
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Additional Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes for the client"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Invoice Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="text-sm font-medium">{formatCurrency(totals.subtotal, formData.currency)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tax:</span>
                  <span className="text-sm font-medium">{formatCurrency(totals.taxAmount, formData.currency)}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-900">Total:</span>
                    <span className="text-base font-bold text-primary-600">
                      {formatCurrency(totals.total, formData.currency)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button 
                  variant="primary" 
                  className="w-full" 
                  icon={Save}
                  onClick={handleSave}
                >
                  Save Draft
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="w-full" 
                  icon={Send}
                  onClick={handleSend}
                >
                  Send Invoice
                </Button>
                
                <Button 
                  variant="ghost"
                  className="w-full" 
                  icon={Eye}
                  onClick={handlePreview}
                  disabled={!selectedClient || items.length === 0}
                >
                  Preview
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{items.length}</p>
                    <p className="text-xs text-gray-600">Items</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {items.reduce((sum, item) => sum + item.quantity, 0)}
                    </p>
                    <p className="text-xs text-gray-600">Total Qty</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewInvoice && (
        <InvoicePreviewModal
          invoice={previewInvoice}
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          onSend={async () => {
            setShowPreviewModal(false);
            await handleSend();
          }}
          onDownload={async () => {
            if (invoiceId || existingInvoice?.id) {
              try {
                const blob = await InvoiceService.downloadPdf(invoiceId || existingInvoice!.id);
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `invoice-${(invoiceId || existingInvoice!.id).substring(0, 8)}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                toast.success('Invoice PDF downloaded');
              } catch (error) {
                toast.error('Failed to download PDF');
              }
            } else {
              toast.info('Please save the invoice first before downloading');
            }
          }}
        />
      )}
    </motion.div>
  );
};

export default InvoiceBuilder;
