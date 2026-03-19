import ManagePage from "./ManagePage";
import { uniqueTreks } from "../data/treks";

const SEED = uniqueTreks.map((t) => ({
  name: t.name,
  subtitle: "",
  fortType: "",
  region: t.location?.toLowerCase().includes("pune") ? "pune" : "mumbai",
  location: t.location,
  difficulty: t.difficulty,
  enduranceLevel: t.difficulty,
  duration: t.duration,
  altitude: t.altitude,
  price: t.price,
  originalPrice: t.originalPrice,
  nextDate: t.nextDate,
  rating: t.rating,
  reviews: t.reviews || "",
  image: t.image,
  baseVillage: "",
  regionArea: "",
  climbTime: "",
  distance: "",
  drivePune: "",
  wildlifeSanctuary: "",
  pricingLabel: "",
  about: "",
  history: "",
  mainAttractions: "",
  detailedHistory: "",
  highlights: "",
  placesToVisit: "",
  itinerary: "",
  included: "",
  notIncluded: "",
  thingsToCarry: "",
  discountCodes: "",
  pickupPoints: "{}",
  active: true,
}));

const FIELDS = [
  /* ── Basic Info ── */
  { key: "name",          label: "Trek Name",              required: true,  col: 8 },
  { key: "subtitle",      label: "Subtitle / Tagline",     col: 12, placeholder: "Medieval Hill Fort — 4650 Ft | Konkan Kada | Kedareshwar Cave" },
  { key: "fortType",      label: "Fort / Trek Type",       col: 4,  placeholder: "Ancient Hill Fort" },
  { key: "region",        label: "Region",                 required: true,  type: "select", options: ["mumbai", "pune"], col: 4 },
  { key: "location",      label: "Location",               required: true,  placeholder: "Pune, Maharashtra", col: 4 },
  { key: "difficulty",    label: "Difficulty",             required: true,  type: "select", options: ["Easy", "Medium", "Hard"], col: 4 },
  { key: "enduranceLevel",label: "Endurance Level",        type: "select",  options: ["Easy", "Medium", "Hard"], col: 4 },
  { key: "duration",      label: "Duration",               required: true,  placeholder: "1 Night 1 Day", col: 4 },
  { key: "altitude",      label: "Altitude",               placeholder: "1424m", col: 4 },
  { key: "price",         label: "Price (₹)",              required: true,  type: "number", placeholder: "1449", col: 4 },
  { key: "originalPrice", label: "Original Price (₹)",     type: "number",  placeholder: "1899", col: 4 },
  { key: "nextDate",      label: "Next Date",              placeholder: "20 Oct 2025", col: 4 },
  { key: "rating",        label: "Rating (1-5)",           type: "number",  placeholder: "4.9", col: 4 },
  { key: "reviews",       label: "Review Count",           type: "number",  placeholder: "190", col: 4 },
  { key: "image",         label: "Image URL",              col: 12, placeholder: "https://..." },

  /* ── Trek Details ── */
  { key: "baseVillage",       label: "Base Village",         placeholder: "Pachnai Village", col: 4 },
  { key: "regionArea",        label: "Region / Area",        placeholder: "Igatpuri, Ahmednagar, Junnar", col: 4 },
  { key: "climbTime",         label: "Climb Time (one way)", placeholder: "3 hours uphill", col: 4 },
  { key: "distance",          label: "Distance (one way)",   placeholder: "5 km from Pachnai", col: 4 },
  { key: "drivePune",         label: "Drive from Pune",      placeholder: "170 km one way", col: 4 },
  { key: "wildlifeSanctuary", label: "Wildlife Sanctuary",   placeholder: "Kalsubai Harishchandragad WS", col: 4 },
  { key: "pricingLabel",      label: "Pricing Label",        placeholder: "From Pune (Private Non-AC Vehicle)", col: 12 },

  /* ── Content ── */
  { key: "about",          label: "About (Overview)",        type: "textarea", col: 12 },
  { key: "history",        label: "History & Significance",  type: "textarea", col: 12 },
  { key: "mainAttractions",label: "Main Attractions",        type: "textarea", col: 12 },
  { key: "detailedHistory",label: "Detailed History",        type: "textarea", col: 12 },

  /* ── Lists (one item per line) ── */
  { key: "highlights",    label: "Trek Highlights (one per line, e.g. 🏔 4650 Ft High)",
    type: "textarea", col: 12 },
  { key: "placesToVisit", label: "Places to Visit (Name|Description, one per line)",
    type: "textarea", col: 12 },
  { key: "itinerary",     label: "Itinerary (Day|Time|Description, one per line)",
    type: "textarea", col: 12 },
  { key: "included",      label: "What's Included (one per line)",     type: "textarea", col: 6 },
  { key: "notIncluded",   label: "Not Included (one per line)",        type: "textarea", col: 6 },
  { key: "thingsToCarry", label: "Things to Carry (one per line)",     type: "textarea", col: 12 },
  { key: "discountCodes", label: "Discount Codes (CODE|Description, one per line)", type: "textarea", col: 12 },

  /* ── Departure & Pickup Points ── */
  {
    key: "pickupPoints",
    label: "Departure Cities & Pickup Points",
    type: "pickups",
    col: 12,
    cities: ["Mumbai", "Pune", "Nashik", "Thane", "Navi Mumbai", "Aurangabad", "Nagpur", "Kolhapur"],
  },
];

const DEFAULT = {
  name: "", subtitle: "", fortType: "", region: "mumbai", location: "",
  difficulty: "Medium", enduranceLevel: "Medium", duration: "", altitude: "",
  price: "", originalPrice: "", nextDate: "", rating: "", reviews: "", image: "",
  baseVillage: "", regionArea: "", climbTime: "", distance: "", drivePune: "",
  wildlifeSanctuary: "", pricingLabel: "",
  about: "", history: "", mainAttractions: "", detailedHistory: "",
  highlights: "", placesToVisit: "", itinerary: "",
  included: "", notIncluded: "", thingsToCarry: "", discountCodes: "", pickupPoints: "{}",
};

export default function ManageTreks() {
  return (
    <ManagePage
      title="Treks"
      icon="🥾"
      storageKey="gt_treks"
      fields={FIELDS}
      defaultForm={DEFAULT}
      seedData={SEED}
    />
  );
}
