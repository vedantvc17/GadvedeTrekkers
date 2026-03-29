import express from "express";
import requireAdminApiKey from "../middleware/requireAdminApiKey.js";
import { listCustomers, getCustomerById, upsertCustomer } from "../controllers/customers.controller.js";

const router = express.Router();

router.get("/",    requireAdminApiKey, listCustomers);
router.get("/:id", requireAdminApiKey, getCustomerById);
router.post("/upsert", upsertCustomer);

export default router;
