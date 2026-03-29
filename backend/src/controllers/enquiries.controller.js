import supabaseAdmin from "../config/supabaseAdminClient.js";

function toRow(e) {
  return {
    id:                         e.id,
    customer_id:                /^[0-9a-f-]{36}$/i.test(String(e.customerId || "")) ? e.customerId : null,
    name:                       e.name || "Unknown",
    phone:                      e.phone || e.contact || null,
    email:                      e.email || null,
    event_name:                 e.eventName || e.tour || null,
    category:                   e.category || null,
    location:                   e.location || null,
    page_key:                   e.pageKey || null,
    page_url:                   e.pageUrl || null,
    message:                    e.message || null,
    preferred_date:             e.preferredDate || null,
    group_size:                 String(e.groupSize || ""),
    status:                     e.status || "NEW_LEAD",
    tags:                       e.tags || [],
    assigned_sales_employee_id: e.assignedSalesEmployeeId || null,
    assigned_sales_name:        e.assignedSalesName || null,
    assigned_sales_username:    e.assignedSalesUsername || null,
    viewed_at:                  e.viewedAt || null,
    first_response_at:          e.firstResponseAt || null,
    converted_at:               e.convertedAt || null,
    archived_at:                e.archivedAt || null,
    booked_event_name:          e.bookedEventName || null,
    booked_booking_id:          e.bookedBookingId || null,
    created_at:                 e.createdAt || new Date().toISOString(),
  };
}

function toFrontend(r) {
  return {
    id:                       r.id,
    customerId:               r.customer_id || "",
    name:                     r.name,
    phone:                    r.phone || "",
    contact:                  r.phone || "",
    email:                    r.email || "",
    eventName:                r.event_name || "",
    tour:                     r.event_name || "",
    category:                 r.category || "",
    location:                 r.location || "",
    pageKey:                  r.page_key || "",
    pageUrl:                  r.page_url || "",
    message:                  r.message || "",
    preferredDate:            r.preferred_date || "",
    groupSize:                r.group_size || "",
    status:                   r.status,
    tags:                     r.tags || [],
    assignedSalesEmployeeId:  r.assigned_sales_employee_id || "",
    assignedSalesName:        r.assigned_sales_name || "",
    assignedSalesUsername:    r.assigned_sales_username || "",
    viewedAt:                 r.viewed_at || "",
    firstResponseAt:          r.first_response_at || "",
    convertedAt:              r.converted_at || "",
    archivedAt:               r.archived_at || "",
    bookedEventName:          r.booked_event_name || "",
    bookedBookingId:          r.booked_booking_id || "",
    createdAt:                r.created_at,
  };
}

/* ── GET /api/enquiries ── */
export async function listEnquiries(req, res) {
  const {
    search = "",
    status = "",
    include_archived = "false",
    limit = "500",
    offset = "0",
  } = req.query;

  let query = supabaseAdmin
    .from("enquiries")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(Number(offset), Number(offset) + Number(limit) - 1);

  if (status) query = query.eq("status", status);
  if (include_archived !== "true") query = query.is("archived_at", null);

  if (search.trim()) {
    const q = search.trim();
    query = query.or(
      `name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%,event_name.ilike.%${q}%,id.ilike.%${q}%`
    );
  }

  const { data, error, count } = await query;
  if (error) return res.status(500).json({ success: false, error: error.message });

  return res.json({
    success: true,
    total: count ?? (data || []).length,
    data: (data || []).map(toFrontend),
  });
}

/* ── POST /api/enquiries  (upsert by id) ── */
export async function upsertEnquiry(req, res) {
  const enquiry = req.body || {};
  if (!enquiry.id) return res.status(400).json({ success: false, error: "Enquiry id is required" });

  const { data, error } = await supabaseAdmin
    .from("enquiries")
    .upsert(toRow(enquiry), { onConflict: "id" })
    .select("*")
    .single();

  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.status(201).json({ success: true, data: toFrontend(data) });
}

/* ── PATCH /api/enquiries/:id ── */
export async function updateEnquiry(req, res) {
  const { id } = req.params;
  const updates = req.body || {};

  const patch = {};
  if (updates.status            !== undefined) patch.status              = updates.status;
  if (updates.tags              !== undefined) patch.tags                = updates.tags;
  if (updates.viewedAt          !== undefined) patch.viewed_at           = updates.viewedAt;
  if (updates.firstResponseAt   !== undefined) patch.first_response_at   = updates.firstResponseAt;
  if (updates.convertedAt       !== undefined) patch.converted_at        = updates.convertedAt;
  if (updates.archivedAt        !== undefined) patch.archived_at         = updates.archivedAt;
  if (updates.bookedEventName   !== undefined) patch.booked_event_name   = updates.bookedEventName;
  if (updates.bookedBookingId   !== undefined) patch.booked_booking_id   = updates.bookedBookingId;
  if (updates.assignedSalesEmployeeId !== undefined) patch.assigned_sales_employee_id = updates.assignedSalesEmployeeId;
  if (updates.assignedSalesName       !== undefined) patch.assigned_sales_name        = updates.assignedSalesName;
  if (updates.assignedSalesUsername   !== undefined) patch.assigned_sales_username    = updates.assignedSalesUsername;

  const { data, error } = await supabaseAdmin
    .from("enquiries")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return res.status(500).json({ success: false, error: error.message });
  if (!data)  return res.status(404).json({ success: false, error: "Enquiry not found" });

  return res.json({ success: true, data: toFrontend(data) });
}
