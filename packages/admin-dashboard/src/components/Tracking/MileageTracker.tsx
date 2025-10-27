import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';
import { Car, DollarSign, Calendar, TrendingUp, Download, Filter, MapPin } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface MileageEntry {
  id: string;
  technicianId: string;
  technicianName: string;
  date: Date;
  startLocation: string;
  endLocation: string;
  distance: number;
  purpose: 'job' | 'warehouse' | 'office' | 'personal';
  isReimbursable: boolean;
  rate: number;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
}

interface MileageTrackerProps {
  technicianId?: string;
  className?: string;
}

const MileageTracker: React.FC<MileageTrackerProps> = ({
  technicianId,
  className = '',
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showExport, setShowExport] = useState(false);

  // Mock mileage data
  const mileageEntries = useMemo<MileageEntry[]>(() => {
    const entries: MileageEntry[] = [];
    const technicians = [
      { id: 'tech-1', name: 'Mike Smith' },
      { id: 'tech-2', name: 'Sarah Johnson' },
      { id: 'tech-3', name: 'David Wilson' },
    ];

    technicians.forEach((tech) => {
      for (let i = 0; i < 15; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const distance = 5 + Math.random() * 45;
        const rate = 0.65; // IRS standard rate
        const purposes = ['job', 'warehouse', 'office', 'personal'] as const;
        const purpose = purposes[Math.floor(Math.random() * purposes.length)];
        const isReimbursable = purpose !== 'personal';
        
        entries.push({
          id: `mileage-${tech.id}-${i}`,
          technicianId: tech.id,
          technicianName: tech.name,
          date,
          startLocation: i % 3 === 0 ? 'Home' : 'Previous Job Site',
          endLocation: purpose === 'job' ? `Job Site ${i + 1}` : 
                      purpose === 'warehouse' ? 'Main Warehouse' :
                      purpose === 'office' ? 'Office' : 'Personal',
          distance: Math.round(distance * 10) / 10,
          purpose,
          isReimbursable,
          rate,
          amount: isReimbursable ? Math.round(distance * rate * 100) / 100 : 0,
          status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)] as any,
        });
      }
    });

    return entries.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, []);

  // Filter entries
  const filteredEntries = useMemo(() => {
    let filtered = mileageEntries;
    
    if (technicianId) {
      filtered = filtered.filter(entry => entry.technicianId === technicianId);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(entry => entry.status === statusFilter);
    }

    // Filter by period
    const now = new Date();
    const periodStart = new Date();
    switch (selectedPeriod) {
      case 'week':
        periodStart.setDate(now.getDate() - 7);
        break;
      case 'month':
        periodStart.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        periodStart.setMonth(now.getMonth() - 3);
        break;
    }
    
    return filtered.filter(entry => entry.date >= periodStart);
  }, [mileageEntries, technicianId, statusFilter, selectedPeriod]);

  // Calculate totals
  const totals = useMemo(() => {
    const reimbursableEntries = filteredEntries.filter(e => e.isReimbursable);
    return {
      totalMiles: filteredEntries.reduce((sum, entry) => sum + entry.distance, 0),
      reimbursableMiles: reimbursableEntries.reduce((sum, entry) => sum + entry.distance, 0),
      totalAmount: reimbursableEntries.reduce((sum, entry) => sum + entry.amount, 0),
      pendingAmount: reimbursableEntries
        .filter(e => e.status === 'pending')
        .reduce((sum, entry) => sum + entry.amount, 0),
    };
  }, [filteredEntries]);

  // Chart data
  const chartData = useMemo(() => {
    const dailyData = new Map<string, { date: string; miles: number; amount: number }>();
    
    filteredEntries.forEach(entry => {
      const dateKey = entry.date.toISOString().split('T')[0];
      const existing = dailyData.get(dateKey) || { date: dateKey, miles: 0, amount: 0 };
      existing.miles += entry.distance;
      existing.amount += entry.amount;
      dailyData.set(dateKey, existing);
    });

    return Array.from(dailyData.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14); // Last 14 days
  }, [filteredEntries]);

  const getPurposeColor = (purpose: string) => {
    switch (purpose) {
      case 'job': return 'bg-blue-100 text-blue-800';
      case 'warehouse': return 'bg-green-100 text-green-800';
      case 'office': return 'bg-purple-100 text-purple-800';
      case 'personal': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExport = () => {
    // Mock export functionality
    const csvContent = [
      'Date,Technician,Start,End,Distance,Purpose,Amount,Status',
      ...filteredEntries.map(entry => 
        `${entry.date.toLocaleDateString()},${entry.technicianName},"${entry.startLocation}","${entry.endLocation}",${entry.distance},${entry.purpose},${entry.amount},${entry.status}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mileage-report-${selectedPeriod}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <Car className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Mileage Tracker</h3>
              <p className="text-sm text-gray-600">Track and manage travel expenses</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
            </select>
            <Button
              variant="secondary"
              onClick={handleExport}
              icon={Download}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Miles</p>
              <p className="text-xl font-bold text-gray-900">{totals.totalMiles.toFixed(1)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Car className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Reimbursable</p>
              <p className="text-xl font-bold text-gray-900">{totals.reimbursableMiles.toFixed(1)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-gray-900">£{totals.totalAmount.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-bold text-gray-900">£{totals.pendingAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Mileage Chart */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Daily Mileage</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number, name: string) => [
                  name === 'miles' ? `${value.toFixed(1)} miles` : `£${value.toFixed(2)}`,
                  name === 'miles' ? 'Miles' : 'Amount'
                ]}
              />
              <Bar dataKey="miles" fill="#3B82F6" name="miles" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Amount Trend */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Reimbursement Trend</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number) => [`£${value.toFixed(2)}`, 'Amount']}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Mileage Entries */}
      <Card className="p-0">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">Recent Entries</h4>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Technician</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Route</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Distance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Purpose</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEntries.slice(0, 20).map((entry, index) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {entry.date.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {entry.technicianName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="max-w-xs truncate">
                      {entry.startLocation} → {entry.endLocation}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {entry.distance.toFixed(1)} mi
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`text-xs ${getPurposeColor(entry.purpose)}`}>
                      {entry.purpose}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {entry.isReimbursable ? `£${entry.amount.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`text-xs ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default MileageTracker;