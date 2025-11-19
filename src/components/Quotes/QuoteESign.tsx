import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PenTool, Check, X, Download, Send } from 'lucide-react';
import { Quote } from '@/types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import SignaturePad from '../ui/SignaturePad';
import { toast } from 'react-toastify';

interface QuoteESignProps {
  quote: Quote;
  onSign: (signatureData: string) => Promise<void>;
  onDecline?: () => void;
  isLoading?: boolean;
}

const QuoteESign: React.FC<QuoteESignProps> = ({ 
  quote, 
  onSign, 
  onDecline,
  isLoading = false 
}) => {
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  const handleClear = () => {
    setSignatureData(null);
  };

  const handleSign = async () => {
    if (!signatureData) {
      toast.error('Please provide your signature');
      return;
    }

    setIsSigning(true);
    try {
      await onSign(signatureData);
    } catch (error) {
      console.error('Error signing quote:', error);
    } finally {
      setIsSigning(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (quote.esignatureStatus === 'signed') {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Quote Signed</h3>
          <p className="text-gray-600 mb-4">
            This quote was signed on {quote.esignatureSignedAt 
              ? new Date(quote.esignatureSignedAt).toLocaleDateString()
              : 'N/A'}
          </p>
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="w-4 h-4 mr-2" />
            Download Signed Quote
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <PenTool className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Sign Quote</h3>
        </div>
        <p className="text-sm text-gray-600">
          Please review the quote below and sign to accept the terms and pricing.
        </p>
      </div>

      {/* Quote Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Subtotal:</span>
            <span className="text-sm font-medium">{formatCurrency(quote.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Tax:</span>
            <span className="text-sm font-medium">{formatCurrency(quote.taxAmount)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="text-base font-semibold text-gray-900">Total:</span>
            <span className="text-base font-bold text-primary-600">
              {formatCurrency(quote.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Signature Pad */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Signature
        </label>
        <SignaturePad
          onSignatureChange={(data) => {
            setSignatureData(data);
            if (data) {
              toast.success('Signature captured! Click "Sign & Accept Quote" to proceed.');
            }
          }}
          signature={signatureData}
          className="w-full"
        />
      </div>

      {/* Terms and Conditions */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Terms & Conditions</h4>
        <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
          <li>This quote is valid until {new Date(quote.validUntil).toLocaleDateString()}</li>
          <li>By signing, you agree to the terms and pricing outlined in this quote</li>
          <li>Work will commence upon receipt of signed quote and deposit (if applicable)</li>
          <li>Payment terms as specified in the quote</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleSign}
          disabled={!signatureData || isSigning || isLoading}
          className="flex-1"
        >
          {isSigning ? (
            'Signing...'
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Sign & Accept Quote
            </>
          )}
        </Button>
        {onDecline && (
          <Button
            variant="outline"
            onClick={onDecline}
            disabled={isSigning || isLoading}
          >
            <X className="w-4 h-4 mr-2" />
            Decline
          </Button>
        )}
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        By signing, you acknowledge that you have read and agree to the terms of this quote.
      </p>
    </Card>
  );
};

export default QuoteESign;

