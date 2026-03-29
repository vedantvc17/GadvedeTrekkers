import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { submitListingSubmission } from "../data/listingSubmissionStorage";

const EVENT_TYPES = [
  "Trekking Event", "Nature Festival", "Adventure Race", "Photography Walk",
  "Yoga / Wellness Retreat", "Cultural Event", "Charity Trek",
  "Camping Event", "Corporate Outing", "Other",
];

const EMPTY_PICKUP = { city: "", location: "", time: "", mapUrl: "" };

const STEPS = [
  { num: 1, label: "Event Basics",   icon: "📅" },
  { num: 2, label: "Organizer",      icon: "👤" },
  { num: 3, label: "Pickup & Extra", icon: "📍" },
];

/* ── Step progress bar ── */
function StepBar({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 28, gap: 0 }}>
      {STEPS.map((s, i) => (
        <div key={s.num} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 72 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: current >= s.num ? "#198754" : "#e2e8f0",
              color: current >= s.num ? "#fff" : "#94a3b8",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 16, transition: "all 0.2s",
            }}>
              {current > s.num ? "✓" : s.icon}
            </div>
            <div style={{
              fontSize: 11, marginTop: 4, fontWeight: 600, textAlign: "center",
              color: current >= s.num ? "#166534" : "#94a3b8",
            }}>
              {s.label}
            </div>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              flex: 1, height: 3, background: current > s.num ? "#198754" : "#e2e8f0",
              margin: "0 4px", marginBottom: 20, transition: "background 0.2s",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Helper text component ── */
function Help({ children }) {
  return <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, lineHeight: 1.5 }}>{children}</div>;
}

/* ── Example tag ── */
function Example({ children }) {
  return (
    <span style={{
      background: "#f0fdf4", border: "1px solid #bbf7d0",
      borderRadius: 4, padding: "1px 6px", fontSize: 11,
      color: "#166534", fontFamily: "monospace",
    }}>
      e.g. {children}
    </span>
  );
}

export default function AddEventPage() {
  const navigate = useNavigate();
  const toast    = useToast();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    eventName: "", eventType: EVENT_TYPES[0], eventDate: "",
    location: "", entryFee: "", expectedAttendees: "",
    description: "", status: "APPROVED",
    organizerName: "", phone: "", email: "",
  });
  const [pickupPoints, setPickupPoints] = useState([{ ...EMPTY_PICKUP }]);
  const [showPickups, setShowPickups] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const addPickup = () => setPickupPoints((p) => [...p, { ...EMPTY_PICKUP }]);
  const removePickup = (i) => setPickupPoints((p) => p.filter((_, idx) => idx !== i));
  const updatePickup = (i, field, val) =>
    setPickupPoints((p) => p.map((pt, idx) => (idx === i ? { ...pt, [field]: val } : pt)));

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.eventName.trim()) e.eventName = "Please enter the event name";
      if (!form.location.trim()) e.location = "Please enter the event location";
    }
    if (s === 2) {
      if (!form.organizerName.trim()) e.organizerName = "Please enter organizer name";
      if (!form.phone.trim()) e.phone = "Please enter a phone number";
    }
    return e;
  };

  const next = () => {
    const e = validateStep(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep((s) => s + 1);
  };

  const back = () => { setErrors({}); setStep((s) => s - 1); };

  const handleSave = () => {
    const e = validateStep(step);
    if (Object.keys(e).length) { setErrors(e); return; }

    const filled = pickupPoints.filter((p) => p.city.trim() || p.location.trim());
    submitListingSubmission("event", {
      id: `EVT-${Date.now()}`,
      ...form,
      pickupPoints: filled,
      submittedAt: new Date().toISOString(),
      createdByAdmin: true,
    });
    toast.success(`Event "${form.eventName}" saved successfully!`);
    navigate("/admin/events");
  };

  const card = (children) => (
    <div style={{
      background: "#fff", border: "1px solid #e2e8f0",
      borderRadius: 14, padding: "28px", marginBottom: 20,
    }}>
      {children}
    </div>
  );

  return (
    <div className="adm-page">
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm mb-3"
          onClick={() => navigate("/admin/events")}
        >
          ← Back to Events
        </button>
        <h1 className="adm-page-title">📅 Add New Event</h1>
        <div style={{ fontSize: 13, color: "#64748b" }}>
          Fill in 3 simple steps — takes about 2 minutes
        </div>
      </div>

      <div style={{ maxWidth: 680 }}>

        {/* Step progress */}
        <StepBar current={step} />

        {/* ══ STEP 1: Event Basics ══ */}
        {step === 1 && card(
          <>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#0c3a1e", marginBottom: 4 }}>
              📅 Step 1 — What is your event?
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
              Tell us the basics: what the event is called, what type it is, when it happens, and where.
            </div>

            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-semibold">
                  Event Name <span className="text-danger">*</span>
                </label>
                <input
                  className={`form-control ${errors.eventName ? "is-invalid" : ""}`}
                  placeholder="Give your event a clear name"
                  value={form.eventName}
                  onChange={set("eventName")}
                  autoFocus
                />
                {errors.eventName
                  ? <div className="invalid-feedback">{errors.eventName}</div>
                  : <Help><Example>Bhimashankar Sunrise Trek — March 2026</Example></Help>
                }
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Event Type</label>
                <select className="form-select" value={form.eventType} onChange={set("eventType")}>
                  {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <Help>Choose the category that best describes your event</Help>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Event Date</label>
                <input type="date" className="form-control" value={form.eventDate} onChange={set("eventDate")} />
                <Help>The date participants should arrive or the event begins</Help>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">
                  Location <span className="text-danger">*</span>
                </label>
                <input
                  className={`form-control ${errors.location ? "is-invalid" : ""}`}
                  placeholder="Village / Town, District, State"
                  value={form.location}
                  onChange={set("location")}
                />
                {errors.location
                  ? <div className="invalid-feedback">{errors.location}</div>
                  : <Help><Example>Bhimashankar, Pune District, Maharashtra</Example></Help>
                }
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Entry Fee (₹)</label>
                <input type="number" min="0" className="form-control" placeholder="0 if free" value={form.entryFee} onChange={set("entryFee")} />
                <Help>Per person. Leave 0 for free events.</Help>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Status</label>
                <select className="form-select" value={form.status} onChange={set("status")}>
                  <option value="APPROVED">Approved — visible to admin only</option>
                  <option value="LIVE">Live — visible to customers</option>
                  <option value="PENDING">Pending Review</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Event Description</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder={`Write a short description. Example:\n"Bhimashankar Sunrise Trek is a 1-day trek in Pune district. Perfect for beginners. Includes breakfast. Carry trekking shoes, water bottle, and light snacks."`}
                  value={form.description}
                  onChange={set("description")}
                />
                <Help>Keep it simple. What is the event? Who can join? What is included?</Help>
              </div>
            </div>
          </>
        )}

        {/* ══ STEP 2: Organizer ══ */}
        {step === 2 && card(
          <>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#0c3a1e", marginBottom: 4 }}>
              👤 Step 2 — Who is organizing this event?
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
              Enter the organizer's name and contact number. Customers may contact them for queries.
            </div>

            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-semibold">
                  Organizer Name <span className="text-danger">*</span>
                </label>
                <input
                  className={`form-control ${errors.organizerName ? "is-invalid" : ""}`}
                  placeholder="Person's name or organization name"
                  value={form.organizerName}
                  onChange={set("organizerName")}
                  autoFocus
                />
                {errors.organizerName
                  ? <div className="invalid-feedback">{errors.organizerName}</div>
                  : <Help><Example>Rahul Desai</Example> or <Example>Nature Walks Club</Example></Help>
                }
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Phone Number <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={set("phone")}
                />
                {errors.phone
                  ? <div className="invalid-feedback">{errors.phone}</div>
                  : <Help>Customers can call this number for queries</Help>
                }
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Email Address</label>
                <input type="email" className="form-control" placeholder="Optional" value={form.email} onChange={set("email")} />
                <Help>For booking confirmations (optional)</Help>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Expected Attendees</label>
                <input type="number" min="1" className="form-control" placeholder="e.g. 50" value={form.expectedAttendees} onChange={set("expectedAttendees")} />
                <Help>Approximate number of people expected</Help>
              </div>
            </div>
          </>
        )}

        {/* ══ STEP 3: Pickup Points & Extra ══ */}
        {step === 3 && card(
          <>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#0c3a1e", marginBottom: 4 }}>
              📍 Step 3 — Pickup Points
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
              Only add pickup points if you are arranging transport for participants.
              These will appear on their booking ticket. <strong>Skip this if participants reach the venue on their own.</strong>
            </div>

            {/* Toggle */}
            <div style={{
              background: "#f8fafc", border: "1px solid #e2e8f0",
              borderRadius: 10, padding: "14px 16px", marginBottom: 16,
              display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Are you arranging pickup transport?</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                  e.g. bus from Mumbai Dadar, Pune Swargate
                </div>
              </div>
              <button
                type="button"
                className={`btn btn-sm ${showPickups ? "btn-success" : "btn-outline-secondary"}`}
                onClick={() => setShowPickups((v) => !v)}
              >
                {showPickups ? "✓ Yes, I have pickup points" : "No pickup / Skip"}
              </button>
            </div>

            {showPickups && (
              <div>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>
                  Add one row per city/boarding point.{" "}
                  <strong>Example:</strong> City: Mumbai · Location: Dadar Station East Exit · Time: 06:00 AM
                </div>

                {pickupPoints.map((pt, i) => (
                  <div key={i} style={{
                    background: "#f8fafc", border: "1px solid #e2e8f0",
                    borderRadius: 8, padding: "14px", marginBottom: 10, position: "relative",
                  }}>
                    <div style={{ fontWeight: 600, fontSize: 12, color: "#198754", marginBottom: 10 }}>
                      📍 Pickup Point {i + 1}
                    </div>
                    <div className="row g-2">
                      <div className="col-6 col-md-3">
                        <label className="form-label small fw-semibold">City</label>
                        <input className="form-control form-control-sm" placeholder="Mumbai" value={pt.city} onChange={(e) => updatePickup(i, "city", e.target.value)} />
                      </div>
                      <div className="col-6 col-md-3">
                        <label className="form-label small fw-semibold">Pickup Time</label>
                        <input className="form-control form-control-sm" placeholder="06:00 AM" value={pt.time} onChange={(e) => updatePickup(i, "time", e.target.value)} />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold">Exact Location</label>
                        <input className="form-control form-control-sm" placeholder="Dadar Station, East Exit" value={pt.location} onChange={(e) => updatePickup(i, "location", e.target.value)} />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-semibold">
                          Google Maps Link <span style={{ fontWeight: 400, color: "#94a3b8" }}>(optional — paste the link from Google Maps)</span>
                        </label>
                        <input className="form-control form-control-sm" placeholder="https://maps.google.com/..." value={pt.mapUrl} onChange={(e) => updatePickup(i, "mapUrl", e.target.value)} />
                      </div>
                    </div>
                    {pickupPoints.length > 1 && (
                      <button type="button" onClick={() => removePickup(i)} style={{ position: "absolute", top: 8, right: 10, background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 20 }}>×</button>
                    )}
                  </div>
                ))}

                <button type="button" className="btn btn-outline-success btn-sm" onClick={addPickup}>
                  + Add Another Pickup Point
                </button>
              </div>
            )}

            {/* Save summary */}
            <div style={{
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              borderRadius: 10, padding: "14px 16px", marginTop: 20,
            }}>
              <div style={{ fontWeight: 600, color: "#166534", marginBottom: 8 }}>Ready to save — Quick summary:</div>
              <div style={{ fontSize: 13, color: "#166534", lineHeight: 2 }}>
                <div>📅 <strong>{form.eventName || "—"}</strong> ({form.eventType})</div>
                <div>📍 {form.location || "—"} · {form.eventDate ? new Date(form.eventDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "No date set"}</div>
                <div>👤 {form.organizerName || "—"} · {form.phone || "—"}</div>
                <div>📍 {showPickups ? `${pickupPoints.filter(p => p.city || p.location).length} pickup point(s)` : "No pickup transport"}</div>
              </div>
            </div>
          </>
        )}

        {/* Navigation buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <div>
            {step > 1 && (
              <button type="button" className="btn btn-outline-secondary px-4" onClick={back}>
                ← Back
              </button>
            )}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/admin/events")}>
              Cancel
            </button>
            {step < 3 ? (
              <button type="button" className="btn btn-success px-5" onClick={next}>
                Next →
              </button>
            ) : (
              <button type="button" className="btn btn-success px-5 fw-semibold" onClick={handleSave}>
                ✓ Save Event
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
