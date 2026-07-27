# Unit 07 — Customer Menu UI Shell (Placeholder Data)

## Goal

Build the customer menu landing page's visual structure and
component composition using static placeholder data, so the
bento-grid design is validated before real data wiring.

## Design

Follows the "Customer menu landing" layout pattern in
`ui-context.md`: table banner → 3-tile row (today's
special / must-try / active offer) → horizontal-scroll
category filter → 2-column dish grid → sticky floating cart
bar. Dark theme tokens only, no hardcoded hex.

## Implementation

1. `app/(customer)/menu/page.tsx` — server component shell,
   renders with hardcoded placeholder arrays (no API calls
   yet).
2. `components/customer/menu/TableBanner.tsx`,
   `HighlightTiles.tsx`, `CategoryFilter.tsx`,
   `DishGrid.tsx`, `DishCard.tsx`, `FloatingCartBar.tsx` —
   presentational components only, props-driven.
3. `DishCard` includes photo placeholder, name, price, and
   an "Add" button (non-functional in this unit).
4. Responsive: mobile-first 2-column grid, expands on
   larger viewports.

## Dependencies

- `lucide-react`
- shadcn/ui `card`, `badge`, `button`

## Verification Checklist

- [ ] Page renders correctly on a 375px-wide viewport with
      no horizontal overflow
- [ ] All colors reference CSS variable tokens from
      `ui-context.md`
- [ ] Category filter scrolls horizontally without wrapping
- [ ] No component in this unit makes a network/API call
- [ ] `npm run build` passes
