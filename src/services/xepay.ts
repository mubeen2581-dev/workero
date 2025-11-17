import { XEPayLink, Payment, PaymentMethod } from '@/types';

// Mock XE Pay API service
export class XEPayService {
  private static baseUrl = 'https://api.xepay.com/v1';

  // Generate payment link
  static async createPaymentLink(data: {
    invoiceId: string;
    amount: number;
    currency: string;
    description: string;
    customerEmail: string;
    returnUrl?: string;
    webhookUrl?: string;
  }): Promise<XEPayLink> {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const paymentLink: XEPayLink = {
      id: `xepay_${Date.now()}`,
      invoiceId: data.invoiceId,
      amount: data.amount,
      currency: data.currency,
      paymentUrl: `https://pay.xepay.com/checkout/${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    return paymentLink;
  }

  // Get payment status
  static async getPaymentStatus(paymentId: string): Promise<Payment> {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const payment: Payment = {
      id: paymentId,
      invoiceId: `inv_${Date.now()}`,
      amount: 1250,
      paymentMethod: 'xe_pay',
      paymentDate: new Date().toISOString(),
      reference: `XE${Date.now()}`,
      status: 'completed',
      xePayTransactionId: `xe_txn_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    return payment;
  }

  // Get available payment methods
  static async getPaymentMethods(): Promise<PaymentMethod[]> {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: 'card',
        type: 'card',
        name: 'Credit/Debit Card',
        icon: 'CreditCard',
        enabled: true,
        fees: { percentage: 2.9, fixed: 0.30 }
      },
      {
        id: 'apple_pay',
        type: 'digital_wallet',
        name: 'Apple Pay',
        icon: 'Smartphone',
        enabled: true,
        fees: { percentage: 2.9, fixed: 0.30 }
      },
      {
        id: 'google_pay',
        type: 'digital_wallet',
        name: 'Google Pay',
        icon: 'Smartphone',
        enabled: true,
        fees: { percentage: 2.9, fixed: 0.30 }
      },
      {
        id: 'bank_transfer',
        type: 'bank',
        name: 'Bank Transfer',
        icon: 'Building2',
        enabled: true,
        fees: { percentage: 0.8, fixed: 0 }
      }
    ];
  }

  // Send payment link via email/SMS
  static async sendPaymentLink(data: {
    paymentLinkId: string;
    method: 'email' | 'sms';
    recipient: string;
    message?: string;
  }): Promise<boolean> {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 800));
    return true;
  }

  // Cancel payment link
  static async cancelPaymentLink(paymentLinkId: string): Promise<boolean> {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }
}