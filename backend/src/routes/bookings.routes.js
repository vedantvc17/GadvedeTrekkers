import express from "express";
import requireAdminJWT from "../middleware/requireAdminJWT.js";
import {
  listBookings,
  getBookingByCode,
  createOrUpdateBooking,
  updateBookingStatus,
} from "../controllers/bookings.controller.js";

const router = express.Router();

router.get("/",                            requireAdminJWT, listBookings);
router.get("/:bookingCode",                requireAdminJWT, getBookingByCode);
router.post("/",                           createOrUpdateBooking);
router.patch("/admin/:bookingCode/status", requireAdminJWT, updateBookingStatus);

export default router;
