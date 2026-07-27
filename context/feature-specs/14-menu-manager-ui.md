# Unit 14 — Owner Menu Manager UI (CRUD + Stock Toggle)

## Goal

Let an owner add, edit, and disable menu items and
categories, and let owner/staff toggle item stock
availability, using the schema and API surface from Units
01 and 04 (extended here with mutation routes).

## Design

`app/(owner)/menu/page.tsx` — table/list view of items
grouped by category, each row with photo thumbnail, name,
price, availability toggle, edit button. "Add Item" opens a
`rounded-3xl` modal form.

## Implementation

1. Extend `app/api/menu/items/route.ts` with `POST`
   (owner-only, via `requireRole`); add
   `app/api/menu/items/[id]/route.ts` `PATCH`/`DELETE`
   (owner-only for price/details, owner+staff for
   `is_available` toggle only — enforce field-level check
   server-side, not just route-level).
2. `app/api/menu/categories/route.ts` — add `POST` for
   category creation (owner-only).
3. Image upload: `app/api/menu/items/[id]/photo/route.ts` —
   owner-only, uploads to Cloudinary, stores resulting URL.
4. `components/owner/menu/ItemForm.tsx`,
   `ItemRow.tsx`, `StockToggle.tsx`.
5. Toggling stock via `StockToggle` immediately reflects on
   the customer menu (Unit 08) since it reads
   `is_available` live — no cache invalidation step needed
   for MVP (no ISR caching introduced yet).

## Dependencies

- Cloudinary SDK (`cloudinary` npm package)

## Verification Checklist

- [ ] Owner can create, edit, and disable a menu item; staff
      can only toggle `is_available`, verified by a rejected
      `PATCH` attempt on `price` from a staff session
- [ ] Uploaded photo appears via Cloudinary URL on both the
      owner row and the customer `DishCard`
- [ ] Disabling an item shows it as "Sold Out" on the
      customer menu within one refresh (realtime sync is not
      required for this unit)
- [ ] `npm run build` passes
