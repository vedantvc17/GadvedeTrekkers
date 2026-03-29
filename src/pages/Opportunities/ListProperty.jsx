import { useState } from "react";
import { submitListingSubmission } from "../../data/listingSubmissionStorage";

const PROPERTY_TYPES = ["Homestay", "Villa", "Resort", "Farmhouse", "Bungalow", "Cottage", "Other"];

const AMENITIES = [
  "WiFi", "Parking", "Kitchen", "AC", "Hot Water", "Bonfire Area",
  "Swimming Pool", "Garden", "Mountain View", "River View",
];

const EMPTY = {
  propertyName: "",
  ownerName: "",
  phone: "",
  email: "",
  propertyType: PROPERTY_TYPES[0],
  location: "",
  capacity: "",
  pricePerNight: "",
  description: "",
  amenities: [],
  images: [],
};

export default function ListProperty() {
  const [form, setForm] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.propertyName.trim()) e.propertyName = "Property name is required";
    if (!form.ownerName.trim()) e.ownerName = "Owner name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.location.trim()) e.location = "Location is required";
    return e;
  };

  const toggleAmenity = (amenity) =>
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(amenity)
        ? f.amenities.filter((a) => a !== amenity)
        : [...f.amenities, amenity],
    }));

  const handleImages = (e) => {
    const files = [...e.target.files];
    Promise.all(
      files.map(
        (f) =>
          new Promise((res) => {
            const r = new FileReader();
            r.onload = (ev) => res(ev.target.result);
            r.readAsDataURL(f);
          })
      )
    ).then((imgs) => setForm((f) => ({ ...f, images: [...f.images, ...imgs] })));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    submitListingSubmission("property", {
      id: `PROP-${Date.now()}`,
      ...form,
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
            <h2>Listing Submitted!</h2>
            <p>
              Thank you, <strong>{form.ownerName}</strong>! Your property{" "}
              <strong>{form.propertyName}</strong> has been submitted for review. We'll contact
              you within 48 hours.
            </p>
            <p style={{ color: "#475569", fontSize: 14, marginTop: 12 }}>
              Your property is visible to admin only until it is approved.
            </p>
            <button
              className="btn btn-success mt-3"
              onClick={() => { setForm(EMPTY); setSubmitted(false); setErrors({}); }}
            >
              List Another Property
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
          <span className="vr-kicker">List With Us</span>
          <h1>List Your Property</h1>
          <p>
            Own a homestay, villa, resort, or farmhouse near a trekking destination? List it
            with Gadvede Trekkers. Our admin team reviews each submission before it is published.
          </p>
        </div>

        <div className="vr-form-card">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">

              <div className="col-md-6">
                <label className="form-label fw-semibold">Property Name <span className="text-danger">*</span></label>
                <input
                  className={`form-control ${errors.propertyName ? "is-invalid" : ""}`}
                  placeholder="e.g. Sahyadri Homestay"
                  value={form.propertyName}
                  onChange={(e) => setForm((f) => ({ ...f, propertyName: e.target.value }))}
                />
                {errors.propertyName && <div className="invalid-feedback">{errors.propertyName}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Property Type</label>
                <select
                  className="form-select"
                  value={form.propertyType}
                  onChange={(e) => setForm((f) => ({ ...f, propertyType: e.target.value }))}
                >
                  {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Owner / Contact Name <span className="text-danger">*</span></label>
                <input
                  className={`form-control ${errors.ownerName ? "is-invalid" : ""}`}
                  placeholder="Your name"
                  value={form.ownerName}
                  onChange={(e) => setForm((f) => ({ ...f, ownerName: e.target.value }))}
                />
                {errors.ownerName && <div className="invalid-feedback">{errors.ownerName}</div>}
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
                <label className="form-label fw-semibold">Guest Capacity</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  placeholder="e.g. 20"
                  value={form.capacity}
                  onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Price Per Night (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="e.g. 3500"
                  value={form.pricePerNight}
                  onChange={(e) => setForm((f) => ({ ...f, pricePerNight: e.target.value }))}
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Describe your property — surroundings, nearby treks, unique features..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Amenities</label>
                <div className="d-flex flex-wrap gap-2 mt-1">
                  {AMENITIES.map((a) => (
                    <button
                      key={a}
                      type="button"
                      className={`btn btn-sm ${form.amenities.includes(a) ? "btn-success" : "btn-outline-secondary"}`}
                      onClick={() => toggleAmenity(a)}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Upload Photos</label>
                <input type="file" className="form-control" multiple accept="image/*" onChange={handleImages} />
                {form.images.length > 0 && (
                  <div className="d-flex gap-2 mt-3 flex-wrap">
                    {form.images.map((img, i) => (
                      <div key={i} style={{ position: "relative" }}>
                        <img src={img} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "2px solid #e2e8f0" }} />
                        <button
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                          style={{ position: "absolute", top: -6, right: -6, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, fontSize: 12, lineHeight: 1, cursor: "pointer" }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-success px-5 py-2 fw-semibold">
                  Submit Listing →
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
