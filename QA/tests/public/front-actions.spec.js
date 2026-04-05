import { expect, test } from "@playwright/test";
import { seedLocalStorage } from "../../helpers/seed.js";
import { TrekListingPage } from "../../pages/TrekListingPage.js";
import { TourListingPage } from "../../pages/TourListingPage.js";
import { CampingListingPage } from "../../pages/CampingListingPage.js";

test.describe("Public frontend actions", () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page);
  });

  test("trek search filters results and clears correctly", async ({ page }) => {
    const trekPage = new TrekListingPage(page);
    await trekPage.open();
    await trekPage.search("Harihar");

    await expect(trekPage.trekTitle("Harihar Trek")).toBeVisible();
    await expect(page.getByText(/no treks found/i)).toHaveCount(0);

    await trekPage.clearSearch();
    await expect(trekPage.searchInput).toHaveValue("");
  });

  test("trek details page opens from listing", async ({ page }) => {
    const trekPage = new TrekListingPage(page);
    await trekPage.open();
    await trekPage.search("Harihar");
    await trekPage.openDetailsFor("Harihar Trek");
    await trekPage.assertDetailsOpened();
  });

  test("tour whatsapp CTA contains the expected prefilled package message", async ({
    page,
  }) => {
    const toursPage = new TourListingPage(page);
    await toursPage.open();

    const href = await toursPage.getWhatsAppHrefForPackage(
      "Malvan Tarkarli with Scuba Diving and Watersports",
    );
    expect(href).toContain("wa.me");
    const decodedHref = decodeURIComponent(href);
    expect(decodedHref).toContain("Hi 👋");
    expect(decodedHref).toContain("I’m interested in:");
    expect(decodedHref).toContain("📍 Location: Maharashtra");
    expect(decodedHref).toContain(
      "📦 Package: Malvan Tarkarli with Scuba Diving and Watersports",
    );
    expect(decodedHref).toContain("👥 Type: Tour");
    expect(decodedHref).toContain("Please share price and details.");
  });

  test("camping listing supports detail redirection and whatsapp action", async ({
    page,
  }) => {
    const campingPage = new CampingListingPage(page);
    await campingPage.open();
    await campingPage.assertLoaded();
    await campingPage.openFirstDetails();
    await campingPage.assertDetailsOpened();
  });
});
