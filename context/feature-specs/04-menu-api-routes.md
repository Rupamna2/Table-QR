# Unit 04 — Menu API Routes

## Goal

Expose read-only public menu endpoints (categories, items,
item detail) backed by the schema from Unit 01, so the
customer UI has real data to wire against in Unit 08.

## Design

No UI in this unit.

## Implementation

1. `app/api/menu/categories/route.ts` — `GET`, returns all
   categories ordered by `display_order`.
2. `app/api/menu/items/route.ts` — `GET`, returns all
   `is_available` items with their variants, optionally
   filtered by `category_id` query param.
3. `app/api/menu/items/[id]/route.ts` — `GET`, single item
   detail including variants, allergens, tags.
4. All three are public (no auth required) — a customer can
   view the menu before OTP verification.
5. Response shape follows `{ data, error }` per
   `code-standards.md`.

## Dependencies

- `@prisma/client`
- `zod` (for query param validation)

## Verification Checklist

- [ ] `GET /api/menu/categories` returns seeded categories
      in correct order
- [ ] `GET /api/menu/items` excludes items where
      `is_available = false`
- [ ] `GET /api/menu/items/:id` returns 404 with
      `{ data: null, error }` shape for an unknown id
- [ ] No route in this unit requires authentication
- [ ] `npm run build` passes
