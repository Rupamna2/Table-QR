import { IPaymentGateway, PaymentInitializePayload, PaymentVerificationPayload } from './IPaymentGateway';

export class RazorpayGateway implements IPaymentGateway {
  async initializeTransaction(payload: PaymentInitializePayload) {
    // TODO: Unit 15 implementation connecting to Razorpay API
    console.log(`Razorpay initializing for ${payload.orderId} at ${payload.amount}`);
    return {
      success: true,
      provider: 'razorpay',
      orderId: payload.orderId,
      // mock data for now
    };
  }

  async verifyPayment(payload: PaymentVerificationPayload) {
    // TODO: Verify HMAC signature from Razorpay
    return true;
  }

  async refundTransaction(orderId: string, amount?: number) {
    // TODO: Trigger refund via Razorpay API
    return true;
  }
}
