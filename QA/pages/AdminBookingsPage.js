import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class AdminBookingsPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole("heading", { name: /bookings/i });
    this.searchInput = page.getByPlaceholder(/search by name, booking id, phone/i);
    this.firstViewButton = page.getByRole("button", { name: /view/i }).first();
  }

  async open() {
    await this.goto("/admin/bookings");
  }

  async assertLoaded() {
    await expect(this.heading).toBeVisible();
  }

  async search(term) {
    await this.searchInput.fill(term);
  }

  async openFirstBooking() {
    await this.firstViewButton.click();
  }

  async assertDetailsVisible() {
    await expect(
      this.page.getByText(/payment|status|booking id/i).first(),
    ).toBeVisible();
  }
}
