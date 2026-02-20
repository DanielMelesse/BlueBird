CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('customer', 'hotel_owner', 'tour_operator', 'car_rental_provider', 'bus_operator', 'admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_type') THEN
    CREATE TYPE property_type AS ENUM ('hotel', 'lodge', 'guesthouse');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_service_type') THEN
    CREATE TYPE booking_service_type AS ENUM ('property', 'tour', 'car', 'bus');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE booking_status AS ENUM ('pending_payment', 'confirmed', 'cancelled', 'expired', 'refunded');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_provider') THEN
    CREATE TYPE payment_provider AS ENUM ('telebirr', 'chapa', 'stripe');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code user_role UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  preferred_locale TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES users(id),
  legal_name TEXT NOT NULL,
  business_type user_role NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL DEFAULT 'ET',
  city TEXT NOT NULL,
  area TEXT,
  latitude NUMERIC(9,6) NOT NULL,
  longitude NUMERIC(9,6) NOT NULL
);

CREATE TABLE IF NOT EXISTS cancellation_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_am TEXT NOT NULL,
  refundable_before_hours INT NOT NULL DEFAULT 0,
  penalty_percent NUMERIC(5,2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_am TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type TEXT NOT NULL,
  owner_id UUID NOT NULL,
  url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  type property_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  location_id UUID NOT NULL REFERENCES locations(id),
  cancellation_policy_id UUID REFERENCES cancellation_policies(id),
  check_in_time TIME,
  check_out_time TIME,
  status TEXT NOT NULL DEFAULT 'pending',
  rating_avg NUMERIC(3,2) NOT NULL DEFAULT 0,
  rating_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS property_amenities (
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, amenity_id)
);

CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  capacity_adults INT NOT NULL CHECK (capacity_adults > 0),
  capacity_children INT NOT NULL DEFAULT 0,
  quantity INT NOT NULL CHECK (quantity > 0),
  base_price_etb NUMERIC(12,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS seasonal_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price_etb NUMERIC(12,2) NOT NULL,
  CHECK (end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS room_inventory (
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  stay_date DATE NOT NULL,
  available_count INT NOT NULL CHECK (available_count >= 0),
  PRIMARY KEY (room_id, stay_date)
);

CREATE TABLE IF NOT EXISTS tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  title TEXT NOT NULL,
  description TEXT,
  is_customizable BOOLEAN NOT NULL DEFAULT false,
  days_count INT NOT NULL CHECK (days_count > 0),
  price_per_person_etb NUMERIC(12,2) NOT NULL,
  max_group_size INT NOT NULL CHECK (max_group_size > 0),
  approval_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tour_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  full_name TEXT NOT NULL,
  phone TEXT,
  languages TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS tour_departures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  departure_date DATE NOT NULL,
  seats_total INT NOT NULL CHECK (seats_total > 0),
  seats_available INT NOT NULL CHECK (seats_available >= 0),
  guide_id UUID REFERENCES tour_guides(id),
  UNIQUE (tour_id, departure_date)
);

CREATE TABLE IF NOT EXISTS tour_custom_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES users(id),
  requested_start_date DATE,
  group_size INT NOT NULL CHECK (group_size > 0),
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('SUV', 'Sedan', '4x4')),
  brand TEXT,
  model TEXT,
  seats INT NOT NULL CHECK (seats > 0),
  has_driver_option BOOLEAN NOT NULL DEFAULT true,
  fuel_policy TEXT NOT NULL,
  base_daily_rate_etb NUMERIC(12,2) NOT NULL,
  deposit_etb NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available'
);

CREATE TABLE IF NOT EXISTS car_daily_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  rate_date DATE NOT NULL,
  daily_rate_etb NUMERIC(12,2) NOT NULL,
  UNIQUE (car_id, rate_date)
);

CREATE TABLE IF NOT EXISTS car_availability_calendar (
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  rental_date DATE NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (car_id, rental_date)
);

CREATE TABLE IF NOT EXISTS rental_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location_id UUID NOT NULL REFERENCES locations(id)
);

CREATE TABLE IF NOT EXISTS bus_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS buses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES bus_companies(id) ON DELETE CASCADE,
  plate_number TEXT UNIQUE NOT NULL,
  seat_count INT NOT NULL CHECK (seat_count > 0)
);

CREATE TABLE IF NOT EXISTS bus_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES bus_companies(id) ON DELETE CASCADE,
  origin_location_id UUID NOT NULL REFERENCES locations(id),
  destination_location_id UUID NOT NULL REFERENCES locations(id),
  route_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bus_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES bus_routes(id) ON DELETE CASCADE,
  bus_id UUID NOT NULL REFERENCES buses(id),
  departure_time TIMESTAMPTZ NOT NULL,
  base_price_etb NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled'
);

CREATE TABLE IF NOT EXISTS bus_trip_seats (
  trip_id UUID NOT NULL REFERENCES bus_trips(id) ON DELETE CASCADE,
  seat_no TEXT NOT NULL,
  class_code TEXT NOT NULL DEFAULT 'standard',
  is_active BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (trip_id, seat_no)
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  service_type booking_service_type NOT NULL,
  status booking_status NOT NULL,
  currency_code TEXT NOT NULL DEFAULT 'ETB',
  subtotal_etb NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_etb NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS property_booking_items (
  booking_id UUID PRIMARY KEY REFERENCES bookings(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES rooms(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  rooms_count INT NOT NULL CHECK (rooms_count > 0)
);

CREATE TABLE IF NOT EXISTS tour_booking_items (
  booking_id UUID PRIMARY KEY REFERENCES bookings(id) ON DELETE CASCADE,
  departure_id UUID REFERENCES tour_departures(id),
  custom_request_id UUID REFERENCES tour_custom_requests(id),
  participants INT NOT NULL CHECK (participants > 0)
);

CREATE TABLE IF NOT EXISTS car_booking_items (
  booking_id UUID PRIMARY KEY REFERENCES bookings(id) ON DELETE CASCADE,
  car_id UUID NOT NULL REFERENCES cars(id),
  pickup_location_id UUID NOT NULL REFERENCES rental_locations(id),
  dropoff_location_id UUID NOT NULL REFERENCES rental_locations(id),
  pickup_at TIMESTAMPTZ NOT NULL,
  dropoff_at TIMESTAMPTZ NOT NULL,
  with_driver BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS bus_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  trip_id UUID NOT NULL REFERENCES bus_trips(id),
  seat_no TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'reserved',
  qr_token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (trip_id, seat_no)
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  provider payment_provider NOT NULL,
  amount_etb NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL,
  provider_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  amount_etb NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  reason TEXT
);

CREATE TABLE IF NOT EXISTS payment_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider payment_provider NOT NULL,
  provider_event_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_event_id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  service_type booking_service_type NOT NULL,
  service_id UUID NOT NULL,
  rating_overall INT NOT NULL CHECK (rating_overall BETWEEN 1 AND 10),
  comment TEXT,
  moderation_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (booking_id, user_id)
);

CREATE TABLE IF NOT EXISTS review_category_scores (
  review_id UUID PRIMARY KEY REFERENCES reviews(id) ON DELETE CASCADE,
  cleanliness INT NOT NULL CHECK (cleanliness BETWEEN 1 AND 10),
  value_score INT NOT NULL CHECK (value_score BETWEEN 1 AND 10),
  comfort INT NOT NULL CHECK (comfort BETWEEN 1 AND 10)
);

CREATE TABLE IF NOT EXISTS review_votes (
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  voter_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (review_id, voter_user_id)
);

CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type booking_service_type NOT NULL,
  rate_percent NUMERIC(5,2) NOT NULL,
  active_from DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  opened_by_user_id UUID NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'open',
  summary TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS search_documents (
  service_type booking_service_type NOT NULL,
  entity_id UUID NOT NULL,
  city_id UUID REFERENCES locations(id),
  title TEXT NOT NULL,
  price_min_etb NUMERIC(12,2),
  price_max_etb NUMERIC(12,2),
  rating_avg NUMERIC(3,2),
  available_from DATE,
  available_to DATE,
  lat NUMERIC(9,6),
  lng NUMERIC(9,6),
  attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
  PRIMARY KEY (service_type, entity_id)
);

CREATE INDEX IF NOT EXISTS idx_properties_location_status ON properties (location_id, status);
CREATE INDEX IF NOT EXISTS idx_rooms_property ON rooms (property_id);
CREATE INDEX IF NOT EXISTS idx_room_inventory_lookup ON room_inventory (room_id, stay_date);
CREATE INDEX IF NOT EXISTS idx_seasonal_prices_dates ON seasonal_prices (room_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_tour_departures_date ON tour_departures (tour_id, departure_date);
CREATE INDEX IF NOT EXISTS idx_cars_vendor_status ON cars (vendor_id, status);
CREATE INDEX IF NOT EXISTS idx_car_availability_date ON car_availability_calendar (car_id, rental_date);
CREATE INDEX IF NOT EXISTS idx_bus_route_origin_dest ON bus_routes (origin_location_id, destination_location_id);
CREATE INDEX IF NOT EXISTS idx_bus_trip_departure ON bus_trips (route_id, departure_time);
CREATE INDEX IF NOT EXISTS idx_bookings_user_created ON bookings (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_booking_status ON payments (booking_id, status);
CREATE INDEX IF NOT EXISTS idx_reviews_service ON reviews (service_type, service_id, moderation_status);
CREATE INDEX IF NOT EXISTS idx_disputes_status_created ON disputes (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_documents_filters ON search_documents (service_type, city_id, price_min_etb, rating_avg);
CREATE INDEX IF NOT EXISTS idx_search_documents_attributes_gin ON search_documents USING gin (attributes jsonb_path_ops);
