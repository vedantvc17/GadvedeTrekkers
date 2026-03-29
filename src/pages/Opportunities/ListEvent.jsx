import { useState } from "react";

const EVENT_TYPES = [
  "Nature Festival",
  "Adventure Race",
  "Photography Walk",
  "Yoga / Wellness Retreat",
  "Cultural Event",
  "Charity Trek",
  "Corporate Outing",
  "Other",
];

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

export default function ListEvent() {
  const [form, setForm] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.eventName.trim()) e.eventName = "Event name is required";
    if (!form.organizerName.trim()) e.organizerName = "Organizer name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.location.trim()) e.location = "Event location is required";
    if (!form.description.trim()) e.description = "Please provide a brief description";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const events = JSON.parse(localStorage.getItem("gt_event_listings") || "[]");
    events.unshift({
      id: `EVT-${Date.now()}`,
      ...form,
      submittedAt: new Date().toISOString(),
      status: "PENDING",
    });
    localStorage.setItem("gt_event_listings", JSON.stringify(events));
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
              <strong>{form.eventName}</strong> has been submitted. Our team will review and
              reach out within 48 hours.
            </p>
            <button
              className="btn btn-success mt-3"
              onClick={() => { setForm(EMPTY); setSubmitted(false); setErrors({}); }}
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
        <div className="vr-hero mb-5">
          <span className="vr-kicker">Partner With Us</span>
          <h1>List Your Event</h1>
          <p>
            Organizing a trek, festival, adventure race, or nature camp? Partner with Gadvede
            Trekkers to reach a wider audience of outdoor enthusiasts.
          </p>
        </div>

        <div className="vr-form-card">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">

              <div className="col-md-6">
                <label className="form-label fw-semibold">Event Name <span className="text-danger">*</span></label>
                <input
                  className={`form-control ${errors.eventName ? "is-invalid" : ""}`}
                  placeholder="e.g. Sahyadri Nature Festival 2026"
                  value={form.eventName}
                  onChange={(e) => setForm((f) => ({ ...f, eventName: e.target.value }))}
                />
                {errors.eventName && <div className="invalid-feedback">{errors.eventName}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Event Type</label>
                <select
                  className="form-select"
                  value={form.eventType}
                  onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value }))}
                >
                  {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Organizer Name <span className="text-danger">*</span></label>
                <input
                  className={`form-control ${errors.organizerName ? "is-invalid" : ""}`}
                  placeholder="Your name or organization"
                  value={form.organizerName}
                  onChange={(e) => setForm((f) => ({ ...f, organizerName: e.target.value }))}
                />
                {errors.organizerName && <div className="invalid-feedback">{errors.organizerName}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Phone Number <span className="text-danger">*</span></label>
                <input
                  type="tel"
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  placeholder="10-digit mobile"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Event Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.eventDate}
                  onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Location <span className="text-danger">*</span></label>
                <input
                  className={`form-control ${errors.location ? "is-invalid" : ""}`}
                  placeholder="Village / Town, District, State"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                />
                {errors.location && <div className="invalid-feedback">{errors.location}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Expected Attendees</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  placeholder="e.g. 100"
                  value={form.expectedAttendees}
                  onChange={(e) => setForm((f) => ({ ...f, expectedAttendees: e.target.value }))}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Entry Fee (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="0 for free events"
                  value={form.entryFee}
                  onChange={(e) => setForm((f) => ({ ...f, entryFee: e.target.value }))}
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Event Description <span className="text-danger">*</span></label>
                <textarea
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  rows={4}
                  placeholder="Describe your event — what it's about, activities included, who should attend..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-success px-5 py-2 fw-semibold">
                  Submit Event →
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
