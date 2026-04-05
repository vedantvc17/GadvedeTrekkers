import { expect, test } from "@playwright/test";
import { getEmployeeUsers, seedLocalStorage } from "../../helpers/seed.js";
import { EmployeeLoginPage } from "../../pages/EmployeeLoginPage.js";

const employeeUsers = getEmployeeUsers();
const managementUser = employeeUsers.management[0];
const operationsUser = employeeUsers.operations[0];

test.describe("Employee login module", () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page);
  });

  test("shows validation error for invalid credentials", async ({ page }) => {
    const loginPage = new EmployeeLoginPage(page);
    await loginPage.open();
    await loginPage.openSignInForm();
    await loginPage.usernameInput.fill("wrong.user");
    await loginPage.passwordInput.fill("wrong-password");
    await loginPage.formSignInButton.click();

    await loginPage.assertInvalidCredentials();
    await expect(page).toHaveURL(/\/employee-login$/);
  });

  test("logs in management user and shows enquiries module", async ({ page }) => {
    const loginPage = new EmployeeLoginPage(page);
    await loginPage.login(managementUser.username, managementUser.password);
    await loginPage.assertLandedOnDashboard();
    await loginPage.assertEnquiriesVisible();
  });

  test("logs in operations user without enquiry access", async ({ page }) => {
    const loginPage = new EmployeeLoginPage(page);
    await loginPage.login(operationsUser.username, operationsUser.password);
    await loginPage.assertLandedOnDashboard();
    await loginPage.assertEnquiriesHidden();
  });

  test("protects direct booking route and redirects unauthenticated users to login", async ({
    page,
  }) => {
    await page.goto("/employee/direct-booking");

    await expect(page).toHaveURL(/\/employee-login\?next=/);
    await expect(new EmployeeLoginPage(page).splashSignInButton).toBeVisible();
  });
});
