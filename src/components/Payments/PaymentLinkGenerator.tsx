import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Mail, MessageSquare, Copy, ExternalLink, Clock } from 'lucide-react';
import { Invoice, XEPayLink } from '@/types';
import { XEPayService } from '@/services/xepay';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { toast } from 'react-toastify';

interface PaymentLinkGeneratorProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
  onLinkGenerated?: (link: XEPayLink) => void;
}

const PaymentLinkGenerator: React.FC<PaymentLinkGeneratorProps> = ({
  invoice,
  isOpen,
  onClose,
  onLinkGenerated,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [paymentLink, setPaymentLink] = useState<XEPayLink | null>(null);
  const [sendMethod, setSendMethod] = useState<'email' | 'sms'>('email');
  const [customMessage, setCustomMessage] = useState('');

  const sendMethodOptions = [
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
  ];

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    try {
      const link = await XEPayService.createPaymentLink({
        invoiceId: invoice.id,
        amount: invoice.total,
        currency: 'GBP',
        description: `Invoice #${invoice.id.split('-')[1].toUpperCase()}`,
        customerEmail: invoice.client.email,
        returnUrl: `${window.location.origin}/invoices/${invoice.id}`,
        webhookUrl: `${window.location.origin}/api/webhooks/xepay`,
      });

      setPaymentLink(link);
      onLinkGenerated?.(link);
      toast.success('Payment link generated successfully!');
    } catch (error) {
      toast.error('Failed to generate payment link');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink.paymentUrl);
      toast.success('Payment link copied to clipboard!');
    }
  };

  const handleSendLink = async () => {
    if (!paymentLink) return;

    setIsSending(true);
    try {
      const recipient = sendMethod === 'email' ? invoice.client.email : invoice.client.phone;
      await XEPayService.sendPaymentLink({
        paymentLinkId: paymentLink.id,
        method: sendMethod,
        recipient,
        message: customMessage || undefined,
      });

      toast.success(`Payment link sent via ${sendMethod}!`);
      onClose();
    } catch (error) {
      toast.error(`Failed to send payment link via ${sendMethod}`);
    } finally {
      setIsSending(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const getExpiryTime = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const hoursLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60));
    return hoursLeft;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Payment Link"
      size="md"
    >
      <div className="space-y-4">
        {/* Invoice Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900">
              Invoice #{invoice.id.split('-')[1].toUpperCase()}
            </h4>
            <span className="text-lg font-bold text-primary-600">
              {formatCurrency(invoice.total)}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <div>Client: {invoice.client.name}</div>
            <div>Email: {invoice.client.email}</div>
            <div>Phone: {invoice.client.phone}</div>
          </div>
        </div>

        {!paymentLink ? (
          /* Generate Link Section */
          <div className="text-center py-6">
            <Link className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Generate Secure Payment Link
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Create a secure XE Pay link that your client can use to pay this invoice instantly.
            </p>
            <Button
              variant="primary"
              onClick={handleGenerateLink}
              loading={isGenerating}
              icon={Link}
            >
              Generate Payment Link
            </Button>
          </div>
        ) : (
          /* Payment Link Generated */
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Link className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="text-sm font-medium text-green-900">
                  Payment Link Generated
                </h4>
              </div>
              <div className="bg-white rounded border p-3 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate flex-1 mr-2">
                    {paymentLink.paymentUrl}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyLink}
                    icon={Copy}
                    className="text-gray-500 hover:text-gray-700"
                  />
                </div>
              </div>
              <div className="flex items-center text-sm text-green-700">
                <Clock className="w-4 h-4 mr-1" />
                Expires in {getExpiryTime(paymentLink.expiresAt)} hours
              </div>
            </div>

            {/* Send Options */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Send to Client</h4>
              
              <Select
                label="Send Method"
                options={sendMethodOptions}
                value={sendMethod}
                onChange={(value) => setSendMethod(value as 'email' | 'sms')}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Message (Optional)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder={`Add a personal message to include with the payment link...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={() => window.open(paymentLink.paymentUrl, '_blank')}
                icon={ExternalLink}
              >
                Preview Link
              </Button>
              
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  onClick={onClose}
                >
                  Done
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSendLink}
                  loading={isSending}
                  icon={sendMethod === 'email' ? Mail : MessageSquare}
                >
                  Send {sendMethod === 'email' ? 'Email' : 'SMS'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PaymentLinkGenerator;