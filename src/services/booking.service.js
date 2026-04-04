/**
 * booking.service.js
 *
 * Single entry point for ALL booking actions across the site.
 *
 * Routing logic lives here — not in components, not in config.
 * When BOOKING_MODE changes, this file routes to the right channel.
 * Components call bookingService.book(product, options) and know nothing else.
 *
 * Current channel: WHATSAPP
 * Planned channels: DIRECT_BOOKING, PAYMENT_GATEWAY
 */

import {
  BOOKING_MODE,
  BOOKING_WHATSAPP_NUMBER,
} from "../config/bookingConfig";
import { handleWhatsAppLead } from "../utils/leadActions";
import { paymentService } from "./payment.service";

export const bookingService = {
  /**
   * Book a product via the channel configured in bookingConfig.js.
   *
   * @param {object} product   — must have at least: name, location, price
   * @param {object} options   — optional overrides: source, selectedDate,
   *                             customerName, customerPhone, customerEmail, pax
   * @returns {Promise}
   *
   * Usage:
   *   await bookingService.book(heritageItem, { source: "Heritage Listing" });
   */
  async book(product, options = {}) {
    switch (BOOKING_MODE) {
      case "WHATSAPP":
        return this._viaWhatsApp(product, options);

      case "DIRECT_BOOKING":
        return this._viaDirect(product, options);

      case "PAYMENT_GATEWAY":
        return this._viaPayment(product, options);

      default:
        console.warn(`bookingService: unknown BOOKING_MODE "${BOOKING_MODE}", falling back to WhatsApp`);
        return this._viaWhatsApp(product, options);
    }
  },

  /* ── Private channel implementations ──────────────────────────────────── */

  async _viaWhatsApp(product, options) {
    return handleWhatsAppLead({
      phoneNumber: options.phoneNumber ?? BOOKING_WHATSAPP_NUMBER,
      packageName: product.name,
      location:    product.location,
      category:    product.category || product.type || "Package",
      source:      options.source   || "Listing Page",
      selectedDate: options.selectedDate ?? product.nextDate ?? null,
      customerName:  options.customerName,
      customerPhone: options.customerPhone,
      customerEmail: options.customerEmail,
      pax:           options.pax,
      preferredDate: options.preferredDate,
    });
  },

  async _viaDirect(product, options) {
    // TODO: when BOOKING_MODE = "DIRECT_BOOKING"
    // Navigate to /book with product pre-filled via React Router state.
    // This will be wired up when the booking form page is built.
    throw new Error(
      `bookingService: DIRECT_BOOKING mode is not yet implemented. ` +
      `Set BOOKING_MODE = "WHATSAPP" in bookingConfig.js to continue.`
    );
  },

  async _viaPayment(product, options) {
    // Delegates entirely to paymentService.
    // paymentService knows which gateway to use (Razorpay / Stripe / PayU).
    return paymentService.initiate(product.price, {
      productId:    product.id,
      productName:  product.name,
      productType:  product.category || product.type,
      customerName: options.customerName,
      customerPhone: options.customerPhone,
      selectedDate:  options.selectedDate ?? product.nextDate,
    });
  },
};
