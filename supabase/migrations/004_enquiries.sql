-- ============================================================
-- Migration 004: enquiries
-- Run AFTER 001_customers.sql
-- ============================================================

create table if not exists public.enquiries (
  id                        text        primary key,              -- ENQ-xxxxxxxxx
  customer_id               uuid        references public.customers (id) on delete set null,
  name                      text        not null,
  phone                     text,
  email                     text,
  event_name                text,
  category                  text,
  location                  text,
  page_key                  text,
  page_url                  text,
  message                   text,
  preferred_date            text,
  group_size                text,

  status                    text        not null default 'NEW_LEAD',
  -- NEW_LEAD | CONTACTED | QUOTED | CONVERTED | LOST

  tags                      text[]      not null default '{}',
  assigned_sales_employee_id text,
  assigned_sales_name       text,
  assigned_sales_username   text,

  viewed_at                 timestamptz,
  first_response_at         timestamptz,
  converted_at              timestamptz,
  archived_at               timestamptz,

  booked_event_name         text,
  booked_booking_id         text,

  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

drop trigger if exists enquiries_set_updated_at on public.enquiries;
create trigger enquiries_set_updated_at
  before update on public.enquiries
  for each row execute function public.set_updated_at();

create index if not exists enquiries_customer_id_idx  on public.enquiries (customer_id);
create index if not exists enquiries_status_idx       on public.enquiries (status);
create index if not exists enquiries_phone_idx        on public.enquiries (phone);
create index if not exists enquiries_created_at_idx   on public.enquiries (created_at desc);
create index if not exists enquiries_archived_at_idx  on public.enquiries (archived_at);

-- RLS — reads go through the backend only
alter table public.enquiries enable row level security;
create policy "deny_anon_read" on public.enquiries for select to anon using (false);
