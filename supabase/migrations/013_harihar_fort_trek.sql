-- ============================================================
-- Migration 013: Add Harihar Fort Trek (Nashik) data
-- Run AFTER 012_api_alignment.sql
-- ============================================================

begin;

-- ============================================================
-- 1. PRODUCT: Harihar Fort Trek
-- ============================================================
insert into public.products (
  id, name, slug, product_type, region, location,
  duration_label, altitude_label,
  short_description, description,
  base_price, compare_at_price, rating, review_count,
  primary_image_url,
  gallery,
  is_featured, is_active, sort_order,
  base_village, difficulty, endurance_level,
  history, main_attractions, detailed_history,
  highlights,
  places_to_visit,
  included_items,
  excluded_items,
  things_to_carry,
  discount_codes
)
values (
  'b2000000-0000-0000-0000-000000000001',
  'Harihar Fort Trek',
  'harihar-fort-trek',
  'trek',
  'Nashik',
  'Nashik, Maharashtra',
  '1 Night 1 Day',
  '3676 ft',

  -- short_description
  'Climb 117 rock-cut steps carved into a near-vertical cliff at one of Maharashtra''s most dramatic forts.',

  -- description (overview)
  'Harihar Fort appears rectangular from its base village, built on a triangular prism of rock. Its three faces and two edges are vertical at 90 degrees, while the third edge towards the west is inclined at 75 degrees. A one-metre wide rocky staircase with carved niches leads to the summit. There are 117 steps in all. After climbing the first rocky staircase and passing under an overhang with a sheer drop, trekkers navigate a steep set of niched stairs, then pass through a rock-cut passage to emerge at the top. The fort has a tapering plateau with a raised level in the middle, a small temple of Lord Hanuman and Lord Shiva, and a drinking-water pond. A two-room palace can shelter 10–12 persons. One vertical cliff facing Nirgudpada village is called "Scottish Kada" — first climbed in November 1986 by legendary Himalayan mountaineer Doug Scott, a 170-metre face that took him two days.',

  -- base_price, compare_at_price
  1699.00,
  1999.00,

  -- rating, review_count
  4.5,
  143,

  -- primary_image_url (placeholder — replace with actual CDN URL)
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',

  -- gallery (array of images)
  '[
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
    "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800"
  ]'::jsonb,

  -- is_featured, is_active, sort_order
  true, true, 9,

  -- base_village
  'Nirgudpada',

  -- difficulty
  'Tough',

  -- endurance_level
  'High',

  -- history
  'Harihar Fort, also known as Harsha Gad or Harihargad, is a medieval hill fort in the Nashik district of Maharashtra, situated 40 km from Nashik city. It was strategically built to guard the Gonda Ghat trade route. The fort lies in the Trimbakeshwar region of the Sahyadri mountain range. One of its most notable features — the rock-cut staircase — was likely carved during the Yadava or early Maratha period. The fort gained international attention when legendary British mountaineer Doug Scott made the first recorded ascent of its vertical "Scottish Kada" cliff in November 1986, a 170-metre face that took two days to climb.',

  -- main_attractions
  '117 rock-cut steps carved into a near-vertical cliff face | Panoramic views of Trimbakeshwar and surrounding Sahyadri peaks | "Scottish Kada" — a 170-metre vertical cliff face first climbed by Doug Scott | Lord Hanuman and Lord Shiva temple on the summit plateau | Natural drinking-water pond on the summit | Two-room palace ruin that can shelter 10–12 persons',

  -- detailed_history
  'From its base village, Harihar Fort appears to be rectangular. It is built on a triangular prism of rock: three faces and two edges are vertical at 90 degrees, while the third edge towards the west is inclined at 75 degrees. The rock-cut staircase, about one metre wide with hand-carved niches, was designed both for ascending and for defence — attackers could be repelled one-by-one on the narrow passage. The fort plateau has a tapering shape with a raised central section, housing a small temple complex and a natural water cistern. A two-room palace could garrison a small contingent of soldiers. The fort is regularly listed among the most challenging forts in Maharashtra due to the near-vertical staircase section, which sees dangerous overcrowding on weekends during monsoon.',

  -- highlights
  '[
    "117 rock-cut steps carved into 75° cliff face",
    "3676 ft above sea level — dramatic panoramic views",
    "Difficulty: Tough | Endurance: High",
    "Base village: Nirgudpada (2 trailheads available)",
    "Trek distance: 3.5 km one way",
    "Scottish Kada — 170 m vertical cliff, first climbed by Doug Scott in 1986",
    "Small temple of Lord Hanuman & Lord Shiva on summit",
    "Natural drinking-water pond on summit plateau",
    "Best season: June to February"
  ]'::jsonb,

  -- places_to_visit
  '[
    {"name": "Rock-Cut Staircase (117 Steps)", "description": "The iconic near-vertical staircase carved into the cliff face — the most thrilling and photographed section of the trek."},
    {"name": "Maha Darwaja", "description": "The main entrance gate at the top of the steep staircase, offering jaw-dropping views of the valley below."},
    {"name": "Hanuman & Shiva Temple", "description": "A small twin-shrine on the summit plateau, a spiritual pause after the demanding climb."},
    {"name": "Summit Plateau Pond", "description": "A natural rock-cut cistern on the plateau — water is potable and a welcome sight after the climb."},
    {"name": "Scottish Kada Viewpoint", "description": "The 170 m vertical cliff face facing Nirgudpada village, first scaled by Doug Scott in November 1986."},
    {"name": "Two-Room Palace Ruin", "description": "A ruined garrison palace near the summit that can still shelter 10–12 people."}
  ]'::jsonb,

  -- included_items
  '[
    "1 Veg Breakfast",
    "1 Veg Lunch (simple thali — Jain food available)",
    "Pune to Pune transport in private non-AC vehicle",
    "Trek Leader expertise charges"
  ]'::jsonb,

  -- excluded_items
  '[
    "Mineral water / lime water / beverages purchased for personal consumption",
    "Extra meals or soft drinks ordered",
    "Personal expenses of any kind",
    "Any cost not mentioned in inclusions",
    "Expenses due to roadblocks, bad weather, or unforeseen circumstances",
    "Medical / emergency evacuation costs if required"
  ]'::jsonb,

  -- things_to_carry
  '[
    "2–3 litres of water",
    "Trekking shoes (Campus or Action brand preferred — excellent grip on slippery Sahyadri rocks)",
    "Good torch / headlamp with extra batteries",
    "Dry fruits, dry snacks, and energy bars",
    "Glucon-D / ORS / Tang / Gatorade sachets",
    "20–30 litre day backpack",
    "Sun cap and sunscreen",
    "Personal first aid kit and medicines",
    "Identity proof",
    "Full-sleeve shirt and full track pants (protection from sun, thorns, and insects)"
  ]'::jsonb,

  -- discount_codes
  '[
    {"code": "EARLY75", "description": "Early Booking Discount"}
  ]'::jsonb
)
on conflict (id) do update set
  name             = excluded.name,
  slug             = excluded.slug,
  product_type     = excluded.product_type,
  region           = excluded.region,
  location         = excluded.location,
  duration_label   = excluded.duration_label,
  altitude_label   = excluded.altitude_label,
  short_description = excluded.short_description,
  description      = excluded.description,
  base_price       = excluded.base_price,
  compare_at_price = excluded.compare_at_price,
  rating           = excluded.rating,
  review_count     = excluded.review_count,
  primary_image_url = excluded.primary_image_url,
  gallery          = excluded.gallery,
  is_featured      = excluded.is_featured,
  is_active        = excluded.is_active,
  sort_order       = excluded.sort_order,
  base_village     = excluded.base_village,
  difficulty       = excluded.difficulty,
  endurance_level  = excluded.endurance_level,
  history          = excluded.history,
  main_attractions = excluded.main_attractions,
  detailed_history = excluded.detailed_history,
  highlights       = excluded.highlights,
  places_to_visit  = excluded.places_to_visit,
  included_items   = excluded.included_items,
  excluded_items   = excluded.excluded_items,
  things_to_carry  = excluded.things_to_carry,
  discount_codes   = excluded.discount_codes;

-- ============================================================
-- 2. PRODUCT BATCHES: Upcoming departure dates
-- ============================================================
insert into public.product_batches
  (id, product_id, batch_date, batch_label, seats_total, seats_available, status)
values
  ('c2000000-0000-0000-0000-000000000001',
   'b2000000-0000-0000-0000-000000000001',
   '2026-04-18', 'Apr 18 Batch', 30, 22, 'OPEN'),
  ('c2000000-0000-0000-0000-000000000002',
   'b2000000-0000-0000-0000-000000000001',
   '2026-05-02', 'May 02 Batch', 30, 28, 'OPEN'),
  ('c2000000-0000-0000-0000-000000000003',
   'b2000000-0000-0000-0000-000000000001',
   '2026-05-16', 'May 16 Batch', 30, 30, 'OPEN'),
  ('c2000000-0000-0000-0000-000000000004',
   'b2000000-0000-0000-0000-000000000001',
   '2026-06-06', 'Jun 06 Batch', 30, 30, 'OPEN')
on conflict (id) do nothing;

-- ============================================================
-- 3. TREK DATES (public-facing dropdown)
-- ============================================================
insert into public.trek_dates (trek_name, trek_date, is_active, notes)
values
  ('Harihar Fort Trek', '2026-04-18', true, null),
  ('Harihar Fort Trek', '2026-05-02', true, null),
  ('Harihar Fort Trek', '2026-05-16', true, null),
  ('Harihar Fort Trek', '2026-06-06', true, 'Check ban status during monsoon')
on conflict do nothing;

-- ============================================================
-- 4. DEPARTURE PLANS: Pune (primary) and Nashik pickup options
-- ============================================================

-- Pune departure — Apr 18 batch
insert into public.product_departure_plans
  (product_id, batch_id, departure_origin, price, pickup_points, itinerary_text)
values
  (
    'b2000000-0000-0000-0000-000000000001',
    'c2000000-0000-0000-0000-000000000001',
    'Pune',
    1699.00,
    '[
      {"time": "08:45 PM", "location": "McDonald''s, Deccan", "notes": "Meeting point"},
      {"time": "09:00 PM", "location": "Deccan", "notes": "Departure"},
      {"time": "09:20 PM", "location": "New Shivaji Nagar Bus Stop (Mari Aai Gate / Wakadewadi)", "notes": "Pickup"},
      {"time": "09:40 PM", "location": "Nashik Phata (Opp. Kasarwadi Police Station)", "notes": "Pickup"}
    ]'::jsonb,
    E'Day 0 (Friday Night)\n08:45 PM — Meet at McDonald''s, Deccan\n09:00 PM — Depart towards base village\n09:20 PM — Pickup at New Shivaji Nagar Bus Stop (Mari Aai Gate / Wakadewadi)\n09:40 PM — Pickup at Nashik Phata (Opp. Kasarwadi Police Station)\n\nDay 1 (Saturday)\n05:30 AM — Reach base village; have breakfast\n06:00 AM — Start ascending\n09:30 AM — Reach summit; explore the fort\n10:30 AM — Start descending\n01:30 PM — Reach base village; have lunch (simple veg thali; Jain food available)\n02:30 PM — Start return journey towards Pune\n11:00 PM — Approx. arrival at Pune (subject to traffic)'
  );

-- Pune departure — May 02 batch
insert into public.product_departure_plans
  (product_id, batch_id, departure_origin, price, pickup_points, itinerary_text)
values
  (
    'b2000000-0000-0000-0000-000000000001',
    'c2000000-0000-0000-0000-000000000002',
    'Pune',
    1699.00,
    '[
      {"time": "08:45 PM", "location": "McDonald''s, Deccan", "notes": "Meeting point"},
      {"time": "09:00 PM", "location": "Deccan", "notes": "Departure"},
      {"time": "09:20 PM", "location": "New Shivaji Nagar Bus Stop (Mari Aai Gate / Wakadewadi)", "notes": "Pickup"},
      {"time": "09:40 PM", "location": "Nashik Phata (Opp. Kasarwadi Police Station)", "notes": "Pickup"}
    ]'::jsonb,
    E'Day 0 (Friday Night)\n08:45 PM — Meet at McDonald''s, Deccan\n09:00 PM — Depart towards base village\n09:20 PM — Pickup at New Shivaji Nagar Bus Stop (Mari Aai Gate / Wakadewadi)\n09:40 PM — Pickup at Nashik Phata (Opp. Kasarwadi Police Station)\n\nDay 1 (Saturday)\n05:30 AM — Reach base village; have breakfast\n06:00 AM — Start ascending\n09:30 AM — Reach summit; explore the fort\n10:30 AM — Start descending\n01:30 PM — Reach base village; have lunch\n02:30 PM — Start return journey towards Pune\n11:00 PM — Approx. arrival at Pune (subject to traffic)'
  );

-- Mumbai/Kasara departure (alternate route) — Apr 18 batch
insert into public.product_departure_plans
  (product_id, batch_id, departure_origin, price, pickup_points, itinerary_text)
values
  (
    'b2000000-0000-0000-0000-000000000001',
    'c2000000-0000-0000-0000-000000000001',
    'Kasara',
    1699.00,
    '[
      {"time": "09:32 PM (Day 0)", "location": "CSMT", "notes": "Board slow local"},
      {"time": "09:50 PM", "location": "Dadar", "notes": "Board / continue"},
      {"time": "10:27 PM", "location": "Thane", "notes": "Board / continue"},
      {"time": "11:03 PM", "location": "Kalyan", "notes": "Board / continue"},
      {"time": "12:13 AM", "location": "Kasara Railway Station", "notes": "Alight here"}
    ]'::jsonb,
    E'Day 0 (Friday Night — Train from Mumbai)\n09:32 PM — CSMT (board CSMT–Kasara slow local)\n09:40 PM — Byculla\n09:50 PM — Dadar\n10:00 PM — Kurla\n10:06 PM — Ghatkopar\n10:27 PM — Thane\n10:51 PM — Dombivali\n11:03 PM — Kalyan\n12:13 AM — Kasara Railway Station\n\n12:15 AM — Meet at Kasara station ticket counter\n12:30 AM — Start journey towards base village by local jeep\n03:30 AM — Reach base village (own car: arrive by 3:30 AM)\n\nDay 1 (Saturday)\n04:00 AM — Breakfast\n04:30 AM — Start ascending\n07:30 AM — Reach summit; explore the fort\n08:30 AM — Start descending\n11:30 AM — Reach base village\n12:00 PM — Lunch\n01:00 PM — Start return journey towards Kasara\n03:30 PM — Approx. arrival at Kasara Railway Station; disperse'
  );

commit;
