import { useState } from "react";
import { getAllVendors, saveVendor, deleteVendor } from "../data/vendorStorage";
import { logActivity } from "../data/activityLogStorage";
import { currentUserHasPermission, getCurrentAdminUser } from "../data/permissionStorage";
import { submitRateApproval, getPendingApprovals, approveRateRequest, rejectRateRequest } from "../data/rateApprovalStorage";

const SERVICE_TYPES = ["Bus", "Food", "Adventure Activity"];
const RATE_PLACEHOLDERS = {
  Bus:               "e.g. ₹15,000/day (AC Bus 40 seats)",
  Food:              "e.g. ₹150/plate (Veg Thali)",
  "Adventure Activity": "e.g. ₹500/day per person",
};

const EMPTY = { name: "", address: "", googleMapLocation: "", contactNumber: "", serviceType: "Bus", rates: "", rateAmount: "", images: [] };

const PAYMENT_METHODS = ["UPI", "Bank Transfer (NEFT/RTGS)", "Cheque", "Cash"];

function VendorPayments() {
  const canPay = currentUserHasPermission("vendor_payments");
  const [tick, setTick] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [vendors] = useState(() => getAllVendors());
  const [payments, setPayments] = useState(() => {
    try { return JSON.parse(localStorage.getItem("gt_vendor_payments")) || []; }
    catch { return []; }
  });
  const [form, setForm] = useState({
    vendorId: "", vendorName: "", amount: "", method: "UPI",
    reference: "", description: "", date: new Date().toISOString().slice(0,10),
  });

  const refresh = () => {
    const p = JSON.parse(localStorage.getItem("gt_vendor_payments") || "[]");
    setPayments(p);
    setTick(t => t + 1);
  };

  const set = (k,v) => setForm(p => ({ ...p, [k]: v }));

  const handleVendorChange = (vendorId) => {
    const v = vendors.find(x => x.id === vendorId);
    set("vendorId", vendorId);
    set("vendorName", v?.name || "");
  };

  const handleSubmit = () => {
    if (!form.vendorId || !form.amount) return alert("Select vendor and enter amount.");
    const user = getCurrentAdminUser();
    const entry = {
      paymentId: `PAY-${Date.now()}`,
      ...form,
      amount: Number(form.amount),
      paidBy: user.name,
      paidByUsername: user.username,
      paidAt: new Date().toISOString(),
    };
    const all = JSON.parse(localStorage.getItem("gt_vendor_payments") || "[]");
    localStorage.setItem("gt_vendor_payments", JSON.stringify([entry, ...all]));
    logActivity({
      action: "VENDOR_PAYMENT",
      actionLabel: "Made Vendor Payment",
      details: `₹${Number(form.amount).toLocaleString("en-IN")} to ${form.vendorName} via ${form.method}${form.reference ? ` (Ref: ${form.reference})` : ""}`,
      module: "Payments",
      severity: "success",
    });
    setShowForm(false);
    setForm({ vendorId:"", vendorName:"", amount:"", method:"UPI", reference:"", description:"", date: new Date().toISOString().slice(0,10) });
    refresh();
  };

  if (!canPay) {
    return (
      <div style={{ padding: 32, textAlign: "center", background: "#fef2f2", borderRadius: 12, margin: "20px 0" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🔒</div>
        <div style={{ fontWeight: 700, color: "#dc2626", marginBottom: 4 }}>Access Restricted</div>
        <div style={{ color: "#64748b", fontSize: 14 }}>Vendor payments can only be made by Rohit Panhalkar or Pratik Ubhe.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="adm-page-header" style={{ marginTop: 32 }}>
        <h3 className="adm-page-title">💳 Vendor Payments</h3>
        <div className="d-flex gap-2 align-items-center">
          <span className="adm-count-badge">{payments.length} payments</span>
          <button className="btn btn-success btn-sm" onClick={() => setShowForm(true)}>+ New Payment</button>
        </div>
      </div>

      {showForm && (
        <div className="emp-form-card mb-4">
          <h6 className="mb-3">New Vendor Payment</h6>
          <div className="row g-2">
            <div className="col-md-4">
              <label className="emp-label">Vendor *</label>
              <select className="form-select form-select-sm" value={form.vendorId} onChange={e => handleVendorChange(e.target.value)}>
                <option value="">— Select Vendor —</option>
                {vendors.map(v => <option key={v.id} value={v.id}>{v.name} ({v.serviceType})</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="emp-label">Amount (₹) *</label>
              <input type="number" min="0" className="form-control form-control-sm" value={form.amount} onChange={e => set("amount", e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="emp-label">Payment Method</label>
              <select className="form-select form-select-sm" value={form.method} onChange={e => set("method", e.target.value)}>
                {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="emp-label">Payment Date</label>
              <input type="date" className="form-control form-control-sm" value={form.date} onChange={e => set("date", e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="emp-label">Reference / UTR / Cheque No.</label>
              <input className="form-control form-control-sm" value={form.reference} onChange={e => set("reference", e.target.value)} placeholder="Optional" />
            </div>
            <div className="col-md-8">
              <label className="emp-label">Description</label>
              <input className="form-control form-control-sm" value={form.description} onChange={e => set("description", e.target.value)} placeholder="e.g. Bus charges for Andharban trek Apr 5" />
            </div>
          </div>
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-success btn-sm" onClick={handleSubmit}>💳 Confirm Payment</button>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {payments.length === 0 ? (
        <div className="adm-empty"><div className="adm-empty-icon">💳</div><p className="adm-empty-text">No vendor payments recorded yet.</p></div>
      ) : (
        <div className="adm-table-wrap">
          <table className="table table-hover adm-table mb-0">
            <thead>
              <tr>
                <th>ID</th><th>Vendor</th><th>Amount</th><th>Method</th>
                <th>Reference</th><th>Description</th><th>Paid By</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.paymentId}>
                  <td style={{fontSize:10, fontFamily:"monospace"}}>{p.paymentId}</td>
                  <td style={{fontWeight:600, fontSize:13}}>{p.vendorName}</td>
                  <td><strong style={{color:"#16a34a"}}>₹{Number(p.amount).toLocaleString("en-IN")}</strong></td>
                  <td><span style={{fontSize:11, background:"#f1f5f9", padding:"2px 8px", borderRadius:4}}>{p.method}</span></td>
                  <td style={{fontSize:11, fontFamily:"monospace"}}>{p.reference || "—"}</td>
                  <td style={{fontSize:12, color:"#475569"}}>{p.description || "—"}</td>
                  <td style={{fontSize:12}}>{p.paidBy}</td>
                  <td style={{fontSize:11}}>{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ManageVendors() {
  const [tick,       setTick]       = useState(0);
  const [search,     setSearch]     = useState("");
  const [showForm,   setShowForm]   = useState(false);
  const [form,       setForm]       = useState(EMPTY);
  const [editId,     setEditId]     = useState(null);
  const [filterType, setFilterType] = useState("");
  const [expanded,   setExpanded]   = useState(null);

  const refresh = () => setTick((t) => t + 1);

  let vendors = getAllVendors();
  if (filterType) vendors = vendors.filter((v) => v.serviceType === filterType);
  if (search.trim()) {
    const q = search.toLowerCase();
    vendors = vendors.filter((v) => v.name?.toLowerCase().includes(q) || v.contactNumber?.includes(q) || v.address?.toLowerCase().includes(q));
  }

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = (v) => {
    setForm({ name: v.name, address: v.address, googleMapLocation: v.googleMapLocation, contactNumber: v.contactNumber, serviceType: v.serviceType, rates: v.rates, rateAmount: v.rateAmount || "", images: v.images || [] });
    setEditId(v.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.contactNumber) return alert("Name and Contact Number are required.");
    const hasVendorPayments = currentUserHasPermission("vendor_payments");
    const existingVendor = editId ? getAllVendors().find(v => v.id === editId) : null;

    if (form.rateAmount && !hasVendorPayments) {
      const vendorToSave = { ...form, id: editId || undefined, rateAmount: existingVendor?.rateAmount || "" };
      saveVendor(vendorToSave);
      // For new vendors, find the just-saved record (most recent by createdAt)
      const savedVendorId = editId || (() => {
        const all = getAllVendors();
        const match = all.find(v => v.name === form.name && v.contactNumber === form.contactNumber);
        return match?.id || "";
      })();
      submitRateApproval({
        type: "vendor",
        targetId: savedVendorId,
        targetName: form.name,
        field: "rateAmount",
        proposedAmount: form.rateAmount,
        currentAmount: existingVendor?.rateAmount || 0,
      });
      alert("Rate amount submitted for Rohit's approval.");
    } else {
      saveVendor({ ...form, id: editId || undefined });
    }
    logActivity({
      action: editId ? "VENDOR_UPDATED" : "VENDOR_ADDED",
      actionLabel: editId ? "Updated Vendor" : "Added Vendor",
      details: `${form.serviceType} vendor: ${form.name}`,
      module: "Vendors",
      severity: "success",
    });
    setShowForm(false);
    setForm(EMPTY);
    setEditId(null);
    refresh();
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this vendor?")) {
      const v = getAllVendors().find(x => x.id === id);
      logActivity({
        action: "VENDOR_DELETED",
        actionLabel: "Deleted Vendor",
        details: `Removed ${v?.serviceType || ""} vendor: ${v?.name || id}`,
        module: "Vendors",
        severity: "warning",
      });
      deleteVendor(id);
      refresh();
    }
  };

  /* ── Image upload → base64 ── */
  const handleImages = (e) => {
    const files = [...e.target.files];
    Promise.all(files.map((f) => new Promise((res) => {
      const r = new FileReader();
      r.onload = (ev) => res(ev.target.result);
      r.readAsDataURL(f);
    }))).then((imgs) => setForm((f) => ({ ...f, images: [...f.images, ...imgs] })));
  };

  const serviceIcon = { Bus: "🚌", Food: "🍱", "Adventure Activity": "🧗" };

  const pendingVendorApprovals = getPendingApprovals().filter(a => a.type === "vendor");
  const hasVendorPaymentsForBanner = currentUserHasPermission("vendor_payments");

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h3 className="adm-page-title">🏪 Vendors</h3>
        <button className="btn btn-success btn-sm" onClick={openAdd}>+ Add Vendor</button>
      </div>

      {/* ── Rate Approvals Banner ── */}
      {pendingVendorApprovals.length > 0 && (
        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#92400e", marginBottom: 10 }}>
            🔔 Pending Rate Approvals ({pendingVendorApprovals.length})
          </div>
          {pendingVendorApprovals.map(approval => (
            <div key={approval.id} style={{ background: "#fff", border: "1px solid #fde68a", borderRadius: 8, padding: "10px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{approval.targetName}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  Proposed Rate: <strong style={{ color: "#1e293b" }}>₹{Number(approval.proposedAmount).toLocaleString("en-IN")}</strong>
                  {" · "}Current: ₹{Number(approval.currentAmount || 0).toLocaleString("en-IN")}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>
                  By {approval.proposedBy} · {new Date(approval.proposedAt).toLocaleDateString("en-IN")}
                </div>
              </div>
              {hasVendorPaymentsForBanner ? (
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success btn-sm py-0 px-2" style={{ fontSize: 12 }}
                    onClick={() => {
                      const existingV = getAllVendors().find(v => v.id === approval.targetId);
                      if (!existingV) { alert("Vendor not found."); return; }
                      approveRateRequest(approval.id);
                      saveVendor({ ...existingV, rateAmount: approval.proposedAmount });
                      logActivity({
                        action: "RATE_APPROVAL_APPROVED",
                        actionLabel: "Approved Rate Request",
                        details: `Approved rateAmount ₹${approval.proposedAmount} for vendor ${approval.targetName}`,
                        module: "Vendors",
                        severity: "success",
                      });
                      refresh();
                    }}
                  >Approve</button>
                  <button
                    className="btn btn-danger btn-sm py-0 px-2" style={{ fontSize: 12 }}
                    onClick={() => {
                      const reason = window.prompt("Reason for rejection:");
                      if (reason === null) return;
                      rejectRateRequest(approval.id, reason);
                      logActivity({
                        action: "RATE_APPROVAL_REJECTED",
                        actionLabel: "Rejected Rate Request",
                        details: `Rejected rateAmount ₹${approval.proposedAmount} for vendor ${approval.targetName}. Reason: ${reason}`,
                        module: "Vendors",
                        severity: "warning",
                      });
                      refresh();
                    }}
                  >Reject</button>
                </div>
              ) : (
                <span style={{ fontSize: 12, color: "#64748b", fontStyle: "italic" }}>Awaiting Rohit's approval</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Filter bar */}
      <div className="adm-filter-bar mb-3">
        <input className="form-control form-control-sm" placeholder="Search name, contact, address…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 2 }} />
        <select className="form-select form-select-sm" value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ flex: 1 }}>
          <option value="">All Service Types</option>
          {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="adm-count-badge">{vendors.length} vendor{vendors.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="adm-vendor-form mb-4">
          <h6 className="fw-semibold mb-3">{editId ? "Edit Vendor" : "Register New Vendor"}</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label form-label-sm">Vendor Name *</label>
              <input className="form-control form-control-sm" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="col-md-6">
              <label className="form-label form-label-sm">Contact Number *</label>
              <input className="form-control form-control-sm" value={form.contactNumber} onChange={(e) => setForm((f) => ({ ...f, contactNumber: e.target.value }))} />
            </div>
            <div className="col-md-6">
              <label className="form-label form-label-sm">Address</label>
              <input className="form-control form-control-sm" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
            </div>
            <div className="col-md-6">
              <label className="form-label form-label-sm">Google Map Location (URL)</label>
              <input className="form-control form-control-sm" placeholder="https://maps.google.com/…" value={form.googleMapLocation} onChange={(e) => setForm((f) => ({ ...f, googleMapLocation: e.target.value }))} />
            </div>
            <div className="col-md-4">
              <label className="form-label form-label-sm">Service Type</label>
              <select className="form-select form-select-sm" value={form.serviceType} onChange={(e) => setForm((f) => ({ ...f, serviceType: e.target.value, rates: "" }))} >
                {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-md-5">
              <label className="form-label form-label-sm">Rates (description)</label>
              <input className="form-control form-control-sm" placeholder={RATE_PLACEHOLDERS[form.serviceType]} value={form.rates} onChange={(e) => setForm((f) => ({ ...f, rates: e.target.value }))} />
            </div>
            <div className="col-md-3">
              <label className="form-label form-label-sm">
                Rate Amount (₹)
                {!currentUserHasPermission("trek_allocation") && <span style={{color:"#ef4444", fontSize:10, marginLeft:4}}>🔒 Pratik/Akshay only</span>}
              </label>
              <input
                type="number" min="0"
                className="form-control form-control-sm"
                placeholder={form.serviceType === "Food" ? "per person" : "per trip"}
                value={form.rateAmount}
                onChange={(e) => setForm((f) => ({ ...f, rateAmount: e.target.value }))}
                disabled={!currentUserHasPermission("trek_allocation")}
              />
              <small className="text-muted" style={{fontSize:10}}>
                {form.serviceType === "Food" ? "Cost per person (for auto-calculation)" : "Fixed cost per trip (for auto-calculation)"}
              </small>
            </div>
            <div className="col-12">
              <label className="form-label form-label-sm">Upload Images</label>
              <input type="file" className="form-control form-control-sm" multiple accept="image/*" onChange={handleImages} />
              {form.images?.length > 0 && (
                <div className="d-flex gap-2 mt-2 flex-wrap">
                  {form.images.map((img, i) => (
                    <img key={i} src={img} alt="" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6, border: "1px solid #e2e8f0" }} />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-success btn-sm" onClick={handleSave}>{editId ? "Update Vendor" : "Register Vendor"}</button>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {vendors.length === 0 ? (
        <div className="adm-empty"><div className="adm-empty-icon">🏪</div><p className="adm-empty-text">No vendors yet. Add your first vendor.</p></div>
      ) : (
        <div className="adm-table-wrap">
          <table className="table table-hover adm-table mb-0">
            <thead>
              <tr><th>Vendor</th><th>Service</th><th>Contact</th><th>Rates</th><th>Location</th><th style={{ width: 80 }}>Details</th></tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <>
                  <tr key={v.id}>
                    <td>
                      <div className="fw-semibold" style={{ fontSize: 13 }}>{v.name}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{v.address}</div>
                    </td>
                    <td>
                      <span className="badge bg-secondary" style={{ fontSize: 11 }}>
                        {serviceIcon[v.serviceType] || ""} {v.serviceType}
                      </span>
                    </td>
                    <td style={{ fontSize: 13 }}>{v.contactNumber}</td>
                    <td style={{ fontSize: 12 }}>{v.rates || "—"}</td>
                    <td>
                      {v.googleMapLocation ? (
                        <a href={v.googleMapLocation} target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>🗺 Map</a>
                      ) : "—"}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button className="btn btn-outline-primary btn-sm py-0 px-2" style={{ fontSize: 11 }} onClick={() => setExpanded(expanded === v.id ? null : v.id)}>
                          {expanded === v.id ? "Hide" : "View"}
                        </button>
                        <button className="btn btn-outline-secondary btn-sm py-0 px-1" style={{ fontSize: 11 }} onClick={() => openEdit(v)}>Edit</button>
                        <button className="btn btn-outline-danger btn-sm py-0 px-1" style={{ fontSize: 11 }} onClick={() => handleDelete(v.id)}>Del</button>
                      </div>
                    </td>
                  </tr>
                  {expanded === v.id && (
                    <tr key={`${v.id}-exp`}>
                      <td colSpan={6} className="p-0">
                        <div className="adm-booking-detail">
                          <div className="adm-detail-grid">
                            <div><span>Vendor ID</span><strong style={{ fontFamily: "monospace", fontSize: 11 }}>{v.id}</strong></div>
                            <div><span>Registered</span><strong>{v.createdAt ? new Date(v.createdAt).toLocaleDateString("en-IN") : "—"}</strong></div>
                          </div>
                          {v.images?.length > 0 && (
                            <div className="d-flex gap-2 mt-3 flex-wrap">
                              {v.images.map((img, i) => <img key={i} src={img} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }} />)}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <VendorPayments />
    </div>
  );
}
