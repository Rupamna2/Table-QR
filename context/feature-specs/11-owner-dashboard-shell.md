# Unit 11 — Owner Dashboard UI Shell (Placeholder Stats)

## Goal

Build the owner dashboard's bento-grid visual structure
using static placeholder numbers, establishing navigation
and layout before wiring real stats.

## Design

Follows the "Owner dashboard" layout pattern in
`ui-context.md`: KPI row (revenue, orders today, avg
rating, top dish) → wide revenue chart tile + wide
insight-placeholder tile → live order board tile (tall,
placeholder rows) + recent customers tile (placeholder).
Sidebar nav per the "Sidebars" pattern, gated by Unit 03
middleware.

## Implementation

1. `app/(owner)/dashboard/page.tsx` — server component
   shell with hardcoded placeholder stats.
2. `components/owner/dashboard/KpiCard.tsx`,
   `RevenueChartCard.tsx` (Recharts, static sample series),
   `InsightPlaceholderCard.tsx` (static text, no AI call —
   AI insights are Phase 2 Backlog), `OrderBoardPreview.tsx`,
   `RecentCustomersPreview.tsx`.
3. `components/owner/layout/Sidebar.tsx`,
   `TopBar.tsx` — shared owner-shell chrome used by every
   subsequent owner unit (11, 12, 13, 14).

## Dependencies

- `recharts`
- `lucide-react`

## Verification Checklist

- [ ] Dashboard renders behind the Unit 03 auth middleware
      (redirects if unauthenticated)
- [ ] Bento grid matches the layout pattern in
      `ui-context.md` at desktop width
- [ ] No component in this unit calls `app/api/dashboard`
      (that's Unit 12)
- [ ] `npm run build` passes
