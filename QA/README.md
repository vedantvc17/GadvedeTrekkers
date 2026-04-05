# Gadvede Trekkers QA Playwright Project

This folder contains a separate JavaScript Playwright project for end-to-end testing across the public website, admin backend, employee portal, and CRM-linked flows.

## What is included

- isolated Playwright config
- local storage seeding helpers
- reusable POM classes for tested pages
- public action tests
- employee login tests
- admin smoke tests
- reusable QA test data

## Folder structure

```text
QA/
  package.json
  playwright.config.js
  README.md
  helpers/
  pages/
  test-data/
  tests/
    public/
    employee/
    admin/
```

## How to run

From the repo root:

```bash
cd QA
npm run test
```

Run only employee login coverage:

```bash
cd QA
npm run test:employee
```

Run public listing and frontend action coverage:

```bash
cd QA
npm run test:public
```

Run backend smoke coverage:

```bash
cd QA
npm run test:admin
```

Run API coverage:

```bash
cd QA
npm run test:api
```

## Notes

- The QA project starts the main app in dev mode on `http://127.0.0.1:4175`.
- Tests seed local storage from `QA/test-data/local-storage-seed.json`.
- Admin smoke tests seed the admin session in browser storage so the tests do not depend on a live admin login API.
- Employee login tests use the real employee login UI and seeded employee credentials.

## Initial test coverage

### POM structure

- `pages/EmployeeLoginPage.js`
- `pages/TrekListingPage.js`
- `pages/TourListingPage.js`
- `pages/CampingListingPage.js`
- `pages/AdminBookingsPage.js`
- `pages/AdminEnquiriesPage.js`
- `pages/AdminEmployeesPage.js`

### API test structure

- `tests/api/http-transport.spec.js`
- `tests/api/crm-storage.spec.js`

### Public

- trek search box
- view details redirection
- WhatsApp CTA message format
- camping detail redirection

### Employee

- invalid login
- management login
- non-enquiry role login
- direct booking route protection

### Admin

- bookings page load and search
- enquiries pipeline render
- employees page tabs and listing

### APIs

- backend transport wrapper
- products API wrapper
- bookings API wrapper
- enquiries API wrapper
- product service sync behavior
- lead actions APIs
- enquiry storage APIs
- booking storage APIs
- customer storage APIs
- notification APIs
- event departure config API
