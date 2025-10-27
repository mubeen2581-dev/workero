import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, Clock, AlertTriangle, CheckCircle, RotateCcw, Zap } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface WorkloadData {
  technicianId: string;
  name: string;
  currentHours: number;
  maxCapacity: number;
  efficiency: number;
  jobsCount: number;
  skills: string[];
  location: string;
  utilization: number;
}

interface OptimizationSuggestion {
  id: string;
  type: 'redistribute' | 'reschedule' | 'overtime' | 'hire';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'easy' | 'moderate' | 'complex';
  savings: number;
}

interface WorkloadOptimizerProps {
  className?: string;
}

const WorkloadOptimizer: React.FC<WorkloadOptimizerProps> = ({ className = '' }) => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');
  const [autoOptimize, setAutoOptimize] = useState(false);

  const workloadData: WorkloadData[] = useMemo(() => [
    {
      technicianId: 'tech-1',
      name: 'Mike Smith',
      currentHours: 7.5,
      maxCapacity: 8,
      efficiency: 92,
      jobsCount: 4,
      skills: ['HVAC', 'Electrical'],
      location: 'North',
      utilization: 94,
    },
    {
      technicianId: 'tech-2',
      name: 'Sarah Johnson',
      currentHours: 5.5,
      maxCapacity: 8,
      efficiency: 88,
      jobsCount: 3,
      skills: ['Plumbing', 'General'],
      location: 'South',
      utilization: 69,
    },
    {
      technicianId: 'tech-3',
      name: 'David Wilson',
      currentHours: 8.5,
      maxCapacity: 8,
      efficiency: 85,
      jobsCount: 5,
      skills: ['Electrical', 'HVAC'],
      location: 'East',
      utilization: 106,
    },
    {
      technicianId: 'tech-4',
      name: 'Lisa Brown',
      currentHours: 6,
      maxCapacity: 8,
      efficiency: 90,
      jobsCount: 3,
      skills: ['General', 'Plumbing'],
      location: 'West',
      utilization: 75,
    },
  ], []);

  const optimizationSuggestions: OptimizationSuggestion[] = useMemo(() => [
    {
      id: 'suggest-1',
      type: 'redistribute',
      title: 'Redistribute David\'s Overflow',
      description: 'Move 1 job from David Wilson to Sarah Johnson to balance workload',
      impact: 'high',
      effort: 'easy',
      savings: 2.5,
    },
    {
      id: 'suggest-2',
      type: 'reschedule',
      title: 'Optimize Travel Routes',
      description: 'Reschedule jobs to minimize travel time between locations',
      impact: 'medium',
      effort: 'moderate',
      savings: 1.8,
    },
    {
      id: 'suggest-3',
      type: 'overtime',
      title: 'Approve Strategic Overtime',
      description: 'Allow Mike Smith 1h overtime for high-priority client',
      impact: 'low',
      effort: 'easy',
      savings: 0.5,
    },
  ], []);

  const chartData = workloadData.map(tech => ({
    name: tech.name.split(' ')[0],
    current: tech.currentHours,
    capacity: tech.maxCapacity,
    utilization: tech.utilization,
  }));

  const utilizationData = [
    { name: 'Optimal (75-90%)', value: workloadData.filter(t => t.utilization >= 75 && t.utilization <= 90).length, color: '#10B981' },
    { name: 'Underutilized (<75%)', value: workloadData.filter(t => t.utilization < 75).length, color: '#F59E0B' },
    { name: 'Overloaded (>90%)', value: workloadData.filter(t => t.utilization > 90).length, color: '#EF4444' },
  ];

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 100) return 'text-red-600 bg-red-100';
    if (utilization > 90) return 'text-orange-600 bg-orange-100';
    if (utilization < 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'redistribute': return <Users className="w-4 h-4" />;
      case 'reschedule': return <Clock className="w-4 h-4" />;
      case 'overtime': return <TrendingUp className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const totalHours = workloadData.reduce((sum, tech) => sum + tech.currentHours, 0);
  const totalCapacity = workloadData.reduce((sum, tech) => sum + tech.maxCapacity, 0);
  const avgEfficiency = workloadData.reduce((sum, tech) => sum + tech.efficiency, 0) / workloadData.length;
  const overloadedTechs = workloadData.filter(tech => tech.utilization > 100).length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workload Optimization</h2>
          <p className="text-gray-600">Real-time workload balancing and efficiency insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <Button
            variant={autoOptimize ? 'primary' : 'secondary'}
            onClick={() => setAutoOptimize(!autoOptimize)}
            icon={RotateCcw}
          >
            Auto-Optimize
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Utilization</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round((totalHours / totalCapacity) * 100)}%</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Efficiency</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(avgEfficiency)}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overloaded</p>
              <p className="text-2xl font-bold text-red-600">{overloadedTechs}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Techs</p>
              <p className="text-2xl font-bold text-gray-900">{workloadData.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workload Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Workload Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="current" fill="#3B82F6" name="Current Hours" />
              <Bar dataKey="capacity" fill="#E5E7EB" name="Max Capacity" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Utilization Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilization Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={utilizationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {utilizationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {utilizationData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Technician Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Technician Workload Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Technician</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Hours</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Utilization</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Efficiency</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Jobs</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
              </tr>
            </thead>
            <tbody>
              {workloadData.map((tech) => (
                <tr key={tech.technicianId} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{tech.name}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tech.skills.map(skill => (
                          <span key={skill} className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <span className="font-medium">{tech.currentHours}</span>
                      <span className="text-gray-500">/{tech.maxCapacity}h</span>
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${
                          tech.utilization > 100 ? 'bg-red-500' : 
                          tech.utilization > 90 ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, tech.utilization)}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={`text-xs ${getUtilizationColor(tech.utilization)}`}>
                      {tech.utilization}%
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-gray-900">{tech.efficiency}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">{tech.jobsCount}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">{tech.location}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Optimization Suggestions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">AI Optimization Suggestions</h3>
          <Badge className="bg-purple-100 text-purple-800">
            {optimizationSuggestions.length} suggestions
          </Badge>
        </div>
        
        <div className="space-y-4">
          {optimizationSuggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <Badge className={`text-xs ${getImpactColor(suggestion.impact)}`}>
                        {suggestion.impact} impact
                      </Badge>
                      <span className="text-xs text-gray-500">{suggestion.effort} effort</span>
                      <span className="text-xs text-green-600 font-medium">
                        Save {suggestion.savings}h
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="primary" size="sm">
                  Apply
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default WorkloadOptimizer;