# Unit 02 — Customer Auth (Zero-OTP QR Session)

## Goal

Let a customer verify their physical presence at a table via a cryptographically signed QR URL and establish an `active_table_session` cookie for 3 hours. No OTP or account creation required.

## Design

No custom UI for authentication. Customers scanning the QR code should be immediately verified and landed on the table's menu page. Invalid signatures show an error page.

## Implementation

1. `middleware.ts` — intercept requests to customer-facing menus (`/menu/:tableId`). If a `sig` and `ts` are in the URL search params:
   - Validate that `ts` is within an acceptable timestamp window (to prevent infinite replay).
   - Validate the `sig` using an HMAC signature utilizing a server-side secret (e.g. `QR_SECRET`).
   - If valid, issue an `active_table_session` cookie via `NextResponse` representing a tied session to that `tableId` and create/fetch an anonymous `User` in Prisma bound to this session footprint.
   - Redirect to `/menu` (without the dirty query params).
2. If no valid signature or session exists, reject access or show an invalid QR code UI.

## Dependencies

- `crypto` (Node.js standard library) or Web Crypto API for Edge Middleware compatibility.

## Verification Checklist

- [ ] A valid `sig` and `ts` allows access and sets the `active_table_session` cookie.
- [ ] An invalid or expired `sig` denies access.
- [ ] A user with an existing valid `active_table_session` can refresh the page without needing the query params again.
- [ ] `npm run build` passes
