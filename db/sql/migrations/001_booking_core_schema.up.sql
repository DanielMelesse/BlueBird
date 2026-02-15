CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL,
  room_type TEXT NOT NULL,
  capacity SMALLINT NOT NULL CHECK (capacity > 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE availability_calendar (
  room_id UUID NOT NULL REFERENCES rooms (id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_inventory INTEGER NOT NULL CHECK (total_inventory >= 0),
  reserved_inventory INTEGER NOT NULL DEFAULT 0 CHECK (reserved_inventory >= 0),
  hold_inventory INTEGER NOT NULL DEFAULT 0 CHECK (hold_inventory >= 0),
  version INTEGER NOT NULL DEFAULT 0 CHECK (version >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT availability_calendar_pk PRIMARY KEY (room_id, date),
  CONSTRAINT availability_inventory_not_oversold CHECK (
    reserved_inventory + hold_inventory <= total_inventory
  )
);

CREATE TABLE booking_holds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  room_id UUID NOT NULL REFERENCES rooms (id) ON DELETE RESTRICT,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  guests SMALLINT NOT NULL CHECK (guests > 0),
  status TEXT NOT NULL CHECK (status IN ('active', 'confirmed', 'released', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  released_at TIMESTAMPTZ,
  idempotency_key TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT booking_holds_date_range_valid CHECK (check_out_date > check_in_date)
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hold_id UUID NOT NULL UNIQUE REFERENCES booking_holds (id) ON DELETE RESTRICT,
  user_id UUID NOT NULL,
  room_id UUID NOT NULL REFERENCES rooms (id) ON DELETE RESTRICT,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (
    status IN ('pending_payment', 'confirmed', 'cancelled', 'completed', 'refunded')
  ),
  total_amount_cents BIGINT NOT NULL CHECK (total_amount_cents >= 0),
  currency CHAR(3) NOT NULL,
  payment_intent_id TEXT,
  cancellation_reason TEXT,
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT bookings_date_range_valid CHECK (check_out_date > check_in_date),
  CONSTRAINT bookings_currency_code_valid CHECK (currency ~ '^[A-Z]{3}$')
);

CREATE TABLE booking_events (
  id BIGSERIAL PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings (id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_version INTEGER NOT NULL DEFAULT 1 CHECK (event_version > 0),
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE TABLE idempotency_keys (
  key TEXT PRIMARY KEY,
  scope TEXT NOT NULL DEFAULT 'api',
  request_hash TEXT,
  status TEXT NOT NULL CHECK (status IN ('processing', 'completed', 'failed')),
  response_code INTEGER,
  response_body JSONB,
  resource_type TEXT,
  resource_id TEXT,
  locked_until TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE outbox_events (
  id BIGSERIAL PRIMARY KEY,
  aggregate_type TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  headers JSONB NOT NULL DEFAULT '{}'::JSONB,
  deduplication_key TEXT,
  partition_key TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  last_error TEXT
);

CREATE UNIQUE INDEX booking_holds_idempotency_key_uq
  ON booking_holds (idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE INDEX availability_calendar_date_idx
  ON availability_calendar (date);

CREATE INDEX booking_holds_room_date_idx
  ON booking_holds (room_id, check_in_date, check_out_date);

CREATE INDEX booking_holds_status_expires_idx
  ON booking_holds (status, expires_at);

CREATE INDEX bookings_user_created_idx
  ON bookings (user_id, created_at DESC);

CREATE INDEX bookings_room_date_idx
  ON bookings (room_id, check_in_date, check_out_date);

CREATE INDEX bookings_status_idx
  ON bookings (status);

CREATE INDEX booking_events_booking_time_idx
  ON booking_events (booking_id, occurred_at DESC);

CREATE INDEX booking_events_unpublished_idx
  ON booking_events (published_at)
  WHERE published_at IS NULL;

CREATE INDEX idempotency_keys_expires_at_idx
  ON idempotency_keys (expires_at);

CREATE INDEX idempotency_keys_locked_until_idx
  ON idempotency_keys (locked_until);

CREATE UNIQUE INDEX outbox_events_deduplication_key_uq
  ON outbox_events (deduplication_key)
  WHERE deduplication_key IS NOT NULL;

CREATE INDEX outbox_events_unpublished_idx
  ON outbox_events (published_at, available_at)
  WHERE published_at IS NULL;

CREATE INDEX outbox_events_aggregate_idx
  ON outbox_events (aggregate_type, aggregate_id, occurred_at DESC);

CREATE TRIGGER rooms_set_updated_at
BEFORE UPDATE ON rooms
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER availability_calendar_set_updated_at
BEFORE UPDATE ON availability_calendar
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER booking_holds_set_updated_at
BEFORE UPDATE ON booking_holds
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER bookings_set_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER idempotency_keys_set_updated_at
BEFORE UPDATE ON idempotency_keys
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
