/* ═══════════════════════════════════════════════
   syncService.js — Gadvede Trekkers
   Shared helper for backend sync calls with admin JWT.
   All functions throw on failure so callers can .catch() them.
═══════════════════════════════════════════════ */

const BASE = () =>
  (import.meta.env.VITE_API_BASE_URL || "https://resourceful-balance-production-ed41.up.railway.app").replace(/\/$/, "");

const token = () => sessionStorage.getItem("gt_admin_token") || "";

export async function backendGet(path) {
  const r = await fetch(`${BASE()}${path}`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  if (!r.ok) throw new Error(`GET ${path} failed: ${r.status}`);
  const json = await r.json();
  if (!json.success) throw new Error(json.error || "Backend error");
  return json.data;
}

export async function backendPost(path, body) {
  const r = await fetch(`${BASE()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`POST ${path} failed: ${r.status}`);
  const json = await r.json();
  if (!json.success) throw new Error(json.error || "Backend error");
  return json.data;
}

export async function backendPatch(path, body) {
  const r = await fetch(`${BASE()}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`PATCH ${path} failed: ${r.status}`);
  const json = await r.json();
  if (!json.success) throw new Error(json.error || "Backend error");
  return json.data;
}

export async function backendDelete(path) {
  const r = await fetch(`${BASE()}${path}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token()}` },
  });
  if (!r.ok) throw new Error(`DELETE ${path} failed: ${r.status}`);
  return true;
}
