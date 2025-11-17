import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Eye, 
  Plus,
  BookOpen,
  User,
  Calendar,
  DollarSign,
  FileText
} from 'lucide-react';
import { Quote, QuoteItem, Client } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import QuoteItemRow from '@/components/Quotes/QuoteItemRow';
import QuoteSummary from '@/components/Quotes/QuoteSummary';
import AIQuoteBuilder from '@/components/Quotes/AIQuoteBuilder';
import QuoteTemplateSelector from '@/components/Quotes/QuoteTemplateSelector';
import SaveAsTemplateModal from '@/components/Quotes/SaveAsTemplateModal';
import QuotePreviewModal from '@/components/Quotes/QuotePreviewModal';
import { useClients } from '@/services/clientQueries';
import { useCreateQuote, useUpdateQuote, useSendQuote, useQuote } from '@/services/quoteQueries';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const QuoteBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { id: quoteId } = useParams<{ id?: string }>();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [notes, setNotes] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Fetch clients from API
  const { data: clientsData = [], isLoading: clientsLoading } = useClients();
  const { data: existingQuote, isLoading: quoteLoading } = useQuote(quoteId);
  const createQuoteMutation = useCreateQuote();
  const updateQuoteMutation = useUpdateQuote();
  const sendQuoteMutation = useSendQuote();

  // Load existing quote data when editing
  React.useEffect(() => {
    if (existingQuote && quoteId) {
      // Set client
      if (existingQuote.client) {
        setSelectedClient(existingQuote.client);
      }
      
      // Set items
      if (existingQuote.items && existingQuote.items.length > 0) {
        const normalizedItems = existingQuote.items.map((item: any) => ({
          id: item.id || `item-${Date.now()}-${Math.random()}`,
          description: item.description || '',
          quantity: parseFloat(item.quantity || '0'),
          unitPrice: parseFloat(item.unit_price || item.unitPrice || '0'),
          taxRate: parseFloat(item.tax_rate || item.taxRate || '0'),
          lineTotal: parseFloat(item.line_total || item.lineTotal || '0'),
        }));
        setItems(normalizedItems);
      }
      
      // Set notes
      if (existingQuote.notes) {
        setNotes(existingQuote.notes);
      }
      
      // Set valid until
      if (existingQuote.validUntil || existingQuote.valid_until) {
        const validUntilDate = existingQuote.validUntil || existingQuote.valid_until;
        const date = new Date(validUntilDate);
        const formattedDate = date.toISOString().split('T')[0];
        setValidUntil(formattedDate);
      }
    }
  }, [existingQuote, quoteId]);

  const clientOptions = useMemo(() => {
    return clientsData.map(client => ({
      value: client.id,
      label: `${client.name} (${client.email})`,
    }));
  }, [clientsData]);

  const handleAddItem = () => {
    const newItem: QuoteItem = {
      id: `item-${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 0,
      lineTotal: 0,
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (updatedItem: QuoteItem) => {
    setItems(items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleAddAISuggestions = (aiItems: QuoteItem[]) => {
    setItems([...items, ...aiItems]);
  };

  const handleSaveDraft = async () => {
    if (!selectedClient || items.length === 0) {
      toast.error('Please select a client and add at least one item');
      return;
    }

    if (!validUntil) {
      toast.error('Please set a valid until date');
      return;
    }

    try {
      const quoteData = {
        client_id: selectedClient.id,
        items: items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          tax_rate: item.taxRate || 0,
        })),
        valid_until: validUntil,
        notes: notes || undefined,
      };

      if (quoteId) {
        await updateQuoteMutation.mutateAsync({
          id: quoteId,
          data: quoteData,
        });
      } else {
        await createQuoteMutation.mutateAsync(quoteData);
      }
      
      navigate('/quotes');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleSendQuote = async () => {
    if (!selectedClient || items.length === 0) {
      toast.error('Please select a client and add at least one item');
      return;
    }

    if (!validUntil) {
      toast.error('Please set a valid until date');
      return;
    }

    try {
      // First save/create the quote
      const quoteData = {
        client_id: selectedClient.id,
        items: items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          tax_rate: item.taxRate || 0,
        })),
        valid_until: validUntil,
        notes: notes || undefined,
      };

      let quoteIdToSend = quoteId;
      
      if (!quoteIdToSend) {
        const created = await createQuoteMutation.mutateAsync(quoteData);
        quoteIdToSend = created.data.id;
      } else {
        await updateQuoteMutation.mutateAsync({
          id: quoteIdToSend,
          data: quoteData,
        });
      }

      // Then send it
      await sendQuoteMutation.mutateAsync(quoteIdToSend);
      
      navigate('/quotes');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handlePreviewQuote = () => {
    if (!selectedClient) {
      toast.error('Please select a client to preview the quote');
      return;
    }
    if (items.length === 0) {
      toast.error('Please add at least one item to preview the quote');
      return;
    }
    setShowPreviewModal(true);
  };

  // Create a preview quote object for the modal
  const previewQuote = useMemo(() => {
    if (!selectedClient || items.length === 0) return null;

    // Calculate totals
    const subtotal = items.reduce((sum, item) => {
      const lineTotal = item.lineTotal || (item.quantity * item.unitPrice);
      return sum + lineTotal;
    }, 0);
    
    const taxAmount = items.reduce((sum, item) => {
      const lineTotal = item.lineTotal || (item.quantity * item.unitPrice);
      return sum + (lineTotal * (item.taxRate || 0) / 100);
    }, 0);
    
    const total = subtotal + taxAmount;

    return {
      id: quoteId || `preview-${Date.now()}`,
      clientId: selectedClient.id,
      client: selectedClient,
      items: items,
      subtotal: subtotal,
      taxAmount: taxAmount,
      total: total,
      profitMargin: 0,
      status: 'draft' as const,
      validUntil: validUntil || new Date().toISOString(),
      notes: notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, [selectedClient, items, notes, validUntil, quoteId]);

  const handleSaveAsTemplate = async (templateData: any) => {
    setIsSavingTemplate(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Saving template:', templateData);
    setIsSavingTemplate(false);
    setShowSaveTemplateModal(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowLeft}
              onClick={() => navigate('/quotes')}
              className="flex-shrink-0"
            >
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quote Builder</h1>
              <p className="text-sm sm:text-base text-gray-600">Create and customize quotes for your clients</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button
              variant="secondary"
              icon={Save}
              onClick={handleSaveDraft}
              loading={createQuoteMutation.isPending || updateQuoteMutation.isPending}
              disabled={!selectedClient || items.length === 0}
              className="hidden sm:flex"
            >
              Save Draft
            </Button>
            <Button
              variant="secondary"
              icon={Save}
              onClick={handleSaveDraft}
              loading={createQuoteMutation.isPending || updateQuoteMutation.isPending}
              disabled={!selectedClient || items.length === 0}
              className="sm:hidden p-2"
            >
              <span className="sr-only">Save Draft</span>
            </Button>
            <Button
              variant="secondary"
              icon={Eye}
              onClick={handlePreviewQuote}
              className="hidden sm:flex"
            >
              Preview
            </Button>
            <Button
              variant="secondary"
              icon={Eye}
              onClick={handlePreviewQuote}
              className="sm:hidden p-2"
            >
              <span className="sr-only">Preview</span>
            </Button>
            {items.length > 0 && (
              <Button
                variant="secondary"
                icon={BookOpen}
                onClick={() => setShowSaveTemplateModal(true)}
                className="hidden lg:flex"
              >
                Save Template
              </Button>
            )}
            <Button
              variant="primary"
              icon={Send}
              onClick={handleSendQuote}
              loading={createQuoteMutation.isPending || updateQuoteMutation.isPending || sendQuoteMutation.isPending}
              disabled={!selectedClient || items.length === 0 || !validUntil}
              className="flex-1 sm:flex-none"
            >
              <span className="hidden sm:inline">Send Quote</span>
              <span className="sm:hidden">Send</span>
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="xl:col-span-2 space-y-4 sm:space-y-6"
        >
          {/* Client Selection */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary-600" />
              Client Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Select Client"
                options={clientOptions}
                placeholder={clientsLoading ? "Loading clients..." : "Choose a client"}
                value={selectedClient?.id || ''}
                onChange={(clientId) => {
                  const client = clientsData.find(c => c.id === clientId);
                  setSelectedClient(client || null);
                }}
                disabled={clientsLoading}
              />
              
              <Input
                label="Valid Until"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>

            {selectedClient && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedClient.name}</p>
                    <p className="text-sm text-gray-600">{selectedClient.email}</p>
                    <p className="text-sm text-gray-600">{selectedClient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{selectedClient.address.street}</p>
                    <p className="text-sm text-gray-600">
                      {selectedClient.address.city}, {selectedClient.address.state} {selectedClient.address.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Quote Items */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary-600" />
                Quote Items
              </h3>
              <Button
                variant="secondary"
                size="sm"
                icon={Plus}
                onClick={handleAddItem}
              >
                Add Item
              </Button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No items added yet</h4>
                <p className="text-gray-500 mb-4">Start by adding items to your quote or use AI suggestions</p>
                <Button
                  variant="primary"
                  icon={Plus}
                  onClick={handleAddItem}
                >
                  Add First Item
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tax %
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <QuoteItemRow
                        key={item.id}
                        item={item}
                        onUpdate={handleUpdateItem}
                        onDelete={handleDeleteItem}
                        isEditable={true}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Notes */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes or terms for this quote..."
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows={4}
            />
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Quote Summary */}
          <QuoteSummary items={items} />

          {/* Quote Templates */}
          <QuoteTemplateSelector onSelectTemplate={(templateItems) => setItems([...items, ...templateItems])} />

          {/* AI Quote Builder */}
          <AIQuoteBuilder onAddItems={handleAddAISuggestions} />
        </motion.div>
      </div>

      {/* Save as Template Modal */}
      <SaveAsTemplateModal
        items={items}
        isOpen={showSaveTemplateModal}
        onClose={() => setShowSaveTemplateModal(false)}
        onSave={handleSaveAsTemplate}
        isLoading={isSavingTemplate}
      />

      {/* Quote Preview Modal */}
      <QuotePreviewModal
        quote={previewQuote}
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
      />
    </div>
  );
};

export default QuoteBuilder;
