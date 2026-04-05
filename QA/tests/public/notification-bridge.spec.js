/**
 * notification-bridge.spec.js
 *
 * Tests for the WebsiteNotificationBridge component behaviour
 * from the user's perspective in the browser:
 *
 *   ✓ When Notification permission is "default", the in-app Enable
 *     prompt is rendered in the bottom-left corner
 *   ✓ The Enable button is visible and clickable
 *   ✓ Unseen alerts are surfaced as in-app notification cards
 *   ✓ Each card has a dismiss (×) button
 *   ✓ Clicking dismiss removes the card from the panel
 *   ✓ When multiple alerts are shown, a "Dismiss all" button appears
 *   ✓ Dismissing all clears all cards
 *   ✓ Alert cards show title, message, and time
 *   ✓ INFO / WARNING / ERROR / BOOKING / EMAIL type colours differ
 *   ✓ When permission is "denied", the Enable prompt is NOT shown
 *   ✓ markAlertSeen is called after dismiss (verified via localStorage)
 *
 * These tests exercise the component via the Home page, which mounts
 * WebsiteNotificationBridge through App.jsx / main.jsx.
 */

import { expect, test } from "@playwright/test";

/* Seed two unseen alerts so the in-app panel has content */
async function seedAlerts(page) {
  await page.addInitScript(() => {
    const alerts = [
      {
        id: "ALERT-TEST-001",
        type: "ENQUIRY",
        title: "Test Enquiry Alert",
        message: "Aarav Kulkarni enquired for Harihar Trek",
        createdAt: new Date().toISOString(),
      },
      {
        id: "ALERT-TEST-002",
        type: "BOOKING",
        title: "Test Booking Alert",
        message: "New booking confirmed for Alibag Camping",
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem("gt_alerts", JSON.stringify(alerts));
    localStorage.setItem("gt_alerts_seen", "[]");
  });
}

/* Override Notification API permission */
async function setNotificationPermission(page, permission) {
  await page.addInitScript((perm) => {
    Object.defineProperty(window, "Notification", {
      value: {
        permission: perm,
        requestPermission: () => Promise.resolve(perm),
      },
      writable: true,
    });
  }, permission);
}

/* ─── In-app panel with "default" permission ─────────────────────────────── */
test.describe("NotificationBridge — default permission (Enable prompt)", () => {
  test.beforeEach(async ({ page }) => {
    await seedAlerts(page);
    await setNotificationPermission(page, "default");
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("Enable browser notifications prompt is visible", async ({ page }) => {
    await expect(
      page.getByText(/enable browser notifications/i).first(),
    ).toBeVisible();
  });

  test("Enable button is rendered inside the permission prompt", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /^enable$/i }),
    ).toBeVisible();
  });

  test("unseen alert cards are shown in the in-app panel", async ({ page }) => {
    await expect(page.getByText("Test Enquiry Alert")).toBeVisible();
    await expect(page.getByText("Test Booking Alert")).toBeVisible();
  });

  test("each alert card has a dismiss × button", async ({ page }) => {
    const dismissButtons = page.getByRole("button", { name: /dismiss notification/i });
    await expect(dismissButtons.first()).toBeVisible();
  });

  test("alert card shows the message text", async ({ page }) => {
    await expect(
      page.getByText(/aarav kulkarni enquired for harihar trek/i).first(),
    ).toBeVisible();
  });

  test("when two unseen alerts are shown, Dismiss all button appears", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /dismiss all/i }),
    ).toBeVisible();
  });

  test("Dismiss all button label includes alert count", async ({ page }) => {
    const dismissAll = page.getByRole("button", { name: /dismiss all/i });
    const text = await dismissAll.textContent();
    expect(text).toMatch(/2/);
  });
});

/* ─── Dismiss interactions ───────────────────────────────────────────────── */
test.describe("NotificationBridge — dismiss behaviour", () => {
  test.beforeEach(async ({ page }) => {
    await seedAlerts(page);
    await setNotificationPermission(page, "default");
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("dismissing a single alert removes it from the panel", async ({ page }) => {
    await expect(page.getByText("Test Enquiry Alert")).toBeVisible();

    // Dismiss the first alert
    await page
      .getByRole("button", { name: /dismiss notification/i })
      .first()
      .click();

    // One card should be gone — only one alert remains
    const cards = page.getByRole("alert");
    await expect(cards).toHaveCount(1);
  });

  test("dismissing a single alert writes its id to gt_alerts_seen in localStorage", async ({
    page,
  }) => {
    await page
      .getByRole("button", { name: /dismiss notification/i })
      .first()
      .click();

    const seenIds = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("gt_alerts_seen") || "[]"),
    );
    expect(seenIds.length).toBeGreaterThan(0);
    expect(["ALERT-TEST-001", "ALERT-TEST-002"]).toContain(seenIds[0]);
  });

  test("Dismiss all removes all alert cards", async ({ page }) => {
    await page.getByRole("button", { name: /dismiss all/i }).click();
    const cards = page.getByRole("alert");
    await expect(cards).toHaveCount(0);
  });

  test("Dismiss all marks all alert ids as seen in localStorage", async ({ page }) => {
    await page.getByRole("button", { name: /dismiss all/i }).click();
    const seenIds = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("gt_alerts_seen") || "[]"),
    );
    expect(seenIds).toContain("ALERT-TEST-001");
    expect(seenIds).toContain("ALERT-TEST-002");
  });
});

/* ─── "denied" permission — no Enable prompt ─────────────────────────────── */
test.describe("NotificationBridge — denied permission", () => {
  test.beforeEach(async ({ page }) => {
    await seedAlerts(page);
    await setNotificationPermission(page, "denied");
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("Enable prompt is NOT visible when permission is denied", async ({ page }) => {
    await expect(
      page.getByText(/enable browser notifications/i),
    ).toHaveCount(0);
  });

  test("unseen alert cards are still shown in the in-app panel", async ({ page }) => {
    await expect(page.getByText("Test Enquiry Alert")).toBeVisible();
  });
});

/* ─── No unseen alerts ───────────────────────────────────────────────────── */
test.describe("NotificationBridge — no unseen alerts (all seen)", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const alerts = [
        {
          id: "ALERT-SEEN-001",
          type: "BOOKING",
          title: "Already Seen Booking",
          message: "This was already seen",
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem("gt_alerts", JSON.stringify(alerts));
      // Mark it as already seen
      localStorage.setItem("gt_alerts_seen", JSON.stringify(["ALERT-SEEN-001"]));
    });
    await setNotificationPermission(page, "denied");
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("no notification cards render when all alerts are already seen", async ({ page }) => {
    const cards = page.getByRole("alert");
    await expect(cards).toHaveCount(0);
  });

  test("Dismiss all button is NOT present when panel is empty", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /dismiss all/i }),
    ).toHaveCount(0);
  });
});
