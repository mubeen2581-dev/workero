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
      useUIStore.getState().addNotification({ ...notification, isRead: false });
    }
  }

  // Payment Notifications
  static notifyPaymentReceived(amount: number, customerName: string, invoiceId: string) {
    useUIStore.getState().addNotification({
      title: 'Payment Received',
      message: `Payment of £${amount.toFixed(2)} received from ${customerName} for Invoice #${invoiceId}.`,
      type: 'success',
      isRead: false
    });
  }

  static notifyPaymentFailed(amount: number, customerName: string, invoiceId: string) {
    useUIStore.getState().addNotification({
      title: 'Payment Failed',
      message: `Payment of £${amount.toFixed(2)} from ${customerName} for Invoice #${invoiceId} failed.`,
      type: 'error',
      isRead: false
    });
  }

  static notifyPaymentOverdue(invoiceId: string, customerName: string, daysOverdue: number) {
    useUIStore.getState().addNotification({
      title: 'Payment Overdue',
      message: `Invoice #${invoiceId} from ${customerName} is ${daysOverdue} days overdue.`,
      type: 'warning',
      isRead: false
    });
  }

  // Message Notifications
  static notifyNewMessage(senderName: string, messagePreview: string, isWhatsApp: boolean = true) {
    useUIStore.getState().addNotification({
      title: `New ${isWhatsApp ? 'WhatsApp' : 'Message'}`,
      message: `${senderName}: ${messagePreview.substring(0, 50)}${messagePreview.length > 50 ? '...' : ''}`,
      type: 'info',
      isRead: false
    });
  }

  static notifyMessageFailed(recipientName: string, reason: string) {
    useUIStore.getState().addNotification({
      title: 'Message Failed',
      message: `Failed to send message to ${recipientName}: ${reason}`,
      type: 'error',
      isRead: false
    });
  }

  // System Notifications
  static notifySystemUpdate(updateType: string, details: string) {
    useUIStore.getState().addNotification({
      title: 'System Update',
      message: `${updateType}: ${details}`,
      type: 'info',
      isRead: false
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
      type: status === 'connected' ? 'success' : 'warning',
      isRead: false
    });
  }

  // Lead Notifications
  static notifyNewLead(leadName: string, source: string) {
    useUIStore.getState().addNotification({
      title: 'New Lead',
      message: `New lead: ${leadName} from ${source}`,
      type: 'info',
      isRead: false
    });
  }

  static notifyLeadConverted(leadName: string, jobId: string) {
    useUIStore.getState().addNotification({
      title: 'Lead Converted',
      message: `${leadName} has been converted to Job #${jobId}`,
      type: 'success',
      isRead: false
    });
  }

  // Quote Notifications
  static notifyQuoteGenerated(quoteId: string, customerName: string, amount: number) {
    useUIStore.getState().addNotification({
      title: 'Quote Generated',
      message: `Quote #${quoteId} for ${customerName} - £${amount.toFixed(2)}`,
      type: 'info',
      isRead: false
    });
  }

  static notifyQuoteAccepted(quoteId: string, customerName: string) {
    useUIStore.getState().addNotification({
      title: 'Quote Accepted',
      message: `Quote #${quoteId} from ${customerName} has been accepted!`,
      type: 'success',
      isRead: false
    });
  }

  static notifyQuoteExpired(quoteId: string, customerName: string) {
    useUIStore.getState().addNotification({
      title: 'Quote Expired',
      message: `Quote #${quoteId} for ${customerName} has expired.`,
      type: 'warning',
      isRead: false
    });
  }

  // Demo notifications for testing
  static generateDemoNotifications() {
    const demoNotifications = [
      {
        title: 'Job Completed',
        message: 'Job #1234 for John Smith has been completed successfully.',
        type: 'success' as const,
        isRead: false
      },
      {
        title: 'Payment Received',
        message: 'Payment of £1,250.00 received from ABC Company for Invoice #INV-001.',
        type: 'success' as const,
        isRead: false
      },
      {
        title: 'New WhatsApp Message',
        message: 'Sarah Johnson: Hi, I need to reschedule my appointment for tomorrow.',
        type: 'info' as const,
        isRead: false
      },
      {
        title: 'Job Started',
        message: 'Job #1235 for Mike Wilson is now in progress.',
        type: 'info' as const,
        isRead: false
      },
      {
        title: 'Payment Overdue',
        message: 'Invoice #INV-002 from TechCorp is 5 days overdue.',
        type: 'warning' as const,
        isRead: false
      },
      {
        title: 'New Lead',
        message: 'New lead: Emma Davis from Website',
        type: 'info' as const,
        isRead: false
      },
      {
        title: 'Quote Accepted',
        message: 'Quote #Q-456 from Green Solutions has been accepted!',
        type: 'success' as const,
        isRead: false
      },
      {
        title: 'WhatsApp Integration',
        message: 'WhatsApp Business API connection restored.',
        type: 'success' as const,
        isRead: false
      }
    ];

    // Add demo notifications
    demoNotifications.forEach(notification => {
      useUIStore.getState().addNotification(notification);
    });
  }
}

export default NotificationService;
