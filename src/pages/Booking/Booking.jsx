import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { findTrekBySlug, slugifyTrekName } from "../../data/treks";
import { findOrCreateCustomer } from "../../data/customerStorage";
import { generateBookingId, saveBookingRecord } from "../../data/bookingStorage";
import { createTransaction } from "../../data/transactionStorage";

const paymentOptions = [
  "Debit Card / Credit Card",
  "UPI",
  "Net Banking",
  "Partial Payment",
];

const departureOptions = ["Pune", "Mumbai", "Kasara", "Base Village"];

const pickupOptions = {
  Pune: ["Shivajinagar", "Wakad", "Nigdi", "Katraj"],
  Mumbai: ["Dadar", "Thane", "Borivali", "Ghatkopar"],
  Kasara: ["Kasara Station", "Kasara Bus Stop"],
  "Base Village": ["Direct At Base Village", "Bari Village Meeting Point"],
};

const departureSurcharges = {
  Pune: 300,
  Mumbai: 400,
  Kasara: 150,
  "Base Village": 0,
};

const defaultTraveler = {
  firstName: "",
  lastName: "",
  mobileNumber: "",
  email: "",
  departureOrigin: "Base Village",
  pickupLocation: pickupOptions["Base Village"][0],
};

function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadFile(url, filename) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const selectedTrek =
    location.state?.trek ??
    (location.state?.trekSlug ? findTrekBySlug(location.state.trekSlug) : null);

  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consent, setConsent] = useState({
    rulesAccepted: false,
    fitnessAccepted: false,
    cancellationAccepted: false,
  });
  const [formData, setFormData] = useState({
    tickets: 1,
    departureOrigin: "Base Village",
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    sameWhatsapp: false,
    whatsappNumber: "",
    dob: "",
    pickupLocation: pickupOptions["Base Village"][0],
    emergencyContact: "",
    paymentOption: paymentOptions[0],
  });
  const [additionalTravelers, setAdditionalTravelers] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const extraTravelerCount = Math.max(0, Number(formData.tickets) - 1);

    setAdditionalTravelers((current) => {
      if (current.length === extraTravelerCount) {
        return current;
      }

      if (current.length < extraTravelerCount) {
        return [
          ...current,
          ...Array.from(
            { length: extraTravelerCount - current.length },
            () => ({ ...defaultTraveler })
          ),
        ];
      }

      return current.slice(0, extraTravelerCount);
    });
  }, [formData.tickets]);

  const ticketCount = Number(formData.tickets) || 1;
  const travelerPricing = [
    {
      departureOrigin: formData.departureOrigin,
      amount:
        (selectedTrek?.price ?? 0) + (departureSurcharges[formData.departureOrigin] ?? 0),
    },
    ...additionalTravelers.map((traveler) => ({
      departureOrigin: traveler.departureOrigin,
      amount:
        (selectedTrek?.price ?? 0) + (departureSurcharges[traveler.departureOrigin] ?? 0),
    })),
  ];

  const baseAmount = travelerPricing.reduce((sum, traveler) => sum + traveler.amount, 0);
  const partialAmount = 200 * ticketCount;
  const taxAmount = Math.round(baseAmount * 0.05);
  const totalAmount = baseAmount + taxAmount;
  const payableNow =
    formData.paymentOption === "Partial Payment" ? partialAmount + taxAmount : totalAmount;
  const remainingAmount =
    formData.paymentOption === "Partial Payment" ? totalAmount - payableNow : 0;

  const allConsentsAccepted = useMemo(
    () => Object.values(consent).every(Boolean),
    [consent]
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "departureOrigin"
        ? { pickupLocation: pickupOptions[value][0] }
        : {}),
      ...(name === "sameWhatsapp" && checked ? { whatsappNumber: "" } : {}),
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
                ? { pickupLocation: pickupOptions[value][0] }
                : {}),
            }
          : traveler
      )
    );
  };

  const handleConsentChange = (event) => {
    const { name, checked } = event.target;
    setConsent((current) => ({
      ...current,
      [name]: checked,
    }));
  };

  const openConsentModal = () => {
    if (!formRef.current?.reportValidity()) {
      return;
    }
    setShowConsentModal(true);
  };

  const closeConsentModal = () => {
    setShowConsentModal(false);
  };

  const downloadItinerary = () => {
    if (!selectedTrek) {
      return;
    }

    if (selectedTrek.name === "Kalsubai Trek") {
      downloadFile(
        "/itineraries/kalsubai-trek-gadvede.pdf",
        "gadvede-kalsubai-trek-itinerary.pdf"
      );
      return;
    }

    const itinerary = [
      "Gadvede Trekkers Itinerary",
      "-------------------------",
      `Trek: ${selectedTrek.name}`,
      `Location: ${selectedTrek.location}`,
      `Duration: ${selectedTrek.duration}`,
      `Altitude: ${selectedTrek.altitude}`,
      `Next Batch Date: ${selectedTrek.nextDate}`,
      `Starting Price: INR ${selectedTrek.price}`,
      "",
      "Payment Note:",
      "- 5% tax applicable on every booking",
      "- For partial payment, INR 200 per seat is collected now",
      "- Remaining amount can be paid one day before the trek",
    ].join("\n");

    downloadTextFile(`${slugifyTrekName(selectedTrek.name)}-itinerary.txt`, itinerary);
  };

  const handleSubmit = () => {
    if (!selectedTrek || !allConsentsAccepted) {
      return;
    }

    const bookingId = `GTK-${Date.now().toString().slice(-8)}`;
    const bookingRecord = {
      bookingId,
      trekName: selectedTrek.name,
      trekLocation: selectedTrek.location,
      trekSlug: slugifyTrekName(selectedTrek.name),
      tickets: ticketCount,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      departureOrigin: formData.departureOrigin,
      contactNumber: formData.contactNumber,
      whatsappNumber: formData.sameWhatsapp ? formData.contactNumber : formData.whatsappNumber,
      dob: formData.dob,
      pickupLocation: formData.pickupLocation,
      emergencyContact: formData.emergencyContact,
      paymentOption: formData.paymentOption,
      baseAmount,
      taxAmount,
      totalAmount,
      payableNow,
      remainingAmount,
      bookingDate: new Date().toLocaleString("en-IN"),
      nextDate: selectedTrek.nextDate,
      additionalTravelers,
      travelerPricing,
      consent,
    };

    localStorage.setItem("latestBooking", JSON.stringify(bookingRecord));

    /* ── Additive: persist customer + booking + transaction ── */
    const _paymentModeMap = {
      "Debit Card / Credit Card": "CARD",
      "UPI": "UPI",
      "Net Banking": "NET BANK",
      "Partial Payment": "Partial",
    };
    const _customer = findOrCreateCustomer({
      name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.contactNumber,
      email: formData.email,
    });
    const _enhancedId = generateBookingId();
    saveBookingRecord({ ...bookingRecord, enhancedBookingId: _enhancedId, customerId: _customer.id });
    createTransaction({
      bookingId:         bookingId,
      customerId:        _customer.id,
      customerName:      _customer.name,
      paymentMode:       _paymentModeMap[formData.paymentOption] || "UPI",
      grossAmount:       payableNow,
      tax:               taxAmount,
      netAmount:         baseAmount,
      transactionStatus: "SUCCESS",
    });
    /* ── end additive block ── */

    navigate("/booking/success", {
      state: {
        booking: bookingRecord,
      },
    });
  };

  if (!selectedTrek) {
    return (
      <section className="booking-page">
        <div className="container py-5">
          <div className="booking-success-card text-center">
            <h1>Select A Trek First</h1>
            <p>Please choose a trek from the trek listing before continuing to booking.</p>
            <Link to="/treks" className="btn booking-primary-btn">
              Back to Treks
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="booking-page">
      <div className="container py-4 py-md-5">
        <div className="booking-hero">
          <div>
            <span className="booking-kicker">Secure Trek Booking</span>
            <h1>Payment And Traveler Details</h1>
            <p>
              Your trek is locked to the selected destination. Add each traveler and choose where they want to join from.
            </p>
          </div>

          <div className="booking-hero-card">
            <div className="booking-hero-label">Selected Destination</div>
            <h2>{selectedTrek.name}</h2>
            <p>{selectedTrek.location}</p>
          </div>
        </div>

        <form ref={formRef} className="booking-layout">
          <div className="booking-form-card">
            <div className="booking-section-heading">
              <h2>Lead Traveler Details</h2>
              <p>The selected trek is fixed based on the trek the customer clicked.</p>
            </div>

            <div className="booking-grid">
              <label className="booking-field booking-field-full">
                <span>Destination Trek</span>
                <input type="text" value={selectedTrek.name} readOnly />
              </label>

              <div className="booking-field booking-field-full">
                <span>Joining Destination</span>
                <div className="booking-radio-grid">
                  {departureOptions.map((option) => (
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
                  ))}
                </div>
              </div>

              <label className="booking-field">
                <span>Number of Tickets</span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  name="tickets"
                  value={formData.tickets}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="booking-field">
                <span>Date of Birth</span>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="booking-field">
                <span>First Name</span>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="booking-field">
                <span>Last Name</span>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="booking-field booking-field-full">
                <span>Email Address</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="booking-field">
                <span>Contact Number</span>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="booking-field">
                <span>Emergency Contact Number</span>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="booking-field booking-field-full booking-checkbox">
                <input
                  type="checkbox"
                  name="sameWhatsapp"
                  checked={formData.sameWhatsapp}
                  onChange={handleChange}
                  required
                />
                <span>This contact number is available on WhatsApp</span>
              </label>

              {!formData.sameWhatsapp && (
                <label className="booking-field booking-field-full">
                  <span>WhatsApp Number</span>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    required={!formData.sameWhatsapp}
                  />
                </label>
              )}

              <label className="booking-field booking-field-full">
                <span>Pickup Location</span>
                <select
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  required
                >
                  {pickupOptions[formData.departureOrigin].map((pickup) => (
                    <option value={pickup} key={pickup}>
                      {pickup}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {additionalTravelers.length > 0 && (
              <div className="booking-extra-travelers">
                <div className="booking-section-heading">
                  <h2>Other Travelers</h2>
                  <p>For every extra ticket, add first name, last name, mobile number, email, joining destination, and pickup location.</p>
                </div>

                <div className="booking-traveler-stack">
                  {additionalTravelers.map((traveler, index) => (
                    <div className="booking-traveler-card" key={`traveler-${index}`}>
                      <div className="booking-traveler-title">
                        Traveler {index + 2}
                      </div>

                      <div className="booking-grid">
                        <div className="booking-field booking-field-full">
                          <span>Joining Destination</span>
                          <div className="booking-radio-grid">
                            {departureOptions.map((option) => (
                              <label className="booking-option-card" key={`${option}-${index}`}>
                                <input
                                  type="radio"
                                  name={`traveler-departure-${index}`}
                                  value={option}
                                  checked={traveler.departureOrigin === option}
                                  onChange={(event) =>
                                    handleTravelerChange(index, "departureOrigin", event.target.value)
                                  }
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <label className="booking-field">
                          <span>First Name</span>
                          <input
                            type="text"
                            value={traveler.firstName}
                            onChange={(event) =>
                              handleTravelerChange(index, "firstName", event.target.value)
                            }
                            required
                          />
                        </label>

                        <label className="booking-field">
                          <span>Last Name</span>
                          <input
                            type="text"
                            value={traveler.lastName}
                            onChange={(event) =>
                              handleTravelerChange(index, "lastName", event.target.value)
                            }
                            required
                          />
                        </label>

                        <label className="booking-field">
                          <span>Mobile Number</span>
                          <input
                            type="tel"
                            value={traveler.mobileNumber}
                            onChange={(event) =>
                              handleTravelerChange(index, "mobileNumber", event.target.value)
                            }
                            required
                          />
                        </label>

                        <label className="booking-field">
                          <span>Email Address</span>
                          <input
                            type="email"
                            value={traveler.email}
                            onChange={(event) =>
                              handleTravelerChange(index, "email", event.target.value)
                            }
                            required
                          />
                        </label>

                        <label className="booking-field booking-field-full">
                          <span>Pickup Location</span>
                          <select
                            value={traveler.pickupLocation}
                            onChange={(event) =>
                              handleTravelerChange(index, "pickupLocation", event.target.value)
                            }
                            required
                          >
                            {pickupOptions[traveler.departureOrigin].map((pickup) => (
                              <option value={pickup} key={`${pickup}-${index}`}>
                                {pickup}
                              </option>
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
              <h2>Payment Summary</h2>
              <p>5% tax is applied on every booking.</p>
            </div>

            <div className="booking-summary-block">
              <div className="booking-summary-row">
                <span>Trek</span>
                <strong>{selectedTrek.name}</strong>
              </div>
              <div className="booking-summary-row">
                <span>Tickets</span>
                <strong>{ticketCount}</strong>
              </div>
              <div className="booking-summary-row">
                <span>Traveler Total</span>
                <strong>₹{baseAmount}</strong>
              </div>
              <div className="booking-summary-row">
                <span>Tax (5%)</span>
                <strong>₹{taxAmount}</strong>
              </div>
              <div className="booking-summary-row booking-summary-total">
                <span>Total</span>
                <strong>₹{totalAmount}</strong>
              </div>
            </div>

            <div className="booking-traveler-fares">
              <span className="booking-subtitle">Fare By Joining Point</span>
              {travelerPricing.map((traveler, index) => (
                <div className="booking-summary-row" key={`${traveler.departureOrigin}-${index}`}>
                  <span>
                    {index === 0 ? "Lead Traveler" : `Traveler ${index + 1}`} from {traveler.departureOrigin}
                  </span>
                  <strong>₹{traveler.amount}</strong>
                </div>
              ))}
            </div>

            <div className="booking-payment-options">
              <span className="booking-subtitle">Payment Option</span>
              {paymentOptions.map((option) => (
                <label className="booking-radio" key={option}>
                  <input
                    type="radio"
                    name="paymentOption"
                    value={option}
                    checked={formData.paymentOption === option}
                    onChange={handleChange}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>

            {formData.paymentOption === "Partial Payment" && (
              <div className="booking-payment-note">
                Pay ₹200 per ticket now. Remaining ₹{remainingAmount} can be paid one day before the trek.
              </div>
            )}

            <div className="booking-payable-now">
              <span>Pay Now</span>
              <strong>₹{payableNow}</strong>
            </div>

            <div className="booking-summary-actions">
              <button
                type="button"
                className="btn booking-outline-btn"
                onClick={downloadItinerary}
              >
                Download Itinerary
              </button>

              <button
                type="button"
                className="btn booking-primary-btn"
                onClick={openConsentModal}
              >
                Complete Payment
              </button>
            </div>

            <p className="booking-email-note">
              Ticket email delivery still needs backend email integration. The front-end booking and ticket flow is ready, but actual email sending is not configured yet.
            </p>

            <Link to="/treks" className="booking-back-link">
              Back To Treks
            </Link>
          </aside>
        </form>
      </div>

      {showConsentModal && (
        <div className="booking-modal-backdrop" onClick={closeConsentModal}>
          <div
            className="booking-consent-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="booking-section-heading">
              <h2>Mandatory Consent</h2>
              <p>You must accept all three points before the payment is completed.</p>
            </div>

            <div className="booking-consent-list">
              <label className="booking-checkbox booking-consent-item">
                <input
                  type="checkbox"
                  name="rulesAccepted"
                  checked={consent.rulesAccepted}
                  onChange={handleConsentChange}
                />
                <span>I have read and accepted the trek rules, safety instructions, and reporting time.</span>
              </label>

              <label className="booking-checkbox booking-consent-item">
                <input
                  type="checkbox"
                  name="fitnessAccepted"
                  checked={consent.fitnessAccepted}
                  onChange={handleConsentChange}
                />
                <span>I confirm that I and my group members are medically fit for this trek activity.</span>
              </label>

              <label className="booking-checkbox booking-consent-item">
                <input
                  type="checkbox"
                  name="cancellationAccepted"
                  checked={consent.cancellationAccepted}
                  onChange={handleConsentChange}
                />
                <span>I understand the cancellation policy, tax applicability, and partial payment conditions.</span>
              </label>
            </div>

            <div className="booking-summary-actions">
              <button
                type="button"
                className="btn booking-outline-btn"
                onClick={closeConsentModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn booking-primary-btn"
                disabled={!allConsentsAccepted}
                onClick={() => {
                  closeConsentModal();
                  handleSubmit();
                }}
              >
                Accept And Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Booking;
