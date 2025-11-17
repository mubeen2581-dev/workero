import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  List, 
  TrendingUp, 
  Building,
  Plus,
  Filter,
  Download,
  BarChart3,
  AlertTriangle,
  ShoppingCart,
  History,
  Truck
} from 'lucide-react';
import { InventoryItem, StockMovement, Supplier } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import InventoryDashboard from '@/components/Inventory/InventoryDashboard';
import InventoryList from '@/components/Inventory/InventoryList';
import StockMovementTracker from '@/components/Inventory/StockMovementTracker';
import SupplierManager from '@/components/Inventory/SupplierManager';
import WarehouseManager from '@/components/Inventory/WarehouseManager';
import WarehouseModal from '@/components/Inventory/WarehouseModal';
import VanStockPage from '@/pages/Inventory/VanStockPage';
import { 
  useInventoryItems, 
  useLowStockAlerts,
  useStockMovements,
  useSuppliers,
  useDeleteInventoryItem,
  useDeleteSupplier,
} from '@/services/inventoryQueries';

type ViewMode = 'dashboard' | 'items' | 'movements' | 'suppliers' | 'warehouses' | 'van';

const InventoryPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any | null>(null);
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [filters, setFilters] = useState<{ search?: string; category?: string; location?: string; low_stock?: boolean }>({});

  // Fetch data from API
  const { data: inventoryItemsRaw = [], isLoading: itemsLoading } = useInventoryItems(filters);
  const { data: lowStockItemsRaw = [] } = useLowStockAlerts();
  const { data: stockMovementsRaw = [], isLoading: movementsLoading } = useStockMovements();
  const { data: suppliersRaw = [], isLoading: suppliersLoading } = useSuppliers();
  
  const deleteItemMutation = useDeleteInventoryItem();
  const deleteSupplierMutation = useDeleteSupplier();

  // Normalize data from API (handle both snake_case and camelCase)
  const inventoryItems = useMemo(() => {
    return inventoryItemsRaw.map((item: any) => ({
      ...item,
      currentStock: item.current_stock ?? item.currentStock ?? item.quantity ?? 0,
      current_stock: item.current_stock ?? item.currentStock ?? item.quantity ?? 0,
      unitPrice: item.unit_price ?? item.unitPrice ?? 0,
      unit_price: item.unit_price ?? item.unitPrice ?? 0,
      costPrice: item.cost_price ?? item.costPrice ?? 0,
      cost_price: item.cost_price ?? item.costPrice ?? 0,
      minQuantity: item.min_quantity ?? item.minQuantity ?? 0,
      min_quantity: item.min_quantity ?? item.minQuantity ?? 0,
      reorderPoint: item.reorder_point ?? item.reorderPoint ?? 0,
      reorder_point: item.reorder_point ?? item.reorderPoint ?? 0,
      lastAuditDate: item.last_audit_date ?? item.lastAuditDate,
      last_audit_date: item.last_audit_date ?? item.lastAuditDate,
      createdAt: item.created_at ?? item.createdAt,
      created_at: item.created_at ?? item.createdAt,
      updatedAt: item.updated_at ?? item.updatedAt,
      updated_at: item.updated_at ?? item.updatedAt,
    }));
  }, [inventoryItemsRaw]);

  const lowStockItems = useMemo(() => {
    return lowStockItemsRaw.map((item: any) => ({
      ...item,
      currentStock: item.current_stock ?? item.currentStock ?? item.quantity ?? 0,
      current_stock: item.current_stock ?? item.currentStock ?? item.quantity ?? 0,
      unitPrice: item.unit_price ?? item.unitPrice ?? 0,
      unit_price: item.unit_price ?? item.unitPrice ?? 0,
    }));
  }, [lowStockItemsRaw]);

  const stockMovements = useMemo(() => {
    return stockMovementsRaw.map((movement: any) => ({
      ...movement,
      itemId: movement.item_id ?? movement.itemId,
      item_id: movement.item_id ?? movement.itemId,
      fromLocation: movement.from_location ?? movement.fromLocation,
      from_location: movement.from_location ?? movement.fromLocation,
      toLocation: movement.to_location ?? movement.toLocation,
      to_location: movement.to_location ?? movement.toLocation,
      performedBy: movement.performed_by ?? movement.performer?.id ?? movement.performedBy,
      performed_by: movement.performed_by ?? movement.performer?.id ?? movement.performedBy,
      performedAt: movement.performed_at ?? movement.performedAt,
      performed_at: movement.performed_at ?? movement.performedAt,
      createdAt: movement.created_at ?? movement.createdAt,
      created_at: movement.created_at ?? movement.createdAt,
    }));
  }, [stockMovementsRaw]);

  const suppliers = useMemo(() => {
    return suppliersRaw.map((supplier: any) => ({
      ...supplier,
      contactPerson: supplier.contact_person ?? supplier.contactPerson,
      contact_person: supplier.contact_person ?? supplier.contactPerson,
      isActive: supplier.is_active ?? supplier.isActive ?? true,
      is_active: supplier.is_active ?? supplier.isActive ?? true,
      createdAt: supplier.created_at ?? supplier.createdAt,
      created_at: supplier.created_at ?? supplier.createdAt,
      updatedAt: supplier.updated_at ?? supplier.updatedAt,
      updated_at: supplier.updated_at ?? supplier.updatedAt,
    }));
  }, [suppliersRaw]);

  // Calculate stats from real data
  const stats = useMemo(() => {
    const totalItems = inventoryItems.length;
    const lowStockItemsCount = lowStockItems.length;
    const outOfStockItems = inventoryItems.filter(item => {
      const stock = item.current_stock ?? item.currentStock ?? 0;
      return stock === 0;
    }).length;
    const totalValue = inventoryItems.reduce((sum, item) => {
      const stock = item.current_stock ?? item.currentStock ?? 0;
      const price = item.unit_price ?? item.unitPrice ?? 0;
      return sum + (stock * price);
    }, 0);

    return {
      totalItems,
      lowStockItems: lowStockItemsCount,
      outOfStockItems,
      totalValue,
    };
  }, [inventoryItems, lowStockItems]);

  const handleItemClick = (item: InventoryItem) => {
    setSelectedItem(item);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    // TODO: Open edit modal
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItemMutation.mutate(itemId);
    }
  };

  const handleAddItem = () => {
    // TODO: Open add item modal
  };

  const handleMovementClick = (movement: StockMovement) => {
    setSelectedMovement(movement);
  };

  const handleEditMovement = (movement: StockMovement) => {
    // TODO: Implement edit movement
  };

  const handleAddMovement = (movement: Omit<StockMovement, 'id' | 'createdAt'>) => {
    // TODO: Implement add movement
  };

  const handleSupplierClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    // TODO: Open edit modal
  };

  const handleDeleteSupplier = (supplierId: string) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      deleteSupplierMutation.mutate(supplierId);
    }
  };

  const handleAddSupplier = () => {
    // TODO: Open add supplier modal
  };

  const handleWarehouseClick = (warehouse: any) => {
    setSelectedWarehouse(warehouse);
    // TODO: Open warehouse detail view
  };

  const handleEditWarehouse = (warehouse: any) => {
    setSelectedWarehouse(warehouse);
    setShowWarehouseModal(true);
  };

  const handleDeleteWarehouse = (warehouseId: string) => {
    // Handled by WarehouseManager component
  };

  const handleAddWarehouse = () => {
    setSelectedWarehouse(null);
    setShowWarehouseModal(true);
  };

  const handleWarehouseSuccess = () => {
    setSelectedWarehouse(null);
    setShowWarehouseModal(false);
  };

  const viewOptions = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'items', label: 'Items', icon: Package },
    { id: 'movements', label: 'Movements', icon: History },
    { id: 'warehouses', label: 'Warehouses', icon: Building },
    { id: 'van', label: 'Van Stock', icon: Truck },
    { id: 'suppliers', label: 'Suppliers', icon: Building },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Inventory Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Track stock levels, manage suppliers, and automate reordering
            </p>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button variant="secondary" size="sm" icon={Download} className="hidden sm:flex">
              Export
            </Button>
            <Button variant="secondary" size="sm" icon={Download} className="sm:hidden p-2">
              <span className="sr-only">Export</span>
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              icon={Plus} 
              className="flex-1 sm:flex-none"
              onClick={handleAddItem}
            >
              <span className="hidden sm:inline">Add Item</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
      >
        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalItems}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-xl" style={{ backgroundColor: '#F3F0FF' }}>
              <Package className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#8552C5' }} />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-lg sm:text-2xl font-bold text-yellow-600">{stats.lowStockItems}</p>
            </div>
            <div className="p-2 sm:p-3 bg-yellow-100 rounded-xl">
              <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-lg sm:text-2xl font-bold text-red-600">{stats.outOfStockItems}</p>
            </div>
            <div className="p-2 sm:p-3 bg-red-100 rounded-xl">
              <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">
                £{stats.totalValue.toLocaleString()}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
              <ShoppingCart className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* View Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-0">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {viewOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setViewMode(option.id as ViewMode)}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  viewMode === option.id
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={viewMode === option.id ? { backgroundColor: '#F3F0FF' } : {}}
              >
                <option.icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{option.label}</span>
                <span className="sm:hidden">{option.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {viewMode === 'dashboard' && (
          <InventoryDashboard
            items={inventoryItems}
            movements={stockMovements}
            onItemClick={handleItemClick}
            onAddItem={handleAddItem}
          />
        )}

        {viewMode === 'items' && (
          <InventoryList
            items={inventoryItems}
            onItemClick={handleItemClick}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            onAdd={handleAddItem}
          />
        )}

        {viewMode === 'movements' && (
          <StockMovementTracker
            movements={stockMovements}
            items={inventoryItems}
            onAddMovement={handleAddMovement}
            onEditMovement={handleEditMovement}
          />
        )}

        {viewMode === 'warehouses' && (
          <WarehouseManager
            onWarehouseClick={handleWarehouseClick}
            onEditWarehouse={handleEditWarehouse}
            onDeleteWarehouse={handleDeleteWarehouse}
            onAddWarehouse={handleAddWarehouse}
          />
        )}

        {viewMode === 'suppliers' && (
          <SupplierManager
            suppliers={suppliers}
            onSupplierClick={handleSupplierClick}
            onEditSupplier={handleEditSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            onAddSupplier={handleAddSupplier}
          />
        )}

        {viewMode === 'van' && <VanStockPage />}
      </motion.div>

      {/* Warehouse Modal */}
      <WarehouseModal
        isOpen={showWarehouseModal}
        onClose={() => {
          setShowWarehouseModal(false);
          setSelectedWarehouse(null);
        }}
        warehouse={selectedWarehouse}
        onSuccess={handleWarehouseSuccess}
      />
    </div>
  );
};

export default InventoryPage;
