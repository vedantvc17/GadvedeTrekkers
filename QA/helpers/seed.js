import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testDataDir = path.resolve(__dirname, "../test-data");

function readJson(relativePath) {
  const absolutePath = path.join(testDataDir, relativePath);
  return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
}

export function getLocalStorageSeed() {
  return readJson("local-storage-seed.json");
}

export function getEmployeeUsers() {
  return readJson("employee-users.json");
}

export async function seedLocalStorage(page, seed = getLocalStorageSeed()) {
  await page.addInitScript((storageSeed) => {
    Object.entries(storageSeed).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }, seed);
}

export async function seedAdminSession(page, overrides = {}) {
  const sessionUser = {
    name: "Pratik Ubhe",
    role: "Admin",
    username: "pratik.ubhe",
    ...overrides,
  };

  await page.addInitScript((user) => {
    sessionStorage.setItem("gt_admin", "true");
    sessionStorage.setItem("gt_user", JSON.stringify(user));
    sessionStorage.setItem("gt_admin_token", "qa-seeded-admin-token");
  }, sessionUser);
}

export function buildExpectedWhatsAppMessage({
  location,
  packageName,
  category,
}) {
  return `Hi 👋\n\nI’m interested in:\n\n📍 Location: ${location}\n📦 Package: ${packageName}\n👥 Type: ${category}\n\nPlease share price and details.`;
}
