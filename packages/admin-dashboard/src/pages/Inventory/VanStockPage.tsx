import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import VanStockTable from '@/components/Inventory/VanStockTable';
import BarcodeInput from '@/components/Inventory/BarcodeInput';
import StockTransferModal from '@/components/Inventory/StockTransferModal';
import IssueReturnModal from '@/components/Inventory/IssueReturnModal';
import Button from '@/components/ui/Button';
import { InventoryService } from '@/services/inventory';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { mockTechnicians } from '@/mocks/jobs';
import { mockDriverStock, mockStockAudit, mockStockTransfers } from '@/mocks/inventory';

type Tab = 'driver' | 'transfers' | 'audit';

const VanStockPage: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<string>(mockTechnicians[0]?.id || '');
  const [tab, setTab] = useState<Tab>('driver');
  const [showTransfer, setShowTransfer] = useState(false);
  const [showIssue, setShowIssue] = useState<false | 'issue' | 'return'>(false);
  const technicianOptions = mockTechnicians.map((t) => ({ value: t.id, label: `${t.firstName} ${t.lastName}` }));
  const qc = useQueryClient();

  const transfers = useMemo(() => mockStockTransfers.slice().reverse(), []);
  const audit = useMemo(() => mockStockAudit.slice().reverse(), []);

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
            <button key={t.id} onClick={() => setTab(t.id as Tab)} className={`px-4 py-3 text-sm font-medium ${tab === t.id ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
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
              const item = await InventoryService.findItemByCode(code);
              if (item) {
                // optimistic update: invalidate (mock) key
                await InventoryService.issueToDriver(selectedTech, item.id, 1);
                qc.invalidateQueries({ queryKey: queryKeys.inventory.driverStock(selectedTech) });
                qc.invalidateQueries({ queryKey: queryKeys.inventory.audit });
                qc.invalidateQueries({ queryKey: queryKeys.inventory.transfers });
                toast.success(`Issued 1 of ${item.sku}`);
              } else {
                toast.error('Item not found');
              }
            }} />
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
              <p className="text-sm text-gray-600">Items in van: {mockDriverStock[selectedTech]?.reduce((s, r) => s + r.quantity, 0) || 0}</p>
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


