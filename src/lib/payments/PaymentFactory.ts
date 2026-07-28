import { IPaymentGateway } from './IPaymentGateway';
import { CashPaymentGateway } from './CashPaymentGateway';
import { RazorpayGateway } from './RazorpayGateway';
import { SepoliaCryptoGateway } from './SepoliaCryptoGateway';

export class PaymentFactory {
  static getGateway(): IPaymentGateway {
    const provider = process.env.PAYMENT_PROVIDER || 'cash';

    switch (provider.toLowerCase()) {
      case 'razorpay':
        return new RazorpayGateway();
      case 'sepolia':
        return new SepoliaCryptoGateway();
      case 'cash':
      default:
        return new CashPaymentGateway();
    }
  }
}
