import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Send, CheckCircle, PenTool } from 'lucide-react';
import { Quote } from '@/types';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface InstantContractProps {
  quote: Quote;
  onGenerateContract: () => Promise<void>;
  onSignContract: () => Promise<void>;
  isLoading?: boolean;
}

const InstantContract: React.FC<InstantContractProps> = ({
  quote,
  onGenerateContract,
  onSignContract,
  isLoading = false,
}) => {
  const [contractGenerated, setContractGenerated] = useState(quote.contractGenerated || false);

  const handleGenerate = async () => {
    try {
      await onGenerateContract();
      setContractGenerated(true);
    } catch (error) {
      console.error('Error generating contract:', error);
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

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Instant Contract & eSign</h3>
          <p className="text-xs text-gray-600">Go from quote to signed job in one flow</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Contract Status */}
        {contractGenerated ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-900">Contract Generated</span>
            </div>
            <p className="text-xs text-green-700">
              Your contract is ready. Attach scope and payment terms, collect signature, and move straight into scheduling.
            </p>
          </motion.div>
        ) : (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 mb-3">
              No more exporting to Docusign or reformatting contracts. Generate your contract instantly with all quote details.
            </p>
            <Button
              variant="primary"
              onClick={handleGenerate}
              loading={isLoading}
              className="w-full"
              icon={FileText}
            >
              Generate Contract
            </Button>
          </div>
        )}

        {/* Contract Mapping */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-900">Contract Mapping:</h4>
          <div className="space-y-2">
            {[
              { from: 'Estimate', to: 'Job', checked: true },
              { from: 'Group', to: 'Phases', checked: true },
              { from: 'Line Items', to: 'Tasks', checked: true },
              { from: 'Materials', to: 'Materials', checked: true },
              { from: 'Equipment', to: 'Equipment', checked: true },
              { from: 'Permits', to: 'Tasks', checked: true },
            ].map((mapping, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">{mapping.from}</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-sm text-gray-700">{mapping.to}</span>
                </div>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  mapping.checked
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300'
                }`}>
                  {mapping.checked && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contract Actions */}
        {contractGenerated && (
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={Download}
                onClick={() => {
                  // Download contract PDF
                  window.open(`/api/quotes/${quote.id}/contract/pdf`, '_blank');
                }}
              >
                Download
              </Button>
              {quote.requiresEsignature && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={PenTool}
                  onClick={onSignContract}
                  disabled={quote.esignatureStatus === 'signed'}
                >
                  {quote.esignatureStatus === 'signed' ? 'Signed' : 'Sign Now'}
                </Button>
              )}
            </div>
            {quote.requiresEsignature && quote.esignatureStatus !== 'signed' && (
              <Button
                variant="secondary"
                size="sm"
                icon={Send}
                className="w-full"
                onClick={() => {
                  // Send contract for signature
                  window.location.href = `/quotes/${quote.id}/sign`;
                }}
              >
                Send for Signature
              </Button>
            )}
          </div>
        )}

        {/* Contract Summary */}
        <div className="pt-4 border-t border-gray-200">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Contract Value:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(quote.total)}</span>
            </div>
            {quote.paymentSchedule && quote.paymentSchedule.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Schedule:</span>
                <span className="font-semibold text-gray-900">
                  {quote.paymentSchedule.length} payments
                </span>
              </div>
            )}
            {quote.totalPermitCost && quote.totalPermitCost > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Permit Costs:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(quote.totalPermitCost)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InstantContract;


