/**
 * bookings.api.js — HTTP transport for the /api/bookings namespace.
 *
 * Rules: HTTP only. No localStorage, no business logic, no React.
 */

import { apiRequest } from "./backendClient";

export const bookingsApi = {
  /** GET /api/bookings  — paginated list with filters (JWT required) */
  list: (params = {}) =>
    apiRequest(`/api/bookings?${new URLSearchParams(params)}`, { admin: true }),

  /** GET /api/bookings/:code  — single booking by booking code (JWT required) */
  getByCode: (code) =>
    apiRequest(`/api/bookings/${encodeURIComponent(code)}`, { admin: true }),

  /** POST /api/bookings  — create or update booking (public — customer-facing) */
  create: (data) =>
    apiRequest("/api/bookings", { method: "POST", body: data }),

  /** PATCH /api/bookings/admin/:code/status  — change status (JWT required) */
  updateStatus: (code, status) =>
    apiRequest(`/api/bookings/admin/${encodeURIComponent(code)}/status`, {
      method: "PATCH",
      admin: true,
      body: { status },
    }),
};
