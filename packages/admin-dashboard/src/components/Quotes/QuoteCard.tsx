import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, User, FileText, Clock, TrendingUp, Briefcase } from 'lucide-react';
import { Quote, Job } from '@/types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import ConvertToJobModal from './ConvertToJobModal';
import { formatDistanceToNow } from 'date-fns';

interface QuoteCardProps {
  quote: Quote;
  onClick?: () => void;
  onConvertToJob?: (jobData: Partial<Job>) => void;
  className?: string;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, onClick, onConvertToJob, className = '' }) => {
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

  const getDaysUntilExpiry = () => {
    const expiryDate = new Date(quote.validUntil);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExpiry = getDaysUntilExpiry();
  const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  const isExpired = daysUntilExpiry <= 0;
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card 
        className="h-full cursor-pointer hover:shadow-medium transition-all duration-200"
        onClick={onClick}
        hover
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">
              Quote #{quote.id.split('-')[1].toUpperCase()}
            </h3>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
              <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{quote.client.name}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-1 sm:space-y-2 ml-2">
            <Badge className={`${getStatusColor(quote.status)} text-xs`}>
              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
            </Badge>
            {isExpiringSoon && !isExpired && (
              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                Expires in {daysUntilExpiry} days
              </Badge>
            )}
            {isExpired && (
              <Badge className="bg-red-100 text-red-800 text-xs">
                Expired
              </Badge>
            )}
          </div>
        </div>

        {/* Value and Profit */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
            <span className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatCurrency(quote.total)}
            </span>
          </div>
          <div className="text-right">
            <div className="text-xs sm:text-sm text-gray-500">Profit Margin</div>
            <div className="text-base sm:text-lg font-semibold text-green-600">
              {quote.profitMargin.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Items Summary */}
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">
            {quote.items.length} item{quote.items.length !== 1 ? 's' : ''}
          </div>
          <div className="space-y-1">
            {quote.items.slice(0, 2).map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 truncate flex-1 mr-2">
                  {item.description}
                </span>
                <span className="text-gray-900 font-medium">
                  {formatCurrency(item.lineTotal)}
                </span>
              </div>
            ))}
            {quote.items.length > 2 && (
              <div className="text-sm text-gray-500">
                +{quote.items.length - 2} more items
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {quote.notes && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2">
              {quote.notes}
            </p>
          </div>
        )}

        {/* Convert to Job Button */}
        {canConvertToJob && (
          <div className="mb-4">
            <Button
              variant="primary"
              size="sm"
              icon={Briefcase}
              onClick={(e) => {
                e.stopPropagation();
                setShowConvertModal(true);
              }}
              className="w-full"
            >
              Convert to Job
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Created {formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true })}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Valid until {new Date(quote.validUntil).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>

      {/* Convert to Job Modal */}
      <ConvertToJobModal
        quote={quote}
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        onConvert={handleConvertToJob}
        isLoading={isConverting}
      />
    </motion.div>
  );
};

export default QuoteCard;
