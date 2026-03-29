import { useState } from "react";
import { Link } from "react-router-dom";
import InfoTooltip from "../components/InfoTooltip";
import {
  DEFAULT_BOOKING_FORM,
  getBookingFormConfig,
  saveBookingFormConfig,
} from "../data/bookingFormStorage";

const READ_ONLY_SECTIONS = [
  {
    title: "Website Booking Page Preview",
    fields: [
      { key: "heroKicker", label: "Hero Kicker" },
      { key: "heroTitle", label: "Hero Title" },
      { key: "heroSubtitle", label: "Hero Subtitle", multiline: true },
      { key: "leadSectionTitle", label: "Lead Section Title" },
      { key: "leadSectionSubtitle", label: "Lead Section Subtitle", multiline: true },
      { key: "summaryTitle", label: "Summary Title" },
      { key: "summarySubtitle", label: "Summary Subtitle", multiline: true },
      { key: "consentRules", label: "Consent: Rules", multiline: true },
      { key: "consentFitness", label: "Consent: Fitness", multiline: true },
      { key: "consentCancellation", label: "Consent: Cancellation", multiline: true },
      { key: "emailNote", label: "Email Note", multiline: true },
      { key: "backLinkLabel", label: "Back Link Label" },
    ],
  },
  {
    title: "Staff Form Preview",
    fields: [
      { key: "manualFormTitle", label: "Staff Form Title" },
      { key: "manualFormSubtitle", label: "Staff Form Subtitle", multiline: true },
      { key: "manualFormNote", label: "Staff Form Note", multiline: true },
    ],
  },
];

const EDITABLE_SECTIONS = [
  {
    title: "Shared Dropdown Controls",
    fields: [
      {
        key: "paymentOptions",
        label: "Website Payment Options",
        type: "textarea",
        rows: 5,
        tip: "One option per line. Used on the customer-facing booking page.",
      },
      {
        key: "departureOptions",
        label: "Departure Options",
        type: "textarea",
        rows: 5,
        tip: "Use only fallback joining points here. Trek-wise departure plans should come from the actual event listing.",
      },
      {
        key: "pickupOptions",
        label: "Pickup Options JSON",
        type: "textarea",
        rows: 14,
        tip: "JSON object grouped by departure city. Example: { \"Pune\": [\"Stop 1\", \"Stop 2\"] }",
      },
    ],
  },
  {
    title: "Direct Payment Booking Desk Controls",
    fields: [
      {
        key: "manualCategoryOptions",
        label: "Manual Booking Categories",
        type: "textarea",
        rows: 6,
        tip: "One category per line. These appear in the direct-payment staff form.",
      },
      {
        key: "manualSourceOptions",
        label: "Manual Booking Sources",
        type: "textarea",
        rows: 5,
        tip: "Track where the direct booking came from, such as Employee Portal, Walk-in, or WhatsApp.",
      },
      {
        key: "manualPaymentMethodOptions",
        label: "Manual Payment Methods",
        type: "textarea",
        rows: 5,
        tip: "These payment methods appear in the direct booking form used when money is collected outside the website checkout.",
      },
      {
        key: "manualStatusOptions",
        label: "Manual Booking Statuses",
        type: "textarea",
        rows: 4,
        tip: "Keep these aligned with the booking dashboard statuses for cleaner operations.",
      },
      {
        key: "manualEventOptions",
        label: "Custom Event Names",
        type: "textarea",
        rows: 6,
        tip: "One event name per line. These are merged with live listings so staff can still pick packages not yet published.",
      },
    ],
  },
];

function renderField(field, form, setForm) {
  if (field.type === "textarea") {
    return (
      <textarea
        className="form-control form-control-sm"
        rows={field.rows || 3}
        value={form[field.key] ?? ""}
        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
      />
    );
  }

  return (
    <input
      className="form-control form-control-sm"
      value={form[field.key] ?? ""}
      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
    />
  );
}

function renderReadOnlyField(field, form) {
  return (
    <div
      className="border rounded-3 p-3 h-100"
      style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}
    >
      <div className="small fw-semibold text-uppercase text-muted mb-2">{field.label}</div>
      <div style={{ whiteSpace: field.multiline ? "pre-wrap" : "normal", color: "#0f172a" }}>
        {form[field.key] || "—"}
      </div>
    </div>
  );
}

export default function ManageBookingForm() {
  const [form, setForm] = useState(getBookingFormConfig());
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const staffFormLink = `${window.location.origin}/employee/direct-booking`;

  const handleSave = (event) => {
    event.preventDefault();
    try {
      JSON.parse(form.pickupOptions || "{}");
      saveBookingFormConfig(form);
      setSaved(true);
      setError("");
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Pickup Options JSON is invalid. Please fix the JSON before saving.");
    }
  };

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h3 className="adm-page-title">🧾 Booking Desk Setup</h3>
        <span className="text-muted small">
          Control the public booking page and the staff direct-payment booking desk from one place.
        </span>
      </div>

      <div className="adm-form-card mb-4">
        <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
          <div>
            <div className="fw-bold mb-1">
              Staff Direct Booking Form
              <InfoTooltip text="Use this form when a customer pays directly by UPI, cash, or bank transfer without using the website checkout. No taxes are charged on these bookings." />
            </div>
            <div className="text-muted small">
              Share this link with staff when a customer pays directly through UPI, cash, or bank transfer.
              The booking will be saved with zero tax.
            </div>
          </div>
          <div className="d-flex gap-2 flex-wrap align-items-center">
            <Link
              to="/employee/direct-booking"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              👁 Preview Form
            </Link>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(staffFormLink);
                } catch {
                  // Fallback for non-secure contexts
                  const el = document.createElement("input");
                  el.value = staffFormLink;
                  document.body.appendChild(el);
                  el.select();
                  document.execCommand("copy");
                  document.body.removeChild(el);
                }
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              }}
            >
              {copied ? "✅ Copied!" : "📋 Copy Link"}
            </button>
          </div>
        </div>
        <div className="mt-3 p-2 rounded" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <div className="small text-muted mb-1">Direct link (share with staff):</div>
          <code style={{ fontSize: 12, wordBreak: "break-all", color: "#0f172a" }}>{staffFormLink}</code>
        </div>
      </div>

      <div className="adm-form-card">
        {saved && <div className="alert alert-success py-2 mb-3">✅ Booking desk settings updated successfully.</div>}
        {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

        <form onSubmit={handleSave}>
          {READ_ONLY_SECTIONS.map((section) => (
            <div key={section.title} className="mb-4">
              <div className="fw-bold mb-3" style={{ fontSize: 15 }}>{section.title}</div>
              <div className="row g-3">
                {section.fields.map((field) => (
                  <div className="col-md-6" key={field.key}>
                    {renderReadOnlyField(field, form)}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {EDITABLE_SECTIONS.map((section) => (
            <div key={section.title} className="mb-4">
              <div className="fw-bold mb-3" style={{ fontSize: 15 }}>{section.title}</div>
              <div className="row g-3">
                {section.fields.map((field) => (
                  <div className="col-md-6" key={field.key}>
                    <label className="form-label small fw-semibold mb-1">
                      {field.label}
                      {field.tip && <InfoTooltip text={field.tip} />}
                    </label>
                    {renderField(field, form, setForm)}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-4 d-flex gap-2 flex-wrap">
            <button type="submit" className="btn btn-success btn-sm px-4">Save Booking Desk</button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                setForm({ ...DEFAULT_BOOKING_FORM });
                setError("");
              }}
            >
              Reset to Default
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
