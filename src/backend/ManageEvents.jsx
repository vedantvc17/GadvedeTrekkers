import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteListingSubmission,
  getListingSubmissions,
  hydrateListingSubmissions,
  saveListingSubmissions,
  updateListingSubmission,
} from "../data/listingSubmissionStorage";

const STATUS_COLORS = {
  PENDING:  { bg: "#fef3c7", color: "#92400e", label: "Pending Review" },
  APPROVED: { bg: "#dcfce7", color: "#166534", label: "Approved" },
  REJECTED: { bg: "#fee2e2", color: "#991b1b", label: "Rejected" },
  LIVE:     { bg: "#dbeafe", color: "#1e40af", label: "Live" },
};

const EVENT_TYPES = [
  "Trekking Event", "Nature Festival", "Adventure Race", "Photography Walk",
  "Yoga / Wellness Retreat", "Cultural Event", "Charity Trek",
  "Camping Event", "Corporate Outing", "Other",
];

const EMPTY_PICKUP = { city: "", location: "", time: "", mapUrl: "" };

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.PENDING;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
    }}>
      {s.label}
    </span>
  );
}

function EditModal({ event, onClose, onSave }) {
  const [form, setForm] = useState({ ...event });
  const [pickupPoints, setPickupPoints] = useState(
    Array.isArray(event.pickupPoints) && event.pickupPoints.length
      ? event.pickupPoints
      : [{ ...EMPTY_PICKUP }]
  );

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const addPickup = () => setPickupPoints((p) => [...p, { ...EMPTY_PICKUP }]);
  const removePickup = (i) => setPickupPoints((p) => p.filter((_, idx) => idx !== i));
  const updatePickup = (i, field, val) =>
    setPickupPoints((p) => p.map((pt, idx) => (idx === i ? { ...pt, [field]: val } : pt)));

  const handleSave = () => {
    const filled = pickupPoints.filter((p) => p.city.trim() || p.location.trim());
    onSave({ ...form, pickupPoints: filled });
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px",
    }}>
      <div style={{
        background: "#fff", borderRadius: 14, width: "100%", maxWidth: 760,
        maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
      }}>
        {/* Modal header */}
        <div style={{
          padding: "18px 24px", borderBottom: "1px solid #e2e8f0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, background: "#fff", zIndex: 1,
        }}>
          <div style={{ fontWeight: 700, fontSize: 17, color: "#0c3a1e" }}>
            ✏️ Edit Event — {event.eventName}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#64748b" }}
          >
            ×
          </button>
        </div>

        {/* Modal body */}
        <div style={{ padding: "24px" }}>
          <div className="row g-3">

            {/* Status */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Status</label>
              <select className="form-select" value={form.status} onChange={set("status")}>
                {Object.entries(STATUS_COLORS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Event Type</label>
              <select className="form-select" value={form.eventType} onChange={set("eventType")}>
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Event Name</label>
              <input className="form-control" value={form.eventName || ""} onChange={set("eventName")} />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Organizer Name</label>
              <input className="form-control" value={form.organizerName || ""} onChange={set("organizerName")} />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Phone</label>
              <input type="tel" className="form-control" value={form.phone || ""} onChange={set("phone")} />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Email</label>
              <input type="email" className="form-control" value={form.email || ""} onChange={set("email")} />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Event Date</label>
              <input type="date" className="form-control" value={form.eventDate || ""} onChange={set("eventDate")} />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Location</label>
              <input className="form-control" value={form.location || ""} onChange={set("location")} placeholder="Village, District, State" />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Expected Attendees</label>
              <input type="number" min="1" className="form-control" value={form.expectedAttendees || ""} onChange={set("expectedAttendees")} />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Entry Fee (₹)</label>
              <input type="number" min="0" className="form-control" value={form.entryFee || ""} onChange={set("entryFee")} />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Description</label>
              <textarea className="form-control" rows={4} value={form.description || ""} onChange={set("description")} />
            </div>

          </div>

          {/* Pickup points */}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#0c3a1e", marginBottom: 12 }}>
              📍 Pickup Points
              <span style={{ fontWeight: 400, color: "#64748b", fontSize: 12, marginLeft: 8 }}>
                These appear on the customer's booking ticket
              </span>
            </div>

            {pickupPoints.map((pt, i) => (
              <div key={i} style={{
                background: "#f8fafc", border: "1px solid #e2e8f0",
                borderRadius: 8, padding: "12px", marginBottom: 10, position: "relative",
              }}>
                <div className="row g-2">
                  <div className="col-md-2">
                    <label className="form-label small fw-semibold">City</label>
                    <input className="form-control form-control-sm" placeholder="Mumbai" value={pt.city} onChange={(e) => updatePickup(i, "city", e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Location</label>
                    <input className="form-control form-control-sm" placeholder="Dadar Station, East Exit" value={pt.location} onChange={(e) => updatePickup(i, "location", e.target.value)} />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label small fw-semibold">Time</label>
                    <input className="form-control form-control-sm" placeholder="06:00 AM" value={pt.time} onChange={(e) => updatePickup(i, "time", e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Google Maps Link</label>
                    <input className="form-control form-control-sm" placeholder="https://maps.google.com/..." value={pt.mapUrl} onChange={(e) => updatePickup(i, "mapUrl", e.target.value)} />
                  </div>
                </div>
                {pickupPoints.length > 1 && (
                  <button
                    type="button" onClick={() => removePickup(i)}
                    style={{ position: "absolute", top: 8, right: 10, background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 18 }}
                  >×</button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-outline-success btn-sm" onClick={addPickup}>
              + Add Pickup Point
            </button>
          </div>
        </div>

        {/* Modal footer */}
        <div style={{
          padding: "16px 24px", borderTop: "1px solid #e2e8f0",
          display: "flex", justifyContent: "flex-end", gap: 10,
          position: "sticky", bottom: 0, background: "#fff",
        }}>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-success" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManageEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(() => getListingSubmissions("event"));
  const [editingEvent, setEditingEvent] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    hydrateListingSubmissions("event")
      .then((remote) => {
        if (remote) setEvents(remote);
      })
      .catch((error) => console.warn("Event listing fetch failed", error));
  }, []);

  const save = (updated) => {
    saveListingSubmissions("event", updated);
    setEvents(updated);
  };

  const handleSaveEdit = (updatedEvent) => {
    updateListingSubmission("event", updatedEvent.id, updatedEvent);
    setEvents(events.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev)));
    setEditingEvent(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this event listing?")) return;
    deleteListingSubmission("event", id);
    setEvents(events.filter((ev) => ev.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    updateListingSubmission("event", id, { status: newStatus });
    setEvents(events.map((ev) => (ev.id === id ? { ...ev, status: newStatus } : ev)));
  };

  const filtered = events.filter((ev) => {
    const matchesSearch =
      !search ||
      ev.eventName?.toLowerCase().includes(search.toLowerCase()) ||
      ev.organizerName?.toLowerCase().includes(search.toLowerCase()) ||
      ev.location?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || ev.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="adm-page">
      {editingEvent && (
        <EditModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Header */}
      <div className="adm-page-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="adm-page-title">📅 Events</h1>
          <div className="adm-page-sub">{events.length} event listing{events.length !== 1 ? "s" : ""}</div>
        </div>
        <button
          className="btn btn-success"
          onClick={() => navigate("/admin/events/new")}
        >
          + Add New Event
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <input
          className="form-control"
          style={{ maxWidth: 280 }}
          placeholder="Search by name, organizer, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select"
          style={{ maxWidth: 180 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          {Object.entries(STATUS_COLORS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
          <div style={{ fontWeight: 600 }}>No events found</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            {events.length === 0
              ? "No events submitted yet. Click \"+ Add New Event\" to create one."
              : "Try adjusting your search or filter."}
          </div>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Organizer</th>
                <th>Date</th>
                <th>Location</th>
                <th>Pickup Points</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev) => (
                <tr key={ev.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: "#1e293b" }}>{ev.eventName}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{ev.eventType}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{ev.organizerName}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{ev.phone}</div>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {ev.eventDate
                      ? new Date(ev.eventDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                      : <span style={{ color: "#94a3b8" }}>—</span>}
                  </td>
                  <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {ev.location || "—"}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {Array.isArray(ev.pickupPoints) && ev.pickupPoints.length > 0 ? (
                      <span style={{
                        background: "#dcfce7", color: "#166534",
                        padding: "2px 8px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                      }}>
                        {ev.pickupPoints.length} point{ev.pickupPoints.length !== 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: 12 }}>None</span>
                    )}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {ev.entryFee > 0
                      ? `₹${Number(ev.entryFee).toLocaleString("en-IN")}`
                      : <span style={{ color: "#16a34a", fontWeight: 600 }}>Free</span>}
                  </td>
                  <td>
                    <StatusBadge status={ev.status} />
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setEditingEvent(ev)}
                      >
                        ✏️ Edit
                      </button>
                      {ev.status === "PENDING" && (
                        <>
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() => handleStatusChange(ev.id, "APPROVED")}
                          >
                            ✓ Approve
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleStatusChange(ev.id, "REJECTED")}
                          >
                            ✗ Reject
                          </button>
                        </>
                      )}
                      {ev.status === "APPROVED" && (
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleStatusChange(ev.id, "LIVE")}
                        >
                          🚀 Go Live
                        </button>
                      )}
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(ev.id)}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
