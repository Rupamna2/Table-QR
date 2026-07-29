# Unit 15 — Payment Gateway Strategy Integration

## Goal

Abstract payment processing away from a specific provider, allowing TableQR Pro to swap payment engines using a Factory and Strategy Pattern based on environmental variables or specific use cases.

## Design

No new UI components; this wires into the existing Checkout flow from Unit 09.

## Implementation

1. Define `lib/payments/IPaymentGateway.ts`:
   - An interface defining methods like `initializeTransaction(amount, orderId)`, `verifyPayment(payload)`, and `refundTransaction(orderId)`.
2. Implement 3 Concrete Strategies:
   - `RazorpayGateway.ts`: Full production Indian payment infrastructure.
   - `CashPaymentGateway.ts`: Creates a pending/cash state triggering the manual IP/Network soft geofencing check.
   - `SepoliaCryptoGateway.ts`: A sandbox Web3 integration for free testing/pilot restaurants.
3. Implement `PaymentFactory.ts`:
   - Selects the correct Strategy instantiation at runtime based on `process.env.PAYMENT_PROVIDER`.
4. Update checkout API routes in `app/api/orders` to utilize the Factory instead of directly recording a static `paymentMode`.

## Verification Checklist

- [ ] `PaymentFactory` correctly outputs the class corresponding to the environment variable.
- [ ] At least one concrete strategy can be swapped in without modifying the core checkout API handler logic.
- [ ] `npm run build` passes.
