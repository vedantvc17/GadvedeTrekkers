-- ============================================================
-- Migration 003: payments + payment_refunds
-- Run AFTER 002_bookings.sql
-- ============================================================

create table if not exists public.payments (
  id                  uuid         primary key default gen_random_uuid(),
  booking_id          uuid         references public.bookings (id) on delete set null,
  customer_id         uuid         references public.customers (id) on delete set null,
  payment_mode        text         not null default 'UPI',       -- UPI | CARD | CASH | NET BANK | Partial
  transaction_status  text         not null default 'SUCCESS',   -- SUCCESS | FAILED | REFUNDED
  gross_amount        numeric(10,2) not null default 0,
  tax_amount          numeric(10,2) not null default 0,
  net_amount          numeric(10,2) not null default 0,
  payment_reference   text         not null unique,              -- UTR / TXN-xxxxxxxx
  paid_at             timestamptz  not null default now(),
  created_at          timestamptz  not null default now(),
  updated_at          timestamptz  not null default now()
);

drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

create index if not exists payments_booking_id_idx    on public.payments (booking_id);
create index if not exists payments_customer_id_idx   on public.payments (customer_id);
create index if not exists payments_status_idx        on public.payments (transaction_status);
create index if not exists payments_mode_idx          on public.payments (payment_mode);
create index if not exists payments_paid_at_idx       on public.payments (paid_at desc);

-- Refunds (one or more per payment)
create table if not exists public.payment_refunds (
  id          uuid         primary key default gen_random_uuid(),
  payment_id  uuid         not null references public.payments (id) on delete cascade,
  booking_id  uuid         references public.bookings (id) on delete set null,
  amount      numeric(10,2) not null,
  status      text         not null default 'REFUNDED',
  reason      text,
  created_at  timestamptz  not null default now()
);

create index if not exists payment_refunds_payment_id_idx on public.payment_refunds (payment_id);
create index if not exists payment_refunds_booking_id_idx on public.payment_refunds (booking_id);

-- RLS — reads go through backend only
alter table public.payments        enable row level security;
alter table public.payment_refunds enable row level security;

create policy "deny_anon_read" on public.payments        for select to anon using (false);
create policy "deny_anon_read" on public.payment_refunds for select to anon using (false);
