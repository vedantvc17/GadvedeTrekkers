import { useState, useRef } from "react";
import { getAllCampaigns, saveCampaign, deleteCampaign, parseContactsCSV } from "../data/marketingStorage";
import { getAllCustomers } from "../data/customerStorage";

const CHANNEL_OPTS = [
  { key: "email",     label: "Email",     icon: "📧" },
  { key: "whatsapp",  label: "WhatsApp",  icon: "💬" },
  { key: "sms",       label: "SMS",       icon: "📱" },
];

const EMPTY_MSG = { title: "", details: "", footer: "", link: "" };

export default function ManageMarketing() {
  const [tab,       setTab]       = useState("compose");   // compose | history
  const [channels,  setChannels]  = useState({ email: true, whatsapp: false, sms: false });
  const [msg,       setMsg]       = useState(EMPTY_MSG);
  const [contacts,  setContacts]  = useState([]);           // manual / from customers
  const [csvText,   setCsvText]   = useState("");
  const [csvError,  setCsvError]  = useState("");
  const [sent,      setSent]      = useState(false);
  const [tick,      setTick]      = useState(0);
  const [preview,   setPreview]   = useState(false);
  const fileRef = useRef();
  const refresh = () => setTick((t) => t + 1);

  const campaigns = getAllCampaigns();
  const customers = getAllCustomers();

  /* ── Load customers as contacts ── */
  const loadFromCustomers = () => {
    setContacts(customers.map((c) => ({ name: c.name, contact: c.email || c.phone })));
    setCsvText("");
  };

  /* ── CSV file upload ── */
  const handleCSVFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const parsed = parseContactsCSV(text);
      if (!parsed.length) { setCsvError("No valid contacts found. Expected: Name, Contact per row."); return; }
      setCsvError("");
      setContacts(parsed);
      setCsvText(text);
    };
    reader.readAsText(file);
  };

  /* ── Send campaign ── */
  const handleSend = () => {
    if (!msg.title.trim()) return alert("Campaign title is required.");
    if (!Object.values(channels).some(Boolean)) return alert("Select at least one channel.");
    if (!contacts.length) return alert("Add at least one contact.");

    saveCampaign({
      title:    msg.title,
      details:  msg.details,
      footer:   msg.footer,
      link:     msg.link,
      channels: Object.keys(channels).filter((k) => channels[k]),
      recipientCount: contacts.length,
    });
    setSent(true);
    refresh();
    setTimeout(() => { setSent(false); setMsg(EMPTY_MSG); setContacts([]); setCsvText(""); }, 4000);
  };

  const activeChannelCount = Object.values(channels).filter(Boolean).length;

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h3 className="adm-page-title">📢 Marketing</h3>
        <div className="d-flex gap-2">
          <button className={`btn btn-sm ${tab === "compose" ? "btn-success" : "btn-outline-secondary"}`} onClick={() => setTab("compose")}>✏ Compose</button>
          <button className={`btn btn-sm ${tab === "history" ? "btn-success" : "btn-outline-secondary"}`} onClick={() => setTab("history")}>
            📋 History {campaigns.length > 0 && <span className="badge bg-secondary ms-1">{campaigns.length}</span>}
          </button>
        </div>
      </div>

      {sent && (
        <div className="alert alert-success py-2 mb-3" style={{ fontSize: 13 }}>
          ✅ Campaign "<strong>{msg.title || "Untitled"}</strong>" sent to {contacts.length} contact{contacts.length !== 1 ? "s" : ""} via {Object.keys(channels).filter((k) => channels[k]).join(", ")}.
        </div>
      )}

      {/* ══ COMPOSE TAB ══ */}
      {tab === "compose" && (
        <div className="adm-mkt-layout">

          {/* LEFT — message form */}
          <div className="adm-mkt-form">
            <h6 className="fw-semibold mb-3">Message</h6>

            <div className="mb-3">
              <label className="form-label form-label-sm fw-semibold">Title *</label>
              <input className="form-control form-control-sm" placeholder="e.g. 🏔 Weekend Trek Offer — Harishchandragad" value={msg.title} onChange={(e) => setMsg((m) => ({ ...m, title: e.target.value }))} />
            </div>
            <div className="mb-3">
              <label className="form-label form-label-sm fw-semibold">Details</label>
              <textarea className="form-control form-control-sm" rows={4} placeholder="Main message body…" value={msg.details} onChange={(e) => setMsg((m) => ({ ...m, details: e.target.value }))} />
            </div>
            <div className="mb-3">
              <label className="form-label form-label-sm fw-semibold">Link (optional)</label>
              <input className="form-control form-control-sm" placeholder="https://gadvedetrekkers.com/treks/…" value={msg.link} onChange={(e) => setMsg((m) => ({ ...m, link: e.target.value }))} />
            </div>
            <div className="mb-4">
              <label className="form-label form-label-sm fw-semibold">Footer</label>
              <input className="form-control form-control-sm" placeholder="e.g. Team Gadvede Trekkers | www.gadvedetrekkers.com" value={msg.footer} onChange={(e) => setMsg((m) => ({ ...m, footer: e.target.value }))} />
            </div>

            {/* Channels */}
            <h6 className="fw-semibold mb-2">Channels</h6>
            <div className="d-flex gap-3 mb-4 flex-wrap">
              {CHANNEL_OPTS.map((c) => (
                <label key={c.key} className={`adm-channel-chip ${channels[c.key] ? "adm-channel-chip--on" : ""}`}>
                  <input
                    type="checkbox"
                    checked={channels[c.key]}
                    onChange={() => setChannels((ch) => ({ ...ch, [c.key]: !ch[c.key] }))}
                    style={{ display: "none" }}
                  />
                  {c.icon} {c.label}
                </label>
              ))}
            </div>

            {/* WhatsApp API note */}
            {channels.whatsapp && (
              <div className="alert alert-warning py-2 mb-3" style={{ fontSize: 12 }}>
                <strong>WhatsApp API:</strong> Connect your WhatsApp Business API key in <em>Settings → Integrations</em> to enable real sending. Currently simulated.
              </div>
            )}

            <div className="d-flex gap-2">
              <button className="btn btn-success btn-sm" onClick={handleSend} disabled={!msg.title || activeChannelCount === 0 || !contacts.length}>
                🚀 Send Campaign ({contacts.length} contacts)
              </button>
              <button className="btn btn-outline-primary btn-sm" onClick={() => setPreview((p) => !p)}>
                {preview ? "Hide Preview" : "👁 Preview"}
              </button>
            </div>

            {/* Message preview */}
            {preview && (
              <div className="adm-mkt-preview mt-3">
                <div className="adm-mkt-preview-title">{msg.title || "(No Title)"}</div>
                <p style={{ fontSize: 13, margin: "8px 0" }}>{msg.details || "(No message body)"}</p>
                {msg.link && <a href={msg.link} style={{ fontSize: 12, color: "#0891b2" }}>{msg.link}</a>}
                <hr style={{ margin: "8px 0", borderColor: "#e2e8f0" }} />
                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{msg.footer || "(No footer)"}</p>
              </div>
            )}
          </div>

          {/* RIGHT — contacts */}
          <div className="adm-mkt-contacts">
            <h6 className="fw-semibold mb-3">Recipients</h6>

            <div className="d-flex gap-2 mb-3 flex-wrap">
              <button className="btn btn-outline-success btn-sm" onClick={loadFromCustomers}>
                👤 Load All Customers ({customers.length})
              </button>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => fileRef.current?.click()}>
                📂 Upload CSV
              </button>
              <input ref={fileRef} type="file" accept=".csv,.txt" style={{ display: "none" }} onChange={handleCSVFile} />
              {contacts.length > 0 && (
                <button className="btn btn-outline-danger btn-sm" onClick={() => setContacts([])}>✕ Clear</button>
              )}
            </div>

            <div className="form-text mb-2">CSV format: <code>Name, Email or Phone</code> (one per row)</div>
            {csvError && <p className="text-danger" style={{ fontSize: 12 }}>{csvError}</p>}

            {contacts.length === 0 ? (
              <p className="text-muted" style={{ fontSize: 13 }}>No contacts loaded yet.</p>
            ) : (
              <div className="adm-mkt-contact-list">
                <div className="adm-mkt-contact-header">
                  <strong>{contacts.length} contact{contacts.length !== 1 ? "s" : ""}</strong>
                  <span style={{ fontSize: 11, color: "#64748b" }}>Will receive on selected channels</span>
                </div>
                <div style={{ maxHeight: 320, overflowY: "auto" }}>
                  {contacts.slice(0, 100).map((c, i) => (
                    <div key={i} className="adm-mkt-contact-row">
                      <span className="adm-mkt-contact-name">{c.name || "—"}</span>
                      <span className="adm-mkt-contact-val">{c.contact}</span>
                    </div>
                  ))}
                  {contacts.length > 100 && <p className="text-muted px-3 py-1" style={{ fontSize: 11 }}>…and {contacts.length - 100} more</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ HISTORY TAB ══ */}
      {tab === "history" && (
        campaigns.length === 0 ? (
          <div className="adm-empty"><div className="adm-empty-icon">📢</div><p className="adm-empty-text">No campaigns sent yet.</p></div>
        ) : (
          <div className="adm-table-wrap">
            <table className="table table-hover adm-table mb-0">
              <thead>
                <tr><th>Title</th><th>Channels</th><th>Recipients</th><th>Sent At</th><th style={{ width: 60 }}>Del</th></tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{c.title}</div>
                      {c.details && <div style={{ fontSize: 11, color: "#64748b" }}>{c.details.slice(0, 60)}{c.details.length > 60 ? "…" : ""}</div>}
                    </td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        {c.channels?.map((ch) => <span key={ch} className="badge bg-secondary" style={{ fontSize: 10 }}>{ch}</span>)}
                      </div>
                    </td>
                    <td className="text-center">{c.recipientCount}</td>
                    <td style={{ fontSize: 11, whiteSpace: "nowrap" }}>{new Date(c.sentAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                    <td>
                      <button className="btn btn-outline-danger btn-sm py-0 px-1" style={{ fontSize: 11 }} onClick={() => { if (window.confirm("Delete campaign?")) { deleteCampaign(c.id); refresh(); } }}>Del</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
