import express from "express";
import requireAdminApiKey from "../middleware/requireAdminApiKey.js";
import { listEnquiries, upsertEnquiry, updateEnquiry } from "../controllers/enquiries.controller.js";

const router = express.Router();

router.get("/",    requireAdminApiKey, listEnquiries);
router.post("/",   upsertEnquiry);                          // called from frontend on new enquiry
router.patch("/:id", requireAdminApiKey, updateEnquiry);

export default router;
