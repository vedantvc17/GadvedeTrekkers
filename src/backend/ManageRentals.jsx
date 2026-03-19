import ManagePage from "./ManagePage";
import { rentalsList } from "../data/rentalsData";

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
    />
  );
}
