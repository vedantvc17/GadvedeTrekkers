import { expect, test } from "@playwright/test";
import { importModule, resetBrowserStorage } from "../../helpers/browserApi.js";

test.describe("CRM and storage APIs", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await resetBrowserStorage(page);
  });

  test("leadActions builds whatsapp messages and saves enquiries through handleWhatsAppLead", async ({
    page,
  }) => {
    const message = await importModule(
      page,
      "/src/utils/leadActions.js",
      "buildWhatsAppMessage",
      [{
        packageName: "Harihar Trek",
        location: "Nashik, Maharashtra",
        category: "Trek",
        customerName: "QA User",
        customerPhone: "9999999999",
      }],
    );
    expect(message).toContain("📦 Package: Harihar Trek");
    expect(message).toContain("🙋 Name: QA User");

    const url = await importModule(
      page,
      "/src/utils/leadActions.js",
      "createWhatsAppInquiryUrl",
      [{
        packageName: "Harihar Trek",
        location: "Nashik, Maharashtra",
        category: "Trek",
      }],
    );
    expect(decodeURIComponent(url)).toContain("📍 Location: Nashik, Maharashtra");

    const result = await importModule(
      page,
      "/src/utils/leadActions.js",
      "handleWhatsAppLead",
      [{
        phoneNumber: "919856112727",
        packageName: "Harihar Trek",
        location: "Nashik, Maharashtra",
        category: "Trek",
        source: "QA",
        customerName: "Lead QA",
        customerPhone: "9876543210",
        customerEmail: "lead.qa@example.com",
        openWhatsApp: false,
      }],
    );

    expect(result.ok).toBe(true);
    expect(result.enquiry.status).toBe("NEW_LEAD");

    const enquiries = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("gt_enquiries") || "[]"),
    );
    const customers = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("gt_customers") || "[]"),
    );
    const alerts = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("gt_alerts") || "[]"),
    );

    expect(enquiries.some((entry) => entry.name === "Lead QA")).toBe(true);
    expect(customers.some((entry) => entry.email === "lead.qa@example.com")).toBe(true);
    expect(alerts.some((entry) => entry.type === "ENQUIRY")).toBe(true);
  });

  test("enquiryStorage supports status, tags, assignment, archive, insights, and booking conversion", async ({
    page,
  }) => {
    await page.evaluate(() => {
      localStorage.setItem("gt_enquiries", "[]");
      localStorage.setItem("gt_customers", "[]");
      localStorage.setItem(
        "gt_employee_creds",
        JSON.stringify([
          {
            employeeId: "EMP-SALES-001",
            username: "pranav.surve",
            fullName: "Pranav Surve",
            onboardingStatus: "APPROVED",
          },
        ]),
      );
    });

    const enquiry = await importModule(
      page,
      "/src/data/enquiryStorage.js",
      "saveEnquiry",
      [{
        name: "Arjun QA",
        phone: "9000011111",
        email: "arjun.qa@example.com",
        eventName: "Rajmachi Trek",
        category: "Trek",
        pageUrl: "/treks/rajmachi-trek",
      }],
    );

    const contacted = await importModule(
      page,
      "/src/data/enquiryStorage.js",
      "setEnquiryStatus",
      [enquiry.id, "CONTACTED"],
    );
    expect(contacted.status).toBe("CONTACTED");
    expect(contacted.firstResponseAt).toBeTruthy();

    const tagged = await importModule(
      page,
      "/src/data/enquiryStorage.js",
      "setEnquiryTags",
      [enquiry.id, ["High Intent"]],
    );
    expect(tagged.tags).toEqual(["High Intent"]);

    const assigned = await importModule(
      page,
      "/src/data/enquiryStorage.js",
      "setEnquiryAssignment",
      [
        enquiry.id,
        {
          employeeId: "EMP-SALES-001",
          username: "pranav.surve",
          fullName: "Pranav Surve",
        },
      ],
    );
    expect(assigned.assignedSalesUsername).toBe("pranav.surve");

    const assignable = await importModule(
      page,
      "/src/data/enquiryStorage.js",
      "getAssignableSalesPeople",
      [],
    );
    expect(assignable).toHaveLength(1);

    const insights = await importModule(
      page,
      "/src/data/enquiryStorage.js",
      "getEnquiryInsights",
      [],
    );
    expect(insights.total).toBeGreaterThan(0);
    expect(insights.topLocation.label).toBeTruthy();

    await importModule(
      page,
      "/src/data/bookingStorage.js",
      "saveBookingRecord",
      [{
        bookingId: "BOOK-QA-1",
        customerId: "",
        firstName: "Arjun",
        lastName: "QA",
        email: "arjun.qa@example.com",
        contactNumber: "9000011111",
        trekName: "Rajmachi Trek",
        totalAmount: 1499,
        payableNow: 1499,
        paymentOption: "UPI",
      }],
    );

    const synced = await importModule(
      page,
      "/src/data/enquiryStorage.js",
      "syncEnquiriesWithBookings",
      [],
    );
    const syncedLead = synced.find((entry) => entry.id === enquiry.id);
    expect(syncedLead.status).toBe("CONVERTED");
    expect(syncedLead.bookedEventName).toBe("Rajmachi Trek");

    const archived = await importModule(
      page,
      "/src/data/enquiryStorage.js",
      "archiveEnquiry",
      [enquiry.id],
    );
    expect(archived.archivedAt).toBeTruthy();

    const visibleEnquiries = await importModule(
      page,
      "/src/data/enquiryStorage.js",
      "getEnquiries",
      [],
    );
    expect(visibleEnquiries.some((entry) => entry.id === enquiry.id)).toBe(false);
  });

  test("bookingStorage, customerStorage, notificationStorage, and eventDepartureConfig behave correctly", async ({
    page,
  }) => {
    await page.evaluate(() => {
      localStorage.setItem("gt_bookings", "[]");
      localStorage.setItem("gt_booking_counter", "0");
      localStorage.setItem("gt_customers", "[]");
      localStorage.setItem("gt_alerts", "[]");
      localStorage.setItem("gt_alerts_seen", "[]");
      localStorage.setItem(
        "gt_treks",
        JSON.stringify([
          {
            name: "Harihar Trek",
            departurePlans: JSON.stringify({
              Pune: { pickupPoints: ["FC Road", { location: "Wakad", time: "10:00 PM" }] },
              Mumbai: { pickupPoints: ["Dadar"] },
            }),
          },
        ]),
      );
    });

    const generatedId = await importModule(
      page,
      "/src/data/bookingStorage.js",
      "generateBookingId",
      [],
    );
    expect(generatedId).toMatch(/^GT-\d{4}-\d{6}$/);

    await importModule(
      page,
      "/src/data/bookingStorage.js",
      "saveBookingRecord",
      [{
        bookingId: "BOOK-QA-2",
        enhancedBookingId: generatedId,
        firstName: "Booking",
        lastName: "QA",
        email: "booking.qa@example.com",
        contactNumber: "9111111111",
        trekName: "Harihar Trek",
        totalAmount: 2100,
        payableNow: 2100,
        paymentOption: "UPI",
      }],
    );

    const persistedBooking = await importModule(
      page,
      "/src/data/bookingStorage.js",
      "getBookingById",
      ["BOOK-QA-2"],
    );
    expect(persistedBooking.bookingStatus).toBe("CONFIRMED");

    const dedupedCustomer = await importModule(
      page,
      "/src/data/customerStorage.js",
      "findOrCreateCustomer",
      [{ name: "Booking QA", phone: "9111111111", email: "booking.qa@example.com" }],
    );
    const sameCustomer = await importModule(
      page,
      "/src/data/customerStorage.js",
      "findOrCreateCustomer",
      [{ name: "Booking QA Updated", phone: "9111111111", email: "other@example.com" }],
    );
    expect(sameCustomer.id).toBe(dedupedCustomer.id);

    const customerActivity = await importModule(
      page,
      "/src/data/customerStorage.js",
      "upsertCustomerActivity",
      [{
        name: "Booking QA",
        phone: "9111111111",
        email: "booking.qa@example.com",
        booking: {
          bookingId: "BOOK-QA-2",
          trekName: "Harihar Trek",
          bookingStatus: "CONFIRMED",
        },
      }],
    );
    expect(customerActivity.bookingCount).toBeGreaterThan(0);

    const alert = await importModule(
      page,
      "/src/data/notificationStorage.js",
      "createAlert",
      [{
        type: "BOOKING",
        title: "QA Booking Alert",
        message: "Booking alert created from API test",
      }],
    );
    expect(alert.type).toBe("BOOKING");

    await importModule(
      page,
      "/src/data/notificationStorage.js",
      "markAlertSeen",
      [alert.id],
    );
    const seenIds = await importModule(
      page,
      "/src/data/notificationStorage.js",
      "getSeenAlertIds",
      [],
    );
    expect(seenIds).toContain(alert.id);

    const emailAlert = await importModule(
      page,
      "/src/data/notificationStorage.js",
      "recordEmailAlertAttempt",
      [{ kind: "Enquiry", enquiryId: "ENQ-QA-EMAIL" }],
    );
    expect(emailAlert.type).toBe("EMAIL");

    const departureConfig = await importModule(
      page,
      "/src/utils/eventDepartureConfig.js",
      "getEventDepartureConfig",
      [{
        category: "Trek",
        eventName: "Harihar Trek",
        fallbackDepartureOptions: ["Base Village"],
        fallbackPickupMap: { "Base Village": ["Direct"] },
      }],
    );
    expect(departureConfig.hasSpecificPlans).toBe(true);
    expect(departureConfig.departureOptions).toEqual(["Pune", "Mumbai"]);
    expect(departureConfig.pickupMap.Pune).toEqual(["FC Road", "Wakad (10:00 PM)"]);
  });
});
