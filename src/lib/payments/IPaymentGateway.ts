export interface PaymentInitializePayload {
  amount: number;
  orderId: string;
  currency?: string;
  metadata?: Record<string, string>;
}

export interface PaymentVerificationPayload {
  orderId: string;
  paymentId: string;
  signature?: string;
  [key: string]: any;
}

export interface IPaymentGateway {
  /**
   * Initializes a transaction with the payment provider.
   * Returns a payload that the client UI uses to launch the payment modal/redirect.
   */
  initializeTransaction(payload: PaymentInitializePayload): Promise<any>;

  /**
   * Verifies the successful completion of a transaction (often called by webhook or post-flow).
   */
  verifyPayment(payload: PaymentVerificationPayload): Promise<boolean>;

  /**
   * Triggers a refund for a specific order.
   */
  refundTransaction(orderId: string, amount?: number): Promise<boolean>;
}
