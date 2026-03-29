/* ─────────────────────────────────────────────────────────────
   Customer Storage Service
   Handles create / find / list operations for customers.
   Deduplicates on phone (primary) or email (fallback).
───────────────────────────────────────────────────────────── */

const KEY = "gt_customers";

/* ── raw helpers ── */
export function getAllCustomers() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

function _save(customers) {
  localStorage.setItem(KEY, JSON.stringify(customers));
}

function normalisePhone(value = "") {
  return String(value).replace(/\D/g, "").slice(-10);
}

function normaliseEmail(value = "") {
  return String(value).trim().toLowerCase();
}

/* ── find or create ──────────────────────────────────────────
   Returns existing customer if phone or email matches,
   otherwise creates a new one. Never duplicates.
─────────────────────────────────────────────────────────── */
export function findOrCreateCustomer({ name, phone, email = "" }) {
  const all = getAllCustomers();
  const phoneKey = normalisePhone(phone);
  const emailKey = normaliseEmail(email);

  // 1) match by phone
  let found = phoneKey ? all.find((c) => normalisePhone(c.phone) === phoneKey) : null;
  // 2) fallback: match by email
  if (!found && emailKey) found = all.find((c) => c.email && normaliseEmail(c.email) === emailKey);

  if (found) {
    const updated = {
      ...found,
      name: found.name || name || "Unknown",
      phone: found.phone || phoneKey || "",
      email: found.email || emailKey || "",
    };
    if (JSON.stringify(updated) !== JSON.stringify(found)) {
      _save(all.map((customer) => (customer.id === found.id ? updated : customer)));
    }
    return updated;
  }

  const customer = {
    id: `CUST-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    name: name || "Unknown",
    phone: phoneKey || "",
    email: emailKey || "",
    createdAt: new Date().toISOString(),
    enquiries: [],
    bookings: [],
    tags: [],
    enquiryCount: 0,
    bookingCount: 0,
  };

  _save([customer, ...all]);
  return customer;
}

function dedupeById(items = [], idKey = "id") {
  const map = new Map();
  items.forEach((item) => {
    const key = item?.[idKey];
    if (!key) return;
    map.set(key, item);
  });
  return Array.from(map.values());
}

export function updateCustomerRecord(id, updates) {
  const customers = getAllCustomers();
  let nextCustomer = null;
  const next = customers.map((customer) => {
    if (customer.id !== id) return customer;
    nextCustomer = { ...customer, ...updates };
    return nextCustomer;
  });
  if (nextCustomer) _save(next);
  return nextCustomer;
}

export function upsertCustomerActivity({
  name,
  phone,
  email = "",
  enquiry,
  booking,
}) {
  const customer = findOrCreateCustomer({ name, phone, email });
  const customers = getAllCustomers();

  const next = customers.map((item) => {
    if (item.id !== customer.id) return item;

    const nextCustomer = {
      ...item,
      name: name || item.name,
      email: email || item.email,
      lastContactAt: new Date().toISOString(),
      enquiries: Array.isArray(item.enquiries) ? [...item.enquiries] : [],
      bookings: Array.isArray(item.bookings) ? [...item.bookings] : [],
      tags: Array.isArray(item.tags) ? [...item.tags] : [],
    };

    if (enquiry) {
      nextCustomer.enquiries = dedupeById(
        [
          ...nextCustomer.enquiries,
          {
            id: enquiry.id,
            eventName: enquiry.eventName || enquiry.tour || "",
            category: enquiry.category || "",
            status: enquiry.status || "NEW",
            tags: enquiry.tags || [],
            createdAt: enquiry.createdAt || new Date().toISOString(),
          },
        ],
        "id"
      );
      nextCustomer.enquiryCount = nextCustomer.enquiries.length;
      nextCustomer.latestEnquiryStatus = enquiry.status || nextCustomer.latestEnquiryStatus || "NEW";
      nextCustomer.latestEnquiryEvent = enquiry.eventName || enquiry.tour || nextCustomer.latestEnquiryEvent || "";
      nextCustomer.tags = Array.from(
        new Set([...(nextCustomer.tags || []), ...((enquiry.tags || []).filter(Boolean))])
      );
    }

    if (booking) {
      nextCustomer.bookings = dedupeById(
        [
          ...nextCustomer.bookings,
          {
            id: booking.bookingId || booking.enhancedBookingId,
            eventName: booking.eventName || booking.trekName || booking.tourName || "",
            status: booking.bookingStatus || "CONFIRMED",
            travelDate: booking.travelDate || booking.nextDate || "",
            createdAt: booking.savedAt || new Date().toISOString(),
          },
        ],
        "id"
      );
      nextCustomer.bookingCount = nextCustomer.bookings.length;
      nextCustomer.latestBookedEvent = booking.eventName || booking.trekName || booking.tourName || "";
      nextCustomer.latestBookingStatus = booking.bookingStatus || "CONFIRMED";
    }

    return nextCustomer;
  });

  _save(next);
  return next.find((item) => item.id === customer.id) || customer;
}

/* ── look-ups ── */
export function getCustomerById(id) {
  return getAllCustomers().find((c) => c.id === id) || null;
}

export function getCustomerByPhone(phone) {
  const phoneKey = normalisePhone(phone);
  return getAllCustomers().find((c) => normalisePhone(c.phone) === phoneKey) || null;
}

/* ── search ── */
export function searchCustomers(query = "") {
  if (!query.trim()) return getAllCustomers();
  const q = query.trim().toLowerCase();
  return getAllCustomers().filter(
    (c) =>
      c.name?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.email?.toLowerCase().includes(q)
  );
}

/* ── seed data ───────────────────────────────────────────────
   30 realistic Indian customers auto-seeded on first load.
─────────────────────────────────────────────────────────── */
const SEED_CUSTOMERS = [
  { id: "CUST-seed-01", name: "Arjun Sharma",       phone: "9823456701", email: "arjun.sharma@gmail.com",       createdAt: "2025-09-12T08:30:00.000Z" },
  { id: "CUST-seed-02", name: "Priya Patil",         phone: "9834567802", email: "priya.patil@yahoo.com",         createdAt: "2025-09-18T10:15:00.000Z" },
  { id: "CUST-seed-03", name: "Rohit Desai",         phone: "9845678903", email: "rohit.desai@gmail.com",         createdAt: "2025-10-02T07:45:00.000Z" },
  { id: "CUST-seed-04", name: "Sneha Joshi",         phone: "9856789004", email: "sneha.joshi@outlook.com",       createdAt: "2025-10-09T09:00:00.000Z" },
  { id: "CUST-seed-05", name: "Vikram Kulkarni",     phone: "9867890105", email: "vikram.kulkarni@gmail.com",     createdAt: "2025-10-15T11:30:00.000Z" },
  { id: "CUST-seed-06", name: "Neha Mehta",          phone: "9878901206", email: "neha.mehta@gmail.com",          createdAt: "2025-10-22T13:00:00.000Z" },
  { id: "CUST-seed-07", name: "Amit Bhosale",        phone: "9889012307", email: "amit.bhosale@yahoo.com",        createdAt: "2025-11-01T08:15:00.000Z" },
  { id: "CUST-seed-08", name: "Kavita Rane",         phone: "9890123408", email: "kavita.rane@gmail.com",         createdAt: "2025-11-07T10:45:00.000Z" },
  { id: "CUST-seed-09", name: "Suresh Naik",         phone: "9901234509", email: "suresh.naik@outlook.com",       createdAt: "2025-11-14T14:20:00.000Z" },
  { id: "CUST-seed-10", name: "Pooja Wagh",          phone: "9912345610", email: "pooja.wagh@gmail.com",          createdAt: "2025-11-20T09:30:00.000Z" },
  { id: "CUST-seed-11", name: "Rahul Shinde",        phone: "9923456711", email: "rahul.shinde@gmail.com",        createdAt: "2025-11-27T11:00:00.000Z" },
  { id: "CUST-seed-12", name: "Anita Pawar",         phone: "9934567812", email: "anita.pawar@yahoo.com",         createdAt: "2025-12-03T08:00:00.000Z" },
  { id: "CUST-seed-13", name: "Deepak Gaikwad",      phone: "9945678913", email: "deepak.gaikwad@gmail.com",      createdAt: "2025-12-10T10:30:00.000Z" },
  { id: "CUST-seed-14", name: "Swati More",          phone: "9956789014", email: "swati.more@outlook.com",        createdAt: "2025-12-17T12:00:00.000Z" },
  { id: "CUST-seed-15", name: "Sachin Kadam",        phone: "9967890115", email: "sachin.kadam@gmail.com",        createdAt: "2025-12-24T09:15:00.000Z" },
  { id: "CUST-seed-16", name: "Rujuta Mane",         phone: "9978901216", email: "rujuta.mane@gmail.com",         createdAt: "2026-01-04T08:45:00.000Z" },
  { id: "CUST-seed-17", name: "Omkar Jadhav",        phone: "9989012317", email: "omkar.jadhav@yahoo.com",        createdAt: "2026-01-11T11:15:00.000Z" },
  { id: "CUST-seed-18", name: "Dipali Sawant",       phone: "9990123418", email: "dipali.sawant@gmail.com",       createdAt: "2026-01-18T13:30:00.000Z" },
  { id: "CUST-seed-19", name: "Nikhil Thakur",       phone: "8801234519", email: "nikhil.thakur@outlook.com",     createdAt: "2026-01-25T10:00:00.000Z" },
  { id: "CUST-seed-20", name: "Gayatri Deshpande",   phone: "8812345620", email: "gayatri.deshpande@gmail.com",   createdAt: "2026-02-01T08:30:00.000Z" },
  { id: "CUST-seed-21", name: "Prathamesh Salvi",    phone: "8823456721", email: "prathamesh.salvi@gmail.com",    createdAt: "2026-02-07T09:45:00.000Z" },
  { id: "CUST-seed-22", name: "Ashwini Chavan",      phone: "8834567822", email: "ashwini.chavan@yahoo.com",      createdAt: "2026-02-14T11:00:00.000Z" },
  { id: "CUST-seed-23", name: "Yash Kore",           phone: "8845678923", email: "yash.kore@gmail.com",           createdAt: "2026-02-20T14:00:00.000Z" },
  { id: "CUST-seed-24", name: "Rutuja Ghuge",        phone: "8856789024", email: "rutuja.ghuge@outlook.com",      createdAt: "2026-02-26T08:00:00.000Z" },
  { id: "CUST-seed-25", name: "Siddharth Phadtare",  phone: "8867890125", email: "siddharth.phadtare@gmail.com",  createdAt: "2026-03-01T10:30:00.000Z" },
  { id: "CUST-seed-26", name: "Manasi Dalvi",        phone: "8878901226", email: "manasi.dalvi@gmail.com",        createdAt: "2026-03-04T09:00:00.000Z" },
  { id: "CUST-seed-27", name: "Tejas Bhalekar",      phone: "8889012327", email: "tejas.bhalekar@yahoo.com",      createdAt: "2026-03-07T11:45:00.000Z" },
  { id: "CUST-seed-28", name: "Shraddha Kamble",     phone: "8890123428", email: "shraddha.kamble@gmail.com",     createdAt: "2026-03-10T13:00:00.000Z" },
  { id: "CUST-seed-29", name: "Akash Lonkar",        phone: "8801234529", email: "akash.lonkar@outlook.com",      createdAt: "2026-03-14T08:30:00.000Z" },
  { id: "CUST-seed-30", name: "Pallavi Nimbalkar",   phone: "8812345630", email: "pallavi.nimbalkar@gmail.com",   createdAt: "2026-03-17T10:00:00.000Z" },
];

/* Auto-seed on first load */
(function seedIfEmpty() {
  try {
    if (getAllCustomers().length === 0) {
      _save(
        SEED_CUSTOMERS.map((customer) => ({
          ...customer,
          phone: normalisePhone(customer.phone),
          email: normaliseEmail(customer.email),
          enquiries: [],
          bookings: [],
          tags: [],
          enquiryCount: 0,
          bookingCount: 0,
        }))
      );
    }
  } catch { /* ignore */ }
})();
