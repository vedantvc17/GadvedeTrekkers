import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NAV = [
  { path: "/admin/dashboard",    icon: "📊", label: "Dashboard" },
  { path: "/admin/treks",        icon: "🥾", label: "Treks" },
  { path: "/admin/tours",        icon: "🗺",  label: "Tours" },
  { path: "/admin/heritage",     icon: "🏛",  label: "Heritage Walks" },
  { path: "/admin/camping",      icon: "⛺",  label: "Camping" },
  { path: "/admin/rentals",      icon: "🏠",  label: "Rentals" },
  { path: "/admin/bookings",     icon: "📋",  label: "Bookings" },
  { path: "/admin/transactions", icon: "💳",  label: "Transactions" },
  { path: "/admin/customers",    icon: "👤",  label: "Customers" },
];

function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("gt_admin")) navigate("/admin");
  }, []);

  const logout = () => {
    sessionStorage.removeItem("gt_admin");
    navigate("/admin");
  };

  return (
    <div className="adm-shell">

      {/* ── Sidebar ── */}
      <aside className="adm-sidebar">
        <div className="adm-brand">
          <span className="adm-brand-icon">🏔</span>
          <div>
            <div className="adm-brand-name">Gadvede Trekkers</div>
            <div className="adm-brand-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="adm-nav">
          {NAV.map(({ path, icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `adm-link ${isActive ? "adm-link--active" : ""}`
              }
            >
              <span className="adm-link-icon">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <a
            href="/"
            className="adm-view-site"
            target="_blank"
            rel="noopener noreferrer"
          >
            🌐 View Website
          </a>
          <button className="adm-logout" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="adm-main">
        <Outlet />
      </main>

    </div>
  );
}

export default AdminLayout;
