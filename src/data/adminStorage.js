/* ─── Helpers to read / write admin-created items in localStorage ─── */

export function getAdminItems(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

export function saveAdminItems(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}

/* Normalise numbers stored as strings from form inputs */
export function normaliseItem(item) {
  return {
    ...item,
    price: Number(item.price) || 0,
    originalPrice: Number(item.originalPrice) || 0,
    rating: item.rating ? Number(item.rating) : 4.5,
    reviews: item.reviews ? Number(item.reviews) : 0,
  };
}
