import dotenv from "dotenv";
dotenv.config(); // ✅ MUST BE FIRST LINE

import express from "express";
import cors from "cors";
import productsRoutes from "./routes/products.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

app.use("/api/products", productsRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("ENV SUPABASE_URL:", process.env.SUPABASE_URL);
  console.log(`Server running on http://localhost:${PORT}`);
});