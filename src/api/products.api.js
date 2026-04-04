/**
 * products.api.js — HTTP transport for the /api/products namespace.
 *
 * Rules:
 *   - Every function here does exactly ONE thing: make an HTTP request.
 *   - No localStorage, no business logic, no React.
 *   - If the backend URL structure changes, this is the ONLY file to update.
 */

import { apiRequest } from "./backendClient";

export const productsApi = {
  /** GET /api/products?type=trek  — public listing (no auth) */
  getAll: (type) =>
    apiRequest(`/api/products${type ? `?type=${encodeURIComponent(type)}` : ""}`),

  /** GET /api/products/:slug  — single product detail (no auth) */
  getBySlug: (slug) =>
    apiRequest(`/api/products/${encodeURIComponent(slug)}`),

  /** GET /api/products/admin/list?storageKey=  — admin CRUD list (JWT required) */
  adminList: (storageKey) =>
    apiRequest(
      `/api/products/admin/list?storageKey=${encodeURIComponent(storageKey)}`,
      { admin: true }
    ),

  /** POST /api/products/admin/upsert  — create or update (JWT required) */
  upsert: (storageKey, item) =>
    apiRequest("/api/products/admin/upsert", {
      method: "POST",
      admin: true,
      body: { storageKey, item },
    }),

  /** DELETE /api/products/admin/:storageKey/:identifier  — delete (JWT required) */
  remove: (storageKey, identifier) =>
    apiRequest(
      `/api/products/admin/${encodeURIComponent(storageKey)}/${encodeURIComponent(identifier)}`,
      { method: "DELETE", admin: true }
    ),
};
