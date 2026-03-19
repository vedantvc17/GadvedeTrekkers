const defaultPickupOptions = {
  Pune: ["Shivajinagar", "Wakad", "Nigdi", "Katraj"],
  Mumbai: ["Dadar", "Thane", "Borivali", "Ghatkopar"],
  Kasara: ["Kasara Station", "Kasara Bus Stop"],
  "Base Village": ["Direct At Base Village", "Bari Village Meeting Point"],
};

const trekPickupMap = {
  "harishchandragad-trek": {
    Pune: [
      "Deccan — McDonald's",
      "Shivajinagar — New Bus Stop",
      "Nashik Phata",
    ],
    "Base Village": ["Direct At Pachnai Village"],
  },
  "kalsubai-trek": {
    Kasara: ["Kasara Railway Station"],
    Mumbai: [
      "Borivali — National Park Main Gate",
      "Goregaon — Virwani Bus Stop",
      "Andheri East — Gundavali Bus Stop",
      "Bandra — Kalanagar Bus Stop",
      "Sion — Everard Nagar Bus Stop",
      "Ghatkopar — Amar Mahal",
      "Thane — Teen Hath Naka",
      "Kalyan — Bypass",
    ],
    Pune: [
      "Deccan — McDonald's",
      "Shivajinagar — New Bus Stop",
      "Nashik Phata",
    ],
    "Base Village": ["Direct At Bari Village"],
  },
};

export function getPickupOptionsForTrek(trekSlug) {
  return trekPickupMap[trekSlug] || defaultPickupOptions;
}
