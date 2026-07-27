# Architecture Context

## Stack

| Layer      | Technology                         | Role                                      |
| ---------- | ----------------------------------- | ------------------------------------------ |
| Framework  | Next.js 14 (App Router) + TypeScript | Single deployable for customer + owner UI + API routes |
| UI         | Tailwind CSS + shadcn/ui            | Styling and component primitives |
| Animation  | Framer Motion                       | Cart/status transitions only — not required for MVP core flow |
| Auth       | Supabase Auth (Phone OTP)           | Customer identity; owner/staff use email+password via Supabase Auth |
| Database   | Supabase PostgreSQL + Prisma ORM    | System of record for all structured data |
| Realtime   | Supabase Realtime                   | Order status push to customer + owner dashboard |
| File/Image | Cloudinary (free tier)              | Menu item photos |
| Payments   | Manual payment_mode recording (MVP) | Card/UPI/cash selection recorded on the order; no live gateway integration until a payments-provider spec exists |
| Deployment | Vercel                              | Hosts Next.js app (frontend + API routes) |

Note: the original vision listed a separate Node/Express +
Socket.io backend on Railway. For MVP this is collapsed
into Next.js API routes + Supabase Realtime to reduce
system boundaries. A standalone realtime service is only
introduced if Supabase Realtime proves insufficient —
that decision must be logged in `progress-tracker.md`
before implementing.

## System Boundaries

- `app/(customer)/` — owns all customer-facing routes
  (menu, cart, checkout, order tracking). No direct DB
  writes from client components; goes through `app/api/`.
- `app/(owner)/` — owns all owner-facing dashboard routes.
  Every route in this boundary requires an authenticated
  owner/staff session.
- `app/api/` — owns all server-side logic: validation,
  auth checks, DB reads/writes, third-party calls
  (Cloudinary, Supabase). No UI-only logic here.
- `lib/` — owns shared server/client utilities (Supabase
  client, QR token generation/validation, formatting
  helpers). No business rules that belong in `app/api/`.
- `prisma/` — owns the DB schema definition (source of
  truth for table structure, mirrored from
  `progress-tracker.md` schema decisions).
- `components/` — owns presentational and stateful UI
  components, split into `customer/`, `owner/`, `shared/`.
  No direct DB or Supabase calls from this folder.

## Storage Model

- **Database (Supabase Postgres via Prisma)**: all
  structured data — users, tables, categories, menu items,
  variants, orders, order items, surveys, survey
  responses, ratings. This is the single source of truth
  for anything referenced by ID elsewhere in the system.
- **Blob Storage (Cloudinary)**: menu item photos only.
  The database stores the resulting `photo_url`, never the
  binary image data.

## Auth and Access Model

- **Customers** authenticate via Supabase phone OTP. A
  customer session is scoped to placing/viewing their own
  orders and ratings — never another customer's data.
- **Owner/Staff** authenticate via Supabase email+password.
  MVP has exactly two roles: `owner` (full access) and
  `staff` (order board + stock toggle only, no menu
  pricing or settings access). Additional granular
  permissions are Phase 2 Backlog.
- **Table context** is established via a signed `qr_token`
  in the URL, not by customer auth — a customer can view a
  table's menu before authenticating, but must authenticate
  to place an order.
- Every owner-dashboard API route must verify the caller's
  role server-side before returning data or accepting a
  mutation. Client-side role checks are UI convenience only
  and are never trusted for access control.

## Invariants

1. Request handlers in `app/api/` do not run long-lived
   background work (e.g. AI batch jobs) — those belong to
   a scheduled job or separate worker, introduced only when
   a spec for them exists.
2. No component under `app/(customer)/` or
   `app/(owner)/` queries the database directly; all data
   access goes through `app/api/` route handlers.
3. A `qr_token` uniquely and immutably identifies one
   `restaurant_tables` row. Regenerating a table's QR code
   invalidates the previous token.
4. An order's `status` transitions only through the
   sequence `pending → confirmed → preparing → ready →
   completed`, or to `cancelled` from any pre-`completed`
   state. No route may write an out-of-sequence status.
5. Money fields (`price`, `total_amount`, `discount`,
   `final_amount`, `unit_price`, `extra_price`) are
   `DECIMAL`, never floating point, at every layer
   including API payloads (stringified decimals, not
   floats).
