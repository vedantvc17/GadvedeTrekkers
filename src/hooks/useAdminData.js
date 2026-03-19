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
    return stored;
  });

  const persist = (next) => {
    setData(next);
    saveAdminItems(key, next);
  };

  const add = (item) =>
    persist([...data, { ...item, active: true, id: Date.now().toString() }]);

  const update = (id, item) =>
    persist(data.map((d) => (d.id === id ? { ...item, id } : d)));

  const remove = (id) => persist(data.filter((d) => d.id !== id));

  const toggleActive = (id) =>
    persist(data.map((d) => (d.id === id ? { ...d, active: !d.active } : d)));

  return { data, add, update, remove, toggleActive };
}
