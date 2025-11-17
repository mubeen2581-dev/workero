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
  items = [],
  movements = [],
  onItemClick,
  onAddItem,
  className = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');

  // Calculate stats from real data
  const stats = useMemo(() => {
    const totalItems = items.length;
    const lowStockItems = items.filter(item => {
      const stock = item.currentStock ?? item.current_stock ?? item.quantity ?? 0;
      const reorderPoint = item.reorderPoint ?? item.reorder_point ?? 0;
      return stock <= reorderPoint && stock > 0;
    });
    const outOfStockItems = items.filter(item => {
      const stock = item.currentStock ?? item.current_stock ?? item.quantity ?? 0;
      return stock === 0;
    });
    const totalValue = items.reduce((sum, item) => {
      const stock = item.currentStock ?? item.current_stock ?? item.quantity ?? 0;
      const price = item.unitPrice ?? item.unit_price ?? 0;
      return sum + (stock * price);
    }, 0);

    return {
      totalItems,
      lowStockItems: lowStockItems.length,
      outOfStockItems: outOfStockItems.length,
      totalValue,
    };
  }, [items]);

  // Get low stock items
  const lowStockItems = useMemo(() => {
    return items.filter(item => {
      const stock = item.currentStock ?? item.current_stock ?? item.quantity ?? 0;
      const reorderPoint = item.reorderPoint ?? item.reorder_point ?? 0;
      return stock <= reorderPoint && stock > 0;
    }).slice(0, 10);
  }, [items]);

  // Generate reorder suggestions
  const reorderSuggestions = useMemo(() => {
    return lowStockItems.map(item => {
      const stock = item.currentStock ?? item.current_stock ?? item.quantity ?? 0;
      const reorderPoint = item.reorderPoint ?? item.reorder_point ?? 0;
      const minStock = item.minStock ?? item.min_stock ?? 0;
      const suggestedQuantity = Math.max(reorderPoint - stock, minStock);
      const urgency = stock <= minStock ? 'critical' : 'normal';
      
      return {
        item,
        suggestedQuantity,
        urgency,
      };
    });
  }, [lowStockItems]);

  // Filter items based on selected filters
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const category = typeof item.category === 'string' ? item.category : item.category?.name || '';
      const matchesCategory = !selectedCategory || category === selectedCategory;
      const matchesSupplier = !selectedSupplier; // Supplier filter not implemented yet
      return matchesCategory && matchesSupplier;
    });
  }, [items, selectedCategory, selectedSupplier]);

  // Get recent stock movements
  const recentMovements = useMemo(() => {
    return movements
      .filter(m => m.createdAt || m.created_at)
      .sort((a, b) => {
        const dateA = new Date(a.createdAt ?? a.created_at ?? 0).getTime();
        const dateB = new Date(b.createdAt ?? b.created_at ?? 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [movements]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStockStatusColor = (item: InventoryItem) => {
    const stock = item.currentStock ?? item.current_stock ?? item.quantity ?? 0;
    const minStock = item.minStock ?? item.min_stock ?? 0;
    const reorderPoint = item.reorderPoint ?? item.reorder_point ?? 0;
    
    if (stock === 0) return 'bg-red-100 text-red-800';
    if (minStock > 0 && stock <= minStock) return 'bg-yellow-100 text-yellow-800';
    if (reorderPoint > 0 && stock <= reorderPoint) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  const getStockStatusText = (item: InventoryItem) => {
    const stock = item.currentStock ?? item.current_stock ?? item.quantity ?? 0;
    const minStock = item.minStock ?? item.min_stock ?? 0;
    const reorderPoint = item.reorderPoint ?? item.reorder_point ?? 0;
    
    if (stock === 0) return 'Out of Stock';
    if (minStock > 0 && stock <= minStock) return 'Critical';
    if (reorderPoint > 0 && stock <= reorderPoint) return 'Low Stock';
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
                  <p className="text-sm font-medium text-gray-900">
                    {item.currentStock ?? item.current_stock ?? item.quantity ?? 0}
                  </p>
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
                    <p className="text-sm font-medium text-gray-900">
                      {movement.item?.name || 'Unknown Item'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {movement.createdAt || movement.created_at 
                        ? formatDistanceToNow(new Date(movement.createdAt ?? movement.created_at), { addSuffix: true })
                        : 'Recently'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${getMovementColor(movement.type)}`}>
                    {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                  </p>
                  <p className="text-xs text-gray-500">{movement.reason || movement.type}</p>
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
                  <p className="text-xs text-gray-500">
                    Current: {suggestion.item.currentStock ?? suggestion.item.current_stock ?? suggestion.item.quantity ?? 0}
                  </p>
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
