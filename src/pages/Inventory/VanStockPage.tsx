import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import VanStockTable from '@/components/Inventory/VanStockTable';
import BarcodeInput from '@/components/Inventory/BarcodeInput';
import StockTransferModal from '@/components/Inventory/StockTransferModal';
import IssueReturnModal from '@/components/Inventory/IssueReturnModal';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
// Note: Users/technicians should be fetched from a users service
// For now, we'll use a placeholder - this should be replaced with actual user service
import { 
  useVanStockByTechnician, 
  useStockTransfers, 
  useStockMovements,
  useInventoryItems,
} from '@/services/inventoryQueries';

type Tab = 'driver' | 'transfers' | 'audit';

const VanStockPage: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<string>('');
  const [tab, setTab] = useState<Tab>('driver');
  const [showTransfer, setShowTransfer] = useState(false);
  const [showIssue, setShowIssue] = useState<false | 'issue' | 'return'>(false);

  // TODO: Fetch technicians from users service
  // For now, using empty array - this should be replaced with actual user service
  const technicians: any[] = [];
  const technicianOptions = technicians.map((t: any) => ({ 
    value: t.id, 
    label: `${t.first_name ?? t.firstName ?? ''} ${t.last_name ?? t.lastName ?? ''}`.trim() || t.email 
  }));

  // Set default technician when available
  React.useEffect(() => {
    if (technicians.length > 0 && !selectedTech) {
      setSelectedTech(technicians[0].id);
    }
  }, [technicians, selectedTech]);

  // Fetch van stock data
  const { data: vanStock = [] } = useVanStockByTechnician(selectedTech);
  const { data: transfersRaw = [] } = useStockTransfers();
  const { data: movementsRaw = [] } = useStockMovements();
  const { data: inventoryItems = [] } = useInventoryItems();

  // Normalize transfers data
  const transfers = useMemo(() => {
    return transfersRaw
      .filter((t: any) => t.type === 'transfer')
      .map((t: any) => ({
        ...t,
        createdAt: t.created_at ?? t.createdAt,
        from: t.from_location ?? t.fromLocation ?? 'Unknown',
        to: t.to_location ?? t.toLocation ?? 'Unknown',
        item: t.item || inventoryItems.find((i: any) => i.id === (t.item_id ?? t.itemId)),
      }))
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [transfersRaw, inventoryItems]);

  // Normalize audit data (stock movements)
  const audit = useMemo(() => {
    return movementsRaw
      .map((m: any) => ({
        ...m,
        id: m.id,
        technicianId: m.performed_by ?? m.performer?.id ?? m.performedBy ?? 'Unknown',
        item: m.item || inventoryItems.find((i: any) => i.id === (m.item_id ?? m.itemId)),
        reason: m.reason || m.type,
        delta: m.type === 'in' ? m.quantity : (m.type === 'out' ? -m.quantity : 0),
        createdAt: m.created_at ?? m.performed_at ?? m.createdAt ?? m.performedAt,
      }))
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [movementsRaw, inventoryItems]);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Van Stock</h1>
            <p className="text-sm sm:text-base text-gray-600">Per-technician inventory with issue/return and audit trail</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="w-full sm:w-64">
              <Select options={technicianOptions} value={selectedTech} onChange={(v) => setSelectedTech(v)} />
            </div>
            <Button variant="secondary" size="sm" onClick={() => setShowIssue('issue')}>Issue</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowIssue('return')}>Return</Button>
            <Button variant="primary" size="sm" onClick={() => setShowTransfer(true)}>Transfer</Button>
          </div>
        </div>
      </motion.div>

      <Card className="p-0">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'driver', label: 'Driver Stock' },
            { id: 'transfers', label: 'Transfers' },
            { id: 'audit', label: 'Audit Log' },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id as Tab)} className={`px-4 py-3 text-sm font-medium ${tab === t.id ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`} style={tab === t.id ? { backgroundColor: '#F3F0FF' } : {}}>
              {t.label}
            </button>
          ))}
        </div>
      </Card>

      {tab === 'driver' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <VanStockTable technicianId={selectedTech} onChange={() => {}} className="lg:col-span-2" />
          <div className="space-y-4">
            <BarcodeInput onScan={async (code) => {
              const item = inventoryItems.find((i: any) => 
                i.barcode === code || i.sku.toLowerCase() === code.toLowerCase()
              );
              if (item) {
                toast.success(`Found item: ${item.sku}. Use Issue button to assign.`);
              } else {
                toast.error('Item not found');
              }
            }} />
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
              <p className="text-sm text-gray-600">
                Items in van: {vanStock.reduce((sum, vs) => sum + (vs.quantity || 0), 0)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Unique items: {vanStock.length}
              </p>
            </Card>
          </div>
        </div>
      )}

      {tab === 'transfers' && (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">When</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">From</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">To</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Item</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transfers.map((tr) => (
                  <tr key={tr.id}>
                    <td className="px-4 py-2 text-sm text-gray-600">{new Date(tr.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm">{tr.from}</td>
                    <td className="px-4 py-2 text-sm">{tr.to}</td>
                    <td className="px-4 py-2 text-sm">{tr.item.name}</td>
                    <td className="px-4 py-2 text-sm text-right font-semibold">{tr.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'audit' && (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">When</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Tech</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Item</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Reason</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {audit.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-2 text-sm text-gray-600">{new Date(row.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm">{row.technicianId}</td>
                    <td className="px-4 py-2 text-sm">{row.item.name}</td>
                    <td className="px-4 py-2 text-sm">{row.reason}</td>
                    <td className={`px-4 py-2 text-sm text-right font-semibold ${row.delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>{row.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {showTransfer && <StockTransferModal open={showTransfer} onClose={() => setShowTransfer(false)} />}
      {showIssue && <IssueReturnModal open={!!showIssue} mode={showIssue} onClose={() => setShowIssue(false)} />}
    </div>
  );
};

export default VanStockPage;


