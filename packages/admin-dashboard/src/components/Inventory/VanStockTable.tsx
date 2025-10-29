import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { mockDriverStock } from '@/mocks/inventory';
import { useIssueMutation, useReturnMutation, useDriverStock } from '@/services/inventoryQueries';
import { mockTechnicians } from '@/mocks/jobs';
import { toast } from 'react-toastify';

interface VanStockTableProps {
  technicianId: string;
  onChange?: () => void;
  className?: string;
}

const VanStockTable: React.FC<VanStockTableProps> = ({ technicianId, onChange, className = '' }) => {
  const { data: rows = [] } = useDriverStock(technicianId);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const tech = mockTechnicians.find((t) => t.id === technicianId);
  const issueMutation = useIssueMutation(technicianId);
  const returnMutation = useReturnMutation(technicianId);
  const [bulkQty, setBulkQty] = useState<number>(1);

  const handleIssue = async (itemId: string) => {
    await issueMutation.mutateAsync({ itemId, quantity: 1 });
    toast.success('Issued 1 unit');
    onChange?.();
  };

  const handleReturn = async (itemId: string) => {
    await returnMutation.mutateAsync({ itemId, quantity: 1 });
    toast.info('Returned 1 unit');
    onChange?.();
  };

  return (
    <Card className={className}>
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        {tech && <img src={tech.avatar} alt={tech.firstName} className="w-8 h-8 rounded-full" />}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{tech ? `${tech.firstName} ${tech.lastName}` : 'Technician'}</h3>
          <p className="text-sm text-gray-600">Van stock</p>
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
                <td className="px-4 py-2 text-sm text-gray-900">{r.item.name}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{r.item.sku}</td>
                <td className="px-4 py-2 text-sm font-semibold">{r.quantity}</td>
                <td className="px-4 py-2 text-right">
                  <div className="inline-flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleIssue(r.itemId)}>+1</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleReturn(r.itemId)}>-1</Button>
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
          <Button variant="secondary" size="sm" onClick={async () => { await Promise.all(Array.from(selected).map((id) => issueMutation.mutateAsync({ itemId: id, quantity: bulkQty }))); toast.success(`Issued +${bulkQty} to selected`); setSelected(new Set()); onChange?.(); }}>Issue</Button>
          <Button variant="ghost" size="sm" onClick={async () => { await Promise.all(Array.from(selected).map((id) => returnMutation.mutateAsync({ itemId: id, quantity: bulkQty }))); toast.info(`Returned -${bulkQty} from selected`); setSelected(new Set()); onChange?.(); }}>Return</Button>
        </div>
      </div>
    </Card>
  );
};

export default VanStockTable;


