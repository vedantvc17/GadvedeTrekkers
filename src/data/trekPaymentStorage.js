/* ══════════════════════════════════════════════
   trekPaymentStorage.js — Gadvede Trekkers
   Tracks outgoing payments to vendors/leaders per trek event
══════════════════════════════════════════════ */
const KEY = "gt_trek_payments";

function _uid() {
  return `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function _currentUser() {
  try { return JSON.parse(sessionStorage.getItem("gt_user")) || { name: "Admin", username: "admin" }; }
  catch { return { name: "Admin", username: "admin" }; }
}

export function getAllTrekPayments() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}

function _save(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

/* overrides = { LEADER: { amount, reason }, FOOD_VENDOR: { amount, reason }, ... } */
export function createTrekPayment({ trekName, trekId, eventDate, participants, config, overrides = {} }) {
  const p = Number(participants || 0);
  const leaderFee      = Number(overrides.LEADER?.amount     ?? config.leaderFee          ?? 0);
  const foodTotal      = Number(overrides.FOOD_VENDOR?.amount ?? (Number(config.foodCostPerPerson || 0) * p));
  const transportTotal = Number(overrides.BUS_VENDOR?.amount  ?? config.transportCostFixed ?? 0);
  const entryTotal     = Number(overrides.ENTRY_FEES?.amount  ?? (Number(config.entryFees || 0) * p));
  const totalCost      = leaderFee + foodTotal + transportTotal + entryTotal;

  const _pay = (recipientType, recipientName, amount, baseAmount) => ({
    recipientType, recipientName, amount, status: "PENDING", method: "", reference: "", paidAt: null,
    baseAmount,
    overrideReason: overrides[recipientType]?.reason || "",
    isOverridden: overrides[recipientType] && Number(overrides[recipientType].amount) !== Number(baseAmount),
  });

  const payments = [];
  if (leaderFee > 0)      payments.push(_pay("LEADER",     config.trekLeaderName || "Trek Leader",    leaderFee,      Number(config.leaderFee || 0)));
  if (foodTotal > 0)      payments.push(_pay("FOOD_VENDOR", config.foodVendorName || "Food Vendor",    foodTotal,      Number(config.foodCostPerPerson || 0) * p));
  if (transportTotal > 0) payments.push(_pay("BUS_VENDOR",  config.busVendorName  || "Bus Vendor",     transportTotal, Number(config.transportCostFixed || 0)));
  if (entryTotal > 0)     payments.push(_pay("ENTRY_FEES",  "Entry Fees / Government",                 entryTotal,     Number(config.entryFees || 0) * p));

  const user = _currentUser();
  const record = {
    paymentId: _uid(),
    trekName, trekId: trekId || "",
    eventDate, participants: p,
    config: { ...config },
    calculations: { leaderFee, foodTotal, transportTotal, entryTotal, totalCost },
    payments,
    status: "PENDING",
    createdBy: user.name,
    createdByUsername: user.username,
    createdAt: new Date().toISOString(),
  };
  _save([record, ...getAllTrekPayments()]);
  return record;
}

export function markSubPaymentDone({ paymentId, recipientType, method, reference, finalAmount, overrideReason }) {
  const all = getAllTrekPayments();
  const updated = all.map((rec) => {
    if (rec.paymentId !== paymentId) return rec;
    const payments = rec.payments.map((p) =>
      p.recipientType === recipientType
        ? {
            ...p, status: "COMPLETED", method, reference, paidAt: new Date().toISOString(),
            ...(finalAmount !== undefined && Number(finalAmount) !== p.amount
              ? { finalAmount: Number(finalAmount), overrideReason: overrideReason || "", isOverridden: true }
              : {}),
          }
        : p
    );
    const allDone = payments.every((p) => p.status === "COMPLETED");
    const anyDone = payments.some((p) => p.status === "COMPLETED");
    return { ...rec, payments, status: allDone ? "COMPLETED" : anyDone ? "IN_PROGRESS" : "PENDING" };
  });
  _save(updated);
}

export function deleteTrekPayment(paymentId) {
  _save(getAllTrekPayments().filter((r) => r.paymentId !== paymentId));
}

/* Update arbitrary config fields (e.g. whatsappGroupLink) on an existing record */
export function updateTrekPaymentConfig(paymentId, configPatch) {
  const all = getAllTrekPayments().map((r) =>
    r.paymentId === paymentId
      ? { ...r, config: { ...r.config, ...configPatch } }
      : r
  );
  _save(all);
}

export function getTrekPaymentStats() {
  const all = getAllTrekPayments();
  const totalOutgoing = all.reduce((s, r) => s + (r.calculations?.totalCost || 0), 0);
  const pending   = all.filter(r => r.status !== "COMPLETED").reduce((s, r) => s + (r.calculations?.totalCost || 0), 0);
  const completed = all.filter(r => r.status === "COMPLETED").reduce((s, r) => s + (r.calculations?.totalCost || 0), 0);
  return { count: all.length, totalOutgoing, pending, completed };
}
