/**
 * useAdminData — React CRUD hook for admin product management.
 *
 * Responsibility split:
 *   useAdminData  → React state, optimistic UI, lifecycle (this file)
 *   productService → business logic, offline strategy, seeding/hydration
 *   productsApi    → HTTP transport (paths, headers, serialisation)
 *
 * Changing the backend URL?  Edit src/api/products.api.js only.
 * Changing seed/hydration logic?  Edit src/services/product.service.js only.
 * Changing which component uses which data?  Edit this hook's callers only.
 */

import { useEffect, useState } from "react";
import { saveAdminItems } from "../data/adminStorage";
import { productService } from "../services/product.service";

export function useAdminData(key, seedData = []) {
  const [data, setData] = useState(() => {
    // Seed empty store or hydrate existing records from seed.
    if (seedData.length === 0) return productService.getLocal(key);
    const stored = productService.getLocal(key);
    if (stored.length === 0) return productService.seedIfEmpty(key, seedData);
    return productService.hydrate(key, seedData);
  });

  /* ── Sync from backend on mount ─────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;

    productService.adminList(key)
      .then((remoteItems) => {
        if (cancelled || !Array.isArray(remoteItems)) return;
        setData(remoteItems);
      })
      .catch((err) => console.warn("useAdminData: remote fetch failed —", err.message));

    return () => { cancelled = true; };
  }, [key]);

  /* ── Optimistic local persistence ───────────────────────────────────── */
  const persist = (next) => {
    setData(next);
    saveAdminItems(key, next);
  };

  /* ── CRUD operations ─────────────────────────────────────────────────── */

  const add = (item) => {
    const created = { ...item, active: true, id: Date.now().toString() };
    persist([...data, created]);

    productService
      .save(key, created, (remote) => {
        // Backend confirmed — replace optimistic record with backend-assigned values.
        setData((prev) => {
          const next = prev.map((entry) => (entry.id === created.id ? remote : entry));
          saveAdminItems(key, next);
          return next;
        });
      })
      .catch((err) => console.warn("useAdminData.add: backend sync failed —", err.message));

    return created;
  };

  const update = (id, item) => {
    const updated = { ...item, id };
    persist(data.map((d) => (d.id === id ? updated : d)));

    productService
      .save(key, updated, (remote) => {
        setData((prev) => {
          const next = prev.map((entry) => (entry.id === id ? remote : entry));
          saveAdminItems(key, next);
          return next;
        });
      })
      .catch((err) => console.warn("useAdminData.update: backend sync failed —", err.message));

    return updated;
  };

  const remove = (id) => {
    const target = data.find((d) => d.id === id);
    persist(data.filter((d) => d.id !== id));

    productService
      .remove(key, target)
      .catch((err) => console.warn("useAdminData.remove: backend sync failed —", err.message));
  };

  const toggleActive = (id) => {
    const next = data.map((d) => (d.id === id ? { ...d, active: !d.active } : d));
    persist(next);

    const updated = next.find((d) => d.id === id);
    productService
      .save(key, updated)
      .catch((err) => console.warn("useAdminData.toggleActive: backend sync failed —", err.message));
  };

  return { data, add, update, remove, toggleActive };
}
