import React from 'react';
import { Trash2, UserPlus, Tag, Download, X } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Lead } from '@/types';

interface BulkActionsBarProps {
  selectedLeads: Lead[];
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkAssign: () => void;
  onBulkUpdateStatus: () => void;
  onExport: () => void;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedLeads,
  onClearSelection,
  onBulkDelete,
  onBulkAssign,
  onBulkUpdateStatus,
  onExport,
}) => {
  if (selectedLeads.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge variant="primary" size="lg">
            {selectedLeads.length} selected
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            icon={X}
          >
            Clear
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onExport}
            icon={Download}
          >
            Export
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onBulkUpdateStatus}
            icon={Tag}
          >
            Update Status
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onBulkAssign}
            icon={UserPlus}
          >
            Assign
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onBulkDelete}
            icon={Trash2}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;

