import express from "express";
import requireAdminApiKey from "../middleware/requireAdminApiKey.js";
import { listPayments, listRefunds, upsertPayment, createRefund } from "../controllers/payments.controller.js";

const router = express.Router();

router.get("/",        requireAdminApiKey, listPayments);
router.get("/refunds", requireAdminApiKey, listRefunds);
router.post("/upsert", upsertPayment);
router.post("/refunds", requireAdminApiKey, createRefund);

export default router;
