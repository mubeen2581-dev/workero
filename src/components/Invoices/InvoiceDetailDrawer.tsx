import React, { useState } from 'react';
import { X } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import PaymentActions from '@/components/Invoices/PaymentActions';
import PaymentStatusTracker from '@/components/Payments/PaymentStatusTracker';
import { useInvoice } from '@/services/invoiceQueries';

interface InvoiceDetailDrawerProps {
  invoiceId: string | null;
  onClose: () => void;
}

const InvoiceDetailDrawer: React.FC<InvoiceDetailDrawerProps> = ({ invoiceId, onClose }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'payments'>('details');
  
  if (!invoiceId) return null;
  const { data: invoice, isLoading } = useInvoice(invoiceId);
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
        <div className="w-full max-w-lg bg-white h-full shadow-xl flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading invoice...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!invoice) return null;

  // Normalize invoice data (handle both camelCase and snake_case from API)
  const normalizedInvoice = {
    ...invoice,
    total: parseFloat((invoice as any).total?.toString() || '0'),
    dueDate: invoice.dueDate || (invoice as any).due_date,
    paidDate: invoice.paidDate || (invoice as any).paid_date,
    createdAt: invoice.createdAt || (invoice as any).created_at,
    updatedAt: invoice.updatedAt || (invoice as any).updated_at,
  };

  // Extract payments from invoice data (payments are included in the invoice response)
  const payments = (invoice as any).payments || [];
  const totalPaid = payments.reduce((s: number, p: any) => s + parseFloat(p.amount || 0), 0);
  const balance = Math.max(0, normalizedInvoice.total - totalPaid);
  
  // Create a simple timeline from invoice status changes
  const timeline = [
    { type: 'created', at: normalizedInvoice.createdAt, note: 'Invoice created' },
    ...(normalizedInvoice.status !== 'draft' ? [{ type: 'sent', at: normalizedInvoice.updatedAt, note: 'Invoice sent' }] : []),
    ...(normalizedInvoice.status === 'paid' && normalizedInvoice.paidDate ? [{ type: 'paid', at: normalizedInvoice.paidDate, note: 'Invoice paid' }] : []),
  ];

  const handlePaymentUpdate = () => {
    // Refresh data when payment is updated
    console.log('Payment updated, refreshing data...');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div className="w-full max-w-lg bg-white h-full shadow-xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Invoice #{normalizedInvoice.id.substring(0, 8).toUpperCase()}</h3>
              <p className="text-sm text-gray-600">{normalizedInvoice.client?.name || 'N/A'}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={normalizedInvoice.status === 'paid' ? 'bg-green-100 text-green-800' : normalizedInvoice.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                {normalizedInvoice.status.charAt(0).toUpperCase() + normalizedInvoice.status.slice(1)}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                icon={X}
                className="p-2"
              />
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'details'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'payments'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Payments
            </button>
          </div>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {activeTab === 'details' ? (
            <>
              {/* Invoice Summary */}
              <Card className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-600">Total</div>
                    <div className="text-xl font-semibold">£{normalizedInvoice.total.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Paid</div>
                    <div className="text-xl font-semibold text-green-600">£{totalPaid.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Balance</div>
                    <div className={`text-xl font-semibold ${balance > 0 ? 'text-red-600' : 'text-gray-900'}`}>£{balance.toLocaleString()}</div>
                  </div>
                </div>
              </Card>

              {/* Client Information */}
              <Card className="p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Client Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-600">Name:</span> {normalizedInvoice.client?.name || 'N/A'}</div>
                  <div><span className="text-gray-600">Email:</span> {normalizedInvoice.client?.email || 'N/A'}</div>
                  <div><span className="text-gray-600">Phone:</span> {normalizedInvoice.client?.phone || 'N/A'}</div>
                  <div><span className="text-gray-600">Due Date:</span> {normalizedInvoice.dueDate ? new Date(normalizedInvoice.dueDate).toLocaleDateString() : 'N/A'}</div>
                </div>
              </Card>

              {/* Timeline */}
              <Card className="p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Timeline</h4>
                <ul className="space-y-2 text-sm">
                  {timeline.map((e, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium">{e.type.charAt(0).toUpperCase() + e.type.slice(1)}</div>
                        <div className="text-gray-600">{new Date(e.at).toLocaleString()}</div>
                        {e.note && <div className="text-gray-500">{e.note}</div>}
                      </div>
                    </li>
                  ))}
                  {timeline.length === 0 && (
                    <li className="text-gray-500 text-center py-4">No timeline events yet.</li>
                  )}
                </ul>
              </Card>

              {/* Payment Actions */}
              <PaymentActions 
                invoice={normalizedInvoice as any} 
                onPaymentUpdate={handlePaymentUpdate}
              />
            </>
          ) : (
            /* Payments Tab */
            <PaymentStatusTracker 
              invoiceId={normalizedInvoice.id}
              onPaymentUpdate={handlePaymentUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailDrawer;


