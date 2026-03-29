import React, { useState } from "react";
import { updateBookingStatus } from "../data/bookingStorage";
import { useBookings } from "../hooks/useBookings";
import { createTransaction } from "../data/transactionStorage";
import { createAlert, recordEmailAlertAttempt } from "../data/notificationStorage";
import DownloadButton from "../components/DownloadButton";
import { logActivity } from "../data/activityLogStorage";
import InfoTooltip from "../components/InfoTooltip";
import { useConfirm } from "../components/ConfirmModal";
import { useToast } from "../components/Toast";

const PAYMENT_OPTIONS = ["", "Debit Card / Credit Card", "UPI", "Net Banking", "Partial Payment"];
const STATUS_OPTIONS  = ["PENDING_APPROVAL", "CONFIRMED", "CANCELLED"];
const SORT_OPTIONS    = [
  { label: "Latest First",    value: "latest" },
  { label: "Oldest First",    value: "oldest" },
  { label: "Amount High→Low", value: "amount-high" },
  { label: "Amount Low→High", value: "amount-low" },
];

export default function ManageBookings() {
  const [search,        setSearch]        = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [statusFilter,  setStatusFilter]  = useState("");
  const [fromDate,      setFromDate]      = useState("");
  const [toDate,        setToDate]        = useState("");
  const [sortBy,        setSortBy]        = useState("latest");
  const [expanded,      setExpanded]      = useState(null);
  const [actionOpen,    setActionOpen]    = useState(null);
  const [actionMsg,     setActionMsg]     = useState("");

  const confirm = useConfirm();
  const toast   = useToast();

  const { bookings, loading, refresh } = useBookings({
    search,
    status:        statusFilter,
    paymentOption,
    fromDate,
    toDate,
    sortBy,
  });

  /* ── Action handlers ── */
  const handleCancelBooking = async (b) => {
    const ok = await confirm({
      title: "Cancel Booking?",
      message: `This will cancel booking ${b.enhancedBookingId || b.bookingId} for ${b.firstName} ${b.lastName}. This action cannot be undone.`,
      confirmText: "Yes, Cancel Booking",
      cancelText: "Keep Booking",
      type: "danger",
    });
    if (!ok) return;
    updateBookingStatus(b.bookingId, "CANCELLED");
    logActivity({
      action: "BOOKING_CANCELLED",
      actionLabel: `Cancelled booking for ${b.firstName} ${b.lastName}`,
      details: `Booking ID: ${b.enhancedBookingId || b.bookingId} | Trek: ${b.trekName || "—"} | Amount: ₹${b.payableNow || b.totalAmount || "—"}`,
      module: "Bookings",
      severity: "warning",
    });
    setActionOpen(null);
    toast.warning(`Booking ${b.enhancedBookingId || b.bookingId} has been cancelled.`);
    refresh();
  };

  const handleResendTicket = (b) => {
    logActivity({
      action: "TICKET_RESENT",
      actionLabel: `Resent ticket to ${b.firstName} ${b.lastName}`,
      details: `Booking ID: ${b.enhancedBookingId || b.bookingId} | Contact: ${b.contactNumber || b.email || "—"}`,
      module: "Bookings",
      severity: "info",
    });
    setActionOpen(null);
    setActionMsg(`Ticket for ${b.firstName} ${b.lastName} (${b.enhancedBookingId || b.bookingId}) has been queued for resend.`);
  };

  const handleTransferTicket = (b) => {
    logActivity({
      action: "BOOKING_TRANSFER_INITIATED",
      actionLabel: `Transfer initiated for ${b.firstName} ${b.lastName}`,
      details: `Booking ID: ${b.enhancedBookingId || b.bookingId} | Trek: ${b.trekName || "—"}`,
      module: "Bookings",
      severity: "info",
    });
    setActionOpen(null);
    setActionMsg(`Transfer request for ${b.enhancedBookingId || b.bookingId} has been initiated. Complete the transfer in the customer profile.`);
  };

  const handleApproveBooking = async (b) => {
    const ok = await confirm({
      title: "Approve Booking?",
      message: `Approve booking for ${b.firstName} ${b.lastName}? This will confirm the booking and send a confirmation email to the customer.`,
      confirmText: "Yes, Approve",
      cancelText: "Not Yet",
      type: "success",
    });
    if (!ok) return;
    updateBookingStatus(b.bookingId, "CONFIRMED");
    createTransaction({
      bookingId: b.bookingId,
      customerId: b.customerId,
      customerName: `${b.firstName} ${b.lastName}`,
      paymentMode: b.paymentOption,
      grossAmount: b.payableNow || 0,
      tax: 0,
      netAmount: b.payableNow || 0,
      transactionStatus: "SUCCESS",
    });
    logActivity({
      action: "BOOKING_APPROVED",
      actionLabel: `Approved booking for ${b.firstName} ${b.lastName}`,
      details: `Booking ID: ${b.enhancedBookingId || b.bookingId} | Trek: ${b.trekName || "—"} | Amount: ₹${b.payableNow || "—"}`,
      module: "Bookings",
      severity: "success",
    });
    createAlert({
      type: "BOOKING",
      title: "Booking Confirmed",
      message: `${b.firstName} ${b.lastName}'s booking for ${b.trekName || "trek"} (${b.enhancedBookingId || b.bookingId}) has been confirmed by admin.`,
      meta: { bookingId: b.bookingId, email: b.email },
    });
    recordEmailAlertAttempt({
      kind: "Booking Confirmation",
      bookingId: b.enhancedBookingId || b.bookingId,
      customerName: `${b.firstName} ${b.lastName}`,
      customerEmail: b.email,
      eventName: b.trekName,
      amount: b.payableNow,
      travelDate: b.travelDate,
      pickupLocation: b.pickupLocation,
    });
    setActionOpen(null);
    toast.success(`Booking ${b.enhancedBookingId || b.bookingId} approved! Confirmation email sent to ${b.email || "customer"}.`);
    refresh();
  };

  const handleRejectBooking = async (b) => {
    const ok = await confirm({
      title: "Reject Booking?",
      message: `Reject and cancel the booking request from ${b.firstName} ${b.lastName}? The customer will be notified.`,
      confirmText: "Yes, Reject",
      cancelText: "Keep Pending",
      type: "danger",
    });
    if (!ok) return;
    updateBookingStatus(b.bookingId, "CANCELLED");
    logActivity({
      action: "BOOKING_REJECTED",
      actionLabel: `Rejected booking for ${b.firstName} ${b.lastName}`,
      details: `Booking ID: ${b.enhancedBookingId || b.bookingId} | Trek: ${b.trekName || "—"}`,
      module: "Bookings",
      severity: "warning",
    });
    setActionOpen(null);
    toast.warning(`Booking ${b.enhancedBookingId || b.bookingId} has been rejected.`);
    refresh();
  };

  const toggleAction = (bookingId) =>
    setActionOpen((prev) => (prev === bookingId ? null : bookingId));

  const bookingStatusBadge = (status) => {
    if (status === "CANCELLED") return "adm-booking-status adm-booking-status--cancelled";
    if (status === "PENDING_APPROVAL") return "adm-booking-status adm-booking-status--pending";
    return "adm-booking-status adm-booking-status--confirmed";
  };

  return (
    <div className="adm-page" onClick={() => setActionOpen(null)}>
      <div className="adm-page-header">
        <h3 className="adm-page-title">
          📋 Bookings
          <InfoTooltip text="All bookings from the website checkout and direct (manual) staff entries. Use filters to drill into specific payment types, statuses, or date ranges." />
        </h3>
        <div className="d-flex align-items-center gap-2">
          <span className="adm-count-badge">{bookings.length} result{bookings.length !== 1 ? "s" : ""}</span>
          <DownloadButton
            getData={() => bookings.map(({ bookingId, enhancedBookingId, firstName, lastName, contactNumber, email, trekName, tickets, departureOrigin, paymentOption, payableNow, totalAmount, bookingStatus, bookingDate }) => ({ bookingId, enhancedBookingId, name: `${firstName} ${lastName}`, contactNumber, email, trekName, tickets, departure: departureOrigin, payment: paymentOption, paid: payableNow, total: totalAmount, status: bookingStatus || "CONFIRMED", date: bookingDate }))}
            filename="bookings"
            title="Bookings Report — Gadvede Trekkers"
          />
        </div>
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
        <select className="form-select form-select-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ flex: 1 }}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" className="form-control form-control-sm" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ flex: 1 }} title="From date" />
        <input type="date" className="form-control form-control-sm" value={toDate}   onChange={(e) => setToDate(e.target.value)}   style={{ flex: 1 }} title="To date" />
        <select className="form-select form-select-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ flex: 1 }}>
          {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {loading && <div className="text-muted small mb-3">Loading bookings…</div>}

      {actionMsg && (
        <div className="alert alert-info py-2 mb-3" style={{ fontSize: 13 }}>
          ℹ️ {actionMsg}
          <button type="button" className="btn-close float-end py-1" onClick={() => setActionMsg("")} />
        </div>
      )}

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
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Tickets</th>
                <th>Paid</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <React.Fragment key={b.bookingId}>
                  <tr>
                    <td style={{ fontFamily: "monospace", fontSize: 12, whiteSpace: "nowrap" }}>
                      <div>{b.enhancedBookingId || b.bookingId}</div>
                      {b.enhancedBookingId && (
                        <div style={{ color: "#94a3b8", fontSize: 11 }}>{b.bookingId}</div>
                      )}
                    </td>
                    <td className="text-truncate" style={{ maxWidth: 160 }}>{b.trekName}</td>
                    <td style={{ fontSize: 13 }}>{b.firstName} {b.lastName}</td>
                    <td style={{ fontSize: 12, whiteSpace: "nowrap" }}>{b.contactNumber}</td>
                    <td className="text-center">{b.tickets}</td>
                    <td><strong>₹{b.payableNow?.toLocaleString("en-IN")}</strong></td>
                    <td>
                      <span className={`badge ${b.paymentOption === "Partial Payment" ? "bg-warning text-dark" : "bg-success"}`} style={{ fontSize: 11 }}>
                        {b.paymentOption === "Partial Payment" ? "Partial" : b.paymentOption}
                      </span>
                    </td>
                    <td>
                      <span className={bookingStatusBadge(b.bookingStatus || "CONFIRMED")}>
                        {b.bookingStatus || "CONFIRMED"}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, whiteSpace: "nowrap" }}>
                      {b.bookingDate || (b.savedAt ? new Date(b.savedAt).toLocaleDateString("en-IN") : "—")}
                    </td>

                    {/* Action column */}
                    <td onClick={(e) => e.stopPropagation()} style={{ paddingRight: 16 }}>
                      <div className="adm-action-wrap">
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-outline-primary btn-sm py-0 px-2"
                            style={{ fontSize: 11 }}
                            onClick={() => setExpanded(expanded === b.bookingId ? null : b.bookingId)}
                          >
                            {expanded === b.bookingId ? "Hide" : "View"}
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm py-0 px-2 adm-action-btn"
                            style={{ fontSize: 11 }}
                            onClick={() => toggleAction(b.bookingId)}
                          >
                            Action ▾
                          </button>
                        </div>

                        {actionOpen === b.bookingId && (
                          <div className="adm-action-dropdown">
                            {(b.bookingStatus === "PENDING_APPROVAL") && (
                              <>
                                <button
                                  className="adm-action-item adm-action-item--success"
                                  onClick={() => handleApproveBooking(b)}
                                >
                                  ✓ Approve Booking
                                </button>
                                <button
                                  className="adm-action-item adm-action-item--danger"
                                  onClick={() => handleRejectBooking(b)}
                                >
                                  ✕ Reject Booking
                                </button>
                              </>
                            )}
                            {(b.bookingStatus === "CONFIRMED") && (
                              <button
                                className="adm-action-item adm-action-item--danger"
                                onClick={() => handleCancelBooking(b)}
                              >
                                ✕ Cancel Booking
                              </button>
                            )}
                            <a
                              className="adm-action-item"
                              href={`/ticket?bookingId=${encodeURIComponent(b.enhancedBookingId || b.bookingId)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: "none", display: "block" }}
                            >
                              🎟 View Ticket
                            </a>
                            <button
                              className="adm-action-item"
                              onClick={() => handleResendTicket(b)}
                            >
                              ✉ Resend Ticket
                            </button>
                            <button
                              className="adm-action-item"
                              onClick={() => handleTransferTicket(b)}
                            >
                              ⇄ Transfer Ticket
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  {expanded === b.bookingId && (
                    <tr key={`${b.bookingId}-detail`}>
                      <td colSpan={10} className="p-0">
                        <div className="adm-booking-detail">
                          <div className="adm-detail-grid">
                            <div><span>Customer ID</span><strong style={{ fontFamily:"monospace", fontSize:11 }}>{b.customerId || "—"}</strong></div>
                            <div><span>Email</span><strong>{b.email || "—"}</strong></div>
                            <div><span>WhatsApp</span><strong>{b.whatsappNumber || b.contactNumber}</strong></div>
                            <div><span>Departure</span><strong>{b.departureOrigin}</strong></div>
                            <div><span>Pickup</span><strong>{b.pickupLocation}</strong></div>
                            <div><span>Travel Date</span><strong>{b.travelDate || b.nextDate || "—"}</strong></div>
                            <div><span>DOB</span><strong>{b.dob || "—"}</strong></div>
                            <div><span>Emergency Contact</span><strong>{b.emergencyContact || "—"}</strong></div>
                            <div><span>Base Amount</span><strong>₹{b.baseAmount?.toLocaleString("en-IN")}</strong></div>
                            <div><span>Tax (5%)</span><strong>₹{b.taxAmount?.toLocaleString("en-IN")}</strong></div>
                            <div><span>Total</span><strong>₹{b.totalAmount?.toLocaleString("en-IN")}</strong></div>
                            <div><span>Payable Now</span><strong>₹{b.payableNow?.toLocaleString("en-IN")}</strong></div>
                            {b.remainingAmount > 0 && (
                              <div><span>Remaining</span><strong>₹{b.remainingAmount?.toLocaleString("en-IN")}</strong></div>
                            )}
                            <div><span>WhatsApp Group</span><strong>{b.whatsappGroupLink ? "Available" : "Not set"}</strong></div>
                            <div><span>Booking Status</span><strong>{b.bookingStatus || "CONFIRMED"}</strong></div>
                          </div>

                          {b.whatsappGroupLink && (
                            <div className="mt-3">
                              <strong style={{ fontSize: 13 }}>WhatsApp Group Link</strong>
                              <div className="mt-1">
                                <a
                                  href={b.whatsappGroupLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: "#059669", fontWeight: 700, fontSize: 12, wordBreak: "break-all" }}
                                >
                                  {b.whatsappGroupLink}
                                </a>
                              </div>
                            </div>
                          )}

                          {b.paymentScreenshot && (
                            <div className="mt-3">
                              <strong style={{ fontSize: 13 }}>Payment Screenshot</strong>
                              <div className="mt-2">
                                <img
                                  src={b.paymentScreenshot}
                                  alt="Payment proof"
                                  style={{ maxHeight: 200, maxWidth: "100%", borderRadius: 6, border: "1px solid #e2e8f0" }}
                                />
                              </div>
                            </div>
                          )}

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
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
