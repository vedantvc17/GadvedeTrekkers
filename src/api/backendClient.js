const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://resourceful-balance-production-ed41.up.railway.app"
).replace(/\/$/, "");
const ADMIN_API_KEY =
  import.meta.env.VITE_ADMIN_API_KEY ||
  "80df155f08e2e82d16e1701f2e2e8978c06c07427324d6d177847ae43dc31907";

function buildUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export async function apiRequest(path, { method = "GET", body, admin = false } = {}) {
  const headers = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (admin && ADMIN_API_KEY) {
    headers["x-admin-api-key"] = ADMIN_API_KEY;
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || payload?.message || `Request failed: ${response.status}`);
  }

  return payload?.data ?? payload;
}
