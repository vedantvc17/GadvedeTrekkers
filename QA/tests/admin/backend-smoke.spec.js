import { expect, test } from "@playwright/test";
import { seedAdminSession, seedLocalStorage } from "../../helpers/seed.js";
import { AdminBookingsPage } from "../../pages/AdminBookingsPage.js";
import { AdminEnquiriesPage } from "../../pages/AdminEnquiriesPage.js";
import { AdminEmployeesPage } from "../../pages/AdminEmployeesPage.js";

test.describe("Admin backend smoke coverage", () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page);
    await seedAdminSession(page);
  });

  test("bookings page loads and supports search plus view actions", async ({
    page,
  }) => {
    const bookingsPage = new AdminBookingsPage(page);
    await bookingsPage.open();
    await bookingsPage.assertLoaded();
    await bookingsPage.search("GT");
    await bookingsPage.openFirstBooking();
    await bookingsPage.assertDetailsVisible();
  });

  test("enquiries pipeline renders non-empty stage columns with high intent section", async ({
    page,
  }) => {
    const enquiriesPage = new AdminEnquiriesPage(page);
    await enquiriesPage.open();
    await enquiriesPage.assertLoaded();
  });

  test("employees module renders tabs and employee listing", async ({ page }) => {
    const employeesPage = new AdminEmployeesPage(page);
    await employeesPage.open();
    await employeesPage.assertTabsVisible();
    await employeesPage.openEmployeesTab();
    await employeesPage.assertEmployeeListVisible();
  });
});
