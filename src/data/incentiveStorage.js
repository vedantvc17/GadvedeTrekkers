/* ══════════════════════════════════════════════
   incentiveStorage.js — Gadvede Trekkers
   Tracks ₹100 referral incentives earned by employees
   when a customer books via their shared link
══════════════════════════════════════════════ */
const KEY = "gt_incentives";
const INCENTIVE_AMOUNT = 100; // ₹ per referral booking

function _uid() {
  return `INC-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function getAllIncentives() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}

function _save(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

/* Called from Booking on successful booking with a referral code */
export function createIncentive({ employeeId, employeeName, referralCode, bookingId, trekName, customerName, trekDate }) {
  const record = {
    incentiveId: _uid(),
    employeeId,
    employeeName,
    referralCode,
    bookingId,
    trekName,
    customerName,
    trekDate,
    amount: INCENTIVE_AMOUNT,
    status: "PENDING",   // PENDING | PAID
    paidAt: null,
    paidVia: "",
    paidRef: "",
    createdAt: new Date().toISOString(),
  };
  _save([record, ...getAllIncentives()]);
  return record;
}

export function getIncentivesByEmployee(employeeId) {
  return getAllIncentives().filter(i => i.employeeId === employeeId);
}

export function getIncentivesByReferralCode(referralCode) {
  return getAllIncentives().filter(i => i.referralCode === referralCode);
}

/* Mark incentive as PAID */
export function markIncentivePaid(incentiveId, { paidVia, paidRef }) {
  const all = getAllIncentives().map(i =>
    i.incentiveId === incentiveId
      ? { ...i, status: "PAID", paidAt: new Date().toISOString(), paidVia: paidVia || "", paidRef: paidRef || "" }
      : i
  );
  _save(all);
}

/* Mark all pending incentives for an employee as PAID */
export function markAllIncentivesPaid(employeeId, { paidVia, paidRef }) {
  const all = getAllIncentives().map(i =>
    i.employeeId === employeeId && i.status === "PENDING"
      ? { ...i, status: "PAID", paidAt: new Date().toISOString(), paidVia: paidVia || "", paidRef: paidRef || "" }
      : i
  );
  _save(all);
}

/* Stats for an employee */
export function getEmployeeIncentiveStats(employeeId) {
  const all = getIncentivesByEmployee(employeeId);
  const totalEarned = all.reduce((s, i) => s + i.amount, 0);
  const pending = all.filter(i => i.status === "PENDING").reduce((s, i) => s + i.amount, 0);
  const paid    = all.filter(i => i.status === "PAID").reduce((s, i) => s + i.amount, 0);
  return { count: all.length, totalEarned, pending, paid };
}

/* Global stats — for reports/earnings */
export function getIncentiveStats() {
  const all = getAllIncentives();
  const totalIssued  = all.reduce((s, i) => s + i.amount, 0);
  const pending      = all.filter(i => i.status === "PENDING").reduce((s, i) => s + i.amount, 0);
  const paid         = all.filter(i => i.status === "PAID").reduce((s, i) => s + i.amount, 0);
  const totalBookings = all.length;
  return { count: all.length, totalIssued, pending, paid, totalBookings };
}

export const INCENTIVE_AMOUNT_PER_BOOKING = INCENTIVE_AMOUNT;
