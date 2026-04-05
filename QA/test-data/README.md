# QA Test Data Guide

This folder contains reusable test data for Playwright, manual QA, and seeded localStorage-based validation.

## Purpose

The data here is designed to support:

- public enquiry flow testing
- public booking flow testing
- admin workflow testing
- employee portal testing
- CRM conversion testing
- notification and customer-history checks

## Main Files

- `local-storage-seed.json`
  - master seed file grouped by application storage key
- `test-scenarios.json`
  - scenario-level expected outcomes for QA execution
- `public-users.json`
  - public-facing test users for enquiry and booking
- `employee-users.json`
  - employee and management test users
- `admin-content-updates.json`
  - sample backend content edits to verify frontend reflection

## Recommended Usage

### Option 1: Playwright localStorage seeding

Use `local-storage-seed.json` and write values into localStorage before opening the app.

Suggested keys covered:

- `gt_customers`
- `gt_bookings`
- `gt_enquiries`
- `gt_employees`
- `gt_employee_creds`
- `gt_notifications`

### Option 2: Fixture-driven testing

Use the smaller files by purpose:

- users from `public-users.json`
- employee login data from `employee-users.json`
- assertions from `test-scenarios.json`

## Notes

- these files do not modify application code
- these files are safe to keep inside `QA/`
- the data is aligned with the current app field names and status values
- manual booking test records use `taxAmount: 0` and `taxExempt: true`

## Suggested Next Automation Step

Build a Playwright helper like:

```ts
async function seedLocalStorage(page, seed) {
  await page.addInitScript((payload) => {
    Object.entries(payload).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }, seed);
}
```

Then load `local-storage-seed.json` and inject it before visiting the app.
