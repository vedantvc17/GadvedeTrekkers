# Gadvede Trekkers Test Coverage Matrix

## Purpose

This document breaks QA down into action-level coverage so every important user interaction is explicitly testable across:

- frontend public flows
- admin/backend operational flows
- employee portal workflows
- CRM/data sync behavior

It complements:

- [TEST_PLAN.md](/C:/Users/Codengine/GadvedeTrekkers/GadvedeTrekkers/QA/TEST_PLAN.md)
- [test-data/README.md](/C:/Users/Codengine/GadvedeTrekkers/GadvedeTrekkers/QA/test-data/README.md)

## 1. Frontend Public Coverage

### 1.1 Global Navigation

The following must be tested:

- header logo click redirects to home
- main nav links open correct pages
- event category dropdown opens correct section pages
- footer links redirect correctly
- breadcrumb or back navigation works where present
- invalid route handling is graceful

### 1.2 Home Page Actions

The following actions must be tested:

- all homepage cards render
- slider/carousel arrows work
- slider pagination or auto-slide works where applicable
- featured trek cards open correct detail pages
- featured tour cards open correct detail pages
- featured camping cards open correct detail pages
- rentals section opens correct detail pages
- CTA buttons redirect correctly
- WhatsApp buttons open with expected prefilled content

### 1.3 Listing Pages

Apply to:

- Treks
- Tours
- Camping
- Rentals
- Heritage Walks

The following actions must be tested:

- search box filters results correctly
- search reset behavior works
- category filter works
- price filter works if present
- region/destination filter works if present
- sorting works if present
- cards show correct title, price, duration, and status
- `View Details` opens the correct details page
- `Book Now` opens correct booking/WhatsApp flow
- WhatsApp button opens correct message
- page handles empty result state correctly

### 1.4 Detail Pages

The following actions must be tested:

- page opens from listing correctly
- page renders backend-managed content
- image gallery works
- itinerary is visible
- inclusions/exclusions are visible
- FAQ renders correctly
- price and dates display correctly
- `Book Now` works
- WhatsApp CTA works
- enquiry CTA works
- `Download Itinerary` works if available
- preview links or external references open correctly

### 1.5 Booking Page

The following actions must be tested:

- event category dropdown loads
- event name dropdown loads correct values
- changing event changes joining destinations
- joining destination changes pickup options
- single pickup/joining option displays correctly
- travel date input works
- required field validation works
- contact and WhatsApp toggle works
- amount fields calculate correctly
- tax logic behaves correctly
- screenshot upload works
- form submit works
- success state appears
- booking record is created correctly

### 1.6 Enquiry Modal / Lead Capture

The following actions must be tested:

- enquiry modal opens from all supported entry points
- all required fields validate
- email field works
- phone field works
- event name is prefilled when launched from event card
- source/page URL captured correctly
- submit saves enquiry
- customer record gets created/updated
- WhatsApp opens with prefilled data
- modal close/reopen state works

### 1.7 Contact Actions

The following must be tested:

- call button builds correct `tel:` URL
- email button builds correct `mailto:` URL
- WhatsApp button builds correct URL/message
- SMS button opens with prefilled message
- action buttons work on both desktop-compatible and mobile-compatible flows

### 1.8 Redirects

The following redirects must be tested:

- unauthenticated employee route redirects to login
- unauthenticated admin route redirects to login
- post-login employee redirect honors `next` parameter
- direct links to event details open correctly
- copied links from admin/employee tools open correct destination

## 2. Admin / Backend Coverage

Note: this app is frontend-driven with backend/API sync. “Backend” here means admin-facing operational modules plus sync behavior.

### 2.1 Admin Auth

The following actions must be tested:

- admin login with valid credentials
- admin login with invalid credentials
- protected admin routes blocked when logged out
- logout works
- session persists correctly on refresh if intended

### 2.2 Dashboard

The following actions must be tested:

- dashboard loads without blank widgets
- counts show valid values
- links/cards navigate to correct admin modules
- enquiry insight cards load
- no key stat block is empty when seeded data is present

### 2.3 Event Management

Apply to:

- Treks
- Tours
- Camping
- Rentals
- Heritage

The following actions must be tested:

- listing page loads saved records
- create new event works
- edit existing event works
- delete/archive action behaves correctly if supported
- preview works
- active/inactive status works
- all visible frontend fields are editable from backend
- save persists across refresh
- frontend listing reflects backend update
- detail page reflects backend update

### 2.4 Booking Desk

The following actions must be tested:

- booking desk page loads all required sections
- editable dropdown values save correctly
- read-only sections display proper data
- preview button works
- copied staff-form link opens correctly
- backend-configured dropdown options appear in booking forms

### 2.5 Enquiry Management

The following actions must be tested:

- enquiry board loads
- each status column loads correct enquiries
- drag/drop changes status correctly if supported
- view details works
- viewing does not incorrectly change status
- assign sales person works
- high intent tagging works
- contacted / quoted / converted / lost transitions work
- archived enquiries are retained and not hard-deleted
- customer record sync works
- matched booking auto-converts enquiry

### 2.6 Customer Management

The following actions must be tested:

- customers list loads
- customer search works
- linked enquiries visible
- linked bookings visible
- phone/email/contact data visible
- duplicate phone/email behavior correctly upserts instead of duplicating

### 2.7 Booking Management

The following actions must be tested:

- bookings list loads
- search works
- filter works
- manual/direct bookings visible
- booking details correct
- payment status visible
- zero-tax direct bookings stored correctly
- related customer visible

### 2.8 Transactions / Payments

The following actions must be tested:

- transactions page loads
- payment totals are correct
- partial payment records appear correctly
- zero-tax manual bookings appear correctly
- payment references are stored
- no important financial fields are blank for seeded records

### 2.9 Employee Management

The following actions must be tested:

- employees list loads
- employee creation works if supported
- employee edit works
- onboarding credentials generate correctly
- assigned roles reflect in employee portal
- management / sales / trek leader distinctions work

### 2.10 Docs / API Docs

The following actions must be tested:

- docs page loads
- updated process docs visible
- API list visible
- links and module descriptions are current

## 3. Employee Portal Coverage

### 3.1 Employee Auth

The following actions must be tested:

- valid login works
- invalid login shows correct error
- employee logout works
- direct protected routes redirect when not logged in

### 3.2 Assigned Enquiries

The following actions must be tested:

- sales employee sees only assigned enquiries
- management user sees full enquiry pipeline
- enquiry card details open
- status updates save
- high intent tag updates save
- call / WhatsApp / email / SMS actions work

### 3.3 Direct Booking Form

The following actions must be tested:

- page access is protected
- event selection works
- joining destination updates properly
- pickup location updates properly
- additional travelers section works
- screenshot upload works
- submit creates booking
- customer is updated
- enquiry conversion happens if applicable
- booking alert is created

### 3.4 Employee Utilities

The following actions must be tested:

- referral/copy link works
- copied link opens correctly
- visible shortcuts navigate properly
- mobile sidebar works

## 4. CRM / Data Sync Coverage

### 4.1 Enquiry Sync

The following must be tested:

- enquiry saves locally
- enquiry sync call attempts correctly
- customer record updated
- alerts created

### 4.2 Booking Sync

The following must be tested:

- booking saves locally
- booking sync call attempts correctly
- customer record updated
- enquiry conversion logic runs
- booking alert created

### 4.3 Conversion Rules

The following must be tested:

- convert by matching phone and event
- convert by matching email and event
- do not convert wrong event with same phone unless intended
- converted enquiry retains history

### 4.4 Notifications

The following must be tested:

- browser permission prompt path
- in-app fallback notifications
- dismiss single alert
- dismiss all alerts
- unseen alerts remain until delivered/dismissed

## 5. Mobile Coverage

These must be smoke-tested on mobile viewport:

- homepage sliders
- listing pages
- detail pages
- enquiry modal
- booking form
- employee portal
- admin sidebar/menu
- action buttons remain tappable

## 6. Data Completeness Checks

For seeded QA data, verify:

- no required table is empty
- no critical card/widget is blank
- no event card has missing title/price/link
- no customer record is missing core identity fields
- no enquiry record is missing status
- no booking record is missing event and contact fields

## 7. Automation Priority

### Priority 1

- public enquiry
- public booking
- admin event edit to frontend reflection
- employee direct booking
- enquiry conversion
- auth protection

### Priority 2

- search/filter actions
- download itinerary
- payment/transaction checks
- notifications
- mobile regression

### Priority 3

- visual polish checks
- non-critical content modules
- secondary admin pages

## 8. Suggested Playwright Spec Breakdown

- `public/home-actions.spec.ts`
- `public/listing-actions.spec.ts`
- `public/detail-actions.spec.ts`
- `public/booking-form.spec.ts`
- `public/enquiry-modal.spec.ts`
- `public/redirections.spec.ts`
- `admin/auth.spec.ts`
- `admin/event-management.spec.ts`
- `admin/enquiry-board.spec.ts`
- `admin/bookings-payments.spec.ts`
- `admin/employees.spec.ts`
- `employee/login.spec.ts`
- `employee/assigned-enquiries.spec.ts`
- `employee/direct-booking.spec.ts`
- `crm/conversion.spec.ts`
- `crm/notifications.spec.ts`
- `mobile/smoke.spec.ts`

## 9. Summary

Yes, all these actions should be tested.

That includes frontend action-level coverage such as:

- search box
- download itinerary
- view details
- book now
- WhatsApp
- enquiry popup
- all redirections

And backend/admin operational coverage such as:

- listing events
- editing and saving event data
- handling bookings
- handling payments
- employee handling
- enquiry assignment and pipeline movement
- CRM/customer synchronization

This document is the action-level checklist that should drive the Playwright test suite implementation.
