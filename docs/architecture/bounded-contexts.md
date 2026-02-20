# Bounded Contexts and Ownership

This document finalizes domain boundaries and ownership for the marketplace core modules:
`accommodation`, `tours`, `cars`, `bus`, `booking`, `payment`, and `search`.

## Context Ownership Model

- Each context owns its data schema, invariants, and write APIs.
- Other contexts may read via published queries/views, but cannot write internal tables directly.
- Cross-context workflows are coordinated through explicit application services and domain events.

## Bounded Context Definitions

### Accommodation Context (`accommodation`)

- **Owns**
  - Properties/lodges, room/unit types, amenities mapping, stay policies.
  - Availability and base pricing inputs for accommodation inventory.
- **Must enforce**
  - Inventory cannot drop below zero for any date/unit.
  - Property and room metadata validity for searchable publication.
- **Publishes**
  - `accommodation.inventory.updated`
  - `accommodation.content.published`

### Tours Context (`tours`)

- **Owns**
  - Tour packages, itineraries, departure schedules, capacity rules.
  - Tour-specific inclusions, exclusions, and policy metadata.
- **Must enforce**
  - Departure capacity rules and sellability windows.
  - Tour schedule integrity and active/inactive lifecycle.
- **Publishes**
  - `tours.capacity.updated`
  - `tours.content.published`

### Cars Context (`cars`)

- **Owns**
  - Vehicle catalog, rental conditions, pickup/dropoff locations.
  - Daily availability and rate calendar inputs.
- **Must enforce**
  - Vehicle availability consistency by day/location.
  - Rental policy constraints (minimum days, restrictions).
- **Publishes**
  - `cars.availability.updated`
  - `cars.content.published`

### Bus Context (`bus`)

- **Owns**
  - Operators, routes, trips, seat maps/classes, trip seat inventory.
  - Route/trip lifecycle and seat-level sellability.
- **Must enforce**
  - Seat uniqueness and no double assignment per trip.
  - Trip state rules (scheduled/cancelled/completed).
- **Publishes**
  - `bus.seat_inventory.updated`
  - `bus.trip.updated`

### Booking Context (`booking`)

- **Owns**
  - Unified booking aggregate lifecycle and booking items.
  - Reservation holds and booking state transitions.
- **Must enforce**
  - Valid transitions (`initiated -> pending_payment -> confirmed/cancelled/expired/refunded`).
  - Idempotent booking commands and hold expiration logic.
- **Consumes**
  - Sellability checks from `accommodation`, `tours`, `cars`, `bus`.
  - Payment outcome events from `payment`.
- **Publishes**
  - `booking.created`
  - `booking.confirmed`
  - `booking.cancelled`
  - `booking.expired`

### Payment Context (`payment`)

- **Owns**
  - Payment intents/attempts, provider transactions, refunds, reconciliation records.
  - Webhook verification and payment status transitions.
- **Must enforce**
  - Signature verification and provider-event idempotency.
  - Valid status transitions (`pending/captured/failed/refunded`).
- **Consumes**
  - `booking` checkout initiation requests.
- **Publishes**
  - `payment.captured`
  - `payment.failed`
  - `payment.refunded`

### Search Context (`search`)

- **Owns**
  - Read-optimized search documents/index projections and ranking rules.
  - Query caching strategy and filter normalization.
- **Must enforce**
  - Projection freshness and deterministic query normalization.
  - Read-only behavior (no source-of-truth writes to business entities).
- **Consumes**
  - Publish/inventory/pricing signals from `accommodation`, `tours`, `cars`, `bus`.
  - Booking and payment signals for rank/sellability freshness.
- **Publishes**
  - Optional analytics signals for query and conversion events.

## Integration and Contract Rules

- `booking` is the only context allowed to orchestrate checkout lifecycle across product verticals.
- `payment` never confirms inventory directly; it only reports payment truth.
- Product contexts (`accommodation`, `tours`, `cars`, `bus`) never transition booking status directly.
- `search` is eventually consistent and never blocks booking writes.
- Contracts between contexts are versioned; incompatible changes require a new event/version.

## Source of Truth by Concern

- **Inventory definition**: product contexts (`accommodation`, `tours`, `cars`, `bus`)
- **Booking truth**: `booking`
- **Payment truth**: `payment`
- **Discovery/read optimization**: `search`

## Team Ownership Mapping

- **Supply Domains Team**: `accommodation`, `tours`, `cars`, `bus`
- **Commerce Team**: `booking`, `payment`
- **Discovery Team**: `search`

If team size is small, keep code ownership explicit in module CODEOWNERS while retaining these domain boundaries.
