import supabaseAdmin from "../config/supabaseAdminClient.js";

function safeNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

async function resolveBookingId(bookingCode) {
  if (!bookingCode) return null;
  const { data } = await supabaseAdmin
    .from("bookings")
    .select("id")
    .or(`booking_code.eq.${bookingCode},legacy_booking_id.eq.${bookingCode}`)
    .maybeSingle();
  return data?.id || null;
}

/* ── GET /api/payments  (admin) ── */
export async function listPayments(req, res) {
  const {
    search = "",
    status = "",
    mode = "",
    from_date = "",
    to_date = "",
    sort_by = "latest",
    limit = "500",
    offset = "0",
  } = req.query;

  let query = supabaseAdmin
    .from("payments")
    .select("*", { count: "exact" })
    .range(Number(offset), Number(offset) + Number(limit) - 1);

  if (status)    query = query.eq("transaction_status", status);
  if (mode)      query = query.eq("payment_mode", mode);
  if (from_date) query = query.gte("paid_at", from_date);
  if (to_date)   query = query.lte("paid_at", `${to_date}T23:59:59Z`);

  if (search.trim()) {
    const q = search.trim();
    query = query.or(
      `payment_reference.ilike.%${q}%`
    );
  }

  if (sort_by === "oldest")      query = query.order("paid_at", { ascending: true });
  else if (sort_by === "amount-high") query = query.order("gross_amount", { ascending: false });
  else if (sort_by === "amount-low")  query = query.order("gross_amount", { ascending: true });
  else                           query = query.order("paid_at", { ascending: false });

  const { data, error, count } = await query;
  if (error) return res.status(500).json({ success: false, error: error.message });

  const transactions = (data || []).map((t) => ({
    transactionId:     t.payment_reference,
    bookingId:         t.booking_id || "",
    customerId:        t.customer_id || "",
    transactionStatus: t.transaction_status,
    paymentMode:       t.payment_mode,
    grossAmount:       t.gross_amount,
    tax:               t.tax_amount,
    netAmount:         t.net_amount,
    createdAt:         t.paid_at,
    dateTime:          t.paid_at,
  }));

  return res.json({ success: true, total: count ?? transactions.length, data: transactions });
}

/* ── GET /api/payments/refunds  (admin) ── */
export async function listRefunds(req, res) {
  const { payment_id } = req.query;
  let query = supabaseAdmin.from("payment_refunds").select("*").order("created_at", { ascending: false });
  if (payment_id) query = query.eq("payment_id", payment_id);

  const { data, error } = await query;
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true, data: data || [] });
}

export async function upsertPayment(req, res) {
  const payment = req.body || {};
  const paymentReference = payment.transactionId || payment.paymentReference;

  if (!paymentReference) {
    return res.status(400).json({ success: false, error: "Payment reference is required" });
  }

  // booking_id is NOT NULL in the schema — skip insert if booking cannot be resolved
  const bookingId = await resolveBookingId(payment.bookingId);
  if (!bookingId) {
    // Soft-fail: log the miss but don't crash the frontend sync
    return res.status(202).json({
      success: false,
      skipped: true,
      reason: `Booking ${payment.bookingId} not found in Supabase yet — payment not stored.`,
    });
  }

  const VALID_STATUSES = ["SUCCESS", "FAILED", "REFUNDED"];
  const transactionStatus = VALID_STATUSES.includes(payment.transactionStatus)
    ? payment.transactionStatus
    : "SUCCESS";

  const { data: existing } = await supabaseAdmin
    .from("payments")
    .select("id")
    .eq("payment_reference", paymentReference)
    .maybeSingle();

  const payload = {
    booking_id: bookingId,
    customer_id: /^[0-9a-f-]{36}$/i.test(String(payment.customerId || "")) ? payment.customerId : null,
    payment_mode: payment.paymentMode || "UPI",
    transaction_status: transactionStatus,
    gross_amount: safeNumber(payment.grossAmount),
    tax_amount: safeNumber(payment.tax),
    net_amount: safeNumber(payment.netAmount),
    payment_reference: paymentReference,
    gateway_response: payment.gatewayResponse || {},
    paid_at: payment.createdAt || new Date().toISOString(),
  };

  const query = existing
    ? supabaseAdmin.from("payments").update(payload).eq("id", existing.id)
    : supabaseAdmin.from("payments").insert(payload);

  const { data, error } = await query.select("id, payment_reference").single();

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  return res.json({ success: true, data: { id: data.id, paymentReference: data.payment_reference } });
}

export async function createRefund(req, res) {
  const refund = req.body || {};

  if (!refund.transactionId) {
    return res.status(400).json({ success: false, error: "Transaction id is required" });
  }

  const { data: payment } = await supabaseAdmin
    .from("payments")
    .select("id, booking_id")
    .eq("payment_reference", refund.transactionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!payment?.id) {
    return res.status(404).json({ success: false, error: "Payment not found" });
  }

  const refundAmount = safeNumber(refund.amount);
  if (refundAmount <= 0) {
    return res.status(400).json({ success: false, error: "Refund amount must be greater than 0" });
  }

  const { data, error } = await supabaseAdmin
    .from("payment_refunds")
    .insert({
      payment_id: payment.id,
      booking_id: payment.booking_id,
      amount: refundAmount,
      status: refund.status || "REFUNDED",
      reason: refund.reason || null,
      created_at: refund.createdAt || new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  await supabaseAdmin.from("payments").update({ transaction_status: "REFUNDED" }).eq("id", payment.id);

  return res.status(201).json({
    success: true,
    data: {
      refundId: data.id,
      transactionId: refund.transactionId,
      amount: data.amount,
      status: data.status,
      createdAt: data.created_at,
    },
  });
}
