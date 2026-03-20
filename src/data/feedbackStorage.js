/* ── Feedback Storage Service ── */

const KEY          = "gt_feedback";
const SETTINGS_KEY = "gt_feedback_settings";

/* ── Default settings ── */
const DEFAULT_SETTINGS = {
  enabled:          true,
  googleReviewLink: "https://g.page/r/gadvedetrekkers/review",
  emailTemplate:    "Dear {name},\n\nThank you for trekking with Gadvede Trekkers!\n\nWe'd love to hear about your experience on {trek}.\nYour feedback helps us improve and inspires other adventurers.\n\nPlease take 2 minutes to share your thoughts.\n\nWarm regards,\nTeam Gadvede Trekkers",
  questions: [
    "How was your overall trek experience?",
    "How would you rate the guide's assistance?",
    "Was the route difficulty communicated clearly?",
    "How was the pick-up and transport service?",
    "Would you recommend Gadvede Trekkers to friends?",
  ],
};

/* ── Settings CRUD ── */
export function getFeedbackSettings() {
  try {
    const s = localStorage.getItem(SETTINGS_KEY);
    return s ? { ...DEFAULT_SETTINGS, ...JSON.parse(s) } : { ...DEFAULT_SETTINGS };
  } catch { return { ...DEFAULT_SETTINGS }; }
}

export function saveFeedbackSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

/* ── Feedback CRUD ── */
export function getAllFeedback() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function _save(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

export function submitFeedback({ bookingId, customerId, customerName, trekName, rating, comments, answers }) {
  const all = getAllFeedback();
  const fb = {
    id:           `FB-${Date.now()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
    bookingId:    bookingId    || "",
    customerId:   customerId   || "",
    customerName: customerName || "Anonymous",
    trekName:     trekName     || "Unknown Trek",
    rating:       Number(rating),
    comments:     comments     || "",
    answers:      answers      || [],
    submittedAt:  new Date().toISOString(),
  };
  _save([fb, ...all]);
  return fb;
}

export function deleteFeedback(id) {
  _save(getAllFeedback().filter((f) => f.id !== id));
}

/* ── Filter / sort ── */
export function queryFeedback({ rating, trekName, fromDate, toDate } = {}) {
  let results = getAllFeedback();
  if (rating)   results = results.filter((f) => String(f.rating) === String(rating));
  if (trekName) results = results.filter((f) => f.trekName === trekName);
  if (fromDate) {
    const from = new Date(fromDate).getTime();
    results = results.filter((f) => new Date(f.submittedAt).getTime() >= from);
  }
  if (toDate) {
    const to = new Date(toDate).getTime() + 86_400_000;
    results = results.filter((f) => new Date(f.submittedAt).getTime() <= to);
  }
  return results.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
}
