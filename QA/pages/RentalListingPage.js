import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class RentalListingPage extends BasePage {
  constructor(page) {
    super(page);
    this.pageHeading = page.getByRole("heading", { name: /rental/i }).first();
  }

  async open() {
    await this.goto("/rentals");
  }

  async assertLoaded() {
    await expect(this.pageHeading).toBeVisible();
  }

  async openFirstDetails() {
    const link = this.page.getByRole("link", { name: /view details|explore|rent now|enquire/i }).first();
    await link.click();
  }

  async assertDetailsOpened() {
    await expect(this.page).toHaveURL(/\/rentals\//);
  }
}
