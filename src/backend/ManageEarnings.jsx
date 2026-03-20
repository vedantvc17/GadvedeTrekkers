import { useState, useMemo } from "react";
import {
  getAllEarnings, saveEarning, deleteEarning,
  queryEarnings, getEarningsSummary, computeProfit,
} from "../data/earningsStorage";
import DownloadButton from "../components/DownloadButton";

/* ── Constants ── */
const REVENUE_TYPES = [
  "Trek / Tour",
  "Tent Rental",
  "Villa Rental",
  "Camping",
  "College IV",
];

const TYPE_CLASS = {
  "Trek / Tour": "trek",
  "Tent Rental": "rental",
  "Villa Rental": "villa",
  "Camping":     "camping",
  "College IV":  "college",
};

const TYPE_ICON = {
  "Trek / Tour": "🥾",
  "Tent Rental": "⛺",
  "Villa Rental": "🏡",
  "Camping":     "🔥",
  "College IV":  "🎓",
};

const PAYMENT_STATUSES = ["PAID", "PENDING", "PARTIAL"];

function fmt(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

/* ── Blank form ── */
const BLANK = {
  revenueType: "Trek / Tour",
  clientName: "",
  date: new Date().toISOString().slice(0, 10),
  paymentStatus: "PAID",
  notes: "",
  /* Trek */
  trekName: "", trekLeaderName: "",
  trekRevenue: "", transportCost: "", foodCost: "", trekOtherExpenses: "",
  /* Tent */
  tentQty: "", rentPerTent: "", durationDays: "", tentMaintenance: "",
  /* Villa */
  villaName: "", villaRentPerDay: "", villaDays: "", villaServiceCharges: "",
  /* Camping */
  campingLocation: "", campingPerPerson: "", campingParticipants: "", campingSetup: "", campingFoodLogistics: "",
  /* College IV */
  collegeName: "", collegePkgPerStudent: "", collegeStudents: "", collegeCost: "",
  /* Common extras */
  trekLeaderPay: "", vendorCosts: "",
  bookingType: "Own",
};

/* ─────────────────────────────────────────────
   PURE-SVG charts
───────────────────────────────────────────── */
function PieChart({ data }) {
  /* data = [{ label, value, color }] */
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return <div style={{ color: "#94a3b8", textAlign: "center", padding: 20, fontSize: 13 }}>No data</div>;

  let cursor = 0;
  const slices = data.map((d) => {
    const pct = d.value / total;
    const start = cursor;
    cursor += pct;
    return { ...d, pct, start };
  });

  const r = 60; const cx = 80; const cy = 80;
  function arc(start, end) {
    const s = { x: cx + r * Math.cos(2 * Math.PI * start - Math.PI / 2), y: cy + r * Math.sin(2 * Math.PI * start - Math.PI / 2) };
    const e = { x: cx + r * Math.cos(2 * Math.PI * end   - Math.PI / 2), y: cy + r * Math.sin(2 * Math.PI * end   - Math.PI / 2) };
    const large = end - start > 0.5 ? 1 : 0;
    return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <svg width={160} height={160} viewBox="0 0 160 160">
        {slices.map((s, i) => (
          <path key={i} d={arc(s.start, s.start + s.pct)} fill={s.color} stroke="#fff" strokeWidth={1} />
        ))}
      </svg>
      <div style={{ flex: 1 }}>
        {slices.map((s, i) => (
          <div key={i} className="earn-insight-bar" style={{ marginBottom: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0, display: "inline-block" }} />
            <span className="earn-insight-bar-label" style={{ width: "auto", flex: 1, paddingLeft: 6 }}>{s.label}</span>
            <span className="earn-insight-bar-val">{(s.pct * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart({ data, color = "#22c55e" }) {
  /* data = [{ label, value }] */
  const max = Math.max(...data.map((d) => d.value), 1);
  const W = 360; const H = 140; const PAD = { t: 10, r: 10, b: 32, l: 50 };
  const iW = W - PAD.l - PAD.r;
  const iH = H - PAD.t - PAD.b;
  const bW = Math.max(4, iW / data.length - 6);

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
      {/* Y gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => {
        const y = PAD.t + iH * (1 - f);
        return <g key={f}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} stroke="#f1f5f9" strokeWidth={1} />
          <text x={PAD.l - 4} y={y + 4} fontSize={8} fill="#94a3b8" textAnchor="end">
            {(max * f / 1000).toFixed(0)}k
          </text>
        </g>;
      })}
      {data.map((d, i) => {
        const bH = iH * (d.value / max);
        const x = PAD.l + i * (iW / data.length) + (iW / data.length - bW) / 2;
        const y = PAD.t + iH - bH;
        return <g key={i}>
          <rect x={x} y={y} width={bW} height={bH} rx={2} fill={color} opacity={0.85} />
          <text x={x + bW / 2} y={H - PAD.b + 14} fontSize={8} fill="#64748b" textAnchor="middle">{d.label}</text>
        </g>;
      })}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Dynamic form fields per revenue type
───────────────────────────────────────────── */
function RevenueFields({ form, setForm }) {
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const calc = computeProfit(form);

  const numInput = (label, key, placeholder = "0") => (
    <div className="mb-2">
      <label className="form-label" style={{ fontSize: 12 }}>{label}</label>
      <input type="number" className="form-control form-control-sm" placeholder={placeholder}
        value={form[key]} onChange={set(key)} min={0} />
    </div>
  );

  let fields = null;
  switch (form.revenueType) {
    case "Trek / Tour":
      fields = <>
        <div className="mb-2">
          <label className="form-label" style={{ fontSize: 12 }}>Trek Name</label>
          <input className="form-control form-control-sm" value={form.trekName} onChange={set("trekName")} placeholder="e.g. Rajmachi Fort" />
        </div>
        <div className="mb-2">
          <label className="form-label" style={{ fontSize: 12 }}>Trek Leader Name</label>
          <input className="form-control form-control-sm" value={form.trekLeaderName} onChange={set("trekLeaderName")} />
        </div>
        <div className="earn-form-section">Revenue</div>
        {numInput("Total Revenue Collected (₹)", "trekRevenue")}
        <div className="earn-form-section">Expenses</div>
        {numInput("Transport Cost (₹)", "transportCost")}
        {numInput("Food Cost (₹)", "foodCost")}
        {numInput("Other Expenses (₹)", "trekOtherExpenses")}
      </>;
      break;

    case "Tent Rental":
      fields = <>
        <div className="earn-form-section">Rental Details</div>
        {numInput("Number of Tents", "tentQty", "10")}
        {numInput("Rent per Tent (₹/night)", "rentPerTent", "500")}
        {numInput("Duration (Days)", "durationDays", "1")}
        <div className="earn-form-section">Expenses</div>
        {numInput("Maintenance Cost (₹)", "tentMaintenance")}
      </>;
      break;

    case "Villa Rental":
      fields = <>
        <div className="mb-2">
          <label className="form-label" style={{ fontSize: 12 }}>Villa Name</label>
          <input className="form-control form-control-sm" value={form.villaName} onChange={set("villaName")} />
        </div>
        <div className="earn-form-section">Rental Details</div>
        {numInput("Rent per Day (₹)", "villaRentPerDay")}
        {numInput("Number of Days", "villaDays", "1")}
        <div className="earn-form-section">Expenses</div>
        {numInput("Cleaning / Service Charges (₹)", "villaServiceCharges")}
      </>;
      break;

    case "Camping":
      fields = <>
        <div className="mb-2">
          <label className="form-label" style={{ fontSize: 12 }}>Location</label>
          <input className="form-control form-control-sm" value={form.campingLocation} onChange={set("campingLocation")} />
        </div>
        <div className="earn-form-section">Revenue</div>
        {numInput("Charge per Person (₹)", "campingPerPerson")}
        {numInput("Total Participants", "campingParticipants")}
        <div className="earn-form-section">Expenses</div>
        {numInput("Setup Cost (₹)", "campingSetup")}
        {numInput("Food + Logistics Cost (₹)", "campingFoodLogistics")}
      </>;
      break;

    case "College IV":
      fields = <>
        <div className="mb-2">
          <label className="form-label" style={{ fontSize: 12 }}>College / Institution Name</label>
          <input className="form-control form-control-sm" value={form.collegeName} onChange={set("collegeName")} />
        </div>
        <div className="earn-form-section">Package</div>
        {numInput("Package Cost per Student (₹)", "collegePkgPerStudent")}
        {numInput("Number of Students", "collegeStudents")}
        <div className="earn-form-section">Total Cost (Transport + Stay + Food)</div>
        {numInput("Total Cost (₹)", "collegeCost")}
      </>;
      break;

    default: break;
  }

  return (
    <>
      {fields}

      {/* Common extras */}
      <div className="earn-form-section">Common Extras</div>
      <div className="mb-2">
        <label className="form-label" style={{ fontSize: 12 }}>Booking Type</label>
        <select className="form-select form-select-sm" value={form.bookingType} onChange={set("bookingType")}>
          <option>Own</option>
          <option>B2B Operator</option>
        </select>
      </div>
      {numInput("Trek Leader Pay (₹)", "trekLeaderPay")}
      {numInput("Vendor Costs (₹)", "vendorCosts")}

      {/* Live calculation */}
      <div className="earn-calc-box">
        <div className="earn-calc-row"><span>Total Revenue</span><strong>{fmt(calc.revenue)}</strong></div>
        <div className="earn-calc-row"><span>Total Expenses</span><strong>{fmt(calc.expenses)}</strong></div>
        <div className={`earn-calc-total ${calc.profit < 0 ? "earn-calc-loss" : ""}`}>
          <span>Net Profit</span><strong>{fmt(calc.profit)}</strong>
        </div>
      </div>
    </>
  );
}

/* ═════════════════════════════════════════════
   Main ManageEarnings component
═════════════════════════════════════════════ */
export default function ManageEarnings() {
  const [tab,          setTab]          = useState("dashboard"); // dashboard | add | records | insights
  const [search,       setSearch]       = useState("");
  const [typeFilter,   setTypeFilter]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate,     setFromDate]     = useState("");
  const [toDate,       setToDate]       = useState("");
  const [form,         setForm]         = useState({ ...BLANK });
  const [editId,       setEditId]       = useState(null);
  const [tick,         setTick]         = useState(0);
  const [expanded,     setExpanded]     = useState(null);
  const [saveMsg,      setSaveMsg]      = useState("");

  const refresh = () => setTick((t) => t + 1);

  const summary = useMemo(() => getEarningsSummary(), [tick]);
  const records = queryEarnings({
    revenueType: typeFilter || undefined,
    paymentStatus: statusFilter || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    search: search || undefined,
  });

  /* ── Handlers ── */
  const startAdd = () => { setForm({ ...BLANK }); setEditId(null); setTab("add"); setSaveMsg(""); };
  const startEdit = (e) => {
    setForm({ ...BLANK, ...e });
    setEditId(e.earningId);
    setTab("add");
    setSaveMsg("");
  };

  const handleSave = () => {
    const required = form.clientName.trim() && form.date;
    if (!required) { setSaveMsg("Client name and date are required."); return; }
    saveEarning({ ...form, earningId: editId || undefined });
    refresh();
    setSaveMsg(editId ? "Record updated." : "Record saved.");
    setTimeout(() => { setTab("records"); setSaveMsg(""); }, 800);
    if (!editId) setForm({ ...BLANK });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this earnings record?")) return;
    deleteEarning(id);
    refresh();
  };

  /* ── KPI data ── */
  const PIE_COLORS = { "Trek / Tour": "#3b82f6", "Tent Rental": "#a78bfa", "Villa Rental": "#f472b6", "Camping": "#34d399", "College IV": "#fbbf24" };
  const pieData = Object.entries(summary.byType).map(([label, d]) => ({ label, value: d.revenue, color: PIE_COLORS[label] || "#94a3b8" }));
  const monthlyBar = Object.entries(summary.monthly).map(([label, value]) => ({ label, value }));

  /* ── Utilization / insights ── */
  const maxByType = Math.max(...Object.values(summary.byType).map((d) => d.revenue), 1);

  return (
    <div className="adm-page">

      {/* ── Page header ── */}
      <div className="adm-page-header">
        <h3 className="adm-page-title">💰 Earnings</h3>
        <div className="d-flex gap-2 align-items-center">
          <span className="adm-count-badge">{summary.count} records</span>
          <DownloadButton
            getData={() => getAllEarnings().map((e) => ({
              id: e.earningId, type: e.revenueType, client: e.clientName,
              date: e.date, revenue: e.revenue, expenses: e.expenses,
              profit: e.profit, status: e.paymentStatus,
            }))}
            filename="earnings"
            title="Earnings Report — Gadvede Trekkers"
          />
          <button className="btn btn-success btn-sm" onClick={startAdd}>+ Add Earning</button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="earn-tabs">
        {[["dashboard","📊 Dashboard"], ["add","✏️ " + (editId ? "Edit" : "Add")], ["records","📋 Records"], ["insights","💡 Insights"]].map(([t, l]) => (
          <button key={t} className={`earn-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          TAB: DASHBOARD
      ══════════════════════════════════════════ */}
      {tab === "dashboard" && (
        <>
          {/* KPI row */}
          <div className="earn-kpi-row">
            <div className="earn-kpi">
              <div className="earn-kpi-icon">💵</div>
              <div className="earn-kpi-val">{fmt(summary.totalRevenue)}</div>
              <div className="earn-kpi-label">Total Revenue</div>
            </div>
            <div className="earn-kpi">
              <div className="earn-kpi-icon">📉</div>
              <div className="earn-kpi-val">{fmt(summary.totalExpenses)}</div>
              <div className="earn-kpi-label">Total Expenses</div>
            </div>
            <div className="earn-kpi">
              <div className="earn-kpi-icon">📈</div>
              <div className="earn-kpi-val" style={{ color: summary.totalProfit >= 0 ? "#22c55e" : "#ef4444" }}>{fmt(summary.totalProfit)}</div>
              <div className="earn-kpi-label">Net Profit</div>
            </div>
            <div className="earn-kpi">
              <div className="earn-kpi-icon">⏳</div>
              <div className="earn-kpi-val" style={{ color: "#f59e0b" }}>{fmt(summary.pending)}</div>
              <div className="earn-kpi-label">Pending Payments</div>
            </div>
            <div className="earn-kpi">
              <div className="earn-kpi-icon">📁</div>
              <div className="earn-kpi-val">{summary.count}</div>
              <div className="earn-kpi-label">Total Records</div>
            </div>
          </div>

          {/* Source cards */}
          <div className="earn-source-row">
            {REVENUE_TYPES.map((rt) => {
              const d = summary.byType[rt] || { revenue: 0, count: 0 };
              return (
                <div key={rt} className={`earn-source-card ${TYPE_CLASS[rt]}`} data-icon={TYPE_ICON[rt]}>
                  <div className="earn-source-type">{rt}</div>
                  <div className="earn-source-amt">{fmt(d.revenue)}</div>
                  <div className="earn-source-count">{d.count || 0} records</div>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>Revenue by Type</div>
              <PieChart data={pieData} />
            </div>
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>Monthly Revenue (Last 6 Months)</div>
              <BarChart data={monthlyBar} color="#22c55e" />
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════
          TAB: ADD / EDIT
      ══════════════════════════════════════════ */}
      {tab === "add" && (
        <div className="earn-form-grid">
          {/* Left: basic info */}
          <div className="earn-form-card">
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>
              {editId ? "Edit Earning Record" : "New Earning Record"}
            </div>

            <div className="mb-2">
              <label className="form-label" style={{ fontSize: 12 }}>Revenue Type *</label>
              <select className="form-select form-select-sm" value={form.revenueType}
                onChange={(e) => setForm((f) => ({ ...BLANK, revenueType: e.target.value, clientName: f.clientName, date: f.date, paymentStatus: f.paymentStatus, notes: f.notes }))}>
                {REVENUE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="mb-2">
              <label className="form-label" style={{ fontSize: 12 }}>Client / Group Name *</label>
              <input className="form-control form-control-sm" value={form.clientName}
                onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))} />
            </div>

            <div className="mb-2">
              <label className="form-label" style={{ fontSize: 12 }}>Date *</label>
              <input type="date" className="form-control form-control-sm" value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
            </div>

            <div className="mb-2">
              <label className="form-label" style={{ fontSize: 12 }}>Payment Status</label>
              <select className="form-select form-select-sm" value={form.paymentStatus}
                onChange={(e) => setForm((f) => ({ ...f, paymentStatus: e.target.value }))}>
                {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ fontSize: 12 }}>Notes</label>
              <textarea className="form-control form-control-sm" rows={2} value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-success btn-sm" onClick={handleSave}>
                {editId ? "Update Record" : "Save Record"}
              </button>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => setTab("records")}>Cancel</button>
            </div>
            {saveMsg && <div className="alert alert-info py-1 mt-2" style={{ fontSize: 13 }}>{saveMsg}</div>}
          </div>

          {/* Right: dynamic revenue-type fields */}
          <div className="earn-form-card">
            <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>{TYPE_ICON[form.revenueType]}</span>
              {form.revenueType} Details
            </div>
            <RevenueFields form={form} setForm={setForm} />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          TAB: RECORDS
      ══════════════════════════════════════════ */}
      {tab === "records" && (
        <>
          {/* Filters */}
          <div className="adm-filter-bar">
            <input className="form-control form-control-sm" placeholder="Search client, ID, trek…"
              value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 2 }} />
            <select className="form-select form-select-sm" value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)} style={{ flex: 1 }}>
              <option value="">All Types</option>
              {REVENUE_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <select className="form-select form-select-sm" value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)} style={{ flex: 1 }}>
              <option value="">All Statuses</option>
              {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <input type="date" className="form-control form-control-sm" value={fromDate}
              onChange={(e) => setFromDate(e.target.value)} style={{ flex: 1 }} title="From" />
            <input type="date" className="form-control form-control-sm" value={toDate}
              onChange={(e) => setToDate(e.target.value)} style={{ flex: 1 }} title="To" />
          </div>

          {records.length === 0 ? (
            <div className="adm-empty">
              <div className="adm-empty-icon">💰</div>
              <p className="adm-empty-text">No earnings records found.</p>
            </div>
          ) : (
            <div className="adm-table-wrap">
              <table className="table table-hover adm-table mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Client / Group</th>
                    <th>Date</th>
                    <th>Revenue</th>
                    <th>Expenses</th>
                    <th>Net Profit</th>
                    <th>Status</th>
                    <th style={{ width: 100 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((e) => (
                    <>
                      <tr key={e.earningId}>
                        <td style={{ fontFamily: "monospace", fontSize: 11 }}>{e.earningId}</td>
                        <td>
                          <span className={`earn-type-badge earn-type-${TYPE_CLASS[e.revenueType] || "trek"}`}>
                            {TYPE_ICON[e.revenueType]} {e.revenueType}
                          </span>
                        </td>
                        <td style={{ fontSize: 13 }}>{e.clientName}</td>
                        <td style={{ fontSize: 12 }}>{e.date}</td>
                        <td><strong>{fmt(e.revenue)}</strong></td>
                        <td style={{ color: "#64748b" }}>{fmt(e.expenses)}</td>
                        <td>
                          <span className={e.profit >= 0 ? "earn-profit-pos" : "earn-profit-neg"}>
                            {e.profit >= 0 ? "+" : ""}{fmt(e.profit)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${e.paymentStatus === "PAID" ? "bg-success" : e.paymentStatus === "PARTIAL" ? "bg-warning text-dark" : "bg-danger"}`} style={{ fontSize: 10 }}>
                            {e.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button className="btn btn-outline-primary btn-sm py-0 px-2" style={{ fontSize: 11 }}
                              onClick={() => setExpanded(expanded === e.earningId ? null : e.earningId)}>
                              {expanded === e.earningId ? "Hide" : "View"}
                            </button>
                            <button className="btn btn-outline-secondary btn-sm py-0 px-2" style={{ fontSize: 11 }}
                              onClick={() => startEdit(e)}>
                              Edit
                            </button>
                            <button className="btn btn-outline-danger btn-sm py-0 px-2" style={{ fontSize: 11 }}
                              onClick={() => handleDelete(e.earningId)}>
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>

                      {expanded === e.earningId && (
                        <tr key={`${e.earningId}-detail`}>
                          <td colSpan={9} className="p-0">
                            <div className="adm-booking-detail">
                              <div className="adm-detail-grid">
                                {e.trekName      && <div><span>Trek</span><strong>{e.trekName}</strong></div>}
                                {e.trekLeaderName && <div><span>Leader</span><strong>{e.trekLeaderName}</strong></div>}
                                {e.villaName     && <div><span>Villa</span><strong>{e.villaName}</strong></div>}
                                {e.collegeName   && <div><span>College</span><strong>{e.collegeName}</strong></div>}
                                {e.campingLocation && <div><span>Location</span><strong>{e.campingLocation}</strong></div>}
                                {Number(e.trekLeaderPay) > 0 && <div><span>Leader Pay</span><strong>{fmt(e.trekLeaderPay)}</strong></div>}
                                {Number(e.vendorCosts) > 0   && <div><span>Vendor Costs</span><strong>{fmt(e.vendorCosts)}</strong></div>}
                                <div><span>Booking Type</span><strong>{e.bookingType || "Own"}</strong></div>
                                {e.notes && <div style={{ gridColumn: "1/-1" }}><span>Notes</span><strong>{e.notes}</strong></div>}
                                <div><span>Created</span><strong style={{ fontSize: 11 }}>{e.createdAt ? new Date(e.createdAt).toLocaleString("en-IN") : "—"}</strong></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════
          TAB: INSIGHTS
      ══════════════════════════════════════════ */}
      {tab === "insights" && (
        <>
          {/* Profit margin per category */}
          <div className="earn-insights-grid">
            <div className="earn-insight">
              <div className="earn-insight-title">Revenue by Category</div>
              {REVENUE_TYPES.map((rt) => {
                const d = summary.byType[rt] || { revenue: 0 };
                const pct = maxByType > 0 ? (d.revenue / maxByType) * 100 : 0;
                return (
                  <div key={rt} className="earn-insight-bar">
                    <span className="earn-insight-bar-label">{TYPE_ICON[rt]} {rt.split(" ")[0]}</span>
                    <div className="earn-insight-bar-track">
                      <div className="earn-insight-bar-fill" style={{ width: pct + "%", background: `linear-gradient(90deg, ${PIE_COLORS[rt]}, ${PIE_COLORS[rt]}88)` }} />
                    </div>
                    <span className="earn-insight-bar-val">{fmt(d.revenue)}</span>
                  </div>
                );
              })}
            </div>

            <div className="earn-insight">
              <div className="earn-insight-title">Profit Margin by Category</div>
              {REVENUE_TYPES.map((rt) => {
                const d = summary.byType[rt] || { revenue: 0, profit: 0 };
                const margin = d.revenue > 0 ? (d.profit / d.revenue) * 100 : 0;
                return (
                  <div key={rt} className="earn-insight-bar">
                    <span className="earn-insight-bar-label">{TYPE_ICON[rt]} {rt.split(" ")[0]}</span>
                    <div className="earn-insight-bar-track">
                      <div className="earn-insight-bar-fill" style={{
                        width: Math.max(0, Math.min(100, margin)) + "%",
                        background: margin >= 50 ? "linear-gradient(90deg,#22c55e,#86efac)" : margin >= 20 ? "linear-gradient(90deg,#f59e0b,#fcd34d)" : "linear-gradient(90deg,#ef4444,#fca5a5)"
                      }} />
                    </div>
                    <span className="earn-insight-bar-val">{margin.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>

            <div className="earn-insight">
              <div className="earn-insight-title">Best Earners (This Data)</div>
              {Object.entries(summary.byType)
                .sort((a, b) => b[1].revenue - a[1].revenue)
                .slice(0, 5)
                .map(([rt, d]) => (
                  <div key={rt} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
                    <span style={{ color: "#475569" }}>{TYPE_ICON[rt]} {rt}</span>
                    <strong style={{ color: "#1e293b" }}>{fmt(d.revenue)}</strong>
                  </div>
                ))
              }
              {Object.keys(summary.byType).length === 0 && <div style={{ color: "#94a3b8", fontSize: 12 }}>No data yet</div>}
            </div>

            <div className="earn-insight">
              <div className="earn-insight-title">Seasonal Analysis (Monthly Revenue)</div>
              <BarChart data={monthlyBar} color="#3b82f6" />
            </div>
          </div>
        </>
      )}

    </div>
  );
}

/* expose constant for insight pie colors */
const PIE_COLORS = { "Trek / Tour": "#3b82f6", "Tent Rental": "#a78bfa", "Villa Rental": "#f472b6", "Camping": "#34d399", "College IV": "#fbbf24" };
