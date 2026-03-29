import express from "express";
import requireAdminApiKey from "../middleware/requireAdminApiKey.js";
import {
  listBookings,
  getBookingByCode,
  createOrUpdateBooking,
  updateBookingStatus,
} from "../controllers/bookings.controller.js";

const router = express.Router();

router.get("/",                            requireAdminApiKey, listBookings);
router.get("/:bookingCode",                requireAdminApiKey, getBookingByCode);
router.post("/",                           createOrUpdateBooking);
router.patch("/admin/:bookingCode/status", requireAdminApiKey, updateBookingStatus);

export default router;
