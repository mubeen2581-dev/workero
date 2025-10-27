import { InventoryItem } from '@/types';
import {
  mockInventoryItems,
  mockDriverStock,
  mockStockTransfers,
  mockStockAudit,
} from '@/mocks/inventory';

export const InventoryService = {
  async findItemByCode(code: string): Promise<InventoryItem | undefined> {
    return (
      mockInventoryItems.find((i) => i.barcode === code || i.sku.toLowerCase() === code.toLowerCase())
    );
  },

  async issueToDriver(technicianId: string, itemId: string, quantity: number) {
    const item = mockInventoryItems.find((i) => i.id === itemId);
    if (!item) throw new Error('Item not found');
    const row = mockDriverStock[technicianId] || (mockDriverStock[technicianId] = []);
    const existing = row.find((r) => r.itemId === itemId);
    if (existing) existing.quantity += quantity; else row.push({ itemId, item, quantity });
    mockStockAudit.push({ id: 'audit-' + (mockStockAudit.length + 1), technicianId, itemId, item, delta: quantity, reason: 'issue', createdAt: new Date().toISOString() });
    mockStockTransfers.push({ id: 'transfer-' + (mockStockTransfers.length + 1), from: 'warehouse', to: technicianId, itemId, item, quantity, createdAt: new Date().toISOString() });
    return true;
  },

  async returnFromDriver(technicianId: string, itemId: string, quantity: number) {
    const item = mockInventoryItems.find((i) => i.id === itemId);
    if (!item) throw new Error('Item not found');
    const row = mockDriverStock[technicianId];
    if (!row) return true;
    const existing = row.find((r) => r.itemId === itemId);
    if (existing) existing.quantity = Math.max(0, existing.quantity - quantity);
    mockStockAudit.push({ id: 'audit-' + (mockStockAudit.length + 1), technicianId, itemId, item, delta: -quantity, reason: 'return', createdAt: new Date().toISOString() });
    mockStockTransfers.push({ id: 'transfer-' + (mockStockTransfers.length + 1), from: technicianId, to: 'warehouse', itemId, item, quantity, createdAt: new Date().toISOString() });
    return true;
  },

  async transferBetweenDrivers(fromTech: string, toTech: string, itemId: string, quantity: number) {
    const item = mockInventoryItems.find((i) => i.id === itemId);
    if (!item) throw new Error('Item not found');
    const fromRow = mockDriverStock[fromTech] || (mockDriverStock[fromTech] = []);
    const toRow = mockDriverStock[toTech] || (mockDriverStock[toTech] = []);
    const fromItem = fromRow.find((r) => r.itemId === itemId);
    if (fromItem) fromItem.quantity = Math.max(0, fromItem.quantity - quantity);
    const toItem = toRow.find((r) => r.itemId === itemId);
    if (toItem) toItem.quantity += quantity; else toRow.push({ itemId, item, quantity });
    mockStockTransfers.push({ id: 'transfer-' + (mockStockTransfers.length + 1), from: fromTech, to: toTech, itemId, item, quantity, createdAt: new Date().toISOString() });
    mockStockAudit.push({ id: 'audit-' + (mockStockAudit.length + 1), technicianId: fromTech, itemId, item, delta: -quantity, reason: 'transfer_out', createdAt: new Date().toISOString() });
    mockStockAudit.push({ id: 'audit-' + (mockStockAudit.length + 1), technicianId: toTech, itemId, item, delta: +quantity, reason: 'transfer_in', createdAt: new Date().toISOString() });
    return true;
  },
};


