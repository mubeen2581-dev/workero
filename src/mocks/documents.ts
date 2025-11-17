import { ComplianceDocument } from '@/types';

export const mockDocuments: ComplianceDocument[] = [
  {
    id: 'doc-1',
    entityType: 'company',
    entityId: 'company-1',
    type: 'insurance',
    name: 'Public Liability Insurance',
    fileUrl: '#',
    uploadedBy: 'admin',
    uploadedAt: '2024-12-01T10:00:00Z',
    expiresAt: '2025-02-01T00:00:00Z',
    status: 'expiring',
  },
  {
    id: 'doc-2',
    entityType: 'user',
    entityId: 'tech-1',
    type: 'certification',
    name: 'Electrical Safety Certificate',
    fileUrl: '#',
    uploadedBy: 'lisa',
    uploadedAt: '2024-10-10T09:00:00Z',
    expiresAt: '2025-10-10T00:00:00Z',
    status: 'valid',
  },
  {
    id: 'doc-3',
    entityType: 'vehicle',
    entityId: 'van-2',
    type: 'license',
    name: 'Vehicle MOT',
    fileUrl: '#',
    uploadedBy: 'admin',
    uploadedAt: '2024-06-01T12:00:00Z',
    expiresAt: '2024-11-30T00:00:00Z',
    status: 'expired',
  },
];

export function listDocuments() {
  return mockDocuments;
}

export function addDocument(doc: Omit<ComplianceDocument, 'id' | 'uploadedAt' | 'status'>) {
  const expiresAt = doc.expiresAt;
  const status: ComplianceDocument['status'] = !expiresAt
    ? 'valid'
    : new Date(expiresAt) < new Date()
      ? 'expired'
      : (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24) < 60
        ? 'expiring'
        : 'valid';
  const newDoc: ComplianceDocument = {
    id: 'doc-' + (mockDocuments.length + 1),
    uploadedAt: new Date().toISOString(),
    status,
    ...doc,
  };
  mockDocuments.push(newDoc);
  return newDoc;
}

export function removeDocument(id: string) {
  const idx = mockDocuments.findIndex((d) => d.id === id);
  if (idx >= 0) mockDocuments.splice(idx, 1);
}


