import React, { useState } from 'react';
import { X } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import PaymentActions from '@/components/Invoices/PaymentActions';
import PaymentStatusTracker from '@/components/Payments/PaymentStatusTracker';
import { useInvoiceQuery, usePaymentsQuery, useTimelineQuery } from '@/services/invoiceQueries';

interface InvoiceDetailDrawerProps {
  invoiceId: string | null;
  onClose: () => void;
}

const InvoiceDetailDrawer: React.FC<InvoiceDetailDrawerProps> = ({ invoiceId, onClose }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'payments'>('details');
  
  if (!invoiceId) return null;
  const { data: invoice } = useInvoiceQuery(invoiceId);
  const { data: payments = [] } = usePaymentsQuery(invoiceId);
  const { data: timeline = [] } = useTimelineQuery(invoiceId);
  if (!invoice) return null;

  const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
  const balance = Math.max(0, invoice.total - totalPaid);

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
              <h3 className="text-lg font-semibold text-gray-900">Invoice #{invoice.id.split('-')[1].toUpperCase()}</h3>
              <p className="text-sm text-gray-600">{invoice.client.name}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={invoice.status === 'paid' ? 'bg-green-100 text-green-800' : invoice.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
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
                    <div className="text-xl font-semibold">${invoice.total.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Paid</div>
                    <div className="text-xl font-semibold text-green-600">${totalPaid.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Balance</div>
                    <div className={`text-xl font-semibold ${balance > 0 ? 'text-red-600' : 'text-gray-900'}`}>${balance.toLocaleString()}</div>
                  </div>
                </div>
              </Card>

              {/* Client Information */}
              <Card className="p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Client Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-600">Name:</span> {invoice.client.name}</div>
                  <div><span className="text-gray-600">Email:</span> {invoice.client.email}</div>
                  <div><span className="text-gray-600">Phone:</span> {invoice.client.phone}</div>
                  <div><span className="text-gray-600">Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString()}</div>
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
                invoice={invoice} 
                onPaymentUpdate={handlePaymentUpdate}
              />
            </>
          ) : (
            /* Payments Tab */
            <PaymentStatusTracker 
              invoiceId={invoice.id}
              onPaymentUpdate={handlePaymentUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailDrawer;


