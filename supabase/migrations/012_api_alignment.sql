-- ============================================================
-- Migration 012: Align DB schema with current backend API usage
-- Run AFTER 010_remaining_tables.sql and 011_seed_data.sql
-- ============================================================

begin;

create extension if not exists pgcrypto;

-- ============================================================
-- products: add all fields used by backend/src/utils/productMapper.js
-- ============================================================
alter table public.products
  add column if not exists base_village      text,
  add column if not exists difficulty        text,
  add column if not exists endurance_level   text,
  add column if not exists history           text,
  add column if not exists main_attractions  text,
  add column if not exists detailed_history  text,
  add column if not exists highlights        jsonb not null default '[]'::jsonb,
  add column if not exists places_to_visit   jsonb not null default '[]'::jsonb,
  add column if not exists included_items    jsonb not null default '[]'::jsonb,
  add column if not exists excluded_items    jsonb not null default '[]'::jsonb,
  add column if not exists things_to_carry   jsonb not null default '[]'::jsonb,
  add column if not exists discount_codes    jsonb not null default '[]'::jsonb;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'extra_content'
      and data_type <> 'jsonb'
  ) then
    alter table public.products
      alter column extra_content type jsonb using to_jsonb(extra_content);
  end if;
end $$;

create index if not exists products_active_type_sort_idx
  on public.products (product_type, is_active, sort_order);

-- ============================================================
-- product_batches: add fields used by products.controller.js
-- ============================================================
alter table public.product_batches
  add column if not exists batch_label          text,
  add column if not exists whatsapp_group_link  text,
  add column if not exists seats_available      integer,
  add column if not exists status               text;

update public.product_batches
set seats_available = greatest(seats_total - coalesce(seats_booked, 0), 0)
where seats_available is null;

update public.product_batches
set status = case
  when coalesce(available, true) = false then 'CLOSED'
  when coalesce(seats_total, 0) > 0 and coalesce(seats_available, 0) = 0 then 'SOLD_OUT'
  else 'OPEN'
end
where status is null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'product_batches_status_check'
  ) then
    alter table public.product_batches
      add constraint product_batches_status_check
      check (status in ('OPEN', 'CLOSED', 'SOLD_OUT', 'CANCELLED'));
  end if;
end $$;

alter table public.product_batches
  alter column seats_available set default 0,
  alter column status set default 'OPEN';

create index if not exists product_batches_status_idx
  on public.product_batches (status);

-- ============================================================
-- product_departure_plans: required by trek admin/public API
-- ============================================================
create table if not exists public.product_departure_plans (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid not null references public.products(id) on delete cascade,
  batch_id         uuid references public.product_batches(id) on delete cascade,
  departure_origin text not null,
  price            numeric(10,2) not null default 0,
  pickup_points    jsonb not null default '[]'::jsonb,
  itinerary_text   text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

drop trigger if exists product_departure_plans_set_updated_at on public.product_departure_plans;
create trigger product_departure_plans_set_updated_at
  before update on public.product_departure_plans
  for each row execute function public.set_updated_at();

create index if not exists product_departure_plans_product_id_idx
  on public.product_departure_plans (product_id);

create index if not exists product_departure_plans_batch_id_idx
  on public.product_departure_plans (batch_id);

alter table public.product_departure_plans enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'product_departure_plans'
      and policyname = 'anon_read_departure_plans'
  ) then
    create policy "anon_read_departure_plans"
      on public.product_departure_plans
      for select to anon
      using (true);
  end if;
end $$;

-- ============================================================
-- bookings: enforce the statuses used by current controllers
-- ============================================================
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'bookings_status_check'
  ) then
    alter table public.bookings
      add constraint bookings_status_check
      check (status in ('PENDING_APPROVAL', 'CONFIRMED', 'CANCELLED', 'COMPLETED'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'bookings_payment_status_check'
  ) then
    alter table public.bookings
      add constraint bookings_payment_status_check
      check (payment_status in ('UNPAID', 'PARTIAL', 'PAID', 'FAILED', 'REFUNDED'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'bookings_booking_source_check'
  ) then
    alter table public.bookings
      add constraint bookings_booking_source_check
      check (booking_source in ('website', 'direct', 'admin', 'customer_self_service'));
  end if;
end $$;

-- ============================================================
-- payments: add gateway_response used by payments.controller.js
-- ============================================================
alter table public.payments
  add column if not exists gateway_response jsonb not null default '{}'::jsonb;

-- ============================================================
-- admin verification helpers
-- ============================================================
create index if not exists bookings_payment_status_idx
  on public.bookings (payment_status);

create index if not exists payments_reference_idx
  on public.payments (payment_reference);

commit;
