# Unit 09 — Cart & Checkout Flow

## Goal

Let a customer build a cart from the menu, customize items
(variant, notes), and submit it as a real order via the
Unit 06 order API, scoped to the validated table from
Unit 05 and the authenticated session from Unit 02.

## Design

Floating cart bar (Unit 07) expands into a full cart sheet
(`rounded-3xl` overlay, `--bg-glass` backdrop) listing items
with quantity steppers; checkout is a distinct step within
the same sheet showing payment-mode selection (recording
only — see Unit 15) and an "Confirm Order" primary button in
`--accent-primary`.

## Implementation

1. Client-side cart state via React context in
   `components/customer/cart/CartProvider.tsx` — in-memory
   only, no browser storage.
2. `DishCard` "Add" button opens a variant/notes selector
   modal, then adds to cart context.
3. `components/customer/cart/CartSheet.tsx` — line items,
   quantity controls, subtotal.
4. Checkout step triggers Unit 02 OTP flow if the customer
   isn't yet authenticated, then calls
   `POST /api/orders` (Unit 06) with the validated table id.
5. On success, redirect to `app/(customer)/track/[orderId]`
   (stub page — Unit 10 wires realtime data into it).

## Dependencies

- React context (no new package)

## Verification Checklist

- [ ] Adding/removing items updates the floating cart bar
      count and subtotal correctly
- [ ] An unauthenticated customer is prompted for OTP before
      order submission, not after
- [ ] Submitted order total matches server-recomputed total
      from Unit 06 (client total is display-only)
- [ ] Successful order redirects to the tracking page with
      the correct order id
- [ ] `npm run build` passes
