# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Owner/Staff Auth + Roles (Unit 03) Complete

## Current Goal

- Begin Unit 04: Menu API Routes
  (`context/feature-specs/04-menu-api-routes.md`)

## Completed

- Base project setup (Next.js, dependencies)
- 01-database-schema-setup (Prisma schema defined, migration ran, data seeded)
- 02-auth-customer-otp (OTP routes and UI implemented)
- 03-auth-owner-staff (Email/password routes, StaffAccount Prisma schema, middleware, login UI implemented)

## In Progress

- None yet.

## Next Up

- 04-menu-api-routes
- 05-qr-code-generation
- (full order in `context/feature-specs/00-build-plan.md`)

## Open Questions

- Payment gateway choice for a real (non-MVP) launch is
  unresolved — MVP records `payment_mode` without live
  gateway integration. Must be resolved before any
  "payments-provider" spec is written.
- Whether guest checkout (no OTP) is acceptable for a pilot
  restaurant is unresolved — MVP requires OTP auth for all
  orders.

## Architecture Decisions

- Collapsed the originally proposed separate Node/Express +
  Socket.io backend into Next.js API routes + Supabase
  Realtime, to reduce system boundaries for MVP. See
  `architecture.md` Stack table note.
- Payments are recorded, not processed, in MVP (no live
  gateway call). See `architecture.md` Stack table.

## Session Notes

- Full six-file context system and build plan generated
  from the original TableQR Pro product blueprint. The
  blueprint's 60+ feature list was intentionally reduced to
  a 16-unit MVP build plan; everything not in the MVP is
  logged under "Phase 2 Backlog" in `project-overview.md`
  and must not be built without a new spec file.
