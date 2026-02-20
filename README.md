# BlueBird

Scaffold implementation of an Ethiopian multi-vertical travel marketplace architecture.

## Included

- `apps/web`: Next.js app with i18n (`en`, `am`) and locale routing.
- `apps/api`: NestJS modular monolith skeleton with RBAC, domain modules, booking, payment, search, and review endpoints.
- `apps/worker`: BullMQ worker placeholder for async jobs.
- `db/schema.sql`: PostgreSQL schema for properties, tours, cars, bus ticketing, bookings, payments, reviews, admin/disputes, and search.
- `docs/architecture/*`: Implementation architecture, payment flow, and security audit notes.
- `docs/api/endpoints.md`: API route map.
- `infrastructure/docker/docker-compose.yml`: Local PostgreSQL + Redis stack.

## Quick Start

1. Copy `.env.example` to `.env` and adjust credentials.
2. Start infrastructure:
   - `docker compose -f infrastructure/docker/docker-compose.yml up -d`
3. Apply `db/schema.sql` to PostgreSQL.
4. Install workspace dependencies:
   - `pnpm install`
5. Run apps:
   - `pnpm dev:web`
   - `pnpm dev:api`

## Booking E2E Tests

- API E2E suite path: `apps/api/test/booking.e2e-spec.ts`
- Run: `pnpm --filter api test:e2e`
- Coverage includes:
  - property hold success
  - insufficient room inventory rejection
  - bus seat double-booking prevention
  - concurrent lock behavior for property holds
