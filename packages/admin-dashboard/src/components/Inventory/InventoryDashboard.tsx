import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  ShoppingCart,
  Truck,
  BarChart3,
  Eye,
  Plus,
  Filter,
  Download
} from 'lucide-react';
import { InventoryItem, StockMovement } from '@/types';
import { 
  mockInventoryItems, 
  mockStockMovements, 
  getInventoryStats, 
  getLowStockItems,
  generateReorderSuggestions 
} from '@/mocks/inventory';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatDistanceToNow } from 'date-fns';

interface InventoryDashboardProps {
  items?: InventoryItem[];
  movements?: StockMovement[];
  onItemClick?: (item: InventoryItem) => void;
  onAddItem?: () => void;
  className?: string;
}

const InventoryDashboard: React.FC<InventoryDashboardProps> = ({
  items = mockInventoryItems,
  movements = mockStockMovements,
  onItemClick,
  onAddItem,
  className = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');

  const stats = getInventoryStats();
  const lowStockItems = getLowStockItems();
  const reorderSuggestions = generateReorderSuggestions();

  // Filter items based on selected filters
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = !selectedCategory || item.categoryId === selectedCategory;
      const matchesSupplier = !selectedSupplier || item.supplierId === selectedSupplier;
      return matchesCategory && matchesSupplier;
    });
  }, [items, selectedCategory, selectedSupplier]);

  // Get recent stock movements
  const recentMovements = movements
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStockStatusColor = (item: InventoryItem) => {
    if (item.currentStock === 0) return 'bg-red-100 text-red-800';
    if (item.currentStock <= item.minStock) return 'bg-yellow-100 text-yellow-800';
    if (item.currentStock <= item.reorderPoint) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  const getStockStatusText = (item: InventoryItem) => {
    if (item.currentStock === 0) return 'Out of Stock';
    if (item.currentStock <= item.minStock) return 'Critical';
    if (item.currentStock <= item.reorderPoint) return 'Low Stock';
    return 'In Stock';
  };

  const getMovementIcon = (type: string) => {
    return type === 'in' ? '↗️' : '↘️';
  };

  const getMovementColor = (type: string) => {
    return type === 'in' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-xl">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.lowStockItems}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{stats.outOfStockItems}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalValue)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Items */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Items</h3>
            <Badge className="bg-yellow-100 text-yellow-800">
              {lowStockItems.length} items
            </Badge>
          </div>
          
          <div className="space-y-3">
            {lowStockItems.slice(0, 5).map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onItemClick?.(item)}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{item.currentStock}</p>
                  <Badge className={`text-xs ${getStockStatusColor(item)}`}>
                    {getStockStatusText(item)}
                  </Badge>
                </div>
              </motion.div>
            ))}
            
            {lowStockItems.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">All items are well stocked</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Stock Movements */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Movements</h3>
            <Button variant="ghost" size="sm" icon={Eye}>
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentMovements.map((movement) => (
              <motion.div
                key={movement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getMovementIcon(movement.type)}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{movement.item.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(movement.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${getMovementColor(movement.type)}`}>
                    {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                  </p>
                  <p className="text-xs text-gray-500">{movement.reason}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Reorder Suggestions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Reorder Suggestions</h3>
            <Button variant="ghost" size="sm" icon={ShoppingCart}>
              Create PO
            </Button>
          </div>
          
          <div className="space-y-3">
            {reorderSuggestions.slice(0, 5).map((suggestion) => (
              <motion.div
                key={suggestion.item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{suggestion.item.name}</p>
                  <p className="text-xs text-gray-500">Current: {suggestion.item.currentStock}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    +{suggestion.suggestedQuantity}
                  </p>
                  <Badge className={`text-xs ${
                    suggestion.urgency === 'critical' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {suggestion.urgency}
                  </Badge>
                </div>
              </motion.div>
            ))}
            
            {reorderSuggestions.length === 0 && (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No reorder suggestions</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-600">Manage your inventory efficiently</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm" icon={Filter}>
              Filter
            </Button>
            <Button variant="secondary" size="sm" icon={Download}>
              Export
            </Button>
            <Button variant="primary" size="sm" icon={Plus} onClick={onAddItem}>
              Add Item
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default InventoryDashboard;
