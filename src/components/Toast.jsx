import { createContext, useContext, useState, useCallback } from "react";

const ToastCtx = createContext(null);

const TYPE_STYLES = {
  success: { bg: "#166534", icon: "✓", border: "#14532d" },
  error:   { bg: "#991b1b", icon: "✕", border: "#7f1d1d" },
  warning: { bg: "#92400e", icon: "⚠", border: "#78350f" },
  info:    { bg: "#1e40af", icon: "ℹ", border: "#1e3a8a" },
};

function ToastItem({ id, message, type = "success", onDismiss }) {
  const s = TYPE_STYLES[type] || TYPE_STYLES.success;
  return (
    <div
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: 10,
        padding: "12px 16px",
        color: "#fff",
        fontSize: 14,
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: 10,
        minWidth: 260,
        maxWidth: 380,
        boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
        animation: "toastSlideIn 0.25s ease",
        cursor: "pointer",
      }}
      onClick={onDismiss}
    >
      <span style={{ fontSize: 16, fontWeight: 700, opacity: 0.9 }}>{s.icon}</span>
      <span style={{ flex: 1, lineHeight: 1.4 }}>{message}</span>
      <span style={{ opacity: 0.6, fontSize: 18, lineHeight: 1 }}>×</span>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const show = useCallback((message, type = "success", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  const api = {
    success: (msg, dur) => show(msg, "success", dur),
    error:   (msg, dur) => show(msg, "error",   dur),
    warning: (msg, dur) => show(msg, "warning",  dur),
    info:    (msg, dur) => show(msg, "info",     dur),
  };

  return (
    <ToastCtx.Provider value={api}>
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      {children}
      <div style={{
        position: "fixed", top: 80, right: 20, zIndex: 999999,
        display: "flex", flexDirection: "column", gap: 8,
        pointerEvents: "none",
      }}>
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: "auto" }}>
            <ToastItem {...t} onDismiss={() => dismiss(t.id)} />
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
