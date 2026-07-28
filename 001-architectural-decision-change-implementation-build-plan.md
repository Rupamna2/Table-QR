# Architecture Change Implementation Plan (001)

## Context
After completing Unit 03, the core architecture for TableQR Pro was pivoted based on new product decisions. We are transitioning from SMS OTP Authentication for customers to a "Zero-OTP Physical QR Anchoring" system, and abstracting out payment providers using a Strategy Pattern.

This document outlines the refactoring steps required to migrate the existing codebase (which was built up to Unit 03) to align with these new architectural changes before proceeding to Unit 04.

## Required Refactoring Steps

### 1. Revert OTP Functionality
- **Delete OTP Routes**: Remove `src/app/api/auth/send-otp/route.ts` and `src/app/api/auth/verify-otp/route.ts`.
- **Remove UI Components**: Delete `src/components/customer/auth/PhoneAuthForm.tsx` and strip the form from `src/app/(customer)/page.tsx`.

### 2. Update Database Schema
- **Modify `User` Model**:
  - Remove the `phone` field from the `User` model in `prisma/schema.prisma` since sessions are no longer tied to a phone number.
  - Optionally, attach a `sessionId` or link it directly to a `RestaurantTable` session footprint.
- **Migration**: Run `npx prisma migrate dev --name zero_otp_refactor` to update the Supabase database.

### 3. Setup QR Session Middleware
- **Refactor `src/middleware.ts`**:
  - Add logic to intercept requests directed at `/menu/:tableId` (or similar customer endpoints).
  - Extract `ts` (timestamp) and `sig` (cryptographic signature) from URL search params.
  - Validate the timestamp to prevent indefinite replay attacks (e.g., must be generated within the last 3 hours, or however strictly defined).
  - Use `crypto.subtle` (Web Crypto API) to validate the HMAC signature of `tableId + ts` using a new `QR_SECRET` environment variable.
  - On success: set the `active_table_session` HttpOnly cookie and redirect the user to strip the query parameters from the URL.

### 4. Implement Auth Helpers
- **Create Session Validator**: Implement logic in `lib/auth.ts` (or a dedicated `lib/qr-auth.ts`) to validate the `active_table_session` cookie for subsequent API calls (like order placement).

### 5. Payment Factory Stubs
- Scaffold the `lib/payments/` directory with the `IPaymentGateway` interface, `PaymentFactory`, and stubs for `CashPaymentGateway`, `RazorpayGateway`, and `SepoliaCryptoGateway` so that Unit 09/06 can integrate against them seamlessly later.

## Acceptance Criteria
- [ ] OTP routes and UI are completely removed.
- [ ] Database schema is successfully migrated (no `phone` on `User`).
- [ ] A simulated request to `/menu/123?ts=...&sig=...` correctly evaluates the signature in the middleware, assigns the cookie, and strips the parameters.
