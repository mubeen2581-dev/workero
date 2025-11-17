import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartData } from '@/types';
import Card from '../ui/Card';

interface RevenueChartProps {
  data: ChartData[];
  className?: string;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, className = '' }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-medium border border-gray-200">
          <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
          <p className="text-sm text-primary-600">
            Revenue: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Revenue Trend
        </h3>
        <p className="text-sm text-gray-600">
          Monthly revenue performance over the last 12 months
        </p>
      </div>

      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8552C5"
              strokeWidth={3}
              dot={{ fill: '#8552C5', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#8552C5', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8552C5' }}></div>
          <span className="text-gray-600">Monthly Revenue</span>
        </div>
        <div className="text-right">
          <p className="text-gray-900 font-medium">
            {formatCurrency(data[data.length - 1]?.value || 0)}
          </p>
          <p className="text-success-600 text-xs">
            +12.5% from last month
          </p>
        </div>
      </div>
    </Card>
  );
};

export default RevenueChart;
