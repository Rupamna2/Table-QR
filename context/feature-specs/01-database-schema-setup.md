# Unit 01 — Database Schema Setup

## Goal

Stand up the Supabase PostgreSQL database and Prisma schema
covering all MVP tables, so every later unit has a real
data model to build against.

## Design

No UI in this unit. N/A for `ui-context.md`.

## Implementation

1. Create Supabase project; capture `SUPABASE_URL` and
   `SUPABASE_ANON_KEY` into `.env.local` (never committed).
2. Initialize Prisma; point `DATABASE_URL` at the Supabase
   Postgres connection string.
3. Define `prisma/schema.prisma` models for MVP scope only:
   `User`, `RestaurantTable`, `Category`, `MenuItem`,
   `ItemVariant`, `Order`, `OrderItem`, `Survey`,
   `SurveyQuestion`, `SurveyResponse`, `Rating`. Use
   `Decimal` for all money fields per Invariant 5 in
   `architecture.md`.
4. Do **not** create tables for anything in the Phase 2
   Backlog (loyalty, promotions, CRM, push notifications) —
   they are out of scope until specced.
5. Run initial migration (`prisma migrate dev`) against
   Supabase.
6. Seed a minimal dev dataset: 1 restaurant table, 2
   categories, 4 menu items with 1 variant each.

## Dependencies

- `@prisma/client`, `prisma` (dev)
- `@supabase/supabase-js`

## Verification Checklist

- [ ] `prisma migrate dev` runs cleanly with no manual
      SQL fixes
- [ ] All MVP tables exist in Supabase with correct column
      types, including `Decimal` for every money field
- [ ] Seed script populates dev data and can be re-run
      idempotently
- [ ] No table exists for a Phase 2 Backlog feature
- [ ] `npm run build` passes
