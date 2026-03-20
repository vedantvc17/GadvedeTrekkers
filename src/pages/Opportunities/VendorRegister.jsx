import { useState } from "react";
import { saveVendor } from "../../data/vendorStorage";

const SERVICE_TYPES = ["Bus", "Food", "Adventure Activity"];
const RATE_LABELS   = { Bus: "Rate per Day / Trip", Food: "Rate per Plate / Person", "Adventure Activity": "Rate per Person / Day" };
const RATE_PH       = { Bus: "e.g. ₹15,000 / day for 40-seat AC bus", Food: "e.g. ₹150 per plate (Veg Thali)", "Adventure Activity": "e.g. ₹500 per person per day" };

const EMPTY = { name: "", address: "", googleMapLocation: "", contactNumber: "", serviceType: "Bus", rates: "", images: [] };

export default function VendorRegister() {
  const [form,      setForm]      = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [errors,    setErrors]    = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())          e.name = "Vendor name is required";
    if (!form.contactNumber.trim()) e.contactNumber = "Contact number is required";
    if (!form.address.trim())       e.address = "Address is required";
    return e;
  };

  const handleImages = (e) => {
    const files = [...e.target.files];
    Promise.all(files.map((f) => new Promise((res) => {
      const r = new FileReader();
      r.onload = (ev) => res(ev.target.result);
      r.readAsDataURL(f);
    }))).then((imgs) => setForm((f) => ({ ...f, images: [...f.images, ...imgs] })));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    saveVendor(form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="vr-page">
        <div className="container py-5">
          <div className="vr-success">
            <div className="vr-success-icon">✅</div>
            <h2>Registration Submitted!</h2>
            <p>Thank you, <strong>{form.name}</strong>. Our team will review your details and contact you within 48 hours.</p>
            <button className="btn btn-success mt-3" onClick={() => { setForm(EMPTY); setSubmitted(false); }}>Register Another</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="vr-page">
      <div className="container py-5">
        <div className="vr-hero mb-5">
          <span className="vr-kicker">Partner with Us</span>
          <h1>Vendor Registration</h1>
          <p>Join the Gadvede Trekkers ecosystem as a service provider — buses, food stalls, adventure gear and more.</p>
        </div>

        <div className="vr-form-card">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">

              {/* Vendor Name */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Vendor / Business Name <span className="text-danger">*</span></label>
                <input className={`form-control ${errors.name ? "is-invalid" : ""}`} placeholder="e.g. Shivaji Travels" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              {/* Contact Number */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Contact Number <span className="text-danger">*</span></label>
                <input className={`form-control ${errors.contactNumber ? "is-invalid" : ""}`} placeholder="10-digit mobile number" value={form.contactNumber} onChange={(e) => setForm((f) => ({ ...f, contactNumber: e.target.value }))} />
                {errors.contactNumber && <div className="invalid-feedback">{errors.contactNumber}</div>}
              </div>

              {/* Address */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Address <span className="text-danger">*</span></label>
                <input className={`form-control ${errors.address ? "is-invalid" : ""}`} placeholder="City, State" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
                {errors.address && <div className="invalid-feedback">{errors.address}</div>}
              </div>

              {/* Google Map */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Google Map Location (URL)</label>
                <input className="form-control" placeholder="Paste your Google Maps link" value={form.googleMapLocation} onChange={(e) => setForm((f) => ({ ...f, googleMapLocation: e.target.value }))} />
                <div className="form-text">Open Google Maps → Share → Copy link</div>
              </div>

              {/* Service Type */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Service Type</label>
                <select className="form-select" value={form.serviceType} onChange={(e) => setForm((f) => ({ ...f, serviceType: e.target.value, rates: "" }))}>
                  {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Rates */}
              <div className="col-md-8">
                <label className="form-label fw-semibold">{RATE_LABELS[form.serviceType]}</label>
                <input className="form-control" placeholder={RATE_PH[form.serviceType]} value={form.rates} onChange={(e) => setForm((f) => ({ ...f, rates: e.target.value }))} />
              </div>

              {/* Images */}
              <div className="col-12">
                <label className="form-label fw-semibold">Upload Images (optional)</label>
                <input type="file" className="form-control" multiple accept="image/*" onChange={handleImages} />
                {form.images.length > 0 && (
                  <div className="d-flex gap-2 mt-3 flex-wrap">
                    {form.images.map((img, i) => (
                      <div key={i} style={{ position: "relative" }}>
                        <img src={img} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "2px solid #e2e8f0" }} />
                        <button type="button" onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                          style={{ position: "absolute", top: -6, right: -6, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, fontSize: 12, lineHeight: 1, cursor: "pointer" }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-success px-5 py-2 fw-semibold">Submit Registration →</button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
