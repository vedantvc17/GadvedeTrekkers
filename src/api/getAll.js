app.get("/api/products", async (req, res) => {
  const { type } = req.query;

  let query = supabase.from("products").select("*");

  // Optional filtering by type
  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({
    success: true,
    data
  });
});
