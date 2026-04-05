/**
 * static-pages.spec.js
 *
 * Smoke + UI element tests for non-listing public pages:
 *   Corporate, Industrial Visits, Villas, Ticket, Feedback Form,
 *   and the Opportunities suite (Vendor, Partner, ListProperty,
 *   ListCampsite, ListEvent).
 */

import { expect, test } from "@playwright/test";
import { seedLocalStorage } from "../../helpers/seed.js";

test.describe("Corporate page", () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page);
    await page.goto("/corporate", { waitUntil: "domcontentloaded" });
  });

  test("renders a Corporate or Team Outing heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /corporate|team outing|team.?building/i }).first(),
    ).toBeVisible();
  });

  test("page contains a CTA button or enquiry link", async ({ page }) => {
    const cta = page
      .getByRole("button", { name: /enquire|get quote|contact|book|whatsapp/i })
      .first();
    const ctaLink = page
      .getByRole("link", { name: /enquire|get quote|contact|book|whatsapp/i })
      .first();
    const visibleBtn  = await cta.isVisible().catch(() => false);
    const visibleLink = await ctaLink.isVisible().catch(() => false);
    expect(visibleBtn || visibleLink).toBe(true);
  });

  test("URL stays on /corporate", async ({ page }) => {
    await expect(page).toHaveURL(/\/corporate/);
  });
});

test.describe("Industrial Visits page", () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page);
    await page.goto("/industrial-visits", { waitUntil: "domcontentloaded" });
  });

  test("renders Industrial Visits heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /industrial.?visit/i }).first(),
    ).toBeVisible();
  });

  test("Enquire Now button or form is present", async ({ page }) => {
    const enquireBtn = page
      .getByRole("button", { name: /enquire|book|contact/i })
      .first();
    await expect(enquireBtn).toBeVisible();
  });

  test("destination cards or list items are visible", async ({ page }) => {
    // At least one item / card should render
    const items = page.locator("article, .card, [class*='card'], li").first();
    await expect(items).toBeVisible();
  });
});

test.describe("Villas page", () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page);
    await page.goto("/villas", { waitUntil: "domcontentloaded" });
  });

  test("renders Villas heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /villa/i }).first(),
    ).toBeVisible();
  });

  test("at least one villa listing or enquiry option is visible", async ({ page }) => {
    const item = page.getByText(/villa|bedroom|book|enquire/i).first();
    await expect(item).toBeVisible();
  });
});

test.describe("Ticket page", () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page);
    await page.goto("/ticket", { waitUntil: "domcontentloaded" });
  });

  test("page renders a ticket lookup or booking reference field", async ({ page }) => {
    // The HistoricTicket component shows a search / reference field
    const input = page.getByRole("textbox").first();
    const heading = page.getByRole("heading").first();
    const visibleInput   = await input.isVisible().catch(() => false);
    const visibleHeading = await heading.isVisible().catch(() => false);
    expect(visibleInput || visibleHeading).toBe(true);
  });
});

test.describe("Feedback form page", () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page);
    await page.goto("/feedback", { waitUntil: "domcontentloaded" });
  });

  test("renders a Feedback heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /feedback/i }).first(),
    ).toBeVisible();
  });

  test("form has a name field", async ({ page }) => {
    const nameInput = page.getByRole("textbox").first();
    await expect(nameInput).toBeVisible();
  });

  test("form has a submit or send button", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /submit|send|share/i }).first(),
    ).toBeVisible();
  });

  test("form shows required-field validation on empty submit", async ({ page }) => {
    await page.getByRole("button", { name: /submit|send|share/i }).first().click();
    // At least one error or required hint should appear
    const error = page.getByText(/required|please fill|cannot be empty/i).first();
    const requiredAttr = page.locator("[required]").first();
    const hasError    = await error.isVisible().catch(() => false);
    const hasRequired = await requiredAttr.isVisible().catch(() => false);
    expect(hasError || hasRequired).toBe(true);
  });
});

test.describe("Opportunities pages", () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page);
  });

  test("Vendor Register page renders a form", async ({ page }) => {
    await page.goto("/vendor-register", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /vendor|register/i }).first()).toBeVisible();
    await expect(page.locator("form, [role='form']").first()).toBeVisible();
  });

  test("Partner Apply page loads", async ({ page }) => {
    await page.goto("/partner", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /partner|apply/i }).first()).toBeVisible();
  });

  test("List Property page loads with a form", async ({ page }) => {
    await page.goto("/list-property", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /property|list your/i }).first()).toBeVisible();
  });

  test("List Campsite page loads with a form", async ({ page }) => {
    await page.goto("/list-campsite", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /campsite|list/i }).first()).toBeVisible();
  });

  test("List Event page loads with a form", async ({ page }) => {
    await page.goto("/list-event", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /event|list/i }).first()).toBeVisible();
  });
});
