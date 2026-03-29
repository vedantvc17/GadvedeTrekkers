import { useState } from "react";
import { submitListingSubmission } from "../../data/listingSubmissionStorage";

const EVENT_TYPES = [
  "Trekking Event",
  "Nature Festival",
  "Adventure Race",
  "Photography Walk",
  "Yoga / Wellness Retreat",
  "Cultural Event",
  "Charity Trek",
  "Camping Event",
  "Corporate Outing",
  "Other",
];

const EMPTY_PICKUP = { city: "", location: "", time: "", mapUrl: "" };

const EMPTY = {
  eventName: "",
  organizerName: "",
  phone: "",
  email: "",
  eventType: EVENT_TYPES[0],
  eventDate: "",
  location: "",
  expectedAttendees: "",
  description: "",
  entryFee: "",
};

function Tip({ children }) {
  return (
    <div style={{
      background: "#f0fdf4", border: "1px solid #bbf7d0",
      borderRadius: 8, padding: "10px 14px", marginTop: 8,
      fontSize: 13, color: "#166534", lineHeight: 1.5,
    }}>
      💡 {children}
    </div>
  );
}

function SectionHeader({ step, title, subtitle }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20, marginTop: 10 }}>
      <div style={{
        minWidth: 36, height: 36, borderRadius: "50%",
        background: "#198754", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: 16, flexShrink: 0,
      }}>
        {step}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 16, color: "#0c3a1e" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{subtitle}</div>}
      </div>
    </div>
  );
}

export default function ListEvent() {
  const [form, setForm] = useState(EMPTY);
  const [pickupPoints, setPickupPoints] = useState([{ ...EMPTY_PICKUP }]);
  const [showPickups, setShowPickups] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const addPickup = () => setPickupPoints((p) => [...p, { ...EMPTY_PICKUP }]);
  const removePickup = (i) => setPickupPoints((p) => p.filter((_, idx) => idx !== i));
  const updatePickup = (i, field, val) =>
    setPickupPoints((p) => p.map((pt, idx) => (idx === i ? { ...pt, [field]: val } : pt)));

  const validate = () => {
    const e = {};
    if (!form.eventName.trim()) e.eventName = "Event name is required";
    if (!form.organizerName.trim()) e.organizerName = "Your name or organization name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.location.trim()) e.location = "Event location is required";
    if (!form.description.trim()) e.description = "Please describe your event";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const filledPickups = pickupPoints.filter((p) => p.city.trim() || p.location.trim());
    submitListingSubmission("event", {
      id: `EVT-${Date.now()}`,
      ...form,
      pickupPoints: filledPickups,
      submittedAt: new Date().toISOString(),
      status: "PENDING",
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="vr-page">
        <div className="container py-5">
          <div className="vr-success">
            <div className="vr-success-icon">✅</div>
            <h2>Event Submitted!</h2>
            <p>
              Thank you, <strong>{form.organizerName}</strong>! Your event{" "}
              <strong>"{form.eventName}"</strong> has been received. Our team will review it
              and reach out within 48 hours.
            </p>
            <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "16px 20px", margin: "20px 0", textAlign: "left" }}>
              <div style={{ fontWeight: 600, color: "#166534", marginBottom: 8 }}>What happens next?</div>
              <ol style={{ margin: 0, paddingLeft: 20, color: "#166534", lineHeight: 2, fontSize: 14 }}>
                <li>Our admin team reviews your submission</li>
                <li>We contact you on <strong>{form.phone}</strong> to confirm details</li>
                <li>Your event stays visible to admin only until approval</li>
                <li>Only approved events are published on the platform</li>
              </ol>
            </div>
            <button
              className="btn btn-success mt-2 px-4"
              onClick={() => {
                setForm(EMPTY);
                setPickupPoints([{ ...EMPTY_PICKUP }]);
                setShowPickups(false);
                setSubmitted(false);
                setErrors({});
              }}
            >
              Submit Another Event
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="vr-page">
      <div className="container py-5">

        {/* ── Hero ── */}
        <div className="vr-hero mb-4">
          <span className="vr-kicker">List With Us</span>
          <h1>List Your Event</h1>
          <p>
            Organizing a trek, festival, adventure race, or nature camp? Fill in this simple form.
            Our admin team will review your submission first and contact you before anything goes live.
          </p>
        </div>

        <div style={{
          background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12,
          padding: "14px 18px", marginBottom: 20, textAlign: "left",
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1d4ed8", marginBottom: 6 }}>
            Admin review first
          </div>
          <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.7 }}>
            Your event is submitted for internal review only. It is not visible to customers until an admin approves it.
          </div>
        </div>

        {/* ── How it works ── */}
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
          padding: "20px 24px", marginBottom: 28,
        }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#0c3a1e", marginBottom: 14 }}>
            📋 How to fill this form — 4 simple sections
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {[
              ["1", "Your Details", "Name, phone, email"],
              ["2", "Event Info", "Name, type, date, place"],
              ["3", "Pickup Points", "Only if you provide transport"],
              ["4", "Description", "Tell people about your event"],
            ].map(([n, title, sub]) => (
              <div key={n} style={{
                flex: "1 1 140px", background: "#f8fafc", borderRadius: 8,
                padding: "10px 14px", border: "1px solid #e2e8f0",
              }}>
                <div style={{ fontWeight: 700, color: "#198754", fontSize: 13 }}>Step {n}</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>{title}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="vr-form-card">
          <form onSubmit={handleSubmit}>

            {/* ══ SECTION 1: Your Details ══ */}
            <SectionHeader step="1" title="Your Details" subtitle="Tell us who is organizing this event" />
            <div className="row g-3 mb-4">

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Organizer Name <span className="text-danger">*</span>
                </label>
                <input
                  className={`form-control ${errors.organizerName ? "is-invalid" : ""}`}
                  placeholder="e.g. Rahul Desai or Nature Walks Club"
                  value={form.organizerName}
                  onChange={set("organizerName")}
                />
                {errors.organizerName
                  ? <div className="invalid-feedback">{errors.organizerName}</div>
                  : <div className="form-text">Your full name or your organization's name</div>
                }
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Phone Number <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  placeholder="e.g. 9876543210"
                  value={form.phone}
                  onChange={set("phone")}
                />
                {errors.phone
                  ? <div className="invalid-feedback">{errors.phone}</div>
                  : <div className="form-text">We'll call you on this number to confirm your listing</div>
                }
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g. you@gmail.com"
                  value={form.email}
                  onChange={set("email")}
                />
                <div className="form-text">Optional — for sending booking confirmations to you</div>
              </div>

            </div>

            <hr style={{ borderColor: "#e2e8f0", margin: "8px 0 24px" }} />

            {/* ══ SECTION 2: Event Info ══ */}
            <SectionHeader step="2" title="Event Information" subtitle="Basic details about your event" />
            <div className="row g-3 mb-4">

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Event Name <span className="text-danger">*</span>
                </label>
                <input
                  className={`form-control ${errors.eventName ? "is-invalid" : ""}`}
                  placeholder="e.g. Bhimashankar Sunrise Trek 2026"
                  value={form.eventName}
                  onChange={set("eventName")}
                />
                {errors.eventName
                  ? <div className="invalid-feedback">{errors.eventName}</div>
                  : <div className="form-text">Give your event a clear, descriptive name</div>
                }
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Event Type</label>
                <select
                  className="form-select"
                  value={form.eventType}
                  onChange={set("eventType")}
                >
                  {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="form-text">Choose the category that best fits your event</div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Event Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.eventDate}
                  onChange={set("eventDate")}
                />
                <div className="form-text">The date your event takes place</div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Event Location <span className="text-danger">*</span>
                </label>
                <input
                  className={`form-control ${errors.location ? "is-invalid" : ""}`}
                  placeholder="e.g. Bhimashankar, Pune District, Maharashtra"
                  value={form.location}
                  onChange={set("location")}
                />
                {errors.location
                  ? <div className="invalid-feedback">{errors.location}</div>
                  : <div className="form-text">Village / area, district, and state</div>
                }
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Expected Attendees</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  placeholder="e.g. 50"
                  value={form.expectedAttendees}
                  onChange={set("expectedAttendees")}
                />
                <div className="form-text">Approximate number of participants you expect</div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Entry Fee (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="0 if this is a free event"
                  value={form.entryFee}
                  onChange={set("entryFee")}
                />
                <div className="form-text">Per person fee. Enter 0 if the event is free</div>
              </div>

            </div>

            <hr style={{ borderColor: "#e2e8f0", margin: "8px 0 24px" }} />

            {/* ══ SECTION 3: Pickup Points ══ */}
            <SectionHeader
              step="3"
              title="Pickup Points"
              subtitle="Only add this if you are arranging transport for participants"
            />

            <div style={{
              background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
              padding: "14px 16px", marginTop: 8,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#0c3a1e", fontSize: 14 }}>Do you have pickup points?</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    Skip this if participants reach the venue directly.
                  </div>
                </div>
                <button
                  type="button"
                  className={`btn btn-sm ${showPickups ? "btn-success" : "btn-outline-secondary"}`}
                  onClick={() => setShowPickups((value) => !value)}
                >
                  {showPickups ? "Hide Pickup Points" : "Add Pickup Points"}
                </button>
              </div>
            </div>

            {showPickups && (
            <div style={{ marginTop: 16 }}>
              <Tip>
                Example: Mumbai | Dadar Station East Exit | 06:00 AM. Add one row per city or stop.
              </Tip>
              {pickupPoints.map((pt, i) => (
                <div key={i} style={{
                  background: "#f8fafc", border: "1px solid #e2e8f0",
                  borderRadius: 10, padding: "16px", marginBottom: 12,
                  position: "relative",
                }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#64748b", marginBottom: 10 }}>
                    📍 Pickup Point {i + 1}
                  </div>
                  <div className="row g-2">
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">City / Area</label>
                      <input
                        className="form-control form-control-sm"
                        placeholder="e.g. Mumbai"
                        value={pt.city}
                        onChange={(e) => updatePickup(i, "city", e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Exact Location</label>
                      <input
                        className="form-control form-control-sm"
                        placeholder="e.g. Dadar Station, East Exit"
                        value={pt.location}
                        onChange={(e) => updatePickup(i, "location", e.target.value)}
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small fw-semibold">Pickup Time</label>
                      <input
                        className="form-control form-control-sm"
                        placeholder="e.g. 06:00 AM"
                        value={pt.time}
                        onChange={(e) => updatePickup(i, "time", e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">
                        Google Maps Link <span style={{ fontWeight: 400, color: "#94a3b8" }}>(optional)</span>
                      </label>
                      <input
                        className="form-control form-control-sm"
                        placeholder="Paste maps.google.com link"
                        value={pt.mapUrl}
                        onChange={(e) => updatePickup(i, "mapUrl", e.target.value)}
                      />
                    </div>
                  </div>
                  {pickupPoints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePickup(i)}
                      style={{
                        position: "absolute", top: 10, right: 12,
                        background: "none", border: "none", cursor: "pointer",
                        color: "#ef4444", fontSize: 18, lineHeight: 1,
                      }}
                      title="Remove this pickup point"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="btn btn-outline-success btn-sm"
                onClick={addPickup}
              >
                + Add Another Pickup Point
              </button>

              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>
                Example: Mumbai → Dadar Station 06:00 AM, Pune → Swargate 05:00 AM
              </div>
            </div>
            )}

            <hr style={{ borderColor: "#e2e8f0", margin: "24px 0" }} />

            {/* ══ SECTION 4: Description ══ */}
            <SectionHeader step="4" title="About Your Event" subtitle="Tell participants what to expect" />

            <div className="col-12 mb-4">
              <label className="form-label fw-semibold">
                Event Description <span className="text-danger">*</span>
              </label>
              <textarea
                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                rows={5}
                placeholder={`Describe your event here. For example:\n\n• What is the event about?\n• What activities are included?\n• Who should attend (beginners / experienced)?\n• What to bring?\n• Any special instructions?`}
                value={form.description}
                onChange={set("description")}
              />
              {errors.description
                ? <div className="invalid-feedback">{errors.description}</div>
                : <div className="form-text">
                    Write a clear description so participants know what to expect.
                    Minimum 3–4 sentences recommended.
                  </div>
              }
            </div>

            {/* ── Submit ── */}
            <div style={{
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              borderRadius: 10, padding: "16px 20px", marginBottom: 20,
            }}>
              <div style={{ fontWeight: 600, color: "#166534", marginBottom: 4 }}>Before you submit:</div>
              <ul style={{ margin: 0, paddingLeft: 18, color: "#166534", fontSize: 13, lineHeight: 2 }}>
                <li>Double-check your phone number — we'll call to confirm</li>
                <li>Make sure event date and location are correct</li>
                <li>Pickup points are optional</li>
                <li>Your event will stay admin-only until approved</li>
              </ul>
            </div>

            <button type="submit" className="btn btn-success px-5 py-2 fw-semibold" style={{ fontSize: 15 }}>
              Submit Event →
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}
