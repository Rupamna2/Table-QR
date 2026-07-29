# AI Workflow Rules

## Approach

Build TableQR Pro incrementally using a spec-driven
workflow. Context files define what to build, how to build
it, and the current state of progress. Always implement
against `context/feature-specs/*.md` — do not infer or
invent behavior from scratch, and do not pull features from
the "Phase 2 Backlog" in `project-overview.md` until a spec
file for them exists.

## Scoping Rules

- Work on exactly one feature unit (one numbered file in
  `context/feature-specs/`) at a time, in the order defined
  by `00-build-plan.md`.
- Prefer small, verifiable increments over large
  speculative changes — e.g. build the order API before
  wiring the checkout UI to it, even though they feel like
  "one feature" conversationally.
- Do not combine unrelated system boundaries in a single
  implementation step (e.g. do not touch both
  `app/(owner)/` and `app/api/orders` in the same unit
  unless the spec explicitly scopes both).

## When to Split Work

Split an implementation step if it combines:

- UI changes and realtime/background task changes (e.g.
  building the live order board UI and wiring Supabase
  Realtime subscriptions are two units)
- Multiple unrelated API routes (e.g. menu CRUD and order
  status transitions are two units)
- Behavior not clearly defined in the context files (stop
  and resolve it first — see below)

If a change cannot be verified end to end quickly, the
scope is too broad — split it.

## Handling Missing Requirements

- Do not invent product behavior not defined in the
  context files, including anything listed under "Phase 2
  Backlog" in `project-overview.md`.
- If a requirement is ambiguous, resolve it in the relevant
  context file before implementing.
- If a requirement is missing, add it as an open question
  in `progress-tracker.md` before continuing.

## Protected Files

Do not modify the following unless explicitly instructed:

- `components/ui/*` — generated shadcn/ui library
  components
- `prisma/schema.prisma` outside of the unit that owns the
  relevant tables (see `00-build-plan.md` for which unit
  owns which tables)
- Any third-party library internals in `node_modules`

## Keeping Docs in Sync

Update the relevant context file whenever implementation
changes:

- System architecture or boundaries → `architecture.md`
- Storage model decisions → `architecture.md`
- Code conventions or standards → `code-standards.md`
- Feature scope → `project-overview.md`

## Before Moving to the Next Unit

1. The current unit works end to end within its defined
   scope
2. No invariant defined in `architecture.md` was violated
3. `progress-tracker.md` reflects the completed work
4. `npm run build` passes
