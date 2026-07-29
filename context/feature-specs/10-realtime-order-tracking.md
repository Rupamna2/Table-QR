# Unit 10 — Realtime Order Tracking (Customer + Owner)

## Goal

Push live order-status updates to the customer's tracking
page and lay the subscription groundwork the owner live
order board (Unit 13) will reuse, without a page refresh.

## Design

Tracking page (`app/(customer)/track/[orderId]`) shows a
horizontal status stepper (Received → Preparing → Ready →
Completed) using `--state-success` for completed steps and
`--text-muted` for pending ones.

## Implementation

1. Enable Supabase Realtime on the `orders` table (row-level
   filtered by `id` for customer subscriptions, by
   restaurant/table for owner subscriptions).
2. `lib/realtime.ts` — shared subscription helper
   `subscribeToOrder(orderId, onUpdate)` used by the
   tracking page.
3. `app/(customer)/track/[orderId]/page.tsx` — client
   component, subscribes on mount, updates the status
   stepper on each realtime event, unsubscribes on unmount.
4. Fallback: if the realtime subscription errors, poll
   `GET /api/orders/:id` (Unit 06) every 10s instead of
   failing silently.

## Dependencies

- `@supabase/supabase-js` (realtime channel)

## Verification Checklist

- [ ] A manual status update via the DB (or Unit 06 PATCH
      route) reflects on the open tracking page within 2
      seconds, no refresh
- [ ] Subscription is cleaned up on page unmount (no memory
      leak / duplicate listeners on revisit)
- [ ] Polling fallback activates if the realtime channel
      fails to connect
- [ ] `npm run build` passes
