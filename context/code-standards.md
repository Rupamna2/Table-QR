# Code Standards

## General

- Keep modules small and single-purpose; a file that
  handles both order-status transitions and payment
  recording should be split.
- Fix root causes — do not layer a workaround (e.g. a
  client-side status "fixup") over a server bug.
- Do not mix unrelated concerns in one component or route
  (e.g. a menu-item API route must not also update loyalty
  points — that concern doesn't exist until specced).

## TypeScript

- Strict mode is required throughout the project.
- Avoid `any` — use explicit interfaces or narrowly scoped
  types. Prisma-generated types are the source of truth
  for DB shapes; do not hand-roll parallel types.
- Validate unknown external input (request bodies, query
  params, webhook payloads) at system boundaries with `zod`
  before trusting it.

## Next.js

- Default to server components.
- Add `"use client"` only when browser interactivity
  (state, event handlers, effects) requires it.
- Keep route handlers in `app/api/` focused on a single
  responsibility: validate → authorize → execute → return.
  Extract multi-step business logic into `lib/` helpers if
  a handler exceeds ~40 lines.

## Styling

- Use CSS custom property tokens defined in
  `ui-context.md` — no hardcoded hex values in components.
- Follow the border radius scale defined in
  `ui-context.md`.
- Mobile-first: customer-facing routes are designed for a
  single mobile viewport first, then adapted for larger
  screens if needed.

## API Routes

- Validate and parse request input (via `zod`) before any
  logic runs.
- Enforce auth and ownership before any mutation — see
  the Auth and Access Model in `architecture.md`.
- Return consistent, predictable response shapes:
  `{ data, error }` on every route, never a bare array or
  bare object on success paths.
- Order-status transitions must be validated against
  Invariant 4 in `architecture.md` before writing.

## Data and Storage

- Metadata belongs in the database (Postgres via Prisma).
- Menu item photos belong in Cloudinary; only the
  resulting URL is stored in the database.
- Do not store large content (images, generated files)
  directly in the database.

## File Organization

- `app/(customer)/` — customer-facing pages and layouts
- `app/(owner)/` — owner/staff dashboard pages and layouts
- `app/api/` — all server route handlers
- `components/customer/`, `components/owner/`,
  `components/shared/` — UI components scoped by audience
- `lib/` — shared utilities (Supabase client, QR token
  logic, formatting, validation schemas)
- `prisma/` — schema and migrations
