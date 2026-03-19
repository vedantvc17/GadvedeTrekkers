import { Link, useLocation } from "react-router-dom";

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

function BookingSuccess() {
  const location = useLocation();
  const storedBooking = localStorage.getItem("latestBooking");
  const booking =
    location.state?.booking ?? (storedBooking ? JSON.parse(storedBooking) : null);

  const downloadTicket = () => {
    if (!booking) {
      return;
    }

    const ticket = [
      "Gadvede Trekkers Booking Ticket",
      "===============================",
      `Booking ID: ${booking.bookingId}`,
      `Customer: ${booking.firstName} ${booking.lastName}`,
      `Trek: ${booking.trekName}`,
      `Location: ${booking.trekLocation}`,
      `Trek Date: ${booking.nextDate}`,
      `Tickets: ${booking.tickets}`,
      `Pickup Location: ${booking.pickupLocation}`,
      `Contact Number: ${booking.contactNumber}`,
      `WhatsApp Number: ${booking.whatsappNumber}`,
      `Emergency Contact: ${booking.emergencyContact}`,
      `Payment Option: ${booking.paymentOption}`,
      `Total Paid Now: INR ${booking.payableNow}`,
      `Remaining Amount: INR ${booking.remainingAmount}`,
      `Booked On: ${booking.bookingDate}`,
    ].join("\n");

    downloadTextFile(`${booking.bookingId}-ticket.txt`, ticket);
  };

  if (!booking) {
    return (
      <section className="booking-page">
        <div className="container py-5">
          <div className="booking-success-card text-center">
            <h1>No Booking Found</h1>
            <p>Your booking summary is not available right now.</p>
            <Link to="/book" className="btn booking-primary-btn">
              Go to Booking Page
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="booking-page">
      <div className="container py-4 py-md-5">
        <div className="booking-success-card">
          <span className="booking-success-badge">
            Payment Successful
          </span>
          <h1>Congratulations, Your Trek Is Booked!</h1>
          <p>
            Your seat has been reserved successfully. You can review the booking details below and download your ticket right away.
          </p>

          <div className="booking-success-grid">
            <div className="booking-success-panel">
              <h2>Booking Details</h2>
              <div className="booking-success-row">
                <span>Booking ID</span>
                <strong>{booking.bookingId}</strong>
              </div>
              <div className="booking-success-row">
                <span>Destination Trek</span>
                <strong>{booking.trekName}</strong>
              </div>
              <div className="booking-success-row">
                <span>Trek Date</span>
                <strong>{booking.nextDate}</strong>
              </div>
              <div className="booking-success-row">
                <span>Tickets</span>
                <strong>{booking.tickets}</strong>
              </div>
              <div className="booking-success-row">
                <span>Joining From</span>
                <strong>{booking.departureOrigin}</strong>
              </div>
              <div className="booking-success-row">
                <span>Pickup Location</span>
                <strong>{booking.pickupLocation}</strong>
              </div>
              <div className="booking-success-row">
                <span>Payment Option</span>
                <strong>{booking.paymentOption}</strong>
              </div>
              <div className="booking-success-row">
                <span>Amount Paid</span>
                <strong>₹{booking.payableNow}</strong>
              </div>
            </div>

            <div className="booking-success-panel">
              <h2>Traveler</h2>
              <div className="booking-success-row">
                <span>Name</span>
                <strong>{booking.firstName} {booking.lastName}</strong>
              </div>
              <div className="booking-success-row">
                <span>Email</span>
                <strong>{booking.email}</strong>
              </div>
              <div className="booking-success-row">
                <span>Contact</span>
                <strong>{booking.contactNumber}</strong>
              </div>
              <div className="booking-success-row">
                <span>WhatsApp</span>
                <strong>{booking.whatsappNumber}</strong>
              </div>
              <div className="booking-success-row">
                <span>Emergency Contact</span>
                <strong>{booking.emergencyContact}</strong>
              </div>
              <div className="booking-success-row">
                <span>Remaining Amount</span>
                <strong>₹{booking.remainingAmount}</strong>
              </div>
            </div>
          </div>

          {booking.additionalTravelers?.length > 0 && (
            <div className="booking-success-panel booking-success-extra">
              <h2>Additional Travelers</h2>
              {booking.additionalTravelers.map((traveler, index) => (
                <div className="booking-success-row" key={`traveler-${index}`}>
                  <span>Traveler {index + 2}</span>
                  <strong>
                    {traveler.firstName} {traveler.lastName} | {traveler.departureOrigin} | {traveler.pickupLocation}
                  </strong>
                </div>
              ))}
            </div>
          )}

          <div className="booking-success-actions">
            <button className="btn booking-primary-btn" onClick={downloadTicket}>
              Download Ticket
            </button>
            <Link to="/treks" className="btn booking-outline-btn">
              Explore More Treks
            </Link>
          </div>

          <p className="booking-email-note">
            Email ticket delivery is prepared in the flow, but actual email sending still needs a backend email service or provider credentials.
          </p>
        </div>
      </div>
    </section>
  );
}

export default BookingSuccess;
