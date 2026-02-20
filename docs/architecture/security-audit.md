# Security and Scalability Audit Checklist

## SQL Injection

- Enforce parameterized queries only.
- Reject dynamic SQL concatenation in code review rules.
- Restrict DB role privileges by module responsibility.

## XSS

- Keep React auto-escaping by default.
- Sanitize rich text inputs before persistence/render.
- Set CSP and security headers at edge/app level.

## Payment Fraud

- Verify signatures and event uniqueness.
- Use asynchronous reconciliation jobs.
- Lock account/booking on excessive payment failures.

## Booking Race Conditions

- Use DB row locks + Redis ephemeral locks.
- Keep unique constraints for seat/room commitment records.
- Expire stale holds with background release jobs.

## 500k User Readiness

- Add read replicas and pgbouncer.
- Partition high-volume tables (`bookings`, `payments`, `audit_logs`).
- Use Redis cache-aside with stale-while-revalidate for top search pages.
- Place media behind CDN and compress aggressively.
- Instrument P95 latency SLO for search, booking-hold, and payment-webhook flows.
