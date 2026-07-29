# Unit 12 — Owner Dashboard Stats API + Wiring

## Goal

Replace Unit 11's placeholder KPI/chart data with real
aggregates computed from the Unit 06 order data.

## Design

No new visual design — reuses Unit 11 components exactly,
with loading/empty states added for a restaurant with zero
orders today.

## Implementation

1. `app/api/dashboard/stats/route.ts` — owner/staff-only,
   returns today's revenue, order count, average rating
   (0 until Unit 16/ratings exist — return null-safe),
   top item by order count.
2. `app/api/dashboard/hourly/route.ts` — owner/staff-only,
   returns order count grouped by hour for the current day,
   feeding `RevenueChartCard`.
3. Wire `app/(owner)/dashboard/page.tsx` to fetch both
   routes server-side and pass real data into Unit 11's
   components.
4. `InsightPlaceholderCard` remains static copy — do not
   wire it to any AI service; that's Phase 2 Backlog.

## Dependencies

- `@prisma/client`

## Verification Checklist

- [ ] KPI numbers match a manual query against seeded/test
      order data
- [ ] Dashboard shows a sensible empty state (not a crash or
      `NaN`) when there are zero orders today
- [ ] Route access is blocked for unauthenticated or
      customer-session callers
- [ ] `npm run build` passes
