import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  DollarSign,
  Camera,
  FileText,
  Package,
  History,
  Receipt,
  Edit,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  Pen
} from 'lucide-react';
import { Job, Material, Activity } from '@/types';
import { mockTechnicians, calculateJobProfitability } from '@/mocks/jobs';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import PhotoUpload from '../ui/PhotoUpload';
import SignaturePad from '../ui/SignaturePad';
import QuickActions from './QuickActions';
import { formatDistanceToNow } from 'date-fns';
import { useJobActivities } from '@/services/jobQueries';
import { useGenerateInvoiceFromJob } from '@/services/invoiceQueries';
import { useNavigate } from 'react-router-dom';

interface JobDetailDrawerProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onJobUpdate?: (jobId: string, updates: Partial<Job>) => void;
  onDelete?: (jobId: string) => void;
  activities?: Activity[];
  className?: string;
}

const JobDetailDrawer: React.FC<JobDetailDrawerProps> = ({
  job,
  isOpen,
  onClose,
  onEdit,
  onJobUpdate,
  onDelete,
  activities: propActivities = [],
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'photos' | 'materials' | 'timeline' | 'invoice' | 'signature'>('overview');
  const [jobPhotos, setJobPhotos] = useState<string[]>(job.photos);
  const [jobSignature, setJobSignature] = useState<string | null>(job.signature || null);
  const [showGenerateInvoiceModal, setShowGenerateInvoiceModal] = useState(false);
  const navigate = useNavigate();

  // Fetch activities from API
  const { data: apiActivities = [], isLoading: activitiesLoading } = useJobActivities(job.id);
  
  // Invoice generation mutation
  const generateInvoiceMutation = useGenerateInvoiceFromJob();
  
  // Use API activities if available, otherwise fall back to prop
  const activities = apiActivities.length > 0 ? apiActivities : propActivities;

  const getTechnician = () => {
    return mockTechnicians.find(tech => tech.id === job.assignedTechnician);
  };

  const technician = getTechnician();
  
  // Calculate profitability from actual job data
  const profitability = useMemo(() => {
    const materialCost = job.materialCost || 0;
    const laborCost = job.laborCost || 0;
    const totalCost = job.actualCost || materialCost + laborCost;
    
    // Get quote total if available
    const quoteTotal = (job as any).quote?.total || 0;
    const profit = quoteTotal > 0 ? quoteTotal - totalCost : 0;
    const profitMargin = quoteTotal > 0 ? (profit / quoteTotal) * 100 : 0;
    
    return {
      materialCost,
      laborCost,
      totalCost,
      quoteTotal,
      profit,
      profitMargin: job.profitMargin || profitMargin,
    };
  }, [job]);

  const getStatusIcon = (status: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      scheduled: PlayCircle,
      in_progress: PauseCircle,
      completed: CheckCircle,
      cancelled: AlertCircle,
    };
    return iconMap[status] || PlayCircle;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colorMap: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colorMap[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = () => {
    if (job.status === 'completed') return 100;
    if (job.status === 'in_progress') {
      const elapsed = job.actualDuration || 0;
      const total = job.estimatedDuration;
      return Math.min((elapsed / total) * 100, 90);
    }
    return 0;
  };

  const progressPercentage = getProgressPercentage();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'photos', label: 'Photos', icon: Camera },
    { id: 'materials', label: 'Materials', icon: Package },
    { id: 'timeline', label: 'Timeline', icon: History },
    { id: 'signature', label: 'Signature', icon: Pen },
    { id: 'invoice', label: 'Invoice', icon: Receipt },
  ];

  const handleJobUpdate = (jobId: string, updates: Partial<Job>) => {
    if (onJobUpdate) {
      onJobUpdate(jobId, updates);
    }
    // Update local state
    if (updates.photos) setJobPhotos(updates.photos);
    if (updates.signature !== undefined) setJobSignature(updates.signature);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-large border-l border-gray-200 z-50 flex flex-col ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3F0FF' }}>
              <span className="font-bold text-lg" style={{ color: '#8552C5' }}>
                {job.title.split(' ').map(word => word[0]).join('').toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
              <p className="text-sm text-gray-500">{job.client.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Edit}
              onClick={onEdit}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              style={activeTab === tab.id ? { backgroundColor: '#F3F0FF' } : {}}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Status & Priority */}
              <div className="flex items-center space-x-4">
                <Badge className={getStatusColor(job.status)}>
                  {job.status.replace('_', ' ').charAt(0).toUpperCase() + job.status.slice(1).replace('_', ' ')}
                </Badge>
                <Badge className={getPriorityColor(job.priority)}>
                  {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
                </Badge>
              </div>

              {/* Client Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{job.client.name}</p>
                    <p className="text-sm text-gray-600">{job.client.email}</p>
                    <p className="text-sm text-gray-600">{job.client.phone}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location.address}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Assigned Technician */}
              {technician && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Technician</h3>
                  <div className="flex items-center space-x-3">
                    <img
                      src={technician.avatar}
                      alt={`${technician.firstName} ${technician.lastName}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {technician.firstName} {technician.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{technician.email}</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Progress */}
              {job.status === 'in_progress' && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Completion</span>
                      <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-300"
                        style={{ backgroundColor: '#8552C5' }}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>
                        {job.actualDuration || 0}h / {job.estimatedDuration}h
                      </span>
                      <span>
                        {job.estimatedDuration - (job.actualDuration || 0)}h remaining
                      </span>
                    </div>
                  </div>
                </Card>
              )}

              {/* Profitability */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profitability</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Material Cost</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(profitability.materialCost)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Labor Cost</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(profitability.laborCost)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Cost</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(profitability.totalCost)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Profit Margin</p>
                    <p className="text-lg font-semibold text-green-600">
                      {typeof profitability.profitMargin === 'number' ? profitability.profitMargin.toFixed(1) : '0.0'}%
                    </p>
                  </div>
                </div>
              </Card>

              {/* Notes */}
              {job.notes && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{job.notes}</p>
                </Card>
              )}

              {/* Quick Actions for Field Technicians */}
              {(job.status === 'scheduled' || job.status === 'in_progress') && onJobUpdate && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <QuickActions
                    job={{ ...job, photos: jobPhotos, signature: jobSignature }}
                    onJobUpdate={handleJobUpdate}
                  />
                </Card>
              )}
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Job Photos</h3>
              <PhotoUpload
                photos={jobPhotos}
                onPhotosChange={(photos) => {
                  setJobPhotos(photos);
                  // In real app, update job via API
                  console.log('Photos updated:', photos);
                }}
                maxPhotos={20}
              />
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Materials Used</h3>
                <Button variant="primary" size="sm" icon={Package}>
                  Add Material
                </Button>
              </div>

              {job.materials.length > 0 ? (
                <div className="space-y-4">
                  {job.materials.map((material) => (
                    <Card key={material.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{material.name}</h4>
                          <p className="text-sm text-gray-600">{material.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {formatCurrency(material.totalPrice)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {material.quantity} × {formatCurrency(material.unitPrice)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No materials added</h4>
                  <p className="text-gray-500 mb-4">Track materials used for this job</p>
                  <Button variant="primary" icon={Package}>
                    Add First Material
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Timeline</h3>
              
              {activitiesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading activities...</p>
                </div>
              ) : activities.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {activities.map((activity: any) => {
                    const activityUser = activity.user || activity.user_id;
                    const userName = activityUser 
                      ? (activityUser.first_name && activityUser.last_name 
                          ? `${activityUser.first_name} ${activityUser.last_name}`
                          : activityUser.name || activityUser.email || 'System')
                      : 'System';
                    
                    return (
                      <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary-600 mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                            <span>{userName}</span>
                            <span>•</span>
                            <span>
                              {formatDistanceToNow(new Date(activity.created_at || activity.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                            <div className="mt-2 text-xs text-gray-400">
                              {activity.type === 'status_changed' && activity.metadata.old_status && activity.metadata.new_status && (
                                <span>Changed from <strong>{activity.metadata.old_status}</strong> to <strong>{activity.metadata.new_status}</strong></span>
                              )}
                              {activity.type === 'assigned' && activity.metadata.new_assigned_technician && (
                                <span>Assigned to technician</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h4>
                  <p className="text-gray-500">Job activities will appear here</p>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'signature' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Client Signature</h3>
              <SignaturePad
                signature={jobSignature}
                onSignatureChange={(signature) => {
                  setJobSignature(signature);
                  // In real app, update job via API
                  console.log('Signature updated:', signature ? 'Captured' : 'Cleared');
                }}
              />
              {jobSignature && (
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Job Signed</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(), { addSuffix: true })}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'invoice' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Invoice Information</h3>
              
              {(job as any).invoice ? (
                <>
                  <Card className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Invoice Status</span>
                        <Badge className="bg-green-100 text-green-800">Generated</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Invoice Number</span>
                        <span className="text-sm font-medium">
                          {(job as any).invoice.id ? `INV-${(job as any).invoice.id.substring(0, 8).toUpperCase()}` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Amount</span>
                        <span className="text-lg font-semibold">
                          {formatCurrency((job as any).invoice.total || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Payment Status</span>
                        <Badge className={
                          (job as any).invoice.status === 'paid' 
                            ? 'bg-green-100 text-green-800'
                            : (job as any).invoice.status === 'overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }>
                          {(job as any).invoice.status?.charAt(0).toUpperCase() + (job as any).invoice.status?.slice(1) || 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  </Card>

                  <div className="flex space-x-3">
                    <Button 
                      variant="primary" 
                      className="flex-1"
                      onClick={() => {
                        if ((job as any).invoice?.id) {
                          navigate(`/invoices`);
                          onClose();
                        }
                      }}
                    >
                      View Invoice
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="flex-1"
                      onClick={() => {
                        if ((job as any).invoice?.id) {
                          navigate(`/invoices`);
                          onClose();
                        }
                      }}
                    >
                      Manage Invoice
                    </Button>
                  </div>
                </>
              ) : (
                <Card className="p-6">
                  <div className="text-center py-8">
                    <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Invoice Generated</h4>
                    <p className="text-gray-500 mb-6">
                      {job.status === 'completed' 
                        ? 'Generate an invoice from this completed job'
                        : 'Complete the job first to generate an invoice'}
                    </p>
                    {job.status === 'completed' && (
                      <Button 
                        variant="primary" 
                        icon={Receipt}
                        onClick={async () => {
                          try {
                            const dueDate = new Date();
                            dueDate.setDate(dueDate.getDate() + 30);
                            
                            const result = await generateInvoiceMutation.mutateAsync({
                              jobId: job.id,
                              data: {
                                due_date: dueDate.toISOString().split('T')[0],
                                notes: `Invoice generated from job: ${job.title}`,
                              },
                            });
                            
                            // Navigate to invoices page
                            navigate('/invoices');
                            onClose();
                          } catch (error) {
                            // Error handled by mutation
                          }
                        }}
                        loading={generateInvoiceMutation.isPending}
                        disabled={generateInvoiceMutation.isPending}
                      >
                        Generate Invoice from Job
                      </Button>
                    )}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Created {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
            </div>
            <div className="flex items-center space-x-4">
              {jobPhotos.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-blue-600">
                  <Camera className="w-4 h-4" />
                  <span>{jobPhotos.length} photo{jobPhotos.length !== 1 ? 's' : ''}</span>
                </div>
              )}
              {jobSignature && (
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Job Signed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JobDetailDrawer;
