const CATEGORY_STORAGE_MAP = {
  Trek: "gt_treks",
  Tour: "gt_tours",
  Camping: "gt_camping",
  Rental: "gt_rentals",
  "Heritage Walk": "gt_heritage",
};

function readStorageArray(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseObject(value) {
  if (!value) return null;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizePickupList(pickups = []) {
  if (!Array.isArray(pickups)) return [];
  return pickups
    .map((entry) => {
      if (typeof entry === "string") return entry.trim();
      if (entry && typeof entry === "object") {
        const location = String(entry.location || entry.name || "").trim();
        const time = String(entry.time || "").trim();
        return time ? `${location} (${time})` : location;
      }
      return "";
    })
    .filter(Boolean);
}

function buildConfigFromDeparturePlans(departurePlans) {
  const planEntries = Object.entries(departurePlans || {}).filter(
    ([origin, value]) => origin && value
  );

  if (!planEntries.length) {
    return null;
  }

  const pickupMap = {};
  planEntries.forEach(([origin, value]) => {
    pickupMap[origin] = normalizePickupList(value?.pickupPoints);
  });

  return {
    hasSpecificPlans: true,
    departureOptions: planEntries.map(([origin]) => origin),
    pickupMap,
  };
}

function buildConfigFromLegacyPickupPoints(pickupPoints) {
  const parsed = parseObject(pickupPoints);
  if (!parsed || typeof parsed !== "object") {
    return null;
  }

  const pickupMap = {};
  Object.entries(parsed).forEach(([origin, value]) => {
    pickupMap[origin] = normalizePickupList(value);
  });

  const departureOptions = Object.keys(pickupMap).filter(
    (origin) => pickupMap[origin]?.length
  );

  if (!departureOptions.length) {
    return null;
  }

  return {
    hasSpecificPlans: true,
    departureOptions,
    pickupMap,
  };
}

export function getEventDepartureConfig({
  category,
  eventName,
  fallbackDepartureOptions = [],
  fallbackPickupMap = {},
}) {
  const storageKey = CATEGORY_STORAGE_MAP[category];
  const fallback = {
    hasSpecificPlans: false,
    departureOptions: fallbackDepartureOptions,
    pickupMap: fallbackPickupMap,
  };

  if (!storageKey || !eventName) {
    return fallback;
  }

  const items = readStorageArray(storageKey);
  const matchingItem = items.find((item) => {
    const name = String(item?.name || item?.title || "").trim().toLowerCase();
    return name === String(eventName).trim().toLowerCase();
  });

  if (!matchingItem) {
    return fallback;
  }

  const fromPlans = buildConfigFromDeparturePlans(
    parseObject(matchingItem.departurePlans)
  );
  if (fromPlans) {
    return fromPlans;
  }

  const fromLegacy = buildConfigFromLegacyPickupPoints(matchingItem.pickupPoints);
  if (fromLegacy) {
    return fromLegacy;
  }

  return fallback;
}
