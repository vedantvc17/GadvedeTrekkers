/**
 * WebsiteNotificationBridge
 *
 * Orchestrates alert delivery across two channels:
 *
 *   granted  → Browser Notification API.
 *              markAlertSeen() is called ONLY after new Notification() succeeds.
 *
 *   denied   → In-app panel (bottom-left stack).
 *              markAlertSeen() is called ONLY when the user explicitly dismisses.
 *
 *   default  → In-app panel shown immediately so no alert is lost.
 *              A "Enable notifications" prompt lets the user grant permission.
 *              On grant, the polling loop restarts and flushes the pending queue
 *              through the browser channel automatically (retry mechanism).
 *
 * The rule that drives correctness:
 *   markAlertSeen() is NEVER called before confirmed delivery.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { getAlerts, getSeenAlertIds, markAlertSeen } from "../data/notificationStorage";

/* ─── Browser notification helper ───────────────────────────────────────────
   Returns true only when the OS notification was successfully created.
   markAlertSeen is called here so the call-site stays free of side-effects.   */
function tryShowBrowserNotification(alert) {
  if (typeof Notification === "undefined") return false;
  if (Notification.permission !== "granted")  return false;
  try {
    new Notification(alert.title, {
      body:  alert.message,
      tag:   alert.id,          // prevents duplicate OS toasts for the same alert
      icon:  "/gadvedelogo.png",
    });
    markAlertSeen(alert.id);   // ← only reaches here on confirmed delivery
    return true;
  } catch {
    // new Notification() can still throw in some iframe / sandboxed contexts.
    return false;
  }
}

/* ─── In-app panel styles ────────────────────────────────────────────────── */
const TYPE_STYLES = {
  INFO:    { bg: "#1e40af", border: "#1e3a8a", icon: "ℹ️"  },
  WARNING: { bg: "#92400e", border: "#78350f", icon: "⚠️"  },
  ERROR:   { bg: "#991b1b", border: "#7f1d1d", icon: "❌"  },
  BOOKING: { bg: "#166534", border: "#14532d", icon: "📋"  },
  EMAIL:   { bg: "#6b21a8", border: "#581c87", icon: "✉️"  },
  default: { bg: "#1e293b", border: "#0f172a", icon: "🔔"  },
};

/* ─── In-app notification panel ──────────────────────────────────────────── */
function InAppPanel({ alerts, onDismiss, onDismissAll, permission, onRequestPermission }) {
  if (alerts.length === 0 && permission !== "default") return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      style={{
        position:        "fixed",
        bottom:          24,
        left:            24,
        zIndex:          999998,
        display:         "flex",
        flexDirection:   "column-reverse",
        gap:             8,
        maxWidth:        360,
        width:           "calc(100vw - 48px)",
        pointerEvents:   "none",     // container is pass-through …
      }}
    >
      {/* ── Permission prompt ── */}
      {permission === "default" && (
        <div
          style={{
            pointerEvents:  "auto",
            background:     "#0f172a",
            border:         "1px solid #334155",
            borderRadius:   10,
            padding:        "10px 14px",
            color:          "#94a3b8",
            fontSize:       12,
            display:        "flex",
            alignItems:     "center",
            gap:            10,
            boxShadow:      "0 8px 24px rgba(0,0,0,0.4)",
            animation:      "notifSlideIn 0.25s ease",
          }}
        >
          <span>🔔</span>
          <span style={{ flex: 1, lineHeight: 1.4 }}>
            Enable browser notifications to receive alerts in the background.
          </span>
          <button
            onClick={onRequestPermission}
            style={{
              background:   "#3b82f6",
              border:       "none",
              borderRadius: 6,
              color:        "#fff",
              fontSize:     11,
              fontWeight:   700,
              padding:      "5px 11px",
              cursor:       "pointer",
              whiteSpace:   "nowrap",
              flexShrink:   0,
            }}
          >
            Enable
          </button>
        </div>
      )}

      {/* ── Alert cards (newest at bottom, max 5 visible) ── */}
      {alerts.slice(0, 5).map((alert) => {
        const s = TYPE_STYLES[alert.type] || TYPE_STYLES.default;
        return (
          <div
            key={alert.id}
            role="alert"
            style={{
              pointerEvents: "auto",
              background:    s.bg,
              border:        `1px solid ${s.border}`,
              borderRadius:  10,
              padding:       "12px 14px",
              color:         "#fff",
              boxShadow:     "0 8px 24px rgba(0,0,0,0.35)",
              animation:     "notifSlideIn 0.25s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{s.icon}</span>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>
                  {alert.title}
                </div>
                {alert.message && (
                  <div style={{ opacity: 0.85, fontSize: 12, lineHeight: 1.4 }}>
                    {alert.message}
                  </div>
                )}
                <div style={{ opacity: 0.4, fontSize: 11, marginTop: 4 }}>
                  {new Date(alert.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit", minute: "2-digit",
                  })}
                </div>
              </div>

              {/* Dismiss — this is the ONLY place markAlertSeen is called for in-app alerts */}
              <button
                aria-label="Dismiss notification"
                onClick={() => onDismiss(alert.id)}
                style={{
                  background: "none",
                  border:     "none",
                  color:      "rgba(255,255,255,0.5)",
                  cursor:     "pointer",
                  fontSize:   20,
                  lineHeight: 1,
                  padding:    0,
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>
          </div>
        );
      })}

      {/* ── Dismiss-all shortcut when there are multiple alerts ── */}
      {alerts.length > 1 && (
        <div style={{ textAlign: "right", pointerEvents: "auto" }}>
          <button
            onClick={onDismissAll}
            style={{
              background: "none",
              border:     "none",
              color:      "rgba(255,255,255,0.35)",
              fontSize:   11,
              cursor:     "pointer",
              padding:    "2px 0",
            }}
          >
            Dismiss all ({alerts.length})
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Main bridge ────────────────────────────────────────────────────────── */
export default function WebsiteNotificationBridge() {
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  );
  const [inAppAlerts, setInAppAlerts] = useState([]);

  // Stable ref to the current seen-set so callbacks never close over stale data.
  const seenRef = useRef(new Set(getSeenAlertIds()));

  /* Returns unseen alerts, refreshing seenRef from localStorage each time.
     This correctly picks up marks made by other tabs (storage event). */
  const getUnseen = useCallback(() => {
    const seen = new Set(getSeenAlertIds());
    seenRef.current = seen;
    return getAlerts().filter((a) => !seen.has(a.id));
  }, []);

  /* ── Explicit permission request (called from in-app prompt button) ── */
  const requestPermission = useCallback(async () => {
    if (typeof Notification === "undefined") return;
    const next = await Notification.requestPermission();
    setPermission(next);
    // processAlerts re-runs automatically because its dependency (permission)
    // changes, which restarts the useEffect → immediate retry on the queue.
  }, []);

  /* ── Core processing loop ──────────────────────────────────────────────
     Runs on mount, every 3 s, and on localStorage change (storage event).
     Re-created whenever permission changes — this IS the retry mechanism:
     when the user grants permission, a new processAlerts closes over
     "granted" and flushes every unseen alert through the browser channel. */
  const processAlerts = useCallback(() => {
    const unseen = getUnseen();

    if (permission === "granted") {
      // Browser channel: markAlertSeen is called inside tryShowBrowserNotification
      // only when new Notification() succeeds. Nothing survives to the in-app panel.
      unseen.forEach(tryShowBrowserNotification);
      setInAppAlerts([]);       // clear any in-app leftovers from before grant
    } else {
      // In-app channel (denied or default):
      // Surface alerts visually. markAlertSeen is NOT called here —
      // only the dismiss handlers below call it (after user interaction).
      setInAppAlerts(unseen);
    }
  }, [permission, getUnseen]);

  /* ── Polling loop (restarts when processAlerts changes, i.e. on permission change) ── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    processAlerts();                                      // immediate first pass
    const id = window.setInterval(processAlerts, 3000);  // poll every 3 s
    window.addEventListener("storage", processAlerts);   // cross-tab sync
    return () => {
      window.clearInterval(id);
      window.removeEventListener("storage", processAlerts);
    };
  }, [processAlerts]);

  /* ── In-app dismiss handlers ─────────────────────────────────────────── */
  const dismiss = useCallback((id) => {
    markAlertSeen(id);                        // ← confirmed delivery by user action
    seenRef.current.add(id);
    setInAppAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setInAppAlerts((prev) => {
      prev.forEach((a) => {
        markAlertSeen(a.id);                  // ← confirmed delivery for each
        seenRef.current.add(a.id);
      });
      return [];
    });
  }, []);

  /* ── Render ──────────────────────────────────────────────────────────── */
  // When browser notifications are granted we still render null —
  // the in-app panel is the fallback only.
  if (permission === "granted") return null;

  return (
    <>
      <style>{`
        @keyframes notifSlideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <InAppPanel
        alerts={inAppAlerts}
        onDismiss={dismiss}
        onDismissAll={dismissAll}
        permission={permission}
        onRequestPermission={requestPermission}
      />
    </>
  );
}
