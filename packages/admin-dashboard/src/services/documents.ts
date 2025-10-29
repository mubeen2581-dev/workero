import { addDocument, listDocuments, removeDocument } from '@/mocks/documents';
import { ComplianceDocument } from '@/types';

export const DocumentsService = {
  async list() {
    return listDocuments();
  },
  async upload(doc: Omit<ComplianceDocument, 'id' | 'uploadedAt' | 'status'>) {
    return addDocument(doc);
  },
  async delete(id: string) {
    return removeDocument(id);
  },
};


