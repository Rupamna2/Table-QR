# Unit 06 — Order API Routes

## Goal

Provide the server endpoints to create, read, and update
orders and their line items, validating status transitions
and security checks securely on the server.

## Design

No UI in this unit.

## Implementation

1. `app/api/orders/route.ts` (POST) — accepts an array of
   items, variants, and quantities.
   - Requires valid customer `active_table_session` cookie.
   - For 'Cash' orders, enforce a soft Network/IP matching check (e.g., comparing `x-forwarded-for` against a known restaurant broadband IP) to confirm physical presence.
   - Calculates the `totalAmount` server-side by
     querying the DB for current prices (do not trust
     client prices).
   - Creates the `Order` and `OrderItem` rows in a transaction.
2. `app/api/orders/[id]/route.ts` (GET) — retrieves an
   order. Customer can only read their own order; staff can
   read any order.
3. `app/api/orders/[id]/status/route.ts` (PATCH) — updates
   order status. Staff-only. Must enforce Invariant 4
   (valid state machine transitions only).

## Dependencies

- `@prisma/client`
- `zod`

## Verification Checklist

- [ ] Creating an order correctly sums DB prices, ignoring
      any price sent by the client payload.
- [ ] 'Cash' orders fail if the IP check fails.
- [ ] Attempting to transition an order from `pending`
      directly to `completed` returns a 400 error.
- [ ] An unauthenticated customer cannot read an order.
- [ ] `npm run build` passes.
