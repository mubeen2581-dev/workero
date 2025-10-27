import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCw, 
  Calendar, 
  DollarSign, 
  User, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause,
  Eye,
  Search,
  Filter,
  Download,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { RecurringBilling as RecurringBillingType, Client } from '@/types';
import { mockRecurringBilling } from '@/mocks/invoices';
import { mockClients } from '@/mocks/leads';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { Table } from '../ui/Table';
import { formatDistanceToNow } from 'date-fns';

interface RecurringBillingProps {
  recurringBilling?: RecurringBillingType[];
  clients?: Client[];
  onBillingClick?: (billing: RecurringBillingType) => void;
  onAddBilling?: () => void;
  onEditBilling?: (billing: RecurringBillingType) => void;
  onDeleteBilling?: (billing: RecurringBillingType) => void;
  onToggleBilling?: (billing: RecurringBillingType) => void;
  className?: string;
}

const RecurringBillingComponent: React.FC<RecurringBillingProps> = ({
  recurringBilling = mockRecurringBilling,
  clients = mockClients,
  onBillingClick,
  onAddBilling,
  onEditBilling,
  onDeleteBilling,
  onToggleBilling,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [frequencyFilter, setFrequencyFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('nextBillingDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredBilling = useMemo(() => {
    let filtered = recurringBilling.filter(billing => {
      const client = clients.find(c => c.id === billing.clientId);
      const matchesSearch = 
        billing.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        billing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client && client.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && billing.isActive) ||
        (statusFilter === 'inactive' && !billing.isActive);
      
      const matchesFrequency = frequencyFilter === 'all' || billing.frequency === frequencyFilter;

      return matchesSearch && matchesStatus && matchesFrequency;
    });

    // Sort billing
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'nextBillingDate':
          aValue = new Date(a.nextBillingDate).getTime();
          bValue = new Date(b.nextBillingDate).getTime();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'client':
          const aClient = clients.find(c => c.id === a.clientId);
          const bClient = clients.find(c => c.id === b.clientId);
          aValue = aClient?.name || '';
          bValue = bClient?.name || '';
          break;
        case 'frequency':
          aValue = a.frequency;
          bValue = b.frequency;
          break;
        default:
          aValue = new Date(a.nextBillingDate).getTime();
          bValue = new Date(b.nextBillingDate).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [recurringBilling, clients, searchTerm, statusFilter, frequencyFilter, sortBy, sortOrder]);

  const billingStats = useMemo(() => {
    const totalBilling = recurringBilling.length;
    const activeBilling = recurringBilling.filter(b => b.isActive).length;
    const inactiveBilling = recurringBilling.filter(b => !b.isActive).length;
    const totalMonthlyValue = recurringBilling
      .filter(b => b.isActive)
      .reduce((sum, billing) => {
        const monthlyMultiplier = billing.frequency === 'monthly' ? 1 : 
                                 billing.frequency === 'quarterly' ? 1/3 : 
                                 billing.frequency === 'yearly' ? 1/12 : 1;
        return sum + (billing.amount * monthlyMultiplier);
      }, 0);

    const upcomingBilling = recurringBilling
      .filter(b => b.isActive)
      .filter(b => {
        const nextDate = new Date(b.nextBillingDate);
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        return nextDate >= now && nextDate <= nextWeek;
      });

    return {
      totalBilling,
      activeBilling,
      inactiveBilling,
      totalMonthlyValue,
      upcomingBilling,
    };
  }, [recurringBilling]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const getFrequencyColor = (frequency: string) => {
    const colorMap: Record<string, string> = {
      monthly: 'bg-blue-100 text-blue-800',
      quarterly: 'bg-green-100 text-green-800',
      yearly: 'bg-purple-100 text-purple-800',
    };
    return colorMap[frequency] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? CheckCircle : Pause;
  };

  const getNextBillingStatus = (nextBillingDate: string) => {
    const now = new Date();
    const nextDate = new Date(nextBillingDate);
    const daysUntil = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) {
      return { status: 'overdue', color: 'text-red-600', icon: AlertTriangle };
    } else if (daysUntil <= 3) {
      return { status: 'due_soon', color: 'text-yellow-600', icon: Clock };
    } else {
      return { status: 'scheduled', color: 'text-gray-600', icon: Calendar };
    }
  };

  const columns = [
    {
      key: 'billing',
      header: 'Recurring Billing',
      render: (billing: RecurringBillingType) => {
        const client = clients.find(c => c.id === billing.clientId);
        return (
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <RefreshCw className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{billing.description}</p>
              <p className="text-xs text-gray-500">{client?.name}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'client',
      header: 'Client',
      render: (billing: RecurringBillingType) => {
        const client = clients.find(c => c.id === billing.clientId);
        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{client?.name}</p>
              <p className="text-xs text-gray-500">{client?.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (billing: RecurringBillingType) => (
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{formatCurrency(billing.amount)}</p>
          <Badge className={getFrequencyColor(billing.frequency)}>
            {billing.frequency}
          </Badge>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (billing: RecurringBillingType) => {
        const StatusIcon = getStatusIcon(billing.isActive);
        return (
          <Badge className={getStatusColor(billing.isActive)}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {billing.isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      key: 'nextBilling',
      header: 'Next Billing',
      render: (billing: RecurringBillingType) => {
        const nextBillingStatus = getNextBillingStatus(billing.nextBillingDate);
        const StatusIcon = nextBillingStatus.icon;
        const daysUntil = Math.ceil((new Date(billing.nextBillingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        
        return (
          <div className="text-right">
            <p className={`text-sm font-medium ${nextBillingStatus.color}`}>
              {new Date(billing.nextBillingDate).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500">
              {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` : 
               daysUntil === 0 ? 'Due today' :
               daysUntil === 1 ? 'Due tomorrow' :
               `Due in ${daysUntil} days`}
            </p>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (billing: RecurringBillingType) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={billing.isActive ? Pause : Play}
            onClick={() => onToggleBilling?.(billing)}
            className={billing.isActive ? 'text-yellow-600' : 'text-green-600'}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Eye}
            onClick={() => onBillingClick?.(billing)}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={() => onEditBilling?.(billing)}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => onDeleteBilling?.(billing)}
            className="text-red-600 hover:text-red-700"
          />
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recurring Billing</h2>
          <p className="text-gray-600">Manage automated recurring invoices</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="secondary" icon={Download}>
            Export
          </Button>
          <Button variant="primary" icon={Plus} onClick={onAddBilling}>
            Create Recurring Billing
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Billing</p>
              <p className="text-2xl font-bold text-gray-900">{billingStats.totalBilling}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-xl">
              <RefreshCw className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{billingStats.activeBilling}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-gray-600">{billingStats.inactiveBilling}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-xl">
              <Pause className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Value</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(billingStats.totalMonthlyValue)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Upcoming Billing */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Billing</h3>
            <Badge className="bg-blue-100 text-blue-800">
              {billingStats.upcomingBilling.length} due soon
            </Badge>
          </div>
          
          <div className="space-y-3">
            {billingStats.upcomingBilling.slice(0, 5).map((billing) => {
              const client = clients.find(c => c.id === billing.clientId);
              const daysUntil = Math.ceil((new Date(billing.nextBillingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <motion.div
                  key={billing.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => onBillingClick?.(billing)}
                >
                  <div className="flex items-center space-x-3">
                    <RefreshCw className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{billing.description}</p>
                      <p className="text-xs text-gray-500">{client?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(billing.amount)}</p>
                    <p className="text-xs text-blue-600">
                      {daysUntil === 0 ? 'Due today' :
                       daysUntil === 1 ? 'Due tomorrow' :
                       `Due in ${daysUntil} days`}
                    </p>
                  </div>
                </motion.div>
              );
            })}
            
            {billingStats.upcomingBilling.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming billing</p>
              </div>
            )}
          </div>
        </Card>

        {/* Frequency Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequency Breakdown</h3>
          
          <div className="space-y-3">
            {['monthly', 'quarterly', 'yearly'].map((frequency) => {
              const count = recurringBilling.filter(b => b.frequency === frequency && b.isActive).length;
              const totalAmount = recurringBilling
                .filter(b => b.frequency === frequency && b.isActive)
                .reduce((sum, b) => sum + b.amount, 0);
              
              return (
                <div key={frequency} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge className={getFrequencyColor(frequency)}>
                      {frequency}
                    </Badge>
                    <span className="text-sm font-medium text-gray-900">{count} active</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(totalAmount)}</p>
                    <p className="text-xs text-gray-500">total value</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          
          <div className="space-y-3">
            <Button 
              variant="secondary" 
              className="w-full justify-start" 
              icon={Plus}
              onClick={onAddBilling}
            >
              Create New Billing
            </Button>
            
            <Button 
              variant="secondary" 
              className="w-full justify-start" 
              icon={Settings}
            >
              Billing Settings
            </Button>
            
            <Button 
              variant="secondary" 
              className="w-full justify-start" 
              icon={Download}
            >
              Export Data
            </Button>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <Input
              placeholder="Search billing..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
            <Select
              value={frequencyFilter}
              onChange={(e) => setFrequencyFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Frequencies' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <div className="flex space-x-2">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { value: 'nextBillingDate', label: 'Next Billing' },
                  { value: 'amount', label: 'Amount' },
                  { value: 'client', label: 'Client' },
                  { value: 'frequency', label: 'Frequency' },
                ]}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredBilling.length} of {recurringBilling.length} recurring billing
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" icon={Filter}>
            More Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table className="w-full">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredBilling.map((billing, rowIndex) => (
              <tr key={billing.id} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 text-sm text-gray-900">
                    {column.render(billing)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Empty State */}
      {filteredBilling.length === 0 && (
        <Card className="p-12 text-center">
          <RefreshCw className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recurring billing found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' || frequencyFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first recurring billing.'
            }
          </p>
          <Button variant="primary" icon={Plus} onClick={onAddBilling}>
            Create Recurring Billing
          </Button>
        </Card>
      )}
    </motion.div>
  );
};

export default RecurringBillingComponent;
