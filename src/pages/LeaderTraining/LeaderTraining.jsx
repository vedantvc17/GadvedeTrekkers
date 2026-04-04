import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DEFAULT_TRAINING_MODULES,
  getTrainingModules,
} from "../../data/trainingData";
import {
  getModuleProgress,
  getBestAttempt,
  getCertificationLabel,
  getLeaderProfile,
  saveLeaderProfile,
} from "../../data/leaderStorage";
import { getTrainingUpdateEventName } from "../../data/trainingAdminStorage";

/* ─── Profile Modal ──────────────────────────────────────────── */
function ProfileModal({ profile, onSave, onClose }) {
  const [form, setForm] = useState({
    name: profile?.name || "",
    phone: profile?.phone || "",
    email: profile?.email || "",
    employeeId: profile?.employeeId || "",
  });

  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
        zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff", borderRadius: 16, padding: "2rem",
          width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h5 className="fw-bold mb-3">👤 Leader Profile</h5>
        {[
          ["name", "Full Name *", "text"],
          ["phone", "Phone Number *", "tel"],
          ["email", "Email Address", "email"],
          ["employeeId", "Employee / Leader ID", "text"],
        ].map(([key, label, type]) => (
          <div className="mb-3" key={key}>
            <label className="form-label small fw-semibold">{label}</label>
            <input
              type={type}
              className="form-control"
              value={form[key]}
              onChange={handle(key)}
              style={{ fontSize: "1rem" }}
            />
          </div>
        ))}
        <div className="d-flex gap-2 justify-content-end">
          <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-success"
            onClick={() => {
              if (!form.name.trim() || !form.phone.trim()) return;
              onSave(form);
              onClose();
            }}
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────── */
export default function LeaderTraining() {
  const [modules, setModules] = useState(DEFAULT_TRAINING_MODULES);
  const [progress, setProgress] = useState({});
  const [bestAttempt, setBestAttempt] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const syncTrainingState = () => {
      setModules(getTrainingModules());
      setProgress(getModuleProgress());
      setBestAttempt(getBestAttempt());
      setProfile(getLeaderProfile());
    };

    syncTrainingState();
    window.scrollTo({ top: 0, behavior: "auto" });
    const updateEvent = getTrainingUpdateEventName();
    window.addEventListener(updateEvent, syncTrainingState);
    return () => window.removeEventListener(updateEvent, syncTrainingState);
  }, []);

  const completedModules = modules.filter((m) => progress[m.id]?.completed).length;
  const totalModules = modules.length;
  const completionPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  const allModulesComplete = totalModules > 0 && completedModules === totalModules;

  const cert = bestAttempt ? getCertificationLabel(bestAttempt.percent) : null;

  const handleProfileSave = (p) => {
    saveLeaderProfile(p);
    setProfile(p);
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>

      {/* ── Hero ────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #14532d 0%, #166534 60%, #15803d 100%)",
          color: "#fff", padding: "3rem 1.5rem 2.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🏔️</div>
        <h1 className="fw-bold mb-2" style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)" }}>
          Gadvede Leader Training
        </h1>
        <p className="mb-3" style={{ opacity: 0.88, maxWidth: 560, margin: "0 auto 1.5rem" }}>
          Complete all modules and pass the certification test to become an approved trek leader.
        </p>

        {/* Profile pill */}
        <button
          onClick={() => setShowProfile(true)}
          style={{
            background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.35)",
            color: "#fff", borderRadius: 50, padding: "0.45rem 1.1rem", fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          {profile ? `👤 ${profile.name}` : "👤 Set Up Profile"}
        </button>
      </div>

      <div className="container" style={{ maxWidth: 860, paddingTop: "2rem", paddingBottom: "4rem" }}>

        {/* ── Progress Summary ──────────────────────────────── */}
        <div
          className="d-flex gap-3 mb-4 flex-wrap"
          style={{ justifyContent: "center" }}
        >
          {/* Modules */}
          <div
            style={{
              flex: "1 1 200px", background: "#fff", borderRadius: 14,
              padding: "1.25rem 1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#16a34a" }}>
              {completedModules}/{totalModules}
            </div>
            <div className="small text-muted">Modules Completed</div>
            <div
              style={{
                height: 6, background: "#e5e7eb", borderRadius: 3, marginTop: "0.75rem",
              }}
            >
              <div
                style={{
                  height: 6, borderRadius: 3, background: "#16a34a",
                  width: `${completionPercent}%`,
                  transition: "width 0.4s",
                }}
              />
            </div>
          </div>

          {/* Certification */}
          <div
            style={{
              flex: "1 1 200px", background: "#fff", borderRadius: 14,
              padding: "1.25rem 1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              textAlign: "center",
            }}
          >
            {cert ? (
              <>
                <div style={{ fontSize: "2rem" }}>{cert.badge}</div>
                <div className="fw-bold" style={{ color: cert.color, fontSize: "1rem" }}>
                  {cert.level}
                </div>
                <div className="small text-muted">{bestAttempt.percent}% — Best Score</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: "2rem" }}>🎓</div>
                <div className="fw-semibold text-muted">Not Tested Yet</div>
                <div className="small text-muted">Complete modules to unlock</div>
              </>
            )}
          </div>
        </div>

        {/* ── Certification Banner ─────────────────────────── */}
        {cert && (
          <div
            style={{
              background: cert.color + "15",
              border: `2px solid ${cert.color}40`,
              borderRadius: 14,
              padding: "1rem 1.5rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "2rem" }}>{cert.badge}</span>
            <div style={{ flex: 1 }}>
              <div className="fw-bold" style={{ color: cert.color }}>
                {cert.level} — {bestAttempt.percent}%
              </div>
              <div className="small text-muted">
                Score: {bestAttempt.score}/{bestAttempt.maxScore} • Taken on{" "}
                {new Date(bestAttempt.completedAt).toLocaleDateString("en-IN")}
              </div>
            </div>
            <Link
              to="/leader-training/certification"
              className="btn btn-sm"
              style={{ background: cert.color, color: "#fff", borderRadius: 8 }}
            >
              View Certificate →
            </Link>
          </div>
        )}

        {/* ── Module Cards ─────────────────────────────────── */}
        <h5 className="fw-bold mb-3">📚 Training Modules</h5>
        <div className="d-flex flex-column gap-3 mb-4">
          {modules.map((mod, idx) => {
            const done = !!progress[mod.id]?.completed;
            return (
              <div
                key={mod.id}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: "1.25rem 1.5rem",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  border: done ? `2px solid #16a34a40` : "2px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: mod.color + "18",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.6rem", flexShrink: 0,
                  }}
                >
                  {mod.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div className="fw-bold" style={{ fontSize: "1rem" }}>
                    Module {idx + 1}: {mod.title}
                  </div>
                  <div className="small text-muted mb-1">{mod.description}</div>
                  <div className="small" style={{ color: "#6b7280" }}>
                    ⏱ {mod.estimatedTime}
                    {mod.videos?.length > 0 && ` • 🎥 ${mod.videos.length} video${mod.videos.length > 1 ? "s" : ""}`}
                    {mod.sections?.length > 0 && ` • ${mod.sections.length} sections`}
                  </div>
                </div>

                {/* Status + CTA */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  {done && (
                    <div
                      className="small fw-semibold mb-1"
                      style={{ color: "#16a34a" }}
                    >
                      ✅ Completed
                    </div>
                  )}
                  <Link
                    to={`/leader-training/module/${mod.id}`}
                    className="btn btn-sm"
                    style={{
                      background: done ? "#f0fdf4" : mod.color,
                      color: done ? "#16a34a" : "#fff",
                      border: done ? "1px solid #16a34a" : "none",
                      borderRadius: 8,
                      fontWeight: 600,
                    }}
                  >
                    {done ? "Review Module" : "Start Module →"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Test CTA ─────────────────────────────────────── */}
        <div
          style={{
            background: allModulesComplete
              ? "linear-gradient(135deg, #14532d, #15803d)"
              : "#f1f5f9",
            borderRadius: 16,
            padding: "2rem",
            textAlign: "center",
            color: allModulesComplete ? "#fff" : "#64748b",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {allModulesComplete ? (
            <>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎓</div>
              <h4 className="fw-bold mb-2">Ready for the Certification Test!</h4>
              <p className="mb-3" style={{ opacity: 0.88, maxWidth: 480, margin: "0 auto 1.5rem" }}>
                50 scenario-based questions. Weighted scoring. Earn your leader certification.
              </p>
              <Link
                to="/leader-training/test"
                className="btn btn-lg"
                style={{
                  background: "#fff", color: "#14532d",
                  fontWeight: 700, borderRadius: 10,
                  padding: "0.75rem 2.5rem",
                }}
              >
                Take Certification Test →
              </Link>
            </>
          ) : (
            <>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔒</div>
              <h5 className="fw-bold mb-2">Certification Test Locked</h5>
              <p className="small mb-3">
                Complete all {totalModules} modules to unlock the test.
                <br />
                <strong>{totalModules - completedModules} module{totalModules - completedModules !== 1 ? "s" : ""} remaining.</strong>
              </p>
              {bestAttempt && (
                <Link
                  to="/leader-training/test"
                  className="btn btn-sm btn-outline-secondary"
                >
                  Retake Test Anyway
                </Link>
              )}
            </>
          )}
        </div>

        {/* ── Quick Nav ─────────────────────────────────────── */}
        {bestAttempt && (
          <div className="mt-4 text-center">
            <Link to="/leader-training/certification" className="btn btn-outline-success me-2">
              🏆 View Certificate
            </Link>
            <Link to="/leader-training/test" className="btn btn-outline-secondary">
              🔄 Retake Test
            </Link>
          </div>
        )}
      </div>

      {/* ── Profile Modal ────────────────────────────────────── */}
      {showProfile && (
        <ProfileModal
          profile={profile}
          onSave={handleProfileSave}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}
