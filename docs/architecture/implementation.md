# Implementation Notes (Plan Realization)

## System Model

- Modular monolith in NestJS with explicit domain modules.
- Frontend on Next.js with locale-prefixed routes (`/en`, `/am`).
- PostgreSQL as source of truth, Redis for cache and reservation locks.
- Worker process for async notifications and webhook follow-up retries.

## Booking Race Condition Prevention

- **Property inventory**
  - Redis short lock for API-level burst control.
  - PostgreSQL transaction with `SELECT ... FOR UPDATE` on `room_inventory`.
  - Atomic decrement of all date rows in the stay window.
- **Bus seat inventory**
  - Redis seat lock key: `seatlock:{trip}:{seat}` with TTL.
  - DB uniqueness on `(trip_id, seat_no)` in `bus_tickets`.
  - `FOR UPDATE` on `bus_trip_seats` before insert.

## Payment Security Baseline

- Webhook signature verification with HMAC and timing-safe compare.
- Idempotency table `payment_webhook_events` with unique provider event IDs.
- Payment statuses transition through pending/captured/failed/refunded.
- Booking confirmation should occur on webhook truth, not client redirect.

## Unified Search Performance Strategy

- Denormalized `search_documents` table for all verticals.
- Composite filter index: `(service_type, city_id, price_min_etb, rating_avg)`.
- GIN index on JSONB attributes for amenity/service-specific filters.
- Redis cache (60s default) keyed by normalized query hash.

## i18n and Ethiopia Localization

- English default, Amharic secondary locale.
- Currency formatting done with `ETB` + locale-specific formatter.
- Locale routing middleware configured in Next.js.

## Security and Reliability

- JWT + RBAC guards in API.
- Audit log table for sensitive actions.
- Disputes and moderation entities included for operations.
- Designed for horizontal API scaling with stateless app nodes + Redis.
