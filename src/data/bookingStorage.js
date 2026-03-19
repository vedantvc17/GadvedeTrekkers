/* ─────────────────────────────────────────────────────────────
   Booking Storage Service
   - Generates human-readable GT-YYYY-XXXXXX IDs
   - Persists ALL bookings (not just latestBooking)
   - Backward-compatible: existing latestBooking key is untouched
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
   Does NOT replace or remove any existing fields.
─────────────────────────────────────────────────────────── */
export function saveBookingRecord(enrichedRecord) {
  const all = getAllBookings();
  // idempotent: don't duplicate same bookingId
  if (all.some((b) => b.bookingId === enrichedRecord.bookingId)) return;
  _save([{ ...enrichedRecord, savedAt: new Date().toISOString() }, ...all]);
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
   Filters:  trekName, departureOrigin, paymentOption, fromDate, toDate
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
  sortBy = "latest",
} = {}) {
  let results = getAllBookings();

  if (trekName)        results = results.filter((b) => b.trekName === trekName);
  if (departureOrigin) results = results.filter((b) => b.departureOrigin === departureOrigin);
  if (paymentOption)   results = results.filter((b) => b.paymentOption === paymentOption);

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
