-- ============================================================
-- Migration 002: bookings + booking_travelers
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- Run AFTER 001_customers.sql and after products table exists
-- ============================================================

-- Products table (treks, tours, camping, rentals, heritage walks)
create table if not exists public.products (
  id                uuid        primary key default gen_random_uuid(),
  name              text        not null,
  slug              text        not null unique,
  product_type      text        not null default 'trek',  -- trek | tour | camping | rental | heritage
  region            text,
  location          text,
  duration_label    text,
  altitude_label    text,
  short_description text,
  description       text,
  base_price        numeric(10,2) not null default 0,
  compare_at_price  numeric(10,2),
  rating            numeric(3,1) default 0,
  review_count      integer      default 0,
  primary_image_url text,
  gallery           jsonb        not null default '[]',
  is_featured       boolean      not null default false,
  is_active         boolean      not null default true,
  sort_order        integer      not null default 0,
  extra_content     jsonb        not null default '{}',
  created_at        timestamptz  not null default now(),
  updated_at        timestamptz  not null default now()
);

create index if not exists products_slug_idx         on public.products (slug);
create index if not exists products_type_idx         on public.products (product_type);
create index if not exists products_is_active_idx    on public.products (is_active);
create index if not exists products_is_featured_idx  on public.products (is_featured);

-- Product batches (scheduled departure dates per product)
create table if not exists public.product_batches (
  id           uuid        primary key default gen_random_uuid(),
  product_id   uuid        not null references public.products (id) on delete cascade,
  batch_date   date        not null,
  available    boolean     not null default true,
  seats_total  integer     not null default 30,
  seats_booked integer     not null default 0,
  price        numeric(10,2),
  notes        text,
  created_at   timestamptz not null default now()
);

create index if not exists product_batches_product_id_idx  on public.product_batches (product_id);
create index if not exists product_batches_batch_date_idx  on public.product_batches (batch_date);

-- Bookings
create table if not exists public.bookings (
  id                      uuid         primary key default gen_random_uuid(),
  booking_code            text         not null unique,            -- GT-2026-000001
  legacy_booking_id       text,                                    -- GTK-xxxxxxxx
  customer_id             uuid         references public.customers (id) on delete set null,
  product_id              uuid         references public.products (id) on delete set null,
  batch_id                uuid         references public.product_batches (id) on delete set null,

  booking_source          text         not null default 'website', -- website | direct | customer_self_service
  status                  text         not null default 'CONFIRMED',
  payment_status          text         not null default 'PAID',    -- PAID | PARTIAL | FAILED

  -- Lead traveler details (denormalised for fast display)
  lead_first_name         text         not null default 'Unknown',
  lead_last_name          text,
  lead_phone              text,
  lead_whatsapp           text,
  lead_email              text,
  emergency_contact       text,

  ticket_quantity         integer      not null default 1,
  departure_origin        text,
  pickup_location         text,
  travel_date             date,
  whatsapp_group_link     text,

  payment_option          text,
  payment_reference       text,
  payment_screenshot_url  text,

  base_amount             numeric(10,2) not null default 0,
  processing_fee          numeric(10,2) not null default 0,
  gst_amount              numeric(10,2) not null default 0,
  total_amount            numeric(10,2) not null default 0,
  payable_now             numeric(10,2) not null default 0,
  remaining_amount        numeric(10,2) not null default 0,

  referral_code           text,
  consent                 jsonb         not null default '{}',
  traveler_pricing        jsonb         not null default '[]',
  notes                   text,

  manual_booking          boolean       not null default false,
  collected_offline       boolean       not null default false,
  tax_exempt              boolean       not null default false,

  transaction_at          timestamptz   not null default now(),
  created_at              timestamptz   not null default now(),
  updated_at              timestamptz   not null default now()
);

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

create index if not exists bookings_booking_code_idx    on public.bookings (booking_code);
create index if not exists bookings_customer_id_idx     on public.bookings (customer_id);
create index if not exists bookings_product_id_idx      on public.bookings (product_id);
create index if not exists bookings_status_idx          on public.bookings (status);
create index if not exists bookings_travel_date_idx     on public.bookings (travel_date);
create index if not exists bookings_transaction_at_idx  on public.bookings (transaction_at desc);
create index if not exists bookings_lead_phone_idx      on public.bookings (lead_phone);

-- Per-traveler rows (lead + additional)
create table if not exists public.booking_travelers (
  id               uuid  primary key default gen_random_uuid(),
  booking_id       uuid  not null references public.bookings (id) on delete cascade,
  is_lead          boolean not null default false,
  first_name       text,
  last_name        text,
  mobile_number    text,
  email            text,
  departure_origin text,
  pickup_location  text,
  created_at       timestamptz not null default now()
);

create index if not exists booking_travelers_booking_id_idx on public.booking_travelers (booking_id);

-- RLS — all reads go through the backend (service_role bypasses RLS)
alter table public.bookings          enable row level security;
alter table public.booking_travelers enable row level security;
alter table public.products          enable row level security;
alter table public.product_batches   enable row level security;

create policy "deny_anon_read" on public.bookings          for select to anon using (false);
create policy "deny_anon_read" on public.booking_travelers for select to anon using (false);

-- Products are public-read (used on the public trek listing page)
create policy "anon_read_active_products" on public.products
  for select to anon using (is_active = true);
create policy "anon_read_batches" on public.product_batches
  for select to anon using (available = true);
