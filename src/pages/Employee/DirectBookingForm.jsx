import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import InfoTooltip from "../../components/InfoTooltip";
import { getEmployeeSession } from "../../data/employeePortalStorage";
import { getCurrentAdminUser } from "../../data/permissionStorage";
import { getBookingFormConfig } from "../../data/bookingFormStorage";
import { findOrCreateCustomer, upsertCustomerActivity } from "../../data/customerStorage";
import { generateBookingId, saveBookingRecord } from "../../data/bookingStorage";
import { createTransaction } from "../../data/transactionStorage";
import { createAlert, recordEmailAlertAttempt } from "../../data/notificationStorage";
import { syncEnquiriesWithBookings } from "../../data/enquiryStorage";
import { getEventDepartureConfig } from "../../utils/eventDepartureConfig";

function parseLines(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parsePickupOptions(value) {
  try {
    const parsed = JSON.parse(value || "{}");
    return Object.keys(parsed).length ? parsed : {};
  } catch {
    return {};
  }
}

function getLiveItems(key, category) {
  try {
    const items = JSON.parse(localStorage.getItem(key) || "[]");
    return items
      .filter((item) => item.active !== false)
      .map((item) => ({
        category,
        name: item.name || item.title || "",
      }))
      .filter((item) => item.name);
  } catch {
    return [];
  }
}

function getBookingEventCatalog(customItems = []) {
  const live = [
    ...getLiveItems("gt_treks", "Trek"),
    ...getLiveItems("gt_tours", "Tour"),
    ...getLiveItems("gt_camping", "Camping"),
    ...getLiveItems("gt_rentals", "Rental"),
    ...getLiveItems("gt_heritage", "Heritage Walk"),
  ];

  const manual = customItems.map((name) => ({
    category: "Custom",
    name,
  }));

  const seen = new Set();
  return [...live, ...manual].filter((item) => {
    const key = `${item.category}::${item.name}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildTraveler(departureList, pickupMap) {
  const defaultDeparture = departureList[0] || "Base Village";
  return {
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    departureOrigin: defaultDeparture,
    pickupLocation: pickupMap[defaultDeparture]?.[0] || "",
  };
}

export default function DirectBookingForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const employee = getEmployeeSession();
  const isAdmin = !!sessionStorage.getItem("gt_admin");
  const adminUser = getCurrentAdminUser();
  const staffName = employee?.fullName || adminUser?.name || "Staff";
  const bookingForm = useMemo(() => getBookingFormConfig(), []);

  const paymentMethods = useMemo(
    () => parseLines(bookingForm.manualPaymentMethodOptions),
    [bookingForm.manualPaymentMethodOptions]
  );
  const departureOptions = useMemo(
    () => parseLines(bookingForm.departureOptions),
    [bookingForm.departureOptions]
  );
  const sourceOptions = useMemo(
    () => parseLines(bookingForm.manualSourceOptions),
    [bookingForm.manualSourceOptions]
  );
  const categoryOptions = useMemo(
    () => parseLines(bookingForm.manualCategoryOptions),
    [bookingForm.manualCategoryOptions]
  );
  const statusOptions = useMemo(
    () => parseLines(bookingForm.manualStatusOptions),
    [bookingForm.manualStatusOptions]
  );
  const pickupOptions = useMemo(
    () => parsePickupOptions(bookingForm.pickupOptions),
    [bookingForm.pickupOptions]
  );
  const eventCatalog = useMemo(
    () => getBookingEventCatalog(parseLines(bookingForm.manualEventOptions)),
    [bookingForm.manualEventOptions]
  );

  const [formData, setFormData] = useState({
    eventCategory: categoryOptions[0] || "Trek",
    eventName: "",
    source: sourceOptions[0] || "Employee Portal",
    tickets: 1,
    departureOrigin: departureOptions[0] || "Base Village",
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    sameWhatsapp: true,
    whatsappNumber: "",
    travelDate: "",
    pickupLocation: pickupOptions[departureOptions[0] || "Base Village"]?.[0] || "",
    emergencyContact: "",
    paymentOption: paymentMethods[0] || "UPI",
    totalPackageAmount: "",
    amountPaidNow: "",
    bookingStatus: statusOptions[0] || "CONFIRMED",
    paymentReference: "",
    notes: "",
  });
  const [additionalTravelers, setAdditionalTravelers] = useState([]);
  const [success, setSuccess] = useState(null);
  const selectedEventConfig = useMemo(
    () =>
      getEventDepartureConfig({
        category: formData.eventCategory,
        eventName: formData.eventName,
        fallbackDepartureOptions: departureOptions,
        fallbackPickupMap: pickupOptions,
      }),
    [departureOptions, formData.eventCategory, formData.eventName, pickupOptions]
  );
  const activeDepartureOptions = selectedEventConfig.departureOptions.length
    ? selectedEventConfig.departureOptions
    : departureOptions;
  const activePickupOptions = selectedEventConfig.pickupMap;

  useEffect(() => {
    if (!employee && !isAdmin) {
      navigate(`/employee-login?next=${encodeURIComponent(`${location.pathname}${location.search}`)}`);
    }
  }, [employee, isAdmin, location.pathname, location.search, navigate]);

  useEffect(() => {
    const nextDeparture = activeDepartureOptions.includes(formData.departureOrigin)
      ? formData.departureOrigin
      : activeDepartureOptions[0] || "Base Village";
    const nextPickup = activePickupOptions[nextDeparture]?.includes(formData.pickupLocation)
      ? formData.pickupLocation
      : activePickupOptions[nextDeparture]?.[0] || "";

    if (
      nextDeparture !== formData.departureOrigin ||
      nextPickup !== formData.pickupLocation
    ) {
      setFormData((current) => ({
        ...current,
        departureOrigin: nextDeparture,
        pickupLocation: nextPickup,
      }));
    }
  }, [
    activeDepartureOptions,
    activePickupOptions,
    formData.departureOrigin,
    formData.pickupLocation,
  ]);

  useEffect(() => {
    const extraTravelerCount = Math.max(0, Number(formData.tickets) - 1);
    setAdditionalTravelers((current) => {
      if (current.length === extraTravelerCount) return current;
      if (current.length < extraTravelerCount) {
        return [
          ...current,
          ...Array.from(
            { length: extraTravelerCount - current.length },
            () => buildTraveler(activeDepartureOptions, activePickupOptions)
          ),
        ];
      }
      return current.slice(0, extraTravelerCount);
    });
  }, [activeDepartureOptions, activePickupOptions, formData.tickets]);

  useEffect(() => {
    setAdditionalTravelers((current) =>
      current.map((traveler) => {
        const nextDeparture = activeDepartureOptions.includes(traveler.departureOrigin)
          ? traveler.departureOrigin
          : activeDepartureOptions[0] || "Base Village";
        const nextPickup = activePickupOptions[nextDeparture]?.includes(traveler.pickupLocation)
          ? traveler.pickupLocation
          : activePickupOptions[nextDeparture]?.[0] || "";

        if (
          nextDeparture === traveler.departureOrigin &&
          nextPickup === traveler.pickupLocation
        ) {
          return traveler;
        }

        return {
          ...traveler,
          departureOrigin: nextDeparture,
          pickupLocation: nextPickup,
        };
      })
    );
  }, [activeDepartureOptions, activePickupOptions]);

  const filteredEvents = useMemo(() => {
    const selectedCategory = formData.eventCategory;
    const matching = eventCatalog.filter(
      (item) => item.category === selectedCategory || item.category === "Custom"
    );
    return matching.length ? matching : eventCatalog;
  }, [eventCatalog, formData.eventCategory]);

  const totalPackageAmount = Number(formData.totalPackageAmount || 0);
  const amountPaidNow = Number(formData.amountPaidNow || 0);
  const remainingAmount = Math.max(0, totalPackageAmount - amountPaidNow);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "departureOrigin"
        ? { pickupLocation: activePickupOptions[value]?.[0] || "" }
        : {}),
      ...(name === "sameWhatsapp" && checked ? { whatsappNumber: "" } : {}),
      ...(name === "eventCategory"
        ? {
            eventName: "",
            departureOrigin: departureOptions[0] || "Base Village",
            pickupLocation: pickupOptions[departureOptions[0] || "Base Village"]?.[0] || "",
          }
        : {}),
    }));
  };

  const handleTravelerChange = (index, field, value) => {
    setAdditionalTravelers((current) =>
      current.map((traveler, travelerIndex) =>
        travelerIndex === index
          ? {
              ...traveler,
              [field]: value,
              ...(field === "departureOrigin"
                ? { pickupLocation: activePickupOptions[value]?.[0] || "" }
                : {}),
            }
          : traveler
      )
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const bookingId = `GTK-${Date.now().toString().slice(-8)}`;
    const enhancedBookingId = generateBookingId();
    const customer = findOrCreateCustomer({
      name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.contactNumber,
      email: formData.email,
    });

    const bookingRecord = {
      bookingId,
      enhancedBookingId,
      customerId: customer.id,
      trekName: formData.eventName,
      eventName: formData.eventName,
      eventCategory: formData.eventCategory,
      trekLocation: formData.departureOrigin,
      tickets: Number(formData.tickets),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      departureOrigin: formData.departureOrigin,
      contactNumber: formData.contactNumber,
      whatsappNumber: formData.sameWhatsapp ? formData.contactNumber : formData.whatsappNumber,
      travelDate: formData.travelDate,
      pickupLocation: formData.pickupLocation,
      emergencyContact: formData.emergencyContact,
      paymentOption: formData.paymentOption,
      paymentReference: formData.paymentReference,
      notes: formData.notes,
      baseAmount: totalPackageAmount,
      taxAmount: 0,
      totalAmount: totalPackageAmount,
      payableNow: amountPaidNow,
      remainingAmount,
      bookingDate: new Date().toLocaleString("en-IN"),
      additionalTravelers,
      bookingStatus: formData.bookingStatus,
      bookingSource: formData.source,
      manualBooking: true,
      collectedOffline: true,
      taxExempt: true,
      createdByStaff: staffName,
    };

    saveBookingRecord(bookingRecord);

    upsertCustomerActivity({
      name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.contactNumber,
      email: formData.email,
      booking: bookingRecord,
    });

    syncEnquiriesWithBookings();

    createTransaction({
      bookingId,
      customerId: customer.id,
      customerName: `${formData.firstName} ${formData.lastName}`,
      paymentMode: formData.paymentOption,
      grossAmount: amountPaidNow,
      tax: 0,
      netAmount: amountPaidNow,
      transactionStatus: "SUCCESS",
    });

    createAlert({
      type: "BOOKING",
      title: "Direct Booking Saved",
      message: `${formData.firstName} ${formData.lastName} booked ${formData.eventName} via ${formData.source}`,
      meta: {
        bookingId,
        customerId: customer.id,
        eventName: formData.eventName,
        source: formData.source,
      },
    });

    recordEmailAlertAttempt({
      kind: "Direct Booking",
      bookingId,
      customerName: `${formData.firstName} ${formData.lastName}`,
      eventName: formData.eventName,
      amount: amountPaidNow,
    });

    setSuccess({
      enhancedBookingId,
      customerName: `${formData.firstName} ${formData.lastName}`,
      eventName: formData.eventName,
    });

    setFormData({
      eventCategory: categoryOptions[0] || "Trek",
      eventName: "",
      source: sourceOptions[0] || "Employee Portal",
      tickets: 1,
      departureOrigin: departureOptions[0] || "Base Village",
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      sameWhatsapp: true,
      whatsappNumber: "",
      travelDate: "",
      pickupLocation: pickupOptions[departureOptions[0] || "Base Village"]?.[0] || "",
      emergencyContact: "",
      paymentOption: paymentMethods[0] || "UPI",
      totalPackageAmount: "",
      amountPaidNow: "",
      bookingStatus: statusOptions[0] || "CONFIRMED",
      paymentReference: "",
      notes: "",
    });
    setAdditionalTravelers([]);
  };

  if (!employee && !isAdmin) return null;

  return (
    <section className="booking-page">
      <div className="container py-4 py-md-5">
        <div className="booking-hero">
          <div>
            <span className="booking-kicker">Staff Booking Desk</span>
            <h1>{bookingForm.manualFormTitle}</h1>
            <p>{bookingForm.manualFormSubtitle}</p>
          </div>
          <div className="booking-hero-card">
            <div className="booking-hero-label">Logged In As</div>
            <h2>{staffName}</h2>
            <p>{employee ? "Employee Portal" : "Admin Access"}</p>
          </div>
        </div>

        {success && (
          <div className="alert alert-success py-3 mb-4">
            ✅ Direct booking saved for <strong>{success.customerName}</strong> under{" "}
            <strong>{success.eventName}</strong>. Booking ID:{" "}
            <strong>{success.enhancedBookingId}</strong>
          </div>
        )}

        <form className="booking-layout" onSubmit={handleSubmit}>
          <div className="booking-form-card">
            <div className="booking-section-heading">
              <h2>Customer & Booking Details</h2>
              <p>
                Capture the same customer data here when payment is collected directly through
                UPI, cash, or bank transfer without using website checkout.
              </p>
            </div>

            <div className="booking-grid">
              <label className="booking-field">
                <span>
                  Event Category
                  <InfoTooltip text="Managed from Admin → Booking Desk so staff can keep categories up to date." />
                </span>
                <select name="eventCategory" value={formData.eventCategory} onChange={handleChange} required>
                  {categoryOptions.map((option) => (
                    <option value={option} key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="booking-field">
                <span>
                  Event Name
                  <InfoTooltip text="This dropdown combines live website listings and any custom event names added from the backend." />
                </span>
                <select name="eventName" value={formData.eventName} onChange={handleChange} required>
                  <option value="">Select event</option>
                  {filteredEvents.map((item) => (
                    <option value={item.name} key={`${item.category}-${item.name}`}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="booking-field">
                <span>
                  Lead Source
                  <InfoTooltip text="Useful for reporting. These source options are editable in Admin → Booking Desk." />
                </span>
                <select name="source" value={formData.source} onChange={handleChange} required>
                  {sourceOptions.map((option) => (
                    <option value={option} key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="booking-field">
                <span>Travel Date</span>
                <input type="date" name="travelDate" value={formData.travelDate} onChange={handleChange} required />
              </label>

              <label className="booking-field">
                <span>Selected Event</span>
                <input type="text" value={formData.eventName || "Select an event first"} readOnly />
              </label>

              <label className="booking-field booking-field-full">
                <span>
                  Joining Destination
                  <InfoTooltip text="Pickup points below change automatically based on the selected joining destination." />
                </span>
                <div className="booking-radio-grid">
                  {activeDepartureOptions.length === 1 ? (
                    <label className="booking-field booking-field-full">
                      <input type="text" value={activeDepartureOptions[0]} readOnly />
                    </label>
                  ) : (
                    activeDepartureOptions.map((option) => (
                      <label className="booking-option-card" key={option}>
                        <input
                          type="radio"
                          name="departureOrigin"
                          value={option}
                          checked={formData.departureOrigin === option}
                          onChange={handleChange}
                        />
                        <span>{option}</span>
                      </label>
                    ))
                  )}
                </div>
              </label>

              <label className="booking-field">
                <span>Number of Tickets</span>
                <input type="number" min="1" max="20" name="tickets" value={formData.tickets} onChange={handleChange} required />
              </label>

              <label className="booking-field">
                <span>Pickup Location</span>
                <select name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} required>
                  {(activePickupOptions[formData.departureOrigin] || []).map((pickup) => (
                    <option value={pickup} key={pickup}>{pickup}</option>
                  ))}
                </select>
              </label>

              <label className="booking-field">
                <span>First Name</span>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </label>

              <label className="booking-field">
                <span>Last Name</span>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </label>

              <label className="booking-field booking-field-full">
                <span>Email Address</span>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </label>

              <label className="booking-field">
                <span>Contact Number</span>
                <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
              </label>

              <label className="booking-field">
                <span>Emergency Contact</span>
                <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} required />
              </label>

              <label className="booking-field booking-field-full booking-checkbox">
                <input type="checkbox" name="sameWhatsapp" checked={formData.sameWhatsapp} onChange={handleChange} />
                <span>This contact number is available on WhatsApp</span>
              </label>

              {!formData.sameWhatsapp && (
                <label className="booking-field booking-field-full">
                  <span>WhatsApp Number</span>
                  <input type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} required />
                </label>
              )}

              <label className="booking-field">
                <span>
                  Total Package Amount
                  <InfoTooltip text="This is the actual package value before tax. Manual direct bookings are saved with zero tax." />
                </span>
                <input type="number" min="0" name="totalPackageAmount" value={formData.totalPackageAmount} onChange={handleChange} required />
              </label>

              <label className="booking-field">
                <span>Amount Paid Now</span>
                <input type="number" min="0" name="amountPaidNow" value={formData.amountPaidNow} onChange={handleChange} required />
              </label>

              <label className="booking-field">
                <span>Payment Method</span>
                <select name="paymentOption" value={formData.paymentOption} onChange={handleChange} required>
                  {paymentMethods.map((option) => (
                    <option value={option} key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="booking-field">
                <span>Booking Status</span>
                <select name="bookingStatus" value={formData.bookingStatus} onChange={handleChange} required>
                  {statusOptions.map((option) => (
                    <option value={option} key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="booking-field booking-field-full">
                <span>Payment Reference / UPI ID</span>
                <input type="text" name="paymentReference" value={formData.paymentReference} onChange={handleChange} placeholder="UTR / UPI ref / cash note" />
              </label>

              <label className="booking-field booking-field-full">
                <span>Internal Notes</span>
                <textarea rows="3" name="notes" value={formData.notes} onChange={handleChange} placeholder="Any note for operations, pickup, approval, or special handling" />
              </label>
            </div>

            {additionalTravelers.length > 0 && (
              <div className="booking-extra-travelers">
                <div className="booking-section-heading">
                  <h2>Other Travelers</h2>
                  <p>Add the remaining traveler details for the extra tickets collected in the same payment.</p>
                </div>

                <div className="booking-traveler-stack">
                  {additionalTravelers.map((traveler, index) => (
                    <div className="booking-traveler-card" key={`manual-traveler-${index}`}>
                      <div className="booking-traveler-title">Traveler {index + 2}</div>
                      <div className="booking-grid">
                        <div className="booking-field booking-field-full">
                          <span>Joining Destination</span>
                          <div className="booking-radio-grid">
                            {activeDepartureOptions.length === 1 ? (
                              <label className="booking-field booking-field-full">
                                <input type="text" value={activeDepartureOptions[0]} readOnly />
                              </label>
                            ) : (
                              activeDepartureOptions.map((option) => (
                                <label className="booking-option-card" key={`${option}-${index}`}>
                                  <input
                                    type="radio"
                                    name={`traveler-departure-${index}`}
                                    value={option}
                                    checked={traveler.departureOrigin === option}
                                    onChange={(event) => handleTravelerChange(index, "departureOrigin", event.target.value)}
                                  />
                                  <span>{option}</span>
                                </label>
                              ))
                            )}
                          </div>
                        </div>

                        <label className="booking-field">
                          <span>First Name</span>
                          <input type="text" value={traveler.firstName} onChange={(event) => handleTravelerChange(index, "firstName", event.target.value)} required />
                        </label>

                        <label className="booking-field">
                          <span>Last Name</span>
                          <input type="text" value={traveler.lastName} onChange={(event) => handleTravelerChange(index, "lastName", event.target.value)} required />
                        </label>

                        <label className="booking-field">
                          <span>Mobile Number</span>
                          <input type="tel" value={traveler.mobileNumber} onChange={(event) => handleTravelerChange(index, "mobileNumber", event.target.value)} required />
                        </label>

                        <label className="booking-field">
                          <span>Email Address</span>
                          <input type="email" value={traveler.email} onChange={(event) => handleTravelerChange(index, "email", event.target.value)} required />
                        </label>

                        <label className="booking-field booking-field-full">
                          <span>Pickup Location</span>
                          <select value={traveler.pickupLocation} onChange={(event) => handleTravelerChange(index, "pickupLocation", event.target.value)} required>
                            {(activePickupOptions[traveler.departureOrigin] || []).map((pickup) => (
                              <option value={pickup} key={`${pickup}-${index}`}>{pickup}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="booking-summary-card">
            <div className="booking-section-heading">
              <h2>Manual Payment Summary</h2>
              <p>{bookingForm.manualFormNote}</p>
            </div>

            <div className="booking-summary-block">
              <div className="booking-summary-row">
                <span>Event</span>
                <strong>{formData.eventName || "Select event"}</strong>
              </div>
              <div className="booking-summary-row">
                <span>Total Package</span>
                <strong>₹{totalPackageAmount.toLocaleString("en-IN")}</strong>
              </div>
              <div className="booking-summary-row">
                <span>
                  Tax
                  <InfoTooltip text="Manual direct-payment bookings are stored with zero tax because payment was collected outside the website checkout." />
                </span>
                <strong>₹0</strong>
              </div>
              <div className="booking-summary-row">
                <span>Collected Now</span>
                <strong>₹{amountPaidNow.toLocaleString("en-IN")}</strong>
              </div>
              <div className="booking-summary-row booking-summary-total">
                <span>Remaining</span>
                <strong>₹{remainingAmount.toLocaleString("en-IN")}</strong>
              </div>
            </div>

            <div className="booking-payment-note">
              Saved as a direct manual booking entry. Customer, booking, transaction, and alerts all update together.
            </div>

            <div className="booking-summary-actions">
              <button type="submit" className="btn booking-primary-btn">
                Save Direct Booking
              </button>
              <Link to="/employee" className="btn booking-outline-btn">
                Back To Portal
              </Link>
            </div>
          </aside>
        </form>
      </div>
    </section>
  );
}
