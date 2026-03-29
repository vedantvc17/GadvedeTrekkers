/* ── Trek Dates Storage ──────────────────────────────────────
   Key: gt_trek_dates
   Shape: { id, trekSlug, trekName, date, label, whatsappGroupLink, createdAt }
─────────────────────────────────────────────────────────────── */

const KEY = "gt_trek_dates";

export function getAllTrekDates() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}

/** Returns dates for a specific trek, sorted ascending by date */
export function getTrekDates(trekSlug) {
  try {
    const all = getAllTrekDates();
    return all
      .filter(d => d.trekSlug === trekSlug || d.trekName === trekSlug)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch { return []; }
}

export function saveTrekDate(entry) {
  const all = getAllTrekDates();
  const idx = all.findIndex(d => d.id === entry.id);
  let updated;
  if (idx >= 0) {
    updated = all.map((d, i) => i === idx ? { ...d, ...entry } : d);
  } else {
    updated = [...all, {
      ...entry,
      id: `td_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    }];
  }
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function deleteTrekDate(id) {
  const all = getAllTrekDates();
  localStorage.setItem(KEY, JSON.stringify(all.filter(d => d.id !== id)));
}

export function replaceTrekDates(trekSlug, trekName, entries = []) {
  const all = getAllTrekDates().filter(
    (d) => d.trekSlug !== trekSlug && d.trekName !== trekName
  );
  const next = [
    ...all,
    ...entries
      .filter((entry) => entry?.date)
      .map((entry, index) => ({
        ...entry,
        id: entry.id || `td_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 7)}`,
        trekSlug,
        trekName,
        createdAt: entry.createdAt || new Date().toISOString(),
      })),
  ];
  localStorage.setItem(KEY, JSON.stringify(next));
}

/** Look up the WhatsApp group link for a specific trek + date combination */
export function getWhatsAppLinkForDate(trekSlug, date) {
  if (!trekSlug || !date) return "";
  const dates = getTrekDates(trekSlug);
  const match = dates.find(d => d.date === date);
  return match?.whatsappGroupLink || "";
}
