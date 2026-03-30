import express from "express";
import cors from "cors";
import productsRoutes   from "./routes/products.routes.js";
import listingsRoutes   from "./routes/listings.routes.js";
import bookingsRoutes   from "./routes/bookings.routes.js";
import customersRoutes  from "./routes/customers.routes.js";
import paymentsRoutes   from "./routes/payments.routes.js";
import enquiriesRoutes  from "./routes/enquiries.routes.js";
import supabasePublic   from "./config/supabasePublicClient.js";
import supabaseAdmin    from "./config/supabaseAdminClient.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",").map((value) => value.trim()).filter(Boolean)
      : true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend is working" });
});

app.use("/api/products",   productsRoutes);
app.use("/api/listings",   listingsRoutes);
app.use("/api/bookings",   bookingsRoutes);
app.use("/api/customers",  customersRoutes);
app.use("/api/payments",   paymentsRoutes);
app.use("/api/enquiries",  enquiriesRoutes);

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "ok" });
});

app.get("/api/health/db", async (req, res) => {
  const [publicCheck, adminCheck] = await Promise.all([
    supabasePublic.from("products").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("products").select("id", { count: "exact", head: true }),
  ]);

  const payload = {
    public: {
      ok: !publicCheck.error,
      table: "products",
      count: publicCheck.count ?? 0,
      error: publicCheck.error?.message || null,
    },
    admin: {
      ok: !adminCheck.error,
      table: "products",
      count: adminCheck.count ?? 0,
      error: adminCheck.error?.message || null,
    },
  };

  if (publicCheck.error || adminCheck.error) {
    return res.status(500).json({ success: false, data: payload });
  }

  return res.json({ success: true, data: payload });
});

app.get("/api/health/db/tables", async (req, res) => {
  const tableChecks = await Promise.all([
    supabasePublic.from("products").select("id", { count: "exact", head: true }),
    supabasePublic.from("product_batches").select("id", { count: "exact", head: true }),
    supabasePublic.from("product_departure_plans").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("bookings").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("customers").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("payments").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("payment_refunds").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("listing_submissions").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("enquiries").select("id", { count: "exact", head: true }),
  ]);

  const [
    productsCheck,
    productBatchesCheck,
    departurePlansCheck,
    bookingsCheck,
    customersCheck,
    paymentsCheck,
    refundsCheck,
    listingsCheck,
    enquiriesCheck,
  ] = tableChecks;

  const payload = {
    products: {
      ok: !productsCheck.error,
      count: productsCheck.count ?? 0,
      access: "public",
      error: productsCheck.error?.message || null,
    },
    product_batches: {
      ok: !productBatchesCheck.error,
      count: productBatchesCheck.count ?? 0,
      access: "public",
      error: productBatchesCheck.error?.message || null,
    },
    product_departure_plans: {
      ok: !departurePlansCheck.error,
      count: departurePlansCheck.count ?? 0,
      access: "public",
      error: departurePlansCheck.error?.message || null,
    },
    bookings: {
      ok: !bookingsCheck.error,
      count: bookingsCheck.count ?? 0,
      access: "admin",
      error: bookingsCheck.error?.message || null,
    },
    customers: {
      ok: !customersCheck.error,
      count: customersCheck.count ?? 0,
      access: "admin",
      error: customersCheck.error?.message || null,
    },
    payments: {
      ok: !paymentsCheck.error,
      count: paymentsCheck.count ?? 0,
      access: "admin",
      error: paymentsCheck.error?.message || null,
    },
    payment_refunds: {
      ok: !refundsCheck.error,
      count: refundsCheck.count ?? 0,
      access: "admin",
      error: refundsCheck.error?.message || null,
    },
    listing_submissions: {
      ok: !listingsCheck.error,
      count: listingsCheck.count ?? 0,
      access: "admin",
      error: listingsCheck.error?.message || null,
    },
    enquiries: {
      ok: !enquiriesCheck.error,
      count: enquiriesCheck.count ?? 0,
      access: "admin",
      error: enquiriesCheck.error?.message || null,
    },
  };

  if (tableChecks.some((check) => check.error)) {
    return res.status(500).json({ success: false, data: payload });
  }

  return res.json({ success: true, data: payload });
});

export default app;
