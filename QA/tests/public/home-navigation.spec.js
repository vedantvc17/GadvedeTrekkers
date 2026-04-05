/**
 * home-navigation.spec.js
 *
 * Covers the Home page, global Header/Footer, About, Contact,
 * and Cancellation Policy pages — verifying all key UI elements
 * render correctly and nav links point to the right routes.
 */

import { expect, test } from "@playwright/test";
import { seedLocalStorage } from "../../helpers/seed.js";

test.describe("Home page", () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("renders hero / carousel section", async ({ page }) => {
    // Hero should contain the brand or a primary heading
    const hero = page.locator("section, .hero, [class*='hero'], [class*='carousel']").first();
    await expect(hero).toBeVisible();
  });

  test("page title contains Gadvede", async ({ page }) => {
    await expect(page).toHaveTitle(/gadvede/i);
  });

  test("Header is visible with Gadvede Trekkers brand", async ({ page }) => {
    const header = page.locator("header, nav").first();
    await expect(header).toBeVisible();
    await expect(page.getByText(/gadvede/i).first()).toBeVisible();
  });

  test("header navigation contains Treks, Tours, Camping links", async ({ page }) => {
    await expect(page.getByRole("link", { name: /^treks$/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /^tours$/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /^camping$/i }).first()).toBeVisible();
  });

  test("header Treks link navigates to /treks", async ({ page }) => {
    const trekLink = page.getByRole("link", { name: /^treks$/i }).first();
    await expect(trekLink).toHaveAttribute("href", /\/treks/);
  });

  test("header Tours link navigates to /tours", async ({ page }) => {
    const tourLink = page.getByRole("link", { name: /^tours$/i }).first();
    await expect(tourLink).toHaveAttribute("href", /\/tours/);
  });

  test("footer is visible on home page", async ({ page }) => {
    const footer = page.locator("footer").first();
    await expect(footer).toBeVisible();
  });

  test("footer contains Gadvede Trekkers branding", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer.getByText(/gadvede/i).first()).toBeVisible();
  });

  test("footer contains quick-links / nav links", async ({ page }) => {
    const footer = page.locator("footer");
    // At least one anchor in the footer
    const footerLinks = footer.getByRole("link");
    await expect(footerLinks.first()).toBeVisible();
  });

  test("Home page contains Weekend Trips or Upcoming section", async ({ page }) => {
    // Verify a section heading exists — could be "WEEKEND TRIPS" or "Upcoming Treks"
    const section = page.getByText(/weekend trips|upcoming treks|upcoming events/i).first();
    await expect(section).toBeVisible();
  });
});

test.describe("About page", () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page);
    await page.goto("/about", { waitUntil: "domcontentloaded" });
  });

  test("renders About heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /about/i }).first()).toBeVisible();
  });

  test("URL is /about", async ({ page }) => {
    await expect(page).toHaveURL(/\/about$/);
  });

  test("contains descriptive text about Gadvede Trekkers", async ({ page }) => {
    await expect(page.getByText(/gadvede/i).first()).toBeVisible();
  });
});

test.describe("Contact page", () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page);
    await page.goto("/contact", { waitUntil: "domcontentloaded" });
  });

  test("renders a Contact heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /contact/i }).first()).toBeVisible();
  });

  test("page shows a phone number or email address", async ({ page }) => {
    const contact = page.getByText(/9\d{9}|@gadvede\.com|@gmail\.com/i).first();
    await expect(contact).toBeVisible();
  });

  test("Contact form or WhatsApp CTA is present", async ({ page }) => {
    // Either a form or a WhatsApp / call button
    const cta = page.getByRole("button", { name: /whatsapp|call|message|send|submit/i }).first();
    const form = page.locator("form").first();
    const hasForm = await form.isVisible().catch(() => false);
    const hasCta  = await cta.isVisible().catch(() => false);
    expect(hasForm || hasCta).toBe(true);
  });
});

test.describe("Cancellation policy page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cancellation-policy", { waitUntil: "domcontentloaded" });
  });

  test("renders the cancellation policy content", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /cancellation/i }).first(),
    ).toBeVisible();
  });

  test("policy mentions refund or cancellation terms", async ({ page }) => {
    await expect(
      page.getByText(/refund|cancellation|policy/i).first(),
    ).toBeVisible();
  });
});
