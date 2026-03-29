-- ============================================================
-- Migration 005: vendors
-- ============================================================

create table if not exists public.vendors (
  id                  text        primary key,               -- v-01, v-xxxxxxxx
  name                text        not null,
  service_type        text        not null default 'Other',  -- Bus | Food | Adventure Activity | etc.
  address             text,
  google_map_location text,
  contact_number      text,
  rates               text,                                  -- admin-only — never exposed to employees
  images              jsonb       not null default '[]',
  is_active           boolean     not null default true,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

drop trigger if exists vendors_set_updated_at on public.vendors;
create trigger vendors_set_updated_at
  before update on public.vendors
  for each row execute function public.set_updated_at();

create index if not exists vendors_service_type_idx on public.vendors (service_type);
create index if not exists vendors_is_active_idx    on public.vendors (is_active);

-- RLS — vendor rates are sensitive; all reads go through backend
alter table public.vendors enable row level security;
create policy "deny_anon_read" on public.vendors for select to anon using (false);

-- Seed 5 vendors
insert into public.vendors (id, name, service_type, address, google_map_location, contact_number, rates, images)
values
  ('v-01', 'Shivaji Travels',     'Bus',               'Pune, Maharashtra',   'https://maps.google.com/?q=Pune',     '9823001001', '₹15,000/day (AC Bus 40 seats)',      '[]'),
  ('v-02', 'Sahyadri Food Stall', 'Food',              'Kasara, Thane',       'https://maps.google.com/?q=Kasara',   '9834002002', '₹150/plate (Veg Thali)',             '[]'),
  ('v-03', 'Trek Gear Rentals',   'Adventure Activity','Mumbai, Maharashtra', 'https://maps.google.com/?q=Mumbai',   '9845003003', '₹500/day (gear set)',                '[]'),
  ('v-04', 'Nashik Bus Services', 'Bus',               'Nashik, Maharashtra', 'https://maps.google.com/?q=Nashik',   '9856004004', '₹12,000/day (Non-AC 35 seats)',      '[]'),
  ('v-05', 'Mountain Bites',      'Food',              'Igatpuri, Nashik',    'https://maps.google.com/?q=Igatpuri', '9867005005', '₹120/plate (Breakfast & Snacks)',    '[]')
on conflict (id) do nothing;
