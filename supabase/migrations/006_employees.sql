-- ============================================================
-- Migration 006: employees + assignments + expenses + availability
-- ============================================================

create table if not exists public.employees (
  employee_id        text        primary key,
  full_name          text        not null,
  role               text        not null default 'guide',
  email              text,
  contact_number     text,
  username           text        unique,
  password_hash      text,                                   -- plain text for now (migrate to hash later)
  expertise          text,
  experience_years   integer     default 0,
  location           text,
  status             text        not null default 'active',  -- active | inactive
  performance_rating numeric(3,1) default 0,
  events_handled     integer     default 0,
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

drop trigger if exists employees_set_updated_at on public.employees;
create trigger employees_set_updated_at
  before update on public.employees
  for each row execute function public.set_updated_at();

create index if not exists employees_role_idx    on public.employees (role);
create index if not exists employees_status_idx  on public.employees (status);
create index if not exists employees_username_idx on public.employees (username);

-- Assignments (employee → trek event)
create table if not exists public.employee_assignments (
  assignment_id text        primary key,
  employee_id   text        not null references public.employees (employee_id) on delete cascade,
  trek_name     text,
  event_date    date,
  role          text,
  status        text        not null default 'ASSIGNED',     -- ASSIGNED | COMPLETED | CANCELLED
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists employee_assignments_employee_id_idx on public.employee_assignments (employee_id);
create index if not exists employee_assignments_event_date_idx  on public.employee_assignments (event_date);

-- Expenses claimed by employees
create table if not exists public.employee_expenses (
  expense_id    text        primary key,
  employee_id   text        not null references public.employees (employee_id) on delete cascade,
  category      text        not null default 'Other',
  amount        numeric(10,2) not null default 0,
  description   text,
  status        text        not null default 'PENDING',      -- PENDING | APPROVED | REJECTED
  receipt_url   text,
  expense_date  date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists employee_expenses_employee_id_idx on public.employee_expenses (employee_id);
create index if not exists employee_expenses_status_idx      on public.employee_expenses (status);

-- Availability slots
create table if not exists public.employee_availability (
  availability_id text        primary key,
  employee_id     text        not null references public.employees (employee_id) on delete cascade,
  available_date  date        not null,
  is_available    boolean     not null default true,
  notes           text,
  created_at      timestamptz not null default now()
);

create index if not exists employee_availability_employee_id_idx on public.employee_availability (employee_id);
create index if not exists employee_availability_date_idx        on public.employee_availability (available_date);

-- RLS — all reads go through backend
alter table public.employees             enable row level security;
alter table public.employee_assignments  enable row level security;
alter table public.employee_expenses     enable row level security;
alter table public.employee_availability enable row level security;

create policy "deny_anon_read" on public.employees             for select to anon using (false);
create policy "deny_anon_read" on public.employee_assignments  for select to anon using (false);
create policy "deny_anon_read" on public.employee_expenses     for select to anon using (false);
create policy "deny_anon_read" on public.employee_availability for select to anon using (false);
