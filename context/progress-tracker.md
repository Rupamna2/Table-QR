# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Architectural Refactoring (Zero-OTP and Strategy Payments)

## Current Goal

- Execute refactoring outlined in `001-architectural-decision-change-implementation-build-plan.md` to transition the Unit 03 codebase to the Zero-OTP architecture.

## Completed

- Base project setup (Next.js, dependencies)
- 01-database-schema-setup (Prisma schema defined, migration ran, data seeded)
- 02-auth-customer-otp (OBSOLETE: OTP routes and UI implemented)
- 03-auth-owner-staff (Email/password routes, StaffAccount Prisma schema, middleware, login UI implemented)
- Architecture Pivots documented (Zero-OTP, Payment Strategy Pattern).

## In Progress

- `001-architectural-decision-change-implementation-build-plan.md` refactoring.

## Next Up

- 04-menu-api-routes
- 05-qr-code-generation
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
