import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { InventoryService } from '@/services/inventory';
import { mockTechnicians } from '@/mocks/jobs';
import { mockInventoryItems } from '@/mocks/inventory';
import { toast } from 'react-toastify';

interface IssueReturnModalProps {
  open: boolean;
  mode: 'issue' | 'return';
  onClose: () => void;
}

const IssueReturnModal: React.FC<IssueReturnModalProps> = ({ open, mode, onClose }) => {
  const [tech, setTech] = useState<string>(mockTechnicians[0]?.id || '');
  const [itemId, setItemId] = useState<string>(mockInventoryItems[0]?.id || '');
  const [qty, setQty] = useState<number>(1);

  if (!open) return null;

  const techOptions = mockTechnicians.map((t) => ({ value: t.id, label: `${t.firstName} ${t.lastName}` }));
  const itemOptions = mockInventoryItems.map((i) => ({ value: i.id, label: `${i.sku} — ${i.name}` }));

  const handleSubmit = async () => {
    if (mode === 'issue') await InventoryService.issueToDriver(tech, itemId, qty);
    else await InventoryService.returnFromDriver(tech, itemId, qty);
    toast.success(mode === 'issue' ? 'Issued to driver' : 'Returned to warehouse');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="w-full max-w-md p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{mode === 'issue' ? 'Issue to Driver' : 'Return from Driver'}</h3>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-600">Technician</label>
            <Select options={techOptions} value={tech} onChange={(v) => setTech(v)} />
          </div>
          <div>
            <label className="text-xs text-gray-600">Item</label>
            <Select options={itemOptions} value={itemId} onChange={(v) => setItemId(v)} />
          </div>
          <div>
            <label className="text-xs text-gray-600">Quantity</label>
            <input type="number" min={1} className="input w-24" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>{mode === 'issue' ? 'Issue' : 'Return'}</Button>
        </div>
      </Card>
    </div>
  );
};

export default IssueReturnModal;


