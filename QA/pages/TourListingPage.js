import { BasePage } from "./BasePage.js";

export class TourListingPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async open() {
    await this.goto("/tours");
  }

  getWhatsAppHrefForPackage(packageName) {
    const card = this.page.locator(".card", { hasText: packageName });
    return card.getByRole("link", { name: /^whatsapp$/i }).getAttribute("href");
  }
}
