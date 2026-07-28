# Architecture Context

## Stack

| Layer      | Technology                         | Role                                      |
| ---------- | ----------------------------------- | ------------------------------------------ |
| Framework  | Next.js 14 (App Router) + TypeScript | Single deployable for customer + owner UI + API routes |
| UI         | Tailwind CSS + shadcn/ui            | Styling and component primitives |
| Animation  | Framer Motion                       | Cart/status transitions only — not required for MVP core flow |
| Auth       | Edge Middleware + QR Anchoring      | Customer identity is bound to a 3-hour secure session cookie derived from a cryptographically signed QR code. Owner/staff use email+password via Supabase Auth. |
| Database   | Supabase PostgreSQL + Prisma ORM    | System of record for all structured data |
| Realtime   | Supabase Realtime                   | Order status push to customer + owner dashboard |
| File/Image | Cloudinary (free tier)              | Menu item photos |
| Payments   | Abstract Payment Gateway Strategy   | Unified `IPaymentGateway` interface via `PaymentFactory`. Supported: `RazorpayGateway`, `CashPaymentGateway`, `SepoliaCryptoGateway`. |
| Deployment | Vercel                              | Hosts Next.js app (frontend + API routes) |

Note: the original vision listed a separate Node/Express + Socket.io backend on Railway. For MVP this is collapsed into Next.js API routes + Supabase Realtime to reduce system boundaries.

## System Boundaries

- `app/(customer)/` — owns all customer-facing routes (menu, cart, checkout, order tracking). No direct DB writes from client components; goes through `app/api/`. Access is governed by the `active_table_session` cookie validated in edge middleware.
- `app/(owner)/` — owns all owner-facing dashboard routes. Every route in this boundary requires an authenticated owner/staff session via Supabase Auth.
- `app/api/` — owns all server-side logic: validation, auth checks, DB reads/writes, third-party calls (Cloudinary, Payments, Supabase). No UI-only logic here.
- `lib/` — owns shared server/client utilities (Supabase client, QR token generation/validation, formatting helpers, payment strategy factory).
- `prisma/` — owns the DB schema definition.
- `components/` — owns presentational and stateful UI components, split into `customer/`, `owner/`, `shared/`. No direct DB or Supabase calls from this folder.

## Storage Model

- **Database (Supabase Postgres via Prisma)**: all structured data. This is the single source of truth for anything referenced by ID elsewhere in the system.
- **Blob Storage (Cloudinary)**: menu item photos only. The database stores the resulting `photo_url`.

## Auth and Access Model

- **Customers (Zero-OTP)**: Customer sessions are created via "Physical QR Anchoring". The QR URL contains a cryptographically signed signature (`sig`) and timestamp (`ts`). Edge Middleware validates these and sets a 3-hour secure HttpOnly cookie (`active_table_session`).
- **Owner/Staff**: Authenticate via Supabase email+password into the `StaffAccount` table. MVP has two roles: `owner` (full access) and `staff` (order board + stock toggle only).
- **Conditional Security Checks**: When submitting an order:
  - Online payments (UPI/Cards): Security is implicitly verified by successful payment.
  - Cash-at-Table: Enforces a soft Network/IP matching check or Geofencing check against the restaurant's known broadband IP to confirm physical presence and prevent ghost orders.

## Invariants

1. Request handlers in `app/api/` do not run long-lived background work (e.g. AI batch jobs).
2. No component under `app/(customer)/` or `app/(owner)/` queries the database directly; all data access goes through `app/api/` route handlers.
3. A `qr_token` and its signed URL immutably identify one `RestaurantTable` row for a 3-hour window.
4. An order's `status` transitions only through the sequence `pending → confirmed → preparing → ready → completed`, or to `cancelled` from any pre-`completed` state. No route may write an out-of-sequence status.
5. Money fields (`price`, `total_amount`, `discount`, `final_amount`, `unit_price`, `extra_price`) are `DECIMAL`, never floating point, at every layer.
