import express from "express";
import requireAdminApiKey from "../middleware/requireAdminApiKey.js";
import {
  deleteAdminProduct,
  getAdminProducts,
  getAllProducts,
  getProductBySlug,
  upsertAdminProduct,
} from "../controllers/products.controller.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/admin/list", requireAdminApiKey, getAdminProducts);
router.post("/admin/upsert", requireAdminApiKey, upsertAdminProduct);
router.delete("/admin/:storageKey/:identifier", requireAdminApiKey, deleteAdminProduct);
router.get("/:slug", getProductBySlug);

export default router;
