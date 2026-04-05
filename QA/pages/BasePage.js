export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(path, options = {}) {
    await this.page.goto(path, { waitUntil: "domcontentloaded", ...options });
  }
}
