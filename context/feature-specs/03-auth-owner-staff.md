# Unit 03 — Owner/Staff Auth + Roles

## Goal

Let an owner or staff member log in with email+password and
establish a role-checked session that gates every route
under `app/(owner)/`.

## Design

Minimal login form on `--bg-base`, centered card
(`--bg-surface`, `rounded-2xl`). No dashboard UI yet — that
is Unit 11.

## Implementation

1. Add `role` field (`owner` | `staff`) to the `User` model
   scope — implemented as a separate `StaffAccount` table
   (not `User`, which is customer-scoped) with `email`,
   `password_hash` (managed by Supabase Auth), `role`.
2. `app/api/auth/staff-login/route.ts` — validates
   credentials via Supabase Auth, returns session +
   `role`.
3. Add Next.js middleware for `app/(owner)/*` that checks
   for a valid staff session server-side and redirects to
   login if absent. This is the enforcement point referenced
   in the Auth and Access Model in `architecture.md`.
4. Role gate helper in `lib/auth.ts`: `requireRole(session,
   ['owner'])` used inside `app/api/` handlers that are
   owner-only (e.g. menu pricing changes in Unit 14).

## Dependencies

- `@supabase/supabase-js`

## Verification Checklist

- [ ] An unauthenticated request to any `app/(owner)/*`
      route redirects to login
- [ ] A `staff`-role session can reach the order board route
      but is blocked from owner-only API routes (verified
      once Unit 14 exists — stub the check now)
- [ ] Role check happens server-side in middleware/route
      handlers, not only in client UI
- [ ] `npm run build` passes
