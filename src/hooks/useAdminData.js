import { useEffect, useState } from "react";
import { getAdminItems, saveAdminItems } from "../data/adminStorage";
import { apiRequest } from "../api/backendClient";

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * CRUD hook backed by localStorage.
 * If the store is empty and seedData is provided, auto-seeds on first load.
 */
export function useAdminData(key, seedData = []) {
  const [data, setData] = useState(() => {
    const stored = getAdminItems(key);
    if (stored.length === 0 && seedData.length > 0) {
      const seeded = seedData.map((item, i) => ({
        ...item,
        price: Number(item.price) || 0,
        originalPrice: Number(item.originalPrice) || 0,
        active: true,
        id: `seed_${key}_${i}`,
      }));
      saveAdminItems(key, seeded);
      return seeded;
    }
    if (stored.length > 0 && seedData.length > 0) {
      const seedByName = new Map(
        seedData.map((item) => [String(item.name || item.title || "").toLowerCase(), item])
      );
      let changed = false;
      const hydrated = stored.map((item) => {
        const match = seedByName.get(String(item.name || item.title || "").toLowerCase());
        if (!match) return item;
        const next = { ...item };
        Object.entries(match).forEach(([field, value]) => {
          if (field === "id") return;
          if ((next[field] === "" || next[field] == null) && value !== "" && value != null) {
            next[field] = value;
            changed = true;
          }
        });
        return next;
      });
      if (changed) {
        saveAdminItems(key, hydrated);
      }
      return hydrated;
    }
    return stored;
  });

  useEffect(() => {
    let cancelled = false;

    apiRequest(`/api/products/admin/list?storageKey=${encodeURIComponent(key)}`, { admin: true })
      .then((remoteItems) => {
        if (cancelled || !Array.isArray(remoteItems)) return;
        if (remoteItems.length === 0 && data.length > 0) return;
        setData(remoteItems);
        saveAdminItems(key, remoteItems);
      })
      .catch((error) => {
        console.warn("Admin product fetch failed", error);
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  const persist = (next) => {
    setData(next);
    saveAdminItems(key, next);
  };

  const add = (item) => {
    const created = { ...item, active: true, id: Date.now().toString() };
    persist([...data, created]);
    apiRequest("/api/products/admin/upsert", {
      method: "POST",
      admin: true,
      body: { storageKey: key, item: created },
    })
      .then((remoteItem) => {
        if (!remoteItem) return;
        const next = getAdminItems(key).map((entry) => (entry.id === created.id ? remoteItem : entry));
        saveAdminItems(key, next);
        setData(next);
      })
      .catch((error) => console.warn("Admin product add failed", error));
    return created;
  };

  const update = (id, item) => {
    const updated = { ...item, id };
    persist(data.map((d) => (d.id === id ? updated : d)));
    apiRequest("/api/products/admin/upsert", {
      method: "POST",
      admin: true,
      body: { storageKey: key, item: updated },
    })
      .then((remoteItem) => {
        if (!remoteItem) return;
        const next = getAdminItems(key).map((entry) => (entry.id === id ? remoteItem : entry));
        saveAdminItems(key, next);
        setData(next);
      })
      .catch((error) => console.warn("Admin product update failed", error));
    return updated;
  };

  const remove = (id) => {
    const existing = data.find((d) => d.id === id);
    persist(data.filter((d) => d.id !== id));
    const identifier = existing?.id || slugify(existing?.name || existing?.title || "");
    apiRequest(`/api/products/admin/${encodeURIComponent(key)}/${encodeURIComponent(identifier)}`, {
      method: "DELETE",
      admin: true,
    }).catch((error) => console.warn("Admin product delete failed", error));
  };

  const toggleActive = (id) => {
    const next = data.map((d) => (d.id === id ? { ...d, active: !d.active } : d));
    persist(next);
    const updated = next.find((d) => d.id === id);
    apiRequest("/api/products/admin/upsert", {
      method: "POST",
      admin: true,
      body: { storageKey: key, item: updated },
    }).catch((error) => console.warn("Admin product toggle failed", error));
  };

  return { data, add, update, remove, toggleActive };
}
