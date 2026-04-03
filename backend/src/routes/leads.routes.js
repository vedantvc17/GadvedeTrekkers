import express from "express";
import { captureLead } from "../controllers/enquiries.controller.js";

const router = express.Router();

router.post("/", captureLead);

export default router;
