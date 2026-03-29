import supabasePublic from "../config/supabasePublicClient.js";
import supabaseAdmin from "../config/supabaseAdminClient.js";
import {
  buildBatchRows,
  buildDepartureRows,
  productItemFromRow,
  productRowFromItem,
  productTypeFromStorageKey,
  slugify,
} from "../utils/productMapper.js";

async function enrichProduct(productRow) {
  const item = productItemFromRow(productRow);

  if (productRow.product_type !== "trek") {
    return item;
  }

  const [{ data: batches }, { data: departures }] = await Promise.all([
    supabasePublic
      .from("product_batches")
      .select("id, batch_date, batch_label, whatsapp_group_link, status")
      .eq("product_id", productRow.id)
      .order("batch_date", { ascending: true }),
    supabasePublic
      .from("product_departure_plans")
      .select("departure_origin, price, pickup_points, itinerary_text")
      .eq("product_id", productRow.id),
  ]);

  return {
    ...item,
    trekDateBatches: JSON.stringify(
      (batches || []).map((entry) => ({
        id: entry.id,
        date: entry.batch_date,
        label: entry.batch_label || "",
        whatsappGroupLink: entry.whatsapp_group_link || "",
        status: entry.status || "OPEN",
      }))
    ),
    departurePlans: JSON.stringify(
      Object.fromEntries(
        (departures || []).map((entry) => [
          entry.departure_origin,
          {
            price: entry.price ?? 0,
            pickupPoints: entry.pickup_points || [],
            itinerary: entry.itinerary_text || "",
          },
        ])
      )
    ),
  };
}

export async function getAllProducts(req, res) {
  const { type } = req.query;

  let query = supabasePublic
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (type) {
    query = query.eq("product_type", type);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  return res.json({
    success: true,
    data: await Promise.all((data || []).map(enrichProduct)),
  });
}

export async function getProductBySlug(req, res) {
  const { slug } = req.params;

  const { data, error } = await supabasePublic
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  if (!data) {
    return res.status(404).json({ success: false, error: "Product not found" });
  }

  return res.json({ success: true, data: await enrichProduct(data) });
}

export async function getAdminProducts(req, res) {
  const { storageKey } = req.query;
  const productType = productTypeFromStorageKey(storageKey);

  if (!productType) {
    return res.status(400).json({ success: false, error: "Invalid storage key" });
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("product_type", productType)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  return res.json({
    success: true,
    data: await Promise.all((data || []).map(enrichProduct)),
  });
}

export async function upsertAdminProduct(req, res) {
  const { storageKey, item } = req.body;
  const productRow = productRowFromItem(storageKey, item);

  if (!productRow) {
    return res.status(400).json({ success: false, error: "Invalid product payload" });
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .upsert(productRow, { onConflict: "slug" })
    .select("*")
    .single();

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  if (productRow.product_type === "trek") {
    const batchRows = buildBatchRows(data.id, item);
    const departureRows = buildDepartureRows(data.id, item);

    await supabaseAdmin.from("product_batches").delete().eq("product_id", data.id);
    await supabaseAdmin.from("product_departure_plans").delete().eq("product_id", data.id);

    if (batchRows.length) {
      await supabaseAdmin.from("product_batches").insert(batchRows);
    }
    if (departureRows.length) {
      await supabaseAdmin.from("product_departure_plans").insert(departureRows);
    }
  }

  return res.json({ success: true, data: await enrichProduct(data) });
}

export async function deleteAdminProduct(req, res) {
  const { storageKey, identifier } = req.params;
  const productType = productTypeFromStorageKey(storageKey);

  if (!productType) {
    return res.status(400).json({ success: false, error: "Invalid storage key" });
  }

  let query = supabaseAdmin.from("products").delete().eq("product_type", productType);

  if (/^[0-9a-f-]{36}$/i.test(identifier)) {
    query = query.eq("id", identifier);
  } else {
    query = query.eq("slug", slugify(decodeURIComponent(identifier)));
  }

  const { error } = await query;

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  return res.status(204).send();
}
