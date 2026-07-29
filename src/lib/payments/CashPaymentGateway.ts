import { IPaymentGateway, PaymentInitializePayload, PaymentVerificationPayload } from './IPaymentGateway';

export class CashPaymentGateway implements IPaymentGateway {
  async initializeTransaction(payload: PaymentInitializePayload) {
    // For cash, we just acknowledge the intent.
    // The client UI will instruct the customer to wait at the table.
    return {
      success: true,
      provider: 'cash',
      orderId: payload.orderId,
      amount: payload.amount,
      message: 'Pending physical validation'
    };
  }

  async verifyPayment(payload: PaymentVerificationPayload) {
    // Cash verification is conceptually done by IP/Geofencing validation in the API route before order creation,
    // or manually marked as completed by the owner. We consider the digital step "verified".
    return true;
  }

  async refundTransaction(orderId: string, amount?: number) {
    // Cash refunds are manual operations handled by staff.
    return true;
  }
}
