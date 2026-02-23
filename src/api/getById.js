import app from "../../backend/src/app";
import supabase from "../../backend/src/config/supabaseClient";

app.get("/api/products/:slug", async (req, res) => {
  const { slug } = req.params;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({
    success: true,
    data
  });
});
