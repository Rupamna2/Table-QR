import { IPaymentGateway, PaymentInitializePayload, PaymentVerificationPayload } from './IPaymentGateway';

export class SepoliaCryptoGateway implements IPaymentGateway {
  async initializeTransaction(payload: PaymentInitializePayload) {
    // TODO: Unit 15 implementation connecting to a Web3 wallet flow
    return {
      success: true,
      provider: 'sepolia',
      orderId: payload.orderId,
      network: 'Sepolia',
    };
  }

  async verifyPayment(payload: PaymentVerificationPayload) {
    // TODO: Check blockchain tx hash confirmation
    return true;
  }

  async refundTransaction(orderId: string, amount?: number) {
    // Web3 refunds require a signed transaction from the owner wallet.
    return false;
  }
}
