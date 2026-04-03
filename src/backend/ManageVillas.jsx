import ManagePage from "./ManagePage";
import { villasList } from "../pages/Villas/Villas";

const AMENITY_OPTIONS = [
  "Free WiFi", "Free Parking", "Private Pool", "Infinity Pool",
  "Air Conditioning", "Garden", "Balcony", "Terrace", "Patio",
  "BBQ Setup", "Fully Equipped Kitchen", "Modern Kitchen", "Kitchen",
  "Pets Allowed", "Pet Friendly", "Family Rooms", "Bath",
  "Barbecue", "Mountain View", "Farm-to-Table Dining", "Hammocks",
  "Nature Views", "Entire Place", "Power Backup", "Parking",
  "Security Camera", "Private Beach Access", "Caretaker on Premises",
  "Outdoor Seating", "High-Speed WiFi", "DTH TV", "Bonfire Area",
];

const HOUSE_RULE_OPTIONS = [
  "No smoking inside", "No loud music after 11 PM",
  "Pets not allowed", "No outside food/catering",
  "ID proof mandatory at check-in",
  "No extra guests without prior approval",
];

const BADGE_OPTIONS = ["Top Pick", "Fabulous", "Best Value", "Pet Friendly", "New", "Staff Pick"];

const FIELDS = [
  { key: "sortOrder",     label: "Display Order",       type: "number",  col: 3,  placeholder: "1 = first" },
  { key: "name",          label: "Villa Name",           required: true,  col: 9 },
  { key: "location",      label: "Location / Address",   required: true,  col: 6,  placeholder: "Girivan, 412108 Pune" },
  { key: "area",          label: "Area / Neighbourhood", col: 6,  placeholder: "Pune" },
  { key: "badge",         label: "Badge / Tag",          col: 4,  placeholder: "Top Pick, Pet Friendly, Best Value…" },
  { key: "ratingLabel",   label: "Rating Label",         col: 4,  placeholder: "Very good, Fabulous, Good" },
  { key: "locationScore", label: "Location Score (/10)", type: "number",  col: 4,  placeholder: "9.6" },
  { key: "price",         label: "Price (₹/night)",      required: true,  type: "number", col: 3,  placeholder: "5999" },
  { key: "originalPrice", label: "Original Price (₹)",   type: "number",  col: 3,  placeholder: "7999" },
  { key: "maxGuests",     label: "Max Guests",           type: "number",  col: 2,  placeholder: "12" },
  { key: "bedrooms",      label: "Bedrooms",             type: "number",  col: 2,  placeholder: "3" },
  { key: "bathrooms",     label: "Bathrooms",            type: "number",  col: 2,  placeholder: "3" },
  { key: "size",          label: "Size (m²)",            col: 3,          placeholder: "279 m²" },
  { key: "rating",        label: "Rating Score (/10)",   type: "number",  col: 3,  placeholder: "8.5" },
  { key: "reviews",       label: "Reviews Count",        type: "number",  col: 3,  placeholder: "42" },
  { key: "checkInTime",   label: "Check-in Time",        col: 3,          placeholder: "12:00 PM" },
  { key: "checkOutTime",  label: "Check-out Time",       col: 3,          placeholder: "10:00 AM" },
  { key: "mapUrl",        label: "Google Maps URL",      col: 6,          placeholder: "https://maps.google.com/..." },
  { key: "imageGallery",  label: "Villa Images",         type: "imageGallery", col: 12 },
  {
    key: "description", label: "Short Description (card preview)", type: "textarea", col: 12,
    placeholder: "One paragraph shown on the listing card.",
    aiPrompt: (form) => `Write a short 2-sentence card description for the villa: "${form.name || "[Villa Name]"}" in ${form.location || "[Location]"}.

Details:
- Bedrooms: ${form.bedrooms || "?"} | Bathrooms: ${form.bathrooms || "?"}
- Max Guests: ${form.maxGuests || "?"}
- Price: ₹${form.price || "?"}/night
- Amenities: ${form.amenities ? String(form.amenities).split("\n").slice(0,4).join(", ") : "[amenities]"}

Write in the style of a booking platform (like Booking.com). Highlight the key selling points. Output only the 2-sentence description, no extra text.`,
  },
  {
    key: "about", label: "Full About / Details", type: "textarea", col: 12,
    placeholder: "Detailed description shown in the villa modal.",
    aiPrompt: (form) => `Write a detailed 120–150 word "About" section for the villa: "${form.name || "[Villa Name]"}" in ${form.location || "[Location]"}.

Villa details:
- Bedrooms: ${form.bedrooms || "?"} | Bathrooms: ${form.bathrooms || "?"}
- Size: ${form.size || "?"}
- Max Guests: ${form.maxGuests || "?"}
- Check-in: ${form.checkInTime || "12:00 PM"} | Check-out: ${form.checkOutTime || "10:00 AM"}
- Amenities: ${form.amenities ? String(form.amenities).split("\n").slice(0,6).join(", ") : "[amenities]"}

Cover:
1. What makes this villa unique and special
2. Interior and outdoor highlights (rooms, pool, garden, views)
3. Ideal for (families, couples, groups, pet owners)
4. Nearby attractions or location advantage

Style: warm, inviting, booking.com quality. Output only the paragraph, no headings.`,
  },
  { key: "guestReview",   label: "Guest Review Quote",   type: "textarea", col: 9,  placeholder: "Amazing property! Very clean and well maintained." },
  { key: "reviewerName",  label: "Reviewer Name",        col: 3,          placeholder: "Rahul, Pune" },
  { key: "distance",      label: "Distance / Nearby Info", col: 12,        placeholder: "42 km from University of Pune · 54 km from Pune Airport" },
  {
    key: "amenities", label: "Amenities",
    type: "checklistTextarea", col: 6,
    options: AMENITY_OPTIONS,
    placeholder: "Add custom amenity, one per line",
  },
  {
    key: "houseRules", label: "House Rules",
    type: "checklistTextarea", col: 6,
    options: HOUSE_RULE_OPTIONS,
    placeholder: "Add custom rule, one per line",
  },
  { key: "nearbyAttractions", label: "Nearby Attractions (one per line)", type: "textarea", col: 12, placeholder: "Lonavala Lake — 3 km\nBhushi Dam — 5 km" },
];

const DEFAULT = {
  sortOrder: "", name: "", location: "", area: "", badge: "", ratingLabel: "",
  locationScore: "", price: "", originalPrice: "", maxGuests: "", bedrooms: "",
  bathrooms: "", size: "", rating: "", reviews: "",
  checkInTime: "12:00 PM", checkOutTime: "10:00 AM", mapUrl: "",
  imageGallery: "[]", description: "", about: "", guestReview: "",
  reviewerName: "", distance: "", amenities: "", houseRules: "",
  nearbyAttractions: "", active: true,
};

const SEED = villasList.map((v, index) => ({
  ...DEFAULT,
  sortOrder: index + 1,
  name: v.name || "",
  location: v.location || "",
  area: v.area || "",
  badge: v.badge || "",
  ratingLabel: v.ratingLabel || "",
  locationScore: v.locationScore || "",
  price: v.price || "",
  originalPrice: v.originalPrice || "",
  maxGuests: v.accommodation?.[0]?.maxGuests || "",
  bedrooms: v.bedrooms || "",
  bathrooms: v.bathrooms || "",
  size: v.size || "",
  rating: v.rating || "",
  reviews: v.reviews || "",
  imageGallery: JSON.stringify((v.gallery || [v.image]).filter(Boolean)),
  description: v.description || "",
  about: v.about || "",
  guestReview: v.guestReview || "",
  reviewerName: v.reviewerName || "",
  distance: v.distance || "",
  amenities: (v.amenities || []).join("\n"),
  active: true,
}));

export default function ManageVillas() {
  return (
    <ManagePage
      title="Villas on Rent"
      icon="🏡"
      storageKey="gt_villas"
      fields={FIELDS}
      defaultForm={DEFAULT}
      seedData={SEED}
    />
  );
}
