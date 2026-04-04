/* ═══════════════════════════════════════════════════════════════
   BOOKING MODE CONFIGURATION
   ═══════════════════════════════════════════════════════════════
   Change BOOKING_MODE to instantly switch booking behaviour
   across the entire site — no other code changes needed.

   Supported modes:
     "WHATSAPP"        → All CTAs open WhatsApp (current mode)
     "DIRECT_BOOKING"  → All CTAs route to /book form (future)
     "PAYMENT_GATEWAY" → Triggers inline payment checkout (future)
   ─────────────────────────────────────────────────────────────── */

export const BOOKING_MODE = "WHATSAPP"; // ← change this one line to switch

/* WhatsApp number used exclusively for BOOKING (separate from general inquiry) */
export const BOOKING_WHATSAPP_NUMBER = "918605866155";

/* General inquiry number (existing) */
export const INQUIRY_WHATSAPP_NUMBER = "919856112727";

/* Referral share WhatsApp number (same as booking) */
export const SHARE_WHATSAPP_NUMBER = "918605866155";

/* ─── CTA Button Labels ───────────────────────────────────────── */
export const CTA_LABELS = {
  WHATSAPP: "Book on WhatsApp",
  DIRECT_BOOKING: "Book Now",
  PAYMENT_GATEWAY: "Proceed to Payment",
};

/* ─── Build booking WhatsApp URL with pre-filled message ────────
   Spec message:
     Hi 👋
     I want to book:
     📍 Trek: {trek_name}
     📅 Date: {selected_date}
     💰 Price: ₹{price}
     Please confirm availability.
   ─────────────────────────────────────────────────────────────── */
export function buildBookingWhatsAppUrl(trek, selectedDate = null) {
  const trekName = trek?.name || "Trek";
  const price    = trek?.price ? `₹${trek.price}` : "TBD";
  const date     = selectedDate || trek?.nextDate || "Flexible";

  const message = [
    "Hi 👋",
    "I want to book:",
    "",
    `📍 Trek: ${trekName}`,
    `📅 Date: ${date}`,
    `💰 Price: ${price}`,
    "",
    "Please confirm availability.",
  ].join("\n");

  return `https://wa.me/${BOOKING_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/* ─── Build referral share WhatsApp URL ─────────────────────────
   Message:
     Hi 👋  Join me on this trek!
     📍 Trek: {trek_name}
     📅 Date: {selected_date}
     💰 Price: ₹{price}
     👉 Book here: {referral_url}
     Use my referral code for benefits.
   ─────────────────────────────────────────────────────────────── */
export function buildShareWhatsAppUrl(trek, referralUrl, selectedDate = null) {
  const trekName = trek?.name || "Trek";
  const price    = trek?.price ? `₹${trek.price}` : "TBD";
  const date     = selectedDate || trek?.nextDate || "Flexible";
  const url      = referralUrl || window.location.href;

  const message = [
    "Hi 👋  Join me on this trek!",
    "",
    `📍 Trek: ${trekName}`,
    `📅 Date: ${date}`,
    `💰 Price: ${price}`,
    "",
    `👉 Book here: ${url}`,
    "",
    "Use my referral code for benefits.",
  ].join("\n");

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
