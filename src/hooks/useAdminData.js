import { useState } from "react";
import { getAdminItems, saveAdminItems } from "../data/adminStorage";

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

  const persist = (next) => {
    setData(next);
    saveAdminItems(key, next);
  };

  const add = (item) => {
    const created = { ...item, active: true, id: Date.now().toString() };
    persist([...data, created]);
    return created;
  };

  const update = (id, item) => {
    const updated = { ...item, id };
    persist(data.map((d) => (d.id === id ? updated : d)));
    return updated;
  };

  const remove = (id) => persist(data.filter((d) => d.id !== id));

  const toggleActive = (id) =>
    persist(data.map((d) => (d.id === id ? { ...d, active: !d.active } : d)));

  return { data, add, update, remove, toggleActive };
}
