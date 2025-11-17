import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Globe,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Package,
  DollarSign,
  Calendar,
  User
} from 'lucide-react';
import { Supplier, PurchaseOrder } from '@/types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import { formatDistanceToNow } from 'date-fns';

interface SupplierManagerProps {
  suppliers?: Supplier[];
  purchaseOrders?: PurchaseOrder[];
  onSupplierClick?: (supplier: Supplier) => void;
  onEditSupplier?: (supplier: Supplier) => void;
  onDeleteSupplier?: (supplierId: string) => void;
  onAddSupplier?: () => void;
  className?: string;
}

const SupplierManager: React.FC<SupplierManagerProps> = ({
  suppliers = [],
  purchaseOrders = [],
  onSupplierClick,
  onEditSupplier,
  onDeleteSupplier,
  onAddSupplier,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const statusOptions = [
    { value: '', label: 'All Suppliers' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  // Normalize suppliers data
  const normalizedSuppliers = suppliers.map((s: any) => ({
    ...s,
    contactPerson: s.contact_person ?? s.contactPerson ?? '',
    contact_person: s.contact_person ?? s.contactPerson ?? '',
    isActive: s.is_active ?? s.isActive ?? true,
    is_active: s.is_active ?? s.isActive ?? true,
    email: s.email || '',
  }));

  // Filter suppliers
  const filteredSuppliers = normalizedSuppliers.filter((supplier: any) => {
    const name = supplier.name || '';
    const contactPerson = supplier.contactPerson || '';
    const email = supplier.email || '';
    
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && supplier.isActive) ||
      (statusFilter === 'inactive' && !supplier.isActive);

    return matchesSearch && matchesStatus;
  });

  const getSupplierStats = (supplierId: string) => {
    const orders = purchaseOrders.filter(po => po.supplierId === supplierId);
    const totalOrders = orders.length;
    const totalValue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const lastOrder = orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())[0];
    
    return {
      totalOrders,
      totalValue,
      lastOrder,
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getOrderStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Suppliers</h2>
          <p className="text-sm sm:text-base text-gray-600">Manage your suppliers and purchase orders</p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button variant="secondary" size="sm" icon={Download} className="hidden sm:flex">
            Export
          </Button>
          <Button variant="secondary" size="sm" icon={Download} className="sm:hidden p-2" />
          <Button variant="primary" size="sm" icon={Plus} onClick={onAddSupplier} className="flex-1 sm:flex-none">
            <span className="hidden sm:inline">Add Supplier</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              placeholder="Search suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => {
          const stats = getSupplierStats(supplier.id);
          
          return (
            <motion.div
              key={supplier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Building className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                      <Badge className={getStatusColor(supplier.isActive)}>
                        {supplier.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onSupplierClick?.(supplier);
                      }}
                      className="p-2"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onEditSupplier?.(supplier);
                      }}
                      className="p-2"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDeleteSupplier?.(supplier.id);
                      }}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{supplier.contactPerson}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{supplier.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{supplier.phone}</span>
                  </div>
                  {(supplier.city || supplier.state || supplier.address) && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {supplier.city || (typeof supplier.address === 'object' ? supplier.address?.city : '')}
                        {supplier.city && supplier.state ? ', ' : ''}
                        {supplier.state || (typeof supplier.address === 'object' ? supplier.address?.state : '')}
                        {!supplier.city && !supplier.state && typeof supplier.address === 'string' ? supplier.address : ''}
                      </span>
                    </div>
                  )}
                  {supplier.website && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      <a 
                        href={supplier.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Orders</p>
                      <p className="font-semibold text-gray-900">{stats.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Value</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(stats.totalValue)}</p>
                    </div>
                  </div>
                  
                  {stats.lastOrder && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600">Last Order</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(stats.lastOrder.totalAmount)}
                          </p>
                        </div>
                        <Badge className={getOrderStatusColor(stats.lastOrder.status)}>
                          {stats.lastOrder.status}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredSuppliers.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No suppliers found
          </h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search criteria or add a new supplier.
          </p>
          <Button variant="primary" icon={Plus} onClick={onAddSupplier}>
            Add First Supplier
          </Button>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-xl">
              <Building className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Suppliers</p>
              <p className="text-2xl font-bold text-green-600">
                {suppliers.filter(s => s.isActive).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-blue-600">{purchaseOrders.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0))}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default SupplierManager;
