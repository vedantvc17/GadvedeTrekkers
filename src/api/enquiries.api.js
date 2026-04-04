/**
 * enquiries.api.js — HTTP transport for the /api/enquiries namespace.
 *
 * Rules: HTTP only. No localStorage, no business logic, no React.
 */

import { apiRequest } from "./backendClient";

export const enquiriesApi = {
  /** GET /api/enquiries  — role-scoped list (JWT required) */
  list: (params = {}) =>
    apiRequest(`/api/enquiries?${new URLSearchParams(params)}`, { admin: true }),

  /** POST /api/enquiries  — create or upsert by id (public — customer-facing) */
  upsert: (enquiry) =>
    apiRequest("/api/enquiries", { method: "POST", body: enquiry }),

  /** PATCH /api/enquiries/:id  — update fields (JWT required) */
  update: (id, patch) =>
    apiRequest(`/api/enquiries/${encodeURIComponent(id)}`, {
      method: "PATCH",
      admin: true,
      body: patch,
    }),
};
