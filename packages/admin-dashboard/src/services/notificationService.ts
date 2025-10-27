import { useUIStore } from '@/stores/uiStore';

export interface NotificationData {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'job' | 'payment' | 'message';
}

class NotificationService {
  private store = useUIStore.getState();

  // Job Status Notifications
  static notifyJobStatusUpdate(jobId: string, status: string, customerName: string) {
    const notifications = {
      'completed': {
        title: 'Job Completed',
        message: `Job #${jobId} for ${customerName} has been completed successfully.`,
        type: 'success' as const
      },
      'in_progress': {
        title: 'Job Started',
        message: `Job #${jobId} for ${customerName} is now in progress.`,
        type: 'info' as const
      },
      'cancelled': {
        title: 'Job Cancelled',
        message: `Job #${jobId} for ${customerName} has been cancelled.`,
        type: 'warning' as const
      },
      'delayed': {
        title: 'Job Delayed',
        message: `Job #${jobId} for ${customerName} has been delayed.`,
        type: 'warning' as const
      }
    };

    const notification = notifications[status as keyof typeof notifications];
    if (notification) {
      useUIStore.getState().addNotification(notification);
    }
  }

  // Payment Notifications
  static notifyPaymentReceived(amount: number, customerName: string, invoiceId: string) {
    useUIStore.getState().addNotification({
      title: 'Payment Received',
      message: `Payment of £${amount.toFixed(2)} received from ${customerName} for Invoice #${invoiceId}.`,
      type: 'success'
    });
  }

  static notifyPaymentFailed(amount: number, customerName: string, invoiceId: string) {
    useUIStore.getState().addNotification({
      title: 'Payment Failed',
      message: `Payment of £${amount.toFixed(2)} from ${customerName} for Invoice #${invoiceId} failed.`,
      type: 'error'
    });
  }

  static notifyPaymentOverdue(invoiceId: string, customerName: string, daysOverdue: number) {
    useUIStore.getState().addNotification({
      title: 'Payment Overdue',
      message: `Invoice #${invoiceId} from ${customerName} is ${daysOverdue} days overdue.`,
      type: 'warning'
    });
  }

  // Message Notifications
  static notifyNewMessage(senderName: string, messagePreview: string, isWhatsApp: boolean = true) {
    useUIStore.getState().addNotification({
      title: `New ${isWhatsApp ? 'WhatsApp' : 'Message'}`,
      message: `${senderName}: ${messagePreview.substring(0, 50)}${messagePreview.length > 50 ? '...' : ''}`,
      type: 'message'
    });
  }

  static notifyMessageFailed(recipientName: string, reason: string) {
    useUIStore.getState().addNotification({
      title: 'Message Failed',
      message: `Failed to send message to ${recipientName}: ${reason}`,
      type: 'error'
    });
  }

  // System Notifications
  static notifySystemUpdate(updateType: string, details: string) {
    useUIStore.getState().addNotification({
      title: 'System Update',
      message: `${updateType}: ${details}`,
      type: 'info'
    });
  }

  static notifyIntegrationStatus(integrationName: string, status: 'connected' | 'disconnected' | 'error') {
    const statusMessages = {
      'connected': `Successfully connected to ${integrationName}`,
      'disconnected': `Lost connection to ${integrationName}`,
      'error': `Error with ${integrationName} integration`
    };

    useUIStore.getState().addNotification({
      title: 'Integration Status',
      message: statusMessages[status],
      type: status === 'connected' ? 'success' : 'warning'
    });
  }

  // Lead Notifications
  static notifyNewLead(leadName: string, source: string) {
    useUIStore.getState().addNotification({
      title: 'New Lead',
      message: `New lead: ${leadName} from ${source}`,
      type: 'info'
    });
  }

  static notifyLeadConverted(leadName: string, jobId: string) {
    useUIStore.getState().addNotification({
      title: 'Lead Converted',
      message: `${leadName} has been converted to Job #${jobId}`,
      type: 'success'
    });
  }

  // Quote Notifications
  static notifyQuoteGenerated(quoteId: string, customerName: string, amount: number) {
    useUIStore.getState().addNotification({
      title: 'Quote Generated',
      message: `Quote #${quoteId} for ${customerName} - £${amount.toFixed(2)}`,
      type: 'info'
    });
  }

  static notifyQuoteAccepted(quoteId: string, customerName: string) {
    useUIStore.getState().addNotification({
      title: 'Quote Accepted',
      message: `Quote #${quoteId} from ${customerName} has been accepted!`,
      type: 'success'
    });
  }

  static notifyQuoteExpired(quoteId: string, customerName: string) {
    useUIStore.getState().addNotification({
      title: 'Quote Expired',
      message: `Quote #${quoteId} for ${customerName} has expired.`,
      type: 'warning'
    });
  }

  // Demo notifications for testing
  static generateDemoNotifications() {
    const demoNotifications = [
      {
        title: 'Job Completed',
        message: 'Job #1234 for John Smith has been completed successfully.',
        type: 'success' as const
      },
      {
        title: 'Payment Received',
        message: 'Payment of £1,250.00 received from ABC Company for Invoice #INV-001.',
        type: 'success' as const
      },
      {
        title: 'New WhatsApp Message',
        message: 'Sarah Johnson: Hi, I need to reschedule my appointment for tomorrow.',
        type: 'message' as const
      },
      {
        title: 'Job Started',
        message: 'Job #1235 for Mike Wilson is now in progress.',
        type: 'info' as const
      },
      {
        title: 'Payment Overdue',
        message: 'Invoice #INV-002 from TechCorp is 5 days overdue.',
        type: 'warning' as const
      },
      {
        title: 'New Lead',
        message: 'New lead: Emma Davis from Website',
        type: 'info' as const
      },
      {
        title: 'Quote Accepted',
        message: 'Quote #Q-456 from Green Solutions has been accepted!',
        type: 'success' as const
      },
      {
        title: 'WhatsApp Integration',
        message: 'WhatsApp Business API connection restored.',
        type: 'success' as const
      }
    ];

    // Add demo notifications
    demoNotifications.forEach(notification => {
      useUIStore.getState().addNotification(notification);
    });
  }
}

export default NotificationService;
