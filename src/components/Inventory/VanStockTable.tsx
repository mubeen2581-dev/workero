import React, { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useVanStockByTechnician, useAssignVanStock, useReturnVanStock, useInventoryItems } from '@/services/inventoryQueries';
import { toast } from 'react-toastify';
import { VanStock, InventoryItem } from '@/types';

interface VanStockTableProps {
  technicianId: string;
  onChange?: () => void;
  className?: string;
}

const VanStockTable: React.FC<VanStockTableProps> = ({ technicianId, onChange, className = '' }) => {
  const { data: vanStockRaw = [] } = useVanStockByTechnician(technicianId);
  const { data: inventoryItems = [] } = useInventoryItems();
  const assignMutation = useAssignVanStock();
  const returnMutation = useReturnVanStock();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkQty, setBulkQty] = useState<number>(1);

  // Normalize van stock data and join with inventory items
  const rows = useMemo(() => {
    return vanStockRaw.map((vs: any) => {
      const item = vs.item || inventoryItems.find((i: any) => i.id === (vs.item_id ?? vs.itemId));
      return {
        ...vs,
        itemId: vs.item_id ?? vs.itemId,
        item,
        quantity: vs.quantity || 0,
      };
    });
  }, [vanStockRaw, inventoryItems]);

  const handleIssue = async (itemId: string) => {
    if (!technicianId) {
      toast.error('Please select a technician');
      return;
    }

    try {
      await assignMutation.mutateAsync({
        item_id: itemId,
        technician_id: technicianId,
        quantity: 1,
        from_location: 'warehouse',
      });
      toast.success('Issued 1 unit');
      onChange?.();
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  const handleReturn = async (vanStockId: string, quantity: number = 1) => {
    try {
      await returnMutation.mutateAsync({
        id: vanStockId,
        data: {
          quantity,
        },
      });
      toast.info('Returned stock from van');
      onChange?.();
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  return (
    <Card className={className}>
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Technician Van Stock</h3>
          <p className="text-sm text-gray-600">Items assigned to technician</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
                  <th className="px-4 py-2">
                    <input type="checkbox" onChange={(e) => {
                      if (e.target.checked) setSelected(new Set(rows.map((r) => r.itemId)));
                      else setSelected(new Set());
                    }} checked={selected.size > 0 && selected.size === rows.length} />
                  </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Item</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">SKU</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Qty</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((r) => (
              <tr key={r.itemId}>
                    <td className="px-4 py-2">
                      <input type="checkbox" checked={selected.has(r.itemId)} onChange={(e) => {
                        const next = new Set(selected);
                        if (e.target.checked) next.add(r.itemId); else next.delete(r.itemId);
                        setSelected(next);
                      }} />
                    </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {r.item?.name || 'Unknown Item'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {r.item?.sku || 'N/A'}
                </td>
                <td className="px-4 py-2 text-sm font-semibold">{r.quantity}</td>
                <td className="px-4 py-2 text-right">
                  <div className="inline-flex gap-2">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleIssue(r.itemId);
                      }}
                    >
                      +1
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleReturn(r.id || r.itemId, 1);
                      }}
                    >
                      -1
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">No items in van.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-200 flex items-center justify-between gap-3">
        <div className="text-xs text-gray-600">{selected.size} selected</div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Qty</span>
          <input type="number" min={1} className="input w-20" value={bulkQty} onChange={(e) => setBulkQty(Math.max(1, Number(e.target.value)))} />
        </div>
        <div className="inline-flex gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!technicianId) {
                toast.error('Please select a technician');
                return;
              }
              try {
                await Promise.all(Array.from(selected).map((id) => 
                  assignMutation.mutateAsync({
                    item_id: id,
                    technician_id: technicianId,
                    quantity: bulkQty,
                    from_location: 'warehouse',
                  })
                ));
                toast.success(`Issued +${bulkQty} to selected`);
                setSelected(new Set());
                onChange?.();
              } catch (error) {
                // Error handled by mutation hook
              }
            }}
          >
            Issue
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                const selectedRows = rows.filter(r => selected.has(r.itemId));
                await Promise.all(selectedRows.map((r) => 
                  returnMutation.mutateAsync({
                    id: r.id || r.itemId,
                    data: { quantity: bulkQty },
                  })
                ));
                toast.info(`Returned -${bulkQty} from selected`);
                setSelected(new Set());
                onChange?.();
              } catch (error) {
                // Error handled by mutation hook
              }
            }}
          >
            Return
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default VanStockTable;


