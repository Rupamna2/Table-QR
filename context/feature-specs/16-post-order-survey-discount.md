# Unit 16 — Post-Order Survey → Discount

## Goal

Prompt the customer for a short survey after their order
reaches `completed` status, and issue a discount code on
submission, closing the MVP core loop.

## Design

On the Unit 10 tracking page, once status reaches
`completed`, show a dismissible `--bg-surface` card:
"Take a 3-min survey & get a discount on your next order" →
opens a `rounded-3xl` modal with a small set of rating/text
questions.

## Implementation

1. `app/api/surveys/active/route.ts` — public `GET`, returns
   the current active survey and its questions.
2. `app/api/surveys/submit/route.ts` — requires customer
   session; writes `SurveyResponse`, sets
   `orders.survey_done = true` for the relevant order,
   generates a discount code string (simple: `SURVEY-` +
   short random suffix, tied to `discount_pct` from the
   `Survey` row). Discount **code generation only** — full
   `promotions` table validation/redemption at future
   checkout is Phase 2 Backlog; for MVP, display the code to
   the customer as a takeaway (not yet redeemable).
3. `components/customer/survey/SurveyModal.tsx`.
4. Survey prompt does not block the tracking page and can be
   dismissed without penalty.

## Dependencies

- None new

## Verification Checklist

- [ ] Survey prompt only appears once order status is
      `completed`, and only once per order
      (`survey_done` guards re-prompting)
- [ ] Submitting the survey writes a `SurveyResponse` row and
      displays a discount code to the customer
- [ ] Dismissing the survey does not error or block the
      tracking page
- [ ] `npm run build` passes
