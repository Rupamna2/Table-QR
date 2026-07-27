# Unit 06 — Order API Routes

## Goal

Provide the authenticated order-creation and status-update
API that the cart (Unit 09) and live order board (Unit 13)
will call — the single source of truth for order state.

## Design

No UI in this unit.

## Implementation

1. `app/api/orders/route.ts` — `POST` (requires customer
   session from Unit 02): validates cart payload with `zod`,
   recomputes `total_amount`/`final_amount` server-side
   from current menu prices (never trusts client-submitted
   totals), creates `Order` + `OrderItem` rows, sets
   `status = 'pending'`.
2. `app/api/orders/[id]/route.ts` — `GET`, returns order
   detail; customer can only fetch their own order, owner/
   staff can fetch any order for their restaurant.
3. `app/api/orders/[id]/status/route.ts` — `PATCH`,
   owner/staff only, transitions `status` following the
   sequence defined in Invariant 4 of `architecture.md`;
   rejects any out-of-sequence transition with a 400.
4. `app/api/orders/table/[tableId]/route.ts` — `GET`,
   owner/staff only, lists active orders for a table.

## Dependencies

- `@prisma/client`
- `zod`

## Verification Checklist

- [ ] Order totals are always recomputed server-side from
      current DB prices, never accepted verbatim from the
      client
- [ ] A status transition attempt that skips a step (e.g.
      `pending → ready`) is rejected
- [ ] A customer cannot `GET` another customer's order
- [ ] `npm run build` passes
