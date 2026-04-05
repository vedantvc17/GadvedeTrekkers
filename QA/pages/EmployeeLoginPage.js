import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class EmployeeLoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.splashSignInButton = page.getByRole("button", { name: /^sign in$/i });
    this.usernameInput = page.getByPlaceholder("e.g. rahul.patil");
    this.passwordInput = page.getByPlaceholder("••••••••");
    this.formSignInButton = page.locator("form").getByRole("button", {
      name: /sign in/i,
    });
  }

  async open() {
    await this.goto("/employee-login");
  }

  async openSignInForm() {
    if (await this.splashSignInButton.isVisible().catch(() => false)) {
      await this.splashSignInButton.click();
    }
  }

  async login(username, password) {
    await this.open();
    await this.openSignInForm();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.formSignInButton.click();
  }

  async assertInvalidCredentials() {
    await expect(
      this.page.getByText(/invalid username or password/i),
    ).toBeVisible();
  }

  async assertLandedOnDashboard() {
    await expect(this.page).toHaveURL(/\/employee\/dashboard$/);
  }

  async assertEnquiriesVisible() {
    await expect(
      this.page.getByRole("button", { name: /enquiries/i }),
    ).toHaveCount(1);
  }

  async assertEnquiriesHidden() {
    await expect(
      this.page.getByRole("button", { name: /enquiries/i }),
    ).toHaveCount(0);
  }
}
