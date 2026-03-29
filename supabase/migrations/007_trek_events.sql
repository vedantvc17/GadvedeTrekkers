-- ============================================================
-- Migration 007: trek_events + trek_dates
-- (Mirrors: gt_trek_payments, gt_trek_dates in localStorage)
-- ============================================================

-- Trek events (the "operational event" layer — each scheduled departure)
create table if not exists public.trek_events (
  id            uuid        primary key default gen_random_uuid(),
  event_id      text        not null unique,                 -- GT-EVT-xxxxxxxxx (legacy id)
  product_id    uuid        references public.products (id) on delete set null,
  trek_name     text        not null,
  event_date    date        not null,
  leader_name   text,
  leader_id     text        references public.employees (employee_id) on delete set null,
  vendor_name   text,
  vendor_id     text        references public.vendors (id) on delete set null,
  seats_total   integer     not null default 30,
  seats_booked  integer     not null default 0,
  status        text        not null default 'UPCOMING',     -- UPCOMING | ONGOING | COMPLETED | CANCELLED
  config        jsonb       not null default '{}',           -- pickup list, pricing overrides, etc.
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists trek_events_set_updated_at on public.trek_events;
create trigger trek_events_set_updated_at
  before update on public.trek_events
  for each row execute function public.set_updated_at();

create index if not exists trek_events_event_id_idx    on public.trek_events (event_id);
create index if not exists trek_events_event_date_idx  on public.trek_events (event_date);
create index if not exists trek_events_leader_id_idx   on public.trek_events (leader_id);
create index if not exists trek_events_status_idx      on public.trek_events (status);

-- Trek dates (the simple "next departure date" list per product)
create table if not exists public.trek_dates (
  id          uuid        primary key default gen_random_uuid(),
  product_id  uuid        references public.products (id) on delete cascade,
  trek_name   text        not null,
  trek_date   date        not null,
  is_active   boolean     not null default true,
  notes       text,
  created_at  timestamptz not null default now()
);

create index if not exists trek_dates_product_id_idx on public.trek_dates (product_id);
create index if not exists trek_dates_trek_date_idx  on public.trek_dates (trek_date);
create index if not exists trek_dates_trek_name_idx  on public.trek_dates (trek_name);

-- RLS
alter table public.trek_events enable row level security;
alter table public.trek_dates  enable row level security;

-- Trek dates are public (shown on the public booking page)
create policy "anon_read_trek_dates" on public.trek_dates for select to anon using (is_active = true);
create policy "deny_anon_read"       on public.trek_events for select to anon using (false);
