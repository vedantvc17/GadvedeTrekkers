import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_USER = "admin";
const ADMIN_PASS = "gadvede@123";

function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.username === ADMIN_USER && form.password === ADMIN_PASS) {
      sessionStorage.setItem("gt_admin", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="al-wrap">
      <div className="al-card">

        <div className="al-brand">
          <div className="al-brand-icon">🏔</div>
          <h2 className="al-brand-name">Gadvede Trekkers</h2>
          <p className="al-brand-sub">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold small">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="admin"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small">Password</label>
            <div className="input-group">
              <input
                type={showPass ? "text" : "password"}
                className="form-control"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPass((p) => !p)}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small mb-3">{error}</div>
          )}

          <button type="submit" className="btn btn-success w-100 fw-semibold py-2">
            Login →
          </button>
        </form>

        <p className="al-hint mt-3">
          Default: <code>admin</code> / <code>gadvede@123</code>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
