import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";

/* ================= ADMIN / BACKEND ================= */
import AdminLogin    from "../backend/AdminLogin";
import AdminLayout   from "../backend/AdminLayout";
import Dashboard     from "../backend/Dashboard";
import ManageTreks   from "../backend/ManageTreks";
import ManageTours   from "../backend/ManageTours";
import ManageHeritage from "../backend/ManageHeritage";
import ManageCamping from "../backend/ManageCamping";
import ManageRentals      from "../backend/ManageRentals";
import ManageBookings     from "../backend/ManageBookings";
import ManageTransactions from "../backend/ManageTransactions";
import ManageCustomers    from "../backend/ManageCustomers";

/* ================= TREK PAGES ================= */
import Trek from "../pages/Treks/Trek";
import TrekDetails from "../pages/Treks/TrekDetails";
import Booking from "../pages/Booking/Booking";
import BookingSuccess from "../pages/Booking/BookingSuccess";

/* ================= TOUR PAGES ================= */
import Tours from "../pages/Tours/Tours";
import TourDetails from "../pages/Tours/TourDetails";

/* ================= HERITAGE PAGES ================= */
import Heritage from "../pages/HeritageWalk/Heritage";
import HeritageDetails from "../pages/HeritageWalk/HeritageDetails";

/* ================= CAMPING PAGES ================= */
import Camping from "../pages/Camping/Camping";

/* ================= RENTAL PAGES ================= */
import Rental from "../pages/Rentals/Rental";
import RentalDetails from "../pages/Rentals/RentalDetails";

function AppRoutes() {
  return (
    <Routes>
      {/* ================= MAIN PAGES ================= */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* ================= TREKS ================= */}
      <Route path="/treks" element={<Trek />} />
      <Route path="/treks/:id" element={<TrekDetails />} />
      <Route path="/book" element={<Booking />} />
      <Route path="/booking/success" element={<BookingSuccess />} />

      {/* ================= TOURS ================= */}
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:id" element={<TourDetails />} />

      {/* ================= HERITAGE ================= */}
      <Route path="/heritage" element={<Heritage />} />
      <Route path="/heritage/:id" element={<HeritageDetails />} />

      {/* ================= CAMPING ================= */}
      <Route path="/camping" element={<Camping />} />

      {/* ================= RENTALS ================= */}
      <Route path="/rentals" element={<Rental />} />
      <Route path="/rentals/:id" element={<RentalDetails />} />
      
      {/* ================= OTHER SERVICES ================= */}
      <Route
        path="/corporate"
        element={
          <h1 className="text-center mt-5">
            College Industrial Visits Opportunities
          </h1>
        }
      />

      {/* ================= ADMIN / BACKEND ================= */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/*" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="treks"     element={<ManageTreks />} />
        <Route path="tours"     element={<ManageTours />} />
        <Route path="heritage"  element={<ManageHeritage />} />
        <Route path="camping"      element={<ManageCamping />} />
        <Route path="rentals"      element={<ManageRentals />} />
        <Route path="bookings"     element={<ManageBookings />} />
        <Route path="transactions" element={<ManageTransactions />} />
        <Route path="customers"    element={<ManageCustomers />} />
      </Route>

    </Routes>
  );
}

export default AppRoutes;
