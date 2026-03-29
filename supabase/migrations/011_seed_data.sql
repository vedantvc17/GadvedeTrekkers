-- ============================================================
-- Migration 011: Seed / Demo Data for ALL 30 tables
-- ============================================================
-- IMPORTANT: Run 010_remaining_tables.sql FIRST if you haven't already.
-- Run in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

begin;

-- ============================================================
-- 1. CUSTOMERS  (20 realistic trekkers)
-- ============================================================
insert into public.customers
  (id, full_name, phone, email, booking_count, enquiry_count, last_contact_at)
values
  ('a1000000-0000-0000-0000-000000000001', 'Arjun Sharma',     '9820001001', 'arjun.sharma@gmail.com',    3, 2, now() - interval '2 days'),
  ('a1000000-0000-0000-0000-000000000002', 'Priya Patil',      '9820001002', 'priya.patil@gmail.com',     2, 3, now() - interval '5 days'),
  ('a1000000-0000-0000-0000-000000000003', 'Rohit Desai',      '9820001003', 'rohit.desai@gmail.com',     1, 1, now() - interval '7 days'),
  ('a1000000-0000-0000-0000-000000000004', 'Sneha Joshi',      '9820001004', 'sneha.joshi@gmail.com',     2, 4, now() - interval '3 days'),
  ('a1000000-0000-0000-0000-000000000005', 'Vikram Nair',      '9820001005', 'vikram.nair@gmail.com',     1, 0, now() - interval '10 days'),
  ('a1000000-0000-0000-0000-000000000006', 'Kavita Kulkarni',  '9820001006', 'kavita.kulkarni@gmail.com', 1, 1, now() - interval '8 days'),
  ('a1000000-0000-0000-0000-000000000007', 'Amit Verma',       '9820001007', 'amit.verma@gmail.com',      3, 2, now() - interval '1 day'),
  ('a1000000-0000-0000-0000-000000000008', 'Pooja Mehta',      '9820001008', 'pooja.mehta@gmail.com',     1, 2, now() - interval '4 days'),
  ('a1000000-0000-0000-0000-000000000009', 'Suresh Rao',       '9820001009', 'suresh.rao@gmail.com',      2, 1, now() - interval '6 days'),
  ('a1000000-0000-0000-0000-000000000010', 'Anita Singh',      '9820001010', 'anita.singh@gmail.com',     1, 3, now() - interval '9 days'),
  ('a1000000-0000-0000-0000-000000000011', 'Rahul Kadam',      '9820001011', 'rahul.kadam@gmail.com',     2, 2, now() - interval '2 days'),
  ('a1000000-0000-0000-0000-000000000012', 'Deepa Bhosale',    '9820001012', 'deepa.bhosale@gmail.com',   1, 1, now() - interval '11 days'),
  ('a1000000-0000-0000-0000-000000000013', 'Nikhil Gaikwad',   '9820001013', 'nikhil.gaikwad@gmail.com',  1, 0, now() - interval '14 days'),
  ('a1000000-0000-0000-0000-000000000014', 'Meera Chavan',     '9820001014', 'meera.chavan@gmail.com',    2, 2, now() - interval '3 days'),
  ('a1000000-0000-0000-0000-000000000015', 'Sanjay More',      '9820001015', 'sanjay.more@gmail.com',     1, 1, now() - interval '5 days'),
  ('a1000000-0000-0000-0000-000000000016', 'Ritu Shinde',      '9820001016', 'ritu.shinde@gmail.com',     1, 2, now() - interval '7 days'),
  ('a1000000-0000-0000-0000-000000000017', 'Kiran Pawar',      '9820001017', 'kiran.pawar@gmail.com',     3, 1, now() - interval '1 day'),
  ('a1000000-0000-0000-0000-000000000018', 'Sunita Jadhav',    '9820001018', 'sunita.jadhav@gmail.com',   1, 0, now() - interval '15 days'),
  ('a1000000-0000-0000-0000-000000000019', 'Ajay Thakur',      '9820001019', 'ajay.thakur@gmail.com',     2, 1, now() - interval '4 days'),
  ('a1000000-0000-0000-0000-000000000020', 'Lata Sawant',      '9820001020', 'lata.sawant@gmail.com',     1, 2, now() - interval '6 days')
on conflict (id) do nothing;

-- ============================================================
-- 2. PRODUCTS  (8 treks / tours)
-- ============================================================
insert into public.products
  (id, name, slug, product_type, region, location, duration_label, altitude_label,
   short_description, base_price, compare_at_price, rating, review_count,
   is_featured, is_active, sort_order)
values
  ('b1000000-0000-0000-0000-000000000001',
   'Rajmachi Trek', 'rajmachi-trek', 'trek',
   'Sahyadri', 'Lonavala, Maharashtra', '1 Day', '2710 ft',
   'One of the most popular overnight treks near Pune, passing through dense forests and ancient forts.',
   699, 999, 4.5, 120, true, true, 1),

  ('b1000000-0000-0000-0000-000000000002',
   'Harishchandragad Trek', 'harishchandragad-trek', 'trek',
   'Sahyadri', 'Ahmednagar, Maharashtra', '2 Days 1 Night', '4672 ft',
   'A challenging trek to the ancient fort with spectacular views of Konkan Kada.',
   1499, 1999, 4.7, 85, true, true, 2),

  ('b1000000-0000-0000-0000-000000000003',
   'Kalsubai Peak Trek', 'kalsubai-peak-trek', 'trek',
   'Sahyadri', 'Akole, Ahmednagar', '1 Day', '5400 ft',
   'Trek to the highest peak in Maharashtra — the Everest of Sahyadri.',
   799, 1099, 4.6, 98, true, true, 3),

  ('b1000000-0000-0000-0000-000000000004',
   'Andharban Forest Trail', 'andharban-forest-trail', 'trek',
   'Sahyadri', 'Pimpri, Pune', '1 Day', '2500 ft',
   'A mystical dense forest trail perfect for monsoon hiking with waterfalls.',
   649, 899, 4.4, 73, false, true, 4),

  ('b1000000-0000-0000-0000-000000000005',
   'Bhimashankar Trek', 'bhimashankar-trek', 'trek',
   'Sahyadri', 'Khed, Pune', '2 Days 1 Night', '3250 ft',
   'Trek through a wildlife sanctuary to the sacred Bhimashankar Jyotirlinga.',
   1299, 1699, 4.3, 62, false, true, 5),

  ('b1000000-0000-0000-0000-000000000006',
   'Pawna Lake Camping', 'pawna-lake-camping', 'camping',
   'Sahyadri', 'Pawna Lake, Pune', '1 Night 2 Days', 'Lakeside',
   'Scenic lakeside camping with bonfires, star gazing, and mountain views.',
   1199, 1499, 4.8, 210, true, true, 6),

  ('b1000000-0000-0000-0000-000000000007',
   'Mulshi Valley Trek & Camp', 'mulshi-valley-trek-camp', 'camping',
   'Sahyadri', 'Mulshi, Pune', '2 Days 1 Night', '2200 ft',
   'A relaxing valley camp with guided nature walks and sunrise views.',
   1399, 1799, 4.5, 55, false, true, 7),

  ('b1000000-0000-0000-0000-000000000008',
   'Sahyadri Heritage Walk', 'sahyadri-heritage-walk', 'heritage',
   'Sahyadri', 'Pune, Maharashtra', 'Half Day', '1800 ft',
   'A guided heritage walk through ancient forts and step-wells around Pune.',
   499, 699, 4.2, 38, false, true, 8)
on conflict (id) do nothing;

-- ============================================================
-- 3. PRODUCT BATCHES  (upcoming dates for each product)
-- ============================================================
-- actual columns: id, product_id, batch_date, batch_label, whatsapp_group_link, seats_total, seats_available, status
insert into public.product_batches
  (id, product_id, batch_date, batch_label, seats_total, seats_available, status)
values
  -- Rajmachi
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', '2026-04-05', 'Apr 05 Batch', 30, 18, 'OPEN'),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', '2026-04-12', 'Apr 12 Batch', 30, 22, 'OPEN'),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', '2026-04-19', 'Apr 19 Batch', 30, 27, 'OPEN'),
  -- Harishchandragad
  ('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', '2026-04-11', 'Apr 11 Batch', 25, 15, 'OPEN'),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000002', '2026-04-25', 'Apr 25 Batch', 25, 20, 'OPEN'),
  -- Kalsubai
  ('c1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000003', '2026-04-06', 'Apr 06 Batch', 30, 15, 'OPEN'),
  ('c1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000003', '2026-04-20', 'Apr 20 Batch', 30, 23, 'OPEN'),
  -- Andharban
  ('c1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000004', '2026-04-13', 'Apr 13 Batch', 25, 19, 'OPEN'),
  -- Pawna Camping
  ('c1000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000006', '2026-04-04', 'Apr 04 Batch', 40, 18, 'OPEN'),
  ('c1000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000006', '2026-04-11', 'Apr 11 Batch', 40, 22, 'OPEN'),
  ('c1000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000006', '2026-04-18', 'Apr 18 Batch', 40, 31, 'OPEN')
on conflict (id) do nothing;

-- ============================================================
-- 4. TREK DATES  (public-facing "next dates" dropdown)
-- ============================================================
insert into public.trek_dates (trek_name, trek_date, is_active, notes)
values
  ('Rajmachi Trek',           '2026-04-05', true, null),
  ('Rajmachi Trek',           '2026-04-12', true, null),
  ('Rajmachi Trek',           '2026-04-19', true, null),
  ('Harishchandragad Trek',   '2026-04-11', true, null),
  ('Harishchandragad Trek',   '2026-04-25', true, null),
  ('Kalsubai Peak Trek',      '2026-04-06', true, null),
  ('Kalsubai Peak Trek',      '2026-04-20', true, null),
  ('Andharban Forest Trail',  '2026-04-13', true, null),
  ('Bhimashankar Trek',       '2026-04-18', true, null),
  ('Pawna Lake Camping',      '2026-04-04', true, null),
  ('Pawna Lake Camping',      '2026-04-11', true, null),
  ('Pawna Lake Camping',      '2026-04-18', true, null),
  ('Mulshi Valley Trek & Camp','2026-04-26', true, null),
  ('Sahyadri Heritage Walk',  '2026-04-07', true, null),
  ('Sahyadri Heritage Walk',  '2026-04-14', true, null)
on conflict do nothing;

-- ============================================================
-- 5. BOOKINGS  (20 sample bookings)
-- ============================================================
insert into public.bookings
  (id, booking_code, legacy_booking_id, customer_id, product_id, batch_id,
   booking_source, status, payment_status,
   lead_first_name, lead_last_name, lead_phone, lead_email,
   ticket_quantity, departure_origin, pickup_location, travel_date,
   payment_option, payment_reference,
   base_amount, processing_fee, gst_amount, total_amount, payable_now, remaining_amount,
   manual_booking, transaction_at)
values
  ('d1000000-0000-0000-0000-000000000001','GT-2026-000001','GTK-A1B2C3D4','a1000000-0000-0000-0000-000000000001','b1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000001',
   'website','CONFIRMED','PAID',
   'Arjun','Sharma','9820001001','arjun.sharma@gmail.com',
   2,'Pune','Swargate',  '2026-04-05','full','UTR2026001A',
   1398,50,75,1523,1523,0, false, now() - interval '10 days'),

  ('d1000000-0000-0000-0000-000000000002','GT-2026-000002','GTK-B2C3D4E5','a1000000-0000-0000-0000-000000000002','b1000000-0000-0000-0000-000000000002','c1000000-0000-0000-0000-000000000004',
   'website','CONFIRMED','PARTIAL',
   'Priya','Patil','9820001002','priya.patil@gmail.com',
   1,'Mumbai','Dadar', '2026-04-11','partial','UTR2026002A',
   1499,50,81,1630,800,830, false, now() - interval '8 days'),

  ('d1000000-0000-0000-0000-000000000003','GT-2026-000003','GTK-C3D4E5F6','a1000000-0000-0000-0000-000000000003','b1000000-0000-0000-0000-000000000003','c1000000-0000-0000-0000-000000000006',
   'website','CONFIRMED','PAID',
   'Rohit','Desai','9820001003','rohit.desai@gmail.com',
   3,'Pune','Shivajinagar', '2026-04-06','full','UTR2026003A',
   2397,50,142,2589,2589,0, false, now() - interval '7 days'),

  ('d1000000-0000-0000-0000-000000000004','GT-2026-000004',null,'a1000000-0000-0000-0000-000000000004','b1000000-0000-0000-0000-000000000006','c1000000-0000-0000-0000-000000000009',
   'website','CONFIRMED','PAID',
   'Sneha','Joshi','9820001004','sneha.joshi@gmail.com',
   2,'Pune','Kothrud', '2026-04-04','full','UTR2026004A',
   2398,50,137,2585,2585,0, false, now() - interval '6 days'),

  ('d1000000-0000-0000-0000-000000000005','GT-2026-000005',null,'a1000000-0000-0000-0000-000000000005','b1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000002',
   'direct','CONFIRMED','PAID',
   'Vikram','Nair','9820001005','vikram.nair@gmail.com',
   1,'Mumbai','Thane', '2026-04-12','full','CASH2026005A',
   699,0,0,699,699,0, true, now() - interval '5 days'),

  ('d1000000-0000-0000-0000-000000000006','GT-2026-000006',null,'a1000000-0000-0000-0000-000000000006','b1000000-0000-0000-0000-000000000004','c1000000-0000-0000-0000-000000000008',
   'website','PENDING_APPROVAL','UNPAID',
   'Kavita','Kulkarni','9820001006','kavita.kulkarni@gmail.com',
   1,'Pune','Wakad', '2026-04-13','full','UTR2026006A',
   649,50,36,735,735,0, false, now() - interval '1 day'),

  ('d1000000-0000-0000-0000-000000000007','GT-2026-000007',null,'a1000000-0000-0000-0000-000000000007','b1000000-0000-0000-0000-000000000002','c1000000-0000-0000-0000-000000000005',
   'website','CONFIRMED','PAID',
   'Amit','Verma','9820001007','amit.verma@gmail.com',
   2,'Nashik','Nashik Road', '2026-04-25','full','UTR2026007A',
   2998,50,171,3219,3219,0, false, now() - interval '4 days'),

  ('d1000000-0000-0000-0000-000000000008','GT-2026-000008',null,'a1000000-0000-0000-0000-000000000008','b1000000-0000-0000-0000-000000000003','c1000000-0000-0000-0000-000000000007',
   'website','CONFIRMED','PARTIAL',
   'Pooja','Mehta','9820001008','pooja.mehta@gmail.com',
   1,'Pune','Hinjewadi', '2026-04-20','partial','UTR2026008A',
   799,50,45,894,400,494, false, now() - interval '3 days'),

  ('d1000000-0000-0000-0000-000000000009','GT-2026-000009','GTK-D4E5F6G7','a1000000-0000-0000-0000-000000000009','b1000000-0000-0000-0000-000000000006','c1000000-0000-0000-0000-000000000010',
   'website','CONFIRMED','PAID',
   'Suresh','Rao','9820001009','suresh.rao@gmail.com',
   4,'Pune','Deccan', '2026-04-11','full','UTR2026009A',
   4796,50,274,5120,5120,0, false, now() - interval '9 days'),

  ('d1000000-0000-0000-0000-000000000010','GT-2026-000010',null,'a1000000-0000-0000-0000-000000000010','b1000000-0000-0000-0000-000000000005',null,
   'customer_self_service','PENDING_APPROVAL','UNPAID',
   'Anita','Singh','9820001010','anita.singh@gmail.com',
   2,'Mumbai','CST', '2026-04-18','partial','UTR2026010A',
   2598,50,150,2798,1399,1399, false, now() - interval '2 hours'),

  ('d1000000-0000-0000-0000-000000000011','GT-2026-000011',null,'a1000000-0000-0000-0000-000000000011','b1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000003',
   'website','CONFIRMED','PAID',
   'Rahul','Kadam','9820001011','rahul.kadam@gmail.com',
   1,'Pune','Katraj', '2026-04-19','full','UTR2026011A',
   699,50,40,789,789,0, false, now() - interval '11 days'),

  ('d1000000-0000-0000-0000-000000000012','GT-2026-000012',null,'a1000000-0000-0000-0000-000000000012','b1000000-0000-0000-0000-000000000006','c1000000-0000-0000-0000-000000000011',
   'website','CONFIRMED','PAID',
   'Deepa','Bhosale','9820001012','deepa.bhosale@gmail.com',
   2,'Pune','Pimpri', '2026-04-18','full','UTR2026012A',
   2398,50,137,2585,2585,0, false, now() - interval '12 days'),

  ('d1000000-0000-0000-0000-000000000013','GT-2026-000013',null,'a1000000-0000-0000-0000-000000000013','b1000000-0000-0000-0000-000000000007',null,
   'website','CANCELLED','FAILED',
   'Nikhil','Gaikwad','9820001013','nikhil.gaikwad@gmail.com',
   1,'Pune','Baner', '2026-04-26','full','UTR2026013A',
   1399,50,80,1529,1529,0, false, now() - interval '14 days'),

  ('d1000000-0000-0000-0000-000000000014','GT-2026-000014',null,'a1000000-0000-0000-0000-000000000014','b1000000-0000-0000-0000-000000000002','c1000000-0000-0000-0000-000000000004',
   'website','CONFIRMED','PAID',
   'Meera','Chavan','9820001014','meera.chavan@gmail.com',
   2,'Nashik','College Road', '2026-04-11','full','UTR2026014A',
   2998,50,171,3219,3219,0, false, now() - interval '3 days'),

  ('d1000000-0000-0000-0000-000000000015','GT-2026-000015',null,'a1000000-0000-0000-0000-000000000015','b1000000-0000-0000-0000-000000000008',null,
   'website','COMPLETED','PAID',
   'Sanjay','More','9820001015','sanjay.more@gmail.com',
   1,'Pune','Hadapsar', '2026-03-20','full','UTR2026015A',
   499,50,28,577,577,0, false, now() - interval '20 days'),

  ('d1000000-0000-0000-0000-000000000016','GT-2026-000016',null,'a1000000-0000-0000-0000-000000000016','b1000000-0000-0000-0000-000000000003','c1000000-0000-0000-0000-000000000006',
   'website','CONFIRMED','PAID',
   'Ritu','Shinde','9820001016','ritu.shinde@gmail.com',
   1,'Nashik','Nashik Road', '2026-04-06','full','UTR2026016A',
   799,50,45,894,894,0, false, now() - interval '6 days'),

  ('d1000000-0000-0000-0000-000000000017','GT-2026-000017','GTK-E5F6G7H8','a1000000-0000-0000-0000-000000000017','b1000000-0000-0000-0000-000000000006','c1000000-0000-0000-0000-000000000009',
   'website','CONFIRMED','PAID',
   'Kiran','Pawar','9820001017','kiran.pawar@gmail.com',
   3,'Mumbai','Dadar', '2026-04-04','full','UTR2026017A',
   3597,50,206,3853,3853,0, false, now() - interval '1 day'),

  ('d1000000-0000-0000-0000-000000000018','GT-2026-000018',null,'a1000000-0000-0000-0000-000000000018','b1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000001',
   'website','CONFIRMED','PAID',
   'Sunita','Jadhav','9820001018','sunita.jadhav@gmail.com',
   1,'Pune','Viman Nagar', '2026-04-05','full','UTR2026018A',
   699,50,40,789,789,0, false, now() - interval '15 days'),

  ('d1000000-0000-0000-0000-000000000019','GT-2026-000019',null,'a1000000-0000-0000-0000-000000000019','b1000000-0000-0000-0000-000000000004','c1000000-0000-0000-0000-000000000008',
   'direct','CONFIRMED','PAID',
   'Ajay','Thakur','9820001019','ajay.thakur@gmail.com',
   2,'Pune','Kharadi', '2026-04-13','full','CASH2026019A',
   1298,0,0,1298,1298,0, true, now() - interval '4 days'),

  ('d1000000-0000-0000-0000-000000000020','GT-2026-000020',null,'a1000000-0000-0000-0000-000000000020','b1000000-0000-0000-0000-000000000005',null,
   'website','CONFIRMED','PARTIAL',
   'Lata','Sawant','9820001020','lata.sawant@gmail.com',
   1,'Mumbai','Borivali', '2026-04-18','partial','UTR2026020A',
   1299,50,74,1423,700,723, false, now() - interval '6 days')
on conflict (id) do nothing;

-- ============================================================
-- 6. BOOKING TRAVELERS  (lead traveler per booking)
-- ============================================================
insert into public.booking_travelers
  (booking_id, is_lead, first_name, last_name, mobile_number, email, departure_origin, pickup_location)
values
  ('d1000000-0000-0000-0000-000000000001', true,  'Arjun',  'Sharma',   '9820001001', 'arjun.sharma@gmail.com',   'Pune',    'Swargate'),
  ('d1000000-0000-0000-0000-000000000001', false, 'Meena',  'Sharma',   '9820001101', null,                       'Pune',    'Swargate'),
  ('d1000000-0000-0000-0000-000000000002', true,  'Priya',  'Patil',    '9820001002', 'priya.patil@gmail.com',    'Mumbai',  'Dadar'),
  ('d1000000-0000-0000-0000-000000000003', true,  'Rohit',  'Desai',    '9820001003', 'rohit.desai@gmail.com',    'Pune',    'Shivajinagar'),
  ('d1000000-0000-0000-0000-000000000003', false, 'Snehal', 'Desai',    '9820001103', null,                       'Pune',    'Shivajinagar'),
  ('d1000000-0000-0000-0000-000000000003', false, 'Raj',    'Desai',    '9820001203', null,                       'Pune',    'Shivajinagar'),
  ('d1000000-0000-0000-0000-000000000004', true,  'Sneha',  'Joshi',    '9820001004', 'sneha.joshi@gmail.com',    'Pune',    'Kothrud'),
  ('d1000000-0000-0000-0000-000000000004', false, 'Akash',  'Joshi',    '9820001104', null,                       'Pune',    'Kothrud'),
  ('d1000000-0000-0000-0000-000000000005', true,  'Vikram', 'Nair',     '9820001005', 'vikram.nair@gmail.com',    'Mumbai',  'Thane'),
  ('d1000000-0000-0000-0000-000000000006', true,  'Kavita', 'Kulkarni', '9820001006', 'kavita.kulkarni@gmail.com','Pune',    'Wakad'),
  ('d1000000-0000-0000-0000-000000000007', true,  'Amit',   'Verma',    '9820001007', 'amit.verma@gmail.com',     'Nashik',  'Nashik Road'),
  ('d1000000-0000-0000-0000-000000000007', false, 'Renu',   'Verma',    '9820001107', null,                       'Nashik',  'Nashik Road'),
  ('d1000000-0000-0000-0000-000000000008', true,  'Pooja',  'Mehta',    '9820001008', 'pooja.mehta@gmail.com',    'Pune',    'Hinjewadi'),
  ('d1000000-0000-0000-0000-000000000009', true,  'Suresh', 'Rao',      '9820001009', 'suresh.rao@gmail.com',     'Pune',    'Deccan'),
  ('d1000000-0000-0000-0000-000000000010', true,  'Anita',  'Singh',    '9820001010', 'anita.singh@gmail.com',    'Mumbai',  'CST'),
  ('d1000000-0000-0000-0000-000000000011', true,  'Rahul',  'Kadam',    '9820001011', 'rahul.kadam@gmail.com',    'Pune',    'Katraj'),
  ('d1000000-0000-0000-0000-000000000012', true,  'Deepa',  'Bhosale',  '9820001012', 'deepa.bhosale@gmail.com',  'Pune',    'Pimpri'),
  ('d1000000-0000-0000-0000-000000000013', true,  'Nikhil', 'Gaikwad',  '9820001013', 'nikhil.gaikwad@gmail.com', 'Pune',    'Baner'),
  ('d1000000-0000-0000-0000-000000000014', true,  'Meera',  'Chavan',   '9820001014', 'meera.chavan@gmail.com',   'Nashik',  'College Road'),
  ('d1000000-0000-0000-0000-000000000015', true,  'Sanjay', 'More',     '9820001015', 'sanjay.more@gmail.com',    'Pune',    'Hadapsar'),
  ('d1000000-0000-0000-0000-000000000016', true,  'Ritu',   'Shinde',   '9820001016', 'ritu.shinde@gmail.com',    'Nashik',  'Nashik Road'),
  ('d1000000-0000-0000-0000-000000000017', true,  'Kiran',  'Pawar',    '9820001017', 'kiran.pawar@gmail.com',    'Mumbai',  'Dadar'),
  ('d1000000-0000-0000-0000-000000000018', true,  'Sunita', 'Jadhav',   '9820001018', 'sunita.jadhav@gmail.com',  'Pune',    'Viman Nagar'),
  ('d1000000-0000-0000-0000-000000000019', true,  'Ajay',   'Thakur',   '9820001019', 'ajay.thakur@gmail.com',    'Pune',    'Kharadi'),
  ('d1000000-0000-0000-0000-000000000020', true,  'Lata',   'Sawant',   '9820001020', 'lata.sawant@gmail.com',    'Mumbai',  'Borivali')
on conflict do nothing;

-- ============================================================
-- 7. PAYMENTS  (15 payment records)
-- ============================================================
insert into public.payments
  (booking_id, customer_id, payment_mode, transaction_status, gross_amount, tax_amount, net_amount, payment_reference, paid_at)
values
  ('d1000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000001','UPI',  'SUCCESS',1523,75,1448,'UTR2026001A', now() - interval '10 days'),
  ('d1000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000002','UPI',  'SUCCESS', 800,0, 800, 'UTR2026002A', now() - interval '8 days'),
  ('d1000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000003','UPI',  'SUCCESS',2589,142,2447,'UTR2026003A',now() - interval '7 days'),
  ('d1000000-0000-0000-0000-000000000004','a1000000-0000-0000-0000-000000000004','UPI',  'SUCCESS',2585,137,2448,'UTR2026004A',now() - interval '6 days'),
  ('d1000000-0000-0000-0000-000000000005','a1000000-0000-0000-0000-000000000005','CASH', 'SUCCESS', 699,0, 699, 'CASH2026005A',now() - interval '5 days'),
  ('d1000000-0000-0000-0000-000000000007','a1000000-0000-0000-0000-000000000007','UPI',  'SUCCESS',3219,171,3048,'UTR2026007A', now() - interval '4 days'),
  ('d1000000-0000-0000-0000-000000000008','a1000000-0000-0000-0000-000000000008','UPI',  'SUCCESS', 400,0, 400, 'UTR2026008A', now() - interval '3 days'),
  ('d1000000-0000-0000-0000-000000000009','a1000000-0000-0000-0000-000000000009','CARD', 'SUCCESS',5120,274,4846,'UTR2026009A', now() - interval '9 days'),
  ('d1000000-0000-0000-0000-000000000011','a1000000-0000-0000-0000-000000000011','UPI',  'SUCCESS', 789,40, 749,'UTR2026011A', now() - interval '11 days'),
  ('d1000000-0000-0000-0000-000000000012','a1000000-0000-0000-0000-000000000012','UPI',  'SUCCESS',2585,137,2448,'UTR2026012A',now() - interval '12 days'),
  ('d1000000-0000-0000-0000-000000000013','a1000000-0000-0000-0000-000000000013','UPI',  'REFUNDED',1529,80,1449,'UTR2026013A',now() - interval '14 days'),
  ('d1000000-0000-0000-0000-000000000014','a1000000-0000-0000-0000-000000000014','UPI',  'SUCCESS',3219,171,3048,'UTR2026014A', now() - interval '3 days'),
  ('d1000000-0000-0000-0000-000000000015','a1000000-0000-0000-0000-000000000015','UPI',  'SUCCESS', 577,28, 549,'UTR2026015A', now() - interval '20 days'),
  ('d1000000-0000-0000-0000-000000000017','a1000000-0000-0000-0000-000000000017','UPI',  'SUCCESS',3853,206,3647,'UTR2026017A', now() - interval '1 day'),
  ('d1000000-0000-0000-0000-000000000019','a1000000-0000-0000-0000-000000000019','CASH', 'SUCCESS',1298,0,1298, 'CASH2026019A',now() - interval '4 days')
on conflict do nothing;

-- ============================================================
-- 8. PAYMENT REFUNDS  (1 refund for the cancelled booking)
-- ============================================================
insert into public.payment_refunds (payment_id, booking_id, amount, status, reason)
select p.id, p.booking_id, 1529, 'REFUNDED', 'Customer cancelled 14 days before trek — full refund processed.'
from public.payments p where p.payment_reference = 'UTR2026013A'
on conflict do nothing;

-- ============================================================
-- 9. LISTING SUBMISSIONS  (3 partner listing requests)
-- actual columns: id, submission_type, title, subtype, status,
--   contact_name, phone, email, location, description, submitted_at
-- ============================================================
insert into public.listing_submissions
  (submission_type, title, subtype, status, contact_name, phone, email, location, description, submitted_at)
values
  ('event',    'Torna Fort Trek',    'day-trek',      'PENDING',  'Hemant Borse',   '9812001001', 'hemant.borse@trekco.in',   'Pune, Maharashtra', 'Guided trek to Prachandagad (Torna Fort), the first fort captured by Chhatrapati Shivaji Maharaj.', now() - interval '5 days'),
  ('event',    'Sandhan Valley Trek','canyon-trek',  'APPROVED', 'Ananya Gokhale', '9812002002', 'ananya.gokhale@outdoor.in','Igatpuri, Nashik',  'Thrilling rappelling and canyon walk through the Sandhan Valley.',                                 now() - interval '12 days'),
  ('campsite', 'Purushgad Camping',  'overnight',    'PENDING',  'Rajan Patel',    '9812003003', 'rajan.patel@campcrew.in',  'Wai, Satara',       'Overnight camping at the base of Purushgad with sunrise views over Sahyadri.',                      now() - interval '2 days')
on conflict do nothing;

-- ============================================================
-- 10. ENQUIRIES  (12 enquiries, various statuses)
-- ============================================================
insert into public.enquiries
  (id, customer_id, name, phone, email, event_name, category, location,
   message, preferred_date, group_size, status, tags, created_at)
values
  ('ENQ-2026-001','a1000000-0000-0000-0000-000000000002','Priya Patil','9820001002','priya.patil@gmail.com',
   'Rajmachi Trek','trek','Pune',
   'I want to book for 2 people. What gear do I need to carry?','2026-04-05','2','CONTACTED','["new","gear-query"]'::jsonb, now() - interval '5 days'),

  ('ENQ-2026-002','a1000000-0000-0000-0000-000000000004','Sneha Joshi','9820001004','sneha.joshi@gmail.com',
   'Harishchandragad Trek','trek','Pune',
   'Is this trek suitable for beginners? We are a group of 4.','2026-04-25','4','QUOTED','["beginner","group"]'::jsonb, now() - interval '3 days'),

  ('ENQ-2026-003',null,'Rahul Pandey','9833001003','rahul.pandey@gmail.com',
   'Pawna Lake Camping','camping','Pune',
   'Looking for weekend camping for my office team of 15 people. Do you have group discounts?','2026-04-11','15','NEW_LEAD','["corporate","group","discount"]'::jsonb, now() - interval '1 day'),

  ('ENQ-2026-004','a1000000-0000-0000-0000-000000000010','Anita Singh','9820001010','anita.singh@gmail.com',
   'Bhimashankar Trek','trek','Mumbai',
   'What is the difficulty level? I have knee issues.','2026-04-18','2','CONTACTED','["medical","fitness"]'::jsonb, now() - interval '2 days'),

  ('ENQ-2026-005',null,'Suresh Kulkarni','9845005005','suresh.kulkarni@gmail.com',
   'Kalsubai Peak Trek','trek','Nashik',
   'Can we start from Nashik? What is the transport arrangement?','2026-04-20','3','NEW_LEAD','["transport"]'::jsonb, now() - interval '4 hours'),

  ('ENQ-2026-006','a1000000-0000-0000-0000-000000000007','Amit Verma','9820001007','amit.verma@gmail.com',
   'Andharban Forest Trail','trek','Nashik',
   'Is it safe during monsoon? We want to go in July.','2026-07-12','2','QUOTED','["monsoon","safety"]'::jsonb, now() - interval '8 days'),

  ('ENQ-2026-007',null,'Divya Naik','9877007007','divya.naik@gmail.com',
   'Mulshi Valley Trek & Camp','camping','Pune',
   'Can solo trekkers join? What is the safety arrangement for women?','2026-04-26','1','CONTACTED','["solo","women-safety"]'::jsonb, now() - interval '2 days'),

  ('ENQ-2026-008',null,'Prakash Wagh','9822008008','prakash.wagh@gmail.com',
   'Sahyadri Heritage Walk','heritage','Pune',
   'Interested for school students aged 14-17. Do you have student packages?','2026-04-14','20','NEW_LEAD','["school","kids","group"]'::jsonb, now() - interval '6 hours'),

  ('ENQ-2026-009','a1000000-0000-0000-0000-000000000014','Meera Chavan','9820001014','meera.chavan@gmail.com',
   'Harishchandragad Trek','trek','Nashik',
   'We booked earlier. Can we get the WhatsApp group link?','2026-04-11','2','CONVERTED','["existing-customer","whatsapp"]'::jsonb, now() - interval '3 days'),

  ('ENQ-2026-010',null,'Vinay Patkar','9844010010','vinay.patkar@gmail.com',
   'Rajmachi Trek','trek','Mumbai',
   'What is the cancellation policy? Planning for May long weekend.','2026-05-02','5','LOST','["cancellation","policy"]'::jsonb, now() - interval '12 days'),

  ('ENQ-2026-011',null,'Geeta Bhatt','9836011011','geeta.bhatt@gmail.com',
   'Pawna Lake Camping','camping','Pune',
   'Looking for anniversary camping setup. Do you offer customisation?','2026-04-18','2','NEW_LEAD','["couples","anniversary","custom"]'::jsonb, now() - interval '30 minutes'),

  ('ENQ-2026-012','a1000000-0000-0000-0000-000000000016','Ritu Shinde','9820001016','ritu.shinde@gmail.com',
   'Kalsubai Peak Trek','trek','Nashik',
   'I already booked. Wanted to confirm pickup from Nashik Road.','2026-04-06','1','CONVERTED','["existing-customer","pickup"]'::jsonb, now() - interval '6 days')
on conflict (id) do nothing;

-- ============================================================
-- 11. EMPLOYEES  (6 staff members)
-- ============================================================
insert into public.employees
  (employee_id, full_name, role, email, contact_number, username, password_plain,
   expertise, experience_years, location, status, performance_rating, events_handled)
values
  ('EMP-001', 'Rajesh Gadvede',  'admin',   'rajesh@gadvedetrekkers.com', '9800001001', 'rajesh',   'Admin@123', 'Operations & Leadership',  8, 'Pune',    'active', 4.9, 150),
  ('EMP-002', 'Santosh Mane',    'guide',   'santosh@gadvedetrekkers.com','9800001002', 'santosh',  'Guide@123', 'Sahyadri Trekking',         5, 'Pune',    'active', 4.7, 80),
  ('EMP-003', 'Pooja Gaikwad',   'sales',   'pooja@gadvedetrekkers.com', '9800001003', 'poojag',   'Sales@123', 'Customer Relations',        3, 'Pune',    'active', 4.5, 0),
  ('EMP-004', 'Mahesh Shinde',   'guide',   'mahesh@gadvedetrekkers.com','9800001004', 'mahesh',   'Guide@123', 'High Altitude Trekking',    6, 'Nashik',  'active', 4.6, 60),
  ('EMP-005', 'Laxmi Bhor',      'coordinator','laxmi@gadvedetrekkers.com','9800001005','laxmi',   'Coord@123', 'Logistics & Planning',      4, 'Pune',    'active', 4.4, 0),
  ('EMP-006', 'Deepak Kamble',   'guide',   'deepak@gadvedetrekkers.com','9800001006', 'deepak',   'Guide@123', 'Wildlife & Forest Trails',  2, 'Igatpuri','active', 4.2, 30)
on conflict (employee_id) do nothing;

-- ============================================================
-- 12. EMPLOYEE ASSIGNMENTS
-- ============================================================
insert into public.employee_assignments
  (assignment_id, employee_id, trek_name, event_date, role, status, notes)
values
  ('ASMT-001', 'EMP-002', 'Rajmachi Trek',           '2026-04-05', 'Lead Guide',      'ASSIGNED',  'Ensure pickup at Swargate by 6 AM'),
  ('ASMT-002', 'EMP-004', 'Harishchandragad Trek',   '2026-04-11', 'Lead Guide',      'ASSIGNED',  'Base camp setup by Saturday evening'),
  ('ASMT-003', 'EMP-002', 'Kalsubai Peak Trek',      '2026-04-06', 'Lead Guide',      'ASSIGNED',  'Early start 5 AM from Nashik Road'),
  ('ASMT-004', 'EMP-006', 'Andharban Forest Trail',  '2026-04-13', 'Guide',           'ASSIGNED',  'Carry first-aid kit; trail is slippery'),
  ('ASMT-005', 'EMP-005', 'Pawna Lake Camping',      '2026-04-04', 'Camp Coordinator','ASSIGNED',  'Bonfire setup by 7 PM'),
  ('ASMT-006', 'EMP-003', 'Pawna Lake Camping',      '2026-04-04', 'Sales Support',   'ASSIGNED',  'Handle check-ins and guest queries'),
  ('ASMT-007', 'EMP-002', 'Rajmachi Trek',           '2026-04-12', 'Lead Guide',      'ASSIGNED',  null),
  ('ASMT-008', 'EMP-004', 'Bhimashankar Trek',       '2026-04-18', 'Lead Guide',      'ASSIGNED',  'Wildlife briefing mandatory before start')
on conflict (assignment_id) do nothing;

-- ============================================================
-- 13. EMPLOYEE EXPENSES
-- ============================================================
insert into public.employee_expenses
  (expense_id, employee_id, category, amount, description, status, expense_date)
values
  ('EXP-001', 'EMP-002', 'Transport', 450,   'Bus fare Pune to Karjat for Rajmachi Trek recce', 'APPROVED', '2026-03-20'),
  ('EXP-002', 'EMP-004', 'Food',      320,   'Team lunch during Harishchandragad trail check',  'APPROVED', '2026-03-22'),
  ('EXP-003', 'EMP-005', 'Equipment', 1200,  'Camping tent repair and bonfire wood',            'PENDING',  '2026-03-25'),
  ('EXP-004', 'EMP-006', 'Transport', 280,   'Auto fare for Andharban trail recce',             'APPROVED', '2026-03-26'),
  ('EXP-005', 'EMP-002', 'First Aid', 650,   'First-aid kit resupply for April treks',          'PENDING',  '2026-03-28')
on conflict (expense_id) do nothing;

-- ============================================================
-- 14. EMPLOYEE AVAILABILITY
-- ============================================================
insert into public.employee_availability
  (availability_id, employee_id, available_date, is_available, notes)
values
  ('AVAIL-001', 'EMP-002', '2026-04-05', true,  null),
  ('AVAIL-002', 'EMP-002', '2026-04-06', true,  null),
  ('AVAIL-003', 'EMP-002', '2026-04-12', true,  null),
  ('AVAIL-004', 'EMP-002', '2026-04-13', false, 'Personal leave'),
  ('AVAIL-005', 'EMP-004', '2026-04-11', true,  null),
  ('AVAIL-006', 'EMP-004', '2026-04-18', true,  null),
  ('AVAIL-007', 'EMP-004', '2026-04-19', false, 'Rest day after Bhimashankar'),
  ('AVAIL-008', 'EMP-006', '2026-04-13', true,  null),
  ('AVAIL-009', 'EMP-005', '2026-04-04', true,  null),
  ('AVAIL-010', 'EMP-005', '2026-04-11', true,  null)
on conflict (availability_id) do nothing;

-- ============================================================
-- 15. TREK EVENTS  (5 upcoming events)
-- ============================================================
insert into public.trek_events
  (event_id, product_id, trek_name, event_date, leader_name, leader_id, vendor_name, vendor_id, seats_total, seats_booked, status, notes)
values
  ('GT-EVT-001', 'b1000000-0000-0000-0000-000000000001', 'Rajmachi Trek',          '2026-04-05', 'Santosh Mane', 'EMP-002', 'Shivaji Travels', 'v-01', 30, 12, 'UPCOMING', 'Pickup from Swargate at 6 AM. Carry dry food.'),
  ('GT-EVT-002', 'b1000000-0000-0000-0000-000000000002', 'Harishchandragad Trek',  '2026-04-11', 'Mahesh Shinde','EMP-004', 'Nashik Bus Services','v-04',25,10, 'UPCOMING', 'Kokankada viewpoint mandatory. Pack warm clothes.'),
  ('GT-EVT-003', 'b1000000-0000-0000-0000-000000000003', 'Kalsubai Peak Trek',     '2026-04-06', 'Santosh Mane', 'EMP-002', 'Shivaji Travels', 'v-01', 30, 15, 'UPCOMING', 'Starting from Nashik Road pickup at 5 AM.'),
  ('GT-EVT-004', 'b1000000-0000-0000-0000-000000000006', 'Pawna Lake Camping',     '2026-04-04', 'Laxmi Bhor',   'EMP-005', 'Mountain Bites',  'v-05', 40, 22, 'UPCOMING', 'Bonfire at 7 PM. Breakfast at 7 AM next day.'),
  ('GT-EVT-005', 'b1000000-0000-0000-0000-000000000008', 'Sahyadri Heritage Walk', '2026-03-20', 'Rajesh Gadvede','EMP-001',null,               null,  20, 15, 'COMPLETED','Completed successfully. 15 participants attended.')
on conflict (event_id) do nothing;

-- ============================================================
-- 16 & 17. EVENT OPERATIONS + TASKS
-- NOTE: These tables were created by your own schema SQL.
-- Their exact column names are not in our migration files.
-- The inserts below use common column names — if you get a
-- "column does not exist" error, run the verify query at the
-- bottom first to check the actual column names, then adjust.
-- ============================================================
-- actual columns: id, product_id, batch_id, current_stage, notes, created_by
-- Insert event_operations and capture their IDs to seed tasks
do $$
declare
  eo1_id uuid;
  eo2_id uuid;
  eo3_id uuid;
begin
  insert into public.event_operations (product_id, batch_id, current_stage, notes, created_by)
  values ('b1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000001','PRE_EVENT','Confirm bus driver contact 1 day before event','EMP-001')
  returning id into eo1_id;

  insert into public.event_operations (product_id, batch_id, current_stage, notes, created_by)
  values ('b1000000-0000-0000-0000-000000000002','c1000000-0000-0000-0000-000000000004','PRE_EVENT','Meal arrangements with vendor v-04 pending','EMP-001')
  returning id into eo2_id;

  insert into public.event_operations (product_id, batch_id, current_stage, notes, created_by)
  values ('b1000000-0000-0000-0000-000000000006','c1000000-0000-0000-0000-000000000009','PRE_EVENT','Carry backup torch batteries','EMP-001')
  returning id into eo3_id;

  -- actual task columns: event_operation_id, task_key, label, required_stage, status, assigned_to, note
  insert into public.event_operation_tasks (event_operation_id, task_key, label, required_stage, status, assigned_to, note)
  values
    (eo1_id, 'confirm_bus',       'Confirm bus driver',       'PRE_EVENT', 'PENDING',   'EMP-005', null),
    (eo1_id, 'pickup_list_pdf',   'Prepare pickup list PDF',  'PRE_EVENT', 'COMPLETED', 'EMP-003', null),
    (eo1_id, 'whatsapp_announce', 'WhatsApp group announce',  'PRE_EVENT', 'COMPLETED', 'EMP-003', 'Group link sent to all 12 trekkers'),
    (eo2_id, 'book_return_bus',   'Book return bus',          'PRE_EVENT', 'PENDING',   'EMP-005', null),
    (eo2_id, 'confirm_basecamp',  'Confirm base camp stay',   'PRE_EVENT', 'PENDING',   'EMP-004', null),
    (eo3_id, 'gear_checklist',    'Camping gear checklist',   'PRE_EVENT', 'COMPLETED', 'EMP-005', 'All tents and sleeping bags checked');

exception when others then
  raise notice 'event_operations/tasks insert skipped: %', sqlerrm;
end $$;

-- ============================================================
-- 18. ACTIVITY LOGS  (recent admin/system activity)
-- ============================================================
insert into public.activity_logs (action, action_label, details, module, severity, performed_by, created_at)
values
  ('BOOKING_CREATED',    'New Booking',          'GT-2026-000017 — Kiran Pawar — Pawna Lake Camping — ₹3,853',  'bookings',   'success', 'admin',   now() - interval '1 day'),
  ('BOOKING_CONFIRMED',  'Booking Confirmed',    'GT-2026-000007 — Amit Verma — Harishchandragad Trek',         'bookings',   'success', 'admin',   now() - interval '4 days'),
  ('BOOKING_CANCELLED',  'Booking Cancelled',    'GT-2026-000013 — Nikhil Gaikwad — Refund issued ₹1,529',      'bookings',   'warning', 'admin',   now() - interval '14 days'),
  ('PAYMENT_RECEIVED',   'Payment Received',     '₹5,120 via CARD — Suresh Rao — GT-2026-000009',               'payments',   'success', 'system',  now() - interval '9 days'),
  ('REFUND_PROCESSED',   'Refund Processed',     '₹1,529 refunded for GT-2026-000013',                           'payments',   'info',    'admin',   now() - interval '13 days'),
  ('ENQUIRY_RECEIVED',   'New Enquiry',          'ENQ-2026-011 — Geeta Bhatt — Pawna Lake Camping',             'enquiries',  'info',    'system',  now() - interval '30 minutes'),
  ('EMPLOYEE_ASSIGNED',  'Guide Assigned',       'Santosh Mane assigned to Rajmachi Trek — 05 Apr 2026',        'employees',  'info',    'admin',   now() - interval '7 days'),
  ('TREK_EVENT_CREATED', 'Trek Event Created',   'GT-EVT-004 — Pawna Lake Camping — 04 Apr 2026',               'trek_events','info',    'admin',   now() - interval '10 days'),
  ('BOOKING_PENDING',    'Pending Approval',     'GT-2026-000006 — Kavita Kulkarni submitted booking request',  'bookings',   'warning', 'system',  now() - interval '1 day'),
  ('LISTING_SUBMITTED',  'New Listing Request',  'LS-2026-003 — Purushgad Camping — Rajan Patel',               'listings',   'info',    'system',  now() - interval '2 days'),
  ('PRODUCT_UPDATED',    'Product Updated',      'Pawna Lake Camping — price updated to ₹1,199',                'products',   'info',    'admin',   now() - interval '5 days'),
  ('SYSTEM_STARTUP',     'Backend Started',      'Express API started on port 4000',                            'system',     'info',    'system',  now() - interval '2 hours')
on conflict do nothing;

-- ============================================================
-- 19. NOTIFICATIONS
-- ============================================================
insert into public.notifications (type, title, message, meta, is_read, created_at)
values
  ('BOOKING',  'New Booking Request',        'Kavita Kulkarni submitted a booking request for Andharban Forest Trail.',   '{"bookingCode":"GT-2026-000006"}'::jsonb, false, now() - interval '1 day'),
  ('BOOKING',  'New Booking Request',        'Anita Singh submitted a booking request for Bhimashankar Trek.',            '{"bookingCode":"GT-2026-000010"}'::jsonb, false, now() - interval '2 hours'),
  ('ENQUIRY',  'New Enquiry',                'Geeta Bhatt enquired about Pawna Lake Camping — anniversary setup.',        '{"enquiryId":"ENQ-2026-011"}'::jsonb,     false, now() - interval '30 minutes'),
  ('ENQUIRY',  'New Enquiry',                'Prakash Wagh enquired about Sahyadri Heritage Walk for school students.',   '{"enquiryId":"ENQ-2026-008"}'::jsonb,     false, now() - interval '6 hours'),
  ('PAYMENT',  'Payment Received',           '₹3,853 received from Kiran Pawar for Pawna Lake Camping.',                 '{"reference":"UTR2026017A"}'::jsonb,      true,  now() - interval '1 day'),
  ('PAYMENT',  'Refund Processed',           '₹1,529 refunded for booking GT-2026-000013 (Nikhil Gaikwad).',              '{"bookingCode":"GT-2026-000013"}'::jsonb, true,  now() - interval '13 days'),
  ('INFO',     'Upcoming Trek — 4 Days',     'Pawna Lake Camping on 04 Apr 2026 — 22 bookings confirmed.',               '{"eventId":"GT-EVT-004"}'::jsonb,          false, now() - interval '4 hours'),
  ('WARNING',  'Batch Almost Full',          'Rajmachi Trek on 05 Apr 2026 — only 18 seats remaining.',                  '{"eventId":"GT-EVT-001"}'::jsonb,          false, now() - interval '3 hours')
on conflict do nothing;

-- ============================================================
-- 20. EMAIL ALERT LOG
-- ============================================================
insert into public.email_alert_log
  (kind, booking_id, customer_name, customer_email, event_name, amount, travel_date, pickup_location, attempted_at)
values
  ('BOOKING_CONFIRMATION', 'GT-2026-000001', 'Arjun Sharma',   'arjun.sharma@gmail.com',  'Rajmachi Trek',          1523, '2026-04-05', 'Swargate',     now() - interval '10 days'),
  ('BOOKING_CONFIRMATION', 'GT-2026-000003', 'Rohit Desai',    'rohit.desai@gmail.com',   'Kalsubai Peak Trek',     2589, '2026-04-06', 'Shivajinagar', now() - interval '7 days'),
  ('BOOKING_CONFIRMATION', 'GT-2026-000009', 'Suresh Rao',     'suresh.rao@gmail.com',    'Pawna Lake Camping',     5120, '2026-04-11', 'Deccan',       now() - interval '9 days'),
  ('BOOKING_CONFIRMATION', 'GT-2026-000017', 'Kiran Pawar',    'kiran.pawar@gmail.com',   'Pawna Lake Camping',     3853, '2026-04-04', 'Dadar',        now() - interval '1 day'),
  ('CANCELLATION',         'GT-2026-000013', 'Nikhil Gaikwad', 'nikhil.gaikwad@gmail.com','Mulshi Valley Trek & Camp',1529,'2026-04-26','Baner',        now() - interval '13 days'),
  ('ENQUIRY_RESPONSE',     null,             'Priya Patil',    'priya.patil@gmail.com',   'Rajmachi Trek',          null, '2026-04-05', null,           now() - interval '4 days'),
  ('PAYMENT_REMINDER',     'GT-2026-000002', 'Priya Patil',    'priya.patil@gmail.com',   'Harishchandragad Trek',   830, '2026-04-11', 'Dadar',        now() - interval '3 days'),
  ('PAYMENT_REMINDER',     'GT-2026-000020', 'Lata Sawant',    'lata.sawant@gmail.com',   'Bhimashankar Trek',       723, '2026-04-18', 'Borivali',     now() - interval '2 days')
on conflict do nothing;

-- ============================================================
-- 21. FEEDBACK / REVIEWS
-- ============================================================
insert into public.feedback (customer_id, booking_id, trek_name, rating, comment, source, status, created_at)
values
  ('a1000000-0000-0000-0000-000000000015', 'GT-2026-000015', 'Sahyadri Heritage Walk',  5, 'Absolutely loved the heritage walk! Rajesh Sir''s commentary was amazing. Highly recommended for families.', 'website', 'APPROVED', now() - interval '8 days'),
  ('a1000000-0000-0000-0000-000000000001', 'GT-2026-000001', 'Rajmachi Trek',           4, 'Great experience overall. The views were stunning. The return bus was slightly late but guides were excellent.', 'website', 'APPROVED', now() - interval '5 days'),
  ('a1000000-0000-0000-0000-000000000009', 'GT-2026-000009', 'Pawna Lake Camping',      5, 'Best camping experience near Pune! Bonfire, stargazing, and the breakfast next morning were all top-notch.', 'website', 'APPROVED', now() - interval '4 days'),
  ('a1000000-0000-0000-0000-000000000003', 'GT-2026-000003', 'Kalsubai Peak Trek',      4, 'Very well organised. Summit view was worth every step. Could use more snack stops on the way up.', 'website', 'PENDING', now() - interval '2 days'),
  ('a1000000-0000-0000-0000-000000000017', 'GT-2026-000017', 'Pawna Lake Camping',      5, 'Took my family for the first time camping — my kids loved it! Santosh bhai looked after everyone brilliantly.', 'website', 'PENDING', now() - interval '12 hours')
on conflict do nothing;

-- ============================================================
-- 22. INCENTIVES
-- ============================================================
insert into public.incentives (employee_id, rule_name, amount, type, trek_name, status, notes, created_at)
values
  ('EMP-002', 'Lead Guide Bonus — April Rajmachi', 500,  'FIXED',   'Rajmachi Trek',          'PENDING', 'Payable after event on 05 Apr',    now() - interval '2 days'),
  ('EMP-004', 'Lead Guide Bonus — Harishchandragad', 750,'FIXED',   'Harishchandragad Trek',  'PENDING', 'Payable after event on 11 Apr',    now() - interval '2 days'),
  ('EMP-003', 'Sales Commission Q1',              1200,  'FIXED',   null,                     'PAID',    'Q1 commission — 12 bookings closed',now() - interval '30 days'),
  ('EMP-005', 'Camp Coordination Bonus',           600,  'FIXED',   'Pawna Lake Camping',     'PENDING', 'For April 04 camp',                now() - interval '3 days'),
  ('EMP-002', 'Performance Bonus — March',         800,  'FIXED',   null,                     'PAID',    'Best rated guide — March',         now() - interval '28 days')
on conflict do nothing;

-- ============================================================
-- 23. RATE APPROVALS
-- ============================================================
insert into public.rate_approvals
  (vendor_id, trek_event_id, requested_by, amount, reason, status, reviewed_by, reviewed_at, created_at)
values
  ('v-01', 'GT-EVT-001', 'EMP-005', 15000, 'AC Bus hire for Rajmachi Trek 05 Apr — 30 pax',         'APPROVED', 'EMP-001', now() - interval '6 days', now() - interval '8 days'),
  ('v-04', 'GT-EVT-002', 'EMP-005', 12000, 'Non-AC Bus hire for Harishchandragad Trek 11 Apr — 25 pax','PENDING', null,      null,                      now() - interval '2 days'),
  ('v-05', 'GT-EVT-004', 'EMP-005',  4800, 'Food for Pawna Camp — 40 pax breakfast + snacks',        'APPROVED', 'EMP-001', now() - interval '4 days', now() - interval '5 days'),
  ('v-03', 'GT-EVT-001', 'EMP-002',  2000, 'Rental gear for 4 first-time trekkers',                  'REJECTED', 'EMP-001', now() - interval '7 days', now() - interval '9 days')
on conflict do nothing;

-- ============================================================
-- 24. FEATURE FLAGS
-- ============================================================
insert into public.feature_flags (flag_key, enabled, description)
values
  ('enable_online_payments',     true,  'Enable Razorpay / UPI gateway on booking form'),
  ('enable_customer_self_service',true, 'Allow customers to submit bookings via public link'),
  ('enable_whatsapp_alerts',     false, 'Send WhatsApp notifications on booking confirmation'),
  ('enable_email_notifications', true,  'Send email confirmations for bookings and enquiries'),
  ('enable_referral_system',     false, 'Allow referral codes on checkout'),
  ('show_trek_ratings',          true,  'Display star ratings on public product listings'),
  ('enable_group_discounts',     false, 'Apply automatic group discounts for 5+ travelers'),
  ('maintenance_mode',           false, 'Put the entire site in maintenance mode')
on conflict (flag_key) do nothing;

-- ============================================================
-- 25. EARNINGS  (monthly revenue summary)
-- ============================================================
insert into public.earnings (period, category, gross, expenses, notes)
values
  ('2025-10', 'Trek',    85000,  28000, 'Oct 2025 — 8 treks, 12 camps'),
  ('2025-11', 'Trek',   102000,  34500, 'Nov 2025 — 10 treks; Diwali long weekend boost'),
  ('2025-12', 'Trek',    78000,  25000, 'Dec 2025 — lower bookings due to winter'),
  ('2025-12', 'Camping', 45000,  18000, 'Dec 2025 — 5 campfire events'),
  ('2026-01', 'Trek',    95000,  31000, 'Jan 2026 — New Year trek boost'),
  ('2026-01', 'Camping', 38000,  14000, 'Jan 2026 — Camping + Bonfire nights'),
  ('2026-02', 'Trek',   110000,  38000, 'Feb 2026 — Valentine weekend camp booked out'),
  ('2026-02', 'Camping', 52000,  20000, 'Feb 2026 — couples package very popular'),
  ('2026-03', 'Trek',    98000,  33500, 'Mar 2026 — steady season; Holi weekend boost'),
  ('2026-03', 'Camping', 41000,  16000, 'Mar 2026 — school group bookings picked up')
on conflict do nothing;

-- ============================================================
-- 26. EMERGENCY CONTACTS
-- ============================================================
insert into public.emergency_contacts (category, label, number, description, sort_order, is_active)
values
  ('National',   'National Emergency (India)',      '112',        'Works across India — police, fire, ambulance', 1,  true),
  ('National',   'Police Control Room',             '100',        'Nearest police station dispatch',             2,  true),
  ('National',   'Ambulance',                       '108',        'Free ambulance service',                      3,  true),
  ('National',   'Fire Brigade',                    '101',        'Fire and rescue service',                     4,  true),
  ('National',   'Women Helpline',                  '1091',       'National women safety helpline',              5,  true),
  ('Regional',   'Pune Police Control Room',        '020-26122880','Pune City police emergency',                 6,  true),
  ('Regional',   'Nashik Police Control Room',      '0253-2579100','Nashik City police emergency',               7,  true),
  ('Regional',   'Igatpuri Forest Range Officer',   '02553-244282','For wildlife/forest emergencies near Igatpuri',8, true),
  ('Regional',   'Bhimashankar Range Officer',      '02135-264260','Forest range — Bhimashankar',                9,  true),
  ('FirstAid',   'Apollo Hospital Pune',            '020-66014444','24×7 trauma centre — Pune',                  10, true),
  ('FirstAid',   'Jehangir Hospital Pune',          '020-66819999','24×7 emergency — Pune',                      11, true),
  ('FirstAid',   'Civil Hospital Nashik',           '0253-2309100','Government hospital — Nashik',               12, true),
  ('FirstAid',   'Gadvede Trekkers HQ',             '9800001001', 'Call Rajesh for any on-trek emergency',       13, true)
on conflict do nothing;

-- ============================================================
-- 27. PERMISSIONS  (role-based access matrix)
-- ============================================================
insert into public.permissions (role, feature, can_read, can_write)
values
  -- Admin — full access
  ('admin', 'bookings',        true,  true),
  ('admin', 'customers',       true,  true),
  ('admin', 'payments',        true,  true),
  ('admin', 'enquiries',       true,  true),
  ('admin', 'employees',       true,  true),
  ('admin', 'vendors',         true,  true),
  ('admin', 'trek_events',     true,  true),
  ('admin', 'products',        true,  true),
  ('admin', 'reports',         true,  true),
  ('admin', 'settings',        true,  true),
  -- Manager — read + limited write
  ('manager', 'bookings',      true,  true),
  ('manager', 'customers',     true,  false),
  ('manager', 'payments',      true,  false),
  ('manager', 'enquiries',     true,  true),
  ('manager', 'employees',     true,  false),
  ('manager', 'trek_events',   true,  true),
  ('manager', 'products',      true,  false),
  ('manager', 'reports',       true,  false),
  ('manager', 'settings',      false, false),
  -- Guide — limited to their events
  ('guide', 'bookings',        true,  false),
  ('guide', 'trek_events',     true,  false),
  ('guide', 'emergency_contacts',true,false),
  ('guide', 'customers',       false, false),
  ('guide', 'payments',        false, false),
  ('guide', 'reports',         false, false)
on conflict (role, feature) do nothing;

-- ============================================================
-- 28. BOOKING FORM CONFIG  (single row)
-- ============================================================
insert into public.booking_form_config
  (departure_options, pickup_options, manual_category_options, manual_event_options, manual_payment_method_options)
values
  (
    'Pune|Mumbai|Nashik|Thane|Navi Mumbai|Aurangabad',
    '{"Pune": ["Swargate", "Shivajinagar", "Kothrud", "Deccan", "Katraj", "Hinjewadi", "Baner", "Viman Nagar", "Kharadi", "Wakad", "Pimpri", "Hadapsar"], "Mumbai": ["Dadar", "CST", "Borivali", "Thane", "Mulund", "Andheri"], "Nashik": ["Nashik Road", "College Road", "Dwarka Circle"], "Thane": ["Thane Station", "Kalyan"], "Aurangabad": ["Aurangabad Station"]}'::jsonb,
    'Trek|Camping|Heritage Walk|Adventure Activity|Tour',
    'Rajmachi Trek|Harishchandragad Trek|Kalsubai Peak Trek|Andharban Forest Trail|Bhimashankar Trek|Pawna Lake Camping|Mulshi Valley Trek & Camp|Sahyadri Heritage Walk',
    'UPI|CASH|CARD|NET BANKING|Partial Payment'
  )
on conflict do nothing;

commit;

-- ============================================================
-- ✅  Quick row-count verification
-- ============================================================
select
  'customers'              as tbl, count(*) from public.customers             union all
select 'products',                  count(*) from public.products              union all
select 'product_batches',           count(*) from public.product_batches       union all
select 'bookings',                  count(*) from public.bookings              union all
select 'booking_travelers',         count(*) from public.booking_travelers     union all
select 'payments',                  count(*) from public.payments              union all
select 'payment_refunds',           count(*) from public.payment_refunds       union all
select 'listing_submissions',       count(*) from public.listing_submissions   union all
select 'enquiries',                 count(*) from public.enquiries             union all
select 'vendors',                   count(*) from public.vendors               union all
select 'employees',                 count(*) from public.employees             union all
select 'employee_assignments',      count(*) from public.employee_assignments  union all
select 'employee_expenses',         count(*) from public.employee_expenses     union all
select 'employee_availability',     count(*) from public.employee_availability union all
select 'trek_events',               count(*) from public.trek_events           union all
select 'trek_dates',                count(*) from public.trek_dates            union all
select 'activity_logs',             count(*) from public.activity_logs         union all
select 'notifications',             count(*) from public.notifications         union all
select 'email_alert_log',           count(*) from public.email_alert_log       union all
select 'feedback',                  count(*) from public.feedback              union all
select 'incentives',                count(*) from public.incentives            union all
select 'rate_approvals',            count(*) from public.rate_approvals        union all
select 'feature_flags',             count(*) from public.feature_flags         union all
select 'earnings',                  count(*) from public.earnings              union all
select 'emergency_contacts',        count(*) from public.emergency_contacts    union all
select 'permissions',               count(*) from public.permissions           union all
select 'booking_form_config',       count(*) from public.booking_form_config
order by 1;
