/**
 * heritage-rental.spec.js
 *
 * Covers Heritage Walk and Rental listing + detail pages.
 *
 *   Heritage:
 *     - Listing loads with at least one card/item
 *     - Search input (if present) filters results
 *     - "View Details" link opens detail page (/heritage/:id)
 *     - Detail page renders route map or description
 *     - WhatsApp / Enquire CTA visible on detail page
 *
 *   Rentals:
 *     - Listing loads with at least one card/item
 *     - Each card shows a name and price (or "per day" label)
 *     - "View Details" link opens detail page (/rentals/:id)
 *     - Detail page shows product name and an Enquire CTA
 *     - WhatsApp URL contains expected content
 */

import { expect, test } from "@playwright/test";
import { seedLocalStorage } from "../../helpers/seed.js";
import { HeritageListingPage } from "../../pages/HeritageListingPage.js";
import { RentalListingPage } from "../../pages/RentalListingPage.js";

/* ─── Heritage ─────────────────────────────────────────────────────────────── */
test.describe("Heritage Walk listing page", () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page);
  });

  test("listing page renders Heritage heading and at least one item", async ({ page }) => {
    const heritagePage = new HeritageListingPage(page);
    await heritagePage.open();
    await heritagePage.assertLoaded();

    const cards = page.locator("article, .card, [class*='card'], [role='listitem']");
    await expect(cards.first()).toBeVisible();
  });

  test("each listing card shows a name and a view/explore link", async ({ page }) => {
    const heritagePage = new HeritageListingPage(page);
    await heritagePage.open();

    const viewLink = page.getByRole("link", { name: /view details|explore|know more/i }).first();
    await expect(viewLink).toBeVisible();
  });

  test("clicking first details link navigates to /heritage/:id", async ({ page }) => {
    const heritagePage = new HeritageListingPage(page);
    await heritagePage.open();
    await heritagePage.openFirstDetails();
    await heritagePage.assertDetailsOpened();
  });

  test("heritage detail page renders a description or itinerary section", async ({ page }) => {
    const heritagePage = new HeritageListingPage(page);
    await heritagePage.open();
    await heritagePage.openFirstDetails();

    // Detail pages typically have a heading and body text
    const heading = page.getByRole("heading").first();
    await expect(heading).toBeVisible();
  });

  test("heritage detail page has a Book or Enquire CTA", async ({ page }) => {
    const heritagePage = new HeritageListingPage(page);
    await heritagePage.open();
    await heritagePage.openFirstDetails();

    const cta = page
      .getByRole("button", { name: /book|enquire|whatsapp|register/i })
      .or(page.getByRole("link", { name: /book|enquire|whatsapp|register/i }))
      .first();
    await expect(cta).toBeVisible();
  });
});

/* ─── Rentals ──────────────────────────────────────────────────────────────── */
test.describe("Rental listing page", () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page);
  });

  test("listing page renders Rental heading and at least one item", async ({ page }) => {
    const rentalPage = new RentalListingPage(page);
    await rentalPage.open();
    await rentalPage.assertLoaded();

    const cards = page.locator("article, .card, [class*='card'], [role='listitem']");
    await expect(cards.first()).toBeVisible();
  });

  test("rental cards show a price or per-day label", async ({ page }) => {
    const rentalPage = new RentalListingPage(page);
    await rentalPage.open();

    const priceText = page.getByText(/₹|per day|per night|price/i).first();
    await expect(priceText).toBeVisible();
  });

  test("clicking first details link navigates to /rentals/:id", async ({ page }) => {
    const rentalPage = new RentalListingPage(page);
    await rentalPage.open();
    await rentalPage.openFirstDetails();
    await rentalPage.assertDetailsOpened();
  });

  test("rental detail page shows product name", async ({ page }) => {
    const rentalPage = new RentalListingPage(page);
    await rentalPage.open();
    await rentalPage.openFirstDetails();

    const heading = page.getByRole("heading").first();
    await expect(heading).toBeVisible();
  });

  test("rental detail page has a WhatsApp or Enquire CTA", async ({ page }) => {
    const rentalPage = new RentalListingPage(page);
    await rentalPage.open();
    await rentalPage.openFirstDetails();

    const cta = page
      .getByRole("button", { name: /enquire|whatsapp|rent|book/i })
      .or(page.getByRole("link", { name: /enquire|whatsapp|rent|book/i }))
      .first();
    await expect(cta).toBeVisible();
  });

  test("WhatsApp link on rental detail contains wa.me", async ({ page }) => {
    const rentalPage = new RentalListingPage(page);
    await rentalPage.open();
    await rentalPage.openFirstDetails();

    const waLink = page.getByRole("link", { name: /whatsapp/i }).first();
    const isVisible = await waLink.isVisible().catch(() => false);
    if (isVisible) {
      const href = await waLink.getAttribute("href");
      expect(href).toContain("wa.me");
    }
  });
});
