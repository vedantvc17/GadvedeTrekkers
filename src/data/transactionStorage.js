/* ─────────────────────────────────────────────────────────────
   Transaction Storage Service
   Models:
     Transaction  – one per payment attempt
     Refund       – one or more per transaction
   Rules:
     • One booking → multiple transactions (loosely coupled)
     • Refund amount ≤ grossAmount − already-refunded
───────────────────────────────────────────────────────────── */

const TXN_KEY    = "gt_transactions";
const REFUND_KEY = "gt_refunds";

/* ── raw helpers ── */
export function getAllTransactions() {
  try { return JSON.parse(localStorage.getItem(TXN_KEY) || "[]"); } catch { return []; }
}
function _saveTxns(txns) { localStorage.setItem(TXN_KEY, JSON.stringify(txns)); }

export function getAllRefunds() {
  try { return JSON.parse(localStorage.getItem(REFUND_KEY) || "[]"); } catch { return []; }
}
function _saveRefunds(refunds) { localStorage.setItem(REFUND_KEY, JSON.stringify(refunds)); }

/* ── ID helpers ── */
function _txnId()    { return `TXN-${Date.now()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`; }
function _refundId() { return `RFD-${Date.now()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`; }

/* ── Create transaction ──────────────────────────────────────
   transactionStatus: 'SUCCESS' | 'FAILED' | 'REFUNDED'
   paymentMode:       'Partial' | 'UPI' | 'CARD' | 'NET BANK'
─────────────────────────────────────────────────────────── */
export function createTransaction({
  bookingId,
  customerName,
  paymentMode,
  grossAmount,
  tax,
  netAmount,
  transactionStatus = "SUCCESS",
}) {
  const txn = {
    transactionId:     _txnId(),
    bookingId:         bookingId         || "",
    customerName:      customerName      || "Unknown",
    transactionStatus: transactionStatus,
    paymentMode:       paymentMode       || "UPI",
    tax:               Number(tax)       || 0,
    netAmount:         Number(netAmount) || 0,
    grossAmount:       Number(grossAmount) || 0,
    createdAt:         new Date().toISOString(),
  };
  _saveTxns([txn, ...getAllTransactions()]);
  return txn;
}

/* ── Update status ── */
export function updateTransactionStatus(transactionId, status) {
  const all = getAllTransactions();
  const updated = all.map((t) =>
    t.transactionId === transactionId ? { ...t, transactionStatus: status } : t
  );
  _saveTxns(updated);
  return updated.find((t) => t.transactionId === transactionId) || null;
}

/* ── Refund ──────────────────────────────────────────────────
   Full or partial refund.
   Validates: refundAmount ≤ (grossAmount − alreadyRefunded)
   Updates transaction status → REFUNDED on success.
─────────────────────────────────────────────────────────── */
export function createRefund({ transactionId, amount }) {
  const txn = getAllTransactions().find((t) => t.transactionId === transactionId);
  if (!txn) return { error: "Transaction not found" };

  const alreadyRefunded = getAllRefunds()
    .filter((r) => r.transactionId === transactionId)
    .reduce((sum, r) => sum + r.amount, 0);

  const maxRefund = txn.grossAmount - alreadyRefunded;
  if (Number(amount) > maxRefund) {
    return { error: `Refund amount ₹${amount} exceeds available ₹${maxRefund}` };
  }
  if (Number(amount) <= 0) return { error: "Refund amount must be greater than 0" };

  const refund = {
    refundId:      _refundId(),
    transactionId,
    amount:        Number(amount),
    status:        "REFUNDED",
    createdAt:     new Date().toISOString(),
  };

  _saveRefunds([...getAllRefunds(), refund]);
  updateTransactionStatus(transactionId, "REFUNDED");
  return { refund };
}

/* ── Get refunds for a transaction ── */
export function getRefundsForTransaction(transactionId) {
  return getAllRefunds().filter((r) => r.transactionId === transactionId);
}

/* ── Filter / Search / Sort ──────────────────────────────────
   Filters:
     status      – 'SUCCESS' | 'FAILED' | 'REFUNDED'
     paymentMode – 'Partial' | 'UPI' | 'CARD' | 'NET BANK'
     fromDate    – ISO date string
     toDate      – ISO date string
   Search (partial match):
     customerName, bookingId, transactionId
   Sort:
     latest (default) | oldest | amount-high | amount-low
─────────────────────────────────────────────────────────── */
export function queryTransactions({
  status,
  paymentMode,
  fromDate,
  toDate,
  search,
  sortBy = "latest",
} = {}) {
  let results = getAllTransactions();

  // Filters
  if (status)      results = results.filter((t) => t.transactionStatus === status);
  if (paymentMode) results = results.filter((t) => t.paymentMode === paymentMode);

  if (fromDate) {
    const from = new Date(fromDate).getTime();
    results = results.filter((t) => new Date(t.createdAt).getTime() >= from);
  }
  if (toDate) {
    const to = new Date(toDate).getTime() + 86_400_000; // include end of day
    results = results.filter((t) => new Date(t.createdAt).getTime() <= to);
  }

  // Search
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    results = results.filter(
      (t) =>
        t.customerName?.toLowerCase().includes(q) ||
        t.bookingId?.toLowerCase().includes(q) ||
        t.transactionId?.toLowerCase().includes(q)
    );
  }

  // Sort
  if      (sortBy === "latest")      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  else if (sortBy === "oldest")      results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  else if (sortBy === "amount-high") results.sort((a, b) => b.grossAmount - a.grossAmount);
  else if (sortBy === "amount-low")  results.sort((a, b) => a.grossAmount - b.grossAmount);

  return results;
}

/* ── Summary stats ── */
export function getTransactionStats() {
  const all = getAllTransactions();
  return {
    total:    all.length,
    success:  all.filter((t) => t.transactionStatus === "SUCCESS").length,
    failed:   all.filter((t) => t.transactionStatus === "FAILED").length,
    refunded: all.filter((t) => t.transactionStatus === "REFUNDED").length,
    revenue:  all
      .filter((t) => t.transactionStatus === "SUCCESS")
      .reduce((s, t) => s + t.grossAmount, 0),
  };
}
