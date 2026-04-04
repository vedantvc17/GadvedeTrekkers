import express from "express";
import requireAdminJWT from "../middleware/requireAdminJWT.js";
import { listPayments, listRefunds, upsertPayment, createRefund } from "../controllers/payments.controller.js";

const router = express.Router();

router.get("/",        requireAdminJWT, listPayments);
router.get("/refunds", requireAdminJWT, listRefunds);
router.post("/upsert", upsertPayment);
router.post("/refunds", requireAdminJWT, createRefund);

export default router;
