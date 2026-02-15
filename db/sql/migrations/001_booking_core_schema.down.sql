DROP TRIGGER IF EXISTS idempotency_keys_set_updated_at ON idempotency_keys;
DROP TRIGGER IF EXISTS bookings_set_updated_at ON bookings;
DROP TRIGGER IF EXISTS booking_holds_set_updated_at ON booking_holds;
DROP TRIGGER IF EXISTS availability_calendar_set_updated_at ON availability_calendar;
DROP TRIGGER IF EXISTS rooms_set_updated_at ON rooms;

DROP TABLE IF EXISTS outbox_events;
DROP TABLE IF EXISTS idempotency_keys;
DROP TABLE IF EXISTS booking_events;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS booking_holds;
DROP TABLE IF EXISTS availability_calendar;
DROP TABLE IF EXISTS rooms;

DROP FUNCTION IF EXISTS set_updated_at();
