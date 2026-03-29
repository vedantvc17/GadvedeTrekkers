import { apiRequest } from "./backendClient";

export async function getProductBySlug(slug) {
  return apiRequest(`/api/products/${encodeURIComponent(slug)}`);
}
