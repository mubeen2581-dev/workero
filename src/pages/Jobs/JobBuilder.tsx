import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Plus,
  User,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  FileText,
  Package
} from 'lucide-react';
import { Job, Client } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { useClients } from '@/services/clientQueries';
import { useQuotes } from '@/services/quoteQueries';
import { useJob, useCreateJob, useUpdateJob } from '@/services/jobQueries';
import { CreateJobRequest, UpdateJobRequest } from '@/services/jobs';

const JobBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { id: jobId } = useParams<{ id?: string }>();
  const isEditMode = !!jobId;

  // Form state
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'scheduled' | 'in_progress' | 'completed' | 'cancelled'>('scheduled');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [estimatedDuration, setEstimatedDuration] = useState<number>(0);
  const [assignedTechnician, setAssignedTechnician] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState<{ address?: string; coordinates?: { lat: number; lng: number } }>({});

  // Fetch data
  const { data: clientsData = [], isLoading: clientsLoading } = useClients();
  const { data: quotesData = [] } = useQuotes({ status: 'accepted' }); // Only show accepted quotes
  const { data: existingJob, isLoading: jobLoading } = useJob(jobId);
  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();

  // Load existing job data when editing
  useEffect(() => {
    if (existingJob && jobId) {
      // Normalize job data - handle both API response format and normalized format
      const job = existingJob as any;
      
      // Set client - handle both formats
      if (job.client) {
        // If client is already normalized
        if (job.client.name) {
          setSelectedClient(job.client);
        } else {
          // If client is in API format, normalize it
          setSelectedClient({
            id: job.client.id,
            name: job.client.name || `${job.client.first_name || ''} ${job.client.last_name || ''}`.trim() || 'Unknown Client',
            email: job.client.email || '',
            phone: job.client.phone || '',
            address: job.client.address || { street: '', city: '', state: '', zipCode: '', country: '' },
            tags: job.client.tags || [],
            leadScore: job.client.lead_score || 0,
            createdAt: job.client.created_at || job.client.createdAt || '',
            updatedAt: job.client.updated_at || job.client.updatedAt || '',
          });
        }
      }
      
      // Set quote
      if (job.quote_id || job.quoteId) {
        setSelectedQuoteId(job.quote_id || job.quoteId);
      }
      
      // Set basic fields
      setTitle(job.title || '');
      setDescription(job.description || '');
      setStatus((job.status || 'scheduled') as any);
      setPriority((job.priority || 'medium') as any);
      setEstimatedDuration(parseFloat(job.estimated_duration || job.estimatedDuration || '0'));
      setAssignedTechnician(job.assigned_technician || job.assignedTechnician || '');
      setNotes(job.notes || '');
      
      // Set scheduled date/time
      if (job.scheduled_date || job.scheduledDate) {
        const scheduledDateObj = new Date(job.scheduled_date || job.scheduledDate);
        setScheduledDate(scheduledDateObj.toISOString().split('T')[0]);
        setScheduledTime(scheduledDateObj.toTimeString().slice(0, 5));
      }
      
      // Set location
      if (job.location) {
        setLocation(job.location);
      }
    }
  }, [existingJob, jobId]);

  // Client options
  const clientOptions = useMemo(() => {
    return clientsData.map(client => ({
      value: client.id,
      label: `${client.name} (${client.email})`,
    }));
  }, [clientsData]);

  // Quote options
  const quoteOptions = useMemo(() => {
    const options = [{ value: '', label: 'No quote (create manually)' }];
    const filteredQuotes = quotesData.filter(quote => {
      if (!selectedClient) return true;
      return (quote.clientId || quote.client?.id) === selectedClient.id;
    });
    
    return [
      ...options,
      ...filteredQuotes.map(quote => {
        // Parse total as number, handling both string and number formats
        let total = 0;
        if (typeof quote.total === 'number') {
          total = quote.total;
        } else if (quote.total) {
          total = parseFloat(quote.total) || 0;
        } else if (quote.total_amount) {
          total = typeof quote.total_amount === 'number' 
            ? quote.total_amount 
            : parseFloat(quote.total_amount) || 0;
        }
        
        return {
          value: quote.id,
          label: `Quote #${quote.id.substring(0, 8)} - £${total.toFixed(2)}`,
        };
      }),
    ];
  }, [quotesData, selectedClient]);

  // Priority options
  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  // Status options (only for edit mode)
  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  // Handle client selection
  const handleClientChange = (clientId: string) => {
    const client = clientsData.find(c => c.id === clientId);
    setSelectedClient(client || null);
    
    // Auto-populate location from client address
    if (client && client.address) {
      const addressString = `${client.address.street}, ${client.address.city}, ${client.address.state} ${client.address.zipCode}`;
      setLocation({ address: addressString });
    }
    
    // Reset quote selection when client changes
    setSelectedQuoteId('');
  };

  // Handle quote selection
  const handleQuoteChange = (quoteId: string) => {
    setSelectedQuoteId(quoteId);
    
    if (quoteId) {
      const quote = quotesData.find(q => q.id === quoteId);
      if (quote) {
        // Auto-populate job details from quote
        setTitle(quote.items?.[0]?.description || `Job from Quote #${quote.id.substring(0, 8)}`);
        setDescription(quote.notes || 'Job created from accepted quote');
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!selectedClient) {
      alert('Please select a client');
      return;
    }

    if (!title.trim()) {
      alert('Please enter a job title');
      return;
    }

    if (!description.trim()) {
      alert('Please enter a job description');
      return;
    }

    if (!scheduledDate) {
      alert('Please select a scheduled date');
      return;
    }

    // Combine date and time
    const scheduledDateTime = scheduledTime
      ? `${scheduledDate}T${scheduledTime}:00`
      : `${scheduledDate}T09:00:00`;

    try {
      if (isEditMode && jobId) {
        // Update existing job
        const updateData: UpdateJobRequest = {
          title,
          description,
          status,
          priority,
          estimated_duration: estimatedDuration || undefined,
          assigned_technician: assignedTechnician || undefined,
          scheduled_date: scheduledDateTime,
          location: Object.keys(location).length > 0 ? location : undefined,
          notes: notes || undefined,
        };

        await updateJobMutation.mutateAsync({ id: jobId, data: updateData });
        navigate('/jobs');
      } else {
        // Create new job
        const createData: CreateJobRequest = {
          client_id: selectedClient.id,
          quote_id: selectedQuoteId || undefined,
          title,
          description,
          status,
          priority,
          estimated_duration: estimatedDuration || undefined,
          assigned_technician: assignedTechnician || undefined,
          scheduled_date: scheduledDateTime,
          location: Object.keys(location).length > 0 ? location : undefined,
          notes: notes || undefined,
        };

        await createJobMutation.mutateAsync(createData);
        navigate('/jobs');
      }
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isEditMode && jobLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              icon={ArrowLeft}
              onClick={() => navigate('/jobs')}
            >
              Back
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {isEditMode ? 'Edit Job' : 'Create New Job'}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {isEditMode ? 'Update job details and information' : 'Fill in the details to create a new job'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Client Selection */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary-600" />
              Client Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Select Client"
                options={clientOptions}
                placeholder={clientsLoading ? "Loading clients..." : "Choose a client"}
                value={selectedClient?.id || ''}
                onChange={handleClientChange}
                disabled={clientsLoading || isEditMode}
                required
              />
              
              {selectedClient && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{selectedClient.name}</p>
                  <p className="text-sm text-gray-600">{selectedClient.email}</p>
                  <p className="text-sm text-gray-600">{selectedClient.phone}</p>
                  {selectedClient.address && (
                    <p className="text-sm text-gray-600 mt-2">
                      {selectedClient.address.street} {selectedClient.address.city} {selectedClient.address.state} {selectedClient.address.zipCode}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Quote Selection (Optional) */}
          {selectedClient && (
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary-600" />
                Related Quote (Optional)
              </h3>
              
              <Select
                label="Select Quote"
                options={quoteOptions}
                placeholder="Choose a quote (optional)"
                value={selectedQuoteId}
                onChange={handleQuoteChange}
                disabled={isEditMode}
              />
              
              {selectedQuoteId && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    Job will be linked to the selected quote
                  </p>
                </div>
              )}
            </Card>
          )}

          {/* Job Details */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary-600" />
              Job Details
            </h3>
            
            <div className="space-y-4">
              <Input
                label="Job Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Plumbing Repair - Kitchen Sink"
                required
              />
              
              <Textarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the work to be performed..."
                rows={4}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Priority"
                  options={priorityOptions}
                  value={priority}
                  onChange={(value) => setPriority(value as any)}
                  required
                />
                
                {isEditMode && (
                  <Select
                    label="Status"
                    options={statusOptions}
                    value={status}
                    onChange={(value) => setStatus(value as any)}
                  />
                )}
              </div>
            </div>
          </Card>

          {/* Scheduling */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary-600" />
              Scheduling
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Scheduled Date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
              />
              
              <Input
                label="Scheduled Time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
              
              <Input
                label="Estimated Duration (hours)"
                type="number"
                min="0"
                step="0.5"
                value={estimatedDuration || ''}
                onChange={(e) => setEstimatedDuration(parseFloat(e.target.value) || 0)}
                placeholder="e.g., 2.5"
              />
              
              <Input
                label="Assigned Technician (ID)"
                value={assignedTechnician}
                onChange={(e) => setAssignedTechnician(e.target.value)}
                placeholder="Enter technician ID"
              />
            </div>
          </Card>

          {/* Location */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary-600" />
              Location
            </h3>
            
            <Textarea
              label="Job Location"
              value={location.address || ''}
              onChange={(e) => setLocation({ ...location, address: e.target.value })}
              placeholder="Enter job location or address"
              rows={2}
            />
          </Card>

          {/* Additional Notes */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary-600" />
              Additional Notes
            </h3>
            
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes or instructions..."
              rows={4}
            />
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/jobs')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Save}
              disabled={createJobMutation.isPending || updateJobMutation.isPending}
            >
              {createJobMutation.isPending || updateJobMutation.isPending
                ? 'Saving...'
                : isEditMode
                ? 'Update Job'
                : 'Create Job'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobBuilder;

