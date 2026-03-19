import { useState, useMemo } from "react";
import { useAdminData } from "../hooks/useAdminData";

/* ── City-wise predefined pickup locations ── */
const CITY_STOPS = {
  Mumbai:      ["Dadar", "Thane", "Borivali", "Ghatkopar", "Andheri", "Bandra", "CST / CSMT", "Kurla", "Mulund", "Vashi", "Panvel", "Kalyan"],
  Pune:        ["Shivajinagar", "Wakad", "Nigdi", "Katraj", "Kothrud", "Hadapsar", "Pimpri", "Chinchwad", "Hinjewadi", "Swargate", "Deccan", "Kharadi", "Nashik Phata"],
  Nashik:      ["CBS Bus Stand", "Gangapur Road", "Satpur", "Dwarka", "Cidco"],
  Thane:       ["Thane Station (E)", "Thane Station (W)", "Kalwa", "Mulund Naka", "Airoli", "Ghansoli"],
  "Navi Mumbai": ["Vashi", "Nerul", "Belapur", "Panvel", "Kharghar", "Airoli", "Sanpada"],
  Aurangabad:  ["MSRTC Bus Stand", "Jalna Road", "Cidco", "Padegaon"],
  Nagpur:      ["Sitabuldi", "Dharampeth", "Hingna Road", "Kamptee Road", "Reshimbagh"],
  Kolhapur:    ["Mahadwar Road", "Rankala", "Tarabai Park", "MSRTC Stand"],
};

/* ── Pickup Points Field Component ── */
function PickupPointsField({ value, onChange, cities }) {
  const parsed = useMemo(() => {
    try { return JSON.parse(value || "{}"); } catch { return {}; }
  }, [value]);

  const update = (next) => onChange(JSON.stringify(next));

  const toggleCity = (city) => {
    const next = { ...parsed };
    if (next[city]) delete next[city];
    else next[city] = [];
    update(next);
  };

  const addPoint = (city) => {
    const next = { ...parsed, [city]: [...(parsed[city] || []), { time: "", location: "" }] };
    update(next);
  };

  const editPoint = (city, idx, field, val) => {
    const pts = [...(parsed[city] || [])];
    pts[idx] = { ...pts[idx], [field]: val };
    update({ ...parsed, [city]: pts });
  };

  const removePoint = (city, idx) => {
    const pts = (parsed[city] || []).filter((_, i) => i !== idx);
    update({ ...parsed, [city]: pts });
  };

  return (
    <div className="adm-pickups-wrap">
      {/* City selection */}
      <div className="adm-city-list mb-3">
        {cities.map((city) => (
          <label key={city} className="adm-city-check">
            <input
              type="checkbox"
              checked={!!parsed[city]}
              onChange={() => toggleCity(city)}
            />
            {city}
          </label>
        ))}
      </div>

      {/* Per-city pickup points */}
      {Object.keys(parsed).map((city) => (
        <div key={city} className="adm-pickup-city mb-3">
          <div className="adm-pickup-city-header">
            <span>📍 {city}</span>
            <button type="button" className="btn btn-outline-success btn-sm py-0 px-2"
              onClick={() => addPoint(city)}>
              + Add Pickup
            </button>
          </div>
          {(parsed[city] || []).length === 0 && (
            <p className="text-muted small mb-0 mt-1">No pickup points yet — click "+ Add Pickup"</p>
          )}
          {(parsed[city] || []).map((pt, i) => (
            <div key={i} className="adm-pickup-row">
              <input
                className="form-control form-control-sm"
                placeholder="Time (e.g. 09:00 PM)"
                value={pt.time}
                onChange={(e) => editPoint(city, i, "time", e.target.value)}
              />
              <select
                className="form-select form-select-sm"
                value={pt.location}
                onChange={(e) => editPoint(city, i, "location", e.target.value)}
              >
                <option value="">— Select stop —</option>
                {(CITY_STOPS[city] || []).map((stop) => (
                  <option key={stop} value={stop}>{stop}</option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm py-0 px-2"
                onClick={() => removePoint(city, i)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Generic CRUD page ── */
function ManagePage({ title, icon, storageKey, fields, defaultForm, seedData = [] }) {
  const { data, add, update, remove, toggleActive } = useAdminData(storageKey, seedData);
  const [form, setForm]     = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  /* ── helpers ── */
  const openCreate = () => {
    setForm(defaultForm);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setForm(item);
    setEditId(item.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm(defaultForm);
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editId ? update(editId, form) : add(form);
    handleCancel();
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this item?")) remove(id);
  };

  const filtered = data.filter((d) =>
    Object.values(d).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  );

  const previewFields = fields.slice(0, 3);

  return (
    <div className="adm-page">

      {/* Header */}
      <div className="adm-page-header">
        <h3 className="adm-page-title">{icon} {title}</h3>
        <button className="btn btn-success btn-sm px-3" onClick={openCreate}>
          + Add New
        </button>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <div className="adm-form-card">
          <h5 className="mb-4 fw-bold">
            {editId ? `Edit ${title}` : `Add New ${title}`}
          </h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {fields.map((f) => (
                <div className={`col-md-${f.col || 6}`} key={f.key}>
                  <label className="form-label small fw-semibold mb-1">
                    {f.label}
                    {f.required && <span className="text-danger ms-1">*</span>}
                  </label>

                  {f.type === "select" ? (
                    <select
                      className="form-select form-select-sm"
                      value={form[f.key] ?? ""}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      required={f.required}
                    >
                      <option value="">— Select {f.label} —</option>
                      {f.options.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : f.type === "textarea" ? (
                    <textarea
                      className="form-control form-control-sm"
                      rows={3}
                      value={form[f.key] ?? ""}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder || ""}
                      required={f.required}
                    />
                  ) : f.type === "pickups" ? (
                    <PickupPointsField
                      value={form[f.key] ?? "{}"}
                      onChange={(val) => setForm({ ...form, [f.key]: val })}
                      cities={f.cities || []}
                    />
                  ) : (
                    <input
                      type={f.type || "text"}
                      className="form-control form-control-sm"
                      value={form[f.key] ?? ""}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder || ""}
                      required={f.required}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 d-flex gap-2">
              <button type="submit" className="btn btn-success btn-sm px-4">
                {editId ? "Update" : "Save Listing"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      {data.length > 0 && (
        <div className="adm-search-row">
          <input
            className="form-control form-control-sm adm-search"
            placeholder={`Search ${title.toLowerCase()}…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="adm-count-badge">{filtered.length} item{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      )}

      {/* Table */}
      {data.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty-icon">{icon}</div>
          <p className="adm-empty-text">No {title.toLowerCase()} yet.</p>
          <button className="btn btn-success btn-sm" onClick={openCreate}>
            + Add First {title}
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="adm-empty">
          <p className="adm-empty-text">No results for "{search}"</p>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="table table-hover adm-table mb-0">
            <thead>
              <tr>
                {previewFields.map((f) => (
                  <th key={f.key}>{f.label}</th>
                ))}
                <th style={{ width: 80 }}>Status</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  {previewFields.map((f) => (
                    <td
                      key={f.key}
                      className="text-truncate"
                      style={{ maxWidth: 200 }}
                    >
                      {f.key === "image" ? (
                        <img
                          src={item[f.key]}
                          alt=""
                          className="adm-thumb"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      ) : f.type === "pickups" ? (
                        (() => {
                          try {
                            const pts = JSON.parse(item[f.key] || "{}");
                            const cities = Object.keys(pts);
                            return cities.length ? cities.join(", ") : "—";
                          } catch { return "—"; }
                        })()
                      ) : (
                        item[f.key] || "—"
                      )}
                    </td>
                  ))}
                  <td>
                    <button
                      className={`adm-toggle-btn ${item.active !== false ? "adm-toggle-on" : "adm-toggle-off"}`}
                      onClick={() => toggleActive(item.id)}
                      title={item.active !== false ? "Click to take offline" : "Click to go live"}
                    >
                      {item.active !== false ? "Live" : "Off"}
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-primary btn-sm me-1"
                      onClick={() => openEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      Del
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManagePage;
