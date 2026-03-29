import { test, expect } from "@playwright/test";

test.describe("WeekendTrips component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/qa/weekend-trips", { waitUntil: "domcontentloaded" });
  });

  test("renders the weekend trips section with both cards", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "WEEKEND TRIPS" })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Upcoming Treks in Mumbai" })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Weekend Trip Mumbai & Pune" })
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: "View Tours" }).first()
    ).toBeVisible();

    await expect(page.locator(".card-img")).toHaveCount(2);
  });

  test("links point to the correct routes from both cards", async ({ page }) => {
    const links = page.getByRole("link", { name: "View Tours" });

    await expect(links).toHaveCount(2);
    await expect(links.first()).toHaveAttribute("href", "/treks");
    await expect(links.nth(1)).toHaveAttribute("href", "/tours");
  });

  test("shows cards side by side on desktop", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "Desktop layout is validated in the desktop browser project only."
    );

    const cards = page.locator(".card.text-white");
    await expect(cards).toHaveCount(2);

    const firstCard = cards.first();
    const secondCard = cards.nth(1);

    await expect(firstCard).toBeVisible();
    await expect(secondCard).toBeVisible();
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();

    expect(firstBox).not.toBeNull();
    expect(secondBox).not.toBeNull();
    expect(Math.abs(firstBox.y - secondBox.y)).toBeLessThan(10);
    expect(secondBox.x).toBeGreaterThan(firstBox.x);
  });

  test("stacks cards vertically on mobile", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "mobile-chrome",
      "Mobile stacking is validated in the mobile browser project only."
    );

    const cards = page.locator(".card.text-white");
    await expect(cards).toHaveCount(2);

    const firstCard = cards.first();
    const secondCard = cards.nth(1);

    await expect(firstCard).toBeVisible();
    await expect(secondCard).toBeVisible();
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();

    expect(firstBox).not.toBeNull();
    expect(secondBox).not.toBeNull();
    expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height - 5);
  });
});
