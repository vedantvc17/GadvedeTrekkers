/* ── Marketing / Campaign Storage ── */
const KEY = "gt_campaigns";

export function getAllCampaigns() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function _save(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

export function saveCampaign(campaign) {
  const all = getAllCampaigns();
  _save([{ ...campaign, id: `CAMP-${Date.now()}`, sentAt: new Date().toISOString(), status: "SENT" }, ...all]);
}

export function deleteCampaign(id) {
  _save(getAllCampaigns().filter((c) => c.id !== id));
}

/* Parse a CSV string into array of { name, contact } objects */
export function parseContactsCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (!lines.length) return [];
  // detect header row
  const first = lines[0].toLowerCase();
  const hasHeader = first.includes("name") || first.includes("phone") || first.includes("email") || first.includes("contact");
  const rows = hasHeader ? lines.slice(1) : lines;
  return rows
    .map((row) => {
      const cols = row.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      return { name: cols[0] || "", contact: cols[1] || cols[0] || "" };
    })
    .filter((r) => r.contact);
}
