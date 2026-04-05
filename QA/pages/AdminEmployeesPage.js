import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class AdminEmployeesPage extends BasePage {
  constructor(page) {
    super(page);
    this.managementTab = page.getByRole("button", { name: /^🏅 management$/i });
    this.employeesTab = page.getByRole("button", { name: /^👥 employees$/i });
    this.searchInput = page.getByPlaceholder(/search name, email, id/i);
    this.addEmployeeButton = page.getByRole("button", { name: /\+ add employee/i });
  }

  async open() {
    await this.goto("/admin/employees");
  }

  async assertTabsVisible() {
    await expect(this.managementTab).toBeVisible();
    await expect(this.employeesTab).toBeVisible();
  }

  async openEmployeesTab() {
    await this.employeesTab.click();
  }

  async assertEmployeeListVisible() {
    await expect(this.searchInput).toBeVisible();
    await expect(this.addEmployeeButton).toBeVisible();
  }
}
