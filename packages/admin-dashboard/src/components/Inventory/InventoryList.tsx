import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { InventoryItem } from '@/types';
import { mockInventoryItems, mockCategories, mockSuppliers } from '@/mocks/inventory';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { Table, TableHeader, TableBody, TableHeaderCell, TableRow, TableCell } from '../ui/Table';

interface InventoryListProps {
  items?: InventoryItem[];
  onItemClick?: (item: InventoryItem) => void;
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (itemId: string) => void;
  onAdd?: () => void;
  className?: string;
}

const InventoryList: React.FC<InventoryListProps> = ({
  items = mockInventoryItems,
  onItemClick,
  onEdit,
  onDelete,
  onAdd,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [supplierFilter, setSupplierFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...mockCategories.map(cat => ({ value: cat.id, label: cat.name })),
  ];

  const supplierOptions = [
    { value: '', label: 'All Suppliers' },
    ...mockSuppliers.map(supplier => ({ value: supplier.id, label: supplier.name })),
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'in_stock', label: 'In Stock' },
    { value: 'low_stock', label: 'Low Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
  ];

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !categoryFilter || item.categoryId === categoryFilter;
      const matchesSupplier = !supplierFilter || item.supplierId === supplierFilter;
      
      let matchesStatus = true;
      if (statusFilter) {
        if (statusFilter === 'in_stock') {
          matchesStatus = item.currentStock > item.reorderPoint;
        } else if (statusFilter === 'low_stock') {
          matchesStatus = item.currentStock <= item.reorderPoint && item.currentStock > 0;
        } else if (statusFilter === 'out_of_stock') {
          matchesStatus = item.currentStock === 0;
        }
      }

      return matchesSearch && matchesCategory && matchesSupplier && matchesStatus;
    });

    // Sort items
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'sku':
          aValue = a.sku;
          bValue = b.sku;
          break;
        case 'currentStock':
          aValue = a.currentStock;
          bValue = b.currentStock;
          break;
        case 'unitPrice':
          aValue = a.unitPrice;
          bValue = b.unitPrice;
          break;
        case 'category':
          aValue = a.category.name;
          bValue = b.category.name;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [items, searchQuery, categoryFilter, supplierFilter, statusFilter, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredAndSortedItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredAndSortedItems.map(item => item.id)));
    }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Inventory Items</h2>
          <p className="text-sm sm:text-base text-gray-600">Manage your inventory items and stock levels</p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button variant="secondary" size="sm" icon={Download} className="hidden sm:flex">
            Export
          </Button>
          <Button variant="secondary" size="sm" icon={Download} className="sm:hidden p-2" />
          <Button variant="primary" size="sm" icon={Plus} onClick={onAdd} className="flex-1 sm:flex-none">
            <span className="hidden sm:inline">Add Item</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
          
          <Select
            options={categoryOptions}
            value={categoryFilter}
            onChange={setCategoryFilter}
            placeholder="Category"
          />
          
          <Select
            options={supplierOptions}
            value={supplierFilter}
            onChange={setSupplierFilter}
            placeholder="Supplier"
          />
          
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Status"
          />
        </div>
      </Card>

      {/* Results */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>
                  <input
                    type="checkbox"
                    checked={selectedItems.size === filteredAndSortedItems.length && filteredAndSortedItems.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </TableHeaderCell>
                <TableHeaderCell 
                  sortable 
                  sortDirection={getSortIcon('name')}
                  onSort={() => handleSort('name')}
                >
                  Item
                </TableHeaderCell>
                <TableHeaderCell 
                  sortable 
                  sortDirection={getSortIcon('sku')}
                  onSort={() => handleSort('sku')}
                >
                  SKU
                </TableHeaderCell>
                <TableHeaderCell 
                  sortable 
                  sortDirection={getSortIcon('currentStock')}
                  onSort={() => handleSort('currentStock')}
                >
                  Stock
                </TableHeaderCell>
                <TableHeaderCell 
                  sortable 
                  sortDirection={getSortIcon('unitPrice')}
                  onSort={() => handleSort('unitPrice')}
                >
                  Price
                </TableHeaderCell>
                <TableHeaderCell 
                  sortable 
                  sortDirection={getSortIcon('category')}
                  onSort={() => handleSort('category')}
                >
                  Category
                </TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredAndSortedItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className="text-sm text-gray-900">{item.sku}</span>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {item.currentStock} {item.unit}
                    </div>
                    <div className="text-xs text-gray-500">
                      Min: {item.minStock} | Max: {item.maxStock}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(item.unitPrice)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Cost: {formatCurrency(item.costPrice)}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className="bg-gray-100 text-gray-800">
                      {item.category.name}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getStockStatusColor(item)}>
                      {getStockStatusText(item)}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onItemClick?.(item)}
                        className="p-2"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit?.(item)}
                        className="p-2"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete?.(item.id)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-large border border-gray-200 p-4"
        >
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-900">
              {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="secondary" size="sm">
                Export Selected
              </Button>
              <Button variant="secondary" size="sm">
                Update Stock
              </Button>
              <Button variant="danger" size="sm">
                Delete Selected
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedItems(new Set())}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {filteredAndSortedItems.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No items found
          </h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search criteria or add a new item.
          </p>
          <Button variant="primary" icon={Plus} onClick={onAdd}>
            Add First Item
          </Button>
        </Card>
      )}
    </motion.div>
  );
};

export default InventoryList;
