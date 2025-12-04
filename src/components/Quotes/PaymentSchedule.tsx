import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, Plus, Trash2, Percent } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface PaymentMilestone {
  id: string;
  name: string;
  description: string;
  amount: number;
  percentage: number;
  dueDate: string;
  type: 'deposit' | 'milestone' | 'final';
  trigger: 'signature' | 'completion' | 'date';
}

interface PaymentScheduleProps {
  totalAmount: number;
  onScheduleChange: (schedule: PaymentMilestone[]) => void;
  existingSchedule?: PaymentMilestone[];
}

const PaymentSchedule: React.FC<PaymentScheduleProps> = ({
  totalAmount,
  onScheduleChange,
  existingSchedule = [],
}) => {
  const [schedule, setSchedule] = useState<PaymentMilestone[]>(existingSchedule);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMilestone, setNewMilestone] = useState<Partial<PaymentMilestone>>({
    name: '',
    description: '',
    amount: 0,
    percentage: 0,
    dueDate: '',
    type: 'deposit',
    trigger: 'signature',
  });

  const handleAddMilestone = () => {
    if (!newMilestone.name || (!newMilestone.amount && !newMilestone.percentage)) return;

    const amount = newMilestone.amount || (totalAmount * (newMilestone.percentage || 0) / 100);
    
    const milestone: PaymentMilestone = {
      id: `milestone-${Date.now()}`,
      name: newMilestone.name || '',
      description: newMilestone.description || '',
      amount: amount,
      percentage: newMilestone.percentage || (amount / totalAmount * 100),
      dueDate: newMilestone.dueDate || '',
      type: newMilestone.type || 'milestone',
      trigger: newMilestone.trigger || 'signature',
    };

    const updatedSchedule = [...schedule, milestone];
    setSchedule(updatedSchedule);
    onScheduleChange(updatedSchedule);
    setNewMilestone({
      name: '',
      description: '',
      amount: 0,
      percentage: 0,
      dueDate: '',
      type: 'deposit',
      trigger: 'signature',
    });
    setShowAddForm(false);
  };

  const handleRemoveMilestone = (id: string) => {
    const updatedSchedule = schedule.filter(m => m.id !== id);
    setSchedule(updatedSchedule);
    onScheduleChange(updatedSchedule);
  };

  const handleQuickTemplate = (template: string) => {
    const templates: Record<string, PaymentMilestone[]> = {
      '50-50': [
        {
          id: 'deposit-1',
          name: 'Deposit',
          description: 'Initial deposit upon signature',
          amount: totalAmount * 0.5,
          percentage: 50,
          dueDate: '',
          type: 'deposit',
          trigger: 'signature',
        },
        {
          id: 'final-1',
          name: 'Final Payment',
          description: 'Balance upon completion',
          amount: totalAmount * 0.5,
          percentage: 50,
          dueDate: '',
          type: 'final',
          trigger: 'completion',
        },
      ],
      '30-30-40': [
        {
          id: 'deposit-2',
          name: 'Deposit',
          description: 'Initial deposit upon signature',
          amount: totalAmount * 0.3,
          percentage: 30,
          dueDate: '',
          type: 'deposit',
          trigger: 'signature',
        },
        {
          id: 'milestone-2',
          name: 'Mid-Point Payment',
          description: 'Payment at 50% completion',
          amount: totalAmount * 0.3,
          percentage: 30,
          dueDate: '',
          type: 'milestone',
          trigger: 'completion',
        },
        {
          id: 'final-2',
          name: 'Final Payment',
          description: 'Balance upon completion',
          amount: totalAmount * 0.4,
          percentage: 40,
          dueDate: '',
          type: 'final',
          trigger: 'completion',
        },
      ],
      '25-25-25-25': [
        {
          id: 'deposit-3',
          name: 'Deposit',
          description: 'Initial deposit upon signature',
          amount: totalAmount * 0.25,
          percentage: 25,
          dueDate: '',
          type: 'deposit',
          trigger: 'signature',
        },
        {
          id: 'milestone-3a',
          name: 'Progress Payment 1',
          description: 'Payment at 33% completion',
          amount: totalAmount * 0.25,
          percentage: 25,
          dueDate: '',
          type: 'milestone',
          trigger: 'completion',
        },
        {
          id: 'milestone-3b',
          name: 'Progress Payment 2',
          description: 'Payment at 66% completion',
          amount: totalAmount * 0.25,
          percentage: 25,
          dueDate: '',
          type: 'milestone',
          trigger: 'completion',
        },
        {
          id: 'final-3',
          name: 'Final Payment',
          description: 'Balance upon completion',
          amount: totalAmount * 0.25,
          percentage: 25,
          dueDate: '',
          type: 'final',
          trigger: 'completion',
        },
      ],
    };

    const selectedTemplate = templates[template];
    if (selectedTemplate) {
      setSchedule(selectedTemplate);
      onScheduleChange(selectedTemplate);
    }
  };

  const totalScheduled = schedule.reduce((sum, m) => sum + m.amount, 0);
  const remaining = totalAmount - totalScheduled;

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
          <Calendar className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Deposits & Payment Schedule</h3>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={Plus}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          Add Payment
        </Button>
      </div>

      {/* Quick Templates */}
      {schedule.length === 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Quick Templates:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickTemplate('50-50')}
              className="p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
            >
              <p className="text-sm font-medium text-gray-900">50/50 Split</p>
              <p className="text-xs text-gray-500">Deposit + Final</p>
            </button>
            <button
              onClick={() => handleQuickTemplate('30-30-40')}
              className="p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
            >
              <p className="text-sm font-medium text-gray-900">30/30/40</p>
              <p className="text-xs text-gray-500">Deposit + Mid + Final</p>
            </button>
            <button
              onClick={() => handleQuickTemplate('25-25-25-25')}
              className="p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
            >
              <p className="text-sm font-medium text-gray-900">25/25/25/25</p>
              <p className="text-xs text-gray-500">4 Equal Payments</p>
            </button>
          </div>
        </div>
      )}

      {/* Add Milestone Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3"
        >
          <Input
            label="Payment Name"
            value={newMilestone.name || ''}
            onChange={(e) => setNewMilestone({ ...newMilestone, name: e.target.value })}
            placeholder="e.g., Deposit, Progress Payment"
          />
          <Input
            label="Description"
            value={newMilestone.description || ''}
            onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
            placeholder="When is this payment due?"
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Type"
              options={[
                { value: 'deposit', label: 'Deposit' },
                { value: 'milestone', label: 'Milestone' },
                { value: 'final', label: 'Final Payment' },
              ]}
              value={newMilestone.type || 'deposit'}
              onChange={(value) => setNewMilestone({ ...newMilestone, type: value as any })}
            />
            <Select
              label="Trigger"
              options={[
                { value: 'signature', label: 'Upon Signature' },
                { value: 'completion', label: 'Upon Completion' },
                { value: 'date', label: 'Specific Date' },
              ]}
              value={newMilestone.trigger || 'signature'}
              onChange={(value) => setNewMilestone({ ...newMilestone, trigger: value as any })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Amount"
              type="number"
              value={newMilestone.amount || 0}
              onChange={(e) => {
                const amount = parseFloat(e.target.value) || 0;
                setNewMilestone({
                  ...newMilestone,
                  amount,
                  percentage: totalAmount > 0 ? (amount / totalAmount * 100) : 0,
                });
              }}
              placeholder="0.00"
            />
            <Input
              label="Percentage"
              type="number"
              value={newMilestone.percentage || 0}
              onChange={(e) => {
                const percentage = parseFloat(e.target.value) || 0;
                setNewMilestone({
                  ...newMilestone,
                  percentage,
                  amount: totalAmount * (percentage / 100),
                });
              }}
              placeholder="0"
            />
          </div>
          {newMilestone.trigger === 'date' && (
            <Input
              label="Due Date"
              type="date"
              value={newMilestone.dueDate || ''}
              onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
            />
          )}
          <div className="flex gap-2">
            <Button onClick={handleAddMilestone} size="sm">Add Payment</Button>
            <Button variant="ghost" onClick={() => setShowAddForm(false)} size="sm">Cancel</Button>
          </div>
        </motion.div>
      )}

      {/* Schedule List */}
      {schedule.length > 0 && (
        <div className="space-y-3 mb-4">
          {schedule.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">{milestone.name}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      milestone.type === 'deposit' ? 'bg-blue-100 text-blue-700' :
                      milestone.type === 'final' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {milestone.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{milestone.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {milestone.trigger === 'signature' ? 'Upon Signature' :
                       milestone.trigger === 'completion' ? 'Upon Completion' :
                       milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : 'Date TBD'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      {milestone.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(milestone.amount)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMilestone(milestone.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Summary */}
      {schedule.length > 0 && (
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Scheduled:</span>
            <span className="font-semibold text-gray-900">{formatCurrency(totalScheduled)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Remaining:</span>
            <span className={`font-semibold ${remaining > 0 ? 'text-orange-600' : remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatCurrency(remaining)}
            </span>
          </div>
          {remaining !== 0 && (
            <p className="text-xs text-orange-600">
              {remaining > 0 ? 'Payment schedule does not cover full amount' : 'Payment schedule exceeds total amount'}
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default PaymentSchedule;


