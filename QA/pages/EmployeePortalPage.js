import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class EmployeePortalPage extends BasePage {
  constructor(page) {
    super(page);
    this.dashboardHeading = page.getByText(/dashboard|my portal/i).first();
    this.logoutButton     = page.getByRole("button", { name: /log.?out|sign.?out/i });
    this.enquiriesTab     = page.getByRole("button", { name: /enquiries/i });
    this.bookingsTab      = page.getByRole("button", { name: /bookings/i });
    this.profileTab       = page.getByRole("button", { name: /profile/i });
    this.trainingTab      = page.getByRole("button", { name: /training/i });
    this.directBookingLink = page.getByRole("link", { name: /direct.?booking/i });
  }

  async openDashboard() {
    await this.goto("/employee/dashboard");
  }

  async assertDashboardLoaded() {
    await expect(this.page).toHaveURL(/\/employee\//);
  }

  async logout() {
    await this.logoutButton.click();
  }

  async assertRedirectedToLogin() {
    await expect(this.page).toHaveURL(/\/employee-login/);
  }
}
