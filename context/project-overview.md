# TableQR Pro

## Overview

TableQR Pro is a QR-code-based, contactless restaurant
ordering platform. A diner scans a unique QR code fixed
to their table, browses a visual digital menu in-browser
(no app install), places an order, tracks its status in
real time, and pays digitally. Restaurant owners manage
menu, live orders, and basic sales analytics from a web
dashboard. Built for independent restaurants and small
chains that want a modern ordering experience without
enterprise POS costs.

## Goals

1. A customer can go from QR scan to a confirmed, paid
   order in under 2 minutes with zero app install.
2. A restaurant owner can manage the entire order
   lifecycle (menu, live orders, stock) from one
   dashboard without staff retraining.
3. The system is deployable end-to-end on free-tier
   infrastructure for a demo/pilot restaurant.

## Core User Flow

1. Customer scans table QR code → lands on menu (table
   context auto-attached via token in URL)
2. Customer authenticates via phone OTP (or continues as
   guest, if enabled in a later phase)
3. Customer browses categorized menu, adds items with
   variants/notes to cart
4. Customer reviews cart, selects payment method, submits
   order
5. Kitchen/owner dashboard receives order in real time
6. Customer sees live status updates (Received → Preparing
   → Ready)
7. Owner marks order complete; customer is optionally
   prompted for a post-order survey/discount

## Features

### MVP (In Scope — see 00-build-plan.md for sequencing)

- QR scan → table-scoped menu (no app install)
- Visual digital menu with categories, variants, photos,
  allergens
- Cart with item customization and special notes
- Phone OTP customer authentication
- Order placement and payment (card/UPI/cash)
- Real-time order status tracking (customer + owner)
- Owner dashboard: live order board, accept/update status
- Owner menu manager (CRUD items, toggle stock)
- Owner sales stats (today's revenue, order count, top
  items)
- Table QR code generation
- Post-order survey trigger with discount code issuance

### Phase 2 Backlog (Explicitly Deferred — Not Yet Specced)

These appear in the original product vision but are
**not** part of the current build plan. They must not be
implemented until a feature-spec file exists for them:

- AI demand forecasting / "make more of" kitchen alerts
- AI menu advisor and weather-based demand adjustment
- Customer CRM and segmentation
- Loyalty points program
- Promo/coupon manager beyond survey-triggered discounts
- Push notifications
- Group ordering (multi-device synced cart per table)
- Multi-language auto-translation
- Social share promotions
- Pre-order / scheduled ordering
- Staff account management / granular permissions
  (MVP has owner + single staff role only)
- CSV/PDF order export
- Peak-hour AI analytics (basic hourly chart only in MVP)

## Scope

### In Scope

- Single-restaurant deployment (multi-tenant is out of
  scope for MVP)
- Web-based PWA, mobile-first, no native app
- Card/UPI/cash payment recording (see architecture.md
  for payment provider boundary)

### Out of Scope

- Multi-restaurant / multi-tenant SaaS support
- Native iOS/Android apps
- Kitchen display hardware integration
- Everything listed in "Phase 2 Backlog" above

## Success Criteria

1. A customer can scan a QR code, order, pay, and see
   live status updates without creating a persistent
   account beyond OTP verification.
2. An owner can see a new order appear on the live order
   board within 2 seconds of submission, without a page
   refresh.
3. An owner can add/edit/disable a menu item and see it
   reflected on the customer menu without redeploying.
4. `npm run build` passes at the close of every unit in
   `00-build-plan.md`.
