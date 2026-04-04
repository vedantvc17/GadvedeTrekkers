/**
 * getAll.js — backward-compatible re-exports.
 *
 * These two functions are imported by all listing pages (Trek, Camping, Tours,
 * Heritage, Rental, Home). The signatures are unchanged so no call-sites break.
 *
 * Internally they now delegate to productService, which owns the offline-first
 * strategy (fetch → save → fallback). New code should import productService
 * directly instead of these helpers.
 *
 *   // preferred for new code:
 *   import { productService } from "../services/product.service";
 *   await productService.sync("camping", "gt_camping");
 */

import { productService } from "../services/product.service";

/** @deprecated Prefer productService.getBySlug() for detail pages. */
export async function getAllProducts(type) {
  const { productsApi } = await import("./products.api");
  return productsApi.getAll(type);
}

/**
 * Fetch products from the API and persist them to localStorage.
 * Called from listing pages on mount so admin changes propagate cross-device.
 */
export function syncProductsFromApi(productType, storageKey) {
  return productService.sync(productType, storageKey);
}
