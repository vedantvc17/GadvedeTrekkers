import { useState } from "react";
import {
  queryFeedback, deleteFeedback,
  getFeedbackSettings, saveFeedbackSettings,
  getAllFeedback,
} from "../data/feedbackStorage";
import { getAllBookings } from "../data/bookingStorage";

const TREK_OPTIONS = [...new Set(getAllBookings().map((b) => b.trekName).filter(Boolean))];
const RATING_OPTIONS = [1, 2, 3, 4, 5];

const STAR_COLORS = { 5: "#f59e0b", 4: "#84cc16", 3: "#0891b2", 2: "#f97316", 1: "#ef4444" };

function Stars({ rating }) {
  return (
    <span style={{ color: STAR_COLORS[rating] || "#f59e0b", letterSpacing: 1 }}>
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

export default function ManageFeedback() {
  const [activeTab,    setActiveTab]    = useState("list");   // list | settings
  const [ratingFilter, setRatingFilter] = useState("");
  const [trekFilter,   setTrekFilter]   = useState("");
  const [fromDate,     setFromDate]     = useState("");
  const [toDate,       setToDate]       = useState("");
  const [tick,         setTick]         = useState(0);
  const [expanded,     setExpanded]     = useState(null);
  const refresh = () => setTick((t) => t + 1);

  /* ── Settings state ── */
  const [settings, setSettings] = useState(() => getFeedbackSettings());
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [newQuestion,   setNewQuestion]   = useState("");

  const feedback = queryFeedback({
    rating:   ratingFilter || undefined,
    trekName: trekFilter   || undefined,
    fromDate: fromDate     || undefined,
    toDate:   toDate       || undefined,
  });

  const allFb    = getAllFeedback();
  const avgRating = allFb.length ? (allFb.reduce((s, f) => s + f.rating, 0) / allFb.length).toFixed(1) : "—";
  const dist      = RATING_OPTIONS.map((r) => ({ r, count: allFb.filter((f) => f.rating === r).length }));

  const handleDelete = (id) => {
    if (window.confirm("Delete this feedback?")) { deleteFeedback(id); refresh(); }
  };

  const handleSaveSettings = () => {
    saveFeedbackSettings(settings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const addQuestion = () => {
    if (!newQuestion.trim()) return;
    setSettings((s) => ({ ...s, questions: [...s.questions, newQuestion.trim()] }));
    setNewQuestion("");
  };

  const removeQuestion = (i) => setSettings((s) => ({ ...s, questions: s.questions.filter((_, j) => j !== i) }));

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h3 className="adm-page-title">⭐ Feedback</h3>
        <div className="d-flex gap-2 align-items-center">
          <span className="adm-count-badge">{allFb.length} total · avg {avgRating} ★</span>
          <button className={`btn btn-sm ${activeTab === "list" ? "btn-success" : "btn-outline-secondary"}`} onClick={() => setActiveTab("list")}>List</button>
          <button className={`btn btn-sm ${activeTab === "settings" ? "btn-success" : "btn-outline-secondary"}`} onClick={() => setActiveTab("settings")}>⚙ Settings</button>
        </div>
      </div>

      {/* ══ LIST TAB ══ */}
      {activeTab === "list" && (
        <>
          {/* Rating distribution */}
          <div className="adm-fb-dist mb-4">
            {dist.reverse().map((d) => (
              <div key={d.r} className="adm-fb-dist-row">
                <span className="adm-fb-dist-label">{d.r} ★</span>
                <div className="adm-fb-dist-bar-wrap">
                  <div className="adm-fb-dist-bar" style={{ width: `${allFb.length ? (d.count / allFb.length) * 100 : 0}%`, background: STAR_COLORS[d.r] }} />
                </div>
                <span className="adm-fb-dist-count">{d.count}</span>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="adm-filter-bar mb-3">
            <select className="form-select form-select-sm" value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} style={{ flex: 1 }}>
              <option value="">All Ratings</option>
              {RATING_OPTIONS.map((r) => <option key={r} value={r}>{r} ★</option>)}
            </select>
            <select className="form-select form-select-sm" value={trekFilter} onChange={(e) => setTrekFilter(e.target.value)} style={{ flex: 2 }}>
              <option value="">All Treks</option>
              {TREK_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="date" className="form-control form-control-sm" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ flex: 1 }} title="From date" />
            <input type="date" className="form-control form-control-sm" value={toDate}   onChange={(e) => setToDate(e.target.value)}   style={{ flex: 1 }} title="To date" />
          </div>

          {/* Link to public form */}
          <div className="alert alert-light py-2 mb-3" style={{ fontSize: 12 }}>
            📎 Feedback form URL: <code>{window.location.origin}/feedback</code> · Pass params: <code>?name=…&trek=…&bookingId=…</code>
          </div>

          {feedback.length === 0 ? (
            <div className="adm-empty"><div className="adm-empty-icon">⭐</div><p className="adm-empty-text">No feedback yet. Share the feedback link with customers after their trek.</p></div>
          ) : (
            <div className="adm-table-wrap">
              <table className="table table-hover adm-table mb-0">
                <thead>
                  <tr><th>Customer</th><th>Trek</th><th>Rating</th><th>Comments</th><th>Date</th><th style={{ width: 90 }}>Actions</th></tr>
                </thead>
                <tbody>
                  {feedback.map((f) => (
                    <>
                      <tr key={f.id}>
                        <td>
                          <div style={{ fontSize: 13 }}>{f.customerName}</div>
                          {f.customerId && <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "monospace" }}>{f.customerId}</div>}
                        </td>
                        <td style={{ fontSize: 12 }}>{f.trekName}</td>
                        <td><Stars rating={f.rating} /></td>
                        <td style={{ fontSize: 12, maxWidth: 200 }} className="text-truncate">{f.comments || "—"}</td>
                        <td style={{ fontSize: 11, whiteSpace: "nowrap" }}>{new Date(f.submittedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <button className="btn btn-outline-primary btn-sm py-0 px-2" style={{ fontSize: 11 }} onClick={() => setExpanded(expanded === f.id ? null : f.id)}>
                              {expanded === f.id ? "Hide" : "View"}
                            </button>
                            <button className="btn btn-outline-danger btn-sm py-0 px-1" style={{ fontSize: 11 }} onClick={() => handleDelete(f.id)}>Del</button>
                          </div>
                        </td>
                      </tr>
                      {expanded === f.id && (
                        <tr key={`${f.id}-exp`}>
                          <td colSpan={6} className="p-0">
                            <div className="adm-booking-detail">
                              <div className="adm-detail-grid">
                                <div><span>Booking ID</span><strong style={{ fontFamily:"monospace",fontSize:11 }}>{f.bookingId || "—"}</strong></div>
                                <div><span>Rating</span><strong><Stars rating={f.rating} /></strong></div>
                              </div>
                              {f.comments && <p className="mt-2 mb-1" style={{ fontSize: 13 }}><strong>Comment:</strong> {f.comments}</p>}
                              {f.answers?.length > 0 && (
                                <div className="mt-2">
                                  <strong style={{ fontSize: 12 }}>Answers:</strong>
                                  <ul className="mb-0 mt-1" style={{ fontSize: 12 }}>
                                    {f.answers.map((a, i) => a && <li key={i}>{getFeedbackSettings().questions[i] || `Q${i+1}`}: <strong>{a}</strong></li>)}
                                  </ul>
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
        </>
      )}

      {/* ══ SETTINGS TAB ══ */}
      {activeTab === "settings" && (
        <div className="adm-fb-settings">
          {settingsSaved && <div className="alert alert-success py-2 mb-3" style={{ fontSize: 13 }}>✅ Settings saved successfully.</div>}

          {/* Enable / Disable */}
          <div className="adm-fb-setting-row">
            <div>
              <strong>Feedback System</strong>
              <p>Enable or disable the public feedback form.</p>
            </div>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="fbEnabled"
                checked={settings.enabled}
                onChange={() => setSettings((s) => ({ ...s, enabled: !s.enabled }))}
                style={{ width: 44, height: 22, cursor: "pointer" }}
              />
              <label className="form-check-label fw-semibold" htmlFor="fbEnabled">
                {settings.enabled ? <span className="text-success">Enabled</span> : <span className="text-danger">Disabled</span>}
              </label>
            </div>
          </div>

          {/* Google Review Link */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Google Review Link</label>
            <input className="form-control form-control-sm" value={settings.googleReviewLink}
              onChange={(e) => setSettings((s) => ({ ...s, googleReviewLink: e.target.value }))}
              placeholder="https://g.page/r/…/review"
            />
            <div className="form-text">Shown to customers with rating ≥ 4.</div>
          </div>

          {/* Email Template */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Feedback Request Email Template</label>
            <textarea className="form-control form-control-sm" rows={6}
              value={settings.emailTemplate}
              onChange={(e) => setSettings((s) => ({ ...s, emailTemplate: e.target.value }))}
            />
            <div className="form-text">Use <code>{"{name}"}</code> and <code>{"{trek}"}</code> as placeholders.</div>
          </div>

          {/* Questions */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Service Questions</label>
            {settings.questions.map((q, i) => (
              <div key={i} className="d-flex align-items-center gap-2 mb-2">
                <input className="form-control form-control-sm" value={q}
                  onChange={(e) => setSettings((s) => ({ ...s, questions: s.questions.map((v, j) => j === i ? e.target.value : v) }))}
                />
                <button className="btn btn-outline-danger btn-sm py-0 px-2" style={{ fontSize: 11, whiteSpace: "nowrap" }} onClick={() => removeQuestion(i)}>Remove</button>
              </div>
            ))}
            <div className="d-flex gap-2 mt-2">
              <input className="form-control form-control-sm" placeholder="Add new question…" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addQuestion())}
              />
              <button className="btn btn-outline-success btn-sm" onClick={addQuestion}>+ Add</button>
            </div>
          </div>

          <button className="btn btn-success px-4" onClick={handleSaveSettings}>💾 Save Settings</button>
        </div>
      )}
    </div>
  );
}
