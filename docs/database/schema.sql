-- ============================================================
--  GADVEDE TREKKERS — Full System Database Schema
--  Database: PostgreSQL 15+
--  Generated: 2026-03-20
--  Covers: Customers · Bookings · Transactions · Events ·
--          Vendors · VendorCosts · Employees · Assignments ·
--          Availability · Expenses · Reimbursements · Earnings
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────────────────────
--  ENUM TYPES
-- ─────────────────────────────────────────────────────────────
CREATE TYPE revenue_type        AS ENUM ('trek','tour','camping','tent_rental','villa_rental','college_iv');
CREATE TYPE booking_type        AS ENUM ('own','b2b');
CREATE TYPE booking_status      AS ENUM ('confirmed','cancelled','pending');
CREATE TYPE payment_method      AS ENUM ('cash','upi','card','net_banking','partial');
CREATE TYPE txn_status          AS ENUM ('success','failed','refunded');
CREATE TYPE event_type          AS ENUM ('trek','tour','camping','tent_rental','villa_rental','college_iv','heritage_walk');
CREATE TYPE vendor_service      AS ENUM ('bus','food','activity','stay','equipment','photography');
CREATE TYPE employee_role       AS ENUM ('trek_leader','coordinator','support_staff','guide','instructor');
CREATE TYPE employee_status     AS ENUM ('active','inactive');
CREATE TYPE availability_status AS ENUM ('available','assigned','on_leave');
CREATE TYPE expense_type        AS ENUM ('travel','food','stay','miscellaneous');
CREATE TYPE expense_status      AS ENUM ('submitted','under_review','approved','rejected','paid');
CREATE TYPE reimbursement_status AS ENUM ('pending','paid','cancelled');


-- ─────────────────────────────────────────────────────────────
--  1. CUSTOMERS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE customers (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(120)  NOT NULL,
  phone         VARCHAR(20)   UNIQUE NOT NULL,
  email         VARCHAR(180)  UNIQUE,
  address       TEXT,
  date_of_birth DATE,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_phone ON customers (phone);
CREATE INDEX idx_customers_email ON customers (email);

COMMENT ON TABLE customers IS 'All registered customers who have made at least one booking.';


-- ─────────────────────────────────────────────────────────────
--  2. EVENTS  (Trek / Tour / Camping / Villa / Tent / College IV)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE events (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name             VARCHAR(200)  NOT NULL,
  type             event_type    NOT NULL,
  location         VARCHAR(300),
  description      TEXT,
  start_date       DATE          NOT NULL,
  end_date         DATE          NOT NULL,
  price_per_person NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_capacity     INT           NOT NULL DEFAULT 50,
  status           VARCHAR(20)   NOT NULL DEFAULT 'active'   CHECK (status IN ('active','inactive','completed','cancelled')),
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_type       ON events (type);
CREATE INDEX idx_events_start_date ON events (start_date);

COMMENT ON TABLE events IS 'Master list of all trek/tour/camping/rental events offered.';


-- ─────────────────────────────────────────────────────────────
--  3. BOOKINGS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE bookings (
  id                 UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref        VARCHAR(30)   UNIQUE NOT NULL,               -- e.g. GT-2026-000042
  customer_id        UUID          NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  event_id           UUID          REFERENCES events(id) ON DELETE SET NULL,
  booking_type       booking_type  NOT NULL DEFAULT 'own',
  revenue_type       revenue_type  NOT NULL,
  tickets            INT           NOT NULL DEFAULT 1 CHECK (tickets > 0),
  total_amount       NUMERIC(12,2) NOT NULL DEFAULT 0,
  paid_amount        NUMERIC(12,2) NOT NULL DEFAULT 0,
  remaining_amount   NUMERIC(12,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
  status             booking_status NOT NULL DEFAULT 'pending',
  pickup_location    VARCHAR(300),
  pickup_time        TIME,
  travel_date        DATE,
  booking_date       DATE          NOT NULL DEFAULT CURRENT_DATE,
  notes              TEXT,
  b2b_operator       VARCHAR(200),                                -- filled if booking_type = 'b2b'
  created_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_customer_id  ON bookings (customer_id);
CREATE INDEX idx_bookings_event_id     ON bookings (event_id);
CREATE INDEX idx_bookings_status       ON bookings (status);
CREATE INDEX idx_bookings_travel_date  ON bookings (travel_date);
CREATE INDEX idx_bookings_booking_ref  ON bookings (booking_ref);

COMMENT ON TABLE bookings IS 'Each row = one booking by one customer for one event.';


-- ─────────────────────────────────────────────────────────────
--  4. TRANSACTIONS  (Payments against bookings)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE transactions (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  txn_ref          VARCHAR(40)   UNIQUE NOT NULL,
  booking_id       UUID          NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
  amount           NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  payment_method   payment_method NOT NULL,
  status           txn_status    NOT NULL DEFAULT 'success',
  gateway_ref      VARCHAR(100),                                  -- payment gateway transaction ID
  notes            TEXT,
  transaction_date TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_booking_id ON transactions (booking_id);
CREATE INDEX idx_transactions_status     ON transactions (status);
CREATE INDEX idx_transactions_date       ON transactions (transaction_date);

COMMENT ON TABLE transactions IS 'Every payment, refund or partial payment linked to a booking.';


-- ─────────────────────────────────────────────────────────────
--  5. VENDORS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE vendors (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(200)  NOT NULL,
  service_type    vendor_service NOT NULL,
  contact_person  VARCHAR(120),
  phone           VARCHAR(20),
  email           VARCHAR(180),
  location        VARCHAR(300),
  address         TEXT,
  map_url         TEXT,
  rating          NUMERIC(3,2)  DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  status          VARCHAR(20)   NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  notes           TEXT,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vendors_service_type ON vendors (service_type);

COMMENT ON TABLE vendors IS 'All external vendors: bus operators, food caterers, activity providers, etc.';


-- ─────────────────────────────────────────────────────────────
--  6. VENDOR COSTS  (Per-event vendor spends)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE vendor_costs (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID          NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  vendor_id   UUID          NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
  cost        NUMERIC(12,2) NOT NULL CHECK (cost >= 0),
  description TEXT,
  invoice_ref VARCHAR(100),
  paid        BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vendor_costs_event_id  ON vendor_costs (event_id);
CREATE INDEX idx_vendor_costs_vendor_id ON vendor_costs (vendor_id);

COMMENT ON TABLE vendor_costs IS 'Costs charged by vendors for a specific event.';


-- ─────────────────────────────────────────────────────────────
--  7. EMPLOYEES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE employees (
  id          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  emp_ref     VARCHAR(20)     UNIQUE NOT NULL,                    -- e.g. EMP-001
  name        VARCHAR(120)    NOT NULL,
  email       VARCHAR(180)    UNIQUE,
  phone       VARCHAR(20),
  address     TEXT,
  role        employee_role   NOT NULL DEFAULT 'support_staff',
  status      employee_status NOT NULL DEFAULT 'active',
  joined_date DATE            NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_employees_role   ON employees (role);
CREATE INDEX idx_employees_status ON employees (status);

COMMENT ON TABLE employees IS 'All staff members: leaders, coordinators, guides, instructors.';


-- ─────────────────────────────────────────────────────────────
--  8. EMPLOYEE PROFILES  (Extended professional info)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE employee_profiles (
  id                  UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id         UUID  NOT NULL UNIQUE REFERENCES employees(id) ON DELETE CASCADE,
  experience_years    INT   NOT NULL DEFAULT 0,
  expertise           VARCHAR(100),
  bio                 TEXT,
  skills              TEXT[],                                     -- ['First Aid','Navigation',...]
  certifications      JSONB,                                      -- [{name, details, year}]
  linkedin_url        TEXT,
  instagram_url       TEXT,
  profile_photo_url   TEXT,
  performance_rating  NUMERIC(3,2) DEFAULT 0 CHECK (performance_rating BETWEEN 0 AND 5),
  events_handled      INT          NOT NULL DEFAULT 0,
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE employee_profiles IS 'One-to-one extension of employees with professional details.';


-- ─────────────────────────────────────────────────────────────
--  9. EMPLOYEE ASSIGNMENTS  (Which employee on which event)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE assignments (
  id              UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id     UUID  NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
  event_id        UUID  NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  role_on_event   VARCHAR(100),                                   -- 'Trek Leader', 'Support' etc.
  notes           TEXT,
  assigned_by     UUID  REFERENCES employees(id),                 -- which admin assigned
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (employee_id, event_id)                                  -- one assignment per event per employee
);

CREATE INDEX idx_assignments_employee_id ON assignments (employee_id);
CREATE INDEX idx_assignments_event_id    ON assignments (event_id);

COMMENT ON TABLE assignments IS 'Links employees to events with their role for that event.';


-- ─────────────────────────────────────────────────────────────
--  10. AVAILABILITY  (Date-level employee availability)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE availability (
  id          UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID                NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date        DATE                NOT NULL,
  status      availability_status NOT NULL DEFAULT 'available',
  notes       TEXT,
  created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  UNIQUE (employee_id, date)
);

CREATE INDEX idx_availability_employee_id ON availability (employee_id);
CREATE INDEX idx_availability_date        ON availability (date);
CREATE INDEX idx_availability_status      ON availability (status);

COMMENT ON TABLE availability IS 'Per-date availability record for each employee.';


-- ─────────────────────────────────────────────────────────────
--  11. EXPENSES  (Employee expense claims)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE expenses (
  id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  exp_ref      VARCHAR(20)   UNIQUE NOT NULL,                     -- e.g. EXP-2026-001
  employee_id  UUID          NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
  event_id     UUID          REFERENCES events(id) ON DELETE SET NULL,
  event_name   VARCHAR(200),                                      -- denormalized for quick display
  type         expense_type  NOT NULL,
  amount       NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  description  TEXT,
  bill_url     TEXT,                                              -- URL to uploaded bill/receipt
  status       expense_status NOT NULL DEFAULT 'submitted',
  review_note  TEXT,                                              -- rejection/review reason
  reviewed_by  UUID          REFERENCES employees(id),
  submitted_at TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_expenses_employee_id ON expenses (employee_id);
CREATE INDEX idx_expenses_event_id    ON expenses (event_id);
CREATE INDEX idx_expenses_status      ON expenses (status);

COMMENT ON TABLE expenses IS 'Employee expense claims with full approval workflow.';


-- ─────────────────────────────────────────────────────────────
--  12. REIMBURSEMENTS  (Approved expense payouts)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE reimbursements (
  id           UUID                  PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id   UUID                  NOT NULL UNIQUE REFERENCES expenses(id) ON DELETE RESTRICT,
  amount       NUMERIC(12,2)         NOT NULL CHECK (amount > 0),
  status       reimbursement_status  NOT NULL DEFAULT 'pending',
  payment_date TIMESTAMPTZ,
  payment_ref  VARCHAR(100),                                      -- bank transfer / UPI ref
  processed_by UUID                  REFERENCES employees(id),
  notes        TEXT,
  created_at   TIMESTAMPTZ           NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ           NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reimbursements_expense_id ON reimbursements (expense_id);
CREATE INDEX idx_reimbursements_status     ON reimbursements (status);

COMMENT ON TABLE reimbursements IS 'One-to-one payout record per approved expense.';


-- ─────────────────────────────────────────────────────────────
--  13. EARNINGS  (Derived — computed or pre-aggregated per event)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE earnings (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id        UUID          NOT NULL UNIQUE REFERENCES events(id) ON DELETE CASCADE,
  total_revenue   NUMERIC(14,2) NOT NULL DEFAULT 0,
  vendor_cost     NUMERIC(14,2) NOT NULL DEFAULT 0,
  employee_cost   NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_expense   NUMERIC(14,2) GENERATED ALWAYS AS (vendor_cost + employee_cost) STORED,
  net_profit      NUMERIC(14,2) GENERATED ALWAYS AS (total_revenue - (vendor_cost + employee_cost)) STORED,
  last_computed   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_earnings_event_id ON earnings (event_id);

COMMENT ON TABLE earnings IS 'Pre-aggregated earnings per event. Recomputed via trigger or API call.';


-- ─────────────────────────────────────────────────────────────
--  14. AUDIT LOGS  (Who changed what)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE audit_logs (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name  VARCHAR(60)  NOT NULL,
  record_id   UUID         NOT NULL,
  action      VARCHAR(20)  NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE')),
  changed_by  UUID         REFERENCES employees(id),
  old_data    JSONB,
  new_data    JSONB,
  ip_address  INET,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_table_name ON audit_logs (table_name);
CREATE INDEX idx_audit_logs_record_id  ON audit_logs (record_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at);

COMMENT ON TABLE audit_logs IS 'Immutable audit trail: every INSERT/UPDATE/DELETE on critical tables.';


-- ─────────────────────────────────────────────────────────────
--  VIEWS  (Useful computed views)
-- ─────────────────────────────────────────────────────────────

-- Live earnings view (no pre-aggregation needed)
CREATE OR REPLACE VIEW v_earnings_live AS
SELECT
  e.id                                                        AS event_id,
  e.name                                                      AS event_name,
  e.type                                                      AS event_type,
  e.start_date,
  COALESCE(SUM(DISTINCT t.amount) FILTER (WHERE t.status = 'success'), 0)  AS total_revenue,
  COALESCE(SUM(DISTINCT vc.cost),  0)                         AS vendor_cost,
  COALESCE(SUM(DISTINCT ex.amount) FILTER (WHERE ex.status IN ('approved','paid')), 0) AS employee_cost,
  COALESCE(SUM(DISTINCT t.amount) FILTER (WHERE t.status = 'success'), 0)
    - COALESCE(SUM(DISTINCT vc.cost), 0)
    - COALESCE(SUM(DISTINCT ex.amount) FILTER (WHERE ex.status IN ('approved','paid')), 0) AS net_profit
FROM events e
LEFT JOIN bookings b   ON b.event_id = e.id
LEFT JOIN transactions t ON t.booking_id = b.id
LEFT JOIN vendor_costs vc ON vc.event_id = e.id
LEFT JOIN assignments a  ON a.event_id = e.id
LEFT JOIN expenses ex    ON ex.event_id = e.id
GROUP BY e.id, e.name, e.type, e.start_date;


-- Booking summary with customer + event
CREATE OR REPLACE VIEW v_booking_summary AS
SELECT
  b.id,
  b.booking_ref,
  c.name        AS customer_name,
  c.phone       AS customer_phone,
  c.email       AS customer_email,
  e.name        AS event_name,
  e.type        AS event_type,
  b.revenue_type,
  b.tickets,
  b.total_amount,
  b.paid_amount,
  b.remaining_amount,
  b.status,
  b.travel_date,
  b.booking_date,
  b.pickup_location
FROM bookings b
JOIN customers c ON c.id = b.customer_id
LEFT JOIN events e ON e.id = b.event_id;


-- Employee workload summary
CREATE OR REPLACE VIEW v_employee_workload AS
SELECT
  emp.id,
  emp.emp_ref,
  emp.name,
  emp.role,
  emp.status,
  ep.experience_years,
  ep.performance_rating,
  COUNT(DISTINCT a.event_id)                           AS total_assignments,
  COALESCE(SUM(ex.amount) FILTER (WHERE ex.status IN ('submitted','under_review')), 0) AS pending_expense,
  COALESCE(SUM(ex.amount) FILTER (WHERE ex.status IN ('approved','paid')), 0)          AS approved_expense
FROM employees emp
LEFT JOIN employee_profiles ep ON ep.employee_id = emp.id
LEFT JOIN assignments a        ON a.employee_id = emp.id
LEFT JOIN expenses ex          ON ex.employee_id = emp.id
GROUP BY emp.id, emp.emp_ref, emp.name, emp.role, emp.status, ep.experience_years, ep.performance_rating;


-- ─────────────────────────────────────────────────────────────
--  TRIGGERS  (Auto-update updated_at)
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION _set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_customers_updated_at   BEFORE UPDATE ON customers   FOR EACH ROW EXECUTE FUNCTION _set_updated_at();
CREATE TRIGGER trg_bookings_updated_at    BEFORE UPDATE ON bookings    FOR EACH ROW EXECUTE FUNCTION _set_updated_at();
CREATE TRIGGER trg_events_updated_at      BEFORE UPDATE ON events      FOR EACH ROW EXECUTE FUNCTION _set_updated_at();
CREATE TRIGGER trg_vendors_updated_at     BEFORE UPDATE ON vendors     FOR EACH ROW EXECUTE FUNCTION _set_updated_at();
CREATE TRIGGER trg_employees_updated_at   BEFORE UPDATE ON employees   FOR EACH ROW EXECUTE FUNCTION _set_updated_at();
CREATE TRIGGER trg_expenses_updated_at    BEFORE UPDATE ON expenses    FOR EACH ROW EXECUTE FUNCTION _set_updated_at();
CREATE TRIGGER trg_reimburse_updated_at   BEFORE UPDATE ON reimbursements FOR EACH ROW EXECUTE FUNCTION _set_updated_at();


-- ─────────────────────────────────────────────────────────────
--  TRIGGER: Auto-create reimbursement when expense approved
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION _auto_create_reimbursement()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    INSERT INTO reimbursements (expense_id, amount, status)
    VALUES (NEW.id, NEW.amount, 'pending')
    ON CONFLICT (expense_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_expense_approved
  AFTER UPDATE ON expenses
  FOR EACH ROW
  WHEN (NEW.status = 'approved' AND OLD.status != 'approved')
  EXECUTE FUNCTION _auto_create_reimbursement();


-- ─────────────────────────────────────────────────────────────
--  TRIGGER: Update employee events_handled on new assignment
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION _increment_events_handled()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE employee_profiles
  SET events_handled = events_handled + 1
  WHERE employee_id = NEW.employee_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_assignment_inserted
  AFTER INSERT ON assignments
  FOR EACH ROW
  EXECUTE FUNCTION _increment_events_handled();


-- ─────────────────────────────────────────────────────────────
--  SAMPLE SEED DATA  (development only)
-- ─────────────────────────────────────────────────────────────
INSERT INTO customers (name, phone, email, address) VALUES
  ('Vedant Gadvede',   '9876543210', 'vedant@example.com',  'Pune, Maharashtra'),
  ('Ananya Patil',     '9765432109', 'ananya@example.com',  'Mumbai, Maharashtra'),
  ('Rohan Kulkarni',   '9654321098', 'rohan@example.com',   'Nashik, Maharashtra'),
  ('Siddhi Deshmukh',  '9543210987', 'siddhi@example.com',  'Aurangabad, Maharashtra'),
  ('Aditya Shinde',    '9432109876', 'aditya@example.com',  'Kolhapur, Maharashtra');

INSERT INTO events (name, type, location, start_date, end_date, price_per_person, max_capacity) VALUES
  ('Rajgad Fort Trek',       'trek',         'Rajgad, Pune',       '2026-04-06', '2026-04-06', 999,   30),
  ('Bhandardara Camping',    'camping',       'Bhandardara',        '2026-04-19', '2026-04-20', 1499,  20),
  ('SPPU College IV 2026',   'college_iv',    'Lonavala',           '2026-04-12', '2026-04-13', 2499,  40),
  ('Harishchandragad Trek',  'trek',         'Harishchandragad',   '2026-05-04', '2026-05-04', 1199,  25),
  ('Tent Rental — Pavna',    'tent_rental',  'Pavna Lake',         '2026-04-25', '2026-04-27', 699,   15);

INSERT INTO vendors (name, service_type, contact_person, phone, location) VALUES
  ('Shree Bus Services',        'bus',       'Mangesh Kadam',   '9811111111', 'Pune'),
  ('Annapoorna Caterers',       'food',      'Sunita Pawar',    '9822222222', 'Pune'),
  ('Adventure Gear Rentals',    'equipment', 'Rahul More',      '9833333333', 'Mumbai'),
  ('Lens & Life Photography',   'photography','Priya Joshi',    '9844444444', 'Nashik'),
  ('Himalayan Stay Solutions',  'stay',      'Vikram Singh',    '9855555555', 'Nashik');

INSERT INTO employees (emp_ref, name, email, phone, role) VALUES
  ('EMP-001', 'Rahul Patil',    'rahul@gadvedetrekkers.com',  '9876543210', 'trek_leader'),
  ('EMP-002', 'Priya Deshmukh', 'priya@gadvedetrekkers.com',  '9765432109', 'coordinator'),
  ('EMP-003', 'Amit Shinde',    'amit@gadvedetrekkers.com',   '9654321098', 'support_staff'),
  ('EMP-004', 'Sneha Kulkarni', 'sneha@gadvedetrekkers.com',  '9543210987', 'trek_leader'),
  ('EMP-005', 'Vikram Jadhav',  'vikram@gadvedetrekkers.com', '9432109876', 'coordinator');
