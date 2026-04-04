import express from "express";
import requireAdminJWT from "../middleware/requireAdminJWT.js";
import { listEnquiries, upsertEnquiry, updateEnquiry } from "../controllers/enquiries.controller.js";

const router = express.Router();

router.get("/",    requireAdminJWT, listEnquiries);
router.post("/",   upsertEnquiry);                          // called from frontend on new enquiry
router.patch("/:id", requireAdminJWT, updateEnquiry);

export default router;
