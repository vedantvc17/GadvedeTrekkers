/* ── Vendor Storage ── */
import { backendPost, backendDelete, backendGet } from "../api/syncService.js";

const KEY = "gt_vendors";

const SEED_VENDORS = [
  { id:"v-01", name:"Shivaji Travels",      address:"Pune, Maharashtra",   googleMapLocation:"https://maps.google.com/?q=Pune", contactNumber:"9823001001", serviceType:"Bus",               rates:"₹15,000/day (AC Bus 40 seats)", images:[], createdAt:"2025-09-01T08:00:00Z" },
  { id:"v-02", name:"Sahyadri Food Stall",  address:"Kasara, Thane",       googleMapLocation:"https://maps.google.com/?q=Kasara", contactNumber:"9834002002", serviceType:"Food",              rates:"₹150/plate (Veg Thali)",        images:[], createdAt:"2025-09-05T08:00:00Z" },
  { id:"v-03", name:"Trek Gear Rentals",    address:"Mumbai, Maharashtra", googleMapLocation:"https://maps.google.com/?q=Mumbai", contactNumber:"9845003003", serviceType:"Adventure Activity", rates:"₹500/day (gear set)",          images:[], createdAt:"2025-09-10T08:00:00Z" },
  { id:"v-04", name:"Nashik Bus Services",  address:"Nashik, Maharashtra", googleMapLocation:"https://maps.google.com/?q=Nashik", contactNumber:"9856004004", serviceType:"Bus",               rates:"₹12,000/day (Non-AC 35 seats)", images:[], createdAt:"2025-09-15T08:00:00Z" },
  { id:"v-05", name:"Mountain Bites",       address:"Igatpuri, Nashik",    googleMapLocation:"https://maps.google.com/?q=Igatpuri", contactNumber:"9867005005", serviceType:"Food",            rates:"₹120/plate (Breakfast & Snacks)", images:[], createdAt:"2025-09-20T08:00:00Z" },
];

export function getAllVendors() {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (stored.length === 0) { localStorage.setItem(KEY, JSON.stringify(SEED_VENDORS)); return SEED_VENDORS; }
    return stored;
  } catch { return SEED_VENDORS; }
}

function _save(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

export function saveVendor(vendor) {
  const all = getAllVendors();
  if (vendor.id && all.some((v) => v.id === vendor.id)) {
    const updated = { ...all.find(v => v.id === vendor.id), ...vendor };
    _save(all.map((v) => v.id === vendor.id ? updated : v));
    // Sync to backend (fire-and-forget)
    backendPost("/api/vendors/upsert", updated).catch(err => console.warn("Vendor backend sync failed:", err.message));
  } else {
    const newVendor = { ...vendor, id: `v-${Date.now()}`, createdAt: new Date().toISOString() };
    _save([newVendor, ...all]);
    // Sync to backend (fire-and-forget)
    backendPost("/api/vendors/upsert", newVendor).catch(err => console.warn("Vendor backend sync failed:", err.message));
  }
}

export function deleteVendor(id) {
  _save(getAllVendors().filter((v) => v.id !== id));
  // Sync delete to backend (fire-and-forget)
  backendDelete(`/api/vendors/${id}`).catch(err => console.warn("Vendor delete sync failed:", err.message));
}

export function searchVendors(query) {
  if (!query?.trim()) return getAllVendors();
  const q = query.toLowerCase();
  return getAllVendors().filter(
    (v) => v.name?.toLowerCase().includes(q) || v.serviceType?.toLowerCase().includes(q) || v.location?.toLowerCase().includes(q)
  );
}

export async function syncVendorsFromBackend() {
  try {
    const vendors = await backendGet("/api/vendors");
    if (Array.isArray(vendors) && vendors.length > 0) {
      const existing = getAllVendors();
      const merged = vendors.map(v => {
        const local = existing.find(e => e.id === v.id);
        return { ...local, ...v };
      });
      existing.forEach(v => { if (!merged.find(m => m.id === v.id)) merged.push(v); });
      localStorage.setItem(KEY, JSON.stringify(merged));
    }
  } catch (err) {
    console.warn("Vendor sync from backend failed:", err.message);
  }
}
