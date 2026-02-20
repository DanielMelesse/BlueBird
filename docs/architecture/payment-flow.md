# Payment Flow and State Machine

```mermaid
flowchart LR
  A[Create booking hold] --> B[Create payment intent]
  B --> C{Gateway}
  C -->|Telebirr| D[Provider callback]
  C -->|Chapa| E[Provider callback]
  C -->|Stripe| F[Provider callback]
  D --> G[Webhook endpoint]
  E --> G
  F --> G
  G --> H[Verify signature]
  H --> I[Idempotency check]
  I --> J{Status}
  J -->|paid| K[Mark payment captured]
  K --> L[Confirm booking]
  J -->|failed| M[Release hold]
  J -->|refund| N[Create refund record]
```

## Order State Machine

- `initiated`
- `pending_payment`
- `confirmed`
- `cancelled`
- `expired`
- `refunded`

## Fraud Countermeasures

- Provider signature verification for each webhook.
- Idempotency event persistence (`provider + provider_event_id` unique).
- API rate limiting per IP/user for checkout endpoints.
- Risk rules for high-value transactions and frequent failures.
