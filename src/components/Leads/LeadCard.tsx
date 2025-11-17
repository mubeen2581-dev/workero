import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Calendar, User, DollarSign } from 'lucide-react';
import { Lead } from '@/types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatDistanceToNow } from 'date-fns';

interface LeadCardProps {
  lead: Lead;
  onClick?: () => void;
  className?: string;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onClick, className = '' }) => {
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      quoted: 'bg-purple-100 text-purple-800',
      converted: 'bg-emerald-100 text-emerald-800',
      lost: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colorMap: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colorMap[priority] || 'bg-gray-100 text-gray-800';
  };

  const getSourceIcon = (source: string) => {
    const iconMap: Record<string, string> = {
      website: '🌐',
      referral: '👥',
      advertisement: '📢',
      cold_call: '📞',
      other: '📋',
    };
    return iconMap[source] || '📋';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
              {lead.client.name}
            </h3>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
              <span>{getSourceIcon(lead.source)}</span>
              <span className="capitalize">{lead.source.replace('_', ' ')}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-1 sm:space-y-2 ml-2">
            <Badge className={`${getStatusColor(lead.status)} text-xs`}>
              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
            </Badge>
            <Badge className={`${getPriorityColor(lead.priority)} text-xs`}>
              {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
            <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{lead.client.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
            <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            <span>{lead.client.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{lead.client.address.city}, {lead.client.address.state}</span>
          </div>
        </div>

        {/* Value and Score */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(lead.estimatedValue)}
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Lead Score</div>
            <div className="text-lg font-semibold text-primary-600">
              {lead.client.leadScore}
            </div>
          </div>
        </div>

        {/* Tags */}
        {lead.client.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {lead.client.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
              {lead.client.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                  +{lead.client.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {lead.notes && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2">
              {lead.notes}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Updated {formatDistanceToNow(new Date(lead.updatedAt), { addSuffix: true })}</span>
          </div>
          
          {lead.assignedTo && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <User className="w-4 h-4" />
              <span>Assigned</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default LeadCard;
