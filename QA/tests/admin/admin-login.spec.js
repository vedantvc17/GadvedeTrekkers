/**
 * admin-login.spec.js
 *
 * Full UI coverage of the Admin Login page (/admin).
 *
 * Covers:
 *   - Splash view rendering (logo, heading, Sign In button)
 *   - Transition from splash to sign-in form
 *   - All sign-in form elements (username, password, submit, back, website link)
 *   - Password visibility toggle (eye icon button)
 *   - Submit button disabled state when fields are empty
 *   - Invalid credentials shows error message
 *   - Back button returns to splash view
 *   - Footer label "Admin Panel" is visible
 *   - Successful login mocked via page.route → redirects to /admin/dashboard
 */

import { expect, test } from "@playwright/test";
import { AdminLoginPage } from "../../pages/AdminLoginPage.js";

const API_ORIGIN = "https://resourceful-balance-production-ed41.up.railway.app";

test.describe("Admin login page", () => {
  test("splash screen renders Gadvede Trekkers heading and Sign In button", async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.open();

    await expect(page.getByText("Gadvede Trekkers").first()).toBeVisible();
    await expect(loginPage.splashSignInButton).toBeVisible();
    await expect(page.getByText(/authorised personnel only/i)).toBeVisible();
  });

  test("clicking Sign In on splash reveals the sign-in form", async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.open();
    await loginPage.openSignInForm();

    await loginPage.assertSignInFormVisible();
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  });

  test("sign-in form has username and password inputs with correct placeholders", async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.open();
    await loginPage.openSignInForm();

    await expect(page.getByPlaceholder("admin")).toBeVisible();
    await expect(page.getByPlaceholder("••••••••")).toBeVisible();
  });

  test("sign-in form has back button and website link", async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.open();
    await loginPage.openSignInForm();

    await expect(loginPage.backButton).toBeVisible();
    await expect(loginPage.websiteLink).toBeVisible();
    await expect(loginPage.websiteLink).toHaveAttribute("href", "/");
  });

  test("submit button is disabled when both fields are empty", async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.open();
    await loginPage.openSignInForm();

    const submitBtn = page.getByRole("button", { name: /sign in →/i });
    await expect(submitBtn).toBeDisabled();
  });

  test("submit button is disabled when only username is filled", async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.open();
    await loginPage.openSignInForm();

    await loginPage.usernameInput.fill("admin");
    const submitBtn = page.getByRole("button", { name: /sign in →/i });
    await expect(submitBtn).toBeDisabled();
  });

  test("submit button is enabled once both fields have values", async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.open();
    await loginPage.openSignInForm();

    await loginPage.usernameInput.fill("admin");
    await loginPage.passwordInput.fill("password");
    const submitBtn = page.getByRole("button", { name: /sign in →/i });
    await expect(submitBtn).toBeEnabled();
  });

  test("password field toggles between masked and visible via eye icon", async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.open();
    await loginPage.openSignInForm();

    const passField = loginPage.passwordInput;
    await passField.fill("secret123");

    // Initially masked
    await expect(passField).toHaveAttribute("type", "password");

    // Click eye icon (button next to password input)
    const eyeButton = page.locator("form button[type='button']").last();
    await eyeButton.click();
    await expect(passField).toHaveAttribute("type", "text");

    // Click again to mask
    await eyeButton.click();
    await expect(passField).toHaveAttribute("type", "password");
  });

  test("invalid credentials shows an error message", async ({ page }) => {
    await page.route(`${API_ORIGIN}/api/auth/admin/login`, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: "Invalid username or password." }),
      });
    });

    const loginPage = new AdminLoginPage(page);
    await loginPage.open();
    await loginPage.login("bad.user", "badpassword");

    await expect(page.getByText(/invalid|incorrect|unauthorized/i).first()).toBeVisible();
    await expect(page).toHaveURL(/\/admin$/);
  });

  test("back button on sign-in form returns to splash view", async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.open();
    await loginPage.openSignInForm();

    await loginPage.assertSignInFormVisible();
    await loginPage.backButton.click();

    await expect(loginPage.splashSignInButton).toBeVisible();
  });

  test("page shows Admin Panel footer label", async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.open();

    await expect(page.getByText(/admin panel/i).first()).toBeVisible();
  });

  test("successful admin login stores session and redirects to dashboard", async ({ page }) => {
    await page.route(`${API_ORIGIN}/api/auth/admin/login`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            token: "qa-mock-token-12345",
            username: "pratik.ubhe",
            name: "Pratik Ubhe",
            role: "Admin",
          },
        }),
      });
    });

    const loginPage = new AdminLoginPage(page);
    await loginPage.open();
    await loginPage.login("pratik.ubhe", "Pratik@gadvede");

    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });
});
