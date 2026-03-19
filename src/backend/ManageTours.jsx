import ManagePage from "./ManagePage";
import { toursList } from "../data/toursData";

const FIELDS = [
  { key: "name",          label: "Tour Name",       required: true, col: 8 },
  { key: "region",        label: "Region",          required: true, type: "select",
    options: ["himachal", "kashmir", "northeast", "rajasthan", "southindia", "uttarakhand"] },
  { key: "duration",      label: "Duration",        required: true, placeholder: "5-6 Days" },
  { key: "price",         label: "Price (₹)",       required: true, type: "number", placeholder: "9999" },
  { key: "originalPrice", label: "Original Price (₹)", type: "number", placeholder: "12999" },
  { key: "nextDate",      label: "Next Date",       placeholder: "10 Oct 2025" },
  { key: "image",         label: "Image URL",       col: 12, placeholder: "https://..." },
];

const DEFAULT = {
  name: "", region: "himachal", duration: "",
  price: "", originalPrice: "", nextDate: "", image: "", active: true,
};

export default function ManageTours() {
  return (
    <ManagePage
      title="Tours"
      icon="🗺"
      storageKey="gt_tours"
      fields={FIELDS}
      defaultForm={DEFAULT}
      seedData={toursList}
    />
  );
}
