import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MoreVertical, MessageCircle } from 'lucide-react';
import { Lead } from '@/types';
import { TableRow, TableCell } from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';

interface LeadTableRowProps {
  lead: Lead;
  onClick?: () => void;
  onMessage?: () => void;
  onMore?: () => void;
}

const LeadTableRow: React.FC<LeadTableRowProps> = ({ 
  lead, 
  onClick, 
  onMessage, 
  onMore 
}) => {
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
    <TableRow onClick={onClick} hover>
      {/* Client Info */}
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-medium text-sm">
                {lead.client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {lead.client.name}
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>{getSourceIcon(lead.source)}</span>
              <span className="capitalize">{lead.source.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      </TableCell>

      {/* Contact */}
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <Mail className="w-3 h-3" />
            <span className="truncate max-w-32">{lead.client.email}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <Phone className="w-3 h-3" />
            <span>{lead.client.phone}</span>
          </div>
        </div>
      </TableCell>

      {/* Location */}
      <TableCell>
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{lead.client.address.city}, {lead.client.address.state}</span>
        </div>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge className={getStatusColor(lead.status)}>
          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
        </Badge>
      </TableCell>

      {/* Priority */}
      <TableCell>
        <Badge className={getPriorityColor(lead.priority)}>
          {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
        </Badge>
      </TableCell>

      {/* Value */}
      <TableCell>
        <div className="text-sm font-medium text-gray-900">
          {formatCurrency(lead.estimatedValue)}
        </div>
        <div className="text-xs text-gray-500">
          Score: {lead.client.leadScore}
        </div>
      </TableCell>

      {/* Assigned To */}
      <TableCell>
        {lead.assignedTo ? (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">MS</span>
            </div>
            <span className="text-sm text-gray-600">Assigned</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">Unassigned</span>
        )}
      </TableCell>

      {/* Created */}
      <TableCell>
        <div className="text-sm text-gray-600">
          {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onMessage?.();
            }}
            className="p-2"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onMore?.();
            }}
            className="p-2"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default LeadTableRow;
