import ManagePage from "./ManagePage";
import { rentalsList } from "../data/rentalsData";

const RENTAL_PREVIEW_KEY = "gt_rental_preview";

const FIELDS = [
  { key: "name",          label: "Item Name",        required: true, col: 8 },
  { key: "category",      label: "Category",         required: true, type: "select", options: ["Tents", "Gear", "Villas"] },
  { key: "location",      label: "Location",         required: true, placeholder: "Pune" },
  { key: "price",         label: "Price (₹/day)",    required: true, type: "number", placeholder: "299" },
  { key: "originalPrice", label: "Original Price (₹)", type: "number", placeholder: "499" },
  { key: "rating",        label: "Rating (1-5)",     type: "number", placeholder: "4.7" },
  { key: "image",         label: "Image URL",        col: 12, placeholder: "https://..." },
];

const DEFAULT = {
  name: "", category: "Tents", location: "",
  price: "", originalPrice: "", rating: "", image: "", active: true,
};

export default function ManageRentals() {
  return (
    <ManagePage
      title="Rentals"
      icon="🏠"
      storageKey="gt_rentals"
      fields={FIELDS}
      defaultForm={DEFAULT}
      seedData={rentalsList}
      onPreview={(form) => {
        const previewItem = {
          ...form,
          id: "preview",
          image: form.image || "/images/rentals/tent.jpg",
          rating: Number(form.rating) || 4.5,
          reviews: 0,
          deposit: Math.max(500, Math.round(Number(form.price || 0) * 2)),
          availability: "Preview",
          badge: form.category === "Villas" ? "Preview Villa" : "Preview",
          pricePerDay: Number(form.price) || 0,
          pricingTiers: [
            { period: "1 Day", rentPerDay: Number(form.price) || 0 },
            { period: "7 Days", rentPerDay: Math.max(0, Math.round((Number(form.price) || 0) * 0.8)) },
            { period: "15 Days", rentPerDay: Math.max(0, Math.round((Number(form.price) || 0) * 0.65)) },
          ],
          description: form.name
            ? `${form.name} preview card for the rentals detail page.`
            : "Preview rental item.",
          specifications: [
            { label: "Category", value: form.category || "Rental" },
            { label: "Location", value: form.location || "TBD" },
            { label: "Price", value: `₹${Number(form.price || 0).toLocaleString("en-IN")}/day` },
          ],
          images: [form.image || "/images/rentals/tent.jpg"],
        };

        sessionStorage.setItem(RENTAL_PREVIEW_KEY, JSON.stringify(previewItem));
        window.open("/rentals/preview", "_blank", "noopener,noreferrer");
      }}
    />
  );
}
