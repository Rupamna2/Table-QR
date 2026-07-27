# Unit 15 — Payment Mode Recording

## Goal

Let a customer select a payment mode (card / UPI / cash) at
checkout and have it recorded on the order, per the MVP
scope defined in `architecture.md` (no live gateway call).

## Design

Payment mode selector inside the Unit 09 checkout step: a
segmented control (card / UPI / cash) styled with
`--accent-primary` for the selected state.

## Implementation

1. Extend the Unit 09 checkout payload to include
   `payment_mode`, validated against the enum in the schema.
2. `app/api/orders/route.ts` (Unit 06) — store
   `payment_mode`, default `payment_status = 'unpaid'`.
3. `app/api/orders/[id]/payment-status/route.ts` —
   owner/staff-only `PATCH`, marks `payment_status = 'paid'`
   once cash/card is settled at the table (manual
   confirmation, no gateway webhook in MVP).
4. Explicitly out of scope for this unit: live card/UPI
   processing, refunds, receipts. These require a
   payments-provider spec per the Open Question in
   `progress-tracker.md`.

## Dependencies

- None new

## Verification Checklist

- [ ] Every order created via Unit 09 has a non-null
      `payment_mode`
- [ ] `payment_status` starts `unpaid` and only an
      owner/staff session can mark it `paid`
- [ ] No code path attempts a live gateway charge
- [ ] `npm run build` passes
