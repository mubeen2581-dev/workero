import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { ramsTemplates, generateRAMS } from '@/mocks/rams';
import { DocumentsService } from '@/services/documents';
import { ComplianceDocument } from '@/types';
import { toast } from 'react-toastify';

const CompliancePage: React.FC = () => {
  const [docs, setDocs] = useState<ComplianceDocument[]>([]);
  const [status, setStatus] = useState<string>('all');
  const [type, setType] = useState<string>('all');
  const [ramsId, setRamsId] = useState<string>(ramsTemplates[0]?.id || '');
  const [ramsPreview, setRamsPreview] = useState<string>('');

  const load = async () => setDocs(await DocumentsService.list());
  useEffect(() => { load(); }, []);
  
  // Expiry reminders (< 30 days)
  useEffect(() => {
    if (!docs.length) return;
    const soon = docs.filter(d => d.expiresAt && (new Date(d.expiresAt!).getTime() - Date.now()) / (1000 * 60 * 60 * 24) < 30 && (new Date(d.expiresAt!).getTime() - Date.now()) > 0);
    if (soon.length) toast.warning(`${soon.length} document${soon.length>1?'s':''} expiring within 30 days`);
  }, [docs]);

  const filtered = useMemo(() => docs.filter(d => (status === 'all' || d.status === status) && (type === 'all' || d.type === type)), [docs, status, type]);

  const [uploadEntityType, setUploadEntityType] = useState<'user'|'company'|'vehicle'|'job'>('company');
  const [uploadEntityId, setUploadEntityId] = useState<string>('company-1');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await DocumentsService.upload({
      entityType: uploadEntityType,
      entityId: uploadEntityId,
      type: 'other',
      name: file.name,
      fileUrl: '#',
      uploadedBy: 'admin',
      expiresAt: undefined,
      notes: '',
    });
    await load();
  };

  const handleDelete = async (id: string) => { await DocumentsService.delete(id); await load(); };

  const statusColor = (s: string) => s === 'valid' ? 'bg-green-100 text-green-800' : s === 'expiring' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800';

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Compliance & Documents</h1>
        <p className="text-sm sm:text-base text-gray-600">Upload, track expiry, and manage RAMS.</p>
      </motion.div>

      <Card className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Select value={status} onChange={(v) => setStatus(v)} options={[{ value: 'all', label: 'All Status' }, { value: 'valid', label: 'Valid' }, { value: 'expiring', label: 'Expiring' }, { value: 'expired', label: 'Expired' }]} />
          <Select value={type} onChange={(v) => setType(v)} options={[{ value: 'all', label: 'All Types' }, { value: 'insurance', label: 'Insurance' }, { value: 'certification', label: 'Certification' }, { value: 'license', label: 'License' }, { value: 'rams', label: 'RAMS' }, { value: 'other', label: 'Other' }]} />
        </div>
        <div className="flex items-center gap-2">
          <Select value={uploadEntityType} onChange={(v) => setUploadEntityType(v as 'user'|'company'|'vehicle'|'job')} options={[
            { value: 'company', label: 'Company' },
            { value: 'user', label: 'User' },
            { value: 'vehicle', label: 'Vehicle' },
            { value: 'job', label: 'Job' },
          ]} />
          <input className="input w-36" value={uploadEntityId} onChange={(e)=>setUploadEntityId(e.target.value)} placeholder="Entity ID" />
          <label className="inline-flex items-center px-3 py-2 bg-primary-600 text-white rounded-xl cursor-pointer">
            Upload
            <input type="file" onChange={handleUpload} className="hidden" />
          </label>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Select value={ramsId} onChange={(v) => setRamsId(v)} options={ramsTemplates.map(t => ({ value: t.id, label: t.name }))} />
            <Button variant="secondary" onClick={() => setRamsPreview(generateRAMS(ramsId))}>Preview RAMS</Button>
          </div>
          <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => {
            if (!ramsPreview) return;
            const blob = new Blob([ramsPreview], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `${ramsTemplates.find(t=>t.id===ramsId)?.name || 'RAMS'}.pdf`; a.click();
            URL.revokeObjectURL(url);
          }}>Download PDF</Button>
          <Button variant="primary" onClick={async () => {
            if (!ramsPreview) setRamsPreview(generateRAMS(ramsId));
            await DocumentsService.upload({ entityType: uploadEntityType, entityId: uploadEntityId, type: 'rams', name: `${ramsTemplates.find(t=>t.id===ramsId)?.name}.pdf`, fileUrl: '#', uploadedBy: 'admin', expiresAt: undefined, notes: '' });
            await load();
          }}>Save as Document</Button>
          </div>
        </div>
        {ramsPreview && (
          <pre className="mt-3 p-3 bg-gray-50 rounded-xl text-xs overflow-auto">{ramsPreview}</pre>
        )}
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Expires</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{d.name}</td>
                  <td className="px-4 py-2 text-sm capitalize">{d.type}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(d.status)}`}>{d.status}</span>
                  </td>
                  <td className="px-4 py-2 text-sm">{d.expiresAt ? new Date(d.expiresAt).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-2 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(d.id)} className="text-red-600">Delete</Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">No documents.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default CompliancePage;


