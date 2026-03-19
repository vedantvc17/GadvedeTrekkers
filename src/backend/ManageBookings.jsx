import { useState } from "react";
import { queryBookings } from "../data/bookingStorage";

const PAYMENT_OPTIONS = ["", "Debit Card / Credit Card", "UPI", "Net Banking", "Partial Payment"];
const SORT_OPTIONS = [
  { label: "Latest First",    value: "latest" },
  { label: "Oldest First",    value: "oldest" },
  { label: "Amount High→Low", value: "amount-high" },
  { label: "Amount Low→High", value: "amount-low" },
];

export default function ManageBookings() {
  const [search,        setSearch]        = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [fromDate,      setFromDate]      = useState("");
  const [toDate,        setToDate]        = useState("");
  const [sortBy,        setSortBy]        = useState("latest");
  const [expanded,      setExpanded]      = useState(null);

  const bookings = queryBookings({ paymentOption: paymentOption || undefined, fromDate: fromDate || undefined, toDate: toDate || undefined, search: search || undefined, sortBy });

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h3 className="adm-page-title">📋 Bookings</h3>
        <span className="adm-count-badge">{bookings.length} result{bookings.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Filters */}
      <div className="adm-filter-bar">
        <input
          className="form-control form-control-sm"
          placeholder="Search by name, booking ID, phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 2 }}
        />
        <select className="form-select form-select-sm" value={paymentOption} onChange={(e) => setPaymentOption(e.target.value)} style={{ flex: 1 }}>
          <option value="">All Payment Types</option>
          {PAYMENT_OPTIONS.filter(Boolean).map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <input type="date" className="form-control form-control-sm" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ flex: 1 }} title="From date" />
        <input type="date" className="form-control form-control-sm" value={toDate}   onChange={(e) => setToDate(e.target.value)}   style={{ flex: 1 }} title="To date" />
        <select className="form-select form-select-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ flex: 1 }}>
          {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {bookings.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty-icon">📋</div>
          <p className="adm-empty-text">No bookings found. Bookings appear here after customers complete payment.</p>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="table table-hover adm-table mb-0">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Trek</th>
                <th>Customer</th>
                <th>Tickets</th>
                <th>Paid</th>
                <th>Payment</th>
                <th>Date</th>
                <th style={{ width: 80 }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <>
                  <tr key={b.bookingId}>
                    <td style={{ fontFamily: "monospace", fontSize: 12, whiteSpace: "nowrap" }}>
                      <div>{b.enhancedBookingId || b.bookingId}</div>
                      {b.enhancedBookingId && (
                        <div style={{ color: "#94a3b8", fontSize: 11 }}>{b.bookingId}</div>
                      )}
                    </td>
                    <td className="text-truncate" style={{ maxWidth: 160 }}>{b.trekName}</td>
                    <td>
                      <div>{b.firstName} {b.lastName}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{b.contactNumber}</div>
                    </td>
                    <td className="text-center">{b.tickets}</td>
                    <td><strong>₹{b.payableNow?.toLocaleString("en-IN")}</strong></td>
                    <td>
                      <span className={`badge ${b.paymentOption === "Partial Payment" ? "bg-warning text-dark" : "bg-success"}`} style={{ fontSize: 11 }}>
                        {b.paymentOption === "Partial Payment" ? "Partial" : b.paymentOption}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, whiteSpace: "nowrap" }}>
                      {b.bookingDate || (b.savedAt ? new Date(b.savedAt).toLocaleDateString("en-IN") : "—")}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm py-0 px-2"
                        onClick={() => setExpanded(expanded === b.bookingId ? null : b.bookingId)}
                      >
                        {expanded === b.bookingId ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>

                  {expanded === b.bookingId && (
                    <tr key={`${b.bookingId}-detail`}>
                      <td colSpan={8} className="p-0">
                        <div className="adm-booking-detail">
                          <div className="adm-detail-grid">
                            <div><span>Email</span><strong>{b.email || "—"}</strong></div>
                            <div><span>WhatsApp</span><strong>{b.whatsappNumber || b.contactNumber}</strong></div>
                            <div><span>Departure</span><strong>{b.departureOrigin}</strong></div>
                            <div><span>Pickup</span><strong>{b.pickupLocation}</strong></div>
                            <div><span>DOB</span><strong>{b.dob || "—"}</strong></div>
                            <div><span>Emergency Contact</span><strong>{b.emergencyContact || "—"}</strong></div>
                            <div><span>Base Amount</span><strong>₹{b.baseAmount?.toLocaleString("en-IN")}</strong></div>
                            <div><span>Tax (5%)</span><strong>₹{b.taxAmount?.toLocaleString("en-IN")}</strong></div>
                            <div><span>Total</span><strong>₹{b.totalAmount?.toLocaleString("en-IN")}</strong></div>
                            <div><span>Payable Now</span><strong>₹{b.payableNow?.toLocaleString("en-IN")}</strong></div>
                            {b.remainingAmount > 0 && (
                              <div><span>Remaining</span><strong>₹{b.remainingAmount?.toLocaleString("en-IN")}</strong></div>
                            )}
                            <div><span>Trek Date</span><strong>{b.nextDate || "—"}</strong></div>
                          </div>

                          {b.additionalTravelers?.length > 0 && (
                            <div className="mt-3">
                              <strong style={{ fontSize: 13 }}>Additional Travelers</strong>
                              <div className="adm-traveler-list mt-1">
                                {b.additionalTravelers.map((t, i) => (
                                  <span key={i} className="adm-traveler-tag">
                                    {t.firstName} {t.lastName} — {t.departureOrigin} / {t.pickupLocation}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
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
    </div>
  );
}
