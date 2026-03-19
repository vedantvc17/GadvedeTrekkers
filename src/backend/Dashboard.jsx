import { Link } from "react-router-dom";
import { getAdminItems } from "../data/adminStorage";
import { getAllBookings } from "../data/bookingStorage";
import { getTransactionStats } from "../data/transactionStorage";
import { getAllCustomers } from "../data/customerStorage";

const SECTIONS = [
  { label: "Treks",          icon: "🥾", key: "gt_treks",    path: "/admin/treks",    color: "#198754" },
  { label: "Tours",          icon: "🗺",  key: "gt_tours",    path: "/admin/tours",    color: "#0d6efd" },
  { label: "Heritage Walks", icon: "🏛",  key: "gt_heritage", path: "/admin/heritage", color: "#6f42c1" },
  { label: "Camping",        icon: "⛺",  key: "gt_camping",  path: "/admin/camping",  color: "#fd7e14" },
  { label: "Rentals",        icon: "🏠",  key: "gt_rentals",  path: "/admin/rentals",  color: "#dc3545" },
];

function Dashboard() {
  const stats = SECTIONS.map((s) => ({
    ...s,
    count: getAdminItems(s.key).length,
  }));

  const total = stats.reduce((sum, s) => sum + s.count, 0);

  const txnStats = getTransactionStats();
  const bookingCount  = getAllBookings().length;
  const customerCount = getAllCustomers().length;

  return (
    <div className="adm-page">
      <h3 className="adm-page-title">Dashboard</h3>
      <p className="text-muted mb-4">Overview of all your listings on the website.</p>

      <div className="adm-total-banner mb-4">
        <span className="adm-total-num">{total}</span>
        <span className="adm-total-label">Total Admin Listings</span>
      </div>

      <div className="adm-stat-grid">
        {stats.map((s) => (
          <Link
            key={s.key}
            to={s.path}
            className="adm-stat-card"
            style={{ "--card-accent": s.color }}
          >
            <span className="adm-stat-icon">{s.icon}</span>
            <div className="adm-stat-body">
              <div className="adm-stat-count">{s.count}</div>
              <div className="adm-stat-label">{s.label}</div>
            </div>
            <span className="adm-stat-arrow">→</span>
          </Link>
        ))}
      </div>

      {/* ── Bookings & Transactions ── */}
      <h5 className="mt-5 mb-3 fw-semibold">Bookings & Revenue</h5>
      <div className="adm-stat-grid">
        <Link to="/admin/bookings" className="adm-stat-card" style={{ "--card-accent": "#0891b2" }}>
          <span className="adm-stat-icon">📋</span>
          <div className="adm-stat-body">
            <div className="adm-stat-count">{bookingCount}</div>
            <div className="adm-stat-label">Bookings</div>
          </div>
          <span className="adm-stat-arrow">→</span>
        </Link>
        <Link to="/admin/customers" className="adm-stat-card" style={{ "--card-accent": "#7c3aed" }}>
          <span className="adm-stat-icon">👤</span>
          <div className="adm-stat-body">
            <div className="adm-stat-count">{customerCount}</div>
            <div className="adm-stat-label">Customers</div>
          </div>
          <span className="adm-stat-arrow">→</span>
        </Link>
        <Link to="/admin/transactions" className="adm-stat-card" style={{ "--card-accent": "#059669" }}>
          <span className="adm-stat-icon">💳</span>
          <div className="adm-stat-body">
            <div className="adm-stat-count">₹{txnStats.revenue.toLocaleString("en-IN")}</div>
            <div className="adm-stat-label">Revenue ({txnStats.success} txns)</div>
          </div>
          <span className="adm-stat-arrow">→</span>
        </Link>
        <Link to="/admin/transactions" className="adm-stat-card" style={{ "--card-accent": "#dc2626" }}>
          <span className="adm-stat-icon">↩️</span>
          <div className="adm-stat-body">
            <div className="adm-stat-count">{txnStats.refunded}</div>
            <div className="adm-stat-label">Refunded Txns</div>
          </div>
          <span className="adm-stat-arrow">→</span>
        </Link>
      </div>

      <h5 className="mt-5 mb-3 fw-semibold">Quick Add</h5>
      <div className="d-flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <Link key={s.key} to={s.path} className="btn btn-outline-success btn-sm">
            {s.icon} Add {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
