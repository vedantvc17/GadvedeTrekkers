import express from "express";
import requireAdminJWT from "../middleware/requireAdminJWT.js";
import {
  deleteAdminProduct,
  getAdminProducts,
  getAllProducts,
  getProductBySlug,
  upsertAdminProduct,
} from "../controllers/products.controller.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/admin/list", requireAdminJWT, getAdminProducts);
router.post("/admin/upsert", requireAdminJWT, upsertAdminProduct);
router.delete("/admin/:storageKey/:identifier", requireAdminJWT, deleteAdminProduct);
router.get("/:slug", getProductBySlug);

export default router;
