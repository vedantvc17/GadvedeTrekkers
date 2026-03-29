/* ══════════════════════════════════════════════
   activityLogStorage.js — Gadvede Trekkers
══════════════════════════════════════════════ */
const LOGS_KEY = "gt_activity_logs";

function _uid() {
  return `LOG-${Date.now()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
}

export function getCurrentAdminUser() {
  try {
    return JSON.parse(sessionStorage.getItem("gt_user")) ||
      { name: "Admin", username: "admin", role: "Super Admin" };
  } catch {
    return { name: "Admin", username: "admin", role: "Super Admin" };
  }
}

export function getAllLogs() {
  try { return JSON.parse(localStorage.getItem(LOGS_KEY)) || []; }
  catch { return []; }
}

export function logActivity({ action, actionLabel, details = "", module = "General", severity = "info" }) {
  const user = getCurrentAdminUser();
  const entry = {
    logId: _uid(),
    timestamp: new Date().toISOString(),
    username: user.username,
    userName: user.name,
    userRole: user.role,
    action,
    actionLabel,
    details,
    module,
    severity,
  };
  const updated = [entry, ...getAllLogs()].slice(0, 2000);
  localStorage.setItem(LOGS_KEY, JSON.stringify(updated));
  return entry;
}

export function queryLogs({ username, module, date } = {}) {
  let list = getAllLogs();
  if (username) list = list.filter(l => l.username === username);
  if (module)   list = list.filter(l => l.module === module);
  if (date)     list = list.filter(l => l.timestamp.startsWith(date));
  return list;
}

export function clearLogs() {
  localStorage.removeItem(LOGS_KEY);
}
