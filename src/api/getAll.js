import { apiRequest } from "./backendClient";
import { saveAdminItems } from "../data/adminStorage";

export async function getAllProducts(type) {
  const query = type ? `?type=${encodeURIComponent(type)}` : "";
  return apiRequest(`/api/products${query}`);
}

/**
 * Fetches the latest items from the backend API and saves them to localStorage.
 * Returns the fresh items from API, or null if the request fails.
 * Listing pages call this on mount so every device gets up-to-date data.
 */
export async function syncProductsFromApi(productType, storageKey) {
  const items = await getAllProducts(productType);
  if (!Array.isArray(items) || items.length === 0) return null;
  saveAdminItems(storageKey, items);
  return items;
}
