/* ─── Leader Training — localStorage persistence ─────────────────
   Key schema:
     gt_leader_progress  → { moduleId: { completed, score, completedAt } }
     gt_leader_attempts  → [{ attemptId, score, percent, level, answers, completedAt }]
     gt_leader_profile   → { name, phone, email, employeeId }
   ──────────────────────────────────────────────────────────────── */

const KEYS = {
  PROGRESS: "gt_leader_progress",
  ATTEMPTS: "gt_leader_attempts",
  PROFILE:  "gt_leader_profile",
};

/* ── Profile ──────────────────────────────────────────────────── */
export function getLeaderProfile() {
  try { return JSON.parse(localStorage.getItem(KEYS.PROFILE)) || null; }
  catch { return null; }
}
export function saveLeaderProfile(profile) {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

/* ── Module Progress ──────────────────────────────────────────── */
export function getModuleProgress() {
  try { return JSON.parse(localStorage.getItem(KEYS.PROGRESS)) || {}; }
  catch { return {}; }
}
export function markModuleComplete(moduleId) {
  const current = getModuleProgress();
  current[moduleId] = { completed: true, completedAt: new Date().toISOString() };
  localStorage.setItem(KEYS.PROGRESS, JSON.stringify(current));
}

/* ── Test Attempts ────────────────────────────────────────────── */
export function getAllAttempts() {
  try { return JSON.parse(localStorage.getItem(KEYS.ATTEMPTS)) || []; }
  catch { return []; }
}

export function saveAttempt({ score, maxScore, answers }) {
  const percent = Math.round((score / maxScore) * 100);
  const level   = percent >= 90 ? "Expert" : percent >= 70 ? "Approved" : "Retraining";
  const attempt = {
    attemptId:   `att_${Date.now()}`,
    score,
    maxScore,
    percent,
    level,
    answers,
    completedAt: new Date().toISOString(),
  };
  const all = getAllAttempts();
  localStorage.setItem(KEYS.ATTEMPTS, JSON.stringify([...all, attempt]));
  return attempt;
}

export function getLatestAttempt() {
  const all = getAllAttempts();
  return all.length ? all[all.length - 1] : null;
}

export function getBestAttempt() {
  const all = getAllAttempts();
  if (!all.length) return null;
  return all.reduce((best, a) => (a.percent > best.percent ? a : best));
}

/* ── Certification Level helpers ─────────────────────────────── */
export function getCertificationLabel(percent) {
  if (percent >= 90) return { level: "Expert Leader", color: "#7c3aed", badge: "🏆" };
  if (percent >= 70) return { level: "Approved Leader", color: "#16a34a", badge: "✅" };
  return { level: "Retraining Required", color: "#dc2626", badge: "🔄" };
}
