# BlueBird API Surface (v1)

All routes are prefixed with `/v1`.

## Auth and IAM

- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`
- `GET /users/profile`

## Property Marketplace

- `POST /properties`
- `GET /properties/search`
- `GET /properties/:id`
- `POST /properties/:id/rooms`
- `POST /availability/rooms/check`
- `POST /pricing/properties/quote`
- `POST /bookings/properties/hold`

## Tours

- `POST /tours`
- `GET /tours/search`
- `GET /tours/:id`
- `POST /tours/:id/custom-requests`
- `POST /bookings/tours/hold` (planned)

## Cars

- `POST /cars`
- `GET /cars/search`
- `GET /cars/:id/availability`
- `POST /bookings/cars/hold` (planned)

## Bus

- `POST /bus/operators`
- `GET /bus/routes/search`
- `GET /bus/trips/:tripId/seats`
- `POST /bookings/bus/seat-hold`

## Reviews

- `POST /reviews` (verified booking only)
- `GET /reviews/:serviceType/:serviceId`
- `POST /reviews/:id/helpful`
- `PATCH /reviews/admin/:id/moderate`

## Payments

- `POST /payments/intent`
- `POST /payments/webhooks/:provider`
- `POST /payments/:id/refund` (planned)

## Search

- `GET /search`
  - `serviceType`
  - `cityId`
  - `checkIn`
  - `checkOut`
  - `minPrice`
  - `maxPrice`
  - `minRating`
  - `sort` (`price_asc`, `price_desc`, `rating_desc`)

## Vendor/Admin

- `GET /vendor/dashboard`
- `GET /admin/kpis`
