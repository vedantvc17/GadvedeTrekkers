import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class TrekListingPage extends BasePage {
  constructor(page) {
    super(page);
    this.searchInput = page.getByPlaceholder(/search treks/i);
    this.clearSearchButton = page.getByLabel(/clear search/i);
  }

  async open() {
    await this.goto("/treks");
  }

  async search(term) {
    await this.searchInput.fill(term);
  }

  trekTitle(name) {
    return this.page.getByText(new RegExp(name, "i")).first();
  }

  async clearSearch() {
    await this.clearSearchButton.click();
  }

  async openDetailsFor(name) {
    const card = this.page.locator('[role="listitem"]', { hasText: name }).first();
    await card.getByRole("link", { name: /view details|details/i }).first().click();
  }

  async assertDetailsOpened() {
    await expect(this.page).toHaveURL(/\/treks\//);
    await expect(
      this.page.getByText(/download itinerary|download pdf/i).first(),
    ).toBeVisible();
  }
}
