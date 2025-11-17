import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '@/config/api';
import { InventoryItem, StockMovement, Supplier, Warehouse, VanStock, JobMaterial } from '@/types';

// Create axios instance with auth interceptor
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const inventoryClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
inventoryClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401
inventoryClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== Inventory Items ====================

export interface InventoryFilters {
  search?: string;
  category?: string;
  location?: string;
  low_stock?: boolean;
  warehouse_id?: string;
  sort_field?: string;
  sort_direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface CreateInventoryItemRequest {
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  category: string;
  quantity?: number;
  current_stock?: number;
  min_quantity?: number;
  min_stock?: number;
  max_quantity?: number;
  max_stock?: number;
  unit_price?: number;
  cost_price?: number;
  reorder_point?: number;
  location?: string;
  warehouse_id?: string;
}

export interface UpdateInventoryItemRequest {
  name?: string;
  description?: string;
  sku?: string;
  barcode?: string;
  category?: string;
  quantity?: number;
  current_stock?: number;
  min_quantity?: number;
  min_stock?: number;
  max_quantity?: number;
  max_stock?: number;
  unit_price?: number;
  cost_price?: number;
  reorder_point?: number;
  location?: string;
  warehouse_id?: string;
}

export interface AdjustStockRequest {
  quantity: number;
  reason: string;
  notes?: string;
}

// ==================== Warehouses ====================

export interface CreateWarehouseRequest {
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  is_active?: boolean;
  notes?: string;
}

export interface UpdateWarehouseRequest {
  name?: string;
  code?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  is_active?: boolean;
  notes?: string;
}

// ==================== Van Stock ====================

export interface AssignVanStockRequest {
  item_id: string;
  technician_id: string;
  quantity: number;
  from_location: string;
  notes?: string;
}

export interface ReturnVanStockRequest {
  quantity?: number;
  notes?: string;
}

// ==================== Stock Transfer ====================

export interface StockTransferRequest {
  item_id: string;
  quantity: number;
  from_location: string;
  to_location: string;
  from_type: 'warehouse' | 'van';
  to_type: 'warehouse' | 'van';
  notes?: string;
}

// ==================== Job Materials ====================

export interface IssueToJobRequest {
  job_id: string;
  item_id: string;
  quantity: number;
  source_type: 'warehouse' | 'van';
  source_id: string;
  notes?: string;
}

export interface ReturnFromJobRequest {
  quantity: number;
  status: 'returned' | 'wasted';
  return_to_id?: string;
  return_to_type?: 'warehouse' | 'van';
  notes?: string;
}

// ==================== Suppliers ====================

export interface CreateSupplierRequest {
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  website?: string;
  notes?: string;
  is_active?: boolean;
}

export interface UpdateSupplierRequest {
  name?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  website?: string;
  notes?: string;
  is_active?: boolean;
}

// ==================== Inventory Service ====================

export const InventoryService = {
  // ========== Inventory Items ==========
  
  /**
   * Get all inventory items with optional filters
   */
  async getItems(filters?: InventoryFilters): Promise<{ data: InventoryItem[]; pagination?: any }> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.low_stock) params.append('low_stock', 'true');
    if (filters?.warehouse_id) params.append('warehouse_id', filters.warehouse_id);
    if (filters?.sort_field) params.append('sort_field', filters.sort_field);
    if (filters?.sort_direction) params.append('sort_direction', filters.sort_direction);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());

    const response = await inventoryClient.get('/inventory/items', { params });
    return response.data;
  },

  /**
   * Get a single inventory item by ID
   */
  async getItem(id: string): Promise<{ data: InventoryItem }> {
    const response = await inventoryClient.get(`/inventory/items/${id}`);
    return response.data;
  },

  /**
   * Create a new inventory item
   */
  async createItem(data: CreateInventoryItemRequest): Promise<{ data: InventoryItem }> {
    const response = await inventoryClient.post('/inventory/items', data);
    return response.data;
  },

  /**
   * Update an inventory item
   */
  async updateItem(id: string, data: UpdateInventoryItemRequest): Promise<{ data: InventoryItem }> {
    const response = await inventoryClient.put(`/inventory/items/${id}`, data);
    return response.data;
  },

  /**
   * Delete an inventory item
   */
  async deleteItem(id: string): Promise<void> {
    await inventoryClient.delete(`/inventory/items/${id}`);
  },

  /**
   * Adjust stock quantity
   */
  async adjustStock(id: string, data: AdjustStockRequest): Promise<{ data: InventoryItem }> {
    const response = await inventoryClient.post(`/inventory/items/${id}/adjust`, data);
    return response.data;
  },

  /**
   * Get stock movements
   */
  async getMovements(filters?: { item_id?: string; type?: string; date_from?: string; date_to?: string }): Promise<{ data: StockMovement[] }> {
    const params = new URLSearchParams();
    if (filters?.item_id) params.append('item_id', filters.item_id);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.date_from) params.append('date_from', filters.date_from);
    if (filters?.date_to) params.append('date_to', filters.date_to);

    const response = await inventoryClient.get('/inventory/movements', { params });
    return response.data;
  },

  /**
   * Get stock by location
   */
  async getStockByLocation(location?: string): Promise<{ data: InventoryItem[] }> {
    const params = new URLSearchParams();
    if (location) params.append('location', location);

    const response = await inventoryClient.get('/inventory/stock', { params });
    return response.data;
  },

  /**
   * Get low stock alerts
   */
  async getLowStockAlerts(): Promise<{ data: InventoryItem[] }> {
    const response = await inventoryClient.get('/inventory/alerts/low-stock');
    return response.data;
  },

  /**
   * Get stock transfers
   */
  async getTransfers(): Promise<{ data: StockMovement[] }> {
    const response = await inventoryClient.get('/inventory/transfers');
    return response.data;
  },

  /**
   * Transfer stock
   */
  async transferStock(data: StockTransferRequest): Promise<{ data: StockMovement }> {
    const response = await inventoryClient.post('/inventory/transfer', data);
    return response.data;
  },

  /**
   * Issue stock to job
   */
  async issueToJob(data: IssueToJobRequest): Promise<{ data: JobMaterial }> {
    const response = await inventoryClient.post('/inventory/issue-to-job', data);
    return response.data;
  },

  /**
   * Return stock from job
   */
  async returnFromJob(jobMaterialId: string, data: ReturnFromJobRequest): Promise<{ data: JobMaterial }> {
    const response = await inventoryClient.post(`/inventory/return-from-job/${jobMaterialId}`, data);
    return response.data;
  },

  /**
   * Get job materials
   */
  async getJobMaterials(jobId: string): Promise<{ data: JobMaterial[] }> {
    const response = await inventoryClient.get(`/inventory/job/${jobId}/materials`);
    return response.data;
  },

  // ========== Warehouses ==========

  /**
   * Get all warehouses
   */
  async getWarehouses(filters?: { search?: string; is_active?: boolean }): Promise<{ data: Warehouse[]; pagination?: any }> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());

    const response = await inventoryClient.get('/warehouses', { params });
    return response.data;
  },

  /**
   * Get a single warehouse by ID
   */
  async getWarehouse(id: string): Promise<{ data: Warehouse }> {
    const response = await inventoryClient.get(`/warehouses/${id}`);
    return response.data;
  },

  /**
   * Create a new warehouse
   */
  async createWarehouse(data: CreateWarehouseRequest): Promise<{ data: Warehouse }> {
    const response = await inventoryClient.post('/warehouses', data);
    return response.data;
  },

  /**
   * Update a warehouse
   */
  async updateWarehouse(id: string, data: UpdateWarehouseRequest): Promise<{ data: Warehouse }> {
    const response = await inventoryClient.put(`/warehouses/${id}`, data);
    return response.data;
  },

  /**
   * Delete a warehouse
   */
  async deleteWarehouse(id: string): Promise<void> {
    await inventoryClient.delete(`/warehouses/${id}`);
  },

  /**
   * Get warehouse stock
   */
  async getWarehouseStock(warehouseId: string): Promise<{ data: InventoryItem[] }> {
    const response = await inventoryClient.get(`/warehouses/${warehouseId}/stock`);
    return response.data;
  },

  // ========== Van Stock ==========

  /**
   * Get all van stock
   */
  async getVanStock(filters?: { technician_id?: string; item_id?: string }): Promise<{ data: VanStock[]; pagination?: any }> {
    const params = new URLSearchParams();
    if (filters?.technician_id) params.append('technician_id', filters.technician_id);
    if (filters?.item_id) params.append('item_id', filters.item_id);

    const response = await inventoryClient.get('/van-stock', { params });
    return response.data;
  },

  /**
   * Get van stock by technician
   */
  async getVanStockByTechnician(technicianId: string): Promise<{ data: VanStock[] }> {
    const response = await inventoryClient.get(`/van-stock/technician/${technicianId}`);
    return response.data;
  },

  /**
   * Assign stock to van
   */
  async assignVanStock(data: AssignVanStockRequest): Promise<{ data: VanStock }> {
    const response = await inventoryClient.post('/van-stock/assign', data);
    return response.data;
  },

  /**
   * Return stock from van
   */
  async returnVanStock(id: string, data: ReturnVanStockRequest): Promise<{ data: VanStock }> {
    const response = await inventoryClient.post(`/van-stock/${id}/return`, data);
    return response.data;
  },

  // ========== Suppliers ==========

  /**
   * Get all suppliers
   */
  async getSuppliers(): Promise<{ data: Supplier[] }> {
    const response = await inventoryClient.get('/suppliers');
    return response.data;
  },

  /**
   * Get a single supplier by ID
   */
  async getSupplier(id: string): Promise<{ data: Supplier }> {
    const response = await inventoryClient.get(`/suppliers/${id}`);
    return response.data;
  },

  /**
   * Create a new supplier
   */
  async createSupplier(data: CreateSupplierRequest): Promise<{ data: Supplier }> {
    const response = await inventoryClient.post('/suppliers', data);
    return response.data;
  },

  /**
   * Update a supplier
   */
  async updateSupplier(id: string, data: UpdateSupplierRequest): Promise<{ data: Supplier }> {
    const response = await inventoryClient.put(`/suppliers/${id}`, data);
    return response.data;
  },

  /**
   * Delete a supplier
   */
  async deleteSupplier(id: string): Promise<void> {
    await inventoryClient.delete(`/suppliers/${id}`);
  },
};
