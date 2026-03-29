import express from "express";
import requireAdminApiKey from "../middleware/requireAdminApiKey.js";
import {
  createListing,
  deleteAdminListing,
  getAdminListings,
  updateAdminListing,
} from "../controllers/listings.controller.js";

const router = express.Router();

router.post("/:type", createListing);
router.get("/admin/list", requireAdminApiKey, getAdminListings);
router.patch("/admin/:id", requireAdminApiKey, updateAdminListing);
router.delete("/admin/:id", requireAdminApiKey, deleteAdminListing);

export default router;
