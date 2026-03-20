import { useState } from "react";
import { getAllVendors, saveVendor, deleteVendor } from "../data/vendorStorage";

const SERVICE_TYPES = ["Bus", "Food", "Adventure Activity"];
const RATE_PLACEHOLDERS = {
  Bus:               "e.g. ₹15,000/day (AC Bus 40 seats)",
  Food:              "e.g. ₹150/plate (Veg Thali)",
  "Adventure Activity": "e.g. ₹500/day per person",
};

const EMPTY = { name: "", address: "", googleMapLocation: "", contactNumber: "", serviceType: "Bus", rates: "", images: [] };

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
    setForm({ name: v.name, address: v.address, googleMapLocation: v.googleMapLocation, contactNumber: v.contactNumber, serviceType: v.serviceType, rates: v.rates, images: v.images || [] });
    setEditId(v.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.contactNumber) return alert("Name and Contact Number are required.");
    saveVendor({ ...form, id: editId || undefined });
    setShowForm(false);
    setForm(EMPTY);
    setEditId(null);
    refresh();
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this vendor?")) { deleteVendor(id); refresh(); }
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

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h3 className="adm-page-title">🏪 Vendors</h3>
        <button className="btn btn-success btn-sm" onClick={openAdd}>+ Add Vendor</button>
      </div>

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
            <div className="col-md-8">
              <label className="form-label form-label-sm">Rates</label>
              <input className="form-control form-control-sm" placeholder={RATE_PLACEHOLDERS[form.serviceType]} value={form.rates} onChange={(e) => setForm((f) => ({ ...f, rates: e.target.value }))} />
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
    </div>
  );
}
