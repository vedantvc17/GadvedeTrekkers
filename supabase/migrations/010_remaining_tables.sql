-- ============================================================
-- Migration 010: All remaining tables not in the initial schema
-- Run in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

begin;

-- ── Enquiries ──────────────────────────────────────────────
create table if not exists public.enquiries (
  id                         text        primary key,
  customer_id                uuid        references public.customers(id) on delete set null,
  name                       text        not null,
  phone                      text,
  email                      text,
  event_name                 text,
  category                   text,
  location                   text,
  page_key                   text,
  page_url                   text,
  message                    text,
  preferred_date             text,
  group_size                 text,
  status                     text        not null default 'NEW_LEAD' check (
    status in ('NEW_LEAD', 'CONTACTED', 'QUOTED', 'CONVERTED', 'LOST')
  ),
  tags                       jsonb       not null default '[]'::jsonb,
  assigned_sales_employee_id text,
  assigned_sales_name        text,
  assigned_sales_username    text,
  viewed_at                  timestamptz,
  first_response_at          timestamptz,
  converted_at               timestamptz,
  archived_at                timestamptz,
  booked_event_name          text,
  booked_booking_id          text,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);

create trigger enquiries_set_updated_at
  before update on public.enquiries
  for each row execute function public.set_updated_at();

create index if not exists enquiries_customer_id_idx  on public.enquiries (customer_id);
create index if not exists enquiries_status_idx       on public.enquiries (status);
create index if not exists enquiries_phone_idx        on public.enquiries (phone);
create index if not exists enquiries_archived_at_idx  on public.enquiries (archived_at);
create index if not exists enquiries_created_at_idx   on public.enquiries (created_at desc);

-- ── Vendors ────────────────────────────────────────────────
create table if not exists public.vendors (
  id                   text        primary key,
  name                 text        not null,
  service_type         text        not null default 'Other',
  address              text,
  google_map_location  text,
  contact_number       text,
  rates                text,
  images               jsonb       not null default '[]'::jsonb,
  is_active            boolean     not null default true,
  notes                text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create trigger vendors_set_updated_at
  before update on public.vendors
  for each row execute function public.set_updated_at();

create index if not exists vendors_service_type_idx on public.vendors (service_type);
create index if not exists vendors_is_active_idx    on public.vendors (is_active);

insert into public.vendors (id, name, service_type, address, google_map_location, contact_number, rates, images)
values
  ('v-01', 'Shivaji Travels',     'Bus',               'Pune, Maharashtra',   'https://maps.google.com/?q=Pune',     '9823001001', '₹15,000/day (AC Bus 40 seats)',        '[]'),
  ('v-02', 'Sahyadri Food Stall', 'Food',              'Kasara, Thane',       'https://maps.google.com/?q=Kasara',   '9834002002', '₹150/plate (Veg Thali)',               '[]'),
  ('v-03', 'Trek Gear Rentals',   'Adventure Activity','Mumbai, Maharashtra', 'https://maps.google.com/?q=Mumbai',   '9845003003', '₹500/day (gear set)',                  '[]'),
  ('v-04', 'Nashik Bus Services', 'Bus',               'Nashik, Maharashtra', 'https://maps.google.com/?q=Nashik',   '9856004004', '₹12,000/day (Non-AC 35 seats)',        '[]'),
  ('v-05', 'Mountain Bites',      'Food',              'Igatpuri, Nashik',    'https://maps.google.com/?q=Igatpuri', '9867005005', '₹120/plate (Breakfast & Snacks)',      '[]')
on conflict (id) do nothing;

-- ── Employees ──────────────────────────────────────────────
create table if not exists public.employees (
  employee_id        text        primary key,
  full_name          text        not null,
  role               text        not null default 'guide',
  email              text,
  contact_number     text,
  username           text        unique,
  password_plain     text,
  expertise          text,
  experience_years   integer     default 0,
  location           text,
  status             text        not null default 'active' check (status in ('active', 'inactive')),
  performance_rating numeric(3,1) default 0,
  events_handled     integer     default 0,
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create trigger employees_set_updated_at
  before update on public.employees
  for each row execute function public.set_updated_at();

create index if not exists employees_role_idx     on public.employees (role);
create index if not exists employees_status_idx   on public.employees (status);
create index if not exists employees_username_idx on public.employees (username);

create table if not exists public.employee_assignments (
  assignment_id text        primary key,
  employee_id   text        not null references public.employees(employee_id) on delete cascade,
  trek_name     text,
  event_date    date,
  role          text,
  status        text        not null default 'ASSIGNED' check (status in ('ASSIGNED','COMPLETED','CANCELLED')),
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger employee_assignments_set_updated_at
  before update on public.employee_assignments
  for each row execute function public.set_updated_at();

create index if not exists employee_assignments_employee_id_idx on public.employee_assignments (employee_id);
create index if not exists employee_assignments_event_date_idx  on public.employee_assignments (event_date);

create table if not exists public.employee_expenses (
  expense_id    text        primary key,
  employee_id   text        not null references public.employees(employee_id) on delete cascade,
  category      text        not null default 'Other',
  amount        numeric(10,2) not null default 0,
  description   text,
  status        text        not null default 'PENDING' check (status in ('PENDING','APPROVED','REJECTED')),
  receipt_url   text,
  expense_date  date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger employee_expenses_set_updated_at
  before update on public.employee_expenses
  for each row execute function public.set_updated_at();

create index if not exists employee_expenses_employee_id_idx on public.employee_expenses (employee_id);
create index if not exists employee_expenses_status_idx      on public.employee_expenses (status);

create table if not exists public.employee_availability (
  availability_id text        primary key,
  employee_id     text        not null references public.employees(employee_id) on delete cascade,
  available_date  date        not null,
  is_available    boolean     not null default true,
  notes           text,
  created_at      timestamptz not null default now()
);

create index if not exists employee_availability_employee_id_idx on public.employee_availability (employee_id);
create index if not exists employee_availability_date_idx        on public.employee_availability (available_date);

-- ── Trek Events & Dates ────────────────────────────────────
create table if not exists public.trek_events (
  id           uuid        primary key default gen_random_uuid(),
  event_id     text        not null unique,
  product_id   uuid        references public.products(id) on delete set null,
  trek_name    text        not null,
  event_date   date        not null,
  leader_name  text,
  leader_id    text        references public.employees(employee_id) on delete set null,
  vendor_name  text,
  vendor_id    text        references public.vendors(id) on delete set null,
  seats_total  integer     not null default 30,
  seats_booked integer     not null default 0,
  status       text        not null default 'UPCOMING' check (
    status in ('UPCOMING','ONGOING','COMPLETED','CANCELLED')
  ),
  config       jsonb       not null default '{}'::jsonb,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger trek_events_set_updated_at
  before update on public.trek_events
  for each row execute function public.set_updated_at();

create index if not exists trek_events_event_id_idx   on public.trek_events (event_id);
create index if not exists trek_events_event_date_idx on public.trek_events (event_date);
create index if not exists trek_events_leader_id_idx  on public.trek_events (leader_id);
create index if not exists trek_events_status_idx     on public.trek_events (status);

create table if not exists public.trek_dates (
  id          uuid        primary key default gen_random_uuid(),
  product_id  uuid        references public.products(id) on delete cascade,
  trek_name   text        not null,
  trek_date   date        not null,
  is_active   boolean     not null default true,
  notes       text,
  created_at  timestamptz not null default now()
);

create index if not exists trek_dates_product_id_idx on public.trek_dates (product_id);
create index if not exists trek_dates_trek_date_idx  on public.trek_dates (trek_date);
create index if not exists trek_dates_trek_name_idx  on public.trek_dates (trek_name);

-- ── Activity Logs ──────────────────────────────────────────
create table if not exists public.activity_logs (
  id           uuid        primary key default gen_random_uuid(),
  action       text        not null,
  action_label text,
  details      text,
  module       text,
  severity     text        not null default 'info' check (severity in ('info','success','warning','error')),
  performed_by text,
  created_at   timestamptz not null default now()
);

create index if not exists activity_logs_module_idx     on public.activity_logs (module);
create index if not exists activity_logs_severity_idx   on public.activity_logs (severity);
create index if not exists activity_logs_created_at_idx on public.activity_logs (created_at desc);

-- ── Notifications & Email Alert Log ───────────────────────
create table if not exists public.notifications (
  id         uuid        primary key default gen_random_uuid(),
  type       text        not null default 'INFO' check (type in ('BOOKING','ENQUIRY','PAYMENT','INFO','WARNING')),
  title      text        not null,
  message    text,
  meta       jsonb       not null default '{}'::jsonb,
  is_read    boolean     not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_type_idx       on public.notifications (type);
create index if not exists notifications_is_read_idx    on public.notifications (is_read);
create index if not exists notifications_created_at_idx on public.notifications (created_at desc);

create table if not exists public.email_alert_log (
  id               uuid        primary key default gen_random_uuid(),
  kind             text        not null,
  booking_id       text,
  enquiry_id       text,
  customer_name    text,
  customer_email   text,
  event_name       text,
  amount           numeric(10,2),
  travel_date      text,
  pickup_location  text,
  attempted_at     timestamptz not null default now()
);

create index if not exists email_alert_log_kind_idx         on public.email_alert_log (kind);
create index if not exists email_alert_log_attempted_at_idx on public.email_alert_log (attempted_at desc);

-- ── Feedback ──────────────────────────────────────────────
create table if not exists public.feedback (
  id          uuid        primary key default gen_random_uuid(),
  customer_id uuid        references public.customers(id) on delete set null,
  booking_id  text,
  trek_name   text,
  rating      integer     check (rating between 1 and 5),
  comment     text,
  source      text        default 'website',
  status      text        not null default 'PENDING' check (status in ('PENDING','APPROVED','REJECTED')),
  created_at  timestamptz not null default now()
);

create index if not exists feedback_status_idx     on public.feedback (status);
create index if not exists feedback_created_at_idx on public.feedback (created_at desc);

-- ── Incentives ─────────────────────────────────────────────
create table if not exists public.incentives (
  id          uuid        primary key default gen_random_uuid(),
  employee_id text        references public.employees(employee_id) on delete cascade,
  rule_name   text        not null,
  amount      numeric(10,2) not null default 0,
  type        text        not null default 'FIXED' check (type in ('FIXED','PERCENT')),
  trek_name   text,
  status      text        not null default 'PENDING' check (status in ('PENDING','PAID')),
  notes       text,
  created_at  timestamptz not null default now()
);

create index if not exists incentives_employee_id_idx on public.incentives (employee_id);
create index if not exists incentives_status_idx      on public.incentives (status);

-- ── Rate Approvals ─────────────────────────────────────────
create table if not exists public.rate_approvals (
  id             uuid        primary key default gen_random_uuid(),
  vendor_id      text        references public.vendors(id) on delete set null,
  trek_event_id  text,
  requested_by   text,
  amount         numeric(10,2) not null default 0,
  reason         text,
  status         text        not null default 'PENDING' check (status in ('PENDING','APPROVED','REJECTED')),
  reviewed_by    text,
  reviewed_at    timestamptz,
  created_at     timestamptz not null default now()
);

create index if not exists rate_approvals_status_idx on public.rate_approvals (status);

-- ── Feature Flags ──────────────────────────────────────────
create table if not exists public.feature_flags (
  id          uuid        primary key default gen_random_uuid(),
  flag_key    text        not null unique,
  enabled     boolean     not null default false,
  description text,
  updated_at  timestamptz not null default now()
);

-- ── Earnings ───────────────────────────────────────────────
create table if not exists public.earnings (
  id         uuid        primary key default gen_random_uuid(),
  period     text        not null,
  category   text        not null default 'Trek',
  gross      numeric(10,2) not null default 0,
  expenses   numeric(10,2) not null default 0,
  net        numeric(10,2) generated always as (gross - expenses) stored,
  notes      text,
  created_at timestamptz not null default now()
);

create index if not exists earnings_period_idx on public.earnings (period);

-- ── Emergency Contacts ─────────────────────────────────────
create table if not exists public.emergency_contacts (
  id          uuid        primary key default gen_random_uuid(),
  category    text        not null default 'National',
  label       text        not null,
  number      text,
  description text,
  sort_order  integer     not null default 0,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists emergency_contacts_category_idx on public.emergency_contacts (category);

-- ── Permissions ────────────────────────────────────────────
create table if not exists public.permissions (
  id        uuid    primary key default gen_random_uuid(),
  role      text    not null,
  feature   text    not null,
  can_read  boolean not null default false,
  can_write boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (role, feature)
);

-- ── Booking Form Config ────────────────────────────────────
create table if not exists public.booking_form_config (
  id                            uuid        primary key default gen_random_uuid(),
  departure_options             text,
  pickup_options                jsonb       not null default '{}'::jsonb,
  manual_category_options       text,
  manual_event_options          text,
  manual_payment_method_options text,
  updated_at                    timestamptz not null default now()
);

create unique index if not exists booking_form_config_single_row on public.booking_form_config ((true));

-- ── RLS for all new tables (service_role bypasses) ─────────
alter table public.enquiries              enable row level security;
alter table public.vendors                enable row level security;
alter table public.employees              enable row level security;
alter table public.employee_assignments   enable row level security;
alter table public.employee_expenses      enable row level security;
alter table public.employee_availability  enable row level security;
alter table public.trek_events            enable row level security;
alter table public.trek_dates             enable row level security;
alter table public.activity_logs          enable row level security;
alter table public.notifications          enable row level security;
alter table public.email_alert_log        enable row level security;
alter table public.feedback               enable row level security;
alter table public.incentives             enable row level security;
alter table public.rate_approvals         enable row level security;
alter table public.feature_flags          enable row level security;
alter table public.earnings               enable row level security;
alter table public.emergency_contacts     enable row level security;
alter table public.permissions            enable row level security;
alter table public.booking_form_config    enable row level security;

-- Trek dates are public-readable (used on the booking form for "next dates")
create policy "anon_read_trek_dates"
  on public.trek_dates for select to anon using (is_active = true);

-- All other tables: deny direct anon access (reads go through backend)
create policy "deny_anon_read" on public.enquiries             for select to anon using (false);
create policy "deny_anon_read" on public.vendors               for select to anon using (false);
create policy "deny_anon_read" on public.employees             for select to anon using (false);
create policy "deny_anon_read" on public.employee_assignments  for select to anon using (false);
create policy "deny_anon_read" on public.employee_expenses     for select to anon using (false);
create policy "deny_anon_read" on public.employee_availability for select to anon using (false);
create policy "deny_anon_read" on public.trek_events           for select to anon using (false);
create policy "deny_anon_read" on public.activity_logs         for select to anon using (false);
create policy "deny_anon_read" on public.notifications         for select to anon using (false);
create policy "deny_anon_read" on public.email_alert_log       for select to anon using (false);
create policy "deny_anon_read" on public.feedback              for select to anon using (false);
create policy "deny_anon_read" on public.incentives            for select to anon using (false);
create policy "deny_anon_read" on public.rate_approvals        for select to anon using (false);
create policy "deny_anon_read" on public.feature_flags         for select to anon using (false);
create policy "deny_anon_read" on public.earnings              for select to anon using (false);
create policy "deny_anon_read" on public.emergency_contacts    for select to anon using (false);
create policy "deny_anon_read" on public.permissions           for select to anon using (false);
create policy "deny_anon_read" on public.booking_form_config   for select to anon using (false);

commit;
