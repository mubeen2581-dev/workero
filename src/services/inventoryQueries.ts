import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import {
  InventoryService,
  InventoryFilters,
  CreateInventoryItemRequest,
  UpdateInventoryItemRequest,
  AdjustStockRequest,
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
  AssignVanStockRequest,
  ReturnVanStockRequest,
  StockTransferRequest,
  IssueToJobRequest,
  ReturnFromJobRequest,
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from '@/services/inventory';
import { toast } from 'react-toastify';

// ==================== Inventory Items ====================

/**
 * Get all inventory items with optional filters
 */
export function useInventoryItems(filters?: InventoryFilters) {
  return useQuery({
    queryKey: queryKeys.inventory.itemsList(filters),
    queryFn: async () => {
      const response = await InventoryService.getItems(filters);
      return response.data || [];
    },
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Get a single inventory item by ID
 */
export function useInventoryItem(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.inventory.item(id!),
    queryFn: async () => {
      if (!id) return null;
      const response = await InventoryService.getItem(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 30000,
  });
}

/**
 * Create inventory item mutation
 */
export function useCreateInventoryItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateInventoryItemRequest) => InventoryService.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.items() });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.lowStock() });
      toast.success('Inventory item created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create inventory item');
    },
  });
}

/**
 * Update inventory item mutation
 */
export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryItemRequest }) =>
      InventoryService.updateItem(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.items() });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.item(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.lowStock() });
      toast.success('Inventory item updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update inventory item');
    },
  });
}

/**
 * Delete inventory item mutation
 */
export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => InventoryService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.items() });
      toast.success('Inventory item deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete inventory item');
    },
  });
}

/**
 * Adjust stock mutation
 */
export function useAdjustStock() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdjustStockRequest }) =>
      InventoryService.adjustStock(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.items() });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.item(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.movements() });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.lowStock() });
      toast.success('Stock adjusted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to adjust stock');
    },
  });
}

/**
 * Get stock movements
 */
export function useStockMovements(filters?: { item_id?: string; type?: string; date_from?: string; date_to?: string }) {
  return useQuery({
    queryKey: queryKeys.inventory.movements(filters),
    queryFn: async () => {
      const response = await InventoryService.getMovements(filters);
      return response.data || [];
    },
    staleTime: 30000,
  });
}

/**
 * Get stock by location
 */
export function useStockByLocation(location?: string) {
  return useQuery({
    queryKey: queryKeys.inventory.stock(location),
    queryFn: async () => {
      const response = await InventoryService.getStockByLocation(location);
      return response.data || [];
    },
    staleTime: 30000,
  });
}

/**
 * Get low stock alerts
 */
export function useLowStockAlerts() {
  return useQuery({
    queryKey: queryKeys.inventory.lowStock(),
    queryFn: async () => {
      const response = await InventoryService.getLowStockAlerts();
      return response.data || [];
    },
    staleTime: 30000,
  });
}

/**
 * Get stock transfers
 */
export function useStockTransfers() {
  return useQuery({
    queryKey: queryKeys.inventory.transfers(),
    queryFn: async () => {
      const response = await InventoryService.getTransfers();
      return response.data || [];
    },
    staleTime: 30000,
  });
}

/**
 * Transfer stock mutation
 */
export function useTransferStock() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: StockTransferRequest) => InventoryService.transferStock(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.items() });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.transfers() });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.movements() });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.vanStock() });
      toast.success('Stock transferred successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to transfer stock');
    },
  });
}

// ==================== Warehouses ====================

/**
 * Get all warehouses
 */
export function useWarehouses(filters?: { search?: string; is_active?: boolean }) {
  return useQuery({
    queryKey: [...queryKeys.inventory.warehouses(), filters],
    queryFn: async () => {
      const response = await InventoryService.getWarehouses(filters);
      return response.data || [];
    },
    staleTime: 30000,
  });
}

/**
 * Get a single warehouse by ID
 */
export function useWarehouse(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.inventory.warehouse(id!),
    queryFn: async () => {
      if (!id) return null;
      const response = await InventoryService.getWarehouse(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 30000,
  });
}

/**
 * Create warehouse mutation
 */
export function useCreateWarehouse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateWarehouseRequest) => InventoryService.createWarehouse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.warehouses() });
      toast.success('Warehouse created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create warehouse');
    },
  });
}

/**
 * Update warehouse mutation
 */
export function useUpdateWarehouse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWarehouseRequest }) =>
      InventoryService.updateWarehouse(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.warehouses() });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.warehouse(variables.id) });
      toast.success('Warehouse updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update warehouse');
    },
  });
}

/**
 * Delete warehouse mutation
 */
export function useDeleteWarehouse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => InventoryService.deleteWarehouse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.warehouses() });
      toast.success('Warehouse deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete warehouse');
    },
  });
}

/**
 * Get warehouse stock
 */
export function useWarehouseStock(warehouseId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.inventory.warehouseStock(warehouseId!),
    queryFn: async () => {
      if (!warehouseId) return [];
      const response = await InventoryService.getWarehouseStock(warehouseId);
      return response.data || [];
    },
    enabled: !!warehouseId,
    staleTime: 30000,
  });
}

// ==================== Van Stock ====================

/**
 * Get all van stock
 */
export function useVanStock(filters?: { technician_id?: string; item_id?: string }) {
  return useQuery({
    queryKey: [...queryKeys.inventory.vanStock(), filters],
    queryFn: async () => {
      const response = await InventoryService.getVanStock(filters);
      return response.data || [];
    },
    staleTime: 30000,
  });
}

/**
 * Get van stock by technician
 */
export function useVanStockByTechnician(technicianId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.inventory.vanStockByTechnician(technicianId!),
    queryFn: async () => {
      if (!technicianId) return [];
      const response = await InventoryService.getVanStockByTechnician(technicianId);
      return response.data || [];
    },
    enabled: !!technicianId,
    staleTime: 30000,
  });
}

/**
 * Assign stock to van mutation
 */
export function useAssignVanStock() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AssignVanStockRequest) => InventoryService.assignVanStock(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.vanStock() });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.vanStockByTechnician(variables.technician_id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.items() });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.movements() });
      toast.success('Stock assigned to van successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to assign stock to van');
    },
  });
}

/**
 * Return stock from van mutation
 */
export function useReturnVanStock() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReturnVanStockRequest }) =>
      InventoryService.returnVanStock(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.vanStock() });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.items() });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.movements() });
      toast.success('Stock returned from van successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to return stock from van');
    },
  });
}

// ==================== Job Materials ====================

/**
 * Issue stock to job mutation
 */
export function useIssueToJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: IssueToJobRequest) => InventoryService.issueToJob(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.items() });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.jobMaterials(variables.job_id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.movements() });
      toast.success('Stock issued to job successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to issue stock to job');
    },
  });
}

/**
 * Return stock from job mutation
 */
export function useReturnFromJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ jobMaterialId, data }: { jobMaterialId: string; data: ReturnFromJobRequest }) =>
      InventoryService.returnFromJob(jobMaterialId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.items() });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.jobMaterials() });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.movements() });
      toast.success('Stock returned from job successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to return stock from job');
    },
  });
}

/**
 * Get job materials
 */
export function useJobMaterials(jobId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.inventory.jobMaterials(jobId!),
    queryFn: async () => {
      if (!jobId) return [];
      const response = await InventoryService.getJobMaterials(jobId);
      return response.data || [];
    },
    enabled: !!jobId,
    staleTime: 30000,
  });
}

// ==================== Suppliers ====================

/**
 * Get all suppliers
 */
export function useSuppliers() {
  return useQuery({
    queryKey: queryKeys.inventory.suppliers(),
    queryFn: async () => {
      const response = await InventoryService.getSuppliers();
      return response.data || [];
    },
    staleTime: 30000,
  });
}

/**
 * Get a single supplier by ID
 */
export function useSupplier(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.inventory.supplier(id!),
    queryFn: async () => {
      if (!id) return null;
      const response = await InventoryService.getSupplier(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 30000,
  });
}

/**
 * Create supplier mutation
 */
export function useCreateSupplier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateSupplierRequest) => InventoryService.createSupplier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.suppliers() });
      toast.success('Supplier created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create supplier');
    },
  });
}

/**
 * Update supplier mutation
 */
export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSupplierRequest }) =>
      InventoryService.updateSupplier(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.suppliers() });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.supplier(variables.id) });
      toast.success('Supplier updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update supplier');
    },
  });
}

/**
 * Delete supplier mutation
 */
export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => InventoryService.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.suppliers() });
      toast.success('Supplier deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete supplier');
    },
  });
}

// ==================== Legacy/Backward Compatibility ====================

/**
 * @deprecated Use useVanStockByTechnician instead
 */
export function useDriverStock(technicianId: string) {
  return useVanStockByTechnician(technicianId);
}

/**
 * @deprecated Use useStockMovements instead
 */
export function useAudit() {
  return useStockMovements();
}

/**
 * @deprecated Use useAssignVanStock instead
 */
export function useIssueMutation(technicianId: string) {
  const assignMutation = useAssignVanStock();
  
  return {
    ...assignMutation,
    mutate: (variables: { itemId: string; quantity: number }) => {
      assignMutation.mutate({
        item_id: variables.itemId,
        technician_id: technicianId,
        quantity: variables.quantity,
        from_location: 'warehouse',
      });
    },
  };
}

/**
 * @deprecated Use useReturnVanStock instead
 */
export function useReturnMutation(technicianId: string) {
  const returnMutation = useReturnVanStock();
  
  return {
    ...returnMutation,
    mutate: (variables: { itemId: string; quantity: number; vanStockId: string }) => {
      returnMutation.mutate({
        id: variables.vanStockId,
        data: {
          quantity: variables.quantity,
        },
      });
    },
  };
}

/**
 * @deprecated Use useTransferStock instead
 */
export function useTransferMutation() {
  return useTransferStock();
}
