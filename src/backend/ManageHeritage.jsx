import ManagePage from "./ManagePage";
import { heritageList } from "../data/heritageData";

const FIELDS = [
  { key: "name",          label: "Walk Name",       required: true, col: 8 },
  { key: "type",          label: "Category",        required: true, type: "select", options: ["city", "forts", "temples"] },
  { key: "location",      label: "Location",        required: true, placeholder: "Pune" },
  { key: "duration",      label: "Duration",        required: true, placeholder: "2-3 Hours" },
  { key: "price",         label: "Price (₹)",       required: true, type: "number", placeholder: "499" },
  { key: "originalPrice", label: "Original Price (₹)", type: "number", placeholder: "799" },
  { key: "nextDate",      label: "Next Date",       placeholder: "20 Oct 2025" },
  { key: "rating",        label: "Rating (1-5)",    type: "number", placeholder: "4.8" },
  { key: "image",         label: "Image URL",       col: 12, placeholder: "https://..." },
];

const DEFAULT = {
  name: "", type: "city", location: "", duration: "",
  price: "", originalPrice: "", nextDate: "", rating: "", image: "", active: true,
};

export default function ManageHeritage() {
  return (
    <ManagePage
      title="Heritage Walks"
      icon="🏛"
      storageKey="gt_heritage"
      fields={FIELDS}
      defaultForm={DEFAULT}
      seedData={heritageList}
    />
  );
}
