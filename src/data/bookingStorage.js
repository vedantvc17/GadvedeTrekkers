import { upsertCustomerActivity } from "./customerStorage";
import { apiRequest } from "../api/backendClient";

/* ─────────────────────────────────────────────────────────────
   Booking Storage Service
   - Generates human-readable GT-YYYY-XXXXXX IDs
   - Persists ALL bookings (not just latestBooking)
   - Backward-compatible: existing latestBooking key is untouched
   - bookingStatus: 'CONFIRMED' | 'CANCELLED'  (additive field)
───────────────────────────────────────────────────────────── */

const KEY          = "gt_bookings";
const COUNTER_KEY  = "gt_booking_counter";

/* ── ID generation ───────────────────────────────────────────
   Format: GT-2026-000001  (sequential, zero-padded to 6 digits)
─────────────────────────────────────────────────────────── */
function _nextCounter() {
  const current = parseInt(localStorage.getItem(COUNTER_KEY) || "0", 10);
  const next = current + 1;
  localStorage.setItem(COUNTER_KEY, String(next));
  return next;
}

export function generateBookingId() {
  const year = new Date().getFullYear();
  const seq  = String(_nextCounter()).padStart(6, "0");
  return `GT-${year}-${seq}`;
}

/* ── raw helpers ── */
export function getAllBookings() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

function _save(bookings) {
  localStorage.setItem(KEY, JSON.stringify(bookings));
}

/* ── persist booking ─────────────────────────────────────────
   Enriches the existing bookingRecord with:
     enhancedBookingId  – GT-YYYY-XXXXXX format
     customerId         – from customer service
     bookingStatus      – 'CONFIRMED' (default) | 'CANCELLED'
   Does NOT replace or remove any existing fields.
─────────────────────────────────────────────────────────── */
export function saveBookingRecord(enrichedRecord) {
  const all = getAllBookings();
  // idempotent: don't duplicate same bookingId
  if (all.some((b) => b.bookingId === enrichedRecord.bookingId)) return;
  _save([{
    ...enrichedRecord,
    bookingStatus: enrichedRecord.bookingStatus || "CONFIRMED",
    savedAt: new Date().toISOString(),
  }, ...all]);
  apiRequest("/api/bookings", {
    method: "POST",
    body: {
    ...enrichedRecord,
    bookingStatus: enrichedRecord.bookingStatus || "CONFIRMED",
    savedAt: enrichedRecord.savedAt || new Date().toISOString(),
    },
  }).catch((error) => console.warn("Booking sync failed", error));
}

/* ── Update booking status ───────────────────────────────────
   status: 'CONFIRMED' | 'CANCELLED'
   Additive — does not remove any other fields.
─────────────────────────────────────────────────────────── */
export function updateBookingStatus(bookingId, status) {
  const all = getAllBookings();
  const updated = all.map((b) =>
    (b.bookingId === bookingId || b.enhancedBookingId === bookingId)
      ? { ...b, bookingStatus: status }
      : b
  );
  _save(updated);
  const booking = updated.find((b) => b.bookingId === bookingId || b.enhancedBookingId === bookingId) || null;
  if (booking) {
    apiRequest("/api/bookings", {
      method: "POST",
      body: booking,
    }).catch((error) => console.warn("Booking status sync failed", error));
  }
  return booking;
}

/* ── look-ups ── */
export function getBookingById(id) {
  return (
    getAllBookings().find(
      (b) => b.bookingId === id || b.enhancedBookingId === id
    ) || null
  );
}

/* ── query / filter / sort ──────────────────────────────────
   Filters:  trekName, departureOrigin, paymentOption, fromDate, toDate, status
   Search:   bookingId, enhancedBookingId, name, phone
   Sort:     latest (default) | oldest | amount-high | amount-low
─────────────────────────────────────────────────────────── */
export function queryBookings({
  trekName,
  departureOrigin,
  paymentOption,
  fromDate,
  toDate,
  search,
  status,
  sortBy = "latest",
} = {}) {
  let results = getAllBookings();

  if (trekName)        results = results.filter((b) => b.trekName === trekName);
  if (departureOrigin) results = results.filter((b) => b.departureOrigin === departureOrigin);
  if (paymentOption)   results = results.filter((b) => b.paymentOption === paymentOption);
  if (status)          results = results.filter((b) => (b.bookingStatus || "CONFIRMED") === status);

  if (fromDate) {
    const from = new Date(fromDate).getTime();
    results = results.filter((b) => new Date(b.savedAt || b.bookingDate).getTime() >= from);
  }
  if (toDate) {
    const to = new Date(toDate).getTime() + 86_400_000;
    results = results.filter((b) => new Date(b.savedAt || b.bookingDate).getTime() <= to);
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    results = results.filter(
      (b) =>
        b.bookingId?.toLowerCase().includes(q) ||
        b.enhancedBookingId?.toLowerCase().includes(q) ||
        `${b.firstName} ${b.lastName}`.toLowerCase().includes(q) ||
        b.contactNumber?.includes(q) ||
        b.email?.toLowerCase().includes(q)
    );
  }

  if (sortBy === "latest")      results.sort((a, b) => new Date(b.savedAt || b.bookingDate) - new Date(a.savedAt || a.bookingDate));
  else if (sortBy === "oldest") results.sort((a, b) => new Date(a.savedAt || a.bookingDate) - new Date(b.savedAt || b.bookingDate));
  else if (sortBy === "amount-high") results.sort((a, b) => b.totalAmount - a.totalAmount);
  else if (sortBy === "amount-low")  results.sort((a, b) => a.totalAmount - b.totalAmount);

  return results;
}

/* ── Seed bookings ───────────────────────────────────────────
   30 seed bookings linked to seed customers.
   Auto-seeded on first load if gt_bookings is empty.
─────────────────────────────────────────────────────────── */
const _TREK_NAMES   = ["Harishchandragad Trek","Kalsubai Trek","Rajmachi Trek","Bhimashankar Trek","Torna Fort Trek","Lohagad Trek","Sinhagad Trek","Ratangad Trek"];
const _DEPS         = ["Pune","Mumbai","Kasara","Base Village"];
const _SURCHARGES   = { Pune:300, Mumbai:400, Kasara:150, "Base Village":0 };
const _PICKUP_MAP   = { Pune:"Shivajinagar", Mumbai:"Dadar", Kasara:"Kasara Station", "Base Village":"Direct At Base Village" };
const _PAY_OPTS     = ["UPI","Debit Card / Credit Card","Net Banking","Partial Payment","UPI","Debit Card / Credit Card","Net Banking","Partial Payment","UPI","Debit Card / Credit Card","Net Banking","Partial Payment","UPI","Debit Card / Credit Card","Net Banking","Partial Payment","UPI","Debit Card / Credit Card","Net Banking","Partial Payment","UPI","Debit Card / Credit Card","Net Banking","Partial Payment","UPI","Debit Card / Credit Card","Net Banking","Partial Payment","UPI","Debit Card / Credit Card"];
const _TICKETS_ARR  = [1,2,3,2,1,4,2,1,3,2,1,2,3,1,2,3,1,2,1,3,2,1,2,3,1,2,1,3,2,1];
const _CUST_DATA    = [
  { id:"CUST-seed-01", name:"Arjun Sharma",      phone:"9823456701" },
  { id:"CUST-seed-02", name:"Priya Patil",        phone:"9834567802" },
  { id:"CUST-seed-03", name:"Rohit Desai",        phone:"9845678903" },
  { id:"CUST-seed-04", name:"Sneha Joshi",        phone:"9856789004" },
  { id:"CUST-seed-05", name:"Vikram Kulkarni",    phone:"9867890105" },
  { id:"CUST-seed-06", name:"Neha Mehta",         phone:"9878901206" },
  { id:"CUST-seed-07", name:"Amit Bhosale",       phone:"9889012307" },
  { id:"CUST-seed-08", name:"Kavita Rane",        phone:"9890123408" },
  { id:"CUST-seed-09", name:"Suresh Naik",        phone:"9901234509" },
  { id:"CUST-seed-10", name:"Pooja Wagh",         phone:"9912345610" },
  { id:"CUST-seed-11", name:"Rahul Shinde",       phone:"9923456711" },
  { id:"CUST-seed-12", name:"Anita Pawar",        phone:"9934567812" },
  { id:"CUST-seed-13", name:"Deepak Gaikwad",     phone:"9945678913" },
  { id:"CUST-seed-14", name:"Swati More",         phone:"9956789014" },
  { id:"CUST-seed-15", name:"Sachin Kadam",       phone:"9967890115" },
  { id:"CUST-seed-16", name:"Rujuta Mane",        phone:"9978901216" },
  { id:"CUST-seed-17", name:"Omkar Jadhav",       phone:"9989012317" },
  { id:"CUST-seed-18", name:"Dipali Sawant",      phone:"9990123418" },
  { id:"CUST-seed-19", name:"Nikhil Thakur",      phone:"8801234519" },
  { id:"CUST-seed-20", name:"Gayatri Deshpande",  phone:"8812345620" },
  { id:"CUST-seed-21", name:"Prathamesh Salvi",   phone:"8823456721" },
  { id:"CUST-seed-22", name:"Ashwini Chavan",     phone:"8834567822" },
  { id:"CUST-seed-23", name:"Yash Kore",          phone:"8845678923" },
  { id:"CUST-seed-24", name:"Rutuja Ghuge",       phone:"8856789024" },
  { id:"CUST-seed-25", name:"Siddharth Phadtare", phone:"8867890125" },
  { id:"CUST-seed-26", name:"Manasi Dalvi",       phone:"8878901226" },
  { id:"CUST-seed-27", name:"Tejas Bhalekar",     phone:"8889012327" },
  { id:"CUST-seed-28", name:"Shraddha Kamble",    phone:"8890123428" },
  { id:"CUST-seed-29", name:"Akash Lonkar",       phone:"8801234529" },
  { id:"CUST-seed-30", name:"Pallavi Nimbalkar",  phone:"8812345630" },
];

/* i=0..24 → CONFIRMED, i=25..29 → CANCELLED */
const SEED_BOOKINGS = _CUST_DATA.map((c, i) => {
  const trek        = _TREK_NAMES[i % 8];
  const dep         = _DEPS[i % 4];
  const tickets     = _TICKETS_ARR[i];
  const pricePerTkt = 999 + (_SURCHARGES[dep] || 0);
  const baseAmount  = tickets * pricePerTkt;
  const taxAmount   = Math.round(baseAmount * 0.05);
  const totalAmount = baseAmount + taxAmount;
  const payOpt      = _PAY_OPTS[i];
  const payableNow  = payOpt === "Partial Payment" ? 200 * tickets : totalAmount;
  const remaining   = payOpt === "Partial Payment" ? totalAmount - payableNow : 0;
  /* Stagger dates: Sept 2025 → Mar 2026 */
  const baseMs      = new Date(2025, 8, 1).getTime();
  const savedAt     = new Date(baseMs + i * 6 * 24 * 3600 * 1000).toISOString();
  const nameParts   = c.name.split(" ");
  return {
    bookingId:         `GTK-seed-${String(i + 1).padStart(4, "0")}`,
    enhancedBookingId: `GT-2025-${String(i + 1).padStart(6, "0")}`,
    customerId:        c.id,
    firstName:         nameParts[0],
    lastName:          nameParts.slice(1).join(" "),
    email:             `${c.name.toLowerCase().replace(/ /g, ".")}@gmail.com`,
    contactNumber:     c.phone,
    whatsappNumber:    c.phone,
    trekName:          trek,
    tickets,
    departureOrigin:   dep,
    pickupLocation:    _PICKUP_MAP[dep],
    paymentOption:     payOpt,
    baseAmount,
    taxAmount,
    totalAmount,
    payableNow,
    remainingAmount:   remaining,
    bookingDate:       new Date(savedAt).toLocaleDateString("en-IN"),
    savedAt,
    bookingStatus:     i < 25 ? "CONFIRMED" : "CANCELLED",
    nextDate:          "2025-12-15",
  };
});

(function seedBookingsIfEmpty() {
  try {
    if (getAllBookings().length === 0) {
      _save(SEED_BOOKINGS);
    }
  } catch { /* ignore */ }
})();

(function hydrateSeedBookingsIntoCustomers() {
  try {
    getAllBookings().forEach((booking) => {
      upsertCustomerActivity({
        name: `${booking.firstName || ""} ${booking.lastName || ""}`.trim(),
        phone: booking.contactNumber || "",
        email: booking.email || "",
        booking,
      });
    });
  } catch {
    /* ignore hydration failures */
  }
})();
