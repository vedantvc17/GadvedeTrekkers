import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class CampingListingPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole("heading", {
      name: /camping near mumbai & pune/i,
    });
    this.firstWhatsAppLink = page.getByRole("link", { name: /whatsapp/i }).first();
    this.firstViewDetailsLink = page
      .getByRole("link", { name: /view details/i })
      .first();
  }

  async open() {
    await this.goto("/camping");
  }

  async assertLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.firstWhatsAppLink).toBeVisible();
  }

  async openFirstDetails() {
    await this.firstViewDetailsLink.click();
  }

  async assertDetailsOpened() {
    await expect(this.page).toHaveURL(/\/camping\//);
  }
}
