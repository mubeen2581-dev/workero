import React, { useState } from 'react';
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
import { mockInventoryItems, mockStockMovements, mockSuppliers, getInventoryStats } from '@/mocks/inventory';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import InventoryDashboard from '@/components/Inventory/InventoryDashboard';
import InventoryList from '@/components/Inventory/InventoryList';
import StockMovementTracker from '@/components/Inventory/StockMovementTracker';
import SupplierManager from '@/components/Inventory/SupplierManager';
import VanStockPage from '@/pages/Inventory/VanStockPage';

type ViewMode = 'dashboard' | 'items' | 'movements' | 'suppliers' | 'van';

const InventoryPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const stats = getInventoryStats();

  const handleItemClick = (item: InventoryItem) => {
    setSelectedItem(item);
    console.log('Item clicked:', item);
  };

  const handleEditItem = (item: InventoryItem) => {
    console.log('Edit item:', item);
  };

  const handleDeleteItem = (itemId: string) => {
    console.log('Delete item:', itemId);
  };

  const handleAddItem = () => {
    console.log('Add new item');
  };

  const handleMovementClick = (movement: StockMovement) => {
    setSelectedMovement(movement);
    console.log('Movement clicked:', movement);
  };

  const handleEditMovement = (movement: StockMovement) => {
    console.log('Edit movement:', movement);
  };

  const handleAddMovement = (movement: Omit<StockMovement, 'id' | 'createdAt'>) => {
    console.log('Add movement:', movement);
  };

  const handleSupplierClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    console.log('Supplier clicked:', supplier);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    console.log('Edit supplier:', supplier);
  };

  const handleDeleteSupplier = (supplierId: string) => {
    console.log('Delete supplier:', supplierId);
  };

  const handleAddSupplier = () => {
    console.log('Add new supplier');
  };

  const viewOptions = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'items', label: 'Items', icon: Package },
    { id: 'movements', label: 'Movements', icon: History },
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
            <Button variant="primary" size="sm" icon={Plus} className="flex-1 sm:flex-none">
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
            items={mockInventoryItems}
            movements={mockStockMovements}
            onItemClick={handleItemClick}
            onAddItem={handleAddItem}
          />
        )}

        {viewMode === 'items' && (
          <InventoryList
            items={mockInventoryItems}
            onItemClick={handleItemClick}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            onAdd={handleAddItem}
          />
        )}

        {viewMode === 'movements' && (
          <StockMovementTracker
            movements={mockStockMovements}
            items={mockInventoryItems}
            onAddMovement={handleAddMovement}
            onEditMovement={handleEditMovement}
          />
        )}

        {viewMode === 'suppliers' && (
          <SupplierManager
            suppliers={mockSuppliers}
            onSupplierClick={handleSupplierClick}
            onEditSupplier={handleEditSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            onAddSupplier={handleAddSupplier}
          />
        )}

        {viewMode === 'van' && <VanStockPage />}
      </motion.div>
    </div>
  );
};

export default InventoryPage;
