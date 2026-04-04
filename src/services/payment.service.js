/**
 * payment.service.js
 *
 * Abstraction layer for payment gateway integration.
 * bookingService calls this when BOOKING_MODE = "PAYMENT_GATEWAY".
 *
 * ── How to add Razorpay ──────────────────────────────────────────────────
 *
 * 1. Set BOOKING_MODE = "PAYMENT_GATEWAY" in src/config/bookingConfig.js
 * 2. Add to frontend .env:
 *      VITE_PAYMENT_GATEWAY=razorpay
 *      VITE_RAZORPAY_KEY_ID=rzp_live_...
 * 3. Add to backend .env:
 *      RAZORPAY_KEY_ID=rzp_live_...
 *      RAZORPAY_KEY_SECRET=...
 * 4. Add backend routes:
 *      POST /api/payments/create-order   → creates Razorpay order, returns orderId
 *      POST /api/payments/verify         → verifies HMAC signature
 * 5. Uncomment the _razorpay() implementation below.
 * 6. Load the Razorpay checkout script in index.html:
 *      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
 *
 * ── How to add Stripe ────────────────────────────────────────────────────
 *
 * 1. Set VITE_PAYMENT_GATEWAY=stripe
 * 2. npm install @stripe/stripe-js
 * 3. Implement _stripe() following the same pattern as _razorpay().
 * 4. Add POST /api/payments/create-intent on backend.
 *
 * ── How to add PayU ──────────────────────────────────────────────────────
 *
 * 1. Set VITE_PAYMENT_GATEWAY=payu
 * 2. Implement _payU() with a form POST to PayU's endpoint.
 */

import { apiRequest } from "../api/backendClient";

const GATEWAY = import.meta.env.VITE_PAYMENT_GATEWAY || "none";

export const paymentService = {
  /**
   * Initiate a payment.
   *
   * @param {number} amount   Amount in INR (whole rupees, not paise).
   * @param {object} meta     { productId, productName, productType,
   *                            customerName, customerPhone, selectedDate }
   * @returns {Promise<{ success: true, paymentId: string, orderId: string }>}
   */
  async initiate(amount, meta = {}) {
    if (GATEWAY === "razorpay") return this._razorpay(amount, meta);
    if (GATEWAY === "stripe")   return this._stripe(amount, meta);
    if (GATEWAY === "payu")     return this._payU(amount, meta);

    throw new Error(
      `paymentService: No payment gateway configured.\n` +
      `Set VITE_PAYMENT_GATEWAY=razorpay (or stripe/payu) in .env\n` +
      `and BOOKING_MODE="PAYMENT_GATEWAY" in src/config/bookingConfig.js`
    );
  },

  /**
   * Verify a payment after the gateway redirects back.
   * Always validated server-side — never trust client-only confirmation.
   *
   * @param {string} paymentId   Gateway payment ID
   * @param {string} orderId     Gateway order ID
   * @param {string} signature   HMAC signature from gateway
   */
  async verify(paymentId, orderId, signature) {
    return apiRequest("/api/payments/verify", {
      method: "POST",
      body: { paymentId, orderId, signature },
    });
  },

  /* ── Gateway implementations ─────────────────────────────────────────── */

  async _razorpay(amount, meta) {
    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!keyId) {
      throw new Error("paymentService: VITE_RAZORPAY_KEY_ID is not set in .env");
    }

    // Step 1 — Create order on backend (backend signs with secret, never expose to frontend)
    const order = await apiRequest("/api/payments/create-order", {
      method: "POST",
      body: { amount: amount * 100, currency: "INR", ...meta }, // Razorpay uses paise
    });

    // Step 2 — Open Razorpay checkout modal
    return new Promise((resolve, reject) => {
      /* eslint-disable no-undef */
      if (typeof Razorpay === "undefined") {
        reject(new Error(
          "Razorpay script not loaded. Add to index.html: " +
          '<script src="https://checkout.razorpay.com/v1/checkout.js"></script>'
        ));
        return;
      }

      const rzp = new Razorpay({ // eslint-disable-line no-undef
        key:       keyId,
        amount:    order.amount,
        currency:  "INR",
        name:      "Gadvede Trekkers",
        description: meta.productName || "Adventure Booking",
        order_id:  order.id,
        prefill: {
          name:    meta.customerName  || "",
          contact: meta.customerPhone || "",
        },
        theme: { color: "#198754" }, // Bootstrap success green
        handler: (response) => resolve({
          success:   true,
          paymentId: response.razorpay_payment_id,
          orderId:   response.razorpay_order_id,
          signature: response.razorpay_signature,
        }),
        modal: {
          ondismiss: () => reject(new Error("Payment cancelled by user")),
        },
      });
      /* eslint-enable no-undef */
      rzp.open();
    });
  },

  async _stripe(_amount, _meta) {
    // TODO: implement when Stripe is chosen
    // import { loadStripe } from '@stripe/stripe-js';
    // const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    // const session = await apiRequest('/api/payments/create-session', { method: 'POST', body: meta });
    // await stripe.redirectToCheckout({ sessionId: session.id });
    throw new Error("paymentService: Stripe not yet implemented");
  },

  async _payU(_amount, _meta) {
    // TODO: implement PayU form POST
    throw new Error("paymentService: PayU not yet implemented");
  },
};
