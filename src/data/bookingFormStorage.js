const KEY = "gt_booking_form";

export const DEFAULT_BOOKING_FORM = {
  heroKicker: "Secure Trek Booking",
  heroTitle: "Payment And Traveler Details",
  heroSubtitle:
    "Your trek is locked to the selected destination. Add each traveler and choose where they want to join from.",
  leadSectionTitle: "Lead Traveler Details",
  leadSectionSubtitle:
    "The selected trek is fixed based on the trek the customer clicked.",
  summaryTitle: "Payment Summary",
  summarySubtitle: "5% tax is applied on every booking.",
  manualFormTitle: "Direct Payment Booking Desk",
  manualFormSubtitle:
    "Use this staff form when a customer pays directly through UPI or offline instead of the website checkout. These bookings stay tax-free and still get saved in CRM, customers, and bookings.",
  manualFormNote:
    "This staff form is meant for employee/admin use only. Manual direct-payment entries are saved with zero tax.",
  emailNote:
    "Ticket email delivery still needs backend email integration. The front-end booking and ticket flow is ready, but actual email sending is not configured yet.",
  backLinkLabel: "Back To Treks",
  paymentOptions:
    "Debit Card / Credit Card\nUPI\nNet Banking\nPartial Payment",
  manualPaymentMethodOptions:
    "UPI\nCash\nBank Transfer\nCard Machine\nPartial Payment",
  departureOptions:
    "Pune\nMumbai\nKasara\nBase Village",
  manualCategoryOptions:
    "Trek\nTour\nCamping\nRental\nHeritage Walk\nCorporate\nIndustrial Visit",
  manualSourceOptions:
    "Employee Portal\nAdmin Desk\nDirect UPI\nWalk-in\nWhatsApp",
  manualStatusOptions:
    "CONFIRMED\nCANCELLED",
  manualEventOptions:
    "Goa Backpacking\nMalvan Tarkarli with Scuba Diving and Watersports\nHampi Tour\nCorporate Outing Near Pune/Mumbai",
  pickupOptions: JSON.stringify(
    {
      Pune: [
        "McDonald's, Deccan",
        "New Shivaji Nagar (Mari Aai Gate / Wakadewadi)",
        "Nashik Phata (Kasarwadi Police Station)",
        "Wakad Bridge / Rajyog Hotel",
        "Hinjewadi Chowk",
        "Pirangut Chowk (Hinjewadi Phase 3)",
        "Inorbit Mall, Viman Nagar",
        "Chandni Chowk",
      ],
      Mumbai: [
        "CSMT",
        "Byculla",
        "Dadar",
        "Kurla",
        "Ghatkopar",
        "Thane",
        "Dombivali",
        "Kalyan",
        "Borivali National Park Gate",
        "Virwani Bus Stop, Goregaon",
        "Gundavali Bus Stop, Andheri East",
        "Kalanagar Bus Stop, Bandra",
        "Everard Nagar Bus Stop, Sion",
        "Diamond Garden, Chembur",
        "Vashi Plaza",
        "McDonald's, Kalamboli",
      ],
      Kasara: ["Kasara Railway Station (Ticket Counter)", "Kasara Bus Stop"],
      "Base Village": [
        "Direct At Base Village",
        "Nirgudpada Village",
        "Bhira Base Village",
        "Kotamwadi Junction",
      ],
    },
    null,
    2
  ),
  consentRules:
    "I have read and accepted the trek rules, safety instructions, and reporting time.",
  consentFitness:
    "I confirm that I and my group members are medically fit for this trek activity.",
  consentCancellation:
    "I understand the cancellation policy, tax applicability, and partial payment conditions.",
};

export function getBookingFormConfig() {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || "null");
    return { ...DEFAULT_BOOKING_FORM, ...(stored || {}) };
  } catch {
    return { ...DEFAULT_BOOKING_FORM };
  }
}

export function saveBookingFormConfig(config) {
  const next = { ...DEFAULT_BOOKING_FORM, ...config };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
