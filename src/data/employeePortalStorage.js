/* ══════════════════════════════════════════════
   employeePortalStorage.js — Gadvede Trekkers
   Employee login credentials + onboarding approval
   Approval: Akshay Kangude / Pratik Ubhe
══════════════════════════════════════════════ */
const KEY = "gt_employee_creds";

function _uid() {
  return `CRED-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function _refCode(name, employeeId) {
  const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 3);
  const suffix   = (employeeId || "").replace(/\D/g, "").slice(-3).padStart(3, "0");
  return `REF-${initials}${suffix}`;
}

function _slugify(name) {
  return name.toLowerCase().replace(/\s+/g, ".").replace(/[^a-z.]/g, "");
}

export function getAllCredentials() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}

function _save(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

/* Called from EmployeeOnboarding when admin clicks "Generate Portal Credentials" */
export function createEmployeeCredentials({ employeeId, fullName }) {
  const all = getAllCredentials();
  // Don't duplicate
  if (all.find(c => c.employeeId === employeeId)) return all.find(c => c.employeeId === employeeId);

  const username = _slugify(fullName);
  // Default password = first name + last 3 of employeeId
  const idSuffix = (employeeId || "").replace(/\D/g, "").slice(-3).padStart(3, "0");
  const password = `${fullName.split(" ")[0].toLowerCase()}${idSuffix}`;

  const cred = {
    credId: _uid(),
    employeeId,
    fullName,
    username,
    password,
    referralCode: _refCode(fullName, employeeId),
    onboardingStatus: "PENDING",   // PENDING | APPROVED | REJECTED
    approvedBy: null,
    approvedByUsername: null,
    approvedAt: null,
    rejectedReason: "",
    createdAt: new Date().toISOString(),
  };
  _save([cred, ...all]);
  return cred;
}

export function getCredentialsByEmployeeId(employeeId) {
  return getAllCredentials().find(c => c.employeeId === employeeId) || null;
}

export function getCredentialsByUsername(username) {
  return getAllCredentials().find(c => c.username === username) || null;
}

/* Approve onboarding — only Akshay/Pratik */
export function approveOnboarding(employeeId) {
  try {
    const actor = JSON.parse(sessionStorage.getItem("gt_user")) || {};
    const allowed = ["akshay.kangude", "pratik.ubhe", "admin"];
    if (!allowed.includes(actor.username)) return { ok: false, error: "Not authorised" };

    const all = getAllCredentials().map(c =>
      c.employeeId === employeeId
        ? { ...c, onboardingStatus: "APPROVED", approvedBy: actor.name, approvedByUsername: actor.username, approvedAt: new Date().toISOString(), rejectedReason: "" }
        : c
    );
    _save(all);
    return { ok: true };
  } catch { return { ok: false, error: "Unknown error" }; }
}

/* Reject onboarding */
export function rejectOnboarding(employeeId, reason) {
  try {
    const actor = JSON.parse(sessionStorage.getItem("gt_user")) || {};
    const all = getAllCredentials().map(c =>
      c.employeeId === employeeId
        ? { ...c, onboardingStatus: "REJECTED", approvedBy: actor.name, approvedByUsername: actor.username, approvedAt: new Date().toISOString(), rejectedReason: reason || "" }
        : c
    );
    _save(all);
    return { ok: true };
  } catch { return { ok: false, error: "Unknown error" }; }
}

export function getPendingOnboardings() {
  return getAllCredentials().filter(c => c.onboardingStatus === "PENDING");
}

/* Employee login — returns cred if valid + approved, else null */
export function employeeLogin(username, password) {
  const cred = getAllCredentials().find(c => c.username === username && c.password === password);
  if (!cred) return { ok: false, error: "Invalid username or password." };
  if (cred.onboardingStatus === "PENDING")  return { ok: false, error: "Your onboarding request is pending approval." };
  if (cred.onboardingStatus === "REJECTED") return { ok: false, error: `Your onboarding was rejected: ${cred.rejectedReason || "Contact admin."}` };
  return { ok: true, cred };
}

/* Session helpers */
export function setEmployeeSession(cred) {
  sessionStorage.setItem("gt_emp", JSON.stringify({
    employeeId: cred.employeeId,
    username:   cred.username,
    fullName:   cred.fullName,
    referralCode: cred.referralCode,
  }));
}

export function getEmployeeSession() {
  try { return JSON.parse(sessionStorage.getItem("gt_emp")) || null; }
  catch { return null; }
}

export function clearEmployeeSession() {
  sessionStorage.removeItem("gt_emp");
}

/* Update password */
export function updateEmployeePassword(employeeId, newPassword) {
  const all = getAllCredentials().map(c =>
    c.employeeId === employeeId ? { ...c, password: newPassword } : c
  );
  _save(all);
}

/* ─────────────────────────────────────────────────
   SEED DATA — auto-seeded on first load to match
   the seed employees in employeeStorage.js
───────────────────────────────────────────────── */
(function _seedCredentials() {
  const SEED_CREDS = [
    /* ── Admin users — same password as admin panel for easy recall ── */
    {
      credId: "CRED-SEED-ADMIN-PRATIK",
      employeeId: "EMP-ADMIN-PRATIK",
      fullName: "Pratik Ubhe",
      username: "pratik.ubhe",
      password: "Pratik@gadvede",
      referralCode: "REF-PU001",
      onboardingStatus: "APPROVED",
      approvedBy: "Admin",
      approvedByUsername: "admin",
      approvedAt: "2026-03-21T20:12:56.433Z",
      rejectedReason: "",
      createdAt: "2026-03-21T20:12:56.433Z",
    },
    {
      credId: "CRED-SEED-ADMIN-ROHIT",
      employeeId: "EMP-ADMIN-ROHIT",
      fullName: "Rohit Panhalkar",
      username: "rohit.panhalkar",
      password: "Rohit@gadvede",
      referralCode: "REF-RP002",
      onboardingStatus: "APPROVED",
      approvedBy: "Admin",
      approvedByUsername: "admin",
      approvedAt: "2026-03-21T20:12:56.433Z",
      rejectedReason: "",
      createdAt: "2026-03-21T20:12:56.433Z",
    },
    {
      credId: "CRED-SEED-ADMIN-AKSHAY",
      employeeId: "EMP-ADMIN-AKSHAY",
      fullName: "Akshay Kangude",
      username: "akshay.kangude",
      password: "Akshay@gadvede",
      referralCode: "REF-AK003",
      onboardingStatus: "APPROVED",
      approvedBy: "Admin",
      approvedByUsername: "admin",
      approvedAt: "2026-03-21T20:12:56.433Z",
      rejectedReason: "",
      createdAt: "2026-03-21T20:12:56.433Z",
    },
    /* ── Demo employees ── */
    {
      credId: "CRED-SEED-EMP-SEED-001",
      employeeId: "EMP-SEED-001",
      fullName: "Rahul Patil",
      username: "rahul.patil",
      password: "rahul001",
      referralCode: "REF-RP001",
      onboardingStatus: "APPROVED",
      approvedBy: "Admin",
      approvedByUsername: "admin",
      approvedAt: "2026-03-21T20:12:56.433Z",
      rejectedReason: "",
      createdAt: "2026-03-21T20:12:56.433Z",
    },
    {
      credId: "CRED-SEED-EMP-SEED-002",
      employeeId: "EMP-SEED-002",
      fullName: "Priya Deshmukh",
      username: "priya.deshmukh",
      password: "priya002",
      referralCode: "REF-PD002",
      onboardingStatus: "APPROVED",
      approvedBy: "Admin",
      approvedByUsername: "admin",
      approvedAt: "2026-03-21T20:12:56.433Z",
      rejectedReason: "",
      createdAt: "2026-03-21T20:12:56.433Z",
    },
    {
      credId: "CRED-SEED-EMP-SEED-003",
      employeeId: "EMP-SEED-003",
      fullName: "Amit Shinde",
      username: "amit.shinde",
      password: "amit003",
      referralCode: "REF-AS003",
      onboardingStatus: "APPROVED",
      approvedBy: "Admin",
      approvedByUsername: "admin",
      approvedAt: "2026-03-21T20:12:56.433Z",
      rejectedReason: "",
      createdAt: "2026-03-21T20:12:56.433Z",
    },
    {
      credId: "CRED-SEED-EMP-SEED-004",
      employeeId: "EMP-SEED-004",
      fullName: "Sneha Kulkarni",
      username: "sneha.kulkarni",
      password: "sneha004",
      referralCode: "REF-SK004",
      onboardingStatus: "APPROVED",
      approvedBy: "Admin",
      approvedByUsername: "admin",
      approvedAt: "2026-03-21T20:12:56.433Z",
      rejectedReason: "",
      createdAt: "2026-03-21T20:12:56.433Z",
    },
    {
      credId: "CRED-SEED-EMP-SEED-005",
      employeeId: "EMP-SEED-005",
      fullName: "Vikram Jadhav",
      username: "vikram.jadhav",
      password: "vikram005",
      referralCode: "REF-VJ005",
      onboardingStatus: "APPROVED",
      approvedBy: "Admin",
      approvedByUsername: "admin",
      approvedAt: "2026-03-21T20:12:56.433Z",
      rejectedReason: "",
      createdAt: "2026-03-21T20:12:56.433Z",
    },
  ];
  /* Merge — preserve existing records, only add missing employeeIds */
  const existing = getAllCredentials();
  const existingIds = new Set(existing.map(c => c.employeeId));
  const toAdd = SEED_CREDS.filter(c => !existingIds.has(c.employeeId));
  if (toAdd.length > 0) _save([...existing, ...toAdd]);
})();
