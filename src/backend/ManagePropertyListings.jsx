import { useEffect, useState } from "react";
import { useToast } from "../components/Toast";
import { useConfirm } from "../components/ConfirmModal";
import {
  deleteListingSubmission,
  getListingSubmissions,
  hydrateListingSubmissions,
  saveListingSubmissions,
  updateListingSubmission,
} from "../data/listingSubmissionStorage";
import { getErrorMessage } from "../utils/errorMessage";

const STATUS_COLORS = {
  PENDING:  { bg: "#fef3c7", color: "#92400e", label: "Pending Review" },
  APPROVED: { bg: "#dcfce7", color: "#166534", label: "Approved" },
  REJECTED: { bg: "#fee2e2", color: "#991b1b", label: "Rejected" },
  LIVE:     { bg: "#dbeafe", color: "#1e40af", label: "Live" },
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.PENDING;
  return (
    <span style={{ background: s.bg, color: s.color, padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
      {s.label}
    </span>
  );
}

function EditModal({ listing, onClose, onSave }) {
  const [form, setForm] = useState({ ...listing });
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 680, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#0c3a1e" }}>✏️ Edit Listing — {listing.propertyName}</div>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#64748b" }}>×</button>
        </div>
        <div style={{ padding: "24px" }}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Status</label>
              <select className="form-select" value={form.status} onChange={set("status")}>
                {Object.entries(STATUS_COLORS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Property Type</label>
              <input className="form-control" value={form.type || ""} onChange={set("type")} />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Property Name</label>
              <input className="form-control" value={form.propertyName || ""} onChange={set("propertyName")} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Owner Name</label>
              <input className="form-control" value={form.ownerName || ""} onChange={set("ownerName")} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Phone</label>
              <input type="tel" className="form-control" value={form.phone || ""} onChange={set("phone")} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Email</label>
              <input type="email" className="form-control" value={form.email || ""} onChange={set("email")} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Location</label>
              <input className="form-control" value={form.location || ""} onChange={set("location")} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Capacity</label>
              <input type="number" min="1" className="form-control" value={form.capacity || ""} onChange={set("capacity")} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Price / Night (₹)</label>
              <input type="number" min="0" className="form-control" value={form.pricePerNight || ""} onChange={set("pricePerNight")} />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Description</label>
              <textarea className="form-control" rows={3} value={form.description || ""} onChange={set("description")} />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Admin Notes</label>
              <textarea className="form-control" rows={2} placeholder="Internal notes visible to admin only..." value={form.adminNotes || ""} onChange={set("adminNotes")} />
            </div>
          </div>
        </div>
        <div style={{ padding: "16px 24px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: 10, position: "sticky", bottom: 0, background: "#fff" }}>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-success" onClick={() => onSave(form)}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default function ManagePropertyListings() {
  const [listings, setListings] = useState(() => getListingSubmissions("property"));
  const [editing, setEditing] = useState(null);
  const toast   = useToast();
  const confirm = useConfirm();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    hydrateListingSubmissions("property")
      .then((remote) => {
        if (remote) setListings(remote);
      })
      .catch((error) => console.warn("Property listing fetch failed", error));
  }, []);

  const save = (updated) => {
    saveListingSubmissions("property", updated);
    setListings(updated);
  };

  const handleSaveEdit = async (updated) => {
    try {
      await updateListingSubmission("property", updated.id, updated);
      setListings(listings.map((l) => (l.id === updated.id ? updated : l)));
      setEditing(null);
      toast.success("Property listing updated successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Property listing could not be updated."));
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({ title: "Delete Listing?", message: "This listing will be permanently removed.", confirmText: "Delete", type: "danger" });
    if (!ok) return;
    try {
      await deleteListingSubmission("property", id);
      setListings(listings.filter((l) => l.id !== id));
      toast.success("Listing deleted.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Listing could not be deleted."));
    }
  };

  const setStatus = async (id, status) => {
    const labels = { APPROVED: "approve", REJECTED: "reject", LIVE: "publish live" };
    const ok = await confirm({
      title: "Confirm Listing Action",
      message: `Are you sure you want to ${labels[status] || status.toLowerCase()} this property listing?`,
      confirmText: "Yes, Continue",
      type: status === "REJECTED" ? "danger" : status === "LIVE" ? "primary" : "success",
    });
    if (!ok) return;

    try {
      await updateListingSubmission("property", id, { status });
      setListings(listings.map((l) => (l.id === id ? { ...l, status } : l)));
      const statusLabels = { APPROVED: "Approved", REJECTED: "Rejected", LIVE: "Published as Live!" };
      toast.success(`Listing status updated to ${statusLabels[status] || status}.`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Listing status could not be updated."));
    }
  };

  const filtered = listings.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = !search || l.propertyName?.toLowerCase().includes(q) || l.ownerName?.toLowerCase().includes(q) || l.location?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "ALL" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="adm-page">
      {editing && <EditModal listing={editing} onClose={() => setEditing(null)} onSave={handleSaveEdit} />}

      <div className="adm-page-header">
        <h1 className="adm-page-title">🏡 Property Listings</h1>
        <div className="adm-page-sub">{listings.length} listing{listings.length !== 1 ? "s" : ""} submitted · Admin review only</div>
      </div>

      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#1d4ed8" }}>
        🔒 These listings are submitted by property owners via the public form. They are visible to admin only until you change the status to <strong>Live</strong>.
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <input className="form-control" style={{ maxWidth: 280 }} placeholder="Search by name, owner, location..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="form-select" style={{ maxWidth: 180 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="ALL">All Statuses</option>
          {Object.entries(STATUS_COLORS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏡</div>
          <div style={{ fontWeight: 600 }}>{listings.length === 0 ? "No property listings yet" : "No listings match your search"}</div>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Owner</th>
                <th>Location</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Price/Night</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <>
                  <tr key={l.id} style={{ cursor: "pointer" }} onClick={() => setExpandedId(expandedId === l.id ? null : l.id)}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{l.propertyName}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{l.id}</div>
                    </td>
                    <td>
                      <div>{l.ownerName}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{l.phone}</div>
                    </td>
                    <td>{l.location || "—"}</td>
                    <td>{l.type || "—"}</td>
                    <td style={{ textAlign: "center" }}>{l.capacity || "—"}</td>
                    <td>{l.pricePerNight ? `₹${Number(l.pricePerNight).toLocaleString("en-IN")}` : "—"}</td>
                    <td><StatusBadge status={l.status} /></td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        <button className="btn btn-outline-primary btn-sm" onClick={() => setEditing(l)}>✏️ Edit</button>
                        {l.status === "PENDING" && <>
                          <button className="btn btn-outline-success btn-sm" onClick={() => setStatus(l.id, "APPROVED")}>✓</button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => setStatus(l.id, "REJECTED")}>✗</button>
                        </>}
                        {l.status === "APPROVED" && <button className="btn btn-outline-primary btn-sm" onClick={() => setStatus(l.id, "LIVE")}>🚀</button>}
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(l.id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === l.id && (
                    <tr key={`${l.id}-detail`} style={{ background: "#f8fafc" }}>
                      <td colSpan={8} style={{ padding: "16px 24px" }}>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <strong>Description:</strong>
                            <p style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>{l.description || "—"}</p>
                          </div>
                          <div className="col-md-3">
                            <strong>Amenities:</strong>
                            <p style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>{Array.isArray(l.amenities) ? l.amenities.join(", ") : l.amenities || "—"}</p>
                          </div>
                          <div className="col-md-3">
                            <strong>Email:</strong> {l.email || "—"}<br />
                            <strong>Submitted:</strong> {l.submittedAt ? new Date(l.submittedAt).toLocaleDateString("en-IN") : "—"}<br />
                            {l.adminNotes && <><strong>Notes:</strong> {l.adminNotes}</>}
                          </div>
                          {Array.isArray(l.photos) && l.photos.length > 0 && (
                            <div className="col-12">
                              <strong>Photos:</strong>
                              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                                {l.photos.slice(0, 5).map((ph, idx) => (
                                  <img key={idx} src={ph} alt="" style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 6 }} />
                                ))}
                              </div>
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
