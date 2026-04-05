import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class HeritageListingPage extends BasePage {
  constructor(page) {
    super(page);
    this.pageHeading = page.getByRole("heading", { name: /heritage/i }).first();
  }

  async open() {
    await this.goto("/heritage");
  }

  async assertLoaded() {
    await expect(this.pageHeading).toBeVisible();
  }

  async openFirstDetails() {
    const link = this.page.getByRole("link", { name: /view details|explore|know more/i }).first();
    await link.click();
  }

  async assertDetailsOpened() {
    await expect(this.page).toHaveURL(/\/heritage\//);
  }
}
