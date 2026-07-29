# Unit 13 — Live Order Board (Accept/Update Status)

## Goal

Let owner/staff see incoming orders in real time and
transition their status, replacing Unit 11's placeholder
order-board tile with a fully functional board.

## Design

`app/(owner)/orders/page.tsx` — tall bento tile expands to a
full-page board on this route: a column-per-status kanban
(Pending → Preparing → Ready → Completed) using
`--bg-surface` cards, status-colored left border
(`--state-success` for Ready, `--accent-primary` for
Preparing).

## Implementation

1. Subscribe to the realtime channel from Unit 10, filtered
   to the restaurant's active orders (not a single order id).
2. `components/owner/orders/OrderCard.tsx` — shows table
   number, items, total, elapsed time since creation.
3. Status-advance button on each card calls
   `PATCH /api/orders/:id/status` (Unit 06); optimistic UI
   update, reconciled by the realtime event.
4. New-order arrival plays a subtle sound alert and
   highlights the card briefly (CSS transition, not
   Framer Motion — keep this unit dependency-light).
5. Dashboard's `OrderBoardPreview` (Unit 11) is updated to
   link to this full board page.

## Dependencies

- Reuses Unit 10's realtime helper

## Verification Checklist

- [ ] A new order placed via Unit 09 appears on the board
      within 2 seconds without a refresh
- [ ] Clicking "advance status" moves the card to the next
      column and updates the DB via Unit 06's validated
      transition logic
- [ ] Out-of-sequence transitions are not reachable from the
      UI (button only ever advances one step)
- [ ] Staff-role sessions can advance status but cannot
      access owner-only routes elsewhere in the app
- [ ] `npm run build` passes
