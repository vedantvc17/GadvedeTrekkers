import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeeSession, clearEmployeeSession, getCredentialsByEmployeeId, updateEmployeePassword } from "../../data/employeePortalStorage";
import { getAllEmployees } from "../../data/employeeStorage";
import { getEmployeeIncentiveStats, getIncentivesByEmployee, INCENTIVE_AMOUNT_PER_BOOKING } from "../../data/incentiveStorage";

const BASE_URL = window.location.origin;

function fmt(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

/* ── Trek events from localStorage ── */
function getUpcomingTreks() {
  try {
    const treks = JSON.parse(localStorage.getItem("gt_treks")) || [];
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return treks.filter(t => t.active !== false).sort((a, b) => {
      const da = new Date(a.nextDate || "9999-12-31");
      const db = new Date(b.nextDate || "9999-12-31");
      return da - db;
    });
  } catch { return []; }
}

/* ── Count bookings for a trek ── */
function getTrekBookingCount(trekId, trekName) {
  try {
    const bookings = JSON.parse(localStorage.getItem("gt_bookings")) || [];
    return bookings.filter(b =>
      b.status !== "CANCELLED" && (b.trekId === trekId || b.trekName === trekName)
    ).length;
  } catch { return 0; }
}

/* ── Feedback/ratings for employee ── */
function getEmployeeRatings(employeeName) {
  try {
    const feedback = JSON.parse(localStorage.getItem("gt_feedback")) || [];
    return feedback.filter(f => f.trekLeader === employeeName || f.guideName === employeeName);
  } catch { return []; }
}

/* ── Trek events assigned to this leader (from trek payment records) ── */
function getLeaderTrekEvents(empName) {
  try {
    const payments = JSON.parse(localStorage.getItem("gt_trek_payments")) || [];
    return payments.filter(p => p.config?.trekLeaderName === empName);
  } catch { return []; }
}

/* ── Participants for a trek event (by trekName + eventDate) ── */
function getTrekParticipants(trekName, eventDate) {
  try {
    const bookings = JSON.parse(localStorage.getItem("gt_bookings")) || [];
    return bookings.filter(b =>
      b.status !== "CANCELLED" &&
      (b.trekName === trekName || b.trekName?.toLowerCase() === trekName?.toLowerCase())
    );
  } catch { return []; }
}

/* ── Save partial payment collection by leader ── */
function savePartialCollection({ bookingId, amount, collectedBy }) {
  try {
    const KEY = "gt_bookings";
    const bookings = JSON.parse(localStorage.getItem(KEY)) || [];
    const updated = bookings.map(b => {
      if (b.bookingId !== bookingId) return b;
      const prevCollected = Number(b.leaderCollected || 0);
      const newCollected  = prevCollected + Number(amount);
      const totalPaid     = Number(b.pricePaid || 0) + Number(amount);
      const totalPrice    = Number(b.totalPrice || b.price || 0);
      return {
        ...b,
        leaderCollected: newCollected,
        pricePaid: totalPaid,
        paymentStatus: totalPaid >= totalPrice ? "PAID" : "PARTIAL",
        lastCollectedBy: collectedBy,
        lastCollectedAt: new Date().toISOString(),
      };
    });
    localStorage.setItem(KEY, JSON.stringify(updated));
    return true;
  } catch { return false; }
}

/* ══════════════════════════════════════════════
   EmployeePortal — main component
══════════════════════════════════════════════ */
export default function EmployeePortal() {
  const navigate = useNavigate();
  const session  = getEmployeeSession();

  useEffect(() => {
    if (!session) navigate("/employee-login");
  }, []);

  if (!session) return null;

  const [tab, setTab] = useState("dashboard");
  const [copied, setCopied]     = useState(false);
  const [pwForm, setPwForm]     = useState({ current: "", new1: "", new2: "" });
  const [pwMsg,  setPwMsg]      = useState("");
  const [collectAmts,  setCollectAmts]  = useState({}); // { bookingId: amount }
  const [collectMsg,   setCollectMsg]   = useState({});  // { bookingId: msg }
  const [expandedEvent, setExpandedEvent] = useState(null); // paymentId
  const [showPastTreks, setShowPastTreks] = useState(false);
  const [tick, setTick] = useState(0);

  const emp      = useMemo(() => getAllEmployees().find(e => e.employeeId === session.employeeId), [tick]);
  const cred     = useMemo(() => getCredentialsByEmployeeId(session.employeeId), []);
  const incentives = useMemo(() => getIncentivesByEmployee(session.employeeId), [tick]);
  const incStats   = useMemo(() => getEmployeeIncentiveStats(session.employeeId), [tick]);
  const ratings    = useMemo(() => getEmployeeRatings(session.fullName), [tick]);
  const treks      = useMemo(() => getUpcomingTreks(), [tick]);
  const myTrekEvents = useMemo(() => getLeaderTrekEvents(session.fullName), [tick]);

  const referralCode = cred?.referralCode || session.referralCode || "";
  const referralLink = `${BASE_URL}/book?ref=${referralCode}`;

  const avgRating = ratings.length
    ? (ratings.reduce((s, r) => s + Number(r.rating || 0), 0) / ratings.length).toFixed(1)
    : null;

  const logout = () => { clearEmployeeSession(); navigate("/employee-login"); };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!pwForm.current || !pwForm.new1) { setPwMsg("Fill all fields."); return; }
    if (pwForm.new1 !== pwForm.new2)    { setPwMsg("Passwords don't match."); return; }
    if (cred?.password !== pwForm.current) { setPwMsg("Current password is incorrect."); return; }
    updateEmployeePassword(session.employeeId, pwForm.new1);
    setPwMsg("Password updated successfully!");
    setPwForm({ current: "", new1: "", new2: "" });
  };

  const handleCollect = (bookingId) => {
    const amt = Number(collectAmts[bookingId] || 0);
    if (!amt || amt <= 0) { setCollectMsg(p => ({ ...p, [bookingId]: "Enter a valid amount." })); return; }
    const ok = savePartialCollection({ bookingId, amount: amt, collectedBy: session.fullName });
    if (ok) {
      setCollectMsg(p => ({ ...p, [bookingId]: `✅ ₹${amt.toLocaleString("en-IN")} collected!` }));
      setCollectAmts(p => ({ ...p, [bookingId]: "" }));
      setTick(t => t + 1);
      setTimeout(() => setCollectMsg(p => { const n = { ...p }; delete n[bookingId]; return n; }), 3000);
    }
  };

  const TABS = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "mytreks",   icon: "🏔",  label: "My Treks", badge: myTrekEvents.length || null },
    { id: "treks",     icon: "🥾", label: "Trek Events" },
    { id: "share",     icon: "🔗", label: "Share & Earn" },
    { id: "earnings",  icon: "💵", label: "My Earnings" },
    { id: "ratings",   icon: "⭐", label: "My Ratings" },
    { id: "profile",   icon: "👤", label: "My Profile" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
      {/* ── Top Bar ── */}
      <div style={{
        background: "linear-gradient(90deg, #0f172a, #134e4a)",
        color: "#fff", padding: "12px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>🏔</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>Gadvede Trekkers</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Employee Portal</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {emp?.profilePhoto && (
            <img src={emp.profilePhoto} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid #22c55e" }} />
          )}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{session.fullName}</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{emp?.role || "Employee"}</div>
          </div>
          <button onClick={logout} style={{ background: "transparent", border: "1px solid #334155", color: "#94a3b8", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </div>

      {/* ── Tab nav ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 24px", display: "flex", gap: 0, overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            border: "none", borderBottom: `3px solid ${tab === t.id ? "#22c55e" : "transparent"}`,
            background: "none", padding: "12px 16px", fontSize: 13, fontWeight: tab === t.id ? 700 : 400,
            color: tab === t.id ? "#16a34a" : "#64748b", cursor: "pointer", whiteSpace: "nowrap",
            position: "relative",
          }}>
            {t.icon} {t.label}
            {t.badge ? <span style={{ background: "#ef4444", color: "#fff", borderRadius: 10, fontSize: 9, padding: "1px 5px", marginLeft: 4, fontWeight: 700 }}>{t.badge}</span> : null}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>

        {/* ══ DASHBOARD ══ */}
        {tab === "dashboard" && (
          <div>
            <h5 style={{ fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>
              👋 Welcome back, {session.fullName.split(" ")[0]}!
            </h5>

            {/* KPI cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
              {[
                { icon: "🔗", label: "Referral Bookings", value: incStats.count, color: "#0284c7" },
                { icon: "💵", label: "Total Earned", value: fmt(incStats.totalEarned), color: "#16a34a" },
                { icon: "⏳", label: "Pending Payout", value: fmt(incStats.pending), color: "#d97706" },
                { icon: "✅", label: "Paid Out", value: fmt(incStats.paid), color: "#7c3aed" },
                { icon: "⭐", label: "Avg Rating", value: avgRating ? `${avgRating}/5` : "No ratings", color: "#ea580c" },
                { icon: "🥾", label: "Upcoming Treks", value: treks.length, color: "#0f172a" },
              ].map(kpi => (
                <div key={kpi.label} style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{kpi.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Referral link quick share */}
            <div style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)", border: "1px solid #6ee7b7", borderRadius: 12, padding: 20, marginBottom: 20 }}>
              <div style={{ fontWeight: 700, color: "#065f46", marginBottom: 8 }}>🔗 Your Referral Link</div>
              <div style={{ fontSize: 12, color: "#047857", marginBottom: 10 }}>
                Share this link — earn <strong>₹{INCENTIVE_AMOUNT_PER_BOOKING}</strong> for every booking made through it!
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input readOnly value={referralLink} className="form-control form-control-sm"
                  style={{ flex: 1, minWidth: 200, fontFamily: "monospace", fontSize: 11, background: "#fff" }} />
                <button className="btn btn-success btn-sm" onClick={copyLink} style={{ whiteSpace: "nowrap" }}>
                  {copied ? "✅ Copied!" : "📋 Copy Link"}
                </button>
              </div>
            </div>

            {/* Latest incentives */}
            {incentives.length > 0 && (
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>💵 Recent Referral Bookings</div>
                {incentives.slice(0, 5).map(inc => (
                  <div key={inc.incentiveId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{inc.trekName}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{inc.customerName} · {new Date(inc.createdAt).toLocaleDateString("en-IN")}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, color: "#16a34a" }}>+{fmt(inc.amount)}</div>
                      <span className={`badge ${inc.status === "PAID" ? "bg-success" : "bg-warning text-dark"}`} style={{ fontSize: 9 }}>
                        {inc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ MY TREKS (ASSIGNED) ══ */}
        {tab === "mytreks" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <div>
                <h5 style={{ fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>🏔 My Assigned Treks</h5>
                <p style={{ fontSize: 13, color: "#64748b", marginBottom: 0 }}>View participants, collect payments, and access group links.</p>
              </div>
              {/* Upcoming / Past toggle */}
              <div style={{ display: "flex", gap: 0, border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
                <button onClick={() => setShowPastTreks(false)} style={{ border: "none", padding: "6px 16px", fontSize: 12, fontWeight: !showPastTreks ? 700 : 400, background: !showPastTreks ? "#0f172a" : "#fff", color: !showPastTreks ? "#fff" : "#64748b", cursor: "pointer" }}>
                  🚀 Upcoming ({myTrekEvents.filter(e => !e.eventDate || new Date(e.eventDate) >= new Date()).length})
                </button>
                <button onClick={() => setShowPastTreks(true)} style={{ border: "none", padding: "6px 16px", fontSize: 12, fontWeight: showPastTreks ? 700 : 400, background: showPastTreks ? "#0f172a" : "#fff", color: showPastTreks ? "#fff" : "#64748b", cursor: "pointer" }}>
                  🕒 Past ({myTrekEvents.filter(e => e.eventDate && new Date(e.eventDate) < new Date()).length})
                </button>
              </div>
            </div>

            {(() => {
              const today = new Date(); today.setHours(0,0,0,0);
              const filteredEvents = myTrekEvents.filter(e => {
                const d = e.eventDate ? new Date(e.eventDate) : null;
                return showPastTreks ? (d && d < today) : (!d || d >= today);
              });
              if (filteredEvents.length === 0) return (
                <div style={{ textAlign: "center", padding: 48, color: "#94a3b8", background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                  {showPastTreks ? "No past treks found." : "No upcoming treks assigned to you yet."}
                </div>
              );
              return filteredEvents
                .sort((a, b) => showPastTreks
                  ? new Date(b.eventDate) - new Date(a.eventDate)
                  : new Date(a.eventDate || "9999") - new Date(b.eventDate || "9999")
                )
                .map(evt => {
              const participants = getTrekParticipants(evt.trekName, evt.eventDate);
              const pending = participants.filter(p => p.paymentStatus === "PARTIAL" || p.paymentStatus === "PENDING" || !p.paymentStatus);
              const paid    = participants.filter(p => p.paymentStatus === "PAID");
              const isOpen  = expandedEvent === evt.paymentId;
              const waLink  = evt.config?.whatsappGroupLink;
              const daysTo  = evt.eventDate ? Math.round((new Date(evt.eventDate) - new Date()) / 86400000) : null;

              return (
                <div key={evt.paymentId} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, marginBottom: 16, overflow: "hidden" }}>
                  {/* Event header */}
                  <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", background: "#f8fafc", borderBottom: isOpen ? "1px solid #e2e8f0" : "none" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>{evt.trekName}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                        📅 {evt.eventDate}
                        {daysTo !== null && (
                          <span style={{ marginLeft: 6, color: daysTo < 0 ? "#dc2626" : daysTo <= 3 ? "#d97706" : "#16a34a", fontWeight: 600 }}>
                            ({daysTo < 0 ? `${Math.abs(daysTo)}d ago` : daysTo === 0 ? "Today!" : `in ${daysTo}d`})
                          </span>
                        )}
                        &nbsp;·&nbsp; 👥 {participants.length} registered
                        &nbsp;·&nbsp; <span style={{ color: "#16a34a" }}>✅ {paid.length} paid</span>
                        &nbsp;·&nbsp; <span style={{ color: "#d97706" }}>⏳ {pending.length} pending</span>
                      </div>
                      {/* WhatsApp group link */}
                      {waLink && (
                        <a href={waLink} target="_blank" rel="noopener noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 6, background: "#dcfce7", color: "#15803d", padding: "4px 10px", borderRadius: 99, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                          📱 Join WhatsApp Group
                        </a>
                      )}
                    </div>
                    <button className="btn btn-outline-primary btn-sm" style={{ fontSize: 12 }}
                      onClick={() => setExpandedEvent(isOpen ? null : evt.paymentId)}>
                      {isOpen ? "Hide Participants" : "View Participants"}
                    </button>
                  </div>

                  {/* Participant list */}
                  {isOpen && (
                    <div style={{ padding: "0 0 8px" }}>
                      {participants.length === 0 ? (
                        <div style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No bookings found for this trek.</div>
                      ) : (
                        <div style={{ overflowX: "auto" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead style={{ background: "#f1f5f9" }}>
                              <tr>
                                {["#", "Name", "Contact", "WhatsApp", "Pickup", "Payment", "Paid", "Balance", "Collect", "Emergency Contact"].map(h => (
                                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#475569", whiteSpace: "nowrap", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {participants.map((p, i) => {
                                const totalPrice = Number(p.totalPrice || p.price || 0);
                                const pricePaid  = Number(p.pricePaid || 0);
                                const balance    = Math.max(0, totalPrice - pricePaid);
                                const isPending  = balance > 0;
                                const msg        = collectMsg[p.bookingId];

                                return (
                                  <tr key={p.bookingId || i} style={{ borderBottom: "1px solid #f1f5f9", background: isPending ? "#fffbeb" : "#fff" }}>
                                    <td style={{ padding: "10px 12px", color: "#94a3b8" }}>{i + 1}</td>
                                    <td style={{ padding: "10px 12px" }}>
                                      <div style={{ fontWeight: 600 }}>{p.firstName} {p.lastName}</div>
                                      <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>{p.bookingId || p.enhancedBookingId}</div>
                                    </td>
                                    <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                                      <a href={`tel:${p.contactNumber || p.phone}`} style={{ color: "#0284c7" }}>📱 {p.contactNumber || p.phone || "—"}</a>
                                    </td>
                                    <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                                      {p.whatsappNumber
                                        ? <a href={`https://wa.me/91${p.whatsappNumber}`} target="_blank" rel="noopener noreferrer" style={{ color: "#25D366", fontSize: 12 }}>💬 {p.whatsappNumber}</a>
                                        : <span style={{ color: "#94a3b8" }}>—</span>}
                                    </td>
                                    <td style={{ padding: "10px 12px", fontSize: 12 }}>{p.pickupLocation || p.departureOrigin || "—"}</td>
                                    <td style={{ padding: "10px 12px" }}>
                                      <span className={`badge ${p.paymentStatus === "PAID" ? "bg-success" : p.paymentStatus === "PARTIAL" ? "bg-warning text-dark" : "bg-secondary"}`} style={{ fontSize: 10 }}>
                                        {p.paymentStatus || "PENDING"}
                                      </span>
                                    </td>
                                    <td style={{ padding: "10px 12px", fontWeight: 600, color: "#16a34a" }}>{pricePaid > 0 ? fmt(pricePaid) : "—"}</td>
                                    <td style={{ padding: "10px 12px", fontWeight: 700, color: balance > 0 ? "#dc2626" : "#16a34a" }}>
                                      {balance > 0 ? fmt(balance) : "✅ Paid"}
                                    </td>
                                    <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                                      {isPending ? (
                                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                          <input type="number" min="1" max={balance}
                                            className="form-control form-control-sm"
                                            style={{ width: 90 }}
                                            placeholder={`Max ${balance}`}
                                            value={collectAmts[p.bookingId] || ""}
                                            onChange={e => setCollectAmts(prev => ({ ...prev, [p.bookingId]: e.target.value }))}
                                          />
                                          <button className="btn btn-success btn-sm py-0 px-2" style={{ fontSize: 11 }}
                                            onClick={() => handleCollect(p.bookingId)}>
                                            Collect
                                          </button>
                                        </div>
                                      ) : <span style={{ fontSize: 12, color: "#16a34a" }}>—</span>}
                                      {msg && <div style={{ fontSize: 10, color: msg.includes("✅") ? "#16a34a" : "#dc2626", marginTop: 2 }}>{msg}</div>}
                                    </td>
                                    <td style={{ padding: "10px 12px", fontSize: 12 }}>
                                      {p.emergencyContact
                                        ? <div>
                                            <div style={{ fontWeight: 600 }}>{p.emergencyContact.name || p.emergencyContactName}</div>
                                            <a href={`tel:${p.emergencyContact.phone || p.emergencyContactPhone || p.emergencyContact}`}
                                               style={{ color: "#dc2626" }}>
                                              🚨 {p.emergencyContact.phone || p.emergencyContactPhone || p.emergencyContact}
                                            </a>
                                          </div>
                                        : <span style={{ color: "#94a3b8" }}>—</span>}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            }); // closes filteredEvents.map
            })()}  {/* closes IIFE */}
          </div>
        )}

        {/* ══ TREK EVENTS ══ */}
        {tab === "treks" && (
          <div>
            <h5 style={{ fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>🥾 Upcoming Trek Events</h5>
            {treks.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>No upcoming treks found.</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {treks.map(trek => {
                  const count = getTrekBookingCount(trek.id, trek.name);
                  const trekRefLink = `${BASE_URL}/book?trekId=${trek.id || ""}&trekName=${encodeURIComponent(trek.name)}&ref=${referralCode}`;
                  return (
                    <div key={trek.id || trek.name} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                      {trek.image && (
                        <img src={trek.image} alt={trek.name} style={{ width: "100%", height: 140, objectFit: "cover" }} />
                      )}
                      <div style={{ padding: 14 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{trek.name}</div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{trek.location} · {trek.difficulty}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                          <div>
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>Next Date</div>
                            <div style={{ fontWeight: 600, fontSize: 13, color: "#0284c7" }}>{trek.nextDate || "TBD"}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>Registrations</div>
                            <div style={{ fontWeight: 800, fontSize: 18, color: count > 0 ? "#16a34a" : "#94a3b8" }}>{count}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#16a34a", marginTop: 6 }}>
                          {trek.price ? `₹${Number(trek.price).toLocaleString("en-IN")}` : ""}
                          {trek.originalPrice && <span style={{ fontSize: 11, color: "#94a3b8", textDecoration: "line-through", marginLeft: 6 }}>₹{Number(trek.originalPrice).toLocaleString("en-IN")}</span>}
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                          <button className="btn btn-outline-success btn-sm" style={{ flex: 1, fontSize: 11 }}
                            onClick={() => { navigator.clipboard.writeText(trekRefLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                            🔗 Copy My Link
                          </button>
                          <a href={`/treks/${trek.id}`} target="_blank" rel="noopener noreferrer"
                            className="btn btn-outline-secondary btn-sm" style={{ flex: 1, fontSize: 11, textDecoration: "none" }}>
                            View Page
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══ SHARE & EARN ══ */}
        {tab === "share" && (
          <div>
            <h5 style={{ fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>🔗 Share & Earn</h5>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>
              Share your unique booking link. Every time someone books through your link, you earn <strong style={{ color: "#16a34a" }}>₹{INCENTIVE_AMOUNT_PER_BOOKING}</strong>!
            </p>

            {/* Main referral card */}
            <div style={{ background: "linear-gradient(135deg, #065f46, #0f766e)", borderRadius: 16, padding: 28, color: "#fff", marginBottom: 24 }}>
              <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Your Referral Code</div>
              <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 4, marginBottom: 16 }}>{referralCode}</div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", fontFamily: "monospace", fontSize: 12, marginBottom: 16, wordBreak: "break-all" }}>
                {referralLink}
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button onClick={copyLink} style={{ background: "#22c55e", border: "none", color: "#fff", borderRadius: 8, padding: "8px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  {copied ? "✅ Copied!" : "📋 Copy Link"}
                </button>
                <a href={`whatsapp://send?text=Book%20your%20trek%20with%20Gadvede%20Trekkers!%20${encodeURIComponent(referralLink)}`}
                  style={{ background: "#25D366", border: "none", color: "#fff", borderRadius: 8, padding: "8px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", textDecoration: "none" }}>
                  📱 Share on WhatsApp
                </a>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Total Bookings via Link", value: incStats.count, icon: "🔗", color: "#0284c7" },
                { label: "Total Earned", value: fmt(incStats.totalEarned), icon: "💵", color: "#16a34a" },
                { label: "Pending Payout", value: fmt(incStats.pending), icon: "⏳", color: "#d97706" },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 28 }}>{s.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>📖 How it works</div>
              {[
                ["1️⃣", "Copy your referral link above"],
                ["2️⃣", "Share it with friends, family or on social media"],
                ["3️⃣", "When someone books a trek using your link, it's tracked automatically"],
                ["4️⃣", `You earn ₹${INCENTIVE_AMOUNT_PER_BOOKING} for each confirmed booking`],
                ["5️⃣", "Your earnings are paid out by the admin — check My Earnings tab"],
              ].map(([step, text]) => (
                <div key={step} style={{ display: "flex", gap: 12, marginBottom: 10, fontSize: 13, color: "#374151" }}>
                  <span style={{ fontSize: 18 }}>{step}</span> {text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ MY EARNINGS ══ */}
        {tab === "earnings" && (
          <div>
            <h5 style={{ fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>💵 My Earnings</h5>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
              Your referral incentive history. Payouts are processed by the admin.
            </p>

            {/* Summary row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Total Earned",   value: fmt(incStats.totalEarned), color: "#0f172a" },
                { label: "Paid Out",       value: fmt(incStats.paid),        color: "#16a34a" },
                { label: "Pending",        value: fmt(incStats.pending),     color: "#d97706" },
                { label: "Bookings",       value: incStats.count,            color: "#0284c7" },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 16px" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {incentives.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "#94a3b8", background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                No referral bookings yet. Share your link to start earning!
              </div>
            ) : (
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead style={{ background: "#f8fafc" }}>
                    <tr>
                      {["Trek", "Customer", "Date", "Amount", "Status"].map(h => (
                        <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, fontSize: 11, color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {incentives.map(inc => (
                      <tr key={inc.incentiveId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "10px 14px", fontWeight: 600 }}>{inc.trekName}</td>
                        <td style={{ padding: "10px 14px", color: "#475569" }}>{inc.customerName}</td>
                        <td style={{ padding: "10px 14px", color: "#64748b", fontSize: 12 }}>{new Date(inc.createdAt).toLocaleDateString("en-IN")}</td>
                        <td style={{ padding: "10px 14px", fontWeight: 700, color: "#16a34a" }}>+{fmt(inc.amount)}</td>
                        <td style={{ padding: "10px 14px" }}>
                          <span className={`badge ${inc.status === "PAID" ? "bg-success" : "bg-warning text-dark"}`} style={{ fontSize: 10 }}>
                            {inc.status}
                          </span>
                          {inc.status === "PAID" && inc.paidAt && (
                            <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
                              Paid {new Date(inc.paidAt).toLocaleDateString("en-IN")} via {inc.paidVia}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══ MY RATINGS ══ */}
        {tab === "ratings" && (
          <div>
            <h5 style={{ fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>⭐ Customer Ratings</h5>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Feedback received from customers after treks.</p>

            {/* Avg rating */}
            {ratings.length > 0 && (
              <div style={{ background: "linear-gradient(135deg, #fefce8, #fef9c3)", border: "1px solid #fde68a", borderRadius: 12, padding: 20, marginBottom: 20, textAlign: "center" }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: "#92400e" }}>{avgRating}</div>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{"⭐".repeat(Math.round(Number(avgRating)))}</div>
                <div style={{ fontSize: 13, color: "#78716c" }}>Based on {ratings.length} review{ratings.length > 1 ? "s" : ""}</div>
              </div>
            )}

            {ratings.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "#94a3b8", background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                No ratings received yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {ratings.map((r, i) => (
                  <div key={i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{r.customerName || "Customer"}</div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>{r.trekName} · {r.date ? new Date(r.date).toLocaleDateString("en-IN") : ""}</div>
                      </div>
                      <div style={{ fontSize: 18 }}>{"⭐".repeat(Number(r.rating || 0))}</div>
                    </div>
                    {r.comment && <p style={{ fontSize: 13, color: "#374151", margin: 0, fontStyle: "italic" }}>"{r.comment}"</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ MY PROFILE ══ */}
        {tab === "profile" && (
          <div>
            <h5 style={{ fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>👤 My Profile</h5>

            {emp ? (
              <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24, flexWrap: "wrap" }}>
                {/* Photo + basics */}
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, textAlign: "center" }}>
                  <div style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", margin: "0 auto 12px", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
                    {emp.profilePhoto ? <img src={emp.profilePhoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "👤"}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{emp.fullName}</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>{emp.role}</div>
                  <div style={{ marginTop: 8 }}>
                    <span className={`badge ${emp.status === "active" ? "bg-success" : "bg-secondary"}`}>{emp.status || "active"}</span>
                  </div>
                  {emp.experience?.years && (
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>{emp.experience.years} years experience</div>
                  )}
                </div>

                <div>
                  {/* Details */}
                  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: "#374151" }}>Contact & Info</div>
                    {[
                      ["📱 Phone",   emp.contactNumber],
                      ["✉️ Email",   emp.email],
                      ["📍 Address", emp.address],
                      ["🎯 Expertise", emp.expertise],
                    ].filter(([, v]) => v).map(([label, val]) => (
                      <div key={label} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13 }}>
                        <span style={{ color: "#64748b", minWidth: 100 }}>{label}</span>
                        <span style={{ color: "#0f172a" }}>{val}</span>
                      </div>
                    ))}
                    {emp.linkedin && <a href={emp.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#0284c7" }}>🔗 LinkedIn</a>}
                    {emp.instagram && <a href={emp.instagram} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#e1306c", marginLeft: 12 }}>📸 Instagram</a>}
                  </div>

                  {/* Skills */}
                  {emp.skills?.length > 0 && (
                    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: "#374151" }}>🎯 Skills</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {emp.skills.map(s => (
                          <span key={s} style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20, padding: "2px 10px", fontSize: 12, color: "#166534" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {emp.certifications?.length > 0 && (
                    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: "#374151" }}>🏅 Certifications</div>
                      {emp.certifications.map((c, i) => (
                        <div key={i} style={{ fontSize: 13, marginBottom: 4 }}>
                          <strong>{c.name}</strong>{c.details ? ` — ${c.details}` : ""}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pay */}
                  {emp.payPerTrek && (
                    <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: 14, marginBottom: 16 }}>
                      <div style={{ fontSize: 13, color: "#166534" }}>💵 Pay per Trek</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#16a34a" }}>₹{Number(emp.payPerTrek).toLocaleString("en-IN")}</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ color: "#94a3b8", textAlign: "center", padding: 40 }}>Profile not found.</div>
            )}

            {/* Change password */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, marginTop: 20 }}>
              <div style={{ fontWeight: 700, marginBottom: 16 }}>🔑 Change Password</div>
              <form onSubmit={handleChangePassword}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Current Password</label>
                    <input type="password" className="form-control form-control-sm" value={pwForm.current}
                      onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>New Password</label>
                    <input type="password" className="form-control form-control-sm" value={pwForm.new1}
                      onChange={e => setPwForm(p => ({ ...p, new1: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Confirm New Password</label>
                    <input type="password" className="form-control form-control-sm" value={pwForm.new2}
                      onChange={e => setPwForm(p => ({ ...p, new2: e.target.value }))} />
                  </div>
                </div>
                <button type="submit" className="btn btn-success btn-sm">Update Password</button>
                {pwMsg && <span style={{ marginLeft: 12, fontSize: 12, color: pwMsg.includes("success") ? "#16a34a" : "#dc2626" }}>{pwMsg}</span>}
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
