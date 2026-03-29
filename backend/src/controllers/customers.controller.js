import supabaseAdmin from "../config/supabaseAdminClient.js";

function normalizePhone(value = "") {
  return String(value).replace(/\D/g, "").slice(-10);
}

function normalizeEmail(value = "") {
  return String(value).trim().toLowerCase();
}

function toFrontend(data) {
  return {
    id: data.id,
    name: data.full_name,
    phone: data.phone || "",
    email: data.email || "",
    tags: data.tags || [],
    enquiryCount: data.enquiry_count || 0,
    bookingCount: data.booking_count || 0,
    latestEnquiryStatus: data.latest_enquiry_status || "",
    latestEnquiryEvent: data.latest_enquiry_event || "",
    latestBookedEvent: data.latest_booked_event || "",
    latestBookingStatus: data.latest_booking_status || "",
    lastContactAt: data.last_contact_at || "",
    createdAt: data.created_at,
    enquiries: [],
    bookings: [],
  };
}

/* ── GET /api/customers  (admin-only, requires x-admin-api-key) ── */
export async function listCustomers(req, res) {
  const { search = "", limit = "500", offset = "0" } = req.query;

  let query = supabaseAdmin
    .from("customers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(Number(offset), Number(offset) + Number(limit) - 1);

  if (search.trim()) {
    query = query.or(
      `full_name.ilike.%${search.trim()}%,phone.ilike.%${search.trim()}%,email.ilike.%${search.trim()}%`
    );
  }

  const { data, error, count } = await query;

  if (error) return res.status(500).json({ success: false, error: error.message });

  return res.json({
    success: true,
    total: count ?? data.length,
    data: (data || []).map(toFrontend),
  });
}

/* ── GET /api/customers/:id  (admin-only) ── */
export async function getCustomerById(req, res) {
  const { id } = req.params;

  const { data, error } = await supabaseAdmin
    .from("customers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return res.status(500).json({ success: false, error: error.message });
  if (!data) return res.status(404).json({ success: false, error: "Customer not found" });

  return res.json({ success: true, data: toFrontend(data) });
}

export async function upsertCustomer(req, res) {
  const customer = req.body || {};
  const phone = normalizePhone(customer.phone);
  const email = normalizeEmail(customer.email);

  if (!phone && !email) {
    return res.status(400).json({ success: false, error: "Phone or email is required" });
  }

  let existing = null;

  if (phone) {
    const { data } = await supabaseAdmin.from("customers").select("*").eq("phone", phone).maybeSingle();
    existing = data || existing;
  }

  if (!existing && email) {
    const { data } = await supabaseAdmin.from("customers").select("*").eq("email", email).maybeSingle();
    existing = data || null;
  }

  const payload = {
    full_name: customer.name || existing?.full_name || "Unknown",
    phone: phone || existing?.phone || null,
    email: email || existing?.email || null,
    tags: customer.tags || existing?.tags || [],
    enquiry_count: Number(customer.enquiryCount || existing?.enquiry_count || 0),
    booking_count: Number(customer.bookingCount || existing?.booking_count || 0),
    latest_enquiry_status: customer.latestEnquiryStatus || existing?.latest_enquiry_status || null,
    latest_enquiry_event: customer.latestEnquiryEvent || existing?.latest_enquiry_event || null,
    latest_booked_event: customer.latestBookedEvent || existing?.latest_booked_event || null,
    latest_booking_status: customer.latestBookingStatus || existing?.latest_booking_status || null,
    last_contact_at: customer.lastContactAt || existing?.last_contact_at || null,
  };

  const query = existing
    ? supabaseAdmin.from("customers").update(payload).eq("id", existing.id)
    : supabaseAdmin.from("customers").insert(payload);

  const { data, error } = await query.select("*").single();

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  return res.json({ success: true, data: toFrontend(data) });
}
