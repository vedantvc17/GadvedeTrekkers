/* ── Tour Dates Storage ──────────────────────────────────────
   Key: gt_tour_dates
   Shape: { id, tourSlug, tourName, date, label, whatsappGroupLink, createdAt }
─────────────────────────────────────────────────────────────── */

const KEY = "gt_tour_dates";

export function getAllTourDates() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}

/** Returns dates for a specific tour, sorted ascending by date */
export function getTourDates(tourSlug) {
  try {
    const all = getAllTourDates();
    return all
      .filter((d) => d.tourSlug === tourSlug || d.tourName === tourSlug)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch { return []; }
}

export function replaceTourDates(tourSlug, tourName, entries = []) {
  const all = getAllTourDates().filter(
    (d) => d.tourSlug !== tourSlug && d.tourName !== tourName
  );
  const next = [
    ...all,
    ...entries
      .filter((entry) => entry?.date)
      .map((entry, index) => ({
        ...entry,
        id: entry.id || `trd_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 7)}`,
        tourSlug,
        tourName,
        createdAt: entry.createdAt || new Date().toISOString(),
      })),
  ];
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function getWhatsAppLinkForTourDate(tourSlug, date) {
  if (!tourSlug || !date) return "";
  const dates = getTourDates(tourSlug);
  const match = dates.find((d) => d.date === date);
  return match?.whatsappGroupLink || "";
}
