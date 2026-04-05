# Gadvede Trekkers QA Test Plan

## 1. Document Control

- Project: Gadvede Trekkers Website + CRM + Admin + Employee Portal
- Test Scope: End-to-end functional and regression validation
- Test Framework Target: Playwright
- Test Assets Location: `QA/`
- Test Environments:
  - Local development
  - Staging / preview deployment
  - Production smoke-only

## 2. Objective

This test plan defines how to validate the full application without impacting existing functionality. It covers public user journeys, admin workflows, employee workflows, CRM/data synchronization, and role-based access behavior.

The main QA goals are:

- verify that key business flows work end to end
- prevent regressions after backend or UI changes
- validate that admin updates reflect correctly on the frontend
- ensure customer, enquiry, booking, and notification data remain consistent
- confirm protected routes and role restrictions behave correctly

## 3. In Scope

- Public frontend pages
- Event listing pages:
  - Treks
  - Tours
  - Camping
  - Rentals
  - Heritage Walks
  - Corporate / Industrial Visits where applicable
- Detail pages for all event modules
- Booking flow
- Enquiry flow
- WhatsApp, SMS, call, and email action links
- Admin backend
- Employee portal
- Direct booking flow
- CRM-linked flows:
  - Enquiries
  - Customers
  - Bookings
  - Transactions
  - Alerts / notifications
- Route protection
- Mobile responsiveness smoke checks

## 4. Out of Scope

- Deep load testing
- Penetration testing
- Browser support below the team’s target baseline
- Third-party provider delivery guarantees:
  - WhatsApp actual delivery
  - SMS delivery
  - email provider delivery
- Payment gateway settlement verification outside the app

## 5. QA Strategy

QA should be layered:

1. Smoke Testing
- confirm app loads
- confirm critical routes work
- confirm no obvious crash in core flows

2. Functional Testing
- validate each feature against expected business behavior

3. Regression Testing
- rerun key flows after every major change

4. End-to-End Testing
- validate complete cross-module workflows

5. Role-Based Testing
- public vs employee vs admin access and behavior

6. Responsive Testing
- verify important flows on desktop and mobile viewports

## 6. Test Environments

### 6.1 Local

Use local environment for:

- development verification
- seeded test data validation
- feature debugging

### 6.2 Staging / Preview

Use staging for:

- final regression checks
- integrated API behavior
- pre-release approvals

### 6.3 Production

Production should be used only for:

- smoke tests
- safe non-destructive checks

Do not run destructive or data-polluting tests in production.

## 7. Recommended QA Folder Structure

```text
QA/
  TEST_PLAN.md
  README.md
  package.json
  playwright.config.ts
  .env.qa
  tests/
    smoke/
    public/
    admin/
    employee/
    crm/
    regression/
  fixtures/
  helpers/
  test-data/
  auth/
  reports/
  screenshots/
  traces/
```

## 8. Modules Under Test

### 8.1 Public Website

- Home page
- Navigation
- Listing pages
- Detail pages
- Enquiry modal
- Booking page
- Contact actions
- Search / filter / category navigation where available

### 8.2 Admin Backend

- Admin login
- Dashboard
- Manage Treks
- Manage Tours
- Manage Camping
- Manage Rentals
- Manage Heritage
- Enquiries
- Customers
- Bookings
- Transactions
- Booking Desk
- Docs
- Reports and supporting modules

### 8.3 Employee Portal

- Employee login
- Employee dashboard
- Assigned enquiries
- Direct booking form
- Referral and share flows
- Role-based visibility

### 8.4 CRM / Data Layer

- Enquiry creation
- Customer creation / update
- Booking creation
- Enquiry conversion logic
- Notifications / alerts
- Data sync after admin edits

## 9. Entry Criteria

Testing may begin when:

- app builds successfully
- critical routes are available
- required environment variables are configured
- seed data or test accounts are available
- APIs or local fallback storage are functioning

## 10. Exit Criteria

Testing is considered complete when:

- all critical smoke tests pass
- all critical end-to-end flows pass
- no open Sev-1 or Sev-2 defects remain
- major regression suite passes on target environment
- blockers are documented with mitigation if any remain

## 11. Test Data Requirements

Prepare dedicated QA data for:

- admin user
- management employee
- sales employee
- regular employee
- public enquiry users
- public booking users
- duplicate phone/email scenarios
- converted enquiry scenarios
- inactive event scenarios
- no-data / empty-state scenarios

Recommended sample records:

- enquiry with no assignment
- enquiry assigned to sales user
- enquiry tagged high intent
- enquiry converted via phone
- enquiry converted via email
- booking with partial payment
- booking with manual tax-exempt direct entry
- event with one pickup point only
- event with multiple joining destinations

## 12. Core Business Flows To Validate

### 12.1 Public Enquiry Flow

Steps:

1. User opens a public listing or detail page
2. User clicks enquiry CTA
3. Enquiry form opens
4. User submits valid details
5. Enquiry is saved
6. WhatsApp opens with correct prefilled message
7. Customer record is created or updated
8. Alert is created

Expected Result:

- enquiry exists in enquiry dashboard
- customer exists in customers
- no crash on modal close/reopen

### 12.2 Public Booking Flow

Steps:

1. User opens booking page
2. User selects event category
3. User selects event name
4. joining destination is shown only for that event
5. matching pickup points are shown
6. user submits booking

Expected Result:

- booking is created
- customer is linked
- transaction/alert is created as per flow
- data persists correctly

### 12.3 Enquiry Auto-Conversion Flow

Steps:

1. Create enquiry with phone/email
2. Book same event using same phone or email

Expected Result:

- enquiry status changes to `Converted`
- customer record shows both enquiry and booking history
- enquiry is retained, not deleted

### 12.4 Admin Content Update Reflection

Steps:

1. Admin edits an event in backend
2. Save changes
3. Open frontend listing
4. Open detail page

Expected Result:

- listing reflects latest backend-managed content
- detail page reflects latest backend-managed content
- no mismatch between listing and detail

### 12.5 Employee Assigned Enquiry Flow

Steps:

1. Admin assigns enquiry to sales employee
2. Employee logs in
3. Employee opens enquiries
4. Employee changes status and tags

Expected Result:

- assigned enquiry visible in employee portal
- status/tag changes persist
- management visibility rules remain correct

### 12.6 Direct Booking Flow

Steps:

1. Employee opens direct booking form
2. Employee selects event
3. form shows event-specific pickup options
4. employee submits booking

Expected Result:

- booking created successfully
- tax stored as 0 for direct manual entry
- customer updated
- enquiry sync runs if applicable
- alerts created

## 13. Test Coverage Matrix

| Area | Smoke | Functional | Regression | E2E | Mobile |
|---|---|---|---|---|---|
| Home / Navigation | Yes | Yes | Yes | Yes | Yes |
| Treks | Yes | Yes | Yes | Yes | Yes |
| Tours | Yes | Yes | Yes | Yes | Yes |
| Camping | Yes | Yes | Yes | Yes | Yes |
| Rentals | Yes | Yes | Yes | Yes | Yes |
| Heritage | Yes | Yes | Yes | Yes | Yes |
| Booking | Yes | Yes | Yes | Yes | Yes |
| Enquiries | Yes | Yes | Yes | Yes | Yes |
| Admin | Yes | Yes | Yes | Yes | Limited |
| Employee Portal | Yes | Yes | Yes | Yes | Yes |
| CRM Sync | No | Yes | Yes | Yes | No |

## 14. Recommended Playwright Test Suites

### 14.1 Smoke Suite

- app loads
- home page renders
- key routes accessible
- admin login page opens
- employee login page opens

### 14.2 Public Suite

- public navigation
- event listing render
- event details render
- WhatsApp CTA format
- enquiry modal submission
- booking submission
- responsive mobile smoke

### 14.3 Admin Suite

- admin login
- create/edit trek
- create/edit tour
- create/edit camping
- create/edit rental
- edit heritage
- edit booking desk dropdowns
- assign enquiry
- verify frontend reflection

### 14.4 Employee Suite

- employee login
- assigned enquiry visible
- management user sees all enquiries
- direct booking form submission
- contact action links

### 14.5 CRM Suite

- enquiry saved to CRM layer
- booking saved to customers/bookings
- auto-convert on phone match
- auto-convert on email match
- alerts created

### 14.6 Regression Suite

- major public routes
- admin edit reflects on frontend
- employee direct booking still works
- enquiry flow still works
- route protection still enforced

## 15. Suggested Test Case Groups

### Group A: Navigation and Rendering

- all top-level routes load without crash
- category pages show expected cards
- detail pages load valid content
- empty states are handled gracefully

### Group B: Forms and Validation

- required field validation
- invalid email validation
- invalid phone handling
- date field behavior
- file upload behavior
- dropdown behavior
- tooltips visible where expected

### Group C: Role and Permission

- public cannot access employee routes
- public cannot access admin routes
- employee cannot access admin routes
- management can see all enquiries
- sales sees assigned enquiries only

### Group D: Sync and Persistence

- admin content save persists after reload
- frontend shows updated admin content
- enquiry persists after page refresh
- booking persists after page refresh
- customer history retains enquiry + booking links

### Group E: Action Buttons

- WhatsApp link opens with correct text
- SMS link contains prefilled message
- tel links are correct
- mailto links are correct

### Group F: Notification Behavior

- alert created on enquiry
- alert created on booking
- in-app notification visible if browser permission not granted
- notification can be dismissed
- browser notification path works when granted

## 16. Non-Functional Quality Checks

### 16.1 Performance Smoke

- major pages load within acceptable limits in staging
- no obvious UI freeze during save actions

### 16.2 Stability

- repeated open/close of enquiry modal does not break state
- page refresh preserves stored data

### 16.3 Accessibility Smoke

- buttons have visible labels
- form fields have labels
- interactive controls are keyboard reachable on major flows

## 17. Defect Severity Guidelines

- Sev 1
  - app crash
  - booking flow blocked
  - enquiry flow blocked
  - admin cannot save critical business data
  - unauthorized access to protected data

- Sev 2
  - wrong data saved
  - customer/enquiry/booking sync broken
  - management/sales visibility incorrect
  - frontend not reflecting backend updates

- Sev 3
  - UI issue with workaround
  - minor validation or tooltip issue
  - layout problem on one viewport

- Sev 4
  - cosmetic issue only

## 18. Reporting and Artifacts

Store all QA outputs under `QA/`:

- HTML reports
- traces
- screenshots
- videos
- failure logs
- defect notes

Recommended naming:

- `QA/reports/smoke/`
- `QA/reports/regression/`
- `QA/reports/release-<date>/`

## 19. Release Readiness Checklist

- build passes
- smoke suite passes
- critical E2E suite passes
- no open Sev-1 / Sev-2 defects
- admin content sync validated
- employee portal validated
- booking and enquiry workflows validated

## 20. Future Enhancements

- add full Playwright project in `QA/`
- add reusable auth fixtures
- add seeded test-data helpers
- add API mocking for unstable third-party actions
- add scheduled nightly regression runs
- add visual regression snapshots for major listing pages

## 21. Initial Recommended Test Cases For Automation

Start automation with these first:

1. Public enquiry submission creates enquiry + customer
2. Public booking submission creates booking + customer
3. Matching booking converts enquiry
4. Admin edits camping item and frontend reflects change
5. Admin assigns enquiry to sales employee
6. Sales employee sees assigned enquiry
7. Management user sees all enquiries
8. Employee direct booking creates zero-tax manual booking
9. Protected employee route redirects when logged out
10. Notification appears after booking/enquiry event

## 22. Ownership

- QA Owner: To be assigned
- Automation Owner: To be assigned
- Release Sign-off: Product / Operations / Tech

## 23. Summary

This project requires full-flow QA, not just page-level checks. The most important quality signal is whether the platform works as a connected system:

- frontend captures intent
- CRM stores the lead
- admin manages the pipeline
- employee executes follow-up
- booking and customer history remain linked

This test plan is the baseline document for building a dedicated Playwright QA project in the separate `QA/` folder without impacting the existing application codebase.
