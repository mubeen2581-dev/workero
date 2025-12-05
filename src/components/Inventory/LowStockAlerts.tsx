import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Package, TrendingDown, ShoppingCart } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { InventoryItem } from '@/types';
import { useLowStockAlerts } from '@/services/inventoryQueries';
// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

interface LowStockAlertsProps {
  onItemClick?: (item: InventoryItem) => void;
  onReorder?: (item: InventoryItem) => void;
  maxItems?: number;
  showActions?: boolean;
  className?: string;
}

const LowStockAlerts: React.FC<LowStockAlertsProps> = ({
  onItemClick,
  onReorder,
  maxItems = 10,
  showActions = true,
  className = '',
}) => {
  const { data: lowStockItems = [], isLoading, error } = useLowStockAlerts();

  const categorizedItems = useMemo(() => {
    const outOfStock: InventoryItem[] = [];
    const critical: InventoryItem[] = [];
    const low: InventoryItem[] = [];

    lowStockItems.forEach((item) => {
      const stock = item.currentStock ?? item.current_stock ?? item.quantity ?? 0;
      const reorderPoint = item.reorderPoint ?? item.reorder_point ?? 0;
      const minStock = item.minStock ?? item.min_stock ?? 0;

      if (stock === 0) {
        outOfStock.push(item);
      } else if (minStock > 0 && stock <= minStock) {
        critical.push(item);
      } else {
        low.push(item);
      }
    });

    return { outOfStock, critical, low };
  }, [lowStockItems]);

  const getStockStatus = (item: InventoryItem) => {
    const stock = item.currentStock ?? item.current_stock ?? item.quantity ?? 0;
    const reorderPoint = item.reorderPoint ?? item.reorder_point ?? 0;
    const minStock = item.minStock ?? item.min_stock ?? 0;

    if (stock === 0) {
      return { label: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    }
    if (minStock > 0 && stock <= minStock) {
      return { label: 'Critical', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    }
    return { label: 'Low Stock', color: 'bg-orange-100 text-orange-800', icon: TrendingDown };
  };

  const calculateReorderQuantity = (item: InventoryItem) => {
    const stock = item.currentStock ?? item.current_stock ?? item.quantity ?? 0;
    const maxStock = item.maxStock ?? item.max_stock ?? item.max_quantity ?? 0;
    const reorderPoint = item.reorderPoint ?? item.reorder_point ?? 0;

    if (maxStock > 0) {
      return Math.max(maxStock - stock, reorderPoint);
    }
    return Math.max(reorderPoint * 2 - stock, reorderPoint);
  };

  const calculateReorderCost = (item: InventoryItem) => {
    const quantity = calculateReorderQuantity(item);
    const costPrice = item.costPrice ?? item.cost_price ?? item.unitPrice ?? item.unit_price ?? 0;
    return quantity * costPrice;
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading alerts...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <div className="p-6 text-center text-red-600">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Failed to load alerts</p>
        </div>
      </Card>
    );
  }

  const totalAlerts = lowStockItems.length;
  const totalOutOfStock = categorizedItems.outOfStock.length;
  const totalCritical = categorizedItems.critical.length;
  const totalLow = categorizedItems.low.length;

  if (totalAlerts === 0) {
    return (
      <Card className={className}>
        <div className="p-6 text-center">
          <Package className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Stock Levels Good</h3>
          <p className="text-sm text-gray-500">No items require immediate attention</p>
        </div>
      </Card>
    );
  }

  const displayItems = [
    ...categorizedItems.outOfStock,
    ...categorizedItems.critical,
    ...categorizedItems.low,
  ].slice(0, maxItems);

  return (
    <Card className={className}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
              <p className="text-sm text-gray-500">
                {totalAlerts} item{totalAlerts !== 1 ? 's' : ''} need attention
              </p>
            </div>
          </div>
          <Badge className={totalOutOfStock > 0 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}>
            {totalOutOfStock > 0 ? `${totalOutOfStock} Out` : `${totalCritical} Critical`}
          </Badge>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{totalOutOfStock}</div>
            <div className="text-xs text-gray-600">Out of Stock</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{totalCritical}</div>
            <div className="text-xs text-gray-600">Critical</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{totalLow}</div>
            <div className="text-xs text-gray-600">Low Stock</div>
          </div>
        </div>

        {/* Alert Items */}
        <div className="space-y-3">
          {displayItems.map((item, index) => {
            const status = getStockStatus(item);
            const stock = item.currentStock ?? item.current_stock ?? item.quantity ?? 0;
            const reorderPoint = item.reorderPoint ?? item.reorder_point ?? 0;
            const reorderQty = calculateReorderQuantity(item);
            const reorderCost = calculateReorderCost(item);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`p-4 rounded-lg border-2 ${
                  stock === 0
                    ? 'bg-red-50 border-red-200'
                    : status.label === 'Critical'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-orange-50 border-orange-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <status.icon className="w-4 h-4 text-red-600" />
                      <h4
                        className="font-semibold text-gray-900 cursor-pointer hover:text-purple-600"
                        onClick={() => onItemClick?.(item)}
                      >
                        {item.name}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                  </div>
                  <Badge className={status.color}>{status.label}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div>
                    <span className="text-gray-600">Current Stock:</span>
                    <span className="font-semibold ml-2">{stock}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Reorder Point:</span>
                    <span className="font-semibold ml-2">{reorderPoint}</span>
                  </div>
                  {reorderQty > 0 && (
                    <>
                      <div>
                        <span className="text-gray-600">Suggested Reorder:</span>
                        <span className="font-semibold ml-2">{reorderQty}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Est. Cost:</span>
                        <span className="font-semibold ml-2">{formatCurrency(reorderCost)}</span>
                      </div>
                    </>
                  )}
                </div>

                {showActions && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onItemClick?.(item)}
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    {onReorder && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onReorder(item)}
                        icon={ShoppingCart}
                        className="flex-1"
                      >
                        Reorder
                      </Button>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {lowStockItems.length > maxItems && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              +{lowStockItems.length - maxItems} more item{lowStockItems.length - maxItems !== 1 ? 's' : ''} with low stock
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LowStockAlerts;

