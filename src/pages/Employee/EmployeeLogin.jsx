import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { employeeLogin, setEmployeeSession } from "../../data/employeePortalStorage";

export default function EmployeeLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const result = employeeLogin(username.trim(), password.trim());
      setLoading(false);
      if (!result.ok) { setError(result.error); return; }
      setEmployeeSession(result.cred);
      const params = new URLSearchParams(location.search);
      const next = params.get("next");
      navigate(next || "/employee/dashboard");
    }, 400);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #134e4a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: "36px 40px", width: "100%", maxWidth: 400,
        boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
      }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 40 }}>🏔</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginTop: 8 }}>Gadvede Trekkers</div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Employee Portal Login</div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Username
            </label>
            <input
              type="text" className="form-control"
              placeholder="e.g. rahul.patil"
              value={username} onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              style={{ borderRadius: 8 }}
            />
          </div>
          <div className="mb-3">
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password" className="form-control"
              placeholder="Your password"
              value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{ borderRadius: 8 }}
            />
          </div>

          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8,
              padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading || !username || !password}
            style={{ borderRadius: 8, fontWeight: 700, padding: "10px 0" }}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#94a3b8" }}>
          Your credentials are provided by your admin during onboarding.
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <a href="/" style={{ fontSize: 12, color: "#0284c7" }}>← Back to website</a>
        </div>
      </div>
    </div>
  );
}
