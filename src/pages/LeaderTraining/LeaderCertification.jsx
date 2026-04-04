import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getBestAttempt, getAllAttempts, getCertificationLabel, getLeaderProfile } from "../../data/leaderStorage";
import {
  DEFAULT_TRAINING_MODULES,
  getTrainingModules,
} from "../../data/trainingData";
import { getModuleProgress } from "../../data/leaderStorage";
import { getTrainingUpdateEventName } from "../../data/trainingAdminStorage";

/* ─── Print / Share helpers ──────────────────────────────────── */
function printCert() {
  window.print();
}

/* ─── Score breakdown bar ────────────────────────────────────── */
function ScoreBar({ percent, color }) {
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 4 }}>
        <span style={{ color: "#6b7280" }}>Score</span>
        <span style={{ fontWeight: 700, color }}>{percent}%</span>
      </div>
      <div style={{ height: 10, background: "#e5e7eb", borderRadius: 5 }}>
        <div
          style={{
            height: 10, borderRadius: 5, background: color,
            width: `${percent}%`, transition: "width 0.6s ease",
          }}
        />
      </div>
      <div className="d-flex justify-content-between" style={{ fontSize: "0.75rem", marginTop: 3, color: "#9ca3af" }}>
        <span>0%</span>
        <span style={{ color: "#f59e0b" }}>70% Approved</span>
        <span style={{ color: "#7c3aed" }}>90% Expert</span>
        <span>100%</span>
      </div>
    </div>
  );
}

/* ─── Certificate Card ───────────────────────────────────────── */
function CertificateCard({ attempt, profile, certInfo, certRef, moduleCount }) {
  return (
    <div
      ref={certRef}
      className="cert-card"
      style={{
        background: "#fff",
        border: `4px solid ${certInfo.color}`,
        borderRadius: 20,
        padding: "2.5rem",
        textAlign: "center",
        boxShadow: `0 8px 40px ${certInfo.color}30`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Corner decorations */}
      <div
        style={{
          position: "absolute", top: 16, left: 16,
          width: 60, height: 60,
          border: `3px solid ${certInfo.color}30`,
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute", bottom: 16, right: 16,
          width: 60, height: 60,
          border: `3px solid ${certInfo.color}30`,
          borderRadius: "50%",
        }}
      />

      {/* Logo / Org */}
      <div style={{ fontSize: "2.5rem", marginBottom: "0.25rem" }}>🏔️</div>
      <div className="fw-bold text-success" style={{ fontSize: "0.85rem", letterSpacing: 2, marginBottom: "1.5rem" }}>
        GADVEDE TREKKERS
      </div>

      <div style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "0.5rem" }}>
        This is to certify that
      </div>

      <h2
        className="fw-bold"
        style={{
          fontSize: "clamp(1.4rem, 4vw, 2rem)",
          color: "#111827",
          borderBottom: `2px solid ${certInfo.color}`,
          paddingBottom: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        {profile?.name || "Trek Leader"}
      </h2>

      {profile?.employeeId && (
        <div className="small text-muted mb-1">ID: {profile.employeeId}</div>
      )}

      <div style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "0.5rem" }}>
        has successfully completed the
      </div>

      <div
        style={{
          background: certInfo.color + "12",
          borderRadius: 12,
          padding: "1rem",
          margin: "1rem auto",
          maxWidth: 380,
        }}
      >
        <div style={{ fontSize: "3rem" }}>{certInfo.badge}</div>
        <h3 className="fw-bold mb-1" style={{ color: certInfo.color }}>
          {certInfo.level}
        </h3>
        <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
          Gadvede Leader Certification Test
        </div>
      </div>

      <div
        style={{
          display: "flex", gap: "1.5rem", justifyContent: "center",
          flexWrap: "wrap", margin: "1rem 0",
        }}
      >
        <div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: certInfo.color }}>
            {attempt.percent}%
          </div>
          <div className="small text-muted">Score</div>
        </div>
        <div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#374151" }}>
            {attempt.score}/{attempt.maxScore}
          </div>
          <div className="small text-muted">Points</div>
        </div>
        <div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#374151" }}>
            {moduleCount}
          </div>
          <div className="small text-muted">Modules</div>
        </div>
      </div>

      <div
        style={{
          fontSize: "0.82rem", color: "#9ca3af", borderTop: "1px solid #f3f4f6",
          paddingTop: "1rem", marginTop: "0.5rem",
        }}
      >
        Issued on {new Date(attempt.completedAt).toLocaleDateString("en-IN", {
          day: "numeric", month: "long", year: "numeric"
        })}
        {profile?.phone && ` • ${profile.phone}`}
      </div>
    </div>
  );
}

/* ─── Attempt history ────────────────────────────────────────── */
function AttemptHistory({ attempts }) {
  return (
    <div>
      <h6 className="fw-bold mb-3">📊 Attempt History</h6>
      <div className="d-flex flex-column gap-2">
        {[...attempts].reverse().map((a, i) => {
          const cert = getCertificationLabel(a.percent);
          return (
            <div
              key={a.attemptId}
              style={{
                background: "#fff", borderRadius: 10,
                padding: "0.85rem 1rem",
                border: "1px solid #e5e7eb",
                display: "flex", alignItems: "center", gap: "0.75rem",
              }}
            >
              <span style={{ fontSize: "1.25rem" }}>{cert.badge}</span>
              <div style={{ flex: 1 }}>
                <div className="fw-semibold small" style={{ color: cert.color }}>
                  {cert.level} — {a.percent}%
                </div>
                <div style={{ fontSize: "0.78rem", color: "#9ca3af" }}>
                  {new Date(a.completedAt).toLocaleDateString("en-IN")} •
                  Score: {a.score}/{a.maxScore}
                </div>
              </div>
              {i === 0 && (
                <span
                  className="small fw-semibold px-2 py-1 rounded-2"
                  style={{ background: "#f0fdf4", color: "#16a34a" }}
                >
                  Latest
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function LeaderCertification() {
  const [modules, setModules] = useState(DEFAULT_TRAINING_MODULES);
  const [bestAttempt, setBestAttempt] = useState(null);
  const [allAttempts, setAllAttempts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState({});
  const certRef = useRef(null);

  useEffect(() => {
    const syncTrainingState = () => {
      setModules(getTrainingModules());
      setBestAttempt(getBestAttempt());
      setAllAttempts(getAllAttempts());
      setProfile(getLeaderProfile());
      setProgress(getModuleProgress());
    };

    syncTrainingState();
    window.scrollTo({ top: 0, behavior: "auto" });
    const updateEvent = getTrainingUpdateEventName();
    window.addEventListener(updateEvent, syncTrainingState);
    return () => window.removeEventListener(updateEvent, syncTrainingState);
  }, []);

  const completedModules = modules.filter((m) => progress[m.id]?.completed).length;

  if (!bestAttempt) {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
        <div className="container py-5 text-center" style={{ maxWidth: 600 }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎓</div>
          <h3 className="fw-bold mb-3">No Certification Yet</h3>
          <p className="text-muted mb-4">
            Complete the training modules and take the certification test to earn your leader certificate.
          </p>
          <Link to="/leader-training" className="btn btn-success me-2">
            ← Training Home
          </Link>
          <Link to="/leader-training/test" className="btn btn-outline-success">
            Take Test →
          </Link>
        </div>
      </div>
    );
  }

  const certInfo = getCertificationLabel(bestAttempt.percent);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div
        style={{
          background: certInfo.color,
          color: "#fff",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <Link
          to="/leader-training"
          style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "0.9rem", display: "block", marginBottom: "0.5rem" }}
        >
          ← Leader Training
        </Link>
        <h2 className="fw-bold mb-0" style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)" }}>
          {certInfo.badge} {certInfo.level}
        </h2>
        <p style={{ opacity: 0.85, marginTop: "0.25rem", marginBottom: 0 }}>
          Best score: {bestAttempt.percent}% • {allAttempts.length} attempt{allAttempts.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="container py-4" style={{ maxWidth: 720 }}>

        {/* ── Certificate ───────────────────────────────────── */}
        <div className="mb-4">
          <CertificateCard
            attempt={bestAttempt}
            profile={profile}
            certInfo={certInfo}
            certRef={certRef}
            moduleCount={modules.length}
          />
        </div>

        {/* ── Score bar ─────────────────────────────────────── */}
        <div
          style={{
            background: "#fff", borderRadius: 14, padding: "1.25rem 1.5rem",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: "1.5rem",
          }}
        >
          <ScoreBar percent={bestAttempt.percent} color={certInfo.color} />
        </div>

        {/* ── Modules completed ─────────────────────────────── */}
        <div
          style={{
            background: "#fff", borderRadius: 14, padding: "1.25rem 1.5rem",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: "1.5rem",
          }}
        >
          <h6 className="fw-bold mb-3">📚 Training Completion</h6>
          <div className="d-flex flex-wrap gap-2">
            {modules.map((m) => {
              const done = !!progress[m.id]?.completed;
              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.4rem",
                    background: done ? "#f0fdf4" : "#f9fafb",
                    border: `1px solid ${done ? "#bbf7d0" : "#e5e7eb"}`,
                    borderRadius: 8, padding: "0.4rem 0.75rem",
                    fontSize: "0.85rem",
                  }}
                >
                  <span>{done ? "✅" : "⬜"}</span>
                  <span style={{ color: done ? "#14532d" : "#9ca3af" }}>{m.title}</span>
                </div>
              );
            })}
          </div>
          <div className="small text-muted mt-2">
            {completedModules}/{modules.length} modules completed
          </div>
        </div>

        {/* ── Actions ───────────────────────────────────────── */}
        <div className="d-flex gap-2 mb-4 flex-wrap">
          <button
            className="btn btn-success"
            onClick={printCert}
            style={{ borderRadius: 8 }}
          >
            🖨️ Print Certificate
          </button>
          <Link
            to="/leader-training/test"
            className="btn btn-outline-secondary"
            style={{ borderRadius: 8 }}
          >
            🔄 Retake Test
          </Link>
          <Link
            to="/leader-training"
            className="btn btn-outline-success"
            style={{ borderRadius: 8 }}
          >
            📚 Training Home
          </Link>
        </div>

        {/* ── History ───────────────────────────────────────── */}
        {allAttempts.length > 1 && (
          <div
            style={{
              background: "#fff", borderRadius: 14, padding: "1.25rem 1.5rem",
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            }}
          >
            <AttemptHistory attempts={allAttempts} />
          </div>
        )}
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          nav, header, footer, .btn, a.btn { display: none !important; }
          body { background: #fff !important; }
          .cert-card { box-shadow: none !important; border-width: 2px !important; }
        }
      `}</style>
    </div>
  );
}
