import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Warehouse as WarehouseIcon, 
  Phone, 
  Mail, 
  MapPin,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Package,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Warehouse } from '@/types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import { Table, TableHeader, TableBody, TableHeaderCell, TableRow, TableCell } from '../ui/Table';
import { useWarehouses, useDeleteWarehouse } from '@/services/inventoryQueries';

interface WarehouseManagerProps {
  warehouses?: Warehouse[];
  onWarehouseClick?: (warehouse: Warehouse) => void;
  onEditWarehouse?: (warehouse: Warehouse) => void;
  onDeleteWarehouse?: (warehouseId: string) => void;
  onAddWarehouse?: () => void;
  className?: string;
}

const WarehouseManager: React.FC<WarehouseManagerProps> = ({
  warehouses: warehousesProp,
  onWarehouseClick,
  onEditWarehouse,
  onDeleteWarehouse,
  onAddWarehouse,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Fetch warehouses from API if not provided
  const { data: warehousesData = [] } = useWarehouses();
  const warehouses = warehousesProp || warehousesData;
  const deleteWarehouseMutation = useDeleteWarehouse();

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  // Normalize warehouses data
  const normalizedWarehouses = useMemo(() => {
    return warehouses.map((w: any) => ({
      ...w,
      isActive: w.is_active ?? w.isActive ?? true,
      is_active: w.is_active ?? w.isActive ?? true,
      contactPerson: w.contact_person ?? w.contactPerson,
      contact_person: w.contact_person ?? w.contactPerson,
      zipCode: w.zip_code ?? w.zipCode,
      zip_code: w.zip_code ?? w.zipCode,
    }));
  }, [warehouses]);

  // Filter warehouses
  const filteredWarehouses = useMemo(() => {
    return normalizedWarehouses.filter((warehouse: any) => {
      const matchesSearch = warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           warehouse.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (warehouse.city && warehouse.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           (warehouse.contactPerson && warehouse.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = !statusFilter || 
        (statusFilter === 'active' && warehouse.isActive) ||
        (statusFilter === 'inactive' && !warehouse.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [normalizedWarehouses, searchQuery, statusFilter]);

  const handleDelete = (warehouseId: string) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      if (onDeleteWarehouse) {
        onDeleteWarehouse(warehouseId);
      } else {
        deleteWarehouseMutation.mutate(warehouseId);
      }
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Warehouses</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage warehouse locations and their inventory
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={onAddWarehouse}>
          <span className="hidden sm:inline">Add Warehouse</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              placeholder="Search warehouses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Warehouses Table */}
      {filteredWarehouses.length === 0 ? (
        <Card className="p-12 text-center">
          <WarehouseIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No warehouses found</h3>
          <p className="text-sm text-gray-600 mb-4">
            {searchQuery || statusFilter 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first warehouse'}
          </p>
          {!searchQuery && !statusFilter && (
            <Button variant="primary" size="sm" icon={Plus} onClick={onAddWarehouse}>
              Add Warehouse
            </Button>
          )}
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Code</TableHeaderCell>
                  <TableHeaderCell>Location</TableHeaderCell>
                  <TableHeaderCell>Contact</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWarehouses.map((warehouse: any) => (
                  <TableRow key={warehouse.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <WarehouseIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{warehouse.name}</p>
                          {warehouse.notes && (
                            <p className="text-xs text-gray-500 line-clamp-1">{warehouse.notes}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-gray-100 text-gray-800">
                        {warehouse.code}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {warehouse.city && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>
                              {[warehouse.city, warehouse.state, warehouse.zipCode]
                                .filter(Boolean)
                                .join(', ')}
                            </span>
                          </div>
                        )}
                        {warehouse.address && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {warehouse.address}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {warehouse.contactPerson && (
                          <p className="font-medium">{warehouse.contactPerson}</p>
                        )}
                        {warehouse.phone && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                            <Phone className="w-3 h-3" />
                            <span>{warehouse.phone}</span>
                          </div>
                        )}
                        {warehouse.email && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{warehouse.email}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(warehouse.isActive)}>
                        {warehouse.isActive ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          icon={Eye}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onWarehouseClick?.(warehouse);
                          }}
                          className="p-2"
                        >
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          icon={Edit}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEditWarehouse?.(warehouse);
                          }}
                          className="p-2"
                        >
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          icon={Trash2}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(warehouse.id);
                          }}
                          className="p-2 text-red-600 hover:text-red-700"
                        >
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default WarehouseManager;

