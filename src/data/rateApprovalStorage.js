/* ══════════════════════════════════════════════
   rateApprovalStorage.js — Gadvede Trekkers
   Approval workflow for vendor/leader rate amounts
   Proposed by Pratik/Akshay → Approved by Rohit
══════════════════════════════════════════════ */
const KEY = "gt_rate_approvals";

function _uid() {
  return `RAP-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function _currentUser() {
  try { return JSON.parse(sessionStorage.getItem("gt_user")) || { name: "Admin", username: "admin" }; }
  catch { return { name: "Admin", username: "admin" }; }
}

export function getAllRateApprovals() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}

function _save(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

/* Submit a new rate approval request */
export function submitRateApproval({ type, targetId, targetName, field, proposedAmount, currentAmount }) {
  const user = _currentUser();
  // Cancel any existing PENDING approval for same target+field
  const all = getAllRateApprovals().map(r =>
    (r.targetId === targetId && r.field === field && r.status === "PENDING")
      ? { ...r, status: "SUPERSEDED" }
      : r
  );
  const entry = {
    id: _uid(),
    type,              // "employee" | "vendor"
    targetId,
    targetName,
    field,             // "payPerTrek" | "rateAmount"
    proposedAmount: Number(proposedAmount),
    currentAmount:  Number(currentAmount || 0),
    proposedBy: user.name,
    proposedByUsername: user.username,
    proposedAt: new Date().toISOString(),
    status: "PENDING", // PENDING | APPROVED | REJECTED | SUPERSEDED
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: "",
  };
  _save([entry, ...all]);
  return entry;
}

export function getPendingApprovals() {
  return getAllRateApprovals().filter(r => r.status === "PENDING");
}

export function approveRateRequest(id) {
  const user = _currentUser();
  const all = getAllRateApprovals();
  const updated = all.map(r =>
    r.id === id
      ? { ...r, status: "APPROVED", reviewedBy: user.name, reviewedByUsername: user.username, reviewedAt: new Date().toISOString() }
      : r
  );
  _save(updated);
  return updated.find(r => r.id === id);
}

export function rejectRateRequest(id, reason) {
  const user = _currentUser();
  const all = getAllRateApprovals();
  const updated = all.map(r =>
    r.id === id
      ? { ...r, status: "REJECTED", reviewedBy: user.name, reviewedByUsername: user.username, reviewedAt: new Date().toISOString(), rejectionReason: reason || "" }
      : r
  );
  _save(updated);
}

/* Get the latest APPROVED rate for a target (or null if none approved) */
export function getApprovedRate(targetId, field) {
  const approved = getAllRateApprovals()
    .filter(r => r.targetId === targetId && r.field === field && r.status === "APPROVED")
    .sort((a, b) => new Date(b.reviewedAt) - new Date(a.reviewedAt));
  return approved.length ? approved[0].proposedAmount : null;
}

/* Check if there's a pending request for a given target+field */
export function hasPendingRequest(targetId, field) {
  return getAllRateApprovals().some(r => r.targetId === targetId && r.field === field && r.status === "PENDING");
}
