# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Owner Dashboard UI Shell (Unit 11) Complete

## Current Goal

- Begin Unit 12: Dashboard Data Wiring
  (`context/feature-specs/12-dashboard-data-wiring.md`)

## Completed

- Base project setup (Next.js, dependencies)
- 01-database-schema-setup (Prisma schema defined, migration ran, data seeded)
- 02-auth-customer-session (Zero-OTP QR Session middleware and `qr-auth.ts` helper)
- 03-auth-owner-staff (Email/password routes, StaffAccount Prisma schema, middleware, login UI implemented)
- Architecture Pivots documented (Zero-OTP, Payment Strategy Pattern).
- 001-architectural-decision-change-implementation-build-plan.md refactoring.
- 04-menu-api-routes
- 05-qr-code-generation
- 06-order-api-routes
- 07-customer-menu-ui-shell
- 08-menu-data-wiring
- 09-cart-checkout-flow
- 10-realtime-order-tracking
- 11-owner-dashboard-shell

## In Progress

- None yet.

## Next Up

- 12-dashboard-data-wiring
- 13-live-order-board
- (full order in `context/feature-specs/00-build-plan.md`)

## Open Questions

- None at this time. Previous questions resolved via Architecture Decisions.

## Architecture Decisions

- **Authentication**: Discarded SMS OTP. Using "Physical QR Anchoring". QR URLs include cryptographic `sig` and `ts`. Middleware validates and sets 3-hour HttpOnly `active_table_session`.
- **Payments**: Abstracted via `IPaymentGateway` interface using Strategy Pattern (Razorpay, Cash, SepoliaCrypto) controlled by a PaymentFactory.
- **Security Check**: Online payments skip physical validation; Cash-at-Table payments enforce Network/IP geofencing against restaurant broadband.
- Collapsed the originally proposed separate Node/Express + Socket.io backend into Next.js API routes + Supabase Realtime, to reduce system boundaries for MVP.

## Session Notes

- Full six-file context system and build plan generated
  from the original TableQR Pro product blueprint. The
  blueprint's 60+ feature list was intentionally reduced to
  a 16-unit MVP build plan; everything not in the MVP is
  logged under "Phase 2 Backlog" in `project-overview.md`
  and must not be built without a new spec file.
