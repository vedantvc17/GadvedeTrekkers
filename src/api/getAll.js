import { apiRequest } from "./backendClient";

export async function getAllProducts(type) {
  const query = type ? `?type=${encodeURIComponent(type)}` : "";
  return apiRequest(`/api/products${query}`);
}
