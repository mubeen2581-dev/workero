import React from 'react';
import { DollarSign, TrendingDown, CreditCard, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Card from '@/components/ui/Card';

interface SummaryPanelProps {
  className?: string;
}

const items = [
  {
    id: 'total-income',
    label: 'Total Income',
    value: '£1,944,393.00',
    icon: DollarSign,
    badgeClass: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'total-expense',
    label: 'Total Expense',
    value: '£971,200.00',
    icon: TrendingDown,
    badgeClass: 'bg-rose-100 text-rose-700',
  },
  {
    id: 'income-today',
    label: 'Income Today',
    value: '£5,400.00',
    icon: CreditCard,
    badgeClass: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'expense-today',
    label: 'Expense Today',
    value: '£0.00',
    icon: ArrowDownRight,
    badgeClass: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'income-month',
    label: 'Income This Month',
    value: '£140,600.00',
    icon: ArrowUpRight,
    badgeClass: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 'expense-month',
    label: 'Expense This Month',
    value: '£72,000.00',
    icon: ArrowDownRight,
    badgeClass: 'bg-rose-100 text-rose-700',
  },
];

const SummaryPanel: React.FC<SummaryPanelProps> = ({ className = '' }) => {
  return (
    <Card className={`p-0 overflow-hidden ${className}`}>
      <div className="p-4 sm:p-5 border-b border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Summary</h3>
      </div>

      <div className="bg-gray-900 text-white m-4 rounded-2xl p-4 sm:p-6">
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${item.badgeClass} shrink-0`}>
                <item.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm sm:text-base">{item.value}</div>
                <div className="text-gray-300 text-xs sm:text-sm">{item.label}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default SummaryPanel;


