import { InventoryItem, Supplier, StockMovement, PurchaseOrder, Category } from '@/types';

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Electrical',
    description: 'Electrical components and supplies',
    color: '#3B82F6',
    itemCount: 25,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-2',
    name: 'Plumbing',
    description: 'Plumbing fixtures and materials',
    color: '#10B981',
    itemCount: 18,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-3',
    name: 'Cabinets',
    description: 'Kitchen and bathroom cabinets',
    color: '#F59E0B',
    itemCount: 12,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-4',
    name: 'Countertops',
    description: 'Granite, quartz, and laminate countertops',
    color: '#8B5CF6',
    itemCount: 8,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-5',
    name: 'Tools',
    description: 'Hand tools and power tools',
    color: '#EF4444',
    itemCount: 35,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-6',
    name: 'Hardware',
    description: 'Screws, bolts, and fasteners',
    color: '#6B7280',
    itemCount: 42,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockSuppliers: Supplier[] = [
  {
    id: 'supplier-1',
    name: 'Electrical Supply Co.',
    contactPerson: 'John Smith',
    email: 'john@electricalsupply.com',
    phone: '555-123-4567',
    address: {
      street: '123 Electric Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    website: 'https://electricalsupply.com',
    paymentTerms: 'Net 30',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'supplier-2',
    name: 'Plumbing Masters',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@plumbingmasters.com',
    phone: '555-987-6543',
    address: {
      street: '456 Pipe St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
    },
    website: 'https://plumbingmasters.com',
    paymentTerms: 'Net 15',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'supplier-3',
    name: 'Cabinet Warehouse',
    contactPerson: 'Mike Wilson',
    email: 'mike@cabinetwarehouse.com',
    phone: '555-456-7890',
    address: {
      street: '789 Wood Blvd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
    website: 'https://cabinetwarehouse.com',
    paymentTerms: 'Net 30',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'supplier-4',
    name: 'Stone Works',
    contactPerson: 'Lisa Brown',
    email: 'lisa@stoneworks.com',
    phone: '555-321-0987',
    address: {
      street: '321 Granite Dr',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA',
    },
    website: 'https://stoneworks.com',
    paymentTerms: 'Net 45',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockInventoryItems: InventoryItem[] = [
  {
    id: 'item-1',
    name: 'GFCI Outlet - 20A',
    sku: 'GFCI-20A-001',
    description: '20 Amp GFCI outlet with tamper-resistant design',
    category: 'Electrical',
    unitPrice: 25.99,
    costPrice: 18.50,
    currentStock: 45,
    minStock: 10,
    maxStock: 100,
    reorderPoint: 15,
    location: 'A-1-15',
    barcode: '1234567890123',
    quantity: 45,
    minQuantity: 10,
    maxQuantity: 100,
    lastAuditDate: '2024-12-01T00:00:00Z',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z',
  },
  {
    id: 'item-2',
    name: 'Copper Pipe - 1/2 inch',
    sku: 'PIPE-CU-1-2',
    description: '1/2 inch copper pipe, 10 feet length',
    category: 'Plumbing',
    unitPrice: 12.50,
    costPrice: 8.75,
    currentStock: 8,
    minStock: 20,
    maxStock: 50,
    reorderPoint: 25,
    location: 'B-2-08',
    barcode: '2345678901234',
    quantity: 8,
    minQuantity: 20,
    maxQuantity: 50,
    lastAuditDate: '2024-12-01T00:00:00Z',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z',
  },
  {
    id: 'item-3',
    name: 'Oak Cabinet - 36 inch',
    sku: 'CAB-OAK-36',
    description: '36 inch oak kitchen cabinet with soft-close doors',
    category: 'Cabinetry',
    unitPrice: 450.00,
    costPrice: 320.00,
    currentStock: 3,
    minStock: 5,
    maxStock: 15,
    reorderPoint: 8,
    location: 'C-3-12',
    barcode: '3456789012345',
    quantity: 3,
    minQuantity: 5,
    maxQuantity: 15,
    lastAuditDate: '2024-12-01T00:00:00Z',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z',
  },
  {
    id: 'item-4',
    name: 'Granite Countertop - 2cm',
    sku: 'GRAN-2CM-001',
    description: '2cm thick granite countertop, various colors',
    category: 'Countertops',
    unitPrice: 45.00,
    costPrice: 32.00,
    currentStock: 25,
    minStock: 15,
    maxStock: 40,
    reorderPoint: 20,
    location: 'D-4-25',
    barcode: '4567890123456',
    quantity: 2,
    minQuantity: 3,
    maxQuantity: 10,
    lastAuditDate: '2024-12-01T00:00:00Z',
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z',
  },
  {
    id: 'item-5',
    name: 'Cordless Drill - 18V',
    sku: 'DRILL-18V-001',
    description: '18V cordless drill with lithium battery',
    category: 'Flooring',
    unitPrice: 89.99,
    costPrice: 65.00,
    currentStock: 12,
    minStock: 8,
    maxStock: 25,
    reorderPoint: 10,
    location: 'E-5-18',
    barcode: '5678901234567',
    quantity: 12,
    minQuantity: 5,
    maxQuantity: 25,
    lastAuditDate: '2024-12-01T00:00:00Z',
    createdAt: '2024-05-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z',
  },
  {
    id: 'item-6',
    name: 'Wood Screws - #8 x 2 inch',
    sku: 'SCREW-W8-2',
    description: '#8 wood screws, 2 inch length, 100 count box',
    category: 'Hardware',
    unitPrice: 8.99,
    costPrice: 5.50,
    currentStock: 2,
    minStock: 10,
    maxStock: 50,
    reorderPoint: 15,
    location: 'F-6-02',
    barcode: '6789012345678',
    quantity: 500,
    minQuantity: 100,
    maxQuantity: 1000,
    lastAuditDate: '2024-12-01T00:00:00Z',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z',
  },
];

export const mockStockMovements: StockMovement[] = [
  {
    id: 'movement-1',
    itemId: 'item-1',
    item: mockInventoryItems[0],
    type: 'in',
    quantity: 50,
    reason: 'purchase',
    reference: 'PO-2024-001',
    notes: 'Initial stock purchase',
    performedBy: 'user-1',
    performedAt: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'movement-2',
    itemId: 'item-1',
    item: mockInventoryItems[0],
    type: 'out',
    quantity: 5,
    reason: 'job_usage',
    reference: 'JOB-001',
    notes: 'Used in kitchen renovation project',
    performedBy: 'tech-1',
    performedAt: '2024-01-16T14:20:00Z',
    createdAt: '2024-01-16T14:20:00Z',
  },
  {
    id: 'movement-3',
    itemId: 'item-2',
    item: mockInventoryItems[1],
    type: 'in',
    quantity: 30,
    reason: 'purchase',
    reference: 'PO-2024-002',
    notes: 'Restock order',
    performedBy: 'user-1',
    performedAt: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'movement-4',
    itemId: 'item-2',
    item: mockInventoryItems[1],
    type: 'out',
    quantity: 22,
    reason: 'job_usage',
    reference: 'JOB-002',
    notes: 'Bathroom plumbing project',
    performedBy: 'tech-2',
    performedAt: '2024-01-18T11:45:00Z',
    createdAt: '2024-01-18T11:45:00Z',
  },
  {
    id: 'movement-5',
    itemId: 'item-3',
    item: mockInventoryItems[2],
    type: 'in',
    quantity: 8,
    reason: 'purchase',
    reference: 'PO-2024-003',
    notes: 'Cabinet restock',
    performedBy: 'user-1',
    performedAt: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'movement-6',
    itemId: 'item-3',
    item: mockInventoryItems[2],
    type: 'out',
    quantity: 5,
    reason: 'job_usage',
    reference: 'JOB-004',
    notes: 'Kitchen renovation project',
    performedBy: 'tech-1',
    performedAt: '2024-01-16T14:20:00Z',
    createdAt: '2024-01-16T14:20:00Z',
  },
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-1',
    supplierId: 'supplier-1',
    supplier: mockSuppliers[0],
    status: 'draft',
    totalAmount: 1299.50,
    items: [
      {
        itemId: 'item-1',
        item: mockInventoryItems[0],
        quantity: 50,
        unitPrice: 18.50,
        totalPrice: 925.00,
      },
      {
        itemId: 'item-5',
        item: mockInventoryItems[4],
        quantity: 5,
        unitPrice: 65.00,
        totalPrice: 325.00,
      },
    ],
    orderDate: '2024-12-15T10:00:00Z',
    expectedDelivery: '2024-12-22T00:00:00Z',
    notes: 'Monthly restock order',
    createdAt: '2024-12-15T10:00:00Z',
    updatedAt: '2024-12-15T10:00:00Z',
  },
  {
    id: 'po-2',
    supplierId: 'supplier-2',
    supplier: mockSuppliers[1],
    status: 'received',
    totalAmount: 375.00,
    items: [
      {
        itemId: 'item-2',
        item: mockInventoryItems[1],
        quantity: 30,
        unitPrice: 8.75,
        totalPrice: 262.50,
      },
      {
        itemId: 'item-6',
        item: mockInventoryItems[5],
        quantity: 20,
        unitPrice: 5.50,
        totalPrice: 110.00,
      },
    ],
    orderDate: '2024-12-01T14:30:00Z',
    expectedDelivery: '2024-12-08T00:00:00Z',
    notes: 'Plumbing supplies restock',
    createdAt: '2024-12-01T14:30:00Z',
    updatedAt: '2024-12-08T16:45:00Z',
  },
];

// Van Stock (per-technician) and Audit
export const mockDriverStock: Record<string, Array<{ itemId: string; item: InventoryItem; quantity: number }>> = {
  'tech-1': [
    { itemId: 'item-1', item: mockInventoryItems[0], quantity: 6 },
    { itemId: 'item-6', item: mockInventoryItems[5], quantity: 4 },
  ],
  'tech-2': [
    { itemId: 'item-2', item: mockInventoryItems[1], quantity: 10 },
  ],
  'tech-3': [
    { itemId: 'item-1', item: mockInventoryItems[0], quantity: 2 },
  ],
  'tech-4': [],
};

export interface StockTransferRecord {
  id: string;
  from?: string; // 'warehouse' or technician id
  to?: string; // 'warehouse' or technician id
  itemId: string;
  item: InventoryItem;
  quantity: number;
  createdAt: string;
  reference?: string;
}

export const mockStockTransfers: StockTransferRecord[] = [
  {
    id: 'transfer-1',
    from: 'warehouse',
    to: 'tech-1',
    itemId: 'item-1',
    item: mockInventoryItems[0],
    quantity: 8,
    createdAt: '2024-12-12T09:00:00Z',
    reference: 'ISSUE-001',
  },
];

export interface StockAuditRow {
  id: string;
  technicianId: string;
  itemId: string;
  item: InventoryItem;
  delta: number; // + issue/transfer in, - usage/return
  reason: 'issue' | 'return' | 'transfer_in' | 'transfer_out' | 'use';
  createdAt: string;
}

export const mockStockAudit: StockAuditRow[] = [
  {
    id: 'audit-1',
    technicianId: 'tech-1',
    itemId: 'item-1',
    item: mockInventoryItems[0],
    delta: +8,
    reason: 'issue',
    createdAt: '2024-12-12T09:05:00Z',
  },
];

export const issueToDriver = (technicianId: string, itemId: string, quantity: number) => {
  const row = mockDriverStock[technicianId] || (mockDriverStock[technicianId] = []);
  const item = mockInventoryItems.find((i) => i.id === itemId)!;
  const existing = row.find((r) => r.itemId === itemId);
  if (existing) existing.quantity += quantity; else row.push({ itemId, item, quantity });
  mockStockAudit.push({ id: 'audit-' + (mockStockAudit.length + 1), technicianId, itemId, item, delta: quantity, reason: 'issue', createdAt: new Date().toISOString() });
  mockStockTransfers.push({ id: 'transfer-' + (mockStockTransfers.length + 1), from: 'warehouse', to: technicianId, itemId, item, quantity, createdAt: new Date().toISOString() });
};

export const returnFromDriver = (technicianId: string, itemId: string, quantity: number) => {
  const row = mockDriverStock[technicianId];
  if (!row) return;
  const item = mockInventoryItems.find((i) => i.id === itemId)!;
  const existing = row.find((r) => r.itemId === itemId);
  if (existing) existing.quantity = Math.max(0, existing.quantity - quantity);
  mockStockAudit.push({ id: 'audit-' + (mockStockAudit.length + 1), technicianId, itemId, item, delta: -quantity, reason: 'return', createdAt: new Date().toISOString() });
  mockStockTransfers.push({ id: 'transfer-' + (mockStockTransfers.length + 1), from: technicianId, to: 'warehouse', itemId, item, quantity, createdAt: new Date().toISOString() });
};


export const getLowStockItems = () => {
  return mockInventoryItems.filter(item => item.currentStock <= item.reorderPoint);
};

export const getInventoryValue = () => {
  return mockInventoryItems.reduce((total, item) => {
    return total + (item.currentStock * item.costPrice);
  }, 0);
};

export const getInventoryStats = () => {
  const totalItems = mockInventoryItems.length;
  const lowStockItems = getLowStockItems().length;
  const outOfStockItems = mockInventoryItems.filter(item => item.currentStock === 0).length;
  const totalValue = getInventoryValue();
  
  return {
    totalItems,
    lowStockItems,
    outOfStockItems,
    totalValue,
  };
};

export const getStockMovementHistory = (itemId: string, limit: number = 10) => {
  return mockStockMovements
    .filter(movement => movement.itemId === itemId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const calculateReorderQuantity = (item: InventoryItem) => {
  const reorderQuantity = item.maxStock - item.currentStock;
  return Math.max(reorderQuantity, item.minStock);
};

export const generateReorderSuggestions = () => {
  const lowStockItems = getLowStockItems();
  
  return lowStockItems.map(item => ({
    item,
    suggestedQuantity: calculateReorderQuantity(item),
    urgency: item.currentStock <= item.minStock ? 'critical' : 'low',
  }));
};
