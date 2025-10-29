import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, Send, MoreVertical, Briefcase, Copy, Trash2, Download } from 'lucide-react';
import { Quote, Job } from '@/types';
import { TableRow, TableCell } from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import DropdownMenu from '../ui/DropdownMenu';
import ConvertToJobModal from './ConvertToJobModal';
import { formatDistanceToNow } from 'date-fns';

interface QuoteTableRowProps {
  quote: Quote;
  onClick?: () => void;
  onView?: () => void;
  onEdit?: () => void;
  onSend?: () => void;
  onMore?: () => void;
  onConvertToJob?: (jobData: Partial<Job>) => void;
}

const QuoteTableRow: React.FC<QuoteTableRowProps> = ({
  quote,
  onClick,
  onView,
  onEdit,
  onSend,
  onMore,
  onConvertToJob,
}) => {
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-yellow-100 text-yellow-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const canConvertToJob = quote.status === 'accepted';

  const handleConvertToJob = async (jobData: Partial<Job>) => {
    setIsConverting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (onConvertToJob) {
      onConvertToJob(jobData);
    }
    
    setIsConverting(false);
    setShowConvertModal(false);
    console.log('Quote converted to job:', jobData);
  };

  return (
    <>
      <TableRow onClick={onClick}>
        {/* Quote & Client */}
        <TableCell>
          <div>
            <div className="font-medium text-gray-900">
              Quote #{quote.id.split('-')[1].toUpperCase()}
            </div>
            <div className="text-sm text-gray-600">{quote.client.name}</div>
          </div>
        </TableCell>

        {/* Client Info */}
        <TableCell>
          <div className="text-sm">
            <div className="text-gray-900">{quote.client.email}</div>
            <div className="text-gray-600">{quote.client.phone}</div>
          </div>
        </TableCell>

        {/* Items */}
        <TableCell>
          <div className="text-sm text-gray-900">
            {quote.items.length} item{quote.items.length !== 1 ? 's' : ''}
          </div>
        </TableCell>

        {/* Status */}
        <TableCell>
          <Badge className={getStatusColor(quote.status)}>
            {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
          </Badge>
        </TableCell>

        {/* Total */}
        <TableCell>
          <div className="font-medium text-gray-900">
            {formatCurrency(quote.total)}
          </div>
          <div className="text-xs text-green-600">
            {quote.profitMargin.toFixed(1)}% margin
          </div>
        </TableCell>

        {/* Created */}
        <TableCell>
          <div className="text-sm text-gray-900">
            {formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true })}
          </div>
        </TableCell>

        {/* Valid Until */}
        <TableCell>
          <div className="text-sm text-gray-900">
            {new Date(quote.validUntil).toLocaleDateString()}
          </div>
        </TableCell>

        {/* Actions */}
        <TableCell>
          <div 
            className="flex items-center space-x-1"
            onClick={(e) => e.stopPropagation()}
          >
            {canConvertToJob && (
              <Button
                variant="ghost"
                size="sm"
                icon={Briefcase}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConvertModal(true);
                }}
                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                title="Convert to Job"
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              icon={Eye}
              onClick={(e) => {
                e.stopPropagation();
                onView?.();
              }}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title="View Quote"
            />
            <Button
              variant="ghost"
              size="sm"
              icon={Edit}
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
              title="Edit Quote"
            />
            {quote.status === 'draft' && (
              <Button
                variant="ghost"
                size="sm"
                icon={Send}
                onClick={(e) => {
                  e.stopPropagation();
                  onSend?.();
                }}
                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                title="Send Quote"
              />
            )}
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenu
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={MoreVertical}
                    className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                    title="More Actions"
                  />
                }
              items={[
                {
                  label: 'Duplicate Quote',
                  icon: Copy,
                  onClick: () => console.log('Duplicate quote:', quote.id),
                },
                {
                  label: 'Download PDF',
                  icon: Download,
                  onClick: () => console.log('Download PDF:', quote.id),
                },
                {
                  label: 'Delete Quote',
                  icon: Trash2,
                  onClick: () => {
                    if (confirm('Are you sure you want to delete this quote?')) {
                      console.log('Delete quote:', quote.id);
                    }
                  },
                  destructive: true,
                  disabled: quote.status === 'accepted',
                },
              ]}
              />
            </div>
          </div>
        </TableCell>
      </TableRow>

      {/* Convert to Job Modal */}
      <ConvertToJobModal
        quote={quote}
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        onConvert={handleConvertToJob}
        isLoading={isConverting}
      />
    </>
  );
};

export default QuoteTableRow;