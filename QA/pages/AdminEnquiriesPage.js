import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class AdminEnquiriesPage extends BasePage {
  constructor(page) {
    super(page);
    this.pipelineHeading = page.getByText(/enquiries pipeline/i);
    this.highIntentHeading = page.getByText("🔥 High Intent Leads");
    this.firstViewButton = page.getByRole("button", { name: /view/i }).first();
  }

  async open() {
    await this.goto("/admin/enquiries");
  }

  async assertLoaded() {
    await expect(this.pipelineHeading).toBeVisible();
    await expect(this.highIntentHeading).toBeVisible();
    await expect(this.page.getByText(/new lead/i).first()).toBeVisible();
    await expect(this.page.getByText(/contacted/i).first()).toBeVisible();
    await expect(this.firstViewButton).toBeVisible();
  }
}
