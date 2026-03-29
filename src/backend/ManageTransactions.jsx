import { useMemo, useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import DownloadButton from "../components/DownloadButton";
import { logActivity } from "../data/activityLogStorage";
import InfoTooltip from "../components/InfoTooltip";
import {
  updateTransactionStatus,
  createRefund,
  getRefundsForTransaction,
} from "../data/transactionStorage";

const STATUS_OPTIONS  = ["SUCCESS", "FAILED", "REFUNDED"];
const PAYMENT_MODES   = ["CASH", "UPI", "CARD", "Partial", "NET BANK"];
const SORT_OPTIONS    = [
  { label: "Latest First",    value: "latest" },
  { label: "Oldest First",    value: "oldest" },
  { label: "Amount High→Low", value: "amount-high" },
  { label: "Amount Low→High", value: "amount-low" },
];

const STATUS_BADGE = {
  SUCCESS:  "bg-success",
  FAILED:   "bg-danger",
  REFUNDED: "bg-warning text-dark",
};

export default function ManageTransactions() {
  const [search,      setSearch]      = useState("");
  const [status,      setStatus]      = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [fromDate,    setFromDate]    = useState("");
  const [toDate,      setToDate]      = useState("");
  const [sortBy,      setSortBy]      = useState("latest");

  const [refundTxnId,  setRefundTxnId]  = useState(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundError,  setRefundError]  = useState("");
  const [refundMsg,    setRefundMsg]    = useState("");

  const [expandedTxn,  setExpandedTxn]  = useState(null);

  const { transactions, loading, refresh } = useTransactions({
    search,
    status,
    paymentMode,
    fromDate,
    toDate,
    sortBy,
  });

  const stats = useMemo(() => ({
    success:  transactions.filter((t) => t.transactionStatus === "SUCCESS").length,
    failed:   transactions.filter((t) => t.transactionStatus === "FAILED").length,
    refunded: transactions.filter((t) => t.transactionStatus === "REFUNDED").length,
    revenue:  transactions
      .filter((t) => t.transactionStatus === "SUCCESS")
      .reduce((sum, t) => sum + (t.netAmount || 0), 0),
  }), [transactions]);

  /* ── Refund handler ── */
  const handleRefund = (txnId) => {
    setRefundError("");
    setRefundMsg("");
    const amt = parseFloat(refundAmount);
    if (!amt || amt <= 0) { setRefundError("Enter a valid amount."); return; }
    const result = createRefund({ transactionId: txnId, amount: amt });
    if (result.error) { setRefundError(result.error); return; }
    logActivity({
      action: "REFUND_PROCESSED",
      actionLabel: `Processed refund ₹${amt}`,
      details: `Transaction ID: ${txnId} | Refund ID: ${result.refund.refundId} | Amount: ₹${amt}`,
      module: "Transactions",
      severity: "warning",
    });
    setRefundMsg(`Refund ₹${amt} processed. ID: ${result.refund.refundId}`);
    setRefundAmount("");
    setRefundTxnId(null);
    refresh();
  };

  /* ── Mark failed ── */
  const markFailed = (txnId) => {
    if (window.confirm("Mark this transaction as FAILED?")) {
      logActivity({
        action: "TRANSACTION_MARKED_FAILED",
        actionLabel: `Marked transaction as FAILED`,
        details: `Transaction ID: ${txnId}`,
        module: "Transactions",
        severity: "warning",
      });
      updateTransactionStatus(txnId, "FAILED");
      refresh();
    }
  };

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h3 className="adm-page-title">
          💳 Transactions
          <InfoTooltip text="Each confirmed booking generates a transaction record. Direct (manual) bookings show ₹0 tax. Filter by status, payment mode, or date to reconcile collections." />
        </h3>
        <div className="d-flex align-items-center gap-2">
          <span className="adm-count-badge">{transactions.length} result{transactions.length !== 1 ? "s" : ""}</span>
          <DownloadButton
            getData={() => transactions.map(({ transactionId, bookingId, customerId, customerName, transactionStatus, paymentMode, grossAmount, tax, netAmount, createdAt }) => ({ transactionId, bookingId, customerId, customerName, status: transactionStatus, mode: paymentMode, gross: grossAmount, tax, net: netAmount, date: new Date(createdAt).toLocaleDateString("en-IN") }))}
            filename="transactions"
            title="Transactions Report — Gadvede Trekkers"
          />
        </div>
      </div>

      {loading && <div className="text-muted small mb-2">Loading transactions…</div>}

      {/* Stats row */}
      <div className="adm-txn-stats">
        <div className="adm-txn-stat adm-txn-stat--success">
          <span>{stats.success}</span><small>Success</small>
        </div>
        <div className="adm-txn-stat adm-txn-stat--failed">
          <span>{stats.failed}</span><small>Failed</small>
        </div>
        <div className="adm-txn-stat adm-txn-stat--refunded">
          <span>{stats.refunded}</span><small>Refunded</small>
        </div>
        <div className="adm-txn-stat adm-txn-stat--revenue">
          <span>₹{stats.revenue.toLocaleString("en-IN")}</span><small>Revenue</small>
        </div>
      </div>

      {/* Filters */}
      <div className="adm-filter-bar">
        <input
          className="form-control form-control-sm"
          placeholder="Search by name, booking ID, transaction ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 2 }}
        />
        <select className="form-select form-select-sm" value={status} onChange={(e) => setStatus(e.target.value)} style={{ flex: 1 }}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="form-select form-select-sm" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} style={{ flex: 1 }}>
          <option value="">All Modes</option>
          {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <input type="date" className="form-control form-control-sm" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ flex: 1 }} title="From date" />
        <input type="date" className="form-control form-control-sm" value={toDate}   onChange={(e) => setToDate(e.target.value)}   style={{ flex: 1 }} title="To date" />
        <select className="form-select form-select-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ flex: 1 }}>
          {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {refundMsg && (
        <div className="alert alert-success py-2 mb-3" style={{ fontSize: 13 }}>
          ✅ {refundMsg}
        </div>
      )}

      {transactions.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty-icon">💳</div>
          <p className="adm-empty-text">No transactions found. They appear automatically after bookings are completed.</p>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="table table-hover adm-table mb-0">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Mode</th>
                <th>Gross</th>
                <th>Tax</th>
                <th>Net</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ width: 130 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <>
                  <tr key={t.transactionId}>
                    <td style={{ fontFamily: "monospace", fontSize: 11, whiteSpace: "nowrap" }}>
                      <button
                        className="btn btn-link p-0 text-start"
                        style={{ fontSize: 11, fontFamily: "monospace" }}
                        onClick={() => setExpandedTxn(expandedTxn === t.transactionId ? null : t.transactionId)}
                      >
                        {t.transactionId}
                      </button>
                    </td>
                    <td style={{ fontFamily: "monospace", fontSize: 11 }}>{t.bookingId}</td>
                    <td>
                      <div style={{ fontSize: 13 }}>{t.customerName}</div>
                      {t.customerId && (
                        <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "monospace" }}>{t.customerId}</div>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-secondary" style={{ fontSize: 11 }}>{t.paymentMode}</span>
                    </td>
                    <td><strong>₹{t.grossAmount.toLocaleString("en-IN")}</strong></td>
                    <td style={{ fontSize: 12 }}>₹{t.tax.toLocaleString("en-IN")}</td>
                    <td style={{ fontSize: 12 }}>₹{t.netAmount.toLocaleString("en-IN")}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[t.transactionStatus] || "bg-secondary"}`} style={{ fontSize: 11 }}>
                        {t.transactionStatus}
                      </span>
                    </td>
                    <td style={{ fontSize: 11, whiteSpace: "nowrap" }}>
                      {new Date(t.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        {t.transactionStatus === "SUCCESS" && (
                          <>
                            <button
                              className="btn btn-outline-warning btn-sm py-0 px-2"
                              style={{ fontSize: 11 }}
                              onClick={() => { setRefundTxnId(t.transactionId); setRefundError(""); setRefundMsg(""); setRefundAmount(""); }}
                            >
                              Refund
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm py-0 px-2"
                              style={{ fontSize: 11 }}
                              onClick={() => markFailed(t.transactionId)}
                            >
                              Fail
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Inline refund form */}
                  {refundTxnId === t.transactionId && (
                    <tr key={`${t.transactionId}-refund`}>
                      <td colSpan={10} className="p-0">
                        <div className="adm-refund-panel">
                          <strong>Refund for {t.transactionId}</strong>
                          <span style={{ fontSize: 12, color: "#64748b" }}>
                            Gross: ₹{t.grossAmount} | Already refunded: ₹
                            {getRefundsForTransaction(t.transactionId).reduce((s, r) => s + r.amount, 0)}
                          </span>
                          <div className="d-flex gap-2 align-items-center mt-2">
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              style={{ maxWidth: 140 }}
                              placeholder="Amount (₹)"
                              value={refundAmount}
                              onChange={(e) => setRefundAmount(e.target.value)}
                              min={1}
                              max={t.grossAmount}
                            />
                            <button className="btn btn-warning btn-sm" onClick={() => handleRefund(t.transactionId)}>
                              Process Refund
                            </button>
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => setRefundTxnId(null)}>
                              Cancel
                            </button>
                          </div>
                          {refundError && <p className="text-danger mt-1 mb-0" style={{ fontSize: 12 }}>{refundError}</p>}
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Refund history */}
                  {expandedTxn === t.transactionId && (
                    <tr key={`${t.transactionId}-history`}>
                      <td colSpan={10} className="p-0">
                        <div className="adm-booking-detail">
                          <strong style={{ fontSize: 13 }}>Refund History</strong>
                          {getRefundsForTransaction(t.transactionId).length === 0 ? (
                            <p className="text-muted mb-0 mt-1" style={{ fontSize: 12 }}>No refunds for this transaction.</p>
                          ) : (
                            <table className="table table-sm mt-2 mb-0">
                              <thead><tr><th>Refund ID</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                              <tbody>
                                {getRefundsForTransaction(t.transactionId).map((r) => (
                                  <tr key={r.refundId}>
                                    <td style={{ fontFamily: "monospace", fontSize: 11 }}>{r.refundId}</td>
                                    <td>₹{r.amount.toLocaleString("en-IN")}</td>
                                    <td><span className="badge bg-warning text-dark" style={{ fontSize: 10 }}>{r.status}</span></td>
                                    <td style={{ fontSize: 11 }}>{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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
