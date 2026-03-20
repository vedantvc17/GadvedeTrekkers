/* ── Emergency Contacts Storage ── */
const KEY = "gt_emergency_contacts";

const SEED = [
  { id: "ec-01", type: "Hospital",       name: "Rural Hospital Khireshwar",   contactNumber: "02488-222100", location: "Khireshwar, Ahmednagar" },
  { id: "ec-02", type: "Hospital",       name: "District Hospital Ahmednagar", contactNumber: "0241-2346200", location: "Ahmednagar" },
  { id: "ec-03", type: "Rescue Team",    name: "Pune Mountain Rescue",         contactNumber: "9823100200",   location: "Pune" },
  { id: "ec-04", type: "Local Authority",name: "Akole Police Station",         contactNumber: "02422-222033", location: "Akole, Ahmednagar" },
  { id: "ec-05", type: "Forest Dept.",   name: "Kalsubai Forest Range",        contactNumber: "02422-244100", location: "Bhandardara" },
];

export function getAllEmergencyContacts() {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (stored.length === 0) { localStorage.setItem(KEY, JSON.stringify(SEED)); return SEED; }
    return stored;
  } catch { return SEED; }
}

function _save(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

export function saveEmergencyContact(contact) {
  const all = getAllEmergencyContacts();
  if (contact.id) {
    _save(all.map((c) => c.id === contact.id ? { ...c, ...contact } : c));
  } else {
    _save([{ ...contact, id: `ec-${Date.now()}` }, ...all]);
  }
}

export function deleteEmergencyContact(id) {
  _save(getAllEmergencyContacts().filter((c) => c.id !== id));
}
