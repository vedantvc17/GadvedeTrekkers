import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class AdminLoginPage extends BasePage {
  constructor(page) {
    super(page);
    // Splash view
    this.splashSignInButton = page.getByRole("button", { name: /^sign in$/i });
    this.splashHeading      = page.getByText("Gadvede Trekkers").first();

    // Sign-in form
    this.usernameInput  = page.getByPlaceholder("admin");
    this.passwordInput  = page.getByPlaceholder("••••••••");
    this.submitButton   = page.getByRole("button", { name: /sign in →|signing in/i });
    this.backButton     = page.getByRole("button", { name: /← back/i });
    this.websiteLink    = page.getByRole("link", { name: /← website/i });
    this.errorMessage   = page.locator("div").filter({ hasText: /invalid|incorrect|unauthorized/i }).first();
    this.passwordToggle = page.getByRole("button", { name: "" }).filter({ has: page.locator("svg") }).first();
  }

  async open() {
    await this.goto("/admin");
  }

  async openSignInForm() {
    await this.splashSignInButton.click();
  }

  async login(username, password) {
    await this.openSignInForm();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async assertSplashVisible() {
    await expect(this.splashSignInButton).toBeVisible();
    await expect(this.splashHeading).toBeVisible();
  }

  async assertSignInFormVisible() {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  async assertError() {
    await expect(this.page.getByText(/invalid|incorrect|unauthorized/i).first()).toBeVisible();
  }
}
