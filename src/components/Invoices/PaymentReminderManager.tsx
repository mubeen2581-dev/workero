import React, { useState } from 'react';
import { Bell, Calendar, Mail, MessageSquare, Clock, CheckCircle, X } from 'lucide-react';
import { Invoice } from '@/types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { toast } from 'react-toastify';

interface PaymentReminder {
  id: string;
  invoiceId: string;
  type: 'email' | 'sms' | 'whatsapp';
  scheduledDate: string;
  sentDate?: string;
  status: 'scheduled' | 'sent' | 'cancelled';
  message?: string;
}

interface PaymentReminderManagerProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
  onReminderSent?: (reminder: PaymentReminder) => void;
}

const PaymentReminderManager: React.FC<PaymentReminderManagerProps> = ({
  invoice,
  isOpen,
  onClose,
  onReminderSent,
}) => {
  const [reminderType, setReminderType] = useState<'email' | 'sms' | 'whatsapp'>('email');
  const [sendDate, setSendDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [sendTime, setSendTime] = useState<string>('09:00');
  const [message, setMessage] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [scheduledReminders, setScheduledReminders] = useState<PaymentReminder[]>([]);

  // Calculate days until due
  const dueDate = new Date(invoice.dueDate);
  const now = new Date();
  const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const defaultMessages = {
    email: `Dear ${invoice.client.name},\n\nThis is a friendly reminder that invoice ${invoice.id} for ${formatCurrency(invoice.total)} is due on ${new Date(invoice.dueDate).toLocaleDateString()}.\n\nPlease arrange payment at your earliest convenience.\n\nThank you,\n${invoice.client.name}`,
    sms: `Hi ${invoice.client.name.split(' ')[0]}, reminder: Invoice ${invoice.id} for ${formatCurrency(invoice.total)} is due ${daysUntilDue > 0 ? `in ${daysUntilDue} days` : 'today'}. Please arrange payment.`,
    whatsapp: `Hi ${invoice.client.name.split(' ')[0]}, 👋\n\nThis is a reminder about invoice ${invoice.id}:\n\n💰 Amount: ${formatCurrency(invoice.total)}\n📅 Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}\n\nPlease arrange payment. Thank you!`,
  };

  const handleScheduleReminder = async () => {
    if (!message.trim()) {
      toast.error('Please enter a reminder message');
      return;
    }

    setIsSending(true);

    try {
      const scheduledDateTime = new Date(`${sendDate}T${sendTime}`);
      
      const newReminder: PaymentReminder = {
        id: `reminder-${Date.now()}`,
        invoiceId: invoice.id,
        type: reminderType,
        scheduledDate: scheduledDateTime.toISOString(),
        status: 'scheduled',
        message,
      };

      // If scheduled for now or past, send immediately
      if (scheduledDateTime <= new Date()) {
        await sendReminder(newReminder);
      } else {
        setScheduledReminders(prev => [...prev, newReminder]);
        toast.success('Reminder scheduled successfully');
      }
      
      setMessage('');
    } catch (error) {
      toast.error('Failed to schedule reminder');
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const sendReminder = async (reminder: PaymentReminder) => {
    // Simulate sending reminder
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sentReminder: PaymentReminder = {
      ...reminder,
      sentDate: new Date().toISOString(),
      status: 'sent',
    };

    toast.success(`Reminder sent via ${reminder.type}`);
    onReminderSent?.(sentReminder);
  };

  const handleSendNow = async () => {
    if (!message.trim()) {
      toast.error('Please enter a reminder message');
      return;
    }

    setIsSending(true);

    try {
      const reminder: PaymentReminder = {
        id: `reminder-${Date.now()}`,
        invoiceId: invoice.id,
        type: reminderType,
        scheduledDate: new Date().toISOString(),
        status: 'sent',
        message,
      };

      await sendReminder(reminder);
      setMessage('');
    } catch (error) {
      toast.error('Failed to send reminder');
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const loadTemplate = () => {
    setMessage(defaultMessages[reminderType]);
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-2xl mx-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Bell className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Payment Reminder</h2>
              <p className="text-sm text-gray-600">Invoice: {invoice.id}</p>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Invoice Amount</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(invoice.total)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Due Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <p className={`text-lg font-bold ${daysUntilDue < 0 ? 'text-red-600' : daysUntilDue === 0 ? 'text-orange-600' : 'text-gray-900'}`}>
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
                {daysUntilDue < 0 && (
                  <p className="text-xs text-red-600 mt-1">
                    {Math.abs(daysUntilDue)} days overdue
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Reminder Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send Via *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['email', 'sms', 'whatsapp'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setReminderType(type);
                    if (!message || message === defaultMessages[reminderType]) {
                      setMessage(defaultMessages[type]);
                    }
                  }}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    reminderType === type
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {getReminderIcon(type)}
                    <span className="text-sm font-medium capitalize">{type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Editor */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Reminder Message *
              </label>
              <button
                type="button"
                onClick={loadTemplate}
                className="text-xs text-purple-600 hover:text-purple-700"
              >
                Load Template
              </button>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={6}
              placeholder="Enter your reminder message..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Character count: {message.length}
            </p>
          </div>

          {/* Schedule Options */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Schedule Options</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Date
                </label>
                <Input
                  type="date"
                  value={sendDate}
                  onChange={(e) => setSendDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Time
                </label>
                <Input
                  type="time"
                  value={sendTime}
                  onChange={(e) => setSendTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Scheduled Reminders */}
          {scheduledReminders.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Scheduled Reminders</h3>
              <div className="space-y-2">
                {scheduledReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getReminderIcon(reminder.type)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {reminder.type.toUpperCase()} Reminder
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(reminder.scheduledDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Scheduled</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleScheduleReminder}
              className="flex-1"
              disabled={isSending}
            >
              {isSending ? 'Scheduling...' : 'Schedule'}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSendNow}
              className="flex-1"
              disabled={isSending}
            >
              {isSending ? 'Sending...' : 'Send Now'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentReminderManager;

