import ManagePage from "./ManagePage";
import { toursList } from "../data/toursData";
import { ADDITIONAL_TOUR_SEEDS } from "../data/additionalTourDetails";
import {
  TOUR_CARRY_OPTIONS,
  TOUR_DETAIL_SEED_BY_SLUG,
  TOUR_DISCOUNT_OPTIONS,
  TOUR_EXCLUDED_OPTIONS,
  TOUR_INCLUDED_OPTIONS,
  parseJsonValue,
  parseLineItems,
} from "../data/manaliTourDetails";

const FIELDS = [
  { key: "name", label: "Tour Name", required: true, col: 8 },
  { key: "region", label: "Region", required: true, type: "select", col: 4, options: ["himachal", "kashmir", "northeast", "rajasthan", "southindia", "uttarakhand"] },
  { key: "state", label: "State", col: 4, placeholder: "Himachal Pradesh" },
  { key: "duration", label: "Duration", required: true, col: 4, placeholder: "7 Nights 8 Days" },
  { key: "destinationLine", label: "Destinations Covered", col: 4, placeholder: "Manali, Kullu, Kasol, Manikaran" },
  { key: "heroBadge", label: "Hero Badge", col: 4, placeholder: "Himalayan Group Tour" },
  { key: "subtitle", label: "Subtitle", col: 8, placeholder: "Scenic mountain escape with adventure and culture" },
  { key: "price", label: "Starting Price (₹)", required: true, type: "number", col: 4, placeholder: "9999" },
  { key: "originalPrice", label: "Original Price (₹)", type: "number", col: 4, placeholder: "14999" },
  { key: "taxPercent", label: "GST %", type: "number", col: 4, placeholder: "5" },
  { key: "rating", label: "Rating", col: 3, placeholder: "4.8" },
  { key: "reviews", label: "Review Count", col: 3, placeholder: "187" },
  { key: "happyCustomers", label: "Happy Customers Label", col: 6, placeholder: "1000+ Happy Customers" },
  { key: "pickupPointLabel", label: "Pickup Point Label", col: 6, placeholder: "Himachal Pradesh, India" },
  { key: "pickupPointMapLabel", label: "Pickup Map CTA", col: 6, placeholder: "View on Map" },
  { key: "filters", label: "Bottom Filters / Tags", type: "textarea", col: 12, placeholder: "Weekend Trips | 5 to 8 Days | Group Tours" },
  { key: "imageGallery", label: "Tour Banner Images", type: "imageGallery", col: 12 },
  { key: "overview", label: "Tour Overview", type: "textarea", col: 12, placeholder: "Add the full overview and attraction text here." },
  { key: "keyHighlights", label: "Key Highlights (Section|Items, one per line)", type: "textarea", col: 12, placeholder: "Manali|Hidimba Devi Temple, Mall Road, Solang Valley" },
  { key: "briefItinerary", label: "Brief Itinerary (Day|Summary, one per line)", type: "textarea", col: 12, placeholder: "Day 01|Mumbai/Pune to Delhi overnight train journey" },
  { key: "departureDatesDelhi", label: "Departure Dates from Delhi (Month|Dates, one per line)", type: "textarea", col: 6 },
  { key: "departureDatesHometown", label: "Departure Dates from Mumbai/Pune/etc (Month|Dates, one per line)", type: "textarea", col: 6 },
  { key: "pricingOptions", label: "Pricing Options (Label|Price|Description, one per line)", type: "textarea", col: 6, placeholder: "Delhi to Delhi|9999|Base package per person" },
  { key: "addOns", label: "Add-ons (Label|Price, one per line)", type: "textarea", col: 6, placeholder: "Triple Sharing|499" },
  { key: "bookingNote", label: "Booking Note", type: "textarea", col: 12, placeholder: "You can book your seat at 60% now..." },
  { key: "included", label: "What's Included", type: "checklistTextarea", col: 6, options: TOUR_INCLUDED_OPTIONS, placeholder: "Add custom included lines, one per line" },
  { key: "notIncluded", label: "What's Not Included", type: "checklistTextarea", col: 6, options: TOUR_EXCLUDED_OPTIONS, placeholder: "Add custom excluded lines, one per line" },
  { key: "offerCodes", label: "Tour Offers", type: "discountCodes", col: 12, options: TOUR_DISCOUNT_OPTIONS, toggleKey: "discountEnabled" },
  { key: "detailedItinerary", label: "Detailed Itinerary (Day|Time|Description, one per line)", type: "textarea", col: 12, placeholder: "Day 01|11:25 AM|Board Paschim Express" },
  { key: "thingsToCarry", label: "Things to Carry", type: "checklistTextarea", col: 12, options: TOUR_CARRY_OPTIONS, placeholder: "Add custom carry items, one per line" },
  { key: "travelInfo", label: "Travel Information (Title|Description, one per line)", type: "textarea", col: 12, placeholder: "Ticket Booking Process|IRCTC-certified agents..." },
  { key: "paymentDetails", label: "Payment Details (Label|Value, one per line)", type: "textarea", col: 12, placeholder: "UPI ID|trekhievers@okhdfcbank" },
  { key: "cancellationPolicy", label: "Cancellation Policy", type: "textarea", col: 12 },
  { key: "policyNotes", label: "Policy Notes", type: "textarea", col: 12 },
  { key: "faq", label: "FAQ (Question|Answer, one per line)", type: "textarea", col: 12, placeholder: "What is the best time to visit?|October to March is ideal." },
];

const DEFAULT = {
  name: "",
  slug: "",
  region: "himachal",
  state: "",
  duration: "",
  destinationLine: "",
  heroBadge: "",
  subtitle: "",
  price: "",
  originalPrice: "",
  taxPercent: 5,
  nextDate: "",
  image: "",
  imageGallery: "[]",
  instantConfirmation: true,
  bestPriceGuaranteed: true,
  happyCustomers: "",
  rating: "",
  reviews: "",
  pickupPointLabel: "",
  pickupPointMapLabel: "View on Map",
  filters: "",
  overview: "",
  keyHighlights: "",
  briefItinerary: "",
  departureDatesDelhi: "",
  departureDatesHometown: "",
  pricingOptions: "",
  addOns: "",
  bookingNote: "",
  included: "",
  notIncluded: "",
  discountEnabled: true,
  offerCodes: "",
  detailedItinerary: "",
  thingsToCarry: "",
  travelInfo: "",
  paymentDetails: "",
  cancellationPolicy: "",
  policyNotes: "",
  faq: "",
  active: true,
};

const slugifyTourName = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const nextDateFromDepartureText = (value) => {
  const firstLine = parseLineItems(value)[0];
  if (!firstLine) return "";
  const [month, dates] = firstLine.split("|");
  const firstDate = String(dates || "").split(",")[0]?.trim();
  return month && firstDate ? `${firstDate} ${month} 2026` : "";
};

const seedBySlug = Object.fromEntries(
  Object.entries({ ...TOUR_DETAIL_SEED_BY_SLUG, ...ADDITIONAL_TOUR_SEEDS }).map(([slug, item]) => [slug, item])
);

const SEED = toursList.map((tour) => {
  const slug = slugifyTourName(tour.name);
  const richSeed = seedBySlug[slug] || {};
  return {
    ...DEFAULT,
    ...tour,
    slug,
    imageGallery: JSON.stringify([tour.image, tour.image, tour.image].filter(Boolean)),
    ...richSeed,
  };
});

function prepareTourForm(form) {
  const imageGallery = parseJsonValue(form.imageGallery, []).filter(Boolean);
  return {
    ...form,
    slug: form.slug || slugifyTourName(form.name),
    imageGallery: JSON.stringify(imageGallery),
    image: imageGallery[0] || form.image || "",
    nextDate: form.nextDate || nextDateFromDepartureText(form.departureDatesHometown || form.departureDatesDelhi),
    price: Number(form.price || 0),
    originalPrice: Number(form.originalPrice || 0),
    taxPercent: Number(form.taxPercent || 0),
  };
}

function handlePreview(form) {
  const prepared = prepareTourForm(form);
  sessionStorage.setItem("gt_tour_preview", JSON.stringify(prepared));
  window.open(`/tours/${prepared.slug}?preview=1`, "_blank");
}

function backfillSeed(item) {
  const slug = item.slug || slugifyTourName(item.name);
  const richSeed = seedBySlug[slug];
  if (!richSeed) return item;
  const next = { ...item };
  Object.entries(richSeed).forEach(([key, value]) => {
    if (next[key] === "" || next[key] == null || next[key] === "[]") {
      next[key] = value;
    }
  });
  if (!next.imageGallery || next.imageGallery === "[]") {
    next.imageGallery = JSON.stringify([next.image].filter(Boolean));
  }
  return next;
}

export default function ManageTours() {
  return (
    <ManagePage
      title="Tours"
      icon="🗺"
      storageKey="gt_tours"
      fields={FIELDS}
      defaultForm={DEFAULT}
      seedData={SEED.map(backfillSeed)}
      transformForm={prepareTourForm}
      onPreview={handlePreview}
    />
  );
}
