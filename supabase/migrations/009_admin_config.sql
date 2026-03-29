-- ============================================================
-- Migration 009: feedback + marketing + incentives +
--                rate_approvals + feature_flags + earnings +
--                emergency_contacts + permissions +
--                booking_form_config + listing_submissions
-- ============================================================

-- Customer feedback / reviews
create table if not exists public.feedback (
  id           uuid        primary key default gen_random_uuid(),
  customer_id  uuid        references public.customers (id) on delete set null,
  booking_id   text,
  trek_name    text,
  rating       integer     check (rating between 1 and 5),
  comment      text,
  source       text        default 'website',
  status       text        not null default 'PENDING',       -- PENDING | APPROVED | REJECTED
  created_at   timestamptz not null default now()
);

create index if not exists feedback_status_idx     on public.feedback (status);
create index if not exists feedback_rating_idx     on public.feedback (rating);
create index if not exists feedback_created_at_idx on public.feedback (created_at desc);

-- Marketing configuration (UTM sources, referral rules, etc.)
create table if not exists public.marketing_config (
  id          uuid        primary key default gen_random_uuid(),
  key         text        not null unique,
  value       jsonb       not null default '{}',
  updated_at  timestamptz not null default now()
);

-- Incentive / commission rules per employee
create table if not exists public.incentives (
  id           uuid        primary key default gen_random_uuid(),
  employee_id  text        references public.employees (employee_id) on delete cascade,
  rule_name    text        not null,
  amount       numeric(10,2) not null default 0,
  type         text        not null default 'FIXED',         -- FIXED | PERCENT
  trek_name    text,
  status       text        not null default 'PENDING',       -- PENDING | PAID
  notes        text,
  created_at   timestamptz not null default now()
);

create index if not exists incentives_employee_id_idx on public.incentives (employee_id);
create index if not exists incentives_status_idx      on public.incentives (status);

-- Rate approval requests (vendor quote approvals)
create table if not exists public.rate_approvals (
  id           uuid        primary key default gen_random_uuid(),
  vendor_id    text        references public.vendors (id) on delete set null,
  trek_event_id text,
  requested_by text,
  amount       numeric(10,2) not null default 0,
  reason       text,
  status       text        not null default 'PENDING',       -- PENDING | APPROVED | REJECTED
  reviewed_by  text,
  reviewed_at  timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists rate_approvals_status_idx on public.rate_approvals (status);

-- Feature flags
create table if not exists public.feature_flags (
  id          uuid        primary key default gen_random_uuid(),
  flag_key    text        not null unique,
  enabled     boolean     not null default false,
  description text,
  updated_at  timestamptz not null default now()
);

-- Earnings / revenue summary (computed / manually logged)
create table if not exists public.earnings (
  id          uuid        primary key default gen_random_uuid(),
  period      text        not null,                          -- e.g. "2026-03"
  category    text        not null default 'Trek',
  gross       numeric(10,2) not null default 0,
  expenses    numeric(10,2) not null default 0,
  net         numeric(10,2) generated always as (gross - expenses) stored,
  notes       text,
  created_at  timestamptz not null default now()
);

create index if not exists earnings_period_idx on public.earnings (period);

-- Emergency contacts (visible to employees in the Emergency tab)
create table if not exists public.emergency_contacts (
  id           uuid        primary key default gen_random_uuid(),
  category     text        not null default 'National',      -- National | Regional | FirstAid
  label        text        not null,
  number       text,
  description  text,
  sort_order   integer     not null default 0,
  is_active    boolean     not null default true,
  created_at   timestamptz not null default now()
);

create index if not exists emergency_contacts_category_idx on public.emergency_contacts (category);

-- RLS for emergency contacts — employees can read (via backend)
alter table public.emergency_contacts enable row level security;
create policy "deny_anon_read" on public.emergency_contacts for select to anon using (false);

-- Permissions (role-based access control per admin feature)
create table if not exists public.permissions (
  id          uuid        primary key default gen_random_uuid(),
  role        text        not null,                          -- admin | manager | employee
  feature     text        not null,
  can_read    boolean     not null default false,
  can_write   boolean     not null default false,
  updated_at  timestamptz not null default now(),
  unique (role, feature)
);

-- Booking form configuration (configures the public booking form)
create table if not exists public.booking_form_config (
  id                            uuid        primary key default gen_random_uuid(),
  departure_options             text,
  pickup_options                jsonb       not null default '{}',
  manual_category_options       text,
  manual_event_options          text,
  manual_payment_method_options text,
  updated_at                    timestamptz not null default now()
);

-- Ensure only one config row exists
create unique index if not exists booking_form_config_single_row on public.booking_form_config ((true));

-- Listing submissions (new trek/tour listing requests from partners)
create table if not exists public.listing_submissions (
  id            uuid        primary key default gen_random_uuid(),
  submission_id text        unique,
  name          text,
  email         text,
  phone         text,
  trek_name     text,
  trek_type     text,
  location      text,
  price         numeric(10,2),
  description   text,
  status        text        not null default 'PENDING',      -- PENDING | APPROVED | REJECTED
  submitted_at  timestamptz not null default now()
);

create index if not exists listing_submissions_status_idx on public.listing_submissions (status);

-- RLS for all admin-only tables
alter table public.feedback            enable row level security;
alter table public.marketing_config    enable row level security;
alter table public.incentives          enable row level security;
alter table public.rate_approvals      enable row level security;
alter table public.feature_flags       enable row level security;
alter table public.earnings            enable row level security;
alter table public.permissions         enable row level security;
alter table public.booking_form_config enable row level security;
alter table public.listing_submissions enable row level security;

create policy "deny_anon_read" on public.feedback            for select to anon using (false);
create policy "deny_anon_read" on public.marketing_config    for select to anon using (false);
create policy "deny_anon_read" on public.incentives          for select to anon using (false);
create policy "deny_anon_read" on public.rate_approvals      for select to anon using (false);
create policy "deny_anon_read" on public.feature_flags       for select to anon using (false);
create policy "deny_anon_read" on public.earnings            for select to anon using (false);
create policy "deny_anon_read" on public.permissions         for select to anon using (false);
create policy "deny_anon_read" on public.booking_form_config for select to anon using (false);
create policy "deny_anon_read" on public.listing_submissions for select to anon using (false);
