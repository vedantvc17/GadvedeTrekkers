import express from "express";
import cors from "cors";
import productsRoutes from "./routes/products.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

app.use("/api/products", productsRoutes);

export default app;
