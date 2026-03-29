-- ============================================================
-- Migration 008: activity_logs + notifications + email_alert_log
-- ============================================================

-- Activity log (audit trail for admin actions)
create table if not exists public.activity_logs (
  id           uuid        primary key default gen_random_uuid(),
  action       text        not null,
  action_label text,
  details      text,
  module       text,
  severity     text        not null default 'info',          -- info | success | warning | error
  performed_by text,
  created_at   timestamptz not null default now()
);

create index if not exists activity_logs_module_idx     on public.activity_logs (module);
create index if not exists activity_logs_severity_idx   on public.activity_logs (severity);
create index if not exists activity_logs_created_at_idx on public.activity_logs (created_at desc);

-- Notifications / alerts
create table if not exists public.notifications (
  id          uuid        primary key default gen_random_uuid(),
  type        text        not null default 'INFO',           -- BOOKING | ENQUIRY | PAYMENT | INFO | WARNING
  title       text        not null,
  message     text,
  meta        jsonb       not null default '{}',
  is_read     boolean     not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists notifications_type_idx       on public.notifications (type);
create index if not exists notifications_is_read_idx    on public.notifications (is_read);
create index if not exists notifications_created_at_idx on public.notifications (created_at desc);

-- Email alert log (tracks every email notification attempt)
create table if not exists public.email_alert_log (
  id           uuid        primary key default gen_random_uuid(),
  kind         text        not null,                         -- Booking | Enquiry | Confirmation etc.
  booking_id   text,
  enquiry_id   text,
  customer_name text,
  customer_email text,
  event_name   text,
  amount       numeric(10,2),
  travel_date  text,
  pickup_location text,
  attempted_at timestamptz not null default now()
);

create index if not exists email_alert_log_kind_idx         on public.email_alert_log (kind);
create index if not exists email_alert_log_attempted_at_idx on public.email_alert_log (attempted_at desc);

-- RLS — all reads through backend
alter table public.activity_logs   enable row level security;
alter table public.notifications   enable row level security;
alter table public.email_alert_log enable row level security;

create policy "deny_anon_read" on public.activity_logs   for select to anon using (false);
create policy "deny_anon_read" on public.notifications   for select to anon using (false);
create policy "deny_anon_read" on public.email_alert_log for select to anon using (false);
