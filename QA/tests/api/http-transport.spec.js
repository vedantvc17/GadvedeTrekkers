import { expect, test } from "@playwright/test";
import {
  evaluateModule,
  importModule,
  resetBrowserStorage,
} from "../../helpers/browserApi.js";

const API_ORIGIN = "https://resourceful-balance-production-ed41.up.railway.app";

test.describe("HTTP API transport layer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await resetBrowserStorage(page);
  });

  test("apiRequest attaches auth header, serializes JSON body, and unwraps data", async ({
    page,
  }) => {
    let capturedRequest = null;
    await page.route(`${API_ORIGIN}/api/test-auth`, async (route) => {
      capturedRequest = {
        method: route.request().method(),
        headers: route.request().headers(),
        body: route.request().postDataJSON(),
      };
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: { ok: true, source: "mock" } }),
      });
    });

    await page.evaluate(() => {
      sessionStorage.setItem("gt_admin_token", "qa-admin-token");
    });

    const result = await importModule(
      page,
      "/src/api/backendClient.js",
      "apiRequest",
      ["/api/test-auth", { method: "POST", body: { name: "QA" }, admin: true }],
    );

    expect(result).toEqual({ ok: true, source: "mock" });
    expect(capturedRequest.method).toBe("POST");
    expect(capturedRequest.headers.authorization).toBe("Bearer qa-admin-token");
    expect(capturedRequest.headers["content-type"]).toContain("application/json");
    expect(capturedRequest.body).toEqual({ name: "QA" });
  });

  test("apiRequest returns null on 204 and throws backend error messages", async ({
    page,
  }) => {
    await page.route(`${API_ORIGIN}/api/no-content`, async (route) => {
      await route.fulfill({ status: 204, body: "" });
    });
    await page.route(`${API_ORIGIN}/api/error-case`, async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "Bad QA Request" }),
      });
    });

    const emptyResult = await importModule(
      page,
      "/src/api/backendClient.js",
      "apiRequest",
      ["/api/no-content"],
    );
    expect(emptyResult).toBeNull();

    const errorMessage = await page.evaluate(async () => {
      const { apiRequest } = await import("/src/api/backendClient.js");
      try {
        await apiRequest("/api/error-case");
        return "no-error";
      } catch (error) {
        return error.message;
      }
    });

    expect(errorMessage).toBe("Bad QA Request");
  });

  test("productsApi hits all product endpoints with the right paths", async ({
    page,
  }) => {
    const requests = [];
    await page.route(`${API_ORIGIN}/api/products**`, async (route) => {
      requests.push({
        url: route.request().url(),
        method: route.request().method(),
        headers: route.request().headers(),
        body: route.request().postData(),
      });
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: [{ id: "prod-1", name: "QA Product" }] }),
      });
    });

    await page.evaluate(() => {
      sessionStorage.setItem("gt_admin_token", "qa-admin-token");
    });

    await page.evaluate(async () => {
      const { productsApi } = await import("/src/api/products.api.js");
      await productsApi.getAll("trek");
      await productsApi.getBySlug("harihar-trek");
      await productsApi.adminList("gt_treks");
      await productsApi.upsert("gt_treks", { name: "QA Trek" });
      await productsApi.remove("gt_treks", "seed_1");
    });

    expect(requests).toHaveLength(5);
    expect(requests[0].url).toContain("/api/products?type=trek");
    expect(requests[1].url).toContain("/api/products/harihar-trek");
    expect(requests[2].url).toContain("/api/products/admin/list?storageKey=gt_treks");
    expect(requests[2].headers.authorization).toBe("Bearer qa-admin-token");
    expect(requests[3].method).toBe("POST");
    expect(JSON.parse(requests[3].body)).toEqual({
      storageKey: "gt_treks",
      item: { name: "QA Trek" },
    });
    expect(requests[4].method).toBe("DELETE");
    expect(requests[4].url).toContain("/api/products/admin/gt_treks/seed_1");
  });

  test("bookingsApi and enquiriesApi map correctly to backend namespaces", async ({
    page,
  }) => {
    const bookingRequests = [];
    const enquiryRequests = [];

    await page.route(`${API_ORIGIN}/api/bookings**`, async (route) => {
      bookingRequests.push({
        url: route.request().url(),
        method: route.request().method(),
        headers: route.request().headers(),
        body: route.request().postData(),
      });
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: { ok: true } }),
      });
    });

    await page.route(`${API_ORIGIN}/api/enquiries**`, async (route) => {
      enquiryRequests.push({
        url: route.request().url(),
        method: route.request().method(),
        headers: route.request().headers(),
        body: route.request().postData(),
      });
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: { ok: true } }),
      });
    });

    await page.evaluate(() => {
      sessionStorage.setItem("gt_admin_token", "qa-admin-token");
    });

    await page.evaluate(async () => {
      const { bookingsApi } = await import("/src/api/bookings.api.js");
      const { enquiriesApi } = await import("/src/api/enquiries.api.js");

      await bookingsApi.list({ status: "CONFIRMED" });
      await bookingsApi.getByCode("GT-2026-000001");
      await bookingsApi.create({ bookingId: "GT-2026-000101" });
      await bookingsApi.updateStatus("GT-2026-000101", "CANCELLED");

      await enquiriesApi.list({ stage: "NEW_LEAD" });
      await enquiriesApi.upsert({ id: "ENQ-QA-1", name: "Lead QA" });
      await enquiriesApi.update("ENQ-QA-1", { status: "CONTACTED" });
    });

    expect(bookingRequests).toHaveLength(4);
    expect(bookingRequests[0].url).toContain("/api/bookings?status=CONFIRMED");
    expect(bookingRequests[1].url).toContain("/api/bookings/GT-2026-000001");
    expect(bookingRequests[2].method).toBe("POST");
    expect(JSON.parse(bookingRequests[2].body)).toEqual({ bookingId: "GT-2026-000101" });
    expect(bookingRequests[3].url).toContain("/api/bookings/admin/GT-2026-000101/status");
    expect(JSON.parse(bookingRequests[3].body)).toEqual({ status: "CANCELLED" });
    expect(bookingRequests[3].headers.authorization).toBe("Bearer qa-admin-token");

    expect(enquiryRequests).toHaveLength(3);
    expect(enquiryRequests[0].url).toContain("/api/enquiries?stage=NEW_LEAD");
    expect(enquiryRequests[1].method).toBe("POST");
    expect(JSON.parse(enquiryRequests[1].body)).toEqual({
      id: "ENQ-QA-1",
      name: "Lead QA",
    });
    expect(enquiryRequests[2].method).toBe("PATCH");
    expect(enquiryRequests[2].headers.authorization).toBe("Bearer qa-admin-token");
  });

  test("getAll helpers and productService sync/adminList use API responses correctly", async ({
    page,
  }) => {
    await page.route(`${API_ORIGIN}/api/products**`, async (route) => {
      const url = route.request().url();
      if (url.includes("/admin/list")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [{ id: "remote-admin-1", name: "Remote Admin Trek", active: true }],
          }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [{ id: "remote-public-1", name: "Remote Public Trek", active: true }],
        }),
      });
    });

    await page.evaluate(() => {
      sessionStorage.setItem("gt_admin_token", "qa-admin-token");
      localStorage.setItem(
        "gt_treks",
        JSON.stringify([{ id: "local-1", name: "Local Trek", active: true }]),
      );
    });

    const publicProducts = await importModule(
      page,
      "/src/api/getAll.js",
      "getAllProducts",
      ["trek"],
    );
    expect(publicProducts).toEqual([{ id: "remote-public-1", name: "Remote Public Trek", active: true }]);

    const syncedProducts = await importModule(
      page,
      "/src/api/getAll.js",
      "syncProductsFromApi",
      ["trek", "gt_treks"],
    );
    expect(syncedProducts).toEqual([{ id: "remote-public-1", name: "Remote Public Trek", active: true }]);

    const cachedProducts = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("gt_treks") || "[]"),
    );
    expect(cachedProducts[0].name).toBe("Remote Public Trek");

    const adminList = await evaluateModule(
      page,
      "/src/services/product.service.js",
      "return mod.productService.adminList(payload.storageKey);",
      { storageKey: "gt_treks" },
    );
    expect(adminList).toEqual([{ id: "remote-admin-1", name: "Remote Admin Trek", active: true }]);
  });
});
