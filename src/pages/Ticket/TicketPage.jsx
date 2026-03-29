import { useSearchParams } from "react-router-dom";
import { getAllBookings } from "../../data/bookingStorage";
import HistoricTicket from "../../components/HistoricTicket";

export default function TicketPage() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const booking = getAllBookings().find(
    (b) => b.bookingId === bookingId || b.enhancedBookingId === bookingId
  ) ?? null;

  if (!bookingId) {
    return (
      <section className="fb-page">
        <div className="container py-5 text-center">
          <div style={{ fontSize: 48 }}>🎟</div>
          <h2 className="mt-3">No Booking ID Provided</h2>
          <p className="text-muted">
            Please access this page via <code>/ticket?bookingId=YOUR_ID</code>
          </p>
          <a href="/treks" className="btn btn-success mt-2">Explore Treks</a>
        </div>
      </section>
    );
  }

  if (!booking) {
    return (
      <section className="fb-page">
        <div className="container py-5 text-center">
          <div style={{ fontSize: 48 }}>⚠️</div>
          <h2 className="mt-3">Booking Not Found</h2>
          <p className="text-muted">
            No booking found for ID <code>{bookingId}</code>.
          </p>
          <a href="/" className="btn btn-outline-success mt-2">Go Home</a>
        </div>
      </section>
    );
  }

  return (
    <section className="fb-page" style={{ background: "#f1ede6", minHeight: "100vh", paddingTop: 40, paddingBottom: 60 }}>
      <HistoricTicket booking={booking} />
    </section>
  );
}
