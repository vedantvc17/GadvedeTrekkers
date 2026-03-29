-- ============================================================
-- Verify all tables exist and check their structure
-- Run in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. List ALL tables in the public schema
select
  table_name,
  (select count(*) from information_schema.columns c where c.table_name = t.table_name and c.table_schema = 'public') as column_count
from information_schema.tables t
where table_schema = 'public'
  and table_type = 'BASE TABLE'
order by table_name;


-- 2. Full column details for every table
select
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
order by table_name, ordinal_position;


-- 3. Check row counts for all tables (quick health check)
select 'customers'            as tbl, count(*) from public.customers            union all
select 'products',                    count(*) from public.products              union all
select 'product_batches',             count(*) from public.product_batches       union all
select 'product_departure_plans',     count(*) from public.product_departure_plans union all
select 'bookings',                    count(*) from public.bookings              union all
select 'booking_travelers',           count(*) from public.booking_travelers     union all
select 'payments',                    count(*) from public.payments              union all
select 'payment_refunds',             count(*) from public.payment_refunds       union all
select 'listing_submissions',         count(*) from public.listing_submissions   union all
select 'event_operations',            count(*) from public.event_operations      union all
select 'event_operation_tasks',       count(*) from public.event_operation_tasks union all
select 'enquiries',                   count(*) from public.enquiries             union all
select 'vendors',                     count(*) from public.vendors               union all
select 'employees',                   count(*) from public.employees             union all
select 'employee_assignments',        count(*) from public.employee_assignments  union all
select 'employee_expenses',           count(*) from public.employee_expenses     union all
select 'employee_availability',       count(*) from public.employee_availability union all
select 'trek_events',                 count(*) from public.trek_events           union all
select 'trek_dates',                  count(*) from public.trek_dates            union all
select 'activity_logs',               count(*) from public.activity_logs         union all
select 'notifications',               count(*) from public.notifications         union all
select 'email_alert_log',             count(*) from public.email_alert_log       union all
select 'feedback',                    count(*) from public.feedback              union all
select 'incentives',                  count(*) from public.incentives            union all
select 'rate_approvals',              count(*) from public.rate_approvals        union all
select 'feature_flags',               count(*) from public.feature_flags         union all
select 'earnings',                    count(*) from public.earnings              union all
select 'emergency_contacts',          count(*) from public.emergency_contacts    union all
select 'permissions',                 count(*) from public.permissions           union all
select 'booking_form_config',         count(*) from public.booking_form_config
order by 1;


-- 4. Check all indexes
select
  indexname,
  tablename,
  indexdef
from pg_indexes
where schemaname = 'public'
order by tablename, indexname;


-- 5. Check all RLS policies
select
  tablename,
  policyname,
  cmd,
  roles
from pg_policies
where schemaname = 'public'
order by tablename, policyname;


-- 6. Check all triggers (set_updated_at should be on most tables)
select
  trigger_name,
  event_object_table as table_name,
  event_manipulation as event,
  action_timing as timing
from information_schema.triggers
where trigger_schema = 'public'
order by event_object_table, trigger_name;


-- 7. Check foreign key constraints
select
  tc.table_name,
  kcu.column_name,
  ccu.table_name  as foreign_table,
  ccu.column_name as foreign_column
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
  and tc.table_schema   = kcu.table_schema
join information_schema.constraint_column_usage ccu
  on ccu.constraint_name = tc.constraint_name
  and ccu.table_schema   = tc.table_schema
where tc.constraint_type = 'FOREIGN KEY'
  and tc.table_schema    = 'public'
order by tc.table_name, kcu.column_name;


-- 8. Check check constraints (enum guards)
select
  tc.table_name,
  tc.constraint_name,
  cc.check_clause
from information_schema.table_constraints tc
join information_schema.check_constraints cc
  on tc.constraint_name = cc.constraint_name
where tc.table_schema = 'public'
  and tc.constraint_type = 'CHECK'
order by tc.table_name, tc.constraint_name;
