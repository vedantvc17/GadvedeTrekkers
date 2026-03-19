import ManagePage from "./ManagePage";
import { campingList } from "../data/campingData";

const FIELDS = [
  { key: "name",          label: "Site Name (Full)", required: true, col: 8 },
  { key: "shortName",     label: "Short Name",       placeholder: "Pawna Lake Camping" },
  { key: "type",          label: "Type",             required: true, type: "select", options: ["Beach", "Lake", "Forest", "Hill", "Farm"] },
  { key: "location",      label: "Location",         required: true, placeholder: "Pawna Lake — Keware Village" },
  { key: "duration",      label: "Duration",         required: true, placeholder: "Overnight" },
  { key: "price",         label: "Price (₹)",        required: true, type: "number", placeholder: "1099" },
  { key: "originalPrice", label: "Original Price (₹)", type: "number", placeholder: "1499" },
  { key: "badge",         label: "Badge",            placeholder: "Most Popular" },
  { key: "description",   label: "Description",      type: "textarea", col: 12, placeholder: "Brief description of the camping experience…" },
  { key: "image",         label: "Image URL",        col: 12, placeholder: "https://..." },
];

const DEFAULT = {
  name: "", shortName: "", type: "Lake", location: "", duration: "",
  price: "", originalPrice: "", badge: "", description: "", image: "", active: true,
};

export default function ManageCamping() {
  return (
    <ManagePage
      title="Camping"
      icon="⛺"
      storageKey="gt_camping"
      fields={FIELDS}
      defaultForm={DEFAULT}
      seedData={campingList}
    />
  );
}
