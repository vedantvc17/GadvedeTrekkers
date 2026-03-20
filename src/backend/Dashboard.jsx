import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminItems } from "../data/adminStorage";
import { getAllBookings } from "../data/bookingStorage";
import { getTransactionStats } from "../data/transactionStorage";
import { getAllCustomers } from "../data/customerStorage";
import { getAllEmergencyContacts, saveEmergencyContact, deleteEmergencyContact } from "../data/emergencyStorage";

const SECTIONS = [
  { label: "Treks",          icon: "🥾", key: "gt_treks",    path: "/admin/treks",    color: "#198754" },
  { label: "Tours",          icon: "🗺",  key: "gt_tours",    path: "/admin/tours",    color: "#0d6efd" },
  { label: "Heritage Walks", icon: "🏛",  key: "gt_heritage", path: "/admin/heritage", color: "#6f42c1" },
  { label: "Camping",        icon: "⛺",  key: "gt_camping",  path: "/admin/camping",  color: "#fd7e14" },
  { label: "Rentals",        icon: "🏠",  key: "gt_rentals",  path: "/admin/rentals",  color: "#dc3545" },
];

const QUOTES = [
  { text: "The mountains are calling and I must go.", author: "John Muir" },
  { text: "Every mountain top is within reach if you just keep climbing.", author: "Barry Finlay" },
  { text: "It's not the mountain we conquer, but ourselves.", author: "Sir Edmund Hillary" },
  { text: "In every walk with nature, one receives far more than he seeks.", author: "John Muir" },
  { text: "The climb is tough, but the view from the top is priceless.", author: "Unknown" },
  { text: "Adventure is worthwhile in itself.", author: "Amelia Earhart" },
  { text: "Nature is not a place to visit. It is home.", author: "Gary Snyder" },
];

const SAFETY_RULES = [
  { icon: "🧭", rule: "Follow guide instructions at all times" },
  { icon: "💧", rule: "Carry at least 2 litres of water per person" },
  { icon: "🗑",  rule: "Avoid littering — carry a trash bag" },
  { icon: "👥", rule: "Stay with the group — never trek alone" },
  { icon: "📵", rule: "Conserve phone battery for emergencies" },
  { icon: "🌦", rule: "Check weather forecast before departure" },
];

const EMPTY_CONTACT = { name: "", contactNumber: "", location: "", type: "Hospital" };

function Dashboard() {
  const stats = SECTIONS.map((s) => ({ ...s, count: getAdminItems(s.key).length }));
  const total = stats.reduce((sum, s) => sum + s.count, 0);
  const txnStats     = getTransactionStats();
  const bookingCount  = getAllBookings().length;
  const customerCount = getAllCustomers().length;

  /* ── Quote rotation ── */
  const [quoteIdx, setQuoteIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setQuoteIdx((i) => (i + 1) % QUOTES.length), 6000);
    return () => clearInterval(t);
  }, []);

  /* ── Emergency contacts ── */
  const [contacts, setContacts]       = useState(() => getAllEmergencyContacts());
  const [showForm, setShowForm]       = useState(false);
  const [formContact, setFormContact] = useState(EMPTY_CONTACT);
  const [editingId, setEditingId]     = useState(null);

  const refreshContacts = () => setContacts(getAllEmergencyContacts());

  const handleSave = () => {
    if (!formContact.name || !formContact.contactNumber) return;
    saveEmergencyContact({ ...formContact, id: editingId || undefined });
    setShowForm(false);
    setFormContact(EMPTY_CONTACT);
    setEditingId(null);
    refreshContacts();
  };

  const handleEdit = (c) => {
    setFormContact({ name: c.name, contactNumber: c.contactNumber, location: c.location, type: c.type });
    setEditingId(c.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this contact?")) { deleteEmergencyContact(id); refreshContacts(); }
  };

  return (
    <div className="adm-page">
      <h3 className="adm-page-title">Dashboard</h3>
      <p className="text-muted mb-4">Overview of all your listings on the website.</p>

      {/* ── Motivational Quote ── */}
      <div className="adm-quote-card mb-4">
        <div className="adm-quote-icon">💬</div>
        <div>
          <p className="adm-quote-text">"{QUOTES[quoteIdx].text}"</p>
          <p className="adm-quote-author">— {QUOTES[quoteIdx].author}</p>
        </div>
      </div>

      {/* ── Listing counts ── */}
      <div className="adm-total-banner mb-4">
        <span className="adm-total-num">{total}</span>
        <span className="adm-total-label">Total Admin Listings</span>
      </div>

      <div className="adm-stat-grid">
        {stats.map((s) => (
          <Link key={s.key} to={s.path} className="adm-stat-card" style={{ "--card-accent": s.color }}>
            <span className="adm-stat-icon">{s.icon}</span>
            <div className="adm-stat-body">
              <div className="adm-stat-count">{s.count}</div>
              <div className="adm-stat-label">{s.label}</div>
            </div>
            <span className="adm-stat-arrow">→</span>
          </Link>
        ))}
      </div>

      {/* ── Bookings & Revenue ── */}
      <h5 className="mt-5 mb-3 fw-semibold">Bookings & Revenue</h5>
      <div className="adm-stat-grid">
        <Link to="/admin/bookings" className="adm-stat-card" style={{ "--card-accent": "#0891b2" }}>
          <span className="adm-stat-icon">📋</span>
          <div className="adm-stat-body"><div className="adm-stat-count">{bookingCount}</div><div className="adm-stat-label">Bookings</div></div>
          <span className="adm-stat-arrow">→</span>
        </Link>
        <Link to="/admin/customers" className="adm-stat-card" style={{ "--card-accent": "#7c3aed" }}>
          <span className="adm-stat-icon">👤</span>
          <div className="adm-stat-body"><div className="adm-stat-count">{customerCount}</div><div className="adm-stat-label">Customers</div></div>
          <span className="adm-stat-arrow">→</span>
        </Link>
        <Link to="/admin/transactions" className="adm-stat-card" style={{ "--card-accent": "#059669" }}>
          <span className="adm-stat-icon">💳</span>
          <div className="adm-stat-body"><div className="adm-stat-count">₹{txnStats.revenue.toLocaleString("en-IN")}</div><div className="adm-stat-label">Revenue ({txnStats.success} txns)</div></div>
          <span className="adm-stat-arrow">→</span>
        </Link>
        <Link to="/admin/transactions" className="adm-stat-card" style={{ "--card-accent": "#dc2626" }}>
          <span className="adm-stat-icon">↩️</span>
          <div className="adm-stat-body"><div className="adm-stat-count">{txnStats.refunded}</div><div className="adm-stat-label">Refunded Txns</div></div>
          <span className="adm-stat-arrow">→</span>
        </Link>
      </div>

      {/* ── Safety Rules ── */}
      <h5 className="mt-5 mb-3 fw-semibold">🛡 Trekking Safety Rules</h5>
      <div className="adm-safety-grid">
        {SAFETY_RULES.map((r, i) => (
          <div key={i} className="adm-safety-card">
            <span className="adm-safety-icon">{r.icon}</span>
            <span className="adm-safety-rule">{r.rule}</span>
          </div>
        ))}
      </div>

      {/* ── Emergency Contacts ── */}
      <div className="d-flex align-items-center justify-content-between mt-5 mb-3">
        <h5 className="fw-semibold mb-0">🚨 Emergency Contacts</h5>
        <button className="btn btn-sm btn-outline-danger" onClick={() => { setShowForm((v)=>!v); setFormContact(EMPTY_CONTACT); setEditingId(null); }}>
          {showForm ? "✕ Cancel" : "+ Add Contact"}
        </button>
      </div>

      {showForm && (
        <div className="adm-emergency-form mb-3">
          <select className="form-select form-select-sm" style={{ flex: 1 }} value={formContact.type} onChange={(e) => setFormContact((f) => ({ ...f, type: e.target.value }))}>
            <option>Hospital</option><option>Rescue Team</option><option>Local Authority</option><option>Police</option><option>Forest Dept.</option>
          </select>
          <input className="form-control form-control-sm" placeholder="Name *" value={formContact.name} onChange={(e) => setFormContact((f) => ({ ...f, name: e.target.value }))} style={{ flex: 2 }} />
          <input className="form-control form-control-sm" placeholder="Contact Number *" value={formContact.contactNumber} onChange={(e) => setFormContact((f) => ({ ...f, contactNumber: e.target.value }))} style={{ flex: 1.5 }} />
          <input className="form-control form-control-sm" placeholder="Location" value={formContact.location} onChange={(e) => setFormContact((f) => ({ ...f, location: e.target.value }))} style={{ flex: 2 }} />
          <button className="btn btn-sm btn-success" onClick={handleSave}>{editingId ? "Update" : "Save"}</button>
        </div>
      )}

      {contacts.length === 0 ? (
        <p className="text-muted" style={{ fontSize: 13 }}>No emergency contacts added yet.</p>
      ) : (
        <div className="adm-table-wrap mb-5">
          <table className="table table-hover adm-table mb-0">
            <thead><tr><th>Type</th><th>Name</th><th>Contact</th><th>Location</th><th style={{ width: 90 }}>Actions</th></tr></thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id}>
                  <td><span className={`adm-emergency-badge adm-emergency-badge--${c.type?.toLowerCase().replace(/\s/g,'')}`}>{c.type}</span></td>
                  <td><strong>{c.name}</strong></td>
                  <td><a href={`tel:${c.contactNumber}`}>{c.contactNumber}</a></td>
                  <td>{c.location || "—"}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button className="btn btn-outline-secondary btn-sm py-0 px-1" style={{ fontSize: 11 }} onClick={() => handleEdit(c)}>Edit</button>
                      <button className="btn btn-outline-danger btn-sm py-0 px-1" style={{ fontSize: 11 }} onClick={() => handleDelete(c.id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Quick Add ── */}
      <h5 className="mt-4 mb-3 fw-semibold">Quick Add</h5>
      <div className="d-flex flex-wrap gap-2 mb-4">
        {SECTIONS.map((s) => (
          <Link key={s.key} to={s.path} className="btn btn-outline-success btn-sm">{s.icon} Add {s.label}</Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
