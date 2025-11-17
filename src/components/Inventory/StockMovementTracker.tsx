import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Plus, 
  Minus, 
  RotateCcw,
  History,
  User,
  Calendar,
  Filter,
  Download,
  Search,
  Eye,
  Edit
} from 'lucide-react';
import { StockMovement, InventoryItem } from '@/types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { formatDistanceToNow } from 'date-fns';

interface StockMovementTrackerProps {
  movements?: StockMovement[];
  items?: InventoryItem[];
  onAddMovement?: (movement: Omit<StockMovement, 'id' | 'createdAt'>) => void;
  onEditMovement?: (movement: StockMovement) => void;
  className?: string;
}

const StockMovementTracker: React.FC<StockMovementTrackerProps> = ({
  movements = [],
  items = [],
  onAddMovement,
  onEditMovement,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [reasonFilter, setReasonFilter] = useState<string>('');
  const [itemFilter, setItemFilter] = useState<string>('');

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'in', label: 'Stock In' },
    { value: 'out', label: 'Stock Out' },
  ];

  const reasonOptions = [
    { value: '', label: 'All Reasons' },
    { value: 'purchase', label: 'Purchase' },
    { value: 'job_usage', label: 'Job Usage' },
    { value: 'adjustment', label: 'Adjustment' },
    { value: 'return', label: 'Return' },
    { value: 'damage', label: 'Damage' },
  ];

  const itemOptions = [
    { value: '', label: 'All Items' },
    ...items.map(item => ({ value: item.id, label: item.name })),
  ];

  // Filter movements
  const filteredMovements = movements.filter(movement => {
    const itemName = movement.item?.name || '';
    const reason = movement.reason || '';
    const reference = movement.reference || '';
    
    const matchesSearch = itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reference.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = !typeFilter || movement.type === typeFilter;
    const matchesReason = !reasonFilter || reason === reasonFilter;
    const itemId = movement.itemId ?? movement.item_id ?? movement.item?.id;
    const matchesItem = !itemFilter || itemId === itemFilter;

    return matchesSearch && matchesType && matchesReason && matchesItem;
  });

  const getMovementIcon = (type: string) => {
    return type === 'in' ? Plus : Minus;
  };

  const getMovementColor = (type: string) => {
    return type === 'in' ? 'text-green-600' : 'text-red-600';
  };

  const getMovementBgColor = (type: string) => {
    return type === 'in' ? 'bg-green-50' : 'bg-red-50';
  };

  const getReasonColor = (reason: string) => {
    const colorMap: Record<string, string> = {
      purchase: 'bg-blue-100 text-blue-800',
      job_usage: 'bg-purple-100 text-purple-800',
      adjustment: 'bg-yellow-100 text-yellow-800',
      return: 'bg-green-100 text-green-800',
      damage: 'bg-red-100 text-red-800',
    };
    return colorMap[reason] || 'bg-gray-100 text-gray-800';
  };

  const formatQuantity = (type: string, quantity: number) => {
    return type === 'in' ? `+${quantity}` : `-${quantity}`;
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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Stock Movements</h2>
          <p className="text-sm sm:text-base text-gray-600">Track all inventory movements and transactions</p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button variant="secondary" size="sm" icon={Download} className="hidden sm:flex">
            Export
          </Button>
          <Button variant="secondary" size="sm" icon={Download} className="sm:hidden p-2" />
          <Button variant="primary" size="sm" icon={Plus} className="flex-1 sm:flex-none">
            <span className="hidden sm:inline">Add Movement</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <Input
              placeholder="Search movements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
          
          <Select
            options={typeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
            placeholder="Type"
          />
          
          <Select
            options={reasonOptions}
            value={reasonFilter}
            onChange={setReasonFilter}
            placeholder="Reason"
          />
          
          <Select
            options={itemOptions}
            value={itemFilter}
            onChange={setItemFilter}
            placeholder="Item"
          />
        </div>
      </Card>

      {/* Movements List */}
      <div className="space-y-4">
        {filteredMovements.map((movement) => {
          const MovementIcon = getMovementIcon(movement.type);
          
          return (
            <motion.div
              key={movement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getMovementBgColor(movement.type)}`}>
                      <MovementIcon className={`w-6 h-6 ${getMovementColor(movement.type)}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {movement.item?.name || 'Unknown Item'}
                        </h3>
                        {movement.reason && (
                          <Badge className={getReasonColor(movement.reason)}>
                            {movement.reason.replace('_', ' ')}
                          </Badge>
                        )}
                        {movement.reference && (
                          <Badge className="bg-gray-100 text-gray-800">
                            {movement.reference}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        {movement.item?.sku && (
                          <div className="flex items-center space-x-2">
                            <Package className="w-4 h-4" />
                            <span>SKU: {movement.item.sku}</span>
                          </div>
                        )}
                        {movement.performer && (
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>
                              {movement.performer.first_name ?? movement.performer.firstName ?? ''} 
                              {' '}
                              {movement.performer.last_name ?? movement.performer.lastName ?? ''}
                            </span>
                          </div>
                        )}
                        {(movement.createdAt || movement.created_at || movement.performed_at) && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDistanceToNow(
                                new Date(movement.createdAt ?? movement.created_at ?? movement.performed_at ?? 0), 
                                { addSuffix: true }
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {movement.notes && (
                        <p className="text-sm text-gray-600 mt-2">{movement.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getMovementColor(movement.type)}`}>
                        {formatQuantity(movement.type, movement.quantity)}
                      </div>
                      {movement.item?.unit && (
                        <div className="text-sm text-gray-500">
                          {movement.item.unit}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onEditMovement?.(movement);
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
                        }}
                        className="p-2"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredMovements.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <History className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No movements found
          </h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search criteria or add a new movement.
          </p>
          <Button variant="primary" icon={Plus} onClick={() => onAddMovement?.({
            itemId: '',
            item: items[0],
            type: 'in',
            quantity: 0,
            reason: 'purchase',
            reference: '',
            notes: '',
            userId: 'user-1',
            user: {
              id: 'user-1',
              email: 'admin@workero.com',
              firstName: 'Admin',
              lastName: 'User',
              role: 'admin',
              isActive: true,
              createdAt: '2024-01-01T00:00:00Z',
            },
          })}>
            Add First Movement
          </Button>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Movements</p>
              <p className="text-2xl font-bold text-gray-900">{movements.length}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-xl">
              <History className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock In</p>
              <p className="text-2xl font-bold text-green-600">
                {movements.filter(m => m.type === 'in').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Out</p>
              <p className="text-2xl font-bold text-red-600">
                {movements.filter(m => m.type === 'out').length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <Minus className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default StockMovementTracker;
