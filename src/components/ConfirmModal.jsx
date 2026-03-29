import { createContext, useContext, useState, useCallback, useRef } from "react";

const ConfirmCtx = createContext(null);

const BTN_TYPES = {
  danger:  { bg: "#dc2626", hover: "#b91c1c", label: "Yes, Confirm" },
  success: { bg: "#16a34a", hover: "#15803d", label: "Yes, Confirm" },
  warning: { bg: "#d97706", hover: "#b45309", label: "Yes, Confirm" },
  primary: { bg: "#2563eb", hover: "#1d4ed8", label: "Yes, Confirm" },
};

function Modal({ title, message, confirmText, cancelText, type, onConfirm, onCancel }) {
  const btn = BTN_TYPES[type] || BTN_TYPES.danger;
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
        zIndex: 999998, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, animation: "fadeIn 0.15s ease",
      }}
      onClick={onCancel}
    >
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      <div
        style={{
          background: "#fff", borderRadius: 16, padding: "28px 28px 24px",
          maxWidth: 440, width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          animation: "popIn 0.2s cubic-bezier(0.34,1.56,0.64,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`@keyframes popIn { from { opacity:0; transform:scale(0.88); } to { opacity:1; transform:scale(1); } }`}</style>

        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: type === "danger" ? "#fee2e2" : type === "success" ? "#dcfce7" : type === "warning" ? "#fef3c7" : "#dbeafe",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 22,
          }}>
            {type === "danger" ? "🗑" : type === "success" ? "✅" : type === "warning" ? "⚠️" : "ℹ️"}
          </div>
        </div>

        <h4 style={{ fontWeight: 700, color: "#111827", textAlign: "center", marginBottom: 8, fontSize: "1.05rem" }}>
          {title}
        </h4>
        {message && (
          <p style={{ color: "#6b7280", textAlign: "center", lineHeight: 1.6, fontSize: "0.9rem", marginBottom: 22 }}>
            {message}
          </p>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              padding: "11px 16px", borderRadius: 10, fontWeight: 600, fontSize: "0.9rem",
              border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151",
              cursor: "pointer", transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
          >
            {cancelText || "Cancel"}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "11px 16px", borderRadius: 10, fontWeight: 700, fontSize: "0.9rem",
              border: "none", background: btn.bg, color: "#fff",
              cursor: "pointer", transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = btn.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = btn.bg)}
          >
            {confirmText || btn.label}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConfirmProvider({ children }) {
  const [modal, setModal] = useState(null);
  const resolveRef = useRef(null);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setModal(typeof options === "string" ? { title: options } : options);
    });
  }, []);

  const handleConfirm = () => { resolveRef.current?.(true);  setModal(null); };
  const handleCancel  = () => { resolveRef.current?.(false); setModal(null); };

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      {modal && <Modal {...modal} onConfirm={handleConfirm} onCancel={handleCancel} />}
    </ConfirmCtx.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmCtx);
