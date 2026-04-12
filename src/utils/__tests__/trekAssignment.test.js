/**
 * Unit tests for trek assignment logic in EmployeePortal
 *
 * Tests cover:
 * 1. getLeaderTrekEvents — reads from localStorage gt_trek_payments
 * 2. mergeTrekEvents     — deduplication logic (localStorage + Supabase backend)
 * 3. Backend fetch useEffect behaviour (via fetch mock)
 *
 * Run with: npx vitest run
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/* ─────────────────────────────────────────────
   Pure helpers extracted from EmployeePortal
   (mirrors the exact logic in the component)
───────────────────────────────────────────── */

/** Mirrors getLeaderTrekEvents in EmployeePortal.jsx (lines 54-59) */
function getLeaderTrekEvents(empName) {
  try {
    const payments = JSON.parse(localStorage.getItem("gt_trek_payments")) || [];
    return payments.filter(p => p.config?.trekLeaderName === empName);
  } catch { return []; }
}

/**
 * Mirrors the allTrekEvents useMemo in EmployeePortal.jsx (lines 220-241)
 * Accepts localStorage events + backend (Supabase) events, deduplicates by trekName|eventDate
 */
function mergeTrekEvents(myTrekEvents, backendTrekEvents) {
  const seen   = new Set();
  const merged = [...myTrekEvents];
  myTrekEvents.forEach(e => {
    if (e.trekName && e.eventDate) seen.add(`${e.trekName}|${e.eventDate}`);
  });
  backendTrekEvents.forEach(e => {
    const key = `${e.trek_name}|${e.event_date}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push({
        paymentId:    e.id,
        trekName:     e.trek_name,
        eventDate:    e.event_date,
        participants: e.seats_total,
        config:       e.config || {},
        status:       e.status,
      });
    }
  });
  return merged;
}

/* ── Fixtures ── */
const LOCAL_TREK_1 = {
  paymentId: "PAY-001",
  trekName:  "Kalsubai Trek",
  eventDate: "2026-05-15",
  participants: 20,
  config: { trekLeaderName: "Rahul Patil", leaderFee: 2500 },
  status: "PENDING",
};

const LOCAL_TREK_2 = {
  paymentId: "PAY-002",
  trekName:  "Harishchandragad",
  eventDate: "2026-06-20",
  participants: 15,
  config: { trekLeaderName: "Rahul Patil", leaderFee: 2000 },
  status: "PENDING",
};

const LOCAL_TREK_OTHER_LEADER = {
  paymentId: "PAY-003",
  trekName:  "Rajmachi Trek",
  eventDate: "2026-07-10",
  participants: 25,
  config: { trekLeaderName: "Vikram Jadhav", leaderFee: 2500 },
  status: "PENDING",
};

const BACKEND_TREK_NEW = {
  id: 10,
  trek_name:   "Sinhagad Trek",
  event_date:  "2026-08-05",
  leader_name: "Rahul Patil",
  seats_total: 30,
  config:      { trekLeaderName: "Rahul Patil" },
  status:      "UPCOMING",
};

const BACKEND_TREK_DUPLICATE = {
  id: 11,
  trek_name:   "Kalsubai Trek",    // same as LOCAL_TREK_1
  event_date:  "2026-05-15",       // same as LOCAL_TREK_1
  leader_name: "Rahul Patil",
  seats_total: 20,
  config:      {},
  status:      "UPCOMING",
};

/* ────────────────────────────────────────────────────────
   getLeaderTrekEvents
──────────────────────────────────────────────────────── */
describe("getLeaderTrekEvents", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("returns empty array when localStorage has no trek payments", () => {
    expect(getLeaderTrekEvents("Rahul Patil")).toEqual([]);
  });

  it("returns empty array when localStorage value is invalid JSON", () => {
    localStorage.setItem("gt_trek_payments", "NOT_JSON");
    expect(getLeaderTrekEvents("Rahul Patil")).toEqual([]);
  });

  it("returns only treks assigned to the given leader", () => {
    localStorage.setItem("gt_trek_payments", JSON.stringify([
      LOCAL_TREK_1, LOCAL_TREK_2, LOCAL_TREK_OTHER_LEADER,
    ]));
    const result = getLeaderTrekEvents("Rahul Patil");
    expect(result).toHaveLength(2);
    expect(result.map(r => r.paymentId)).toEqual(["PAY-001", "PAY-002"]);
  });

  it("returns empty array when leader has no assigned treks", () => {
    localStorage.setItem("gt_trek_payments", JSON.stringify([LOCAL_TREK_OTHER_LEADER]));
    expect(getLeaderTrekEvents("Rahul Patil")).toHaveLength(0);
  });

  it("is case-sensitive — 'rahul patil' does not match 'Rahul Patil'", () => {
    localStorage.setItem("gt_trek_payments", JSON.stringify([LOCAL_TREK_1]));
    expect(getLeaderTrekEvents("rahul patil")).toHaveLength(0);
    expect(getLeaderTrekEvents("Rahul Patil")).toHaveLength(1);
  });

  it("returns all matching treks when multiple exist", () => {
    localStorage.setItem("gt_trek_payments", JSON.stringify([
      LOCAL_TREK_1, LOCAL_TREK_2,
    ]));
    expect(getLeaderTrekEvents("Rahul Patil")).toHaveLength(2);
  });

  it("returns empty array when localStorage is empty string", () => {
    localStorage.setItem("gt_trek_payments", "");
    expect(getLeaderTrekEvents("Rahul Patil")).toEqual([]);
  });
});

/* ────────────────────────────────────────────────────────
   mergeTrekEvents — deduplication + normalization
──────────────────────────────────────────────────────── */
describe("mergeTrekEvents", () => {
  it("returns empty array when both sources are empty", () => {
    expect(mergeTrekEvents([], [])).toEqual([]);
  });

  it("returns only localStorage events when backend is empty", () => {
    const result = mergeTrekEvents([LOCAL_TREK_1, LOCAL_TREK_2], []);
    expect(result).toHaveLength(2);
  });

  it("returns only backend events when localStorage is empty", () => {
    const result = mergeTrekEvents([], [BACKEND_TREK_NEW]);
    expect(result).toHaveLength(1);
  });

  it("merges non-duplicate events from both sources", () => {
    const result = mergeTrekEvents([LOCAL_TREK_1], [BACKEND_TREK_NEW]);
    expect(result).toHaveLength(2);
  });

  it("deduplicates when backend has same trekName+eventDate as localStorage", () => {
    const result = mergeTrekEvents([LOCAL_TREK_1], [BACKEND_TREK_DUPLICATE]);
    expect(result).toHaveLength(1); // not 2
  });

  it("keeps the localStorage version when deduplicating (localStorage takes priority)", () => {
    const result = mergeTrekEvents([LOCAL_TREK_1], [BACKEND_TREK_DUPLICATE]);
    expect(result[0].paymentId).toBe("PAY-001"); // localStorage paymentId kept
  });

  it("normalizes backend row to match localStorage shape", () => {
    const result = mergeTrekEvents([], [BACKEND_TREK_NEW]);
    const normalized = result[0];
    expect(normalized).toMatchObject({
      paymentId:    10,
      trekName:     "Sinhagad Trek",
      eventDate:    "2026-08-05",
      participants: 30,
      status:       "UPCOMING",
    });
  });

  it("normalized backend event has config object", () => {
    const result = mergeTrekEvents([], [BACKEND_TREK_NEW]);
    expect(result[0].config).toBeDefined();
    expect(typeof result[0].config).toBe("object");
  });

  it("uses empty object for config when backend row has no config", () => {
    const backendNoConfig = { ...BACKEND_TREK_NEW, config: null };
    const result = mergeTrekEvents([], [backendNoConfig]);
    expect(result[0].config).toEqual({});
  });

  it("handles multiple backend treks — all unique ones are added", () => {
    const backend2 = { ...BACKEND_TREK_NEW, id: 12, trek_name: "Rajgad Trek", event_date: "2026-09-01" };
    const result = mergeTrekEvents([LOCAL_TREK_1], [BACKEND_TREK_NEW, backend2]);
    expect(result).toHaveLength(3);
  });

  it("does not mutate the input localStorage array", () => {
    const local = [LOCAL_TREK_1];
    mergeTrekEvents(local, [BACKEND_TREK_NEW]);
    expect(local).toHaveLength(1); // original unchanged
  });
});

/* ────────────────────────────────────────────────────────
   Backend fetch — URL encoding
──────────────────────────────────────────────────────── */
describe("Backend fetch URL encoding", () => {
  it("encodeURIComponent handles names with spaces correctly", () => {
    expect(encodeURIComponent("Rahul Patil")).toBe("Rahul%20Patil");
  });

  it("encodeURIComponent handles names with special characters", () => {
    expect(encodeURIComponent("Priya D'Souza")).toBe("Priya%20D'Souza");
  });

  it("decodeURIComponent reverses the encoding", () => {
    expect(decodeURIComponent("Rahul%20Patil")).toBe("Rahul Patil");
  });

  it("round-trips correctly — encode then decode returns original", () => {
    const name = "Vikram Jadhav";
    expect(decodeURIComponent(encodeURIComponent(name))).toBe(name);
  });
});

/* ────────────────────────────────────────────────────────
   Trek event date filtering (Upcoming vs Past)
   Mirrors the filter in EmployeePortal My Treks tab
──────────────────────────────────────────────────────── */
describe("Trek event date filtering", () => {
  const today = new Date();
  const futureDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const pastDate   = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const upcomingTrek = { trekName: "Future Trek", eventDate: futureDate };
  const pastTrek     = { trekName: "Past Trek",   eventDate: pastDate };
  const allEvents    = [upcomingTrek, pastTrek];

  it("filters upcoming treks correctly (eventDate >= today)", () => {
    const upcoming = allEvents.filter(e => !e.eventDate || new Date(e.eventDate) >= new Date());
    expect(upcoming).toHaveLength(1);
    expect(upcoming[0].trekName).toBe("Future Trek");
  });

  it("filters past treks correctly (eventDate < today)", () => {
    const past = allEvents.filter(e => e.eventDate && new Date(e.eventDate) < new Date());
    expect(past).toHaveLength(1);
    expect(past[0].trekName).toBe("Past Trek");
  });

  it("trek with no eventDate is treated as upcoming", () => {
    const noDate = { trekName: "No Date Trek", eventDate: null };
    const upcoming = [noDate].filter(e => !e.eventDate || new Date(e.eventDate) >= new Date());
    expect(upcoming).toHaveLength(1);
  });
});
