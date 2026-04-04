import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  DEFAULT_TRAINING_MODULES,
  getTrainingModules,
} from "../../data/trainingData";
import { getModuleProgress, markModuleComplete } from "../../data/leaderStorage";
import { getTrainingUpdateEventName } from "../../data/trainingAdminStorage";

/* ─── YouTube embed helper ───────────────────────────────────── */
function getYouTubeId(video) {
  // Support both { youtubeId: "xxx" } and { url: "https://youtube.com/watch?v=xxx" }
  if (video.youtubeId) return video.youtubeId;
  if (video.url) {
    const m = video.url.match(/(?:youtu\.be\/|v=|\/embed\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  }
  return null;
}

function VideoEmbed({ video }) {
  const [failed, setFailed] = useState(false);
  const vid = getYouTubeId(video);

  const searchQuery = encodeURIComponent(video.searchQuery || video.title || "wilderness first aid trek");
  const searchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

  if (!vid || failed) {
    return (
      <div style={{ marginBottom: "1.5rem" }}>
        {video.title && (
          <div className="fw-semibold mb-2" style={{ fontSize: "0.95rem" }}>
            🎥 {video.title}
          </div>
        )}
        <div style={{
          background: "#1a1a1a", borderRadius: 12, padding: "2rem 1.5rem",
          textAlign: "center", color: "#9ca3af",
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>▶️</div>
          <div style={{ fontSize: "0.88rem", marginBottom: "1rem" }}>
            {video.description || "Video reference for this topic"}
          </div>
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#dc2626", color: "#fff", borderRadius: 8,
              padding: "0.5rem 1.25rem", textDecoration: "none",
              fontSize: "0.85rem", fontWeight: 600, display: "inline-block",
            }}
          >
            🔴 Search on YouTube →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      {video.title && (
        <div className="fw-semibold mb-2" style={{ fontSize: "0.95rem" }}>
          🎥 {video.title}
        </div>
      )}
      <div style={{
        position: "relative", paddingBottom: "56.25%", height: 0,
        borderRadius: 12, overflow: "hidden", background: "#000",
      }}>
        <iframe
          src={`https://www.youtube.com/embed/${vid}`}
          title={video.title || "Training video"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={() => setFailed(true)}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        />
      </div>
      {video.description && (
        <p className="small text-muted mt-2">{video.description}</p>
      )}
      <div style={{ textAlign: "right", marginTop: "0.25rem" }}>
        <a
          href={`https://www.youtube.com/watch?v=${vid}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "0.78rem", color: "#dc2626", textDecoration: "none" }}
        >
          Open on YouTube ↗
        </a>
      </div>
    </div>
  );
}

/* ─── Section Content ────────────────────────────────────────── */
function SectionBlock({ section, index }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div
      style={{
        background: "#fff", borderRadius: 12, marginBottom: "1rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1rem 1.25rem", background: "none", border: "none", cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span className="fw-semibold" style={{ fontSize: "0.97rem" }}>
          {index + 1}. {section.heading}
        </span>
        <span style={{ fontSize: "1.2rem", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }}>
          ▾
        </span>
      </button>
      {open && (
        <div style={{ padding: "0 1.25rem 1.25rem" }}>
          <pre
            style={{
              whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "0.9rem",
              lineHeight: 1.7, color: "#374151", margin: 0,
              borderTop: "1px solid #f3f4f6", paddingTop: "1rem",
            }}
          >
            {section.content}
          </pre>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function TrainingModules() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState(DEFAULT_TRAINING_MODULES);
  const [progress, setProgress] = useState({});
  const [marked, setMarked] = useState(false);

  const modIndex = modules.findIndex((m) => m.id === moduleId);
  const mod = modules[modIndex];

  useEffect(() => {
    const syncTrainingState = () => {
      const nextModules = getTrainingModules();
      const nextProgress = getModuleProgress();
      setModules(nextModules);
      setProgress(nextProgress);
      setMarked(!!nextProgress[moduleId]?.completed);
    };

    syncTrainingState();
    window.scrollTo({ top: 0, behavior: "auto" });
    const updateEvent = getTrainingUpdateEventName();
    window.addEventListener(updateEvent, syncTrainingState);
    return () => window.removeEventListener(updateEvent, syncTrainingState);
  }, [moduleId]);

  if (!mod) {
    return (
      <div className="container py-5 text-center">
        <h4>Module not found.</h4>
        <Link to="/leader-training" className="btn btn-outline-success mt-3">
          ← Back to Training
        </Link>
      </div>
    );
  }

  const nextMod = modules[modIndex + 1] || null;
  const prevMod = modules[modIndex - 1] || null;

  const handleMarkComplete = () => {
    markModuleComplete(moduleId);
    setMarked(true);
    setProgress((p) => ({ ...p, [moduleId]: { completed: true, completedAt: new Date().toISOString() } }));
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div
        style={{
          background: mod.color,
          color: "#fff",
          padding: "2rem 1.5rem 1.75rem",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Link
            to="/leader-training"
            style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "0.9rem" }}
          >
            ← Leader Training
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.75rem" }}>
            <span style={{ fontSize: "2.5rem" }}>{mod.icon}</span>
            <div>
              <h2 className="fw-bold mb-0" style={{ fontSize: "clamp(1.2rem, 3vw, 1.75rem)" }}>
                {mod.title}
              </h2>
              <div style={{ opacity: 0.85, fontSize: "0.9rem" }}>
                ⏱ {mod.estimatedTime}
                {mod.sections?.length > 0 && ` • ${mod.sections.length} sections`}
                {mod.videos?.length > 0 && ` • 🎥 ${mod.videos.length} video${mod.videos.length > 1 ? "s" : ""}`}
              </div>
            </div>
          </div>
          <p style={{ opacity: 0.88, marginTop: "0.75rem", marginBottom: 0, maxWidth: 600 }}>
            {mod.description}
          </p>
        </div>
      </div>

      <div className="container py-4" style={{ maxWidth: 800 }}>

        {/* ── Progress indicator ───────────────────────────── */}
        <div className="d-flex align-items-center gap-3 mb-4">
          {modules.map((m, i) => (
            <Link
              key={m.id}
              to={`/leader-training/module/${m.id}`}
              title={m.title}
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: progress[m.id]?.completed ? "#16a34a" : m.id === moduleId ? mod.color : "#e5e7eb",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.8rem", fontWeight: 700, textDecoration: "none",
                flexShrink: 0,
                outline: m.id === moduleId ? `3px solid ${mod.color}` : "none",
                outlineOffset: 2,
              }}
            >
              {progress[m.id]?.completed ? "✓" : i + 1}
            </Link>
          ))}
        </div>

        {/* ── Video section ───────────────────────────────── */}
        {mod.videos?.length > 0 && (
          <div className="mb-4">
            <h5 className="fw-bold mb-3">🎥 Training Videos</h5>
            {mod.videos.map((v, i) => (
              <VideoEmbed key={i} video={v} />
            ))}
          </div>
        )}

        {/* ── Content sections ────────────────────────────── */}
        {mod.sections?.length > 0 && (
          <div className="mb-4">
            <h5 className="fw-bold mb-3">📖 Module Content</h5>
            {mod.sections.map((section, i) => (
              <SectionBlock key={i} section={section} index={i} />
            ))}
          </div>
        )}

        {/* ── Mark Complete CTA ────────────────────────────── */}
        <div
          style={{
            background: marked ? "#f0fdf4" : "#fff",
            border: marked ? "2px solid #16a34a" : "2px solid #e5e7eb",
            borderRadius: 14, padding: "1.5rem",
            textAlign: "center", marginBottom: "2rem",
          }}
        >
          {marked ? (
            <>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✅</div>
              <div className="fw-bold text-success mb-1">Module Completed!</div>
              <div className="small text-muted">
                Completed on {new Date(progress[moduleId]?.completedAt).toLocaleDateString("en-IN")}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📋</div>
              <div className="fw-semibold mb-2">Finished reading this module?</div>
              <div className="small text-muted mb-3">
                Mark it as complete to track your progress.
              </div>
              <button
                className="btn btn-success px-4"
                onClick={handleMarkComplete}
                style={{ borderRadius: 8 }}
              >
                ✅ Mark Module as Complete
              </button>
            </>
          )}
        </div>

        {/* ── Navigation ──────────────────────────────────── */}
        <div className="d-flex justify-content-between gap-3" style={{ flexWrap: "wrap" }}>
          {prevMod ? (
            <Link
              to={`/leader-training/module/${prevMod.id}`}
              className="btn btn-outline-secondary"
              style={{ borderRadius: 8 }}
            >
              ← {prevMod.title}
            </Link>
          ) : (
            <Link
              to="/leader-training"
              className="btn btn-outline-secondary"
              style={{ borderRadius: 8 }}
            >
              ← Training Home
            </Link>
          )}

          {nextMod ? (
            <Link
              to={`/leader-training/module/${nextMod.id}`}
              className="btn btn-success"
              style={{ borderRadius: 8 }}
            >
              Next: {nextMod.title} →
            </Link>
          ) : (
            <Link
              to="/leader-training/test"
              className="btn btn-success"
              style={{ borderRadius: 8, background: "#14532d", borderColor: "#14532d" }}
            >
              🎓 Take Certification Test →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
