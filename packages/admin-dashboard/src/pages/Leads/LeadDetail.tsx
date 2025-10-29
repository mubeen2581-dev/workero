import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  User, 
  DollarSign,
  MessageCircle,
  Edit,
  MoreVertical,
  Star,
  Clock,
  TrendingUp,
  FileText,
  Camera
} from 'lucide-react';
import { Lead, Activity } from '@/types';
import { mockLeads, mockLeadActivities } from '@/mocks/leads';
import { getMessagesForLead } from '@/mocks/messages';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ChatPane from '@/components/Leads/ChatPane';
import { formatDistanceToNow } from 'date-fns';

const LeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'notes'>('overview');

  // Find the lead by ID
  const lead = mockLeads.find(l => l.id === id);
  const messages = lead ? getMessagesForLead(lead.id) : [];
  const activities = mockLeadActivities.filter(a => a.entityId === lead?.id);

  if (!lead) {
    return (
      <div className="p-6">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lead not found</h2>
          <p className="text-gray-600 mb-6">The lead you're looking for doesn't exist.</p>
          <Button variant="primary" onClick={() => navigate('/leads')}>
            Back to Leads
          </Button>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      quoted: 'bg-purple-100 text-purple-800',
      converted: 'bg-emerald-100 text-emerald-800',
      lost: 'bg-red-100 text-red-800',
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

  const getActivityIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      lead_created: '👤',
      quote_sent: '📄',
      job_scheduled: '📅',
      job_completed: '✅',
      invoice_sent: '🧾',
      payment_received: '💰',
    };
    return iconMap[type] || '📋';
  };

  const getActivityColor = (type: string) => {
    const colorMap: Record<string, string> = {
      lead_created: 'bg-blue-100 text-blue-600',
      quote_sent: 'bg-yellow-100 text-yellow-600',
      job_scheduled: 'bg-purple-100 text-purple-600',
      job_completed: 'bg-green-100 text-green-600',
      invoice_sent: 'bg-orange-100 text-orange-600',
      payment_received: 'bg-emerald-100 text-emerald-600',
    };
    return colorMap[type] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowLeft}
              onClick={() => navigate('/leads')}
            >
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{lead.client.name}</h1>
              <p className="text-gray-600">Lead Details & Communication</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              icon={MessageCircle}
              onClick={() => setShowChat(true)}
            >
              Message
            </Button>
            <Button variant="secondary" icon={Edit}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" icon={MoreVertical}>
              <span className="sr-only">More options</span>
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Client Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Client Card */}
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold text-xl">
                  {lead.client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{lead.client.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </Badge>
                  <Badge className={getPriorityColor(lead.priority)}>
                    {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{lead.client.email}</p>
                  <p className="text-xs text-gray-500">Email</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{lead.client.phone}</p>
                  <p className="text-xs text-gray-500">Phone</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {lead.client.address.street}
                  </p>
                  <p className="text-xs text-gray-500">
                    {lead.client.address.city}, {lead.client.address.state} {lead.client.address.zipCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {lead.client.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {lead.client.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Lead Score & Value */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Metrics</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Star className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Lead Score</p>
                    <p className="text-xs text-gray-500">Based on engagement</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">{lead.client.leadScore}</p>
                  <p className="text-xs text-green-600">+5 this week</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Estimated Value</p>
                    <p className="text-xs text-gray-500">Project value</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(lead.estimatedValue)}
                  </p>
                  <p className="text-xs text-gray-500">High value</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Response Time</p>
                    <p className="text-xs text-gray-500">Avg response</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">2.4h</p>
                  <p className="text-xs text-green-600">Fast response</p>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Suggestions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Suggestions</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Follow up recommended</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Last contact was 3 days ago. Send a follow-up message to maintain engagement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-xl">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-green-100 rounded-lg">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900">Ready for quote</p>
                    <p className="text-xs text-green-700 mt-1">
                      Lead shows high interest. Consider sending a detailed quote.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-purple-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-900">Schedule meeting</p>
                    <p className="text-xs text-purple-700 mt-1">
                      Suggest scheduling a site visit to discuss project details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Right Column - Activity & Notes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Tabs */}
          <Card className="p-6">
            <div className="flex space-x-1 mb-6">
              {[
                { id: 'overview', label: 'Overview', icon: FileText },
                { id: 'activity', label: 'Activity', icon: Clock },
                { id: 'notes', label: 'Notes', icon: Edit },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Source</p>
                      <p className="text-sm text-gray-900 capitalize">{lead.source.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Created</p>
                      <p className="text-sm text-gray-900">
                        {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Last Updated</p>
                      <p className="text-sm text-gray-900">
                        {formatDistanceToNow(new Date(lead.updatedAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Assigned To</p>
                      <p className="text-sm text-gray-900">
                        {lead.assignedTo ? 'Mike Smith' : 'Unassigned'}
                      </p>
                    </div>
                  </div>
                </div>

                {lead.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-700">{lead.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {activity.user.firstName} {activity.user.lastName}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Note</h3>
                <div className="space-y-4">
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Add a note about this lead..."
                  />
                  <div className="flex justify-end">
                    <Button variant="primary">Save Note</Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Chat Pane */}
      {showChat && (
        <ChatPane
          lead={lead}
          messages={messages}
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          onSendMessage={(content, type) => {
            console.log('Sending message:', { content, type, leadId: lead.id });
          }}
        />
      )}
    </div>
  );
};

export default LeadDetail;
