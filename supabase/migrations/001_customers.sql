-- ============================================================
-- Migration 001: customers
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

create table if not exists public.customers (
  id                    uuid        primary key default gen_random_uuid(),
  full_name             text        not null default 'Unknown',
  phone                 text        unique,
  email                 text        unique,
  tags                  text[]      not null default '{}',
  enquiry_count         integer     not null default 0,
  booking_count         integer     not null default 0,
  latest_enquiry_status text,
  latest_enquiry_event  text,
  latest_booked_event   text,
  latest_booking_status text,
  last_contact_at       timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Auto-update updated_at on every row change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

-- Indexes for fast look-ups used in the app
create index if not exists customers_phone_idx on public.customers (phone);
create index if not exists customers_email_idx on public.customers (email);
create index if not exists customers_full_name_idx on public.customers using gin (to_tsvector('simple', full_name));
create index if not exists customers_created_at_idx on public.customers (created_at desc);

-- Row Level Security — read-only for anon, full access for service_role
alter table public.customers enable row level security;

-- Admins (service_role) bypass RLS automatically.
-- Frontend (anon) must NOT read raw customer PII — all reads go through the backend.
create policy "deny_anon_read" on public.customers
  for select to anon using (false);
