import React, { useState } from 'react';
import { Link, CreditCard, Bell } from 'lucide-react';
import { Invoice, XEPayLink, PaymentMethod } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import PaymentLinkGenerator from '@/components/Payments/PaymentLinkGenerator';
import PaymentMethodSelector from '@/components/Payments/PaymentMethodSelector';
import { toast } from 'react-toastify';

interface PaymentActionsProps {
  invoice: Invoice;
  onPaymentUpdate?: () => void;
}

const PaymentActions: React.FC<PaymentActionsProps> = ({ 
  invoice, 
  onPaymentUpdate 
}) => {
  const [showLinkGenerator, setShowLinkGenerator] = useState(false);
  const [showMethodSelector, setShowMethodSelector] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Guard clause to prevent undefined errors
  if (!invoice) {
    return (
      <Card className="p-3">
        <div className="text-center text-gray-500">Loading invoice...</div>
      </Card>
    );
  }

  const handleLinkGenerated = (link: XEPayLink) => {
    console.log('Payment link generated:', link);
    onPaymentUpdate?.();
  };

  const handleMethodSelected = async (method: PaymentMethod) => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Payment processed via ${method.name}`);
      onPaymentUpdate?.();
    } catch (error) {
      toast.error('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendReminder = async () => {
    try {
      // Simulate sending reminder
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.info('Payment reminder sent to client');
    } catch (error) {
      toast.error('Failed to send reminder');
    }
  };

  const canSendLink = invoice?.status !== 'paid';
  const canProcessPayment = invoice?.status !== 'paid';

  return (
    <>
      <Card className="p-3">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Payment Actions</h3>
        
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="primary"
              onClick={() => setShowLinkGenerator(true)}
              disabled={!canSendLink}
              icon={Link}
              size="sm"
              className="w-full text-xs"
            >
              Link
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => setShowMethodSelector(true)}
              disabled={!canProcessPayment || isProcessing}
              loading={isProcessing}
              icon={CreditCard}
              size="sm"
              className="w-full text-xs"
            >
              Pay
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleSendReminder}
              icon={Bell}
              size="sm"
              className="w-full text-xs"
            >
              Remind
            </Button>
          </div>
          
          {invoice?.status === 'paid' && (
            <div className="text-xs text-green-600 text-center py-1">
              ✓ Paid in full
            </div>
          )}
        </div>
      </Card>

      {/* Payment Link Generator Modal */}
      <PaymentLinkGenerator
        invoice={invoice}
        isOpen={showLinkGenerator}
        onClose={() => setShowLinkGenerator(false)}
        onLinkGenerated={handleLinkGenerated}
      />

      {/* Payment Method Selector Modal */}
      <PaymentMethodSelector
        isOpen={showMethodSelector}
        onClose={() => setShowMethodSelector(false)}
        onMethodSelect={handleMethodSelected}
        amount={invoice?.total || 0}
      />
    </>
  );
};

export default PaymentActions;


