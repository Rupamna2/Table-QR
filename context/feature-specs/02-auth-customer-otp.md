# Unit 02 — Customer Auth (Phone OTP)

## Goal

Let a customer verify their phone number via OTP and
receive an authenticated Supabase session tied to a `User`
row, without requiring an app install.

## Design

No custom UI beyond a minimal phone-entry + OTP-entry form
using `--bg-surface` card on `--bg-base`, primary button in
`--accent-primary`. Full menu-page design is Unit 07/08 —
this unit's UI is intentionally minimal.

## Implementation

1. `app/api/auth/send-otp/route.ts` — accepts phone number,
   validates format with `zod`, calls Supabase Auth OTP
   send.
2. `app/api/auth/verify-otp/route.ts` — accepts phone + OTP
   code, verifies via Supabase, creates/links a `User` row
   if one doesn't exist for that phone, returns session.
3. `lib/supabase.ts` — shared client/server Supabase client
   factory (server client must use service role only inside
   `app/api/`, never exposed client-side).
4. Minimal phone/OTP entry UI component in
   `components/customer/auth/`.

## Dependencies

- `@supabase/supabase-js`
- `zod`

## Verification Checklist

- [ ] A new phone number completes OTP flow and a `User`
      row is created with that phone
- [ ] A returning phone number completes OTP flow and
      reuses the existing `User` row (no duplicates)
- [ ] Invalid phone format is rejected before any Supabase
      call, with a consistent `{ data, error }` response
- [ ] Service role key is never referenced in client
      components
- [ ] `npm run build` passes
