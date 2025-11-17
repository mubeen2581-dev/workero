import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { mockTechnicians } from '@/mocks/jobs';
import { InventoryService } from '@/services/inventory';
import { toast } from 'react-toastify';

interface StockTransferModalProps {
  open: boolean;
  onClose: () => void;
}

const StockTransferModal: React.FC<StockTransferModalProps> = ({ open, onClose }) => {
  const [fromTech, setFromTech] = useState<string>(mockTechnicians[0]?.id || '');
  const [toTech, setToTech] = useState<string>(mockTechnicians[1]?.id || '');
  const [itemCode, setItemCode] = useState('');
  const [qty, setQty] = useState<number>(1);

  if (!open) return null;

  const techOptions = mockTechnicians.map((t) => ({ value: t.id, label: `${t.firstName} ${t.lastName}` }));

  const handleSubmit = async () => {
    const item = await InventoryService.findItemByCode(itemCode);
    if (!item) return toast.error('Item not found');
    await InventoryService.transferBetweenDrivers(fromTech, toTech, item.id, qty);
    toast.success('Transferred');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="w-full max-w-md p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Transfer Stock</h3>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-600">From</label>
            <Select options={techOptions} value={fromTech} onChange={(v) => setFromTech(v)} />
          </div>
          <div>
            <label className="text-xs text-gray-600">To</label>
            <Select options={techOptions} value={toTech} onChange={(v) => setToTech(v)} />
          </div>
          <div>
            <label className="text-xs text-gray-600">Item SKU/Barcode</label>
            <input className="input w-full" value={itemCode} onChange={(e) => setItemCode(e.target.value)} placeholder="e.g. GFCI-20A-001 or 123456..." />
          </div>
          <div>
            <label className="text-xs text-gray-600">Quantity</label>
            <input type="number" min={1} className="input w-24" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Transfer</Button>
        </div>
      </Card>
    </div>
  );
};

export default StockTransferModal;


