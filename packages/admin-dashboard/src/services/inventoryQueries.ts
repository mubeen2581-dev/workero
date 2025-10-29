import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { InventoryService } from '@/services/inventory';
import { mockDriverStock, mockStockAudit, mockStockTransfers } from '@/mocks/inventory';

export function useDriverStock(technicianId: string) {
  return useQuery({
    queryKey: queryKeys.inventory.driverStock(technicianId),
    queryFn: async () => mockDriverStock[technicianId] || [],
  });
}

export function useTransfers() {
  return useQuery({
    queryKey: queryKeys.inventory.transfers,
    queryFn: async () => mockStockTransfers.slice().reverse(),
  });
}

export function useAudit() {
  return useQuery({
    queryKey: queryKeys.inventory.audit,
    queryFn: async () => mockStockAudit.slice().reverse(),
  });
}

export function useIssueMutation(technicianId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      InventoryService.issueToDriver(technicianId, itemId, quantity),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.inventory.driverStock(technicianId) }),
        qc.invalidateQueries({ queryKey: queryKeys.inventory.audit }),
        qc.invalidateQueries({ queryKey: queryKeys.inventory.transfers }),
      ]);
    },
  });
}

export function useReturnMutation(technicianId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      InventoryService.returnFromDriver(technicianId, itemId, quantity),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.inventory.driverStock(technicianId) }),
        qc.invalidateQueries({ queryKey: queryKeys.inventory.audit }),
        qc.invalidateQueries({ queryKey: queryKeys.inventory.transfers }),
      ]);
    },
  });
}

export function useTransferMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ fromTech, toTech, itemId, quantity }: { fromTech: string; toTech: string; itemId: string; quantity: number }) =>
      InventoryService.transferBetweenDrivers(fromTech, toTech, itemId, quantity),
    onSuccess: async (_, variables) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.inventory.driverStock(variables.fromTech) }),
        qc.invalidateQueries({ queryKey: queryKeys.inventory.driverStock(variables.toTech) }),
        qc.invalidateQueries({ queryKey: queryKeys.inventory.audit }),
        qc.invalidateQueries({ queryKey: queryKeys.inventory.transfers }),
      ]);
    },
  });
}


