# Unit 05 — QR Code Generation + Table Token Validation

## Goal

Provide owner tooling to generate printable QR codes for
each table, embedding cryptographic signatures for the Zero-OTP customer session auth.

## Design

Simple owner dashboard view (stubbed for now, finalized in Unit 14) containing a list of tables and a "Generate QR" button per table.

## Implementation

1. `app/api/tables/[id]/qr/route.ts` (POST) — owner-only.
   - Generates a new cryptographic signature `sig` and timestamp `ts` utilizing a server-side HMAC secret (`QR_SECRET`).
   - Updates the `RestaurantTable` row with this signature metadata to track validity.
   - Generates the actual PNG/SVG of the QR code pointing to `https://app.tableqr.pro/menu/[tableId]?ts=[timestamp]&sig=[signature]`.
2. `lib/qrcode.ts` — utility wrapping a QR code library
   (e.g., `qrcode`) to output base64 data URIs.

## Dependencies

- `qrcode` (or similar node library)
- `crypto` (for HMAC generation)

## Verification Checklist

- [ ] A generated QR code successfully points to the table URL with `ts` and `sig` query params.
- [ ] Only an owner/staff session can trigger generation.
- [ ] `npm run build` passes.
