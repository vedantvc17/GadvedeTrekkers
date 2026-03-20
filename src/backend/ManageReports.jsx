import { useMemo } from "react";
import { getAllBookings } from "../data/bookingStorage";
import { getAllTransactions } from "../data/transactionStorage";
import { getAllCustomers } from "../data/customerStorage";

/* ─── Pure-SVG chart primitives ─────────────────────────────── */

function BarChart({ data, color = "#198754", height = 180 }) {
  if (!data?.length) return <p className="text-muted" style={{ fontSize: 12 }}>No data</p>;
  const max  = Math.max(...data.map((d) => d.value), 1);
  const padL = 30, padB = 28, padT = 20, padR = 10;
  const W = 400, H = height;
  const innerW = W - padL - padR;
  const innerH = H - padB - padT;
  const bw     = innerW / data.length;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height }}>
      {/* Y-axis grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => {
        const y = padT + innerH * (1 - f);
        return (
          <g key={f}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#e2e8f0" strokeWidth="1" />
            <text x={padL - 4} y={y + 4} textAnchor="end" fontSize="8" fill="#94a3b8">{Math.round(max * f)}</text>
          </g>
        );
      })}
      {/* Bars */}
      {data.map((d, i) => {
        const barH = (d.value / max) * innerH;
        const x    = padL + i * bw + bw * 0.15;
        const y    = padT + innerH - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw * 0.7} height={barH} fill={color} rx="3" opacity="0.85" />
            {d.value > 0 && <text x={x + bw * 0.35} y={y - 4} textAnchor="middle" fontSize="8" fill="#475569">{d.value}</text>}
            <text x={x + bw * 0.35} y={H - 8} textAnchor="middle" fontSize="8" fill="#64748b">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function LineChart({ data, color = "#0891b2", height = 160 }) {
  if (!data?.length) return <p className="text-muted" style={{ fontSize: 12 }}>No data</p>;
  const max  = Math.max(...data.map((d) => d.value), 1);
  const padL = 30, padB = 28, padT = 20, padR = 10;
  const W = 400, H = height;
  const innerW = W - padL - padR;
  const innerH = H - padB - padT;
  const step   = innerW / Math.max(data.length - 1, 1);
  const pts    = data.map((d, i) => `${padL + i * step},${padT + innerH - (d.value / max) * innerH}`);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height }}>
      {[0, 0.5, 1].map((f) => {
        const y = padT + innerH * (1 - f);
        return <line key={f} x1={padL} y1={y} x2={W - padR} y2={y} stroke="#e2e8f0" strokeWidth="1" />;
      })}
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      {data.map((d, i) => {
        const cx = padL + i * step;
        const cy = padT + innerH - (d.value / max) * innerH;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r="4" fill={color} />
            {d.value > 0 && <text x={cx} y={cy - 8} textAnchor="middle" fontSize="8" fill="#475569">{d.value}</text>}
            <text x={cx} y={H - 8} textAnchor="middle" fontSize="8" fill="#64748b">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function PieChart({ data }) {
  if (!data?.length || data.every((d) => d.value === 0))
    return <p className="text-muted" style={{ fontSize: 12 }}>No data</p>;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let cursor   = -Math.PI / 2;
  const cx = 80, cy = 80, r = 65;

  return (
    <div className="adm-pie-wrap">
      <svg viewBox="0 0 160 160" style={{ width: 160, height: 160, flexShrink: 0 }}>
        {data.map((d, i) => {
          if (!d.value) return null;
          const angle = (d.value / total) * 2 * Math.PI;
          const x1 = cx + r * Math.cos(cursor);
          const y1 = cy + r * Math.sin(cursor);
          cursor += angle;
          const x2 = cx + r * Math.cos(cursor);
          const y2 = cy + r * Math.sin(cursor);
          const large = angle > Math.PI ? 1 : 0;
          return (
            <path key={i} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`} fill={d.color} />
          );
        })}
      </svg>
      <ul className="adm-pie-legend">
        {data.map((d, i) => (
          <li key={i}>
            <span style={{ background: d.color }}></span>
            {d.label}: <strong>{d.value}</strong> ({Math.round((d.value / total) * 100)}%)
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Month label helper ── */
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function monthKey(iso) {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
}
function last6Months() {
  const labels = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push({ label: `${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`, key: `${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}` });
  }
  return labels;
}

/* ─── Main component ── */
export default function ManageReports() {
  const bookings     = getAllBookings();
  const transactions = getAllTransactions();
  const customers    = getAllCustomers();

  const months = last6Months();

  /* ── Booking trend (last 6 months) ── */
  const bookingTrend = useMemo(() => {
    const counts = {};
    bookings.forEach((b) => {
      const k = monthKey(b.savedAt || b.bookingDate);
      counts[k] = (counts[k] || 0) + 1;
    });
    return months.map((m) => ({ label: m.label, value: counts[m.key] || 0 }));
  }, [bookings.length]);

  /* ── Revenue trend (last 6 months) ── */
  const revenueTrend = useMemo(() => {
    const totals = {};
    transactions.filter((t) => t.transactionStatus === "SUCCESS").forEach((t) => {
      const k = monthKey(t.createdAt);
      totals[k] = (totals[k] || 0) + (t.grossAmount || 0);
    });
    return months.map((m) => ({ label: m.label, value: totals[m.key] || 0 }));
  }, [transactions.length]);

  /* ── Customer growth (last 6 months) ── */
  const customerGrowth = useMemo(() => {
    const counts = {};
    customers.forEach((c) => {
      const k = monthKey(c.createdAt);
      counts[k] = (counts[k] || 0) + 1;
    });
    return months.map((m) => ({ label: m.label, value: counts[m.key] || 0 }));
  }, [customers.length]);

  /* ── Transaction status pie ── */
  const txnPie = [
    { label: "Success",  value: transactions.filter((t) => t.transactionStatus === "SUCCESS").length,  color: "#22c55e" },
    { label: "Failed",   value: transactions.filter((t) => t.transactionStatus === "FAILED").length,   color: "#ef4444" },
    { label: "Refunded", value: transactions.filter((t) => t.transactionStatus === "REFUNDED").length, color: "#f59e0b" },
  ];

  /* ── Trek popularity ── */
  const trekPopularity = useMemo(() => {
    const counts = {};
    bookings.forEach((b) => { if (b.trekName) counts[b.trekName] = (counts[b.trekName] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label, value]) => ({ label: label.replace(" Trek","").replace(" Fort",""), value }));
  }, [bookings.length]);

  /* ── Payment mode pie ── */
  const paymentPie = useMemo(() => {
    const palette = ["#0891b2","#7c3aed","#f97316","#10b981","#ef4444"];
    const counts = {};
    transactions.forEach((t) => { if (t.paymentMode) counts[t.paymentMode] = (counts[t.paymentMode] || 0) + 1; });
    return Object.entries(counts).map(([label, value], i) => ({ label, value, color: palette[i % palette.length] }));
  }, [transactions.length]);

  const totalRevenue = transactions.filter((t) => t.transactionStatus === "SUCCESS").reduce((s, t) => s + (t.grossAmount || 0), 0);
  const confirmedBookings = bookings.filter((b) => (b.bookingStatus || "CONFIRMED") === "CONFIRMED").length;

  return (
    <div className="adm-page">
      <h3 className="adm-page-title">📊 Reports & Analytics</h3>
      <p className="text-muted mb-4">Visual insights from bookings, revenue, and customer data.</p>

      {/* KPI pills */}
      <div className="adm-kpi-row mb-4">
        <div className="adm-kpi"><span>{bookings.length}</span><small>Total Bookings</small></div>
        <div className="adm-kpi"><span>{confirmedBookings}</span><small>Confirmed</small></div>
        <div className="adm-kpi"><span>{customers.length}</span><small>Customers</small></div>
        <div className="adm-kpi"><span>₹{totalRevenue.toLocaleString("en-IN")}</span><small>Revenue</small></div>
        <div className="adm-kpi"><span>{transactions.length}</span><small>Transactions</small></div>
      </div>

      <div className="adm-reports-grid">

        {/* Booking Trends */}
        <div className="adm-report-card">
          <h6 className="adm-report-title">📅 Booking Trends (Last 6 Months)</h6>
          <BarChart data={bookingTrend} color="#198754" />
        </div>

        {/* Revenue Analytics */}
        <div className="adm-report-card">
          <h6 className="adm-report-title">💰 Revenue Analytics (Last 6 Months, ₹)</h6>
          <BarChart data={revenueTrend} color="#0891b2" />
        </div>

        {/* Customer Growth */}
        <div className="adm-report-card">
          <h6 className="adm-report-title">👥 Customer Growth (Last 6 Months)</h6>
          <LineChart data={customerGrowth} color="#7c3aed" />
        </div>

        {/* Transaction Status */}
        <div className="adm-report-card">
          <h6 className="adm-report-title">💳 Transaction Status Breakdown</h6>
          <PieChart data={txnPie} />
        </div>

        {/* Trek Popularity */}
        <div className="adm-report-card">
          <h6 className="adm-report-title">🥾 Trek Popularity (by Bookings)</h6>
          <BarChart data={trekPopularity} color="#f97316" height={160} />
        </div>

        {/* Payment Modes */}
        <div className="adm-report-card">
          <h6 className="adm-report-title">💳 Payment Modes</h6>
          <PieChart data={paymentPie} />
        </div>

      </div>
    </div>
  );
}
