# Build Plan — TableQR Pro MVP

Strict build order. Do not start unit N+1 until unit N
meets its Verification Checklist and `progress-tracker.md`
is updated. Ordering rationale: dependencies first,
security before functionality, backend before frontend
wiring, UI shells before real data.

| # | Unit | Boundary | Depends On |
|---|------|----------|------------|
| 01 | Database Schema Setup | `prisma/` | — |
| 02 | Customer Auth (Zero-OTP QR Session) | `middleware.ts`, `lib/qr-auth.ts` | 01 |
| 03 | Owner/Staff Auth + Roles | `app/api/auth`, `app/(owner)` middleware | 01 |
| 04 | Menu API Routes | `app/api/menu` | 01 |
| 05 | QR Code Generation + Table Token Validation | `lib/qrcode`, `app/api/tables` | 01, 03 |
| 06 | Order API Routes | `app/api/orders` | 01, 02, 04 |
| 07 | Customer Menu UI Shell (placeholder data) | `app/(customer)/menu` | — (parallel-safe with 02–06) |
| 08 | Wire Menu UI to Menu API | `app/(customer)/menu` | 04, 07 |
| 09 | Cart & Checkout Flow | `app/(customer)/cart`, `app/(customer)/order` | 02, 05, 06, 08 |
| 10 | Realtime Order Tracking (customer + owner) | `lib/supabase` realtime, `app/(customer)/track`, `app/(owner)/orders` | 06, 09 |
| 11 | Owner Dashboard UI Shell (placeholder stats) | `app/(owner)/dashboard` | 03 |
| 12 | Owner Dashboard Stats API + Wiring | `app/api/dashboard`, `app/(owner)/dashboard` | 06, 11 |
| 13 | Live Order Board (accept/update status) | `app/(owner)/orders` | 06, 10 |
| 14 | Owner Menu Manager UI (CRUD + stock toggle) | `app/(owner)/menu` | 04, 05 |
| 15 | Payment Gateway Strategy Integration | `app/api/payments`, `lib/payments/` | 06, 09 |
| 16 | Post-Order Survey → Discount | `app/api/surveys`, `app/(customer)/track` | 06, 10 |

## Phase 2 Backlog (Not Sequenced — No Spec Yet)

AI forecasting/insights, loyalty program, customer CRM,
promo/coupon manager, push notifications, group ordering,
multi-language, social share, pre-order/scheduling, staff
permission granularity, CSV/PDF export, peak-hour AI
analytics. Each requires its own spec file and an updated
`project-overview.md` entry before it enters this table.
