import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { uniqueTreks } from "../src/data/treks.js";
import { toursList } from "../src/data/toursData.js";
import { campingList } from "../src/data/campingData.js";
import { rentalsList } from "../src/data/rentalsData.js";
import { heritageList } from "../src/data/heritageData.js";
import { ivDestinations } from "../src/data/industrialVisitsData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, "../supabase");
const outFile = path.join(outDir, "seed_from_local_project.sql");

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sqlString(value) {
  if (value == null || value === "") return "null";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlJson(value) {
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
}

function sqlNumber(value) {
  if (value == null || value === "") return "null";
  const numeric = Number(value);
  return Number.isFinite(numeric) ? String(numeric) : "null";
}

function sqlDate(value) {
  if (!value) return "null";
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return `'${parsed.toISOString().slice(0, 10)}'`;
  const fallback = new Date(`${value} GMT+0530`);
  return Number.isNaN(fallback.getTime()) ? "null" : `'${fallback.toISOString().slice(0, 10)}'`;
}

function buildProductInsert(row) {
  return `(
  ${sqlString(row.name)},
  ${sqlString(row.slug)},
  ${sqlString(row.product_type)},
  ${sqlString(row.region)},
  ${sqlString(row.location)},
  ${sqlString(row.duration_label)},
  ${sqlString(row.altitude_label)},
  ${sqlString(row.short_description)},
  ${sqlString(row.description)},
  ${sqlNumber(row.base_price)},
  ${sqlNumber(row.compare_at_price)},
  ${sqlNumber(row.rating)},
  ${sqlNumber(row.review_count)},
  ${sqlString(row.primary_image_url)},
  ${sqlJson(row.gallery)},
  ${row.is_featured ? "true" : "false"},
  ${row.is_active ? "true" : "false"},
  ${sqlNumber(row.sort_order)},
  ${sqlJson(row.extra_content)}
)`;
}

const products = [
  ...uniqueTreks.map((item, index) => ({
    name: item.name,
    slug: item.slug || slugify(item.name),
    product_type: "trek",
    region: item.location?.toLowerCase().includes("pune") ? "pune" : "mumbai",
    location: item.location,
    duration_label: item.duration,
    altitude_label: item.altitude,
    short_description: item.seasonalTag || item.difficulty,
    description: item.name,
    base_price: item.price,
    compare_at_price: item.originalPrice,
    rating: item.rating,
    review_count: item.reviews,
    primary_image_url: item.image,
    gallery: item.gallery || [item.image].filter(Boolean),
    is_featured: index < 6,
    is_active: true,
    sort_order: index + 1,
    extra_content: { rawItem: item },
  })),
  ...toursList.map((item, index) => ({
    name: item.name,
    slug: slugify(item.name),
    product_type: "tour",
    region: item.region,
    location: item.region,
    duration_label: item.duration,
    altitude_label: null,
    short_description: item.region,
    description: item.name,
    base_price: item.price,
    compare_at_price: item.originalPrice,
    rating: null,
    review_count: 0,
    primary_image_url: item.image,
    gallery: [item.image].filter(Boolean),
    is_featured: index < 4,
    is_active: true,
    sort_order: index + 1,
    extra_content: { rawItem: item },
  })),
  ...campingList.map((item, index) => ({
    name: item.name,
    slug: slugify(item.name),
    product_type: "camping",
    region: item.type,
    location: item.location,
    duration_label: item.duration,
    altitude_label: null,
    short_description: item.badge || item.type,
    description: item.description,
    base_price: item.price,
    compare_at_price: item.originalPrice,
    rating: null,
    review_count: 0,
    primary_image_url: item.image,
    gallery: [item.image].filter(Boolean),
    is_featured: index < 3,
    is_active: true,
    sort_order: index + 1,
    extra_content: { rawItem: item },
  })),
  ...rentalsList.map((item, index) => ({
    name: item.name,
    slug: slugify(item.name),
    product_type: item.category === "Villas" ? "villa" : "rental",
    region: item.category,
    location: item.location,
    duration_label: null,
    altitude_label: null,
    short_description: item.category,
    description: item.name,
    base_price: item.price,
    compare_at_price: item.originalPrice,
    rating: item.rating,
    review_count: item.reviews,
    primary_image_url: item.image,
    gallery: [item.image].filter(Boolean),
    is_featured: false,
    is_active: true,
    sort_order: index + 1,
    extra_content: { rawItem: item },
  })),
  ...heritageList.map((item, index) => ({
    name: item.name,
    slug: slugify(item.name),
    product_type: "heritage",
    region: item.type,
    location: item.location,
    duration_label: item.duration,
    altitude_label: null,
    short_description: item.type,
    description: item.name,
    base_price: item.price,
    compare_at_price: item.originalPrice,
    rating: item.rating,
    review_count: item.reviews,
    primary_image_url: item.image,
    gallery: [item.image].filter(Boolean),
    is_featured: false,
    is_active: true,
    sort_order: index + 1,
    extra_content: { rawItem: item },
  })),
  ...ivDestinations.map((item, index) => ({
    name: item.title,
    slug: item.id || slugify(item.title),
    product_type: "industrial",
    region: item.bestFor,
    location: item.subtitle,
    duration_label: item.duration,
    altitude_label: null,
    short_description: item.subtitle,
    description: item.highlights?.join(", "),
    base_price: item.pricingSlabs?.find((slab) => slab.pricePerHead)?.pricePerHead ?? null,
    compare_at_price: null,
    rating: null,
    review_count: 0,
    primary_image_url: item.images?.[0]?.src || null,
    gallery: (item.images || []).map((entry) => entry.src).filter(Boolean),
    is_featured: false,
    is_active: true,
    sort_order: index + 1,
    extra_content: { rawItem: item },
  })),
];

const batchRows = uniqueTreks
  .filter((item) => item.nextDate)
  .map((item) => ({
    slug: item.slug || slugify(item.name),
    batch_date: item.nextDate,
    batch_label: "Primary batch",
  }))
  .filter((item) => sqlDate(item.batch_date) !== "null");

const sql = `begin;

insert into public.products (
  name,
  slug,
  product_type,
  region,
  location,
  duration_label,
  altitude_label,
  short_description,
  description,
  base_price,
  compare_at_price,
  rating,
  review_count,
  primary_image_url,
  gallery,
  is_featured,
  is_active,
  sort_order,
  extra_content
)
values
${products.map(buildProductInsert).join(",\n")}
on conflict (slug) do update
set
  name = excluded.name,
  product_type = excluded.product_type,
  region = excluded.region,
  location = excluded.location,
  duration_label = excluded.duration_label,
  altitude_label = excluded.altitude_label,
  short_description = excluded.short_description,
  description = excluded.description,
  base_price = excluded.base_price,
  compare_at_price = excluded.compare_at_price,
  rating = excluded.rating,
  review_count = excluded.review_count,
  primary_image_url = excluded.primary_image_url,
  gallery = excluded.gallery,
  is_featured = excluded.is_featured,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  extra_content = excluded.extra_content;

${batchRows
  .map(
    (row) => `insert into public.product_batches (
  product_id,
  batch_date,
  batch_label,
  status
)
select id, ${sqlDate(row.batch_date)}, ${sqlString(row.batch_label)}, 'OPEN'
from public.products
where slug = ${sqlString(row.slug)}
on conflict do nothing;`
  )
  .join("\n\n")}

commit;
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, sql, "utf8");
console.log(`Seed SQL written to ${outFile}`);
