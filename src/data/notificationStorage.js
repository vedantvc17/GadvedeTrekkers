const ALERTS_KEY = "gt_alerts";
const SEEN_KEY = "gt_alerts_seen";
const EMAIL_CONFIG_KEY = "gt_email_alert_config";

export function getAlerts() {
  try {
    return JSON.parse(localStorage.getItem(ALERTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveAlerts(alerts) {
  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts.slice(0, 200)));
}

export function getSeenAlertIds() {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
  } catch {
    return [];
  }
}

export function markAlertSeen(id) {
  const seen = new Set(getSeenAlertIds());
  seen.add(id);
  localStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(seen)));
}

export function createAlert({ type, title, message, meta = {} }) {
  const alert = {
    id: `ALT-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    type: type || "INFO",
    title: title || "New Alert",
    message: message || "",
    meta,
    createdAt: new Date().toISOString(),
  };
  saveAlerts([alert, ...getAlerts()]);
  return alert;
}

export function getEmailAlertConfig() {
  try {
    return JSON.parse(localStorage.getItem(EMAIL_CONFIG_KEY) || "null") || {
      enabled: false,
      provider: "Not Configured",
      notifyTo: "gadvedetrekkers@gmail.com",
      note: "Connect EmailJS or a backend API to send real emails.",
    };
  } catch {
    return {
      enabled: false,
      provider: "Not Configured",
      notifyTo: "gadvedetrekkers@gmail.com",
      note: "Connect EmailJS or a backend API to send real emails.",
    };
  }
}

export function recordEmailAlertAttempt(payload) {
  const config = getEmailAlertConfig();
  return createAlert({
    type: "EMAIL",
    title: `${payload.kind} Email Alert`,
    message: config.enabled
      ? `Email alert queued for ${config.notifyTo}`
      : `Email alert not sent. ${config.note}`,
    meta: {
      ...payload,
      config,
    },
  });
}
