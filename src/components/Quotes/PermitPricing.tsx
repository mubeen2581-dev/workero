import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Trash2, Calculator } from 'lucide-react';
import { QuoteItem } from '@/types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface Permit {
  id: string;
  type: string;
  description: string;
  cost: number;
  category: 'building' | 'electrical' | 'plumbing' | 'hvac' | 'other';
  required: boolean;
}

interface PermitPricingProps {
  onPermitsChange: (permits: Permit[]) => void;
  existingPermits?: Permit[];
}

const PermitPricing: React.FC<PermitPricingProps> = ({ 
  onPermitsChange, 
  existingPermits = [] 
}) => {
  const [permits, setPermits] = useState<Permit[]>(existingPermits);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPermit, setNewPermit] = useState<Partial<Permit>>({
    type: '',
    description: '',
    cost: 0,
    category: 'building',
    required: true,
  });

  const permitTypes = [
    { value: 'building', label: 'Building Permit' },
    { value: 'electrical', label: 'Electrical Permit' },
    { value: 'plumbing', label: 'Plumbing Permit' },
    { value: 'hvac', label: 'HVAC Permit' },
    { value: 'other', label: 'Other' },
  ];

  const commonPermits = [
    { type: 'Building Permit', description: 'General construction permit', cost: 250, category: 'building' as const },
    { type: 'Electrical Permit', description: 'Electrical work permit', cost: 150, category: 'electrical' as const },
    { type: 'Plumbing Permit', description: 'Plumbing work permit', cost: 120, category: 'plumbing' as const },
    { type: 'HVAC Permit', description: 'HVAC installation permit', cost: 180, category: 'hvac' as const },
  ];

  const handleAddPermit = () => {
    if (!newPermit.type || !newPermit.description) return;

    const permit: Permit = {
      id: `permit-${Date.now()}`,
      type: newPermit.type,
      description: newPermit.description,
      cost: newPermit.cost || 0,
      category: newPermit.category || 'building',
      required: newPermit.required ?? true,
    };

    const updatedPermits = [...permits, permit];
    setPermits(updatedPermits);
    onPermitsChange(updatedPermits);
    setNewPermit({
      type: '',
      description: '',
      cost: 0,
      category: 'building',
      required: true,
    });
    setShowAddForm(false);
  };

  const handleRemovePermit = (id: string) => {
    const updatedPermits = permits.filter(p => p.id !== id);
    setPermits(updatedPermits);
    onPermitsChange(updatedPermits);
  };

  const handleQuickAdd = (permit: typeof commonPermits[0]) => {
    const newPermit: Permit = {
      id: `permit-${Date.now()}`,
      ...permit,
    };
    const updatedPermits = [...permits, newPermit];
    setPermits(updatedPermits);
    onPermitsChange(updatedPermits);
  };

  const totalPermitCost = permits.reduce((sum, permit) => sum + permit.cost, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Permit Pricing</h3>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={Plus}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          Add Permit
        </Button>
      </div>

      {/* Quick Add Common Permits */}
      {permits.length === 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Quick Add Common Permits:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {commonPermits.map((permit, index) => (
              <button
                key={index}
                onClick={() => handleQuickAdd(permit)}
                className="text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <p className="text-sm font-medium text-gray-900">{permit.type}</p>
                <p className="text-xs text-gray-500">{permit.description}</p>
                <p className="text-xs font-semibold text-primary-600 mt-1">
                  {formatCurrency(permit.cost)}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add Permit Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3"
        >
          <Input
            label="Permit Type"
            value={newPermit.type || ''}
            onChange={(e) => setNewPermit({ ...newPermit, type: e.target.value })}
            placeholder="e.g., Building Permit"
          />
          <Input
            label="Description"
            value={newPermit.description || ''}
            onChange={(e) => setNewPermit({ ...newPermit, description: e.target.value })}
            placeholder="Permit description"
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              options={permitTypes}
              value={newPermit.category || 'building'}
              onChange={(value) => setNewPermit({ ...newPermit, category: value as any })}
            />
            <Input
              label="Cost"
              type="number"
              value={newPermit.cost || 0}
              onChange={(e) => setNewPermit({ ...newPermit, cost: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="required"
              checked={newPermit.required}
              onChange={(e) => setNewPermit({ ...newPermit, required: e.target.checked })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="required" className="text-sm text-gray-700">
              Required for this project
            </label>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddPermit} size="sm">Add Permit</Button>
            <Button variant="ghost" onClick={() => setShowAddForm(false)} size="sm">Cancel</Button>
          </div>
        </motion.div>
      )}

      {/* Permits List */}
      {permits.length > 0 && (
        <div className="space-y-2 mb-4">
          {permits.map((permit) => (
            <motion.div
              key={permit.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{permit.type}</span>
                  {permit.required && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">{permit.description}</p>
                <p className="text-xs text-gray-500 mt-1 capitalize">{permit.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(permit.cost)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePermit(permit.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Total */}
      {permits.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">Total Permit Cost:</span>
            </div>
            <span className="text-lg font-bold text-primary-600">
              {formatCurrency(totalPermitCost)}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PermitPricing;


