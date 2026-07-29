# Unit 08 — Wire Menu UI to Menu API

## Goal

Replace the placeholder data in Unit 07's menu shell with
real data from the Unit 04 menu API, gated by the Unit 05
table-token validation.

## Design

No new visual design — reuses Unit 07 components exactly.
Add loading skeletons (using `--bg-glass` shimmer) and an
empty state for a category with no available items.

## Implementation

1. `app/(customer)/menu/page.tsx` — on load, validate the
   `t`/`k` query params via `app/api/tables/validate`; if
   invalid, render an error state ("QR code not
   recognized").
2. Fetch categories and items server-side from Unit 04
   routes; pass to the Unit 07 components as props.
3. `CategoryFilter` selection triggers a client-side refetch
   (or client-side filter of an already-fetched full item
   list — prefer the latter to avoid redundant calls).
4. Wire `is_available = false` items to render with a
   "Sold Out" badge and disabled "Add" button rather than
   being hidden.

## Dependencies

- None new (reuses Units 04, 05, 07 output)

## Verification Checklist

- [ ] An invalid or missing table token shows the error
      state and does not render the menu
- [ ] Category filter updates the visible dish grid without
      a full page reload
- [ ] A sold-out item shows a disabled "Add" state, not a
      removed item
- [ ] `npm run build` passes
