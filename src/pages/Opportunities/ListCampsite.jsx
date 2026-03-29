import { useState } from "react";

const FACILITIES = [
  "Tents Provided", "Sleeping Bags", "Bonfire", "Washrooms", "Running Water",
  "Electricity", "Parking", "First Aid Kit", "Catering / Meals", "Nature Trails",
];

const EMPTY = {
  campsiteName: "",
  ownerName: "",
  phone: "",
  email: "",
  location: "",
  nearbyTrek: "",
  capacity: "",
  pricePerPerson: "",
  description: "",
  facilities: [],
  images: [],
};

export default function ListCampsite() {
  const [form, setForm] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.campsiteName.trim()) e.campsiteName = "Campsite name is required";
    if (!form.ownerName.trim()) e.ownerName = "Owner name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.location.trim()) e.location = "Location is required";
    return e;
  };

  const toggleFacility = (facility) =>
    setForm((f) => ({
      ...f,
      facilities: f.facilities.includes(facility)
        ? f.facilities.filter((fa) => fa !== facility)
        : [...f.facilities, facility],
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

    const listings = JSON.parse(localStorage.getItem("gt_campsite_listings") || "[]");
    listings.unshift({
      id: `CAMP-${Date.now()}`,
      ...form,
      submittedAt: new Date().toISOString(),
      status: "PENDING",
    });
    localStorage.setItem("gt_campsite_listings", JSON.stringify(listings));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="vr-page">
        <div className="container py-5">
          <div className="vr-success">
            <div className="vr-success-icon">✅</div>
            <h2>Campsite Submitted!</h2>
            <p>
              Thank you, <strong>{form.ownerName}</strong>! Your campsite{" "}
              <strong>{form.campsiteName}</strong> has been submitted for review. We'll contact
              you within 48 hours.
            </p>
            <button
              className="btn btn-success mt-3"
              onClick={() => { setForm(EMPTY); setSubmitted(false); setErrors({}); }}
            >
              List Another Campsite
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
          <h1>List Your Campsite</h1>
          <p>
            Have a campsite near a scenic trail or forest? Partner with Gadvede Trekkers to
            bring adventure seekers to your doorstep.
          </p>
        </div>

        <div className="vr-form-card">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">

              <div className="col-md-6">
                <label className="form-label fw-semibold">Campsite Name <span className="text-danger">*</span></label>
                <input
                  className={`form-control ${errors.campsiteName ? "is-invalid" : ""}`}
                  placeholder="e.g. Bhimashankar Camp"
                  value={form.campsiteName}
                  onChange={(e) => setForm((f) => ({ ...f, campsiteName: e.target.value }))}
                />
                {errors.campsiteName && <div className="invalid-feedback">{errors.campsiteName}</div>}
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
                <label className="form-label fw-semibold">Nearby Trek / Destination</label>
                <input
                  className="form-control"
                  placeholder="e.g. Rajmachi Trek, Bhimashankar"
                  value={form.nearbyTrek}
                  onChange={(e) => setForm((f) => ({ ...f, nearbyTrek: e.target.value }))}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Capacity (People)</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  placeholder="e.g. 50"
                  value={form.capacity}
                  onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Price Per Person (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="e.g. 800"
                  value={form.pricePerPerson}
                  onChange={(e) => setForm((f) => ({ ...f, pricePerPerson: e.target.value }))}
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Describe your campsite — terrain, atmosphere, accessibility, special features..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Available Facilities</label>
                <div className="d-flex flex-wrap gap-2 mt-1">
                  {FACILITIES.map((fa) => (
                    <button
                      key={fa}
                      type="button"
                      className={`btn btn-sm ${form.facilities.includes(fa) ? "btn-success" : "btn-outline-secondary"}`}
                      onClick={() => toggleFacility(fa)}
                    >
                      {fa}
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
                  Submit Campsite →
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
