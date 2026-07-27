# Unit 05 — QR Code Generation + Table Token Validation

## Goal

Let an owner generate a unique, signed QR code per
restaurant table, and let the customer-facing app validate
that token to establish table context.

## Design

Minimal owner-side UI: a table list with a "Generate QR"
button per row, and a printable QR image modal
(`rounded-3xl` overlay per `ui-context.md`). Full owner
shell/navigation is Unit 11 — this unit's UI is a standalone
utility page.

## Implementation

1. `lib/qrcode.ts` — generates a signed `qr_token` (e.g.
   HMAC of table id + secret) and the resulting
   `https://.../order?t=<tableId>&k=<token>` URL, using the
   `qrcode` npm package to render a PNG/SVG.
2. `app/api/tables/route.ts` — `POST` (owner-only, via
   `requireRole` from Unit 03) creates a `RestaurantTable`
   row and generates its token; `GET` lists tables for the
   owner view.
3. `app/api/tables/[id]/regenerate/route.ts` — owner-only,
   invalidates the previous token and issues a new one, per
   Invariant 3 in `architecture.md`.
4. `app/api/tables/validate/route.ts` — public `GET`,
   given `t` and `k`, confirms the token matches the table
   and the table `is_active`; used by the customer menu
   landing page before any menu data loads.

## Dependencies

- `qrcode` (npm)

## Verification Checklist

- [ ] A generated QR encodes a URL that resolves back to
      the correct table id via `validate`
- [ ] Regenerating a table's QR invalidates the old token
      (old token fails `validate`)
- [ ] Table creation/regeneration is blocked for
      unauthenticated or `staff`-role callers
- [ ] `npm run build` passes
